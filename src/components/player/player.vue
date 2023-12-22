<script setup>
/* vue生态类 */
import { computed, inject, ref, watch } from "vue";
import useMusicStore from "@/store/music.js";
/* naive UI */
import { useNotification } from "naive-ui";
import {
  PlayCircleFilled,
  PauseCircleFilledFilled,
  SkipPreviousRound,
  SkipNextRound,
  MenuOpenRound,
  HeadsetRound
} from "@vicons/material";
/* api */
import { getSongUrl, getLyric, lyricParser } from "@/api/cover.js";


const musicStore = useMusicStore();

const drawerShow = ref(false);
const notification = useNotification();


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
  if (musicStore.player.sequence) {
    if (isNext) {
      musicStore.player.currentMusicIndex++;
    } else {
      musicStore.player.currentMusicIndex--;
    }
  } else {
    musicStore.player.currentMusicIndex = parseInt(Math.random() * 100);
  }
};


</script>
<template>
  <div class="player">
    <!-- 播放进度条 -->
    <div class="slider">
      <div class="time">{{ musicStore.progress.currentTime }}</div>
      <n-slider v-model:value="musicStore.progress.value" :max="musicStore.progress.max" :step="0.01">
        <template #thumb>
          <n-icon-wrapper color="#f55e55" :size="18" :border-radius="9">
            <n-icon :size="12" :component="HeadsetRound" />
          </n-icon-wrapper>
        </template>
      </n-slider>
      <div class="time">{{ musicStore.progress.durationTime }}</div>
    </div>
    <!-- 歌曲信息 -->
    <div class="info">
      <div class="left">
        <div class="img">
          <img
            v-show="musicStore.currentMusicInfo.pic"
            :src="musicStore.currentMusicInfo.pic"
            alt=""
          />
        </div>
        <div class="musicInfo">
          <div class="musicName">{{ musicStore.currentMusicInfo.name }}</div>
          <div class="musicArtist">{{ musicStore.currentMusicInfo.artist }}</div>
        </div>
        <div class="lyric">
          {{
            musicStore.currentMusicInfo.lyric.length
              ? musicStore.currentMusicInfo.lyric[musicStore.currrentLrcIndex].c
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
          v-show="!musicStore.player.isPlay"
          @click="musicStore.player.isPlay = !musicStore.player.isPlay"
        ></n-icon>
        <n-icon
          size="47"
          color="rgb(245, 94, 85)"
          :component="PauseCircleFilledFilled"
          v-show="musicStore.player.isPlay"
          @click="musicStore.player.isPlay = !musicStore.player.isPlay"
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
          v-for="(item, index) in musicStore.userPlayLists"
        >
          <span>{{ index }}</span>
          <span>{{ item.name }}</span>
          <span>{{ item.artist }}</span>
        </n-card>
      </n-drawer-content>
    </n-drawer>
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
