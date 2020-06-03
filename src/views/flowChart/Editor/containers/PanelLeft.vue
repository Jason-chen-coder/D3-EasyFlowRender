/**
* Created by OXOYO on 2019/7/2.
*
* PanelLeft 左侧面板
*/


<template>
  <div id="panelleft" :style="'height: 100%;background: #f7f9fb;width: '+panelWidth+'px;padding: 10px;'" >
    <div v-for="(item,index) in nodes" style="width: 100%;text-align: center;padding-top: 10px;">
      <img
        @mousedown = "handleMouseDown($event,item)"
        :key="index"
        :src="item.image"
        :style="'width:'+item.width+'px;height:'+item.height+'px;cursor: move'">
    </div>

  </div>
</template>

<script>
  import eventBus from "../utils/eventBus";

  export default {

    name: 'PanelLeft',
    components: {
    },
    data () {
      return {
          panelWidth:150,//节点栏的宽度
          paddingNum:10,

          nodes: [
              {
                  type:"exclusiveGateway",
                  image:require('../../assets/images/branch.png'),
                  height:64,
                  width:64,
              },
              {
                  type:"userTask",
                  image:require('../../assets/images/tool.png'),
                  height:56,
                  width:104,
              },
          ],
      }
    },
    methods: {
        handleMouseDown(e, item) {
            e.preventDefault();
            eventBus.$emit('before_add_node', item.type)
        },

    }
  }
</script>
