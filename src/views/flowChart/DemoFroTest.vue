<template>
  <div style="position: relative;width:100%;margin: 10px">

    <div class="editor" style="width: 1400px;height:800px;">
      <Editor
        ref="flowchart"
        @openNodeConfig="openNodeConfig"
        @openEdgeConfig="openEdgeConfig"
      ></Editor>
    </div>
    <el-drawer
      title=""
      :with-header="false"
      :visible.sync="nodeDrawer"
      direction="rtl"
    >
      <span>节点设置</span>
      <div style="height: 50px"></div>

      <el-form label-width="130px">
        <el-form-item label="id">
          <el-input
            type="textarea"
            placeholder="请输入内容"
            v-model="nodeId">
          </el-input>
        </el-form-item>
        <el-form-item label="type">
          <el-input
            type="textarea"
            placeholder="请输入内容"
            v-model="nodeType">
          </el-input>
        </el-form-item>
        <el-form-item label="x">
          <el-input
            type="textarea"
            placeholder="请输入内容"
            v-model="nodeX">
          </el-input>
        </el-form-item>
        <el-form-item label="y">
          <el-input
            type="textarea"
            placeholder="请输入内容"
            v-model="nodeY">
          </el-input>
        </el-form-item>
        <el-form-item label="title">
          <el-input
            type="textarea"
            placeholder="请输入内容"
            v-model="nodeTitle">
          </el-input>
        </el-form-item>


        <el-form-item v-for="item in nodeExtraInfo" :label="item.key">
          <el-input
            type="textarea"
            placeholder="请输入内容"
            v-model="item.value">
          </el-input>
        </el-form-item>

        <div style="background: #F0F0F0;height: 2px;margin-top: 10px;margin-bottom: 10px"></div>

        <el-form-item label="新增属性">
          <el-col :span="11">
            <el-input
              type="textarea"
              placeholder="请输入key"
              v-model="nodeAddInfo.key">
            </el-input>
          </el-col>
          <el-col class="line" :span="2">-</el-col>
          <el-col :span="11">
            <el-input
              type="textarea"
              placeholder="请输入value"
              v-model="nodeAddInfo.value">
            </el-input>
          </el-col>
        </el-form-item>
      </el-form>

      <div style="height: 50px"></div>
      <el-button type="primary" @click="doUpdateNode">确定</el-button>
      <el-button type="primary" @click="drawerCancel">取消</el-button>
    </el-drawer>
    <el-drawer
      title=""
      :with-header="false"
      :visible.sync="edgeDrawer"
      direction="rtl"
    >
      <span>连线设置</span>
      <div style="height: 50px"></div>
      <el-form label-width="130px">
        <el-form-item label="id">
          <el-input
            type="textarea"
            placeholder="请输入内容"
            v-model="edgeId">
          </el-input>
        </el-form-item>
        <el-form-item label="type">
          <el-input
            type="textarea"
            placeholder="请输入内容"
            v-model="edgeType">
          </el-input>
        </el-form-item>
        <el-form-item label="source">
          <el-input
            type="textarea"
            placeholder="请输入内容"
            v-model="edgeSource">
          </el-input>
        </el-form-item>
        <el-form-item label="target">
          <el-input
            type="textarea"
            placeholder="请输入内容"
            v-model="edgeTarget">
          </el-input>
        </el-form-item>
        <el-form-item label="sourceAnchorIndex">
          <el-input
            type="textarea"
            placeholder="请输入内容"
            v-model="edgeSourceAnchorIndex">
          </el-input>
        </el-form-item>
        <el-form-item label="targetAnchorIndex">
          <el-input
            type="textarea"
            placeholder="请输入内容"
            v-model="edgeTargetAnchorIndex">
          </el-input>
        </el-form-item>
        <el-form-item label="title">
          <el-input
            type="textarea"
            placeholder="请输入内容"
            v-model="edgeTitle">
          </el-input>
        </el-form-item>

        <el-form-item v-for="item in edgeExtraInfo" :label="item.key">
          <el-input
            type="textarea"
            placeholder="请输入内容"
            v-model="item.value">
          </el-input>
        </el-form-item>

        <div style="background: #F0F0F0;height: 2px;margin-top: 10px;margin-bottom: 10px"></div>

        <el-form-item label="新增属性">
          <el-col :span="11">
            <el-input
              type="textarea"
              placeholder="请输入key"
              v-model="edgeAddInfo.key">
            </el-input>
          </el-col>
          <el-col class="line" :span="2">-</el-col>
          <el-col :span="11">
            <el-input
              type="textarea"
              placeholder="请输入value"
              v-model="edgeAddInfo.value">
            </el-input>
          </el-col>
        </el-form-item>
      </el-form>

      <div style="height: 50px"></div>
      <el-button type="primary" @click="doUpdateEdge">确定</el-button>
      <el-button type="primary" @click="drawerCancel">取消</el-button>
    </el-drawer>


    <div style="margin-left: 10px;margin-bottom: 10px">
      <el-select v-model="currentMode" placeholder="请选择" @change="handleMode" style="margin-top: 20px">
        <el-option
          v-for="item in modeOptions"
          :key="item.value"
          :label="item.value"
          :value="item.value"
        >
        </el-option>
      </el-select>
      <el-button type="primary" @click="repaint">使用输入框中的数据重新画图</el-button>
      <el-button type="primary" @click="exportInfos">获取最新的节点和线的数据</el-button>
      <el-button type="primary" @click="clear">清空画布</el-button>
      <el-button type="primary" @click="screenFull">全屏</el-button>
    </div>
    <div style="display: flex;">
      <div style="width:900px;">
        <span>设置节点数据：</span>
        <el-input
          type="textarea"
          :rows="8"
          placeholder="请输入内容"
          v-model="useNodesStr">
        </el-input>
      </div>
      <div style="width:900px;">
        <span>设置连线数据：</span>
        <el-input
          type="textarea"
          :rows="8"
          placeholder="请输入内容"
          v-model="useEdgesStr">
        </el-input>
      </div>
    </div>


  </div>

