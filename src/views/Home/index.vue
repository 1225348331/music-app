<script setup>
import { computed, onMounted, ref } from "vue";
import { getUserPlaylist } from "@/api/user.js";
import useMainStore from "@/store/index.js";
import { playMusicList } from "@/utils/play-utils";

const mainStore = useMainStore();

// 全部歌单
const allCoverList = ref([]);
// 收藏的歌单
const collectCoverList = computed(() => {
  return allCoverList.value.filter((item) => {
    return item.creator.nickname != "马兜铃目";
  });
});
// 创建的歌单
const createCoverList = computed(() => {
  return allCoverList.value.filter((item) => {
    return item.creator.nickname == "马兜铃目";
  });
});
// 播放歌单
const playCover = async (cover) => {
  playMusicList(cover.id);
};

onMounted(async () => {
  let playlistRes = await getUserPlaylist(mainStore.userData.id);
  allCoverList.value = playlistRes.playlist;
});
</script>
<template>
  <div class="home">
    <div class="myPage coverList">
      <img
        class="bg"
        :style="{
          backgroundImage: `url(${mainStore.userData.backgroundUrl})`,
        }"
      >
      <div class="userInfo"></div>
      <div class="favoriteList"></div>
    </div>
    <!-- 创建的歌单 -->
    <div class="coverList">
      <n-scrollbar class="body" style="max-height: 80vh">
        <div class="userCover">创建的歌单</div>
        <div
          class="cover"
          v-for="item in createCoverList"
          @click="playCover(item)"
        >
          <div>
            <img class="coverImg" :src="item.coverImgUrl" alt="" />
          </div>
          <div class="coverName">{{ item.name }}</div>
        </div>
      </n-scrollbar>
    </div>
    <!-- 收藏的歌单 -->
    <div class="coverList">
      <n-scrollbar class="body" style="max-height: 80vh">
        <div class="userCover">收藏的歌单</div>
        <div
          class="cover"
          v-for="item in collectCoverList"
          @click="playCover(item)"
        >
          <div>
            <img class="coverImg" :src="item.coverImgUrl" alt="" />
          </div>
          <div class="coverName">{{ item.name }}</div>
        </div>
      </n-scrollbar>
    </div>
  </div>
</template>
<style lang="scss">
.home {
  display: flex;
  flex-flow: row wrap;
  justify-content: space-around;
  align-items: center;
  height: 100%;

  .coverList {
    height: 78vh;
    width: 32.5%;
    border-radius: 13px;
    margin: 7px 0px;
    box-shadow: 0px 12px 32px 4px rgba(0, 0, 0, 0.04),
      0px 8px 20px rgba(0, 0, 0, 0.08);

    .n-scrollbar {
      --n-scrollbar-width: 0px !important;
      .n-scrollbar-content {
        padding: 15px;
      }
      .userCover {
        font-size: 16px;
        margin: 5px 0px 15px;
      }

      .cover {
        width: 100%;
        display: flex;
        justify-content: flex-start;
        align-items: center;
        cursor: pointer;

        .coverImg {
          width: 50px;
          height: 50px;
          border-radius: 5px;
          box-shadow: 1px -1px 1px 1px rgb(0, 0, 0, 0.1);
        }
        .coverName {
          padding-left: 20px;
          text-align: left;
        }
      }
    }
  }

  .myPage {
    .bg {
      border-radius: 13px 13px 0px 0px;
      width: 100%;
      height: 35%;
      background-size: 100%;
      background-repeat: no-repeat;
      background-position: 50%;
    }
  }
}
</style>
