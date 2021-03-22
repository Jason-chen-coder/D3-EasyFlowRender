let options = {
  data: [
    {
      type: 'app',              // 节点类型
      name: 'monitor-app',      // 节点名称
      active: 9,                // 已完成数
      total: 10,                // 总数
      health: 1,                // 监控健康程度
      underText: 'underText',   // 节点之间连接线下方的文字
      upwardText: "upwardText", // 节点之间连接线上方的文字
      isConfig: "true"          // 节点配置状态
    },
    {
      type: 'app',
      name: 'monitor-app2',
      active: 1,
      total: 10,
      health: 3,
      underText: 'underText',
      upwardText: "upwardText",
      isConfig: "true"
    },
    {
      type: 'database',
      name: 'Mysql',
      active: 3,
      total: 5,
      health: 2,
      underText: 'underText',
      upwardText: "upwardText",
      isConfig: "false"
    },
    {
      type: 'cloud',
      name: 'Redis',
      active: 3,
      total: 5,
      health: 3,
      underText: 'underText',
      upwardText: "upwardText",
      isConfig: "false"
    },
    {
      type: 'earth',
      name: 'ES',
      active: 3,
      total: 5,
      health: 1,
      underText: 'underText',
      upwardText: "upwardText",
      value: 100,
      isConfig: "false"
    },
    {
      type: 'earth',
      name: 'Redis',
      active: 3,
      total: 5,
      health: 3,
      underText: 'underText',
      upwardText: "upwardText",
      isConfig: "true"
    },
    {
      type: 'myapp',
      name: 'AKA',
      active: 3,
      total: 5,
      code: 'Python',
      health: 1,
      underText: 'underText',
      upwardText: "upwardText",
      value: 10,
      isConfig: "true"
    }
  ],
  edges: [
    {
      source: 0,  // 连接线起点(数值对应data数组中的元素)
      target: 3,  // 连接线终点(数值对应data数组中的元素)
    },
    {
      source: 1,
      target: 2,
    },
    {
      source: 1,
      target: 6,
    },
    {
      source: 1,
      target: 3,
    },
    {
      source: 0,
      target: 1,
    },
    {
      source: 4,
      target: 5,
    },
    {
      source: 1,
      target: 2,
    },
    {
      source: 5,
      target: 2,
    }
  ]
}
export default options