/**
 * 修改自  https://github.com/caoyu48/vue-g6-editor
 * 用于连线过程中的虚线
 */

import G6 from "@antv/g6/build/g6";

const customLinkEdge = {
  init(editor) {
    G6.registerEdge('customLinkEdge', {
      draw(cfg, group) {
        let path = []
        path = [
          ['M', cfg.source.x, cfg.source.y],
          ['L', cfg.target.x, cfg.target.y]
        ]
        const keyShape = group.addShape('path', {
          attrs: {
            path: path,
            stroke: '#1890FF',
            strokeOpacity: 0.9,
            lineDash: [5, 5]
          }
        });
        return keyShape
      },
    });
  }
}

export default customLinkEdge
