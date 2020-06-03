/**
 *
 * @param startPoint
 * @param endPoint
 * @param startAnchorIndex
 * @param endAnchorIndex
 * @param minLength
 * @returns {[]}
 */

import commonConfig from "../../config/commonConfig";

// 折线寻径
export const customPolylineFinding = function (startPoint, endPoint, startAnchorIndex, endAnchorIndex, minLength=40) {

  let distanceX = parseInt(Math.abs(endPoint.x - startPoint.x) / 2);
  let distanceY = parseInt(Math.abs(endPoint.y - startPoint.y) / 2);
  let result = [startPoint];
  if(startPoint.x === endPoint.x && startPoint.y > endPoint.y){//开始节点在结束节点的正下方
    if(startAnchorIndex === 0 && endAnchorIndex === 1){//开始朝上，结束朝下
    }else if(startAnchorIndex === 0 && endAnchorIndex === 0){//开始朝上，结束朝上
      result.push({x:startPoint.x, y:startPoint.y-minLength});
      result.push({x:startPoint.x-minLength, y:startPoint.y-minLength});
      result.push({x:endPoint.x-minLength, y:endPoint.y-minLength});
      result.push({x:endPoint.x, y:endPoint.y-minLength});
    }else if(startAnchorIndex === 0 && endAnchorIndex === 2){
      result.push({x:startPoint.x, y:startPoint.y-minLength});
      result.push({x:startPoint.x-minLength, y:startPoint.y-minLength});
      result.push({x:endPoint.x-minLength, y:endPoint.y});
    }else if(startAnchorIndex === 0 && endAnchorIndex === 3){
      result.push({x:startPoint.x, y:startPoint.y-minLength});
      result.push({x:startPoint.x+minLength, y:startPoint.y-minLength});
      result.push({x:endPoint.x+minLength, y:endPoint.y});
    }

    else if(startAnchorIndex === 1 && endAnchorIndex === 0){
      result.push({x:startPoint.x, y:startPoint.y+minLength});
      result.push({x:startPoint.x-minLength, y:startPoint.y+minLength});
      result.push({x:endPoint.x-minLength, y:endPoint.y-minLength});
      result.push({x:endPoint.x, y:endPoint.y-minLength});
    }else if(startAnchorIndex === 1 && endAnchorIndex === 1){
      result.push({x:startPoint.x, y:startPoint.y+minLength});
      result.push({x:startPoint.x-minLength, y:startPoint.y+minLength});
      result.push({x:endPoint.x-minLength, y:endPoint.y+minLength});
      result.push({x:endPoint.x, y:endPoint.y+minLength});
    }else if(startAnchorIndex === 1 && endAnchorIndex === 2){
      result.push({x:startPoint.x, y:startPoint.y+minLength});
      result.push({x:startPoint.x-minLength, y:startPoint.y+minLength});
      result.push({x:endPoint.x-minLength, y:endPoint.y});
    }else if(startAnchorIndex === 1 && endAnchorIndex === 3){
      result.push({x:startPoint.x, y:startPoint.y+minLength});
      result.push({x:startPoint.x+minLength, y:startPoint.y+minLength});
      result.push({x:endPoint.x+minLength, y:endPoint.y});
    }

    else if(startAnchorIndex === 2 && endAnchorIndex === 0){
      result.push({x:startPoint.x-minLength, y:startPoint.y});
      result.push({x:endPoint.x-minLength, y:endPoint.y-minLength});
      result.push({x:endPoint.x, y:endPoint.y-minLength});
    }else if(startAnchorIndex === 2 && endAnchorIndex === 1){
      result.push({x:startPoint.x-minLength, y:startPoint.y});
      result.push({x:endPoint.x-minLength, y:endPoint.y+minLength});
      result.push({x:endPoint.x, y:endPoint.y+minLength});
    }else if(startAnchorIndex === 2 && endAnchorIndex === 2){
      result.push({x:startPoint.x-minLength, y:startPoint.y});
      result.push({x:endPoint.x-minLength, y:endPoint.y});
    }else if(startAnchorIndex === 2 && endAnchorIndex === 3){
      result.push({x:startPoint.x-minLength, y:startPoint.y});
      if(distanceY>=minLength){
        result.push({x:startPoint.x-minLength, y:startPoint.y-distanceY});
        result.push({x:endPoint.x+minLength, y:endPoint.y+distanceY});
      }else{
        result.push({x:startPoint.x-minLength, y:endPoint.y-minLength});
        result.push({x:endPoint.x+minLength, y:endPoint.y-minLength});
      }
      result.push({x:endPoint.x+minLength, y:endPoint.y});
    }


    else if(startAnchorIndex === 3 && endAnchorIndex === 0){
      result.push({x:startPoint.x+minLength, y:startPoint.y});
      result.push({x:startPoint.x+minLength, y:endPoint.y-minLength});
      result.push({x:endPoint.x, y:endPoint.y-minLength});
    }else if(startAnchorIndex === 3 && endAnchorIndex === 1){
      result.push({x:startPoint.x+minLength, y:startPoint.y});
      result.push({x:startPoint.x+minLength, y:endPoint.y+minLength});
      result.push({x:endPoint.x, y:endPoint.y+minLength});
    }else if(startAnchorIndex === 3 && endAnchorIndex === 2){
      result.push({x:startPoint.x+minLength, y:startPoint.y});

      if(distanceY>=minLength){
        result.push({x:startPoint.x+minLength, y:startPoint.y-distanceY});
        result.push({x:endPoint.x-minLength, y:endPoint.y+distanceY});
      }else{
        result.push({x:startPoint.x+minLength, y:endPoint.y-minLength});
        result.push({x:endPoint.x-minLength, y:endPoint.y-minLength});
      }
      result.push({x:endPoint.x-minLength, y:endPoint.y});
    }else if(startAnchorIndex === 3 && endAnchorIndex === 3){
      result.push({x:startPoint.x+minLength, y:startPoint.y});
      result.push({x:endPoint.x+minLength, y:endPoint.y});
    }
  }else if(startPoint.x === endPoint.x && startPoint.y < endPoint.y){//开始节点在结束节点的正上方
    if(startAnchorIndex === 0 && endAnchorIndex === 0) {//开始朝上，结束朝上
      result.push({x:startPoint.x, y:startPoint.y-minLength});
      result.push({x:startPoint.x-minLength, y:startPoint.y-minLength});
      result.push({x:endPoint.x-minLength, y:endPoint.y-minLength});
      result.push({x:endPoint.x, y:endPoint.y-minLength});
    }else if(startAnchorIndex === 0 && endAnchorIndex === 1){
      result.push({x:startPoint.x, y:startPoint.y-minLength});
      result.push({x:startPoint.x-minLength, y:startPoint.y-minLength});
      result.push({x:endPoint.x-minLength, y:endPoint.y+minLength});
      result.push({x:endPoint.x, y:endPoint.y+minLength});
    }else if(startAnchorIndex === 0 && endAnchorIndex === 2){
      result.push({x:startPoint.x, y:startPoint.y-minLength});
      result.push({x:startPoint.x-minLength, y:startPoint.y-minLength});
      result.push({x:endPoint.x-minLength, y:endPoint.y});
    }else if(startAnchorIndex === 0 && endAnchorIndex === 3){
      result.push({x:startPoint.x, y:startPoint.y-minLength});
      result.push({x:startPoint.x+minLength, y:startPoint.y-minLength});
      result.push({x:endPoint.x+minLength, y:endPoint.y});
    }

    else if(startAnchorIndex === 1 && endAnchorIndex === 0){
    }else if(startAnchorIndex === 1 && endAnchorIndex === 1){
      result.push({x:startPoint.x, y:startPoint.y+minLength});
      result.push({x:startPoint.x-minLength, y:startPoint.y+minLength});
      result.push({x:endPoint.x-minLength, y:endPoint.y+minLength});
      result.push({x:endPoint.x, y:endPoint.y+minLength});
    }else if(startAnchorIndex === 1 && endAnchorIndex === 2){
      result.push({x:startPoint.x, y:startPoint.y+minLength});
      result.push({x:startPoint.x-minLength, y:startPoint.y+minLength});
      result.push({x:endPoint.x-minLength, y:endPoint.y});
    }else if(startAnchorIndex === 1 && endAnchorIndex === 3) {
      result.push({x:startPoint.x, y:startPoint.y+minLength});
      result.push({x:startPoint.x+minLength, y:startPoint.y+minLength});
      result.push({x:endPoint.x+minLength, y:endPoint.y});
    }

    else if(startAnchorIndex === 2 && endAnchorIndex === 0){
      result.push({x:startPoint.x-minLength, y:startPoint.y});
      result.push({x:endPoint.x-minLength, y:endPoint.y-minLength});
      result.push({x:endPoint.x, y:endPoint.y-minLength});
    }else if(startAnchorIndex === 2 && endAnchorIndex === 1){
      result.push({x:startPoint.x-minLength, y:startPoint.y});
      result.push({x:endPoint.x-minLength, y:endPoint.y+minLength});
      result.push({x:endPoint.x, y:endPoint.y+minLength});
    }else if(startAnchorIndex === 2 && endAnchorIndex === 2){
      result.push({x:startPoint.x-minLength, y:startPoint.y});
      result.push({x:endPoint.x-minLength, y:endPoint.y});
    }else if(startAnchorIndex === 2 && endAnchorIndex === 3) {
      result.push({x:startPoint.x-minLength, y:startPoint.y});
      if(distanceY>=minLength){
        result.push({x:startPoint.x-minLength, y:startPoint.y+distanceY});
        result.push({x:endPoint.x+minLength, y:startPoint.y+distanceY});
      }else{
        result.push({x:startPoint.x-minLength, y:startPoint.y-minLength});
        result.push({x:startPoint.x+minLength, y:startPoint.y-minLength});
      }
      result.push({x:endPoint.x+minLength, y:endPoint.y});
    }

    else if(startAnchorIndex === 3 && endAnchorIndex === 0){
      result.push({x:startPoint.x+minLength, y:startPoint.y});
      result.push({x:endPoint.x+minLength, y:endPoint.y-minLength});
      result.push({x:endPoint.x, y:endPoint.y-minLength});
    }else if(startAnchorIndex === 3 && endAnchorIndex === 1){
      result.push({x:startPoint.x+minLength, y:startPoint.y});
      result.push({x:endPoint.x+minLength, y:endPoint.y+minLength});
      result.push({x:endPoint.x, y:endPoint.y+minLength});
    }else if(startAnchorIndex === 3 && endAnchorIndex === 2){
      result.push({x:startPoint.x+minLength, y:startPoint.y});
      if(distanceY>=minLength) {
        result.push({x:startPoint.x+minLength, y:startPoint.y+distanceY});
        result.push({x:endPoint.x-minLength, y:startPoint.y+distanceY});
      }else {
        result.push({x:startPoint.x+minLength, y:startPoint.y-minLength});
        result.push({x:startPoint.x-minLength, y:startPoint.y-minLength});
      }
      result.push({x:endPoint.x-minLength, y:endPoint.y});
    }else if(startAnchorIndex === 3 && endAnchorIndex === 3) {
      result.push({x:startPoint.x+minLength, y:startPoint.y});
      result.push({x:endPoint.x+minLength, y:endPoint.y});
    }


  }else if(startPoint.x < endPoint.x && startPoint.y === endPoint.y){//开始节点在结束节点的正左方
    if(startAnchorIndex === 0 && endAnchorIndex === 0) {//开始朝上，结束朝上
      result.push({x:startPoint.x, y:startPoint.y-minLength});
      result.push({x:endPoint.x, y:endPoint.y-minLength});
    }else if(startAnchorIndex === 0 && endAnchorIndex === 1){
      result.push({x:startPoint.x, y:startPoint.y-minLength});
      if(distanceX>=minLength){
        result.push({x:startPoint.x+distanceX, y:startPoint.y-minLength});
        result.push({x:startPoint.x+distanceX, y:endPoint.y+minLength});
      }else{
        result.push({x:endPoint.x+minLength, y:startPoint.y-minLength});
        result.push({x:endPoint.x+minLength, y:endPoint.y+minLength});
      }
      result.push({x:endPoint.x, y:endPoint.y+minLength});
    }else if(startAnchorIndex === 0 && endAnchorIndex === 2){
      result.push({x:startPoint.x, y:startPoint.y-minLength});
      result.push({x:endPoint.x-minLength, y:startPoint.y-minLength});
      result.push({x:endPoint.x-minLength, y:endPoint.y});
    }else if(startAnchorIndex === 0 && endAnchorIndex === 3) {
      result.push({x:startPoint.x, y:startPoint.y-minLength});
      result.push({x:endPoint.x+minLength, y:startPoint.y-minLength});
      result.push({x:endPoint.x+minLength, y:endPoint.y});
    }


    else if (startAnchorIndex === 1 && endAnchorIndex === 0) {
      result.push({x:startPoint.x, y:startPoint.y+minLength});
      if(distanceX>=minLength){
        result.push({x:startPoint.x+distanceX, y:startPoint.y+minLength});
        result.push({x:startPoint.x+distanceX, y:endPoint.y-minLength});
      }else{
        result.push({x:endPoint.x+minLength, y:startPoint.y+minLength});
        result.push({x:endPoint.x+minLength, y:endPoint.y-minLength});
      }
      result.push({x:endPoint.x, y:endPoint.y-minLength});
    } else if (startAnchorIndex === 1 && endAnchorIndex === 1) {
      result.push({x:startPoint.x, y:startPoint.y+minLength});
      result.push({x:endPoint.x, y:endPoint.y+minLength});
    } else if (startAnchorIndex === 1 && endAnchorIndex === 2) {
      result.push({x:startPoint.x, y:startPoint.y+minLength});
      result.push({x:endPoint.x-minLength, y:startPoint.y+minLength});
      result.push({x:endPoint.x-minLength, y:endPoint.y});
    } else if (startAnchorIndex === 1 && endAnchorIndex === 3) {
      result.push({x:startPoint.x, y:startPoint.y+minLength});
      result.push({x:endPoint.x+minLength, y:startPoint.y+minLength});
      result.push({x:endPoint.x+minLength, y:endPoint.y});
    }

    else if(startAnchorIndex === 2 && endAnchorIndex === 0) {
      result.push({x:startPoint.x-minLength, y:startPoint.y});
      result.push({x:startPoint.x-minLength, y:startPoint.y-minLength});
      result.push({x:endPoint.x, y:startPoint.y-minLength});
    }else if(startAnchorIndex === 2 && endAnchorIndex === 1){
      result.push({x:startPoint.x-minLength, y:startPoint.y});
      result.push({x:startPoint.x-minLength, y:startPoint.y+minLength});
      result.push({x:endPoint.x, y:startPoint.y+minLength});
    }else if(startAnchorIndex === 2 && endAnchorIndex === 2){
      result.push({x:startPoint.x-minLength, y:startPoint.y});
      result.push({x:startPoint.x-minLength, y:startPoint.y-minLength});
      result.push({x:endPoint.x-minLength, y:startPoint.y-minLength});
      result.push({x:endPoint.x-minLength, y:endPoint.y});
    }else if(startAnchorIndex === 2 && endAnchorIndex === 3){
      result.push({x:startPoint.x-minLength, y:startPoint.y});
      result.push({x:startPoint.x-minLength, y:startPoint.y-minLength});
      result.push({x:endPoint.x+minLength, y:startPoint.y-minLength});
      result.push({x:endPoint.x+minLength, y:endPoint.y});
    }

    else if(startAnchorIndex === 3 && endAnchorIndex === 0) {
      result.push({x:startPoint.x+minLength, y:startPoint.y});
      result.push({x:startPoint.x+minLength, y:endPoint.y-minLength});
      result.push({x:endPoint.x, y:endPoint.y-minLength});
    }else if(startAnchorIndex === 3 && endAnchorIndex === 1){
      result.push({x:startPoint.x+minLength, y:startPoint.y});
      result.push({x:startPoint.x+minLength, y:endPoint.y+minLength});
      result.push({x:endPoint.x, y:endPoint.y+minLength});
    }else if(startAnchorIndex === 3 && endAnchorIndex === 2){
    }else if(startAnchorIndex === 3 && endAnchorIndex === 3){
      result.push({x:startPoint.x+minLength, y:startPoint.y});
      result.push({x:startPoint.x+minLength, y:endPoint.y-minLength});
      result.push({x:endPoint.x+minLength, y:endPoint.y-minLength});
      result.push({x:endPoint.x+minLength, y:endPoint.y});
    }

  }else if(startPoint.x > endPoint.x && startPoint.y === endPoint.y){//开始节点在结束节点的正右方
      if(startAnchorIndex === 0 && endAnchorIndex === 0){
        result.push({x:startPoint.x, y:startPoint.y-minLength});
        result.push({x:endPoint.x, y:startPoint.y-minLength});
      }else if(startAnchorIndex === 0 && endAnchorIndex === 1){
        result.push({x:startPoint.x, y:startPoint.y-minLength});
        if(distanceX>=minLength){
          result.push({x:startPoint.x-distanceX, y:startPoint.y-minLength});
          result.push({x:startPoint.x-distanceX, y:endPoint.y+minLength});
        }else{
          result.push({x:startPoint.x+minLength, y:startPoint.y-minLength});
          result.push({x:startPoint.x+minLength, y:endPoint.y+minLength});
        }
        result.push({x:endPoint.x, y:endPoint.y+minLength});
      }else if(startAnchorIndex === 0 && endAnchorIndex === 2){
        result.push({x:startPoint.x, y:startPoint.y-minLength});
        result.push({x:endPoint.x-minLength, y:startPoint.y-minLength});
        result.push({x:endPoint.x-minLength, y:endPoint.y});
      }else if(startAnchorIndex === 0 && endAnchorIndex === 3){
        result.push({x:startPoint.x, y:startPoint.y-minLength});
        result.push({x:endPoint.x+minLength, y:startPoint.y-minLength});
        result.push({x:endPoint.x+minLength, y:endPoint.y});
      }

      else if(startAnchorIndex === 1 && endAnchorIndex === 0){
        result.push({x:startPoint.x, y:startPoint.y+minLength});
        if(distanceX>=minLength){
          result.push({x:startPoint.x-distanceX, y:startPoint.y+minLength});
          result.push({x:startPoint.x-distanceX, y:endPoint.y-minLength});
        }else{
          result.push({x:endPoint.x-minLength, y:startPoint.y+minLength});
          result.push({x:endPoint.x-minLength, y:endPoint.y-minLength});
        }
        result.push({x:endPoint.x, y:endPoint.y-minLength});
      }else if(startAnchorIndex === 1 && endAnchorIndex === 1){
        result.push({x:startPoint.x, y:startPoint.y+minLength});
        result.push({x:endPoint.x, y:endPoint.y+minLength});
      }else if(startAnchorIndex === 1 && endAnchorIndex === 2){
        result.push({x:startPoint.x, y:startPoint.y+minLength});
        result.push({x:endPoint.x-minLength, y:startPoint.y+minLength});
        result.push({x:endPoint.x-minLength, y:endPoint.y});
      }else if(startAnchorIndex === 1 && endAnchorIndex === 3){
        result.push({x:startPoint.x, y:startPoint.y+minLength});
        result.push({x:endPoint.x+minLength, y:startPoint.y+minLength});
        result.push({x:endPoint.x+minLength, y:endPoint.y});
      }

      else if(startAnchorIndex === 2 && endAnchorIndex === 0){
        result.push({x:startPoint.x-minLength, y:startPoint.y});
        result.push({x:startPoint.x-minLength, y:endPoint.y-minLength});
        result.push({x:endPoint.x, y:endPoint.y-minLength});
      }else if(startAnchorIndex === 2 && endAnchorIndex === 1){
        result.push({x:startPoint.x-minLength, y:startPoint.y});
        result.push({x:startPoint.x-minLength, y:endPoint.y+minLength});
        result.push({x:endPoint.x, y:endPoint.y+minLength});
      }else if(startAnchorIndex === 2 && endAnchorIndex === 2){
        result.push({x:startPoint.x-minLength, y:startPoint.y});
        result.push({x:startPoint.x-minLength, y:startPoint.y-minLength});
        result.push({x:endPoint.x-minLength, y:startPoint.y-minLength});
        result.push({x:endPoint.x-minLength, y:endPoint.y});
      }else if(startAnchorIndex === 2 && endAnchorIndex === 3){
      }

      else if(startAnchorIndex === 3 && endAnchorIndex === 0){
        result.push({x:startPoint.x+minLength, y:startPoint.y});
        result.push({x:startPoint.x+minLength, y:endPoint.y-minLength});
        result.push({x:startPoint.x, y:endPoint.y-minLength});
      }else if(startAnchorIndex === 3 && endAnchorIndex === 1){
        result.push({x:startPoint.x+minLength, y:startPoint.y});
        result.push({x:startPoint.x+minLength, y:endPoint.y+minLength});
        result.push({x:startPoint.x, y:endPoint.y+minLength});
      }else if(startAnchorIndex === 3 && endAnchorIndex === 2){
        result.push({x:startPoint.x+minLength, y:startPoint.y});
        result.push({x:startPoint.x+minLength, y:startPoint.y-minLength});
        result.push({x:endPoint.x-minLength, y:startPoint.y-minLength});
        result.push({x:endPoint.x-minLength, y:endPoint.y});
      }else if(startAnchorIndex === 3 && endAnchorIndex === 3){
        result.push({x:startPoint.x+minLength, y:startPoint.y});
        result.push({x:startPoint.x+minLength, y:startPoint.y-minLength});
        result.push({x:endPoint.x+minLength, y:startPoint.y-minLength});
        result.push({x:endPoint.x+minLength, y:endPoint.y});
      }
  }else if(startPoint.x > endPoint.x && startPoint.y > endPoint.y){//开始节点在结束节点的右下
    if(startAnchorIndex === 0 && endAnchorIndex === 0){
      result.push({x:startPoint.x, y:endPoint.y-minLength});
      result.push({x:endPoint.x, y:endPoint.y-minLength});
    }else if(startAnchorIndex === 0 && endAnchorIndex === 1){
      result.push({x:startPoint.x, y:startPoint.y-distanceY});
      result.push({x:endPoint.x, y:startPoint.y-distanceY});
    }else if(startAnchorIndex === 0 && endAnchorIndex === 2){
      if(distanceY>=minLength){//开始在右下
        result.push({x:startPoint.x, y:startPoint.y-distanceY});
        result.push({x:endPoint.x-minLength, y:startPoint.y-distanceY});
        result.push({x:endPoint.x-minLength, y:endPoint.y});
      }else{
        result.push({x:startPoint.x, y:endPoint.y-minLength});
        result.push({x:endPoint.x-minLength, y:endPoint.y-minLength});
        result.push({x:endPoint.x-minLength, y:endPoint.y});
      }
    }else if(startAnchorIndex === 0 && endAnchorIndex === 3){
      result.push({x:startPoint.x, y:endPoint.y});
    }


    else if(startAnchorIndex === 1 && endAnchorIndex === 0){
      if(distanceX>=minLength){//开始在右下
        result.push({x:startPoint.x, y:startPoint.y+minLength});
        result.push({x:startPoint.x-distanceX, y:startPoint.y+minLength});
        result.push({x:startPoint.x-distanceX, y:endPoint.y-minLength});
        result.push({x:endPoint.x, y:endPoint.y-minLength});
      }else{
        result.push({x:startPoint.x, y:startPoint.y+minLength});
        result.push({x:endPoint.x-minLength, y:startPoint.y+minLength});
        result.push({x:endPoint.x-minLength, y:endPoint.y-minLength});
        result.push({x:endPoint.x, y:endPoint.y-minLength});
      }
    }else if(startAnchorIndex === 1 && endAnchorIndex === 1){
      result.push({x:startPoint.x, y:startPoint.y+minLength});
      result.push({x:endPoint.x, y:startPoint.y+minLength});
    }else if(startAnchorIndex === 1 && endAnchorIndex === 2){
      result.push({x:startPoint.x, y:startPoint.y+minLength});
      result.push({x:endPoint.x-minLength, y:startPoint.y+minLength});
      result.push({x:endPoint.x-minLength, y:endPoint.y});
    }else if(startAnchorIndex === 1 && endAnchorIndex === 3){
      if(distanceX>=minLength) {//开始在右下
        result.push({x:startPoint.x, y:startPoint.y+minLength});
        result.push({x:startPoint.x-distanceX, y:startPoint.y+minLength});
        result.push({x:startPoint.x-distanceX, y:endPoint.y});
      }else{
        result.push({x:startPoint.x, y:startPoint.y+minLength});
        result.push({x:startPoint.x+minLength, y:startPoint.y+minLength});
        result.push({x:startPoint.x+minLength, y:endPoint.y});
      }
    }


    else if(startAnchorIndex === 2 && endAnchorIndex === 0){
      if(distanceX>=minLength) {//开始在右下
        result.push({x:startPoint.x-distanceX, y:startPoint.y});
        result.push({x:startPoint.x-distanceX, y:endPoint.y-minLength});
        result.push({x:endPoint.x, y:endPoint.y-minLength});
      }else{
        result.push({x:endPoint.x-minLength, y:startPoint.y});
        result.push({x:endPoint.x-minLength, y:endPoint.y});
      }
    }else if(startAnchorIndex === 2 && endAnchorIndex === 1){
      result.push({x:endPoint.x, y:startPoint.y});
    }else if(startAnchorIndex === 2 && endAnchorIndex === 2){
      result.push({x:endPoint.x-minLength, y:startPoint.y});
      result.push({x:endPoint.x-minLength, y:endPoint.y});
    }else if(startAnchorIndex === 2 && endAnchorIndex === 3){
      result.push({x:startPoint.x-distanceX, y:startPoint.y});
      result.push({x:startPoint.x-distanceX, y:endPoint.y});
    }


    else if(startAnchorIndex === 3 && endAnchorIndex === 0){
      result.push({x:startPoint.x+minLength, y:startPoint.y});
      result.push({x:startPoint.x+minLength, y:endPoint.y-minLength});
      result.push({x:endPoint.x, y:endPoint.y-minLength});
    }else if(startAnchorIndex === 3 && endAnchorIndex === 1){
      result.push({x:startPoint.x+minLength, y:startPoint.y});
      if(distanceY>=minLength) {//开始在右下
        result.push({x:startPoint.x+minLength, y:startPoint.y-distanceY});
        result.push({x:endPoint.x, y:startPoint.y-distanceY});
      }else{
        result.push({x:startPoint.x+minLength, y:startPoint.y+minLength});
        result.push({x:endPoint.x, y:startPoint.y+minLength});
      }
    }else if(startAnchorIndex === 3 && endAnchorIndex === 2){

      result.push({x:startPoint.x+minLength, y:startPoint.y});
      if(distanceY>=minLength) {//开始在右下
        result.push({x:startPoint.x+minLength, y:startPoint.y-distanceY});
        result.push({x:endPoint.x-minLength, y:startPoint.y-distanceY});
      }else{
        result.push({x:startPoint.x+minLength, y:endPoint.y-minLength});
        result.push({x:endPoint.x-minLength, y:endPoint.y-minLength});
      }
      result.push({x:endPoint.x-minLength, y:endPoint.y});
    }else if(startAnchorIndex === 3 && endAnchorIndex === 3){
      result.push({x:startPoint.x+minLength, y:startPoint.y});
      result.push({x:startPoint.x+minLength, y:endPoint.y});
    }
  }else if(startPoint.x > endPoint.x && startPoint.y < endPoint.y){//开始节点在结束节点的右上
    if (startAnchorIndex === 0 && endAnchorIndex === 0) {
      result.push({x:startPoint.x, y:startPoint.y-minLength});
      result.push({x:endPoint.x, y:startPoint.y-minLength});
    } else if (startAnchorIndex === 0 && endAnchorIndex === 1) {
      result.push({x:startPoint.x, y:startPoint.y-minLength});
      if(distanceX>=minLength) {//开始在右上
        result.push({x:startPoint.x-distanceX, y:startPoint.y-minLength});
        result.push({x:startPoint.x-distanceX, y:endPoint.y+minLength});
      }else{
        result.push({x:endPoint.x-minLength, y:startPoint.y-minLength});
        result.push({x:endPoint.x-minLength, y:endPoint.y+minLength});
      }
      result.push({x:endPoint.x, y:endPoint.y+minLength});
    } else if (startAnchorIndex === 0 && endAnchorIndex === 2) {
      result.push({x:startPoint.x, y:startPoint.y-minLength});
      result.push({x:endPoint.x-minLength, y:startPoint.y-minLength});
      result.push({x:endPoint.x-minLength, y:endPoint.y});
    } else if (startAnchorIndex === 0 && endAnchorIndex === 3) {
      result.push({x:startPoint.x, y:startPoint.y-minLength});
      if(distanceX>=minLength) {//开始在右上
        result.push({x:startPoint.x-distanceX, y:startPoint.y-minLength});
        result.push({x:startPoint.x-distanceX, y:endPoint.y});
      }else {
        result.push({x:startPoint.x+minLength, y:startPoint.y-minLength});
        result.push({x:startPoint.x+minLength, y:endPoint.y});
      }
    }


    else if (startAnchorIndex === 1 && endAnchorIndex === 0) {
      result.push({x:startPoint.x, y:startPoint.y+distanceY});
      result.push({x:endPoint.x, y:startPoint.y+distanceY});
    } else if (startAnchorIndex === 1 && endAnchorIndex === 1) {
      result.push({x:startPoint.x, y:endPoint.y+minLength});
      result.push({x:endPoint.x, y:endPoint.y+minLength});
    } else if (startAnchorIndex === 1 && endAnchorIndex === 2) {
      if(distanceY>=minLength) {//开始在右上
        result.push({x:startPoint.x, y:startPoint.y+distanceY});
        result.push({x:endPoint.x-minLength, y:startPoint.y+distanceY});
      }else{
        result.push({x:startPoint.x, y:endPoint.y+minLength});
        result.push({x:endPoint.x-minLength, y:endPoint.y+minLength});
      }
      result.push({x:endPoint.x-minLength, y:endPoint.y});
    } else if (startAnchorIndex === 1 && endAnchorIndex === 3) {
      result.push({x:startPoint.x, y:endPoint.y});
    }

    else if (startAnchorIndex === 2 && endAnchorIndex === 0) {
      result.push({x:endPoint.x, y:startPoint.y});
    } else if (startAnchorIndex === 2 && endAnchorIndex === 1) {
      if(distanceX>=minLength) {//开始在右上
        result.push({x:startPoint.x-distanceX, y:startPoint.y});
        result.push({x:startPoint.x-distanceX, y:endPoint.y+minLength});
      }else{
        result.push({x:endPoint.x-minLength, y:startPoint.y});
        result.push({x:endPoint.x-minLength, y:endPoint.y+minLength});
      }
      result.push({x:endPoint.x, y:endPoint.y+minLength});
    } else if (startAnchorIndex === 2 && endAnchorIndex === 2) {
      result.push({x:endPoint.x-minLength, y:startPoint.y});
      result.push({x:endPoint.x-minLength, y:endPoint.y});
    } else if (startAnchorIndex === 2 && endAnchorIndex === 3) {
      result.push({x:startPoint.x-distanceX, y:startPoint.y});
      result.push({x:startPoint.x-distanceX, y:endPoint.y});
    }


    else if (startAnchorIndex === 3 && endAnchorIndex === 0) {
      result.push({x:startPoint.x+minLength, y:startPoint.y});
      result.push({x:startPoint.x+minLength, y:endPoint.y-minLength});
      result.push({x:endPoint.x, y:endPoint.y-minLength});
    } else if (startAnchorIndex === 3 && endAnchorIndex === 1) {
      result.push({x:startPoint.x+minLength, y:startPoint.y});
      result.push({x:startPoint.x+minLength, y:endPoint.y+minLength});
      result.push({x:endPoint.x, y:endPoint.y+minLength});
    } else if (startAnchorIndex === 3 && endAnchorIndex === 2) {
      result.push({x:startPoint.x+minLength, y:startPoint.y});
      if(distanceY>=minLength) {//开始在右上
        result.push({x:startPoint.x+minLength, y:startPoint.y+distanceY});
        result.push({x:endPoint.x-minLength, y:startPoint.y+distanceY});
      }else{
        result.push({x:startPoint.x+minLength, y:endPoint.y+minLength});
        result.push({x:endPoint.x-minLength, y:endPoint.y+minLength});
      }
      result.push({x:endPoint.x-minLength, y:endPoint.y});
    } else if (startAnchorIndex === 3 && endAnchorIndex === 3) {
      result.push({x:startPoint.x+minLength, y:startPoint.y});
      result.push({x:startPoint.x+minLength, y:endPoint.y});
    }

  }else if(startPoint.x < endPoint.x && startPoint.y > endPoint.y){//开始节点在结束节点的左下
    if (startAnchorIndex === 0 && endAnchorIndex === 0) {
      result.push({x:startPoint.x, y:endPoint.y-minLength});
      result.push({x:endPoint.x, y:endPoint.y-minLength});
    } else if (startAnchorIndex === 0 && endAnchorIndex === 1) {
      result.push({x:startPoint.x, y:startPoint.y-distanceY});
      result.push({x:endPoint.x, y:startPoint.y-distanceY});
    } else if (startAnchorIndex === 0 && endAnchorIndex === 2) {
      result.push({x:startPoint.x, y:endPoint.y});
    } else if (startAnchorIndex === 0 && endAnchorIndex === 3) {
      if(distanceY>=minLength){
        result.push({x:startPoint.x, y:startPoint.y-distanceY});
        result.push({x:endPoint.x+minLength, y:startPoint.y-distanceY});
      }else{
        result.push({x:startPoint.x, y:endPoint.y-minLength});
        result.push({x:endPoint.x+minLength, y:endPoint.y-minLength});
      }
      result.push({x:endPoint.x+minLength, y:endPoint.y});
    }


    else if (startAnchorIndex === 1 && endAnchorIndex === 0) {
      result.push({x:startPoint.x, y:startPoint.y+minLength});
      if(distanceX>=minLength){
        result.push({x:startPoint.x+distanceX, y:startPoint.y+minLength});
        result.push({x:startPoint.x+distanceX, y:endPoint.y-minLength});
      } else {
        result.push({x:endPoint.x+minLength, y:startPoint.y+minLength});
        result.push({x:endPoint.x+minLength, y:endPoint.y-minLength});
      }
      result.push({x:endPoint.x, y:endPoint.y-minLength});
    } else if (startAnchorIndex === 1 && endAnchorIndex === 1) {
      result.push({x:startPoint.x, y:startPoint.y+minLength});
      result.push({x:endPoint.x, y:startPoint.y+minLength});
    } else if (startAnchorIndex === 1 && endAnchorIndex === 2) {
      result.push({x:startPoint.x, y:startPoint.y+minLength});
      if(distanceX>=minLength){
        result.push({x:startPoint.x+distanceX, y:startPoint.y+minLength});
        result.push({x:startPoint.x+distanceX, y:endPoint.y});
      }else{
        result.push({x:startPoint.x-minLength, y:startPoint.y+minLength});
        result.push({x:startPoint.x-minLength, y:endPoint.y});
      }
    } else if (startAnchorIndex === 1 && endAnchorIndex === 3) {
      result.push({x:startPoint.x, y:startPoint.y+minLength});
      result.push({x:endPoint.x+minLength, y:startPoint.y+minLength});
      result.push({x:endPoint.x+minLength, y:endPoint.y});
    }


    else if (startAnchorIndex === 2 && endAnchorIndex === 0) {
      result.push({x:startPoint.x-minLength, y:startPoint.y});
      result.push({x:startPoint.x-minLength, y:endPoint.y-minLength});
      result.push({x:endPoint.x, y:endPoint.y-minLength});
    } else if (startAnchorIndex === 2 && endAnchorIndex === 1) {
      result.push({x:startPoint.x-minLength, y:startPoint.y});
      if(distanceY>=minLength){
        result.push({x:startPoint.x-minLength, y:startPoint.y-distanceY});
        result.push({x:endPoint.x, y:startPoint.y-distanceY});
      }else{
        result.push({x:startPoint.x-minLength, y:startPoint.y+minLength});
        result.push({x:endPoint.x, y:startPoint.y+minLength});
      }
    } else if (startAnchorIndex === 2 && endAnchorIndex === 2) {
      result.push({x:startPoint.x-minLength, y:startPoint.y});
      result.push({x:startPoint.x-minLength, y:endPoint.y});
    } else if (startAnchorIndex === 2 && endAnchorIndex === 3) {
      result.push({x:startPoint.x-minLength, y:startPoint.y});
      if(distanceY>=minLength){
        result.push({x:startPoint.x-minLength, y:startPoint.y-distanceY});
        result.push({x:endPoint.x+minLength, y:startPoint.y-distanceY});
      }else{
        result.push({x:startPoint.x-minLength, y:startPoint.y+minLength});
        result.push({x:endPoint.x+minLength, y:startPoint.y+minLength});
      }
      result.push({x:endPoint.x+minLength, y:endPoint.y});
    }


    else if (startAnchorIndex === 3 && endAnchorIndex === 0) {
      if(distanceX>=minLength){
        result.push({x:startPoint.x+distanceX, y:startPoint.y});
        result.push({x:startPoint.x+distanceX, y:endPoint.y-minLength});
      }else{
        result.push({x:endPoint.x+minLength, y:startPoint.y});
        result.push({x:endPoint.x+minLength, y:endPoint.y-minLength});
      }
      result.push({x:endPoint.x, y:endPoint.y-minLength});
    } else if (startAnchorIndex === 3 && endAnchorIndex === 1) {
      result.push({x:endPoint.x, y:startPoint.y});
    } else if (startAnchorIndex === 3 && endAnchorIndex === 2) {
      result.push({x:startPoint.x+distanceX, y:startPoint.y});
      result.push({x:startPoint.x+distanceX, y:endPoint.y});
    } else if (startAnchorIndex === 3 && endAnchorIndex === 3) {
      result.push({x:endPoint.x+minLength, y:startPoint.y});
      result.push({x:endPoint.x+minLength, y:endPoint.y});
    }

  }else if(startPoint.x < endPoint.x && startPoint.y < endPoint.y){//开始节点在结束节点的左上
    if (startAnchorIndex === 0 && endAnchorIndex === 0) {
      result.push({x:startPoint.x, y:startPoint.y-minLength});
      result.push({x:endPoint.x, y:startPoint.y-minLength});
    }else if (startAnchorIndex === 0 && endAnchorIndex === 1) {
      result.push({x:startPoint.x, y:startPoint.y-minLength});
      if(distanceX>=minLength){
        result.push({x:startPoint.x+distanceX, y:startPoint.y-minLength});
        result.push({x:startPoint.x+distanceX, y:endPoint.y+minLength});
      }else{
        result.push({x:endPoint.x+minLength, y:startPoint.y-minLength});
        result.push({x:endPoint.x+minLength, y:endPoint.y+minLength});
      }
      result.push({x:endPoint.x, y:endPoint.y+minLength});
    }else if (startAnchorIndex === 0 && endAnchorIndex === 2) {
      result.push({x:startPoint.x, y:startPoint.y-minLength});
      if(distanceX>=minLength){
        result.push({x:startPoint.x+distanceX, y:startPoint.y-minLength});
        result.push({x:startPoint.x+distanceX, y:endPoint.y});
      }else{
        result.push({x:startPoint.x-minLength, y:startPoint.y-minLength});
        result.push({x:startPoint.x-minLength, y:endPoint.y});
      }
    }else if (startAnchorIndex === 0 && endAnchorIndex === 3) {
      result.push({x:startPoint.x, y:startPoint.y-minLength});
      result.push({x:endPoint.x+minLength, y:startPoint.y-minLength});
      result.push({x:endPoint.x+minLength, y:endPoint.y});
    }

    else if (startAnchorIndex === 1 && endAnchorIndex === 0) {
      result.push({x:startPoint.x, y:startPoint.y+distanceY});
      result.push({x:endPoint.x, y:startPoint.y+distanceY});
    }else if (startAnchorIndex === 1 && endAnchorIndex === 1) {
      result.push({x:startPoint.x, y:endPoint.y+minLength});
      result.push({x:endPoint.x, y:endPoint.y+minLength});
    }else if (startAnchorIndex === 1 && endAnchorIndex === 2) {
      result.push({x:startPoint.x, y:endPoint.y});
    }else if (startAnchorIndex === 1 && endAnchorIndex === 3) {
      if(distanceY>=minLength){
        result.push({x:startPoint.x, y:startPoint.y+distanceY});
        result.push({x:endPoint.x+minLength, y:startPoint.y+distanceY});
      }else{
        result.push({x:startPoint.x, y:endPoint.y+minLength});
        result.push({x:endPoint.x+minLength, y:endPoint.y+minLength});
      }
      result.push({x:endPoint.x+minLength, y:endPoint.y});
    }


    else if (startAnchorIndex === 2 && endAnchorIndex === 0) {
      result.push({x:startPoint.x-minLength, y:startPoint.y});
      if(distanceY>=minLength){
        result.push({x:startPoint.x-minLength, y:startPoint.y+distanceY});
        result.push({x:endPoint.x, y:startPoint.y+distanceY});
      }else{
        result.push({x:startPoint.x-minLength, y:startPoint.y-minLength});
        result.push({x:endPoint.x, y:startPoint.y-minLength});
      }
    }else if (startAnchorIndex === 2 && endAnchorIndex === 1) {
      result.push({x:startPoint.x-minLength, y:startPoint.y});
      result.push({x:startPoint.x-minLength, y:endPoint.y+minLength});
      result.push({x:endPoint.x, y:endPoint.y+minLength});
    }else if (startAnchorIndex === 2 && endAnchorIndex === 2) {
      result.push({x:startPoint.x-minLength, y:startPoint.y});
      result.push({x:startPoint.x-minLength, y:endPoint.y});
    }else if (startAnchorIndex === 2 && endAnchorIndex === 3) {
      result.push({x:startPoint.x-minLength, y:startPoint.y});
      if(distanceY>=minLength){
        result.push({x:startPoint.x-minLength, y:startPoint.y+distanceY});
        result.push({x:endPoint.x+minLength, y:startPoint.y+distanceY});
      }else{
        result.push({x:startPoint.x-minLength, y:startPoint.y-minLength});
        result.push({x:endPoint.x+minLength, y:startPoint.y-minLength});
      }
      result.push({x:endPoint.x+minLength, y:endPoint.y});
    }


    else if (startAnchorIndex === 3 && endAnchorIndex === 0) {
      result.push({x:endPoint.x, y:startPoint.y});
    }else if (startAnchorIndex === 3 && endAnchorIndex === 1) {
      if(distanceX>=minLength){
        result.push({x:startPoint.x+distanceX, y:startPoint.y});
        result.push({x:startPoint.x+distanceX, y:endPoint.y+minLength});
      }else{
        result.push({x:endPoint.x+minLength, y:startPoint.y});
        result.push({x:endPoint.x+minLength, y:endPoint.y+minLength});
      }
      result.push({x:endPoint.x, y:endPoint.y+minLength});
    }else if (startAnchorIndex === 3 && endAnchorIndex === 2) {
      result.push({x:startPoint.x+distanceX, y:startPoint.y});
      result.push({x:startPoint.x+distanceX, y:endPoint.y});
    }else if (startAnchorIndex === 3 && endAnchorIndex === 3) {
      result.push({x:endPoint.x+minLength, y:startPoint.y});
      result.push({x:endPoint.x+minLength, y:endPoint.y});
    }
  }
  result.push(endPoint);
  return result;
}
