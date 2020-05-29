<template>
  <div id="app">
    <topo-index msg="Welcome to Your Vue.js App" />
  </div>
</template>

<script>
import TopoIndex from './components/topoindex'

export default {
  name: 'App',
  components: {
    TopoIndex
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
