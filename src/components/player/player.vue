<script setup>
import { HeadsetRound } from "@vicons/material";
import { computed, inject, ref, watch } from "vue";
import useMainStore from "@/store/index.js";
import { useMessage } from "naive-ui";
import {
  PlayCircleFilled,
  SkipPreviousRound,
  SkipNextRound,
  MenuOpenRound,
} from "@vicons/material";
const mainStore = useMainStore();

import { getSongUrl, getLyric, lyricParser } from "@/api/cover.js";

const value = computed(() => {
  return mainStore.slider.currentValue;
});
const drawerShow = ref(false);
const message = useMessage();

// 音乐播放
const musicPlay = () => {
  // isPlay.value = true;
  document.querySelector("audio").play();
};
// 音乐暂停
const musicPause = () => {
  // isPlay.value = false;
  document.querySelector("audio").pause();
};

// 格式化时间
const formatTime = (time) => {
  // 329 => 05:29
  var min = parseInt(time / 60);
  var sec = parseInt(time % 60);
  min = min < 10 ? "0" + min : min;
  sec = sec < 10 ? "0" + sec : sec;

  return `${min}:${sec}`;
};

watch(
  () => mainStore.userPlayLists,
  async () => {
    message.success("歌单切换啦");
    // 当前音乐消息
    mainStore.currentMusic.id = mainStore.userPlayLists[0].id;
    mainStore.currentMusic.artist = mainStore.userPlayLists[0].artist;
    mainStore.currentMusic.pic = mainStore.userPlayLists[0].pic;
    mainStore.currentMusic.url = await getSongUrl(mainStore.currentMusic.id);
    mainStore.currentMusic.lyr = await getLyric(mainStore.currentMusic.id);
    // 歌词解析
    // currentLyric.value = lyricParser(mainStore.currentMusic.lyr);
    // currrentLrcIndex.value = 0;
    // 音频 就绪时触发
    document.querySelector("audio").oncanplay = function (e) {
      // 音乐总时长,单位：秒
      let duration = e.target.duration;
      // 设置slider最大值
      mainStore.slider.max = duration;
      // 设置歌曲总时长
      mainStore.slider.durationTime = formatTime(duration);

      setTimeout(() => {
        musicPlay();
      }, 100);
      // 歌曲播放
      // if (currentIndex.value) {
      //   setTimeout(() => {
      //     musicPlay();
      //   }, 100);
      // }
    };

    // 音频 播放时 触发
    document.querySelector("audio").ontimeupdate = function (e) {
      // 音乐当前时间,单位：秒
      let current = e.target.currentTime;
      // 设置slider当前值
      mainStore.slider.currentValue = current;
      // 设置当前播放时间
      mainStore.slider.currentTime = formatTime(current);

      // if (current >= currentLyric.value[currrentLrcIndex.value].t) {
      //   currrentLrcIndex.value++;
      //   // 防止超限
      //   if (currrentLrcIndex.value >= currentLyric.value.length) {
      //     currrentLrcIndex.value--;
      //   }
      // }
    };

    // 音频 结束 触发
    document.querySelector("audio").onended = function () {
      musicPause();
      console.log("音乐播放完毕了");
    };
  }
);
</script>
<template>
  <div class="player">
    <div class="slider">
      <div class="time">{{ mainStore.slider.currentTime }}</div>
      <n-slider v-model:value="value" :max="mainStore.slider.max" :step="0.01">
        <template #thumb>
          <n-icon-wrapper color="#f55e55" :size="18" :border-radius="9">
            <n-icon :size="12" :component="HeadsetRound" />
          </n-icon-wrapper>
        </template>
      </n-slider>
      <div class="time">{{ mainStore.slider.durationTime }}</div>
    </div>
    <div class="info">
      <div class="left">
        <div class="img"></div>
        <div class="musicName"></div>
        <div class="musicLrc"></div>
      </div>
      <div class="center">
        <n-icon
          size="40"
          color="rgb(245, 94, 85)"
          :component="SkipPreviousRound"
        ></n-icon>
        <n-icon
          size="40"
          color="rgb(245, 94, 85)"
          :component="PlayCircleFilled"
        ></n-icon>
        <n-icon
          size="40"
          color="rgb(245, 94, 85)"
          :component="SkipNextRound"
        ></n-icon>
      </div>
      <div class="right">
        <n-icon
          size="30"
          color="rgb(245, 94, 85)"
          :component="MenuOpenRound"
          @click="drawerShow = !drawerShow"
        ></n-icon>
      </div>
    </div>
    <n-drawer v-model:show="drawerShow" :width="400">
      <n-drawer-content title="当前歌单列表" :native-scrollbar="false">
        <div v-for="(item, index) in mainStore.userPlayLists">
          <span>{{ index }}</span>
          <span>{{ item.name }}</span>
          <span>{{ item.artist }}</span>
        </div>
      </n-drawer-content>
    </n-drawer>
    <audio :src="mainStore.currentMusic.url"></audio>
  </div>
</template>
<style lang="scss" scoped>
.player {
  .slider {
    display: flex;
    flex-flow: row nowrap;
    align-items: center;
    transform: translateY(-10px);
    .time {
      font-size: 12px;
      white-space: nowrap;
      outline: 2px solid rgb(225, 235, 225);
      padding: 2px 8px;
      border-radius: 25px;
      margin: 0 2px;
    }
  }

  .info {
    display: flex;
    flex-flow: row nowrap;
    justify-content: space-around;
    align-items: center;
    transform: translateY(-8px);

    .center {
      display: flex;
      flex-flow: row nowrap;
      justify-content: space-around;
      align-items: flex-start;
      .n-icon {
        cursor: pointer;
        margin: 0px 10px;
      }
    }
  }
}
</style>
