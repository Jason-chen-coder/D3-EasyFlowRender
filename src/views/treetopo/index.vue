<template>
  <div>
    <button @click="turnDir('LR')">从左至右</button>
    <button @click="turnDir('RL')">从右至左</button>
    <button @click="turnDir('TB')">从上至下</button>
    <button @click="turnDir('BT')">从下至上</button>
    <br />
    <el-dialog
      center
      title="节点详情"
      :visible.sync="dialogVisible"
      width="50%"
      @closed="subDialogVisible = false"
      @open="subDialogVisible = true"
    >
      <sub-topo v-if="subDialogVisible" />
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = false"
          >确 定</el-button
        >
      </span>
    </el-dialog>
    <svg width="1800" height="700">
      <g />
    </svg>
  </div>
</template>

<script>
import list from "../../jsondata/treetopo"
import dagreD3 from "dagre-d3";
import * as d3 from "d3";
import subTopo from "./component/subtopo"
import $ from "jquery"
export default {
  components: {
    subTopo
  },
  data () {
    return {
      dialogVisible: false,
      subDialogVisible: false,
      direction: "TB"
    };
  },
  methods: {
    turnDir (dir) {
      this.direction = dir
      this.drawTopo()
    },
    drawTopo () {
      //获取D3
      var g = new dagreD3.graphlib.Graph().setGraph({
        rankdir: this.direction,
        edgesep: 50,
        ranksep: 50
      }).setDefaultEdgeLabel(function () { return {}; });
      function drawNode (arr) {
        // 添加节点(设置节点的特性)
        arr.forEach((item) => {
          g.setNode(item.id, { labelType: "html", label: `<i class="${item.type} ${item.isFinished ? "finished" : "unfinished"}"><b>${item.label}</b></i>` });
        });
      }
      drawNode(list.nodeInfos)

      // 链接关系(连线的属性)
      function drawLine (arr, color, opacity, textobj) {
        arr.forEach((item, index) => {
          g.setEdge(item.source, item.target, {
            label: textobj[index],
            lineInterpolate: 'basis',
            class: `${item.source}-${item.target}`,
            style: `stroke: ${color}; fill: none;opacity:${opacity}`,
            arrowheadStyle: `fill: ${color};stroke: ${color};stroke-width:0.1`,
            arrowhead: 'vee',
            id: "status" + index
          });
        });
      }
      drawLine(list.edges, '#7c7c7c', 1, list.dataFlow);
      // g.nodes().forEach(function (v) {
      //   console.log("Node " + v + ": " + JSON.stringify(g.node(v)));

      // });
      // g.edges().forEach(function (e) {
      //   console.log("Edge " + e.v + " -> " + e.w + ": " + JSON.stringify(g.edge(e)));
      // });

      //绘制图形
      var svg = d3.select("svg"),
        inner = svg.select("g");

      //缩放
      var zoom = d3.zoom().on("zoom", function () {
        inner.attr("transform", d3.event.transform);
      });
      svg.call(zoom);
      var render = new dagreD3.render();
      render(inner, g);
      // let code;
      //鼠标悬浮事件
      inner.selectAll("g.node").on("mouseover", e => {
        // 先获取所有的线段,并将这些线段都设置透明度为0.2
        $(`g.edgePath`).attr("style", "opacity:0.2")
        // 当前的节点名字为e,将所有与e有关的线段添加类名active,进行高亮显示
        list.edges.forEach(item => {
          $(`.${e}-${item.target}`).addClass("active")
          $(`.${item.target}-${e}`).addClass("active2")
          $(`.${e}-${item.source}`).addClass("active")
          $(`.${item.source}-${e}`).addClass("active")
        })
      }).on("click ", () => {
        this.dialogVisible = true
        this.subDialogVisible = true
        // d3.event.sourceEvent.stopPropagation();
        return false
      }).on("mouseout", () => {
        drawLine(list.edges, '#7c7c7c', 1, list.dataFlow);
        var render = new dagreD3.render();
        render(inner, g);
      })
      var initialScale = 1;
      svg.call(
        zoom.transform,
        d3.zoomIdentity
          .translate(
            (svg.attr("width") - g.graph().width * initialScale) / 2,
            50
          )
          .scale(initialScale)
      );
      svg.attr("height", g.graph().height * initialScale + 40);
    }
  },
  mounted () {
    this.drawTopo()
  }
};
</script>

<style lang="less">
svg {
  font-size: 14px;
  border: 1px solid #000;
}

foreignObject {
  width: 50px;
  height: 63px;
  background-color: transparent;
}
.node circle,
.node ellipse,
.node rect {
  fill: transparent;
  stroke-width: 0px;
  stroke: red;
}
.nodes .node rect {
  width: 70px;
  height: 70px;
}
.edgePath path {
  width: 0;
  stroke: #606266;
  fill: #333;
  stroke-width: 1.5px;
}
.database,
.defend,
.service {
  display: inline-block;
  width: 40px;
  height: 40px;
  background-size: contain;
  position: relative;
  overflow: visible;
  background-repeat: no-repeat;
  b {
    position: absolute;
    bottom: -25px;
    left: 50%;
    transform: translateX(-50%);
    font-style: normal;
  }
}
.active,
.active2 {
  stroke-width: 2px;
  opacity: 1 !important;
  path {
    stroke: #f48771 !important;
  }
}
.active2 {
  path {
    stroke: green !important;
  }
}

.database {
  background-image: url("../../assets/database.png");
}
.defend {
  background-image: url("../../assets/defend.png");
}
.service {
  background-image: url("../../assets/service.png");
}
.finished::before {
  content: "√";
  display: inline-block;
  width: 50%;
  height: 50%;
  border-radius: 50%;
  background-color: green;
  position: absolute;
  bottom: 0;
  left: -5px;
  color: #fff;
  text-align: center;
  line-height: 160%;
  font-size: 16px;
}
</style>