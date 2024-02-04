<script setup>
/* vue生态类 */
import { computed, inject, ref, watch } from "vue";
import useMusicStore from "@/store/music.js";
/* naive UI */
import {
  useNotification,
  NSlider,
  NIcon,
  NIconWrapper,
  NDrawer,
  NDrawerContent,
} from "naive-ui";
import {
  PlayCircleFilled,
  PauseCircleFilledFilled,
  SkipPreviousRound,
  SkipNextRound,
  MenuOpenRound,
  HeadsetRound,
} from "@vicons/material";
/* elementplus */
import "element-plus/es/components/dialog/style/css";
import { ElDialog } from "element-plus";
/* 工具类 */
import { playPreIndex, playNextIndex, playMusic } from "@/utils/play-utils";
import { formatTime } from "@/utils/utils";
/* 组件 */
import BigPlayer from "@/components/player/BigPlayer.vue";

const musicStore = useMusicStore();
const notification = useNotification();
// 抽屉显隐控制
const drawerShow = ref(false);
// 大屏播放器
const dialogVisible = ref(false);

// 进度条拖拽
const handleUpdateValue = (value) => {
  musicStore.audioPlayer.seek(value);
};
// 格式化tooltip
const formatTooltip = (value) => {
  return formatTime(value);
};
// 大屏播放
const openBigPlayDialog = () => {
  dialogVisible.value = true;
};
// 关闭大屏
const closeBigPlayDialog = () => {
  dialogVisible.value = false;
};
// 播放音乐
const playSong = (index, item) => {
  musicStore.player.currentMusicIndex = index;
  playMusic(item);
};
</script>
<template>
  <div class="player">
    <!-- 播放进度条 -->
    <div class="slider">
      <div class="time">{{ formatTime(musicStore.progress.value) }}</div>
      <n-slider
        v-model:value="musicStore.progress.value"
        :max="musicStore.progress.max"
        :step="0.01"
        @update:value="handleUpdateValue"
        :format-tooltip="formatTooltip"
      >
        <template #thumb>
          <n-icon-wrapper color="#f55e55" :size="18" :border-radius="9">
            <n-icon
              :size="12"
              v-show="musicStore.progress.value"
              :component="HeadsetRound"
            />
            <n-icon :size="12" v-show="!musicStore.progress.value">
              <div class="loading"></div>
            </n-icon>
          </n-icon-wrapper>
        </template>
      </n-slider>
      <div class="time">{{ formatTime(musicStore.progress.max) }}</div>
    </div>
    <!-- 歌曲信息 -->
    <div class="info">
      <!-- 左侧信息 -->
      <div class="left">
        <div class="img" @click="openBigPlayDialog">
          <img
            v-show="musicStore.currentMusicInfo.pic"
            :src="musicStore.currentMusicInfo.pic + '?param=50y50'"
            alt=""
          />
        </div>
        <div class="musicInfo">
          <div class="musicName">{{ musicStore.currentMusicInfo.name }}</div>
          <div class="musicArtist">
            {{ musicStore.currentMusicInfo.artist }}
          </div>
        </div>
        <div class="lyric">
          {{
            musicStore.currentMusicInfo.lyric.length
              ? musicStore.currentMusicInfo.lyric[
                  musicStore.lyric.currentLyricIndex
                ].c
              : ""
          }}
        </div>
      </div>
      <!-- 中间按钮 -->
      <div class="center">
        <n-icon
          size="35"
          color="rgb(245, 94, 85)"
          :component="SkipPreviousRound"
          @click="playPreIndex"
        ></n-icon>
        <n-icon
          size="47"
          color="rgb(245, 94, 85)"
          :component="PlayCircleFilled"
          v-show="!musicStore.player.isPlay"
          @click="musicStore.audioPlayer.play"
        ></n-icon>
        <n-icon
          size="47"
          color="rgb(245, 94, 85)"
          :component="PauseCircleFilledFilled"
          v-show="musicStore.player.isPlay"
          @click="musicStore.audioPlayer.pause"
        ></n-icon>
        <n-icon
          size="35"
          color="rgb(245, 94, 85)"
          :component="SkipNextRound"
          @click="playNextIndex"
        ></n-icon>
      </div>
      <!-- 右侧功能 -->
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
        <div
          class="songCard"
          v-for="(item, index) in musicStore.musicList"
          @click="playSong(index, item)"
          :class="
            item.id == musicStore.currentMusicInfo.id ? 'currentMusic' : ''
          "
        >
          <span style="width: 8%; text-align: left">{{ index }}</span>
          <span style="width: 74%">{{ item.name }}</span>
          <span style="width: 18%">{{ item.artist }}</span>
        </div>
      </n-drawer-content>
    </n-drawer>
    <el-dialog
      class="bigPlayer-dialog"
      v-model="dialogVisible"
      fullscreen
      append-to-body
    >
      <BigPlayer :closeBigPlayDialog="closeBigPlayDialog" />
    </el-dialog>
  </div>
</template>
<style lang="scss">
.player {
  position: fixed;
  z-index: 2;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 80px;
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
    font-family: "myfont-3";
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

.loading {
  border: 3px solid #f55e55;
  border-top-color: #fff;
  border-radius: 50%;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  animation: spin 1s linear infinite;
}

.bigPlayer-dialog {
  .el-dialog__header {
    display: none;
  }

  .el-dialog__body {
    padding: 0px;
  }
}

.songCard {
  margin-bottom: 12px;
  padding: 4px;
  height: 30px;
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  &:hover {
    color: #f55e55;
  }

  span {
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    margin: 0px 5px;
  }
}

.currentMusic {
  border-radius: 8px;
  border: 1px dashed #f55e55;
  color: #f55e55;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
