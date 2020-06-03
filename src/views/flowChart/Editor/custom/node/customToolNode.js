import G6 from "@antv/g6/build/g6";
import commonConfig from "../../config/commonConfig"
import {getShowNodeTitle} from "../../utils/commonCaculate"

const config = {
  defaultSize:[130,70],
  title:'工具',
  ...commonConfig.node,
  inEdgeNum:10,
  outEdgeNum:1,
  unConfiguredColor:'#ABB8CC',
};

const customToolNode = {
  init(editor) {
    G6.registerNode("customToolNode", {
      draw(cfg, group) {
        let currentMode = editor.getCurrentMode();
        let width =  config.defaultSize[0];
        let height =  config.defaultSize[1];
        let title = getShowNodeTitle(cfg.title);

        cfg.size = [width,height];

        let centerColor = config.centerColor_blue;
        if(cfg.unConfigured){
          centerColor = config.unConfiguredColor;
        }

        const shape = group.addShape("rect", {//这个是主图形
          attrs: {
            id: cfg.id,
            x: -parseInt(width/2),
            y: -parseInt(height/2),
            width: width,
            height: height,
            isMain:true,
            stroke: config.strokeColor_grey,
            fill: config.centerColor_white,//此处必须有fill 不然不能触发事件
            lineWidth: config.lineWidth_thin,

          }
        });

        group.addShape("rect", {
          attrs: {
            x: -parseInt(width/2),
            y: parseInt(height*0.2),
            isCenterShape:true,
            width: width,
            height: parseInt(height*0.3),
            fill: centerColor,//此处必须有fill 不然不能触发事件
          }
        });

        group.addShape("text", {
          attrs: {
            x: 0,
            y: -parseInt(height*0.1),
            textAlign: "center",
            textBaseline: "middle",
            text: title,
            fill: config.centerColor_blue,
            fontSize: 16,
            // fontWeight:'bolder'//最粗的字体
          }
        });
        group.addShape("rect", {//加一个透明的图形解决点击有的地方不好拖动的问题
          attrs: {
            x: -parseInt(width/2),
            y: -parseInt(height/2),
            width: width,
            height: height,

            fill: '#fff',//此处必须有fill 不然不能触发事件
            cursor:'move',
            opacity: 0,
          }
        });
        if(config.deleteByIcon && currentMode === 'edit') {
          group.addShape("circle", {//删除的按钮
            attrs: {
              x: parseInt(width / 2),
              y: -parseInt(height / 2),
              r: parseInt(config.defaultDeleteR),
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
              x: parseInt(width / 2),
              y: -parseInt(height / 2) + 0.95,
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


        if(currentMode === 'edit') {
          for (let i = 0; i < config.anchorPoints.length; i++) {//画上下左右的4个点
            group.addShape("circle", {
              attrs: {
                x: parseInt(config.anchorPoints[i][0] * width - 0.5 * width),
                y: parseInt(config.anchorPoints[i][1] * height - 0.5 * height),
                r: 0,
                isAnchorPointBigger:true,
                anchorPointIndex:i,
                opacity: config.anchorBiggerOpacity,
                fill: config.anchorColor_blue,
                cursor:'crosshair',
              }
            });
            group.addShape("circle", {
              attrs: {
                x: parseInt(config.anchorPoints[i][0] * width - 0.5 * width),
                y: parseInt(config.anchorPoints[i][1] * height - 0.5 * height),
                r: 0,
                isAnchorPoint:true,
                anchorPointIndex:i,
                opacity: 1,
                stroke: config.anchorColor_blue,
                fill: config.anchorColor_grey,
                cursor:'crosshair',
              }
            });

          }
        }
        return shape;
      },

      //设置状态
      setState(name, value, item) {
        let showOutAnchor = false;
        let showInAnchor = false;
        if((name === 'selected' || name === 'hover' || name === 'hover_addedge') && item._cfg.edges){
          let existOutEdges = 0;
          let existInEdges = 0;
          item._cfg.edges.forEach(edge => {
            if (edge._cfg.sourceNode._cfg.id === item._cfg.id) {
              existOutEdges++;
            }
            if(edge._cfg.targetNode._cfg.id === item._cfg.id){
              existInEdges++;
            }
          });
          if(existOutEdges<config.outEdgeNum){
            showOutAnchor = true;
          }
          if(existInEdges<config.inEdgeNum){
            showInAnchor = true;
          }
        }
        const group = item.getContainer();
        const shape = group.findAll(point => {
          return point._attrs.isMain;
        })[0];
        const centerShapes = group.findAll(center => {
          return center._attrs.isCenterShape;
        });
        const points = group.findAll(point => {
          return point._attrs.isAnchorPoint;
        });
        const pointBiggers = group.findAll(point => {
          return point._attrs.isAnchorPointBigger;
        });
        const deleteButtons = group.findAll(point => {
          return point._attrs.isDeleteButton;
        });


        const selectStyles = () => {
          shape.attr("stroke", config.strokeColor_blue);
          shape.attr("lineWidth", config.lineWidth_bolder);

          if(showOutAnchor){
            points.forEach(point => {
              point.attr('r', config.anchorR);
              point.attr('fill', config.anchorColor_grey);
            });
          }else{
            points.forEach(point => {
              point.attr('r', 0);
            });
          }
          deleteButtons.forEach(button => {
            button.attr('opacity', 1);
            button.attr('enabled',true);
          });
        };
        let hover_addedge = () => {
          if(showInAnchor){
            points.forEach(point => {
              point.attr('r', config.anchorR);
              point.attr('fill', config.anchorColor_grey);
            });
            pointBiggers.forEach(point => {
              point.attr('r', config.anchorR*3);
            });
          }else{
            points.forEach(point => {
              point.attr('r', 0);
            });
            pointBiggers.forEach(point => {
              point.attr('r', 0);
            });
          }
        };
        const hover_changeedgesource = () => {
          //只是改个锚点，肯定满足出入的规则
          points.forEach(point => {
            point.attr('r', config.anchorR);
            point.attr('fill', config.anchorColor_grey);
          });
          pointBiggers.forEach(point => {
            point.attr('r', config.anchorR*3);
          });
        };
        const defaultStyles = () => {
          shape.attr("stroke", config.strokeColor_grey);
          shape.attr("lineWidth", config.lineWidth_thin);
          points.forEach(point => {
            point.attr('r', 0);
          });
          pointBiggers.forEach(point => {
            point.attr('r', 0);
          });


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
              defaultStyles()
            }
            break;
          case "hover_addedge":
            if (value) {
              hover_addedge()
            } else {
              defaultStyles()
            }
            break;
          case "hover_changeedgesource":
            if (value) {
              hover_changeedgesource()
            } else {
              defaultStyles()
            }
            break;

        }
      }
    });
  }
}

export default customToolNode
