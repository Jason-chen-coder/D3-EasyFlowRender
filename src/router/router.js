import Vue from "vue"
import VueRouter from "vue-router"
import topoindex from "../views/topo/index.vue"
import treetopo from "../views/treetopo/index.vue"
Vue.use(VueRouter)
export default new VueRouter({
  routes: [
    {
      path: '/topoindex',
      name: "topoindex",
      component: topoindex
    },
    {
      path: '/treetopo',
      name: "treetopo",
      component: treetopo
    },
  ]
})