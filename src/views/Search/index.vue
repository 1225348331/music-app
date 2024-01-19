<script setup>
import { ref } from "vue";
import { NTabs, NTabPane } from "naive-ui";
import Song from "./song/index.vue";
import Artist from "./artist/index.vue";
import Album from "./album/index.vue";
import { useRoute } from "vue-router";
const route = useRoute();
</script>
<template>
  <div class="searchResult">
    <div class="head">
      <span>{{ route.query.key }}</span
      >的相关搜索
    </div>
    <n-tabs
      animated
      justify-content="space-evenly"
      :pane-style="{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }"
      class="tab"
      type="segment"
    >
      <n-tab-pane name="song" tab="单曲"><Song /></n-tab-pane>
      <n-tab-pane name="artist" tab="歌手"><Artist /></n-tab-pane>
      <n-tab-pane name="album" tab="专辑"><Album /></n-tab-pane>
    </n-tabs>
  </div>
</template>
<style lang="scss">
.searchResult {
  height: 100%;
  width: 100%;
  .head {
    margin-bottom: 20px;
    span {
      font-size: 30px;
    }
  }
}
</style>
