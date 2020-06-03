export default {
  node :{
    anchorPoints:[[0.5, 0],[0.5, 1],[0, 0.5],[1, 0.5]],//上，下，左，右
    anchorR:5,
    defaultDeleteR:8,

    anchorColor_blue:'#3688ed',//锚点颜色
    anchorColor_grey:'#e1e4e8',//锚点颜色
    anchorBiggerOpacity:'0.3',//锚点外面大的圈圈的透明度

    strokeColor_grey:'#b5b9c0',//边的灰色
    strokeColor_blue:'#64a1ec',//边的蓝色

    centerColor_blue:'#53699d',//内部的颜色
    centerColor_white:'#fff',//内部的颜色

    lineWidth_thin:1,
    lineWidth_bolder:2,

    deleteByIcon:false,

  },
  edge:{
    strokeColor_grey:'#b8c3ce',//线的颜色
    strokeColor_blue:'#64a1ec',//线的颜色

    strokeWidth_thin: 2,
    strokeWidth_bolder: 2,

    deleteByIcon:false
  }
}
