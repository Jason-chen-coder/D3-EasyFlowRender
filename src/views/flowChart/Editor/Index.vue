/**
!!!重要   确保视图中同时只存在一个本控件，如果实在要使用多个，可以用v-if，使得多个控件不同时使用   !!!
!!!重要   确保在init此控件的时候，html中父元素有height和width，否则无法显示   !!!

使用的antv G6的版本3.2.8
节点的图形是模仿的腾讯蓝鲸的标准运维里面的某一个版本，有部分改动

隐藏功能：
     按住shift进行框选
     按住shift进行多选
     选择节点以后可以按上、下、左、右、delete、ctrl+c、ctrl+v等键进行微调节点位置、删除节点、复制、粘贴节点等
     ctrl+z进行撤销
     ctrl+y进行重做
     右击节点、连线可以进行呼出菜单（删除等）
     鼠标移到连线的两端按下并拖到正确的位置，可以更改连线的起始点、结束点的锚点
     可以在commonConfig.js里面设置deleteByIcon是否显示删除图标（红底白色的X）(如果删除图标有错位，可以在每个自定义的节点里面设置，改用图片的删除图标)
     可以在自定义节点里面配置节点的连入的线和连出的线的数量  inEdgeNum,outEdgeNum


组件使用说明：
props：mode,showGrid,nodes,edges  参数都是非必传
showGrid: 是否显示网格   取值true,false 注意:如果设置了背景色，则网格可能无法正确显示
mode:  工作模式  字符   取值范围:'view','edit'
nodes:节点数组
  id:                 id            字符   必传
  type:               节点类型       字符   必传    取值范围:'start','end','userTask','exclusiveGateway' 对应'customStartNode','customEndNode','customToolNode','customBranchNode','customParallelNode'
  x:                  x坐标          数字   必传
  y:                  y坐标          数字   必传
  title:              节点的title    字符   非必传
edges:连线的数组
  id:             id
  source:             起始节点的id    字符   必传
  target:             结束节点的id    字符   必传
  type:               连线的类型      字符   非必传  取值范围:'polyLine'
  sourceAnchorIndex:  起始的锚点index 数字   非必传  取值范围:0-3
  targetAnchorIndex:  结束的锚点index 数字   非必传  取值范围:0-3
  title:              连线的title     字符   非必传


通知父组件的事件emitEvent:
openNodeConfig       参数:nodeId        节点id  双击节点事件
openEdgeConfig       参数:edgeId        连线id   双击连线事件


提供的父组件调用的方法：
init()  初始化画布   确保调用方法前显示画布的视图已经加载完成！！！！！
destoryG6()  销毁画布   确保视图中只有一个画布
clear()  清空节点连线的数据
screenfull() 全屏
setMode(mode)  设置mode
getNodesConfig() 获取所有节点配置信息
getNodeConfigById(id)  获取节点配置信息
getEdgesConfig() 获取所有连线配置信息
getEdgeConfigById(id)  获取连线配置信息
updateNodeConfig(node) 修改节点的配置信息（设置的信息，获取的时候会原样返回）   参数:node:{...}
updateEdgeConfig(edge) 修改连线的配置信息（设置的信息，获取的时候会原样返回）   参数：edge:{...}
resetNodesAndEdges(nodes, edges)  重新设置节点和连线 参数:nodes:[{...}]  edges:[{...}]

*/


<template>
  <div id="flowchart" style="width: 100%;height: 100%; display: flex;">
<!--    <ToolBar></ToolBar>-->
      <ContextMenu/>
      <div v-if="currentMode==='edit'">
      <PanelLeft></PanelLeft>
    </div>
    <div id="sketchpad" ref="sketchpad" style="width:100%;height:100%;"></div>
  </div>
</template>

