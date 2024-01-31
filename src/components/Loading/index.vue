<script setup>
import { ref } from "vue";
import { NImage } from "naive-ui";
</script>
<template>
  <div class="loadingContainer">
    <n-image width="400" preview-disabled src="/src/assets/loading.gif" />
  </div>
</template>
<style lang="scss" scoped>
.loadingContainer {
  display: flex;
  justify-content: center;
  margin-top: 100px;
}
</style>