</template>

<script>
    import Editor from './Editor/Index'


    export default {
        name: 'DemoForTest',
        components: {
            Editor
        },
        data() {
            return {


                nodeDrawer:false,
                nodeId:'',
                nodeType:'',
                nodeX:'',
                nodeY:'',
                nodeTitle:'',
                nodeExtraInfo:[],
                nodeAddInfo:{key: '', value:''},

                edgeDrawer: false,
                edgeId:'',
                edgeType:'',
                edgeSource:'',
                edgeTarget:'',
                edgeSourceAnchorIndex:'',
                edgeTargetAnchorIndex:'',
                edgeTitle:'',
                edgeExtraInfo:[],
                edgeAddInfo:{key: '', value:''},



                modeOptions:[{value: 'view'}, {value: 'edit'}],
                currentMode:'edit',

                useNodes:[
                    {id: 'start', type: 'start', x: 0, y: 0, title: '开始'},
                    {id: 'id1', type: 'userTask', x: 150, y: 150, title: '节点1'},
                    {id: 'id2', type: 'userTask', x: 300, y: 300, title: '节点2'},
                    {id: 'id3', type: 'userTask', x: 450, y: 450, title: '节点3'},
                    {id: 'id4', type: 'userTask', x: 600, y: 600, title: '节点4'},
                    {id: 'end', type: 'end', x: 750, y: 750, title: '结束'}],
                useEdges:[ {
                    id: 'edge1',
                    type: 'polyLine',
                    source: 'start',
                    target: 'id1',
                    sourceAnchorIndex: 1,
                    targetAnchorIndex: 2
                },
                    {
                        id: 'edge2',
                        type: 'polyLine',
                        source: 'id1',
                        target: 'id2',
                        sourceAnchorIndex: 1,
                        targetAnchorIndex: 2
                    },
                    {
                        id: 'edge3',
                        type: 'polyLine',
                        source: 'id2',
                        target: 'id3',
                        sourceAnchorIndex: 1,
                        targetAnchorIndex: 2
                    },
                    {
                        id: 'edge4',
                        type: 'polyLine',
                        source: 'id3',
                        target: 'id4',
                        sourceAnchorIndex: 1,
                        targetAnchorIndex: 2
                    },
                    {
                        id: 'edge5',
                        type: 'polyLine',
                        source: 'id4',
                        target: 'end',
                        sourceAnchorIndex: 1,
                        targetAnchorIndex: 2
                    },
                ],
                useNodesStr:'',
                useEdgesStr:'',
            }
        },
        created() {




        },
        mounted() {

            this.useNodesStr = JSON.stringify(this.useNodes).replace(new RegExp("{", "gm"), "\n{").replace(new RegExp("]", "gm"), "\n]");
            this.useEdgesStr = JSON.stringify(this.useEdges).replace(new RegExp("{", "gm"), "\n{").replace(new RegExp("]", "gm"), "\n]");


            this.$nextTick(()=>{
                this.$refs.flowchart.init();
                this.$refs.flowchart.resetNodesAndEdges(this.useNodes, this.useEdges);
            });
        },
        methods: {
            handleMode() {
                console.log('handleMode');
                this.$refs.flowchart.setMode(this.currentMode);
            },
            openNodeConfig(nodeId) {
                this.nodeId = '';
                this.nodeType = '';
                this.nodeX = '';
                this.nodeY = '';
                this.nodeTitle = '';
                this.nodeExtraInfo = [];
                this.nodeAddInfo = {key: '', value: ''};

                console.log('打开节点配置');
                let node = this.$refs.flowchart.getNodeConfigById(nodeId);
                this.nodeDrawer = true;
                if (node) {
                    Object.keys(node).forEach(key => {
                        if (key === 'id') {
                            this.nodeId = node[key];
                        } else if (key === 'type') {
                            this.nodeType = node[key];
                        } else if (key === 'x') {
                            this.nodeX = node[key];
                        } else if (key === 'y') {
                            this.nodeY = node[key];
                        } else if (key === 'title') {
                            this.nodeTitle = node[key];
                        } else if (key === 'shape') {
                        } else {
                            this.nodeExtraInfo.push({key: key, value: node[key]})
                        }
                    });

                }
            },
            openEdgeConfig(edgeId) {
                console.log('打开连线配置');

                this.edgeId = '';
                this.edgeType = '';
                this.edgeSource = '';
                this.edgeTarget = '';
                this.edgeSourceAnchorIndex = '';
                this.edgeTargetAnchorIndex = '';
                this.edgeTitle = '';
                this.edgeExtraInfo = [];
                this.edgeAddInfo = {key: '', value: ''};

                let edge = this.$refs.flowchart.getEdgeConfigById(edgeId);
                this.edgeDrawer = true;
                if (edge) {
                    Object.keys(edge).forEach(key => {
                        if (key === 'id') {
                            this.edgeId = edge[key];
                        } else if (key === 'type') {
                            this.edgeType = edge[key];
                        } else if (key === 'source') {
                            this.edgeSource = edge[key];
                        } else if (key === 'target') {
                            this.edgeTarget = edge[key];
                        } else if (key === 'sourceAnchorIndex') {
                            this.edgeSourceAnchorIndex = edge[key];
                        } else if (key === 'targetAnchorIndex') {
                            this.edgeTargetAnchorIndex = edge[key];
                        } else if (key === 'title') {
                            this.edgeTitle = edge[key];
                        } else if (key === 'shape') {
                        } else {
                            this.edgeExtraInfo.push({key: key, value: edge[key]})
                        }
                    });
                }

            },


            exportInfos() {
                console.log('导出节点和连线的配置');
                this.useNodes = this.$refs.flowchart.getNodesConfig();
                this.useEdges = this.$refs.flowchart.getEdgesConfig();
                this.useNodesStr = JSON.stringify(this.useNodes).replace(new RegExp("{", "gm"), "\n{").replace(new RegExp("]", "gm"), "\n]");
                this.useEdgesStr = JSON.stringify(this.useEdges).replace(new RegExp("{", "gm"), "\n{").replace(new RegExp("]", "gm"), "\n]");

            },
            repaint() {
                this.useNodes = JSON.parse(this.useNodesStr);
                this.useEdges = JSON.parse(this.useEdgesStr);
                this.$refs.flowchart.resetNodesAndEdges(this.useNodes, this.useEdges);
            },
            clear() {
                this.$refs.flowchart.clear();
            },
            screenFull(){
                this.$refs.flowchart.screenFull();
            },
            doUpdateNode() {
                let node = {};
                if (this.nodeId && this.nodeId !== '') {
                    node.id = this.nodeId;
                    if (this.nodeX && this.nodeX !== '') {
                        node.x = this.nodeX;
                    }
                    if (this.nodeY && this.nodeY !== '') {
                        node.y = this.nodeY;
                    }
                    if (this.nodeTitle !==null) {
                        node.title = this.nodeTitle;
                    }
                    if (this.nodeExtraInfo) {
                        this.nodeExtraInfo.forEach(info => {
                            if (info.value && info.value !== '') {
                                node[info.key] = info.value;
                            }
                        });
                    }
                    if (this.nodeAddInfo.key && this.nodeAddInfo.key !== ''
                        && this.nodeAddInfo.value && this.nodeAddInfo.value !== '') {
                        node[this.nodeAddInfo.key] = this.nodeAddInfo.value;
                    }
                    node.unConfigured = false;//已经配置了
                    this.$refs.flowchart.updateNodeConfig(node);
                }
                this.nodeDrawer = false;
            },
            doUpdateEdge() {
                let edge = {};
                if (this.edgeId && this.edgeId !== '') {
                    edge.id = this.edgeId;
                    if (this.edgeSource && this.edgeSource !== '') {
                        edge.source = this.edgeSource;
                    }
                    if (this.edgeTarget && this.edgeTarget !== '') {
                        edge.target = this.edgeTarget;
                    }
                    if (this.edgeSourceAnchorIndex && this.edgeSourceAnchorIndex !== '') {
                        edge.sourceAnchorIndex = this.edgeSourceAnchorIndex;
                    }
                    if (this.edgeTargetAnchorIndex && this.edgeTargetAnchorIndex !== '') {
                        edge.targetAnchorIndex = this.edgeTargetAnchorIndex;
                    }
                    if (this.edgeTitle && this.edgeTitle !== '') {
                        edge.title = this.edgeTitle;
                    }
                    if (this.edgeExtraInfo) {
                        this.edgeExtraInfo.forEach(info => {
                            if (info.value && info.value !== '') {
                                edge[info.key] = info.value;
                            }
                        });
                    }
                    if (this.edgeAddInfo.key && this.edgeAddInfo.key !== ''
                        && this.edgeAddInfo.value && this.edgeAddInfo.value !== '') {
                        edge[this.edgeAddInfo.key] = this.edgeAddInfo.value;
                    }
                    this.$refs.flowchart.updateEdgeConfig(edge);
                }

                this.edgeDrawer = false;
            },
            drawerCancel() {
                this.nodeDrawer = false;
                this.edgeDrawer = false;
            },
        }
    }

</script>
<style scoped>
  .editor {
    border-style: solid;
    border-color: #0000ff;
    border-width: 3px;
  }
</style>