<script>
    import registerCustom from "./custom/index";
    import PanelLeft from './containers/PanelLeft'
    import ContextMenu from "./containers/ContextMenu";
    import G6 from '@antv/g6';
    import eventBus from "./utils/eventBus";
    import Grid from '@antv/g6/build/grid'
    import screenfull from 'screenfull'
    import {initBehavors, clearTempState} from "./behavior";
    import {getNodeToolTip, deepCopy, generateUUID, isArrayEqual} from "./utils/commonCaculate"
    import Stack from "./utils/customStack"
    import commonConfig from "./config/commonConfig";
    import Minimap from "@antv/g6/build/minimap";// 全屏

    const defaultNodes = [
        {id: 'start', type: 'start', shape: 'customStartNode', x: 0, y: 200, title: '开始'},
        {id: 'end', type: 'end', shape: 'customEndNode', x: 200, y: 550, title: '结束'},
    ];


    export default {
        name: 'MaterialsEditor',
        components: {
            PanelLeft, ContextMenu
        },
        props: {
            nodes: {
                type: Array,
                default: function () {
                    return defaultNodes;
                }
            },
            edges: {
                type: Array,
                default: function () {
                    return [];
                }
            },
            mode: {
                type: String,
                default: 'edit'
            },
            showGrid:{
                type: Boolean,
                default: false
            }
        },

        data() {
            return {
                currentMode: this.mode,
                isGridShow:this.showGrid,
                editor: null,
                editDatas: {
                    nodes: this.nodes,
                    edges: this.edges
                },
                undoStack: null,//操作栈（如果最新的操作是移动节点，且ids相同，则不新增）
                redoStack: null,
                /*栈的元数据
                方式一：只存增量代码 复杂点
                 {
                     operation:'' //add,delete,clear（清空）,update,move(单独加一个move是为了方便将微调和拖动节点的一系列合并起来，不然会有太多的操作)
                     ids:[],
                     data:[{id:''}]//操作前的json数据（增加的话是新增的json数据）
                 }

                 方式二：存全量  会不会存在性能问题，要不要限制栈的长度
                 {
                 data:[]
                 }
                 */
            }
        },

        methods: {

            init() {
                let _t = this;
                if(_t.editor !== null){
                    return
                }
                // 画板
                let sketchpad = _t.$el.querySelector('#sketchpad');
                if(sketchpad == null || sketchpad.clientWidth==null || sketchpad.clientWidth<=0
                    || sketchpad.clientHeight==null || sketchpad.clientHeight<=0){
                    //界面还没有。不能去初始化画布
                    _t.log('界面还未加载，不能初始化画布');
                    return;
                }
                _t.log('init  ');

                initBehavors();
                _t.handleDatas();
                _t.undoStack = new Stack();
                _t.redoStack = new Stack();
                const plugins = [];
                if(_t.isGridShow){
                    plugins.push(new Grid());//把背景色去掉就能看到网格了
                }
                // 生成编辑器实例
                _t.editor = new G6.Graph({
                    plugins: plugins,
                    container: sketchpad,
                    width: sketchpad.clientWidth,
                    height: sketchpad.clientHeight,// _t.editor.changeSize(400,200);
                    fitView: true,
                    fitViewPadding: 20,
                    minZoom: 0.4,
                    maxZoom: 1.5,
                    // 模式
                    modes: {
                        view: [
                            {
                                type: 'drag-canvas',//x和y两个方向都可以拖拽画布
                                direction: 'both',
                            }, {
                                type: 'zoom-canvas',//缩放画布，灵敏度1
                                sensitivity: 1
                            },
                            {
                                type: 'tooltip', // 提示框
                                formatText(model) {
                                    return getNodeToolTip(model.title);
                                },
                            },

                        ],
                        edit: [
                            {
                                type: 'tooltip', // 提示框
                                formatText(model) {
                                    return getNodeToolTip(model.title);
                                },
                            },
                            {
                                type: 'edit-control',
                            },
                            {
                                type: 'brush-select',
                                includeEdges: false,
                            },
                            {
                                type: 'click-select',//点击选中节点，再次点击节点或点击 Canvas 取消选中状态；
                                // trigger: 'ctrl',//设置了ctrl也不行，用shift可以
                            },
                            {
                                type: 'drag-canvas',//x和y两个方向都可以拖拽画布
                                direction: 'both',
                            },
                            {
                                type: 'zoom-canvas',//缩放画布，灵敏度1
                                sensitivity: 1
                            },
                            {
                                type: 'drag-node',//拖拽节点
                                delegateStyle: {strokeOpacity: 0.6, fillOpacity: 0.6},//节点拖拽时的绘图属性
                                updateEdge: true,//是否在拖拽节点时更新所有与之相连的边，默认为 true 。
                                enableDelegate: false//拖动过程中是否使用方框代替元素的直接移动
                            }
                        ]
                        , addEdge: ["add-edge"],
                    },
                });
                registerCustom(_t.editor);
                // 挂载G6配置
                _t.editor.$C = G6.$C;
                // 设置模式为编辑
                _t.editor.setMode(_t.currentMode);
                // 绑定事件


                _t.editor.on('node:dblclick', function (event) {
                    _t.doubleClickEvent('node', event.item._cfg.id);
                });
                _t.editor.on('edge:dblclick', function (event) {

                    _t.doubleClickEvent('edge', event.item._cfg.id);

                });
                _t.editor.on('canvas:mouseout', function (event) {
                    _t.doClearTempState();
                });
                _t.editor.on('mouseup', function (event) {//这个不能放edit-control里面，不然会和多选冲突
                    _t.editor.emit('customMouseUp', event);
                });
                _t.editor.on('mousedown', function (event) {
                    eventBus.$emit('hideContextMenu', null);
                });

                _t.editor.data(deepCopy(_t.editDatas));
                // 渲染初始数据
                _t.editor.render();

            },

            /*
            鼠标移出画布，或者切换模式
            */
            doClearTempState() {
                this.log('doClearTempState  ');
                clearTempState(this.editor);
            },
            handleContextMenu(info){
                if(info.type === 'node' && (info.id === 'start' || info.id === 'end')){
                    return;//开始 结束节点不能删除
                }
                let rect = this.$refs.sketchpad.getBoundingClientRect();
                // console.log('距离 x:'+rect.left+'   y:'+rect.top)
                info.x = info.x + rect.left;
                info.y = info.y + rect.top;
                // console.log(JSON.stringify(info))
                eventBus.$emit('showContextMenu', info);
            },
            beforeAddNode(type) {

                if (type == null) {
                    return;
                }
                let _t = this;

                _t.log('beforeAddNode  ' + type);
                let node = {
                    id: 'node_' + type + '_' + generateUUID(),
                    shape: _t.getNodeShapeFromType(type),
                    type: type,
                    title: _t.getDefaultTitleFromType(type)
                };
                if (type === 'userTask') {
                    node.unConfigured = true;
                }
                _t.editor.emit('customAddNode', node)
            },
            addNodeData(item) {
                let _t = this;
                _t.log('addNodeData  ' + JSON.stringify(item));
                _t.editDatas.nodes.push(item);
                let element = {
                    operation: 'add',
                    data_pre: {
                        nodeIds: [],
                        nodes: [],
                        edgeIds:[],
                        edges:[]
                    },
                    data_now: {
                        nodeIds: [item.id],
                        nodes: [item],
                        edgeIds:[],
                        edges:[]
                    },
                };
                _t.undoStack.push(deepCopy(element));
                _t.redoStack.clear();
            },
            doAddEdge(info) {
                let _t = this;
                info.id = 'edge_' + generateUUID();
                info.shape = 'customPolyEdge';
                info.type = 'polyLine';
                _t.log('doAddEdge  ' + JSON.stringify(info));
                _t.editor.addItem('edge', deepCopy(info));
                _t.editDatas.edges.push(info);
                let element = {
                    operation: 'add',
                    data_pre: {
                        nodeIds: [],
                        nodes: [],
                        edgeIds:[],
                        edges:[]
                    },
                    data_now: {
                        nodeIds: [],
                        nodes: [],
                        edgeIds:[info.id],
                        edges:[info]
                    },
                };
                _t.undoStack.push(deepCopy(element));
                _t.redoStack.clear();
            },
            doChangeEdge(info) {
                let _t = this;
                _t.log('doChangeEdge  ' + JSON.stringify(info));
                for (let i = 0; i < _t.editDatas.edges.length; i++) {
                    if (_t.editDatas.edges[i].id === info.id) {
                        let edge = {
                            ..._t.editDatas.edges[i],
                            ...info
                        };
                        delete edge.startPointOffset;
                        delete edge.endPointOffset;
                        let element = {
                            operation: 'update',
                            data_pre: {
                                nodeIds: [],
                                nodes: [],
                                edgeIds:[info.id],
                                edges:[_t.editDatas.edges[i]]
                            },
                            data_now: {
                                nodeIds: [],
                                nodes: [],
                                edgeIds:[info.id],
                                edges:[edge]
                            },
                        };
                        _t.undoStack.push(deepCopy(element));
                        _t.redoStack.clear();
                        _t.editDatas.edges[i] = edge;
                        _t.editor.addItem('edge', deepCopy(edge));
                        break;
                    }
                }
            },

            deleteItem(info) {
                let _t = this;
                _t.log('deleteItem  ' + JSON.stringify(info));
                if (info && info.ids && info.ids instanceof Array && info.type) {
                    let deleteNodeIndexs = [];
                    let deleteEdgeIndexs = [];

                    let nodes = [];
                    let nodeIds = [];
                    let edges = [];
                    let edgeIds = [];
                    if (info.type === 'edge') {
                        info.ids.forEach(id => {
                            for (let i = 0; i < _t.editDatas.edges.length; i++) {
                                if (id === _t.editDatas.edges[i].id) {
                                    edgeIds.push(id);
                                    edges.push(_t.editDatas.edges[i]);
                                    deleteEdgeIndexs.push(i);
                                    _t.editor.removeItem(id);
                                    break;
                                }
                            }
                        });
                    } else if (info.type === 'node') {
                        info.ids.forEach(id => {
                            if (id === 'start' || id === 'end') {
                            } else {
                                for (let i = 0; i < _t.editDatas.nodes.length; i++) {
                                    if (id === _t.editDatas.nodes[i].id) {
                                        nodeIds.push(id);
                                        nodes.push(_t.editDatas.nodes[i]);
                                        deleteNodeIndexs.push(i);
                                        _t.editor.removeItem(id);
                                        break;
                                    }
                                }
                            }
                        });
                        for (let i = 0; i < _t.editDatas.edges.length; i++) {
                            if (nodeIds.indexOf(_t.editDatas.edges[i].source) > -1
                                || nodeIds.indexOf(_t.editDatas.edges[i].target) > -1) {
                                deleteEdgeIndexs.push(i);
                                edgeIds.push(_t.editDatas.edges[i].id);
                                edges.push(_t.editDatas.edges[i]);
                            }
                        }
                    }
                    let element = deepCopy({
                        operation: 'delete',
                        data_pre: {
                            nodeIds: nodeIds,
                            nodes: nodes,
                            edgeIds: edgeIds,
                            edges: edges
                        },
                        data_now: {
                            nodeIds: [],
                            nodes: [],
                            edgeIds:[],
                            edges:[]
                        },
                    });
                    _t.deleteEditDataByIndex(deleteNodeIndexs, deleteEdgeIndexs);
                    let aa = _t.editDatas;
                    _t.undoStack.push(element);
                    _t.redoStack.clear();
                }
            },
            //拖动或者微调节点位置
            moveItem(info) {
                let _t = this;
                _t.log('moveItem  ' + JSON.stringify(info));

                let latestElement = _t.undoStack.peek();
                _t.redoStack.clear();
                if (latestElement && latestElement.operation === 'move' && isArrayEqual(info.ids, latestElement.data_pre.nodeIds)) {
                    return;//判断操作栈的最后一个操作是move，并且ids相同，则不push到操作栈
                }
                let nodes_pre = [];
                let nodes_now = [];
                let nodeIds = [];
                for (let i = 0; i < info.ids.length; i++) {
                    for (let j = 0; j < _t.editDatas.nodes.length; j++) {
                        let node = _t.editDatas.nodes[j];
                        if (node.id === info.ids[i]) {
                            nodeIds.push(info.ids[i]);
                            nodes_pre.push(deepCopy(node));
                            node.x = info.coordinates[i].x;
                            node.y = info.coordinates[i].y;
                            _t.editDatas.nodes[j] = node;
                            nodes_now.push(deepCopy(node));
                            break;
                        }
                    }
                }
                let element = {
                    operation: 'move',
                    data_pre: {
                        nodeIds: nodeIds,
                        nodes: nodes_pre,
                        edgeIds: [],
                        edges: []
                    },
                    data_now: {
                        nodeIds: nodeIds,
                        nodes: nodes_now,
                        edgeIds: [],
                        edges: []
                    },
                };
                _t.undoStack.push(element);
            },
            //复制粘贴
            copyAndPasteNodes(ids){
                let _t = this;
                _t.log('copyAndPasteNodes  ' + JSON.stringify(ids));

                let nodes = [];
                let nodeIds = [];

                for (let i = 0; i < ids.length; i++) {
                    for (let j = 0; j < _t.editDatas.nodes.length; j++) {
                        let node = _t.editDatas.nodes[j];
                        if (node.id === ids[i]) {
                            let node_ = deepCopy(node);
                            node_.id = 'node_' + node_.type + '_' + generateUUID();
                            node_.title = node_.title+'-副本';
                            node_.x = node_.x+10;
                            node_.y = node_.y+10;
                            nodes.push(node_);
                            nodeIds.push(node_.id);
                            _t.editDatas.nodes.push(deepCopy(node_));
                            _t.editor.addItem('node', deepCopy(node_));
                            break;
                        }
                    }
                }
                let element = {
                    operation: 'add',
                    data_pre: {
                        nodeIds: [],
                        nodes: [],
                        edgeIds:[],
                        edges:[]
                    },
                    data_now: {
                        nodeIds: nodeIds,
                        nodes: nodes,
                        edgeIds:[],
                        edges:[]
                    },
                };
                _t.undoStack.push(deepCopy(element));
                _t.redoStack.clear();
            },

            /**
             *  重做
             *
             *
             */
            redoOperation() {
                let _t = this;
                let size = _t.redoStack.size();
                if (size <= 0) {
                    return false;
                }

                let element = _t.redoStack.pop();
                _t.log('redoOperation  '+JSON.stringify(element));
                switch (element.operation) {
                    case 'add':
                        _t.doAddItems(element.data_now.nodes, element.data_now.edges);
                        break;
                    case 'delete':
                        _t.doDelItems(element.data_pre.nodeIds, element.data_pre.edgeIds);
                        break;
                    case 'clear':
                        _t.editDatas.nodes = defaultNodes;
                        _t.editDatas.edges = [];
                        _t.editor.changeData(deepCopy(_t.editDatas));
                        break;
                    case 'update':
                        _t.doUpdateItems(element.data_now.nodes, element.data_now.edges);
                        break;
                    case 'move':
                        _t.doUpdateItems(element.data_now.nodes, []);
                        break;
                    default:
                        break;
                }
                _t.undoStack.push(element);
            },
            /**
             *  撤销
             *  return 是否还能撤销
             *
             **/
            undoOperation() {
                let _t = this;
                _t.log('undoOperation  ');

                let size = _t.undoStack.size();
                if (size <= 0) {
                    return false;
                }
                let element = _t.undoStack.pop();
                switch (element.operation) {
                    case 'add':
                        _t.doDelItems(element.data_now.nodeIds, element.data_now.edgeIds);
                        break;
                    case 'delete':
                        _t.doAddItems(element.data_pre.nodes, element.data_pre.edges);
                        break;
                    case 'clear':
                        _t.editDatas.nodes = [];
                        _t.editDatas.edges = [];
                        element.data_pre.nodes.forEach(item => {
                            _t.editDatas.nodes.push(item);
                        });
                        element.data_pre.edges.forEach(item => {
                            _t.editDatas.edges.push(item);
                        });
                        _t.editor.changeData(deepCopy(_t.editDatas));
                        break;
                    case 'update':
                        _t.doUpdateItems(element.data_pre.nodes, element.data_pre.edges);
                        break;
                    case 'move':
                        _t.doUpdateItems(element.data_pre.nodes, []);
                        break;
                    default:
                        break;
                }
                _t.redoStack.push(deepCopy(element));
            },
            doDelItems(nodeIds, edgeIds){
                let _t = this;
                let delNodeIndex = [];
                let delEdgeIndex = [];
                edgeIds.forEach(id=>{//先删除线，因为删节点会把相关的线删掉
                    _t.editor.removeItem(id);
                    for (let i = 0; i < _t.editDatas.edges.length; i++) {
                        if (_t.editDatas.edges[i].id === id) {
                            delEdgeIndex.push(i);
                            break;
                        }
                    }
                });
                nodeIds.forEach(id=>{
                    _t.editor.removeItem(id);
                    for (let i = 0; i < _t.editDatas.nodes.length; i++) {
                        if (_t.editDatas.nodes[i].id === id) {
                            delNodeIndex.push(i);
                            break;
                        }
                    }
                });

                _t.deleteEditDataByIndex(delNodeIndex, delEdgeIndex);
            },
            doAddItems(nodes, edges){
                let _t = this;
                nodes.forEach(item => {
                    _t.editor.addItem('node', deepCopy(item));
                    _t.editDatas.nodes.push(item);
                });
                edges.forEach(item => {
                    _t.editor.addItem('edge', deepCopy(item));
                    _t.editDatas.edges.push(item);
                });
            },
            doUpdateItems(nodes, edges) {
                let _t = this;
                nodes.forEach(item => {
                    for (let i = 0; i < _t.editDatas.nodes.length; i++) {
                        if (_t.editDatas.nodes[i].id === item.id) {
                            _t.editDatas.nodes[i] = deepCopy(item);
                            _t.editor.updateItem(item.id, deepCopy(item));
                            break;
                        }
                    }
                });
                edges.forEach(item => {
                    for (let i = 0; i < _t.editDatas.edges.length; i++) {
                        if (_t.editDatas.edges[i].id === item.id) {
                            _t.editDatas.edges[i] = deepCopy(item);
                            _t.editor.updateItem(item.id, deepCopy(item));
                            break;
                        }
                    }
                });
            },

            deleteEditDataByIndex(deleteNodeIndexs = [], deleteEdgeIndexs = []) {
                let _t = this;
                deleteNodeIndexs.sort((a, b) => {
                    return (b - a);
                });//倒序
                for (let i = 0; i < deleteNodeIndexs.length; i++) {
                    _t.editDatas.nodes.splice(deleteNodeIndexs[i], 1);//用索引  倒序去移除数组中的元素
                }
                deleteEdgeIndexs.sort((a, b) => {
                    return (b - a);
                });
                for (let i = 0; i < deleteEdgeIndexs.length; i++) {
                    _t.editDatas.edges.splice(deleteEdgeIndexs[i], 1);
                }
            },
            itemIsNode(item) {
                if (item.type === 'polyLine') {
                    return false;
                }
                if (item.type === 'start'
                    || item.type === 'end'
                    || item.type === 'userTask'
                    || item.type === 'exclusiveGateway') {
                    return true;
                }
                return true;
            },

            handleDatas() {
                let _t = this;
                let containsStart = false;
                let containsEnd = false;
                _t.editDatas.nodes.forEach(node => {
                    node.shape = _t.getNodeShapeFromType(node.type);
                    if (node.type === 'start') {
                        containsStart = true;
                    }
                    if (node.type === 'end') {
                        containsEnd = true;
                    }
                });
                if (!containsStart) {
                    _t.editDatas.nodes.push(defaultNodes[0]);
                }
                if (!containsEnd) {
                    _t.editDatas.nodes.push(defaultNodes[1]);
                }
                _t.editDatas.edges.forEach(edge => {
                    edge.shape = 'customPolyEdge';
                })
            },

            getNodeShapeFromType(type) {
                switch (type) {
                    case 'start':
                        return 'customStartNode';
                    case 'end':
                        return 'customEndNode';
                    case 'userTask':
                        return 'customToolNode';
                    case 'exclusiveGateway':
                        return 'customBranchNode';
                    default:
                        return 'customToolNode';
                }

            },

            getTypeFromNodeShape(type) {
                switch (type) {
                    case 'customStartNode':
                        return 'start';
                    case 'customEndNode':
                        return 'end';
                    case 'customToolNode':
                        return 'userTask';
                    case 'customBranchNode':
                        return 'exclusiveGateway';
                    default:
                        return 'userTask';
                }
            },
            getDefaultTitleFromType(type) {
                switch (type) {
                    case 'start':
                        return '开始';
                    case 'end':
                        return '结束';
                    case 'userTask':
                        return '工具';
                    case 'exclusiveGateway':
                        return '分支';
                    default:
                        return '工具';
                }
            },


            //通知父组件一些事件
            doubleClickEvent(target, id) {
                let _t = this;
                _t.log('doubleClickEvent  ' + id + '  ' + target);

                if (target === 'node') {
                    _t.$emit('openNodeConfig', id);//节点id
                } else if (target === 'edge') {
                    _t.$emit('openEdgeConfig', id);//连线id
                }
            },
            /*
              供父节点调用
              获取所有节点配置信息
             */
            getNodesConfig() {
                let _t = this;
                _t.log('getNodesConfig  ');
                let nodes = deepCopy(_t.editDatas.nodes);
                for (let i = 0; i < nodes.length; i++) {
                    delete nodes[i].g6HelpInfo;
                }
                return nodes;
            },
            /*
            供父节点调用
            获取节点配置信息
            */
            getNodeConfigById(id) {
                let _t = this;
                _t.log('getNodeConfigById  ' + id);
                let node = null;
                for (let i = 0; i < _t.editDatas.nodes.length; i++) {
                    if (_t.editDatas.nodes[i].id === id) {
                        node = deepCopy(_t.editDatas.nodes[i]);
                        delete node.g6HelpInfo;
                        break;
                    }
                }
                return node;
            },
            /*
              供父节点调用
              获取所有连线配置信息
             */
            getEdgesConfig() {
                let _t = this;
                _t.log('getEdgesConfig  ');
                let edges =  deepCopy(_t.editDatas.edges);
                for (let i = 0; i < edges.length; i++) {
                    delete edges[i].g6HelpInfo;
                }
                return edges;
            },


            /*
            供父节点调用
            获取连线配置信息
           */
            getEdgeConfigById(id) {
                let _t = this;
                _t.log('getEdgeConfigById  ' + id);
                let edge = null;
                for (let i = 0; i < _t.editDatas.edges.length; i++) {
                    if (_t.editDatas.edges[i].id === id) {
                        edge = deepCopy(_t.editDatas.edges[i]);
                        delete edge.g6HelpInfo;
                        break;
                    }
                }
                return edge;
            },


            updateNodeG6HelpInfo(id, info){
                for (let i = 0; i < this.editDatas.nodes.length; i++) {
                    if(this.editDatas.nodes[i].id === id){
                        let item = this.editDatas.nodes[i];
                        let g6HelpInfo = item.g6HelpInfo;
                        if(g6HelpInfo == null){
                            g6HelpInfo = info
                        }else{
                            g6HelpInfo = {
                                ...g6HelpInfo,
                                ...info
                            }
                        }
                        item.g6HelpInfo = g6HelpInfo;
                        this.editDatas.nodes[i] = item;
                        this.editor.updateItem(item.id, deepCopy(item));
                        break;
                    }
                }
            },
            updateEdgeG6HelpInfo(id, info){
                for (let i = 0; i < this.editDatas.edges.length; i++) {
                    if(this.editDatas.edges[i].id === id){
                        let item = this.editDatas.edges[i];
                        let g6HelpInfo = item.g6HelpInfo;
                        if(g6HelpInfo == null){
                            g6HelpInfo = info
                        }else{
                            g6HelpInfo = {
                                ...g6HelpInfo,
                                ...info
                            }
                        }
                        item.g6HelpInfo = g6HelpInfo;
                        this.editDatas.edges[i] = item;
                        this.editor.updateItem(item.id, deepCopy(item));
                        break;
                    }
                }
            },

            /*
            供父节点调用
            设置mode
             */
            setMode(mode) {
                let _t = this;
                _t.log('setMode  ' + mode);
                if (mode === 'edit' || mode === 'view') {
                }else{
                    return;
                }
                _t.currentMode = mode;
                if(_t.editor == null){
                    return;
                }
                _t.doClearTempState();
                _t.editor.setMode(_t.currentMode);
                _t.editor.refresh();

            },
            /*
            供父节点调用
            修改节点的配置信息（设置的信息，获取的时候会原样返回）
            参数:node:{id:'111',...}
             */
            updateNodeConfig(node) {
                if (node == null || node.id == null || node.id === '') {
                    return;
                }
                let _t = this;
                _t.log('updateNodeConfig  ' + JSON.stringify(node));

                for (let i = 0; i < _t.editDatas.nodes.length; i++) {
                    if (_t.editDatas.nodes[i].id === node.id) {
                        let item = _t.editDatas.nodes[i];
                        let node_pre = deepCopy(item);
                        let isChanged = false;

                        Object.keys(node).forEach(key => {
                            if (key === 'id'
                                || key === 'type'
                                || key === 'x'
                                || key === 'y'
                                || key === 'shape') {//这些属性不给编辑
                            } else {
                                if (node[key] != null && item[key] !== node[key]) {
                                    isChanged = true;
                                    item[key] = node[key];
                                }
                            }
                        });
                        if (isChanged) {
                            _t.editDatas.nodes[i] = deepCopy(item);
                            _t.editor.updateItem(item.id, deepCopy(item));
                            let element = deepCopy({
                                operation: 'update',
                                data_pre:{
                                    nodeIds: [node.id],
                                    nodes: [node_pre],
                                    edgeIds: [],
                                    edges: []
                                },
                                data_now:{
                                    nodeIds: [node.id],
                                    nodes: [deepCopy(item)],
                                    edgeIds: [],
                                    edges: []
                                }
                            });
                            _t.undoStack.push(element);
                            _t.redoStack.clear();
                        }
                    }
                }
            },
            /*
            供父节点调用
            修改连线的配置信息（设置的信息，获取的时候会原样返回）
            参数：edge:{id:'11',...}
            */
            updateEdgeConfig(edge) {
                if (edge == null || edge.id == null || edge.id === '') {
                    return;
                }
                let _t = this;
                _t.log('updateEdgeConfig  ' + JSON.stringify(edge));

                for (let i = 0; i < _t.editDatas.edges.length; i++) {
                    if (_t.editDatas.edges[i].id === edge.id) {
                        let item = _t.editDatas.edges[i];
                        let item_pre = deepCopy(item);
                        let isChanged = false;

                        Object.keys(edge).forEach(key => {
                            if (key === 'id'
                                || key === 'type'
                                || key === 'source'
                                || key === 'target'
                                || key === 'sourceNode'
                                || key === 'targetNode'
                                || key === 'sourceAnchorIndex'
                                || key === 'targetAnchorIndex'
                                || key === 'shape') {//这些属性不给编辑
                            } else {
                                if (edge[key] != null && item[key] !== edge[key]) {
                                    isChanged = true;
                                    item[key] = edge[key];
                                }
                            }
                        });
                        if (isChanged) {
                            _t.editDatas.edges[i] = deepCopy(item);
                            _t.editor.updateItem(item.id, deepCopy(item));
                            let element = deepCopy({
                                operation: 'update',
                                data_pre:{
                                    nodeIds: [],
                                    nodes: [],
                                    edgeIds: [edge.id],
                                    edges: [item_pre]
                                },
                                data_now:{
                                    nodeIds: [],
                                    nodes: [],
                                    edgeIds: [edge.id],
                                    edges: [deepCopy(item)]
                                }
                            });
                            _t.undoStack.push(element);
                            _t.redoStack.clear();
                        }
                    }
                }
            },
            /*
            重新设置节点和连线
            */
            resetNodesAndEdges(nodes, edges) {
                let _t = this;
                _t.log('resetNodesAndEdges  ' + JSON.stringify(nodes) + '  ' + JSON.stringify(edges));


                if (nodes && nodes instanceof Array) {
                    _t.editDatas.nodes = nodes;
                }
                if (edges && edges instanceof Array) {
                    _t.editDatas.edges = edges;
                }
                _t.handleDatas();
                if(_t.editor == null){
                    return;//还没初始化
                }
                _t.editor.changeData(deepCopy(_t.editDatas));
            },

            /*
                供父节点调用
                清空数据
                */
            clear() {
                let _t = this;
                _t.log('resetNodesAndEdges  ');
                let element = deepCopy({
                    operation: 'clear',
                    data_pre:{
                        nodeIds: [],
                        nodes: _t.editDatas.nodes,
                        edgeIds: [],
                        edges: _t.editDatas.edges
                    },
                    data_now:{
                        nodeIds: [],
                        nodes: [],
                        edgeIds: [],
                        edges: []
                    }
                });
                _t.undoStack.push(element);
                _t.redoStack.clear();

                _t.editDatas.nodes = defaultNodes;
                _t.editDatas.edges = [];
                _t.editor.changeData(deepCopy(_t.editDatas));
            },
            screenFull() {
                screenfull.toggle();
            },
            destoryG6() {
                if(this.editor!=null){
                    this.log('destoryG6');
                    this.editor.destroy();
                    this.editor = null;
                }

            },


            log(message) {
                if (false) {
                    console.log(message);
                }
            },
        },
        created() {
            eventBus.$on('before_add_node', this.beforeAddNode);
            eventBus.$on('add_node_data', this.addNodeData);
            eventBus.$on('add_edge', this.doAddEdge);
            eventBus.$on('change_edge', this.doChangeEdge);
            eventBus.$on('delete_item', this.deleteItem);
            eventBus.$on('move_item', this.moveItem);
            eventBus.$on('copyAndPasteNodes', this.copyAndPasteNodes);
            eventBus.$on('undo_operation', this.undoOperation);
            eventBus.$on('redo_operation', this.redoOperation);
            eventBus.$on('contextMenuClick', this.handleContextMenu);

        },
        mounted() {
        },

        beforeDestroy() {
            eventBus.$off('before_add_node', this.beforeAddNode);
            eventBus.$off('add_node_data', this.addNodeData);
            eventBus.$off('add_edge', this.doAddEdge);
            eventBus.$off('change_edge', this.doChangeEdge);
            eventBus.$off('delete_item', this.deleteItem);
            eventBus.$off('move_item', this.moveItem);
            eventBus.$off('copyAndPasteNodes', this.copyAndPasteNodes);
            eventBus.$off('undo_operation', this.undoOperation);
            eventBus.$off('redo_operation', this.redoOperation);
            eventBus.$off('contextMenuClick', this.handleContextMenu);

        },

    }
</script>
<style>
  /* 提示框的样式 */
  .g6-tooltip {
    border: 1px solid #e2e2e2;
    border-radius: 4px;
    font-size: 18px;
    color: #545454;
    background-color: rgba(255, 255, 255, 0.9);
    /*padding: 10px 8px;*/
    box-shadow: rgb(174, 174, 174) 0px 0px 10px;
  }
</style>

<style scoped>

</style>
