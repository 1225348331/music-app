<script setup>
import { onMounted, ref } from "vue";
import { NH1, NH3, NText, NIcon, NGrid, NGi } from "naive-ui";
import SvgIcon from "@/components/Global/SvgIcon.vue";
import SpecialCover from "@/components/Cover/SpecialCover.vue";
import { getRecommendSongs } from "@/api/cover";
import {
  getRecommendResource,
  getTopArtists,
  getAlbumNewest,
} from "@/api/recommend.js";
import SpecialCoverCard from "@/components/Cover/SpecialCoverCard.vue";
import PrivateFm from "@/components/player/PrivateFm.vue"; //
import MainCover from "@/components/Cover/MainCover.vue";
import { playMusicList } from "@/utils/play-utils";
import useUserStore from "@/store/index";

const userStore = useUserStore();

const dailySongsCoverData = {
  name: "每日推荐",
  desc: "根据你的音乐口味，每日更新",
};
const likeSongsCoverData = {
  name: "喜欢的音乐",
  desc: "发现你独特的音乐品味",
};
const recommendData = ref({
  recommendList: {
    name: "推荐歌单",
    loadingNum: 12,
    data: [],
  },
  artist: {
    name: "热门歌手",
    type: "artist",
    loadingNum: 6,
    data: [],
  },
  album: {
    name: "新碟上架",
    type: "album",
    loadingNum: 12,
    data: [],
  },
});
// 播放每日推荐
const playDailyRecommend = async () => {
  let musicList = await getRecommendSongs();
  playMusicList({
    musicList,
  });
};
// 播放喜欢的音乐列表
const playLikest = async () => {
  playMusicList({
    id: userStore.userData.id ? userStore.userData.id : 482916379,
  });
};

onMounted(async () => {
  // 推荐歌单
  recommendData.value.recommendList.data = await getRecommendResource();
  // 热门歌手
  recommendData.value.artist.data = await getTopArtists();
  // 新碟上架
  recommendData.value.album.data = await getAlbumNewest();
});
</script>
<!-- 个性推荐 -->
<template>
  <div class="recommend">
    <!-- 欢迎 -->
    <div class="greetings">
      <n-text depth="3">开启一天的好心情 ~</n-text>
    </div>
    <!-- 专属推荐 -->
    <div class="rec-private">
      <n-grid class="rec-private" cols="1" x-gap="20" y-gap="20">
        <!-- 每日推荐 -->
        <n-gi>
          <SpecialCoverCard
            :data="dailySongsCoverData"
            :showIcon="false"
            showDate
            @click="playDailyRecommend"
          />
        </n-gi>
        <!-- 喜欢的音乐 -->
        <n-gi>
          <SpecialCover :data="likeSongsCoverData" @click="playLikest" />
        </n-gi>
      </n-grid>
      <PrivateFm class="rec-fm" />
    </div>
    <!-- 公共推荐 -->
    <div v-for="(item, index) in recommendData" :key="index" class="rec-public">
      <!-- @click="item.to ? router.push(item.to) : null" -->
      <n-h3 class="title" prefix="bar">
        <n-text class="name">{{ item.name }}</n-text>
        <n-icon v-if="item?.to" class="more" depth="3">
          <SvgIcon icon="chevron-right" />
        </n-icon>
      </n-h3>
      <MainCover
        :data="item.data"
        :type="item.type"
        :loadingNum="item.loadingNum"
        :columns="item.columns"
      />
    </div>
  </div>
</template>
<style lang="scss" scoped>
.recommend {
  margin: 0 auto;
  .greetings {
    margin-bottom: 20px;
    .welcome {
      margin: 0;
      font-weight: bold;
    }
  }
  .title {
    position: relative;
    display: flex;
    flex-direction: row;
    align-items: center;
    margin-left: 2px;
    margin-top: 28px;
    padding-left: 16px;
    cursor: pointer;
    .more {
      font-size: 26px;
      opacity: 0;
      transform: translateX(4px);
      transition: opacity 0.3s, transform 0.3s;
    }
    &:hover {
      .more {
        opacity: 1;
        transform: translateX(0);
      }
    }
  }
  .rec-private {
    display: flex;
    flex-direction: row;
    align-items: flex-start;
    .rec-fm {
      width: 100%;
      height: 220px;
      margin-left: 20px;
      max-width: calc(50% - 10px);
    }
  }
}
</style>
