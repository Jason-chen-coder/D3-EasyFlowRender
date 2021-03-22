<template>
  <div id="app">
    <button>
      <h1>
        <router-link class="links" to="topoindex">topo</router-link>
      </h1>
    </button>
    &nbsp;
    <button>
      <h1>
        <router-link class="links" to="treetopo">treetopo</router-link>
      </h1>
    </button>

    <br />
    <br />
    <br />
    <router-view></router-view>
  </div>
</template>

<script>

export default {
  name: 'App'
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
  height: 100%;
}
.links {
  text-decoration: none;
  padding: 20px;
}
button {
  margin: 0 40px;
}
</style>
