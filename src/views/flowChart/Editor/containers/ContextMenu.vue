<template>
  <div>
    <ul class="context-menu" ref="contextMenu">
      <li
        v-for="menu in menus"
        :key="menu.key"
        @click="handleClick(menu)"
      >{{menu.name}}
      </li>
    </ul>
  </div>
</template>

<script>
    import eventBus from "../utils/eventBus";

    export default {
        name: "ContextMenu",
        data() {
            return {
                menus: [{key: 'delete', name: "删除"}],
                targetType:null,//node  edge
                targetId:null,
            };
        },
        created() {
            this.bindEvent();
        },
        methods: {
            init() {
            },
            bindEvent() {
                let that = this;
                eventBus.$on("showContextMenu", info => {
                        const menu = that.$refs.contextMenu;
                        menu.style.left = info.x + "px";
                        menu.style.top = info.y + "px";
                        menu.style.display = "block";
                        that.targetType = info.type;
                        that.targetId = info.id;
                });
                eventBus.$on("hideContextMenu", () => {
                    const menu = that.$refs.contextMenu;
                    if(menu){
                        menu.style.display = "none";
                    }
                    that.targetType = null;
                    that.targetId = null;
                });
            },
            handleClick(item) {
                if(item.key === 'delete'){
                    eventBus.$emit('delete_item',{ids:[this.targetId],type:this.targetType});
                }
                const menu = this.$refs.contextMenu;
                menu.style.display = "none";
                this.targetType = null;
                this.targetId = null;
            }
        }
    };
</script>

<style>
  .context-menu {
    position: absolute;
    border: 1px solid #e4e7ed;
    border-radius: 4px;
    background-color: #fff;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    box-sizing: border-box;
    margin: 5px;
    z-index: 1;
    display: none;
    /*display: block;*/
  }

  .context-menu li {
    padding: 5px 10px;
    cursor: pointer;
    font-size: 16px;
    line-height: 28px;
  }

  .context-menu li:hover {
    background-color: #f5f7fa;
  }
</style>
