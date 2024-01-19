<script setup>
import { ref } from "vue";
</script>
<template>
  <div class="test">
    <div class="test1"></div>
    <div class="test2"></div>
  </div>
</template>
<style lang="scss" scoped>
.test {
  background-color: aqua;
  height: 400px;
  .test1 {
    width: 100%;
    height: 100px;
    background-color: cadetblue;
  }
  .test2 {
    width: 50%;
    height: 100px;
    background-color: red;
  }
}
</style>
