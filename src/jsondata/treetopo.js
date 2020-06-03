let list = {
  nodeInfos: [
    {
      id: "node1",
      label: "组件1",
      type: "service",
      isFinished: false
    }, {
      id: "node2",
      label: "组件2",
      type: "defend",
      isFinished: true
    }, {
      id: "node3",
      label: "组件3",
      type: "defend",
      isFinished: false
    }, {
      id: "node4",
      label: "组件4",
      type: "service",
      isFinished: true
    }, {
      id: "node5",
      label: "组件5",
      type: "service",
      isFinished: false
    }, {
      id: "node6",
      label: "组件6",
      type: "defend",
      isFinished: true
    }, {
      id: "node7",
      label: "组件7",
      type: "database",
      isFinished: false
    }, {
      id: "node8",
      label: "组件8",
      type: "database",
      isFinished: false
    }, {
      id: "node9",
      label: "组件9",
      type: "service",
      isFinished: false
    }, {
      id: "node10",
      label: "组件10",
      type: "service",
      isFinished: true
    }, {
      id: "node11",
      label: "组件11",
      type: "defend",
      isFinished: false
    }, {
      id: "node12",
      label: "组件12",
      type: "service",
      isFinished: false
    }, {
      id: "node13",
      label: "组件13",
      type: "service",
      isFinished: true
    }, {
      id: "node14",
      label: "组件14",
      type: "service",
      isFinished: false
    },
  ],
  edges: [
    {
      source: "node1",
      target: "node2",
    },
    {
      source: "node1",
      target: "node5",
    },
    {
      source: "node1",
      target: "node6",
    },
    {
      source: "node2",
      target: "node2",
    },
    {
      source: "node2",
      target: "node3",
    },
    {
      source: "node2",
      target: "node4",
    },
    {
      source: "node2",
      target: "node4",
    },
    {
      source: "node1",
      target: "node4",
    },
    {
      source: "node7",
      target: "node1",
    },
    {
      source: "node8",
      target: "node8",
    },
    {
      source: "node1",
      target: "node9",
    },
    {
      source: "node4",
      target: "node11",
    },
    {
      source: "node1",
      target: "node10",
    },
    {
      source: "node1",
      target: "node12",
    },
    {
      source: "node10",
      target: "node13",
    },
    {
      source: "node4",
      target: "node14",
    },
    {
      source: "node8",
      target: "node10",
    }, {
      source: "node14",
      target: "node7",
    }
  ],
  dataFlow: {
    0: '配置完成',
    1: '待配置',
    2: '配置完成',
    3: '待配置',
    4: '待配置',
    5: '待配置',
    6: '配置完成',
    7: '配置完成',
    8: '待配置',
    9: '待配置',
    10: '待配置',
    11: '待配置',
    12: '配置完成',
    13: '待配置',
    14: '配置完成',
    15: '待配置',
    16: '配置完成',
    17: '待配置',
  }
}
export default list