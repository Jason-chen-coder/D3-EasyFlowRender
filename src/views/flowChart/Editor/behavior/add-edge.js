/**
 * 修改自  https://github.com/caoyu48/vue-g6-editor
 */
import eventBus from "../utils/eventBus";
import {getEdgeStartOrEndPoint} from "../utils/commonCaculate";


let startItem = null;
let startPointOffset = null;
let sourceAnchorIndex = null;
let edgeAdding = null;

let changeEdgeId = null;
let changeSource = null;

export default {
  getEvents() {
    return {
      mousemove: 'onMousemove',
      mouseup: 'onMouseup',
      'node:mouseover': 'onNodeHover',
      'node:mouseout': 'onNodeOut',
      'editor:addEdge': 'startAddEdge',
      'editor:moveEdge': 'startMoveEdge',
    };
  },
  onNodeOut(event) {
    let _t = this;
    _t.log('add-edge   onNodeOut');
    if(startItem && event.item._cfg.id !== startItem._cfg.id && !changeEdgeId){
      _t.graph.setItemState(event.item, 'hover_addedge', false);//因为直接设置true的话，原来就是true，就不会执行
      _t.graph.setItemState(event.item, 'hover_addedge', true);
    }
  },
  onMouseup(event) {
    let _t = this;
    _t.log('add-edge   onMouseup');

    const item = event.item;
    if (startItem
      && item
      && item.getType() === 'node'
      && item._cfg.id !== startItem._cfg.id
      && edgeAdding
      &&(event.target._attrs.isAnchorPoint || event.target._attrs.isAnchorPointBigger)) {
      let targetItem = item;
      let endPointOffset = {x:parseInt(event.target._attrs.x), y:parseInt(event.target._attrs.y)};
          _t.graph.removeItem(edgeAdding);
          _t.graph.setMode('edit');//这里先改模式，否则可能会出现画线的时候，mode还是addEdge
          if(!changeEdgeId){
            const model = {
              source: startItem._cfg.id,//必传
              target: targetItem._cfg.id,//必传
              startPointOffset: startPointOffset,
              sourceAnchorIndex: sourceAnchorIndex,
              endPointOffset: endPointOffset,
              targetAnchorIndex:event.target._attrs.anchorPointIndex,
            };
            eventBus.$emit('add_edge', model);
          }else{
            const model = {
              id: changeEdgeId
            };
            if (changeSource) {
              model.sourceAnchorIndex = event.target._attrs.anchorPointIndex;
            } else {
              model.targetAnchorIndex = event.target._attrs.anchorPointIndex;
            }
            eventBus.$emit('change_edge', model);
          }
    }else{
      if(changeEdgeId){
        eventBus.$emit('delete_item', {ids:[changeEdgeId],type:'edge'});
      }
    }
    if (edgeAdding){
      _t.graph.removeItem(edgeAdding);
    }
    _t.graph.paint();

    startPointOffset = null;
    sourceAnchorIndex = null;
    startItem = null;
    edgeAdding = null;
    changeEdgeId = null;
    changeSource = null;
    _t.doClearAllStates();
    _t.graph.setMode('edit');
  },
  onMousemove(event) {
    let _t = this;
    _t.log('add-edge   onMousemove');
    if (startItem) {
      const point = {x: event.x, y: event.y};
      if (edgeAdding) {
        // 增加边的过程中，移动时边跟着移动
        _t.graph.updateItem(edgeAdding, {
          target: point
        });
      }
    }
  },
  startAddEdge(event){
    let _t = this;
    _t.log('add-edge   startAddEdge');
    const item = event.item;
      if(!item){
        _t.clearAddEdge();
        return;
      }
      let model =  item.getModel();
      startPointOffset = {x:parseInt(event.target._attrs.x), y:parseInt(event.target._attrs.y)};

      sourceAnchorIndex = event.target._attrs.anchorPointIndex;
      let startPoint = {x: startPointOffset.x+model.x, y: startPointOffset.y+model.y};
      startItem = item;
      edgeAdding = _t.graph.addItem('edge', {
        id:'tempLinkLine',
        source: startPoint,
        target: startPoint,
        type:'linkLine',
        shape: 'customLinkEdge'
      });

      //把其他的节点都设置为hover_addedge true
    _t.graph.getNodes().forEach(node => {
      if(node._cfg.id !== startItem._cfg.id){
        _t.graph.setItemState(node, 'hover_addedge', true);
      }
    });
  },

  //线只能改锚点，不能换节点（因为有的线上还有设置参数，不好处理）
  startMoveEdge(event){
    let _t = this;
    _t.log('add-edge   startMoveEdge');
    let targetPoint = {x: event.x, y: event.y};
    let startPoint = null;
    let targetNode = null;
    if (event.target._attrs.sourceMoveBtn) {
      startPoint = getEdgeStartOrEndPoint(null, event.item._cfg.target, event.item._cfg.targetAnchorIndex);
      sourceAnchorIndex = event.item._cfg.model.targetAnchorIndex;
      startItem = event.item._cfg.target;
      targetNode = event.item._cfg.source;
      changeSource = true;
    }else{
      startPoint = getEdgeStartOrEndPoint(null, event.item._cfg.source, event.item._cfg.sourceAnchorIndex);
      sourceAnchorIndex = event.item._cfg.model.sourceAnchorIndex;
      startItem = event.item._cfg.source;
      targetNode = event.item._cfg.target;
      changeSource = false;
    }

    let state = 'hover_addedge';
    if (event.target._attrs.sourceMoveBtn) {
      state = 'hover_changeedgesource';//因为只是改个锚点，所以肯定满足节点的出入线的规则
    }
    changeEdgeId = event.item._cfg.id;
    _t.graph.removeItem(event.item);//这里先不急着让Index里面删掉这根线，等改完（即鼠标mouseup的时候，该删就删，该改就改）
    edgeAdding = _t.graph.addItem('edge', {
      id:'tempLinkLine',
      source: startPoint,
      target: targetPoint,
      type:'linkLine',
      shape: 'customLinkEdge'
    });

    //把节点设置为hover_changeEdgeSource true
    _t.graph.setItemState(targetNode, state, true);

  },

  clearAddEdge(){
    let _t = this;
    _t.graph.setMode('edit');
  },
  // 清除所有状态
  doClearAllStates() {
    let _t = this;
    if (!_t.graph) {
      return
    }
    // 批量操作时关闭自动重绘，以提升性能
    _t.graph.setAutoPaint(false);
    _t.graph.getNodes().forEach(function (node) {
      _t.graph.clearItemStates(node, ['hover', 'hover_addedge', 'hover_changeedgesource', 'selected']);
    });
    _t.graph.getEdges().forEach(function (edge) {
      _t.graph.clearItemStates(edge, ['hover', 'hover_addedge', 'hover_changeedgesource', 'selected']);
    });
    _t.graph.paint();
    _t.graph.setAutoPaint(true);
  },
  onNodeHover(event) {
    let _t = this;
    _t.log('add-edge   onNodeHover');
    if (startItem && event.item._cfg.id !== startItem._cfg.id) {
      if(!changeEdgeId){
        _t.graph.setItemState(event.item, 'hover_addedge', true);
      }
      if (event.target._attrs.isAnchorPoint || event.target._attrs.isAnchorPointBigger) {//鼠标的目标是锚点
        event.item.getContainer().findAll(point => {
          if(point._attrs.isAnchorPoint) {
            if (event.target._attrs.anchorPointIndex === point._attrs.anchorPointIndex) {
              point.attr("fill", "#3688ed");
            } else {
              point.attr("fill", "#e1e4e8");
            }
          }
        });
      }
    }
  },
  clearTempState(graph){
    if (edgeAdding){
      graph.removeItem(edgeAdding);
    }
    startItem = null;
    startPointOffset = null;
    sourceAnchorIndex = null;
    edgeAdding = null;

  },
  log(message) {
    if (false) {
      console.log(message);
    }
  }
}
