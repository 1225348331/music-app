<script setup>
import { computed, onBeforeMount, onMounted, ref } from "vue";
import { getUserPlaylist } from "@/api/user.js";
import { getMusicList } from "@/api/cover.js";
import useMusicStore from "@/store/music.js";
import useMainStore from "@/store/index.js";
import { HeadsetRound } from "@vicons/material";
import { playMusicList } from '@/utils/play-utils'

const musicStore = useMusicStore();
const mainStore = useMainStore();

// 总歌曲
const allCoverList = ref([]);
// 渲染的数据
const showCoverList = computed(() => {
  return allCoverList.value.slice(
    pageSize.value * (currentPage.value - 1),
    pageSize.value * currentPage.value
  );
});
// 当前页
const currentPage = ref(1);
// 每页显示数量
const pageSize = ref(18);
// 共几页
const pageNum = computed(() => {
  return Math.ceil(allCoverList.value.length / pageSize.value) || 1;
});

// 播放歌单
const playCover = async (cover) => {
  playMusicList(cover.id)
};

onMounted(async () => {
  let playlistRes = await getUserPlaylist(mainStore.userData.id);
  allCoverList.value = playlistRes.playlist;
});
</script>
<template>
  <div class="coverList">
    <div class="cover" v-for="item in showCoverList" @click="playCover(item)">
      <div class="img">
        <div class="playCount">
          <n-icon :component="HeadsetRound"></n-icon>
          {{ item.playCount }}
        </div>
        <img :src="item.coverImgUrl" alt="" />
      </div>
      <div style="max-width: 100%; font-size: 15px">
        {{ item.name }}
      </div>
      <n-ellipsis style="max-width: 100%; font-size: 12px; color: #838487">
        By{{ item.creator.nickname }}</n-ellipsis
      >
    </div>
    <n-pagination
      size="large"
      v-model:page="currentPage"
      :page-count="pageNum"
    />
  </div>
</template>
<style lang="scss" scoped>
.coverList {
  display: flex;
  flex-flow: row wrap;
  justify-content: space-between;
  height: 100%;
  margin-top: 20px;

  .cover {
    width: 210px;
    margin: 10px 0px;
    border-radius: 10px;
    cursor: pointer;
    display: flex;
    flex-flow: column nowrap;

    .img {
      width: 210px;
      height: 210px;
      border-radius: 8px;
      box-shadow: 0px 1px 1px 0px rgb(0, 0, 0, 0.1);
      overflow: hidden;
      position: relative;

      .playCount {
        position: absolute;
        display: flex;
        align-items: center;
        color: #fff;
        bottom: 0px;
        right: 0px;
        padding: 3px 8px;
        background-color: rgba(0, 24, 23, 0.5);
        border-top-left-radius: 8px;
        z-index: 1;
        .n-icon {
          margin-right: 3px;
        }
      }

      & > img {
        width: 100%;
        height: 100%;
        transition: transform 0.3s;

        &:hover {
          transform: scale(1.1);
        }
      }
    }
  }

  .n-pagination {
    margin: 40px auto;
  }
}
</style>
