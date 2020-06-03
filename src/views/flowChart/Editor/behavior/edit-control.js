/**
 * 修改自 https://github.com/OXOYO/X-Flowchart-Vue
 *
 */
import eventBus from "../utils/eventBus";
import {deepCopy} from "../utils/commonCaculate"


let itemCfg = null;
let status = null;//'ToAdd','ToGrag'
let timestamp = 0;//用于微调
let alignLine = {
  enable: true,
  style: {
    stroke: '#FA8C16',
    lineWidth: 1
  },
  lineList: [],
  // 最大距离
  maxDistance: 1,
};
let controlDown = false;
let copyTargetIds = [];

export default {
  getEvents() {
    return {
      mousemove: 'onMousemove',
      'customMouseUp': 'customMouseUp',//必须转一下，直接在这里监听会和多选的冲突
      'customAddNode': 'customAddNode',
      'canvas:mousedown': 'onCanvasMousedown',
      'node:mouseover': 'onNodeHover',
      'node:mouseout': 'onNodeOut',
      'node:mousedown': 'onNodeMouseDown',
      'node:drag': 'onNodeDrag',
      'node:dragend': 'onNodeDragEnd',
      'edge:mouseenter': 'onEdgeMouseenter',
      'edge:mouseout': 'onEdgeMouseout',
      'edge:mousemove': 'onEdgeMousemove',
      'edge:mousedown': 'onEdgeMouseDown',
      'keydown': 'onKeyDown',
      'keyup': 'onKeyUp',
      'node:contextmenu': 'onNodeContextmenu',
      'edge:contextmenu': 'onEdgeContextmenu',
    };
  },

  onCanvasMousedown(event) {

    let _t = this;
    _t.log('nodeControl    onCanvasMousedown');
    _t.doClearAllStates();
  },
  onNodeHover(event) {
    let _t = this;
    _t.log('nodeControl    onNodeHover');
    if (!event.item.hasState('selected')) {
      _t.graph.setItemState(event.item, 'hover', true);
    }
    if (event.target._attrs.isAnchorPoint) {//鼠标的目标是锚点
      event.item.getContainer().findAll(point => {
        if(point._attrs.isAnchorPoint){
          if(event.target._attrs.anchorPointIndex === point._attrs.anchorPointIndex){
            point.attr("fill", "#3688ed");
          }else{
            point.attr("fill", "#e1e4e8");
          }
        }
      });
      _t.graph.paint();//修改了fill属性，必须绘制一下，不然不生效
    }
  },

  onNodeOut(event) {
    let _t = this;
    _t.log('nodeControl   onNodeOut');
    if (!event.item.hasState('selected')) {
        _t.graph.setItemState(event.item, 'hover', false)
    }
  },
  onNodeMouseDown(event) {
    let _t = this;//鼠标在节点上按下
    _t.log('nodeControl  onNodeMouseDown');


    if (event.target._attrs.isDeleteButton && event.target._attrs.enabled) {//鼠标的目标是删除按钮
      eventBus.$emit('delete_item',{ids:[event.item._cfg.id],type:'node'});
    } else if (event.target._attrs.isAnchorPoint) {
      _t.graph.setMode('addEdge');
      _t.graph.emit('editor:addEdge', event);
    }
  },

  onEdgeMouseenter(event) {
    let _t = this;//鼠标移入线
    _t.log('nodeControl  onEdgeMouseenter');
    _t.graph.setItemState(event.item, 'hover', true);
  },
  onEdgeMouseout(event) {
    let _t = this;//鼠标移除线后
    _t.log('nodeControl  onEdgeMouseout');
    _t.graph.setItemState(event.item, 'hover', false);
  },
  onEdgeMousemove(event) {//不加这个，想选中线上的删除按钮很难
    let _t = this;//鼠标在线上移动不断触发
    _t.log('nodeControl  onEdgeMousemove');
    _t.graph.setItemState(event.item, 'hover', true);
  },
  onEdgeMouseDown(event) {
    let _t = this;//鼠标在线上按下
    _t.log('nodeControl  onEdgeMouseDown');
    if (event.target._attrs.isDeleteButton && event.target._attrs.enabled) {//鼠标的目标是删除按钮
      // _t.graph.removeItem(event.item);//删除这个线
      eventBus.$emit('delete_item',{ids:[event.item._cfg.id],type:'edge'});
    }else if(event.target._attrs.sourceMoveBtn || event.target._attrs.targetMoveBtn){
      _t.graph.setMode('addEdge');
      _t.graph.emit('editor:moveEdge', event);
    }
  },
  onKeyUp(event) {
    let _t = this;
    _t.log('弹起键盘'+event.code);
    if(event.code &&(event.code === 'ControlLeft' || event.code === 'ControlRight')){
      controlDown = false;
    }
  },
  onKeyDown(event) {
    let _t = this;
    _t.log('按下键盘' + event.code);
    if (event.code && event.timeStamp && timestamp !== event.timeStamp) {
      timestamp = event.timeStamp;
      if (event.code === 'ControlLeft' || event.code === 'ControlRight') {
        controlDown = true
      } else if (controlDown && event.code === 'KeyZ') {
        eventBus.$emit('undo_operation', null);
      } else if (controlDown && event.code === 'KeyY') {
        eventBus.$emit('redo_operation', null);
      }else if(controlDown && event.code === 'KeyC'){
        copyTargetIds = [];
        _t.graph.findAllByState('node', 'selected').forEach(node => {
          copyTargetIds.push(node._cfg.id);
        });
      }else if(controlDown && event.code === 'KeyV' && copyTargetIds.length>0){
        eventBus.$emit('copyAndPasteNodes', copyTargetIds);
      }else if (event.code === 'Delete') {
        let ids = [];
        _t.graph.findAllByState('node', 'selected').forEach(node => {
          ids.push(node._cfg.id);
        });
        eventBus.$emit('delete_item', {ids: ids, type:'node'});
      }else if (event.code === 'ArrowLeft'
        || event.code === 'ArrowRight'
        || event.code === 'ArrowUp'
        || event.code === 'ArrowDown') {
        event.preventDefault();
        let ids = [];
        let coordinates = [];
        let nodes = [];
        _t.graph.findAllByState('node', 'selected').forEach(node => {
          ids.push(node._cfg.id);
          coordinates.push({x: parseInt(node._cfg.model.x), y: parseInt(node._cfg.model.y)});
          nodes.push(node);
        });
        if(nodes.length<=0){
          return;
        }
        if (event.code === 'ArrowLeft') {
          for(let i=0; i<ids.length; i++){
            _t.graph.updateItem(nodes[i], {
              x: coordinates[i].x - 1,
              y: coordinates[i].y,
            });
          }
        } else if (event.code === 'ArrowRight') {
          for(let i=0; i<ids.length; i++){
            _t.graph.updateItem(nodes[i], {
              x: coordinates[i].x + 1,
              y: coordinates[i].y,
            });
          }
        } else if (event.code === 'ArrowUp') {
          for(let i=0; i<ids.length; i++){
            _t.graph.updateItem(nodes[i], {
              x: coordinates[i].x,
              y: coordinates[i].y - 1,
            });
          }
        } else if (event.code === 'ArrowDown') {
          for(let i=0; i<ids.length; i++){
            _t.graph.updateItem(nodes[i], {
              x: coordinates[i].x,
              y: coordinates[i].y + 1,
            });
          }
        }
        if(ids.length===1){
          _t.drawAlign(nodes[0]);
        }
        eventBus.$emit('move_item',{ids:ids,coordinates:coordinates});

      }
    }
  },
  onNodeContextmenu(event) {
    let _t = this;
    _t.log('节点右键');
    eventBus.$emit('contextMenuClick',{id:event.item._cfg.id,type:'node',x:event.canvasX,y:event.canvasY});
  },
  onEdgeContextmenu(event) {
    let _t = this;
    _t.log('连线右键');
    eventBus.$emit('contextMenuClick',{id:event.item._cfg.id,type:'edge',x:event.canvasX,y:event.canvasY});
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
      _t.graph.clearItemStates(node, ['hover', 'selected']);
    });
    _t.graph.getEdges().forEach(function (edge) {
      _t.graph.clearItemStates(edge, ['hover', 'selected']);
    });
    _t.graph.paint();
    _t.graph.setAutoPaint(true);
  },
  customAddNode(node) {
    let _t = this;
    _t.log('nodeControl   customAddNode  ');
    itemCfg = node;
    status = 'ToAdd';
  },
  customMouseUp(event) {
    let _t = this;
    _t.log('nodeControl   customMouseUp');
    if (itemCfg && status === 'ToDrag') {
      eventBus.$emit('add_node_data', itemCfg);
      itemCfg = null;
      status = null;
      _t.graph.setMode('edit');
    }
    _t.clearAlign();
  },
  onMousemove(event) {
    let _t = this;
    _t.log('nodeControl   onMousemove');
    if(itemCfg){
      if (status === 'ToAdd') {
        itemCfg.x = parseInt(event.x);
        itemCfg.y = parseInt(event.y);
        _t.graph.addItem('node', deepCopy(itemCfg));
        status = 'ToDrag';
      }
      if (status === 'ToDrag') {
        let node = _t.graph.findById(itemCfg.id);
        itemCfg.x = event.x;
        itemCfg.y = event.y;
        _t.graph.updateItem(node, {
          x: event.x,
          y: event.y,
        });
        _t.drawAlign(node);//拖动生成的时候画对齐线
      }
    }

  },
  onNodeDrag(event) {

    let _t = this;
    _t.log('nodeControl   onNodeDrag');
    _t.drawAlign(event.item);//拖动已有节点画对齐线
  },

  onNodeDragEnd(event) {
    let _t = this;
    _t.log('nodeControl   onNodeDragEnd');//拖拽结束
    let ids = [];
    let coordinates = [];
    ids.push(event.item._cfg.id);
    coordinates.push({x:parseInt(event.item._cfg.model.x),y:parseInt(event.item._cfg.model.y)});
    if(event.item.hasState('selected')){//说明是被选中的节点一起被拖动,否则就是单独被拖动

      _t.graph.findAllByState('node', 'selected').forEach(node => {
        ids.push(node._cfg.id);
        coordinates.push({x:parseInt(node._cfg.model.x),y:parseInt(node._cfg.model.y)});
      });
    }
    eventBus.$emit('move_item',{ids:ids,coordinates:coordinates});
    },

  //对齐线
  clearAlign() {
    let _t = this;
    alignLine.lineList.forEach(line => {
      line.remove();
    });
    alignLine.lineList = [];
    _t.graph.paint();
  },
  drawAlign(item) {
    if (!alignLine.enable) {
      return;
    }
    let _t = this;
    // 先清空已有对齐线
    _t.clearAlign();
    const bbox = item.getBBox();
    // FIXME bbox 中x、y坐标为图形左上角坐标
    // 中上
    const ct = {x: bbox.x + bbox.width / 2, y: bbox.y};
    // 中心
    const cc = {x: bbox.x + bbox.width / 2, y: bbox.y + bbox.height / 2};
    // 中下
    const cb = {x: bbox.x + bbox.width / 2, y: bbox.y + bbox.height};
    // 左中
    const lc = {x: bbox.x, y: bbox.y + bbox.height / 2};
    // 右中
    const rc = {x: bbox.x + bbox.width, y: bbox.y + bbox.height / 2};
    // 计算距离
    const getDistance = function (line, point) {
      // 归一向量
      function normalize(out, a) {
        let x = a[0];
        let y = a[1];
        let len = x * x + y * y;
        if (len > 0) {
          len = 1 / Math.sqrt(len);
          out[0] = a[0] * len;
          out[1] = a[1] * len;
        }
        return out;
      }

      function dot(a, b) {
        return a[0] * b[0] + a[1] * b[1];
      }

      const pointLineDistance = function (lineX1, lineY1, lineX2, lineY2, pointX, pointY) {
        const lineLength = [lineX2 - lineX1, lineY2 - lineY1];
        if (lineLength[0] === 0 && lineLength[1] === 0) {
          return NaN;
        }
        let s = [-lineLength[1], lineLength[0]];
        normalize(s, s);
        return Math.abs(dot([pointX - lineX1, pointY - lineY1], s));
      };
      return {
        line,
        point,
        dis: pointLineDistance(line[0], line[1], line[2], line[3], point.x, point.y)
      }
    };
    // 遍历节点
    const nodes = _t.graph.getNodes();
    nodes.forEach(node => {
      let horizontalLines = [];
      let verticalLines = [];
      // 对齐线信息
      let info = {
        horizontals: [],
        verticals: []
      }
      const bbox1 = node.getBBox();
      // 水平线
      let horizontalInfo = [
        // 左上 右上 tltr
        [bbox1.minX, bbox1.minY, bbox1.maxX, bbox1.minY],
        // 左中 右中 lcrc
        [bbox1.minX, bbox1.centerY, bbox1.maxX, bbox1.centerY],
        // 左下 右下 blbr
        [bbox1.minX, bbox1.maxY, bbox1.maxX, bbox1.maxY]
      ]
      // 垂直线
      let verticalInfo = [
        // 左上 左下 tlbl
        [bbox1.minX, bbox1.minY, bbox1.minX, bbox1.maxY],
        // 上中 下中 tcbc
        [bbox1.centerX, bbox1.minY, bbox1.centerX, bbox1.maxY],
        // 上右 下右 trbr
        [bbox1.maxX, bbox1.minY, bbox1.maxX, bbox1.maxY]
      ]
      horizontalInfo.forEach(line => {
        horizontalLines.push(getDistance(line, ct));
        horizontalLines.push(getDistance(line, cc));
        horizontalLines.push(getDistance(line, cb));
      })
      verticalInfo.forEach(line => {
        verticalLines.push(getDistance(line, lc));
        verticalLines.push(getDistance(line, cc));
        verticalLines.push(getDistance(line, rc));
      })
      horizontalLines.sort((a, b) => a.dis - b.dis);
      verticalLines.sort((a, b) => a.dis - b.dis);
      // 过滤掉距离为0的线条
      horizontalLines = horizontalLines.filter(item => item.dis !== 0);
      if (horizontalLines.length && horizontalLines[0].dis < alignLine.maxDistance) {
        // 取前3个距离相等的线条
        for (let i = 0; i < 3; i++) {
          if (horizontalLines[0].dis === horizontalLines[i].dis) {
            info.horizontals.push(horizontalLines[i]);
          }
        }
      }
      // 过滤掉距离为0的线条
      verticalLines = verticalLines.filter(item => item.dis !== 0);
      if (verticalLines.length && verticalLines[0].dis < alignLine.maxDistance) {
        // 取前3个距离相等的线条
        for (let i = 0; i < 3; i++) {
          if (verticalLines[0].dis === verticalLines[i].dis) {
            info.verticals.push(verticalLines[i]);
          }
        }
      }
      // 添加对齐线
      const group = _t.graph.get('group');
      // 对齐线样式
      const lineStyle = alignLine.style;
      // 处理水平线
      if (info.horizontals.length) {
        info.horizontals.forEach(lineObj => {
          let line = lineObj.line;
          let point = lineObj.point;
          let lineHalf = (line[0] + line[2]) / 2;
          let x1;
          let x2;
          if (point.x < lineHalf) {
            x1 = point.x - bbox.width / 2;
            x2 = Math.max(line[0], line[2]);
          } else {
            x1 = point.x + bbox.width / 2;
            x2 = Math.min(line[0], line[2]);
          }
          let shape = group.addShape('line', {
            attrs: {
              x1,
              y1: line[1],
              x2,
              y2: line[1],
              ...lineStyle
            },
            // 是否拾取及触发该元素的交互事件
            capture: false
          });
          alignLine.lineList.push(shape);
        })
      }
      // 处理垂直线
      if (info.verticals.length) {
        info.verticals.forEach(lineObj => {
          let line = lineObj.line;
          let point = lineObj.point;
          let lineHalf = (line[1] + line[3]) / 2;
          let y1;
          let y2;
          if (point.y < lineHalf) {
            y1 = point.y - bbox.height / 2;
            y2 = Math.max(line[1], line[3]);
          } else {
            y1 = point.y + bbox.height / 2;
            y2 = Math.min(line[1], line[3]);
          }
          let shape = group.addShape('line', {
            attrs: {
              x1: line[0],
              y1,
              x2: line[0],
              y2,
              ...lineStyle
            },
            capture: false
          });
          alignLine.lineList.push(shape);
        })
      }
    })
  },
  clearTempState(graph){
    itemCfg = null;
    status = null;
    controlDown = false;
    copyTargetIds = [];
  },
  log(message) {
    if (false) {
      console.log(message);
    }
  },
}
