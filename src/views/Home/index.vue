<script setup>
import { computed, onMounted, ref } from "vue";
import { getUserPlaylist } from "@/api/user.js";
import useMainStore from "@/store/index.js";
import useMusicStore from "@/store/music.js";
import { playMusicList, playMusic } from "@/utils/play-utils";
import { getRecommendSongs } from "@/api/cover";

const mainStore = useMainStore();
const musicStore = useMusicStore();

// 每日推荐
const dailyRecommend = ref([]);
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
const playCover = (cover) => {
  playMusicList(cover.id);
};

// 播放歌单中的单曲
const playCoverSong = (song, index) => {
  // 如果当前歌单列表不是当前歌单，则替换歌单列表
  if (musicStore.musicList != dailyRecommend.value) {
    musicStore.musicList = dailyRecommend.value;
  }
  musicStore.player.currentMusicIndex = index;
  playMusic(song);
};

onMounted(async () => {
  let playlistRes = await getUserPlaylist(mainStore.userData.id);
  allCoverList.value = playlistRes.playlist;

  dailyRecommend.value = await getRecommendSongs();
});
</script>
<template>
  <div class="home">
    <div class="myPage coverList">
      <div class="userCover">每日推荐</div>
      <n-scrollbar class="body">
        <div
          class="cover"
          v-for="(item, index) in dailyRecommend"
          @click="playCoverSong(item, index)"
        >
          <div>
            <img class="coverImg" :src="item.pic + '?param=50y50'" alt="" />
          </div>
          <div class="coverName">{{ item.name }}</div>
          <div class="coverArtist">{{ item.artist }}</div>
        </div>
      </n-scrollbar>
    </div>
    <!-- 创建的歌单 -->
    <div class="coverList">
      <div class="userCover">{{ mainStore.userData.name }}创建的歌单</div>
      <n-scrollbar class="body">
        <div
          class="cover"
          v-for="item in createCoverList"
          @click="playCover(item)"
        >
          <div>
            <img
              class="coverImg"
              :src="item.coverImgUrl + '?param=50y50'"
              alt=""
            />
          </div>
          <div class="coverName">{{ item.name }}</div>
        </div>
      </n-scrollbar>
    </div>
    <!-- 收藏的歌单 -->
    <div class="coverList">
      <div class="userCover">{{ mainStore.userData.name }}收藏的歌单</div>
      <n-scrollbar class="body">
        <div
          class="cover"
          v-for="item in collectCoverList"
          @click="playCover(item)"
        >
          <div>
            <img
              class="coverImg"
              :src="item.coverImgUrl + '?param=50y50'"
              alt=""
            />
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
  flex-flow: row nowrap;
  justify-content: space-around;
  align-items: flex-start;
  height: 100%;
  width: 100%;

  .coverList {
    height: 86vh;
    width: 32%;
    border-radius: 13px;
    margin: 0px 5px;
    background-color: #fff;
    box-shadow: 0px 6px 16px 2px rgba(0, 0, 0, 0.04),
      0px 4px 10px rgba(0, 0, 0, 0.08);

    .userCover {
      box-sizing: border-box;
      height: 30px;
      line-height: 30px;
      font-size: 18px;
      margin: 15px 0px 0px 15px;
      font-weight: bold;
    }

    .n-scrollbar {
      width: 100%;
      max-height: calc(100% - 30px);
      --n-scrollbar-width: 0px !important;
      .n-scrollbar-content {
        padding: 15px;
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
          flex-grow: 1;
        }
        .coverArtist {
          padding-left: 20px;
          text-align: right;
        }
      }
    }
  }
}
</style>
