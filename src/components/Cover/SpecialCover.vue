<script setup>
import { useRouter } from "vue-router";
import { NGrid, NGi, NSkeleton, NCard } from "naive-ui";
import specialCoverCard from "@/components/Cover/SpecialCoverCard.vue";
import { computed } from "vue";

const router = useRouter();

// eslint-disable-next-line no-unused-vars
const props = defineProps({
  // 是否循环
  cycle: {
    type: Boolean,
    default: false,
  },
  // 展示数据
  data: {
    // type: [Object, Array],
    default: { name: "每日推荐", desc: "根据你的音乐口味，每日更新" },
    // required: true,
  },
  // 显示歌曲
  showSongs: {
    type: Boolean,
    default: false,
  },
  // 高度
  height: {
    type: String,
    default: "100px",
  },
  // 自定义列数
  columns: {
    type: String,
    default: "1 s:2 l:3 xl:4",
  },
  // 加载占位数量
  loadSize: {
    type: Number,
    default: 4,
  },
  // 显示图标
  showIcon: {
    type: Boolean,
    default: true,
  },
  // 显示日期
  showDate: {
    type: Boolean,
    default: false,
  },
});

// 链接跳转
const jumpLink = (id) => {
  if (!id) return false;
  router.push({
    path: "/playlist",
    query: { id },
  });
};

const data = computed(() => props.data);
</script>
<!-- 封面 - 特殊 -->
<template>
  <div class="all-cover">
    <specialCoverCard
      :data="data"
      :height="height"
      :showSongs="showSongs"
      :showIcon="showIcon"
      :showDate="showDate"
    />
  </div>
</template>

<style lang="scss" scoped></style>
