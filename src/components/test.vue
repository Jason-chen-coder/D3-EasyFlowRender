<template>
  <div>{{subvalue}}</div>
</template>
<script>
export default {
  props: ["subvalue"],
  created () {
    console.log(this.subvalue)
  },
  beforeUpdate () {
    console.log(this.subvalue)
  }
}
</script>
<style >
</style>