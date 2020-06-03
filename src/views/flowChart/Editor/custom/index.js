/**
 * 注册自定义节点和边
 */

import customStartNode from './node/customStartNode'
import customEndNode from './node/customEndNode'

import customParallelNode from './node/customParallelNode'//并行网关
import customBranchlNode from './node/customBranchNode'//分支网关mpo
import customToolNode from './node/customToolNode'//工具

import customPolyEdge from './edge/customPolyEdge'
import customLinkEdge from './edge/customLinkEdge'

const obj = {

  customStartNode,
  customEndNode,
  customParallelNode,
  customBranchlNode,
  customToolNode,
  customPolyEdge,
  customLinkEdge,
}

export default function (editor) {
  Object.values(obj).map(item => {
    item.init(editor);
  })
}
