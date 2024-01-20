<script setup>
import { onMounted, ref } from "vue";
import { NH1, NH3, NText, NIcon, NGrid, NGi } from "naive-ui";
import SvgIcon from "@/components/Global/SvgIcon.vue";
import SpecialCover from "@/components/Cover/SpecialCover.vue";
import { getRecommendSongs } from "@/api/cover";
import SpecialCoverCard from "@/components/Cover/SpecialCoverCard.vue";
import PrivateFm from "@/components/player/PrivateFm.vue";
import MainCover from "@/components/Cover/MainCover.vue";

const dailySongsCoverData = ref(null);
const likeSongsCoverData = ref(null);
const recommendData = ref(null);

onMounted(async () => {
  // dailySongsCoverData.value = await getRecommendSongs();
  dailySongsCoverData.value = {
    name: "每日推荐",
    desc: "根据你的音乐口味，每日更新",
    cover:
      "https://img.zcool.cn/community/019ef25e79940ba80120a895cec45d.jpg@1280w_1l_2o_100sh.jpg",
  };
  likeSongsCoverData.value = {
    name: "喜欢的音乐",
    desc: "发现你独特的音乐品味",
    cover:
      "https://img.zcool.cn/community/019ef25e79940ba80120a895cec45d.jpg@1280w_1l_2o_100sh.jpg",
  };
  recommendData.value = [
    {
      name: "推荐歌单",
    },
    {
      name: "雷达歌单",
    },
    {
      name: "歌手推荐",
    },
  ];
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
            @click="jumpPage('daily-songs')"
          />
        </n-gi>
        <!-- 喜欢的音乐 -->
        <n-gi>
          <SpecialCover
            :data="likeSongsCoverData"
            @click="jumpPage('like-songs')"
          />
        </n-gi>
      </n-grid>
      <PrivateFm class="rec-fm" />
    </div>
    <!-- 公共推荐 -->
    <div v-for="(item, index) in recommendData" :key="index" class="rec-public">
      <n-h3
        class="title"
        prefix="bar"
        @click="item.to ? router.push(item.to) : null"
      >
        <n-text class="name">{{ item.name }}</n-text>
        <n-icon v-if="item.to" class="more" depth="3">
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
