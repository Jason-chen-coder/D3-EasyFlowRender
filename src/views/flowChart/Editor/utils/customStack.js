const items = new WeakMap();

export default class Stack {
  constructor () {
    items.set(this, []);
  }

  push(element) {
    let s = items.get(this);
    s.push(element);
  }

  pop() {
    let s = items.get(this);
    return s.pop();
  }

  peek() {
    let s = items.get(this);
    return s[s.length - 1];
  }

  isEmpty() {
    return items.get(this).length === 0;
  }

  size() {
    return items.get(this).length;
  }

  clear() {
    items.set(this, []);
  }

  print() {
    console.log(items.get(this).toString());
  }
}
