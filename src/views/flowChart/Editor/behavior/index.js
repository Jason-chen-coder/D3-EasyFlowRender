import G6 from "@antv/g6/build/g6";

import addLine from './add-edge';
import editControl from './edit-control';

const behavors = {

  'edit-control': editControl,
  'add-edge': addLine,
};

export function initBehavors() {
  for (let key in behavors) {
    G6.registerBehavior(key, behavors[key])
  }
}
export function clearTempState(graph) {
  for (let key in behavors) {
    behavors[key].clearTempState(graph);
  }
}


