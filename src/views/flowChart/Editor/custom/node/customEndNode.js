import G6 from "@antv/g6/build/g6";
import commonConfig from "../../config/commonConfig"
const config = {
  defaultSize:[80],
  title:'结束',
  ...commonConfig.node,
  deleteEnabled:false
};

const customEndNode = {
  init(editor) {
    G6.registerNode("customEndNode", {
      draw(cfg, group) {
        let currentMode = editor.getCurrentMode();

        let r =  parseInt(config.defaultSize[0]/2);
        cfg.size = [2*r];


        const shape = group.addShape("circle", {//这个是主图形
          attrs: {
            id: cfg.id,
            x: 0,
            y: 0,
            r: r,
            isMain:true,
            stroke: config.strokeColor_grey,
            fill: '#fff',//此处必须有fill 不然不能触发事件
            lineDash: [4, 4],//虚线
            lineWidth: config.lineWidth_thin,
          }
        });
        group.addShape("circle", {
          attrs: {
            x: 0,
            y: 0,
            r: parseInt(r * 0.8),
            fill: config.centerColor_blue,
          }
        });
        group.addShape("text", {
          attrs: {
            x: 0,
            y: 0,
            textAlign: "center",
            textBaseline: "middle",
            text: config.title,
            fill: config.centerColor_white,
            fontSize: 18,
            fontWeight:'bolder'//最粗的字体
          }
        });
        group.addShape("circle", {//加一个透明的图形解决点击有的地方不好拖动的问题
          attrs: {
            x: 0,
            y: 0,
            r: r,
            fill: '#fff',//此处必须有fill 不然不能触发事件
            opacity: 0,
            cursor:'move',
          }
        });
        if(config.deleteByIcon && config.deleteEnabled && currentMode === 'edit') {
          const offset_ = parseInt(0.8 * r);
          group.addShape("circle", {//删除的按钮
            attrs: {
              x: offset_,
              y: -offset_,
              r: config.defaultDeleteR,
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
              x: offset_,
              y: -offset_ + 0.95,
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
                x: parseInt(config.anchorPoints[i][0] * 2 * r - r),
                y: parseInt(config.anchorPoints[i][1] * 2 * r - r),
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
                x: parseInt(config.anchorPoints[i][0] * 2 * r - r),
                y: parseInt(config.anchorPoints[i][1] * 2 * r - r),
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
        const group = item.getContainer();
        const shape = group.findAll(point => {
          return point._attrs.isMain;
        })[0];
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

          deleteButtons.forEach(button => {
            button.attr('opacity', 1);
            button.attr('enabled',true);
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
        let hover_addedge = () => {
          points.forEach(point => {
            point.attr('r', config.anchorR);
            point.attr('fill', config.anchorColor_grey);
          });
          pointBiggers.forEach(point => {
            point.attr('r', config.anchorR*3);
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
        }
      }
    });
  }
}
export default customEndNode
