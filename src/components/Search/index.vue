<script setup>
import { ref } from "vue";
import { NInput, NIcon } from "naive-ui";
import { ManageSearchRound } from "@vicons/material";
import { useRouter } from "vue-router";

const router = useRouter();
const key = ref("");
const search = () => {
  router.push({
    name: "search",
    query: {
      key: key.value,
    },
  });
};
</script>
<template>
  <div class="music-search">
    <n-input placeholder="搜索" round v-model:value="key" @keyup.enter="search">
      <template #prefix>
        <n-icon size="25" :component="ManageSearchRound" />
      </template>
    </n-input>
  </div>
</template>
<style lang="scss">
.music-search {
  width: 100%;
  display: flex;
  justify-content: center;

  .n-input {
    width: 90%;
  }
}
</style>
