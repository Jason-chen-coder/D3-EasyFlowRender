import commonConfig from "../config/commonConfig";

const nodeTitleLengthLimit = 8;

export const getShowNodeTitle = function (title){
  let result = title;
  if(title==null){
    result = '';
  }
  if(result.length>nodeTitleLengthLimit){
    result = result.substring(0,nodeTitleLengthLimit-1)+'...';
  }
  return result;
}

export const getNodeToolTip = function (title){
  if(title && title.length>nodeTitleLengthLimit){
    return title;
  }
  return null;
}

/*
 计算连接点相对节点的偏移量
  预置的连线  ：pointOffset为null,nodeAnchorIndex不应为空，为空就默认选一个点
  拖动生成的连线：pointOffset不为null，nodeAnchorIndex为空
  */
export const getPointOffset = function (pointOffset, node, nodeAnchorIndex){
  let nodeModel = node.getModel();
  if(!pointOffset){

    let nodeAnchorPoint = commonConfig.node.anchorPoints[0];
    if(nodeAnchorIndex!=null){
      nodeAnchorPoint = commonConfig.node.anchorPoints[nodeAnchorIndex];
    }
//计算出锚点的具体坐标
    let nodeWidth = nodeModel.size[0];
    let nodeHeight = nodeModel.size[1];
    if (nodeModel.size.length == 1) {
      nodeHeight = nodeWidth;
    }
    pointOffset = {x:nodeWidth * nodeAnchorPoint[0] - nodeWidth / 2, y:nodeHeight * nodeAnchorPoint[1] - nodeHeight / 2};
  }
  return pointOffset;
}

export const getEdgeStartOrEndPoint = function (pointOffset, node, anchorIndex){
  let offset = getPointOffset(pointOffset, node, anchorIndex);
  return {
    x: Math.round(node.getModel().x + offset.x),
    y: Math.round(node.getModel().y + offset.y)
  }
}

//深拷贝
export const deepCopy = function (obj){
  let tmp = JSON.stringify(obj);
  return JSON.parse(tmp);

  // var copy = Object.create(Object.getPrototypeOf(obj));
  // var propNames = Object.getOwnPropertyNames(obj);
  // propNames.forEach(function(name) {
  //     var desc = Object.getOwnPropertyDescriptor(obj, name);
  //     Object.defineProperty(copy, name, desc);
  // });
  // return copy;
}

/**
 * [generateUUID 返回一串序列码]
 * @return {String} [uuid]
 */
export const generateUUID = function () {
  var d = new Date().getTime();
  var uuid = 'xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = (d + Math.random() * 16) % 16 | 0;
    d = Math.floor(d / 16);
    return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
  });
  return uuid;
}


/**
 * 判断两个数组是否相同
 * @return boolean
 */
export const isArrayEqual = function (arr1 = [],arr2 = []){
  if(arr1 instanceof Array && arr2 instanceof Array && arr1.length === arr2.length){
    return JSON.stringify(arr1.sort()) == JSON.stringify(arr2.sort())
  }else{
    return false;
  }
}
