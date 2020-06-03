/**
 * 修改自 https://github.com/OXOYO/X-Flowchart-Vue
 */

import G6 from "@antv/g6/build/g6";
import { polylineFinding } from './polylineFinding'
import { customPolylineFinding } from './customPolylineFinding'
import { getPointOffset, getEdgeStartOrEndPoint } from '../../utils/commonCaculate'
import commonConfig from "../../config/commonConfig"

const config = {
  ...commonConfig.edge,
};

const selectStyle = {
  strokeColor:'#64a1ec',//线的颜色
  strokeWidth: 2,
};


const customPolyEdge = {
  init(editor) {
    G6.registerEdge('customPolyEdge', {
      draw (cfg, group) {
        let currentMode = editor.getCurrentMode();
        let source = cfg.source;
        let target = cfg.target;
        let title = cfg.title;
        if(!source._cfg && source.x == null){//source传的是id
          source = editor.findById(cfg.source);
        }
        if(!target._cfg && target.x == null){
          target = editor.findById(cfg.target);
        }
        if(cfg.sourceAnchorIndex == null){
          cfg.sourceAnchorIndex = 1;
        }
        if(cfg.targetAnchorIndex == null){
          cfg.targetAnchorIndex = 0;
        }

        const startPoint = getEdgeStartOrEndPoint(cfg.startPointOffset, source, cfg.sourceAnchorIndex);
        const endPoint = getEdgeStartOrEndPoint(cfg.endPointOffset, target, cfg.targetAnchorIndex);

        cfg.source = source;//预置的连线没有这个参数，但是这个参数是必须的
        cfg.target = target;

        if((title == null || title === '') && source._cfg.model.type === 'exclusiveGateway'){
          title = '默认';
        }

        // const controlPoints = this.getControlPoints(cfg.controlPoints,source, target, startPoint, endPoint);
        // let points = [startPoint];
        // if (controlPoints) {
        //   points.push(...controlPoints)
        // }
        // points.push(endPoint);
        let points =  customPolylineFinding(startPoint, endPoint, cfg.sourceAnchorIndex, cfg.targetAnchorIndex);

        let path = this.getPath(points);
        const keyShape = group.addShape('path', {
          className: 'edge-shape',
          attrs: {
            path: path,
            isEdge: true,
            stroke: config.strokeColor_grey,
            lineAppendWidth: 10,//边响应鼠标事件时的检测宽度，
            lineWidth: config.strokeWidth_thin,//边的宽度
            endArrow: {
              path: 'M 8,0 L -6,-6 L -6,6 Z',
              d: 8,
            },
          }
        });




        let first = 0;
        let second = 1;
        //取points的最中间的2个点的下标
        if (points.length > 3) {
          first = parseInt(points.length / 2) -1;
          second = first + 1;
        }

        let middlePoint = this.getMiddlePoint(points);//因为获取到的points有问题，所以根据距离来算不行
        const iconX = middlePoint.x;
        const iconY = middlePoint.y;

        if(title != null && title !==''){
          group.addShape("text", {//线上的文字
            attrs: {
              x: iconX,
              y: iconY-5,
              textAlign: "center",
              textBaseline: "middle",
              text: title,
              fontSize: 18,
              fill: '#000000',
            }
          });
        }
        if (currentMode === 'edit') {

          //增加透明的可以用来拖动线的按钮
          let sourceParam= this.getMoveBtnSizeAndOffset(cfg.sourceAnchorIndex);
          let targetParam = this.getMoveBtnSizeAndOffset(cfg.targetAnchorIndex);
          group.addShape("rect", {//线两头的可拖动的透明按钮
            attrs: {
              x: points[0].x+sourceParam.offsetX,
              y:  points[0].y+sourceParam.offsetY,
              fill: '#ff1a21',
              width: sourceParam.width,
              height: sourceParam.height,
              sourceMoveBtn:true,
              opacity: 0,
              cursor:'move',
            }
          });
          group.addShape("rect", {//线两头的可拖动的透明按钮
            attrs: {
              x: points[points.length-1].x+targetParam.offsetX,
              y:  points[points.length-1].y+targetParam.offsetY,
              fill: '#18ff40',
              width: targetParam.width,
              height: targetParam.height,
              targetMoveBtn:true,
              opacity: 0,
              cursor:'move',
            }
          });

          if(config.deleteByIcon){
            group.addShape("circle", {//删除的按钮
              attrs: {
                x: iconX,
                y: iconY,
                r: 8,
                isDeleteButton: true,
                enabled: false,
                stroke: '#fff',
                lineWidth: 2,
                fill: '#FF111A',
                cursor: 'pointer',
                opacity: 0,
              }
            });

            group.addShape("text", {//删除的按钮的叉叉
              attrs: {
                x: iconX,
                y: iconY + 0.95,
                textAlign: "center",
                textBaseline: "middle",
                text: '×',
                fontSize: 18,
                cursor: 'pointer',
                isDeleteButton: true,
                enabled: false,
                fill: '#fff',
                opacity: 0,
                fontWeight: 'bolder'//最粗的字体
              }
            });
          }
        }

        return keyShape
      },

      getMoveBtnSizeAndOffset(anchorIndex){
        let width = 10;
        let height = 20;
        let offsetX = 0;
        let offsetY = 0;
        switch(anchorIndex){
          case 0:
            width = 10;
            height = 20;
            offsetX = -5;
            offsetY = -20;
            break;
          case 1:
            width = 10;
            height = 20;
            offsetX = -5;
            offsetY = 0;
            break;
          case 2:
            width = 20;
            height = 10;
            offsetX = -20;
            offsetY = -5;
            break;
          case 3:
            width = 20;
            height = 10;
            offsetX = 0;
            offsetY = -5;
            break;
          default:
            width = 20;
            height = 10;
            offsetX = 0;
            offsetY = -5;
            break
        }
        return {width:width,height:height,offsetX:offsetX,offsetY:offsetY}
      },

      getPath (points) {
        const path = []
        for (let i = 0; i < points.length; i++) {
          const point = points[i]
          if (i === 0) {
            path.push([ 'M', point.x, point.y ])
          } else if (i === points.length - 1) {
            path.push([ 'L', point.x, point.y ])
          } else {
            const prevPoint = points[i - 1]
            let nextPoint = points[i + 1]
            let cornerLen = 5
            if (Math.abs(point.y - prevPoint.y) > cornerLen || Math.abs(point.x - prevPoint.x) > cornerLen) {
              if (prevPoint.x === point.x) {
                path.push(['L', point.x, point.y > prevPoint.y ? point.y - cornerLen : point.y + cornerLen])
              } else if (prevPoint.y === point.y) {
                path.push(['L', point.x > prevPoint.x ? point.x - cornerLen : point.x + cornerLen, point.y])
              }
            }
            const yLen = Math.abs(point.y - nextPoint.y)
            const xLen = Math.abs(point.x - nextPoint.x)
            if (yLen > 0 && yLen < cornerLen) {
              cornerLen = yLen
            } else if (xLen > 0 && xLen < cornerLen) {
              cornerLen = xLen
            }
            if (prevPoint.x !== nextPoint.x && nextPoint.x === point.x) {
              path.push(['Q', point.x, point.y, point.x, point.y > nextPoint.y ? point.y - cornerLen : point.y + cornerLen])
            } else if (prevPoint.y !== nextPoint.y && nextPoint.y === point.y) {
              path.push(['Q', point.x, point.y, point.x > nextPoint.x ? point.x - cornerLen : point.x + cornerLen, point.y])
            }
          }
        }
        return path
      },
      getControlPoints (controlPoints, source, target, startPoint, endPoint) {
        if (!source) {
          return controlPoints;
        }
        return polylineFinding(source, target, startPoint, endPoint, 30);
      },

      getMiddlePoint(points){
        let distance = 0;
        let length = points.length;
        let array = [];//相邻两个点之间的距离
        for(let i = 0; i < length-1; i++) {
          let temp = 0;
          if(Math.abs(points[i].x - points[i+1].x) < 1){
            temp = Math.abs(points[i].y - points[i+1].y)
          }else{
            temp = Math.abs(points[i].x - points[i+1].x)
          }
          array.push(temp);
          distance += temp;
        }
        distance = parseInt(distance/2);
        let point = {x:points[0].x,y:points[0].y};
        for(let j = 0; j < length-1; j++){
          if(distance - array[j] < 0){//说明中间点在第i和第i+1个点中间
            if(Math.abs(points[j].x - points[j+1].x) < 1){//x坐标相同
              if(points[j].y>points[j+1].y){
                point.y = points[j].y-distance;
              }else{
                point.y = points[j].y+distance;
              }
              point.x = points[j].x;
            }else{
              if(points[j].x>points[j+1].x){
                point.x = points[j].x-distance;
              }else{
                point.x = points[j].x+distance;
              }
              point.y = points[j].y;
            }
            break;
          }else{
            distance -= array[j]
          }
        }
        return point;
      },
      setState(name, value, item) {
        const group = item.getContainer();
        const shape = group.findAll(point => {
          return point._attrs.isEdge;
        })[0];
        const deleteButtons = group.findAll(point => {
          return point._attrs.isDeleteButton;
        });
        const selectStyles = () => {
          shape.attr("stroke", config.strokeColor_blue);
          shape.attr("lineWidth", config.strokeWidth_bolder);

          deleteButtons.forEach(button => {
            button.attr('opacity', 1);
            button.attr('enabled',true);
          });
        };
        const unSelectStyles = () => {
          shape.attr("stroke", config.strokeColor_grey);
          shape.attr("lineWidth", config.strokeWidth_thin);
          deleteButtons.forEach(button => {
            button.attr('opacity', 0);
            button.attr('enabled',false);
          });
        };

        switch (name) {
          case "selected":
          case "hover":
            if (value) {
              selectStyles()
            } else {
              unSelectStyles()
            }
            break;
        }
      }
    });
  }
}

export default customPolyEdge
