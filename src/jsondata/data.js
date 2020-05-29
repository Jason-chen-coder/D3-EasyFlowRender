let __options = {
  data: [
    {
      type: 'app',
      name: 'monitor-web-server',
      time: 30,
      rpm: 40,
      epm: 50,
      active: 3,
      total: 5,
      code: 'java',
      health: 1,
      lineProtocol: 'http',
      lineTime: 12,
      lineRpm: 34,
      isConfig: "true"
    },
    {
      type: 'database',
      name: 'Mysql',
      time: 30,
      rpm: 40,
      epm: 50,
      active: 3,
      total: 5,
      code: 'java',
      health: 2,
      lineProtocol: 'http',
      lineTime: 12,
      lineRpm: 34,
      isConfig: "false"
    },
    {
      type: 'cloud',
      name: 'Redis',
      time: 30,
      rpm: 40,
      epm: 50,
      active: 3,
      total: 5,
      code: 'java',
      health: 3,
      lineProtocol: 'http',
      lineTime: 12,
      lineRpm: 34,
      isConfig: "false"
    },
    {
      type: 'earth',
      name: 'ES',
      time: 30,
      rpm: 40,
      epm: 50,
      active: 3,
      total: 5,
      code: 'java',
      health: 1,
      lineProtocol: 'http',
      lineTime: 12,
      lineRpm: 34,
      value: 100,
      isConfig: "false"
    },
    {
      type: 'earth',
      name: 'Redis',
      time: 30,
      rpm: 40,
      epm: 50,
      active: 3,
      total: 5,
      code: 'java',
      health: 3,
      lineProtocol: 'http',
      lineTime: 12,
      lineRpm: 34,
      isConfig: "true"
    },
    {
      type: 'myapp',
      name: 'AKA',
      time: 30,
      rpm: 40,
      epm: 50,
      active: 3,
      total: 5,
      code: 'Python',
      health: 1,
      lineProtocol: 'http',
      lineTime: 12,
      lineRpm: 34,
      value: 10,
      isConfig: "true"
    }
  ],
  edges: [
    {
      source: 0,
      target: 3,
    }, {
      source: 1,
      target: 2,
    }
    , {
      source: 1,
      target: 3,
    },
    {
      source: 0,
      target: 1,
    },
    {
      source: 0,
      target: 4,
    },
    {
      source: 1,
      target: 2,
    }, {
      source: 5,
      target: 2,
    }
  ]
}
export default __options