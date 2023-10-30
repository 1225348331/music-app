<script setup>
import { HeadsetRound } from "@vicons/material";
import { computed, inject, ref, watch } from "vue";
import useMainStore from "@/store/index.js";
import { useNotification } from "naive-ui";
import { storeToRefs } from "pinia";
import {
  PlayCircleFilled,
  PauseCircleFilledFilled,
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
const notification = useNotification();

// 音乐播放
const musicPlay = () => {
  mainStore.player.isPlay = true;
  document.querySelector("audio").play();
};
// 音乐暂停
const musicPause = () => {
  mainStore.player.isPlay = false;
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

const changeIndex = (isNext) => {
  if (mainStore.player.sequence) {
    if (isNext) {
      mainStore.player.currentMusicIndex++;
    } else {
      mainStore.player.currentMusicIndex--;
    }
  } else {
    mainStore.player.currentMusicIndex = parseInt(Math.random() * 100);
  }
};
const { player } = storeToRefs(mainStore);

// 监听是否播放
watch(
  () => player.value.isPlay,
  () => {
    if (mainStore.player.isPlay) {
      musicPlay();
      console.log("音乐开始了");
    } else {
      musicPause();
      console.log("音乐暂停了");
    }
  }
);

watch(
  () => [mainStore.userPlayLists, mainStore.player.currentMusicIndex],
  async () => {
    if (!mainStore.userPlayLists.length) {
      notification.error({
        content: "歌单里面似乎没有歌曲呢",
        meta: "当然也有可能是没有权限",
        duration: 3500,
        keepAliveOnHover: true,
      });
      return;
    }
    notification.success({
      content: "歌曲切换成功啦~",
      duration: 3500,
      keepAliveOnHover: true,
    });
    // 防止index超限
    if (mainStore.player.currentMusicIndex < 0) {
      mainStore.player.currentMusicIndex += 100;
    }
    let musicIndex = mainStore.player.currentMusicIndex % 100;
    // 当前音乐消息
    mainStore.currentMusic.id = mainStore.userPlayLists[musicIndex].id;
    mainStore.currentMusic.artist = mainStore.userPlayLists[musicIndex].artist;
    mainStore.currentMusic.pic = mainStore.userPlayLists[musicIndex].pic;
    mainStore.currentMusic.name = mainStore.userPlayLists[musicIndex].name;
    mainStore.currentMusic.url = await getSongUrl(mainStore.currentMusic.id);
    mainStore.currentMusic.lyr = await getLyric(mainStore.currentMusic.id);
    // 歌词解析
    mainStore.currentMusic.lyric = lyricParser(mainStore.currentMusic.lyr);
    mainStore.currrentLrcIndex = 0;
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

      if (
        current >=
        mainStore.currentMusic.lyric[mainStore.currrentLrcIndex + 1].t
      ) {
        mainStore.currrentLrcIndex++;
        // 防止超限
        if (mainStore.currrentLrcIndex >= mainStore.currentMusic.lyric.length) {
          mainStore.currrentLrcIndex--;
        }
      }
    };

    // 音频 结束 触发
    document.querySelector("audio").onended = function () {
      musicPause();
      console.log("音乐播放完毕了");
      changeIndex(true);
    };
  }
);
</script>
<template>
  <div class="player">
    <!-- 播放进度条 -->
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
    <!-- 歌曲信息 -->
    <div class="info">
      <div class="left">
        <div class="img">
          <img
            v-show="mainStore.currentMusic.pic"
            :src="mainStore.currentMusic.pic"
            alt=""
          />
        </div>
        <div class="musicInfo">
          <div class="musicName">{{ mainStore.currentMusic.name }}</div>
          <div class="musicArtist">{{ mainStore.currentMusic.artist }}</div>
        </div>
        <div class="lyric">
          {{
            mainStore.currentMusic.lyric.length
              ? mainStore.currentMusic.lyric[mainStore.currrentLrcIndex].c
              : ""
          }}
        </div>
      </div>
      <div class="center">
        <n-icon
          size="35"
          color="rgb(245, 94, 85)"
          :component="SkipPreviousRound"
          @click="changeIndex(false)"
        ></n-icon>
        <n-icon
          size="47"
          color="rgb(245, 94, 85)"
          :component="PlayCircleFilled"
          v-show="!mainStore.player.isPlay"
          @click="mainStore.player.isPlay = !mainStore.player.isPlay"
        ></n-icon>
        <n-icon
          size="47"
          color="rgb(245, 94, 85)"
          :component="PauseCircleFilledFilled"
          v-show="mainStore.player.isPlay"
          @click="mainStore.player.isPlay = !mainStore.player.isPlay"
        ></n-icon>
        <n-icon
          size="35"
          color="rgb(245, 94, 85)"
          :component="SkipNextRound"
          @click="changeIndex(true)"
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
        <n-card
          :style="{
            borderRadius: '8px',
            cursor: 'pointer',
            marginBottom: '12px',
          }"
          class="songCard"
          v-for="(item, index) in mainStore.userPlayLists"
        >
          <span>{{ index }}</span>
          <span>{{ item.name }}</span>
          <span>{{ item.artist }}</span>
        </n-card>
      </n-drawer-content>
    </n-drawer>
    <audio :src="mainStore.currentMusic.url"></audio>
  </div>
</template>
<style lang="scss">
.player {
  position: fixed;
  z-index: 2;
  bottom: 0;
  left: 0;
  width: 100%;
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
      background-color: #fff;
    }
  }

  .info {
    display: flex;
    flex-flow: row nowrap;
    justify-content: space-around;
    align-items: center;
    transform: translateY(-8px);
    max-width: 1400px;
    max-height: 50px;
    margin: 0 auto;
    z-index: 2;

    .left {
      display: flex;
      width: 33%;
      flex-flow: row nowrap;
      justify-content: flex-start;
      align-items: center;

      .img {
        border-radius: 8px;
        min-width: 50px;
        overflow: hidden;
        box-shadow: 0 6px 8px -2px rgba(0, 0, 0, 0.16);
        cursor: pointer;
        margin-right: 12px;
        height: 50px;
        img {
          width: 50px;
          height: 50px;
        }
      }
      .musicInfo {
        max-width: 200px;
        margin-right: 30px;
        white-space: nowrap;
        vertical-align: middle;
        .musicName {
          overflow: hidden;
          text-overflow: ellipsis;
          font-size: 16px;
          font-weight: bold;
          cursor: pointer;
        }
        .musicArtist {
          overflow: hidden;
          text-overflow: ellipsis;
          font-size: 12px;
          margin-top: 2px;
        }
      }

      .lyric {
        font-family: "Gill Sans", "Gill Sans MT", Calibri, "Trebuchet MS",
          sans-serif;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        flex-grow: 1;
      }
    }

    .center {
      display: flex;
      flex-flow: row nowrap;
      justify-content: center;
      align-items: center;
      width: 33%;
      .n-icon {
        cursor: pointer;
        margin: 0px 10px;
        border-radius: 50%;
        transition: 0.5s all ease;
        &:nth-child(1):hover,
        &:nth-child(4):hover {
          background-color: rgb(245, 94, 85);
          color: #fff !important;
        }
        &:nth-child(2):hover,
        &:nth-child(3):hover {
          transform: scale(1.1);
        }
      }
    }

    .right {
      display: flex;
      width: 33%;
      flex-flow: row nowrap;
      justify-content: flex-end;
      align-items: center;
      .n-icon {
        cursor: pointer;
      }
    }
  }

  
}
</style>
