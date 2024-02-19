<script setup>
/* vue生态类 */
import { computed, inject, ref, watch, onMounted } from "vue";
import useMusicStore from "@/store/music.js";
import { NSlider, NIcon, NIconWrapper, NImage } from "naive-ui";
import {
  PlayCircleFilled,
  PauseCircleFilledFilled,
  SkipPreviousRound,
  SkipNextRound,
  KeyboardDoubleArrowDownOutlined,
  HeadsetRound,
} from "@vicons/material";
/* elementplus */
import "element-plus/es/components/dialog/style/css";

/* 工具类 */
import { playPreIndex, playNextIndex } from "@/utils/play-utils";
import { formatTime } from "@/utils/utils";
import ColorThief from "colorthief";

const musicStore = useMusicStore();
const colorThief = new ColorThief();
let backgroundColor = ref([255, 255, 255]);
// 自适应背景颜色
let bgColor = computed(() => {
  console.log(
    `rgb(${backgroundColor.value[0]},${backgroundColor.value[1]},${backgroundColor.value[2]})`
  );
  return `rgb(${backgroundColor.value[0]},${backgroundColor.value[1]},${backgroundColor.value[2]})`;
});
// 自适应文本颜色
const textColor = computed(() => {
  return backgroundColor.value[0] * 0.299 +
    backgroundColor.value[1] * 0.587 +
    backgroundColor.value[2] * 0.114 >
    186
    ? "rgba(0,0,0,0.7)"
    : "#fff";
});

// 歌词滚动距离
const lyricHeight = ref(80);
const marginTop = computed(() => {
  return musicStore.lyric.currentLyricIndex >= 5
    ? -(musicStore.lyric.currentLyricIndex - 5) * lyricHeight.value + "px"
    : "";
});

const props = defineProps(["closeBigPlayDialog"]);

// 进度条拖拽
const handleUpdateValue = (value) => {
  musicStore.audioPlayer.seek(value);
};
// 格式化tooltip
const formatTooltip = (value) => {
  return formatTime(value);
};

watch(
  () => musicStore.currentMusicInfo.pic,
  () => {
    let img = new Image();
    img.src = musicStore.currentMusicInfo.pic + "?param=700y700";
    img.setAttribute("crossOrigin", "");
    img.addEventListener("load", function () {
      backgroundColor.value = colorThief.getColor(img);
    });
  },
  {
    immediate: true,
  }
);

onMounted(() => {
  if (document.body.clientWidth < 500) {
    lyricHeight.value = 40;
  }
});
</script>
<template>
  <div
    class="music-app"
    :style="{
      '--bg-color': `${bgColor}`,
      '--text-color': textColor,
    }"
  >
    <div class="left">
      <div class="container">
        <n-image
          id="bigImage"
          class="pic"
          :src="musicStore.currentMusicInfo.pic + '?param=700y700'"
          preview-disabled
          object-fit="cover"
        />
        <!-- 歌曲信息 -->
        <div class="info">
          <span class="name">{{ musicStore.currentMusicInfo.name }}</span>
          -
          <span class="aritst">{{ musicStore.currentMusicInfo.artist }}</span>
        </div>
        <div class="control">
          <div class="slider">
            <div>{{ formatTime(musicStore.progress.value) }}</div>
            <n-slider
              v-model:value="musicStore.progress.value"
              :max="musicStore.progress.max"
              :step="0.01"
              @update:value="handleUpdateValue"
              :format-tooltip="formatTooltip"
            >
              <template #thumb>
                <n-icon-wrapper color="#f55e55">
                  <n-icon
                    v-show="musicStore.progress.value"
                    :component="HeadsetRound"
                  />
                  <n-icon v-show="!musicStore.progress.value">
                    <div class="loading"></div>
                  </n-icon>
                </n-icon-wrapper>
              </template>
            </n-slider>
            <div>{{ formatTime(musicStore.progress.max) }}</div>
          </div>
          <div class="btn">
            <n-icon
              :component="SkipPreviousRound"
              @click="playPreIndex"
            ></n-icon>
            <n-icon
              :component="PlayCircleFilled"
              v-show="!musicStore.player.isPlay"
              @click="musicStore.audioPlayer.play"
            ></n-icon>
            <n-icon
              :component="PauseCircleFilledFilled"
              v-show="musicStore.player.isPlay"
              @click="musicStore.audioPlayer.pause"
            ></n-icon>
            <n-icon :component="SkipNextRound" @click="playNextIndex"></n-icon>
          </div>
        </div>
      </div>
    </div>
    <div class="right">
      <div class="lyricList" :style="{ transform: `translateY(${marginTop})` }">
        <div
          v-for="(item, index) in musicStore.currentMusicInfo.lyric"
          :class="
            index == musicStore.lyric.currentLyricIndex ? 'currrentLyr' : ''
          "
        >
          {{ item.c }}
        </div>
      </div>
    </div>
  </div>

  <div class="closeDialog">
    <n-icon
      size="55"
      color="rgb(255, 255, 255)"
      :component="KeyboardDoubleArrowDownOutlined"
      @click="props.closeBigPlayDialog"
    ></n-icon>
  </div>
</template>
<style lang="scss">
.music-app {
  position: absolute;
  display: flex;
  flex-flow: row wrap;
  justify-content: center;
  align-items: center;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  z-index: 1;
  background-color: var(--bg-color);
  font-family: "myfont-5";

  @media screen and (max-width: 500px) {
    flex-flow: column wrap;
  }

  .left {
    width: 40vw;
    height: 100%;
    display: flex;
    flex-flow: row nowrap;
    justify-content: flex-end;
    align-items: center;
    color: var(--text-color);
    .container {
      width: 35vw;
      display: flex;
      flex-flow: column nowrap;
      align-items: center;
      .pic {
        border-radius: 10px;
        margin: 10px;
        img {
          width: 30vw;
          height: 30vw;
        }
        @media screen and (max-width: 500px) {
          width: 35vh;
          height: 35vh;
        }
      }
      .info {
        text-align: center;
        font-size: 14px;
        margin: 10px;
        .name {
          font-size: 22px;
          font-weight: bolder;
        }
      }
      .control {
        width: 100%;
        .btn {
          margin: 0 auto;
          display: flex;
          flex-flow: row nowrap;
          justify-content: space-around;
          align-items: center;
          .n-icon {
            cursor: pointer;
            font-size: 45px;
            transition: 0.2s all ease;

            &:nth-child(1):hover,
            &:nth-child(4):hover {
              transform: scale(1.1);
            }
            &:nth-child(2):hover,
            &:nth-child(3):hover {
              transform: scale(1.1);
            }
          }
        }

        .slider {
          display: flex;
          font-size: 16px;
          flex-flow: row nowrap;
          justify-content: center;
          align-items: center;
          @media screen and (max-width: 500px) {
            font-size: 11px;
          }
          & > div {
            margin: 5px;
          }
          .n-slider-handles {
            @media screen and (max-width: 500px) {
              right: 0px;
              left: 0px;
            }

            .n-icon-wrapper {
              width: 18px !important;
              height: 18px !important;
              border-radius: 9px !important;
              @media screen and (max-width: 500px) {
                width: 10px !important;
                height: 10px !important;
                border-radius: 5px !important;
              }
              .n-icon {
                font-size: 12px;
                @media screen and (max-width: 500px) {
                  font-size: 7px;
                }
              }
            }
          }
        }
      }
    }
  }
  .right {
    height: 90vh;
    width: 55vw;
    box-sizing: border-box;
    display: flex;
    color: var(--text-color);
    padding-left: 100px;
    font-weight: bold;
    overflow: hidden;
    border: 1px dashed red;

    .lyricList {
      width: 100%;
      display: flex;
      flex-flow: column nowrap;
      justify-content: center;
      align-items: flex-start;
      transition: all 1s ease-in-out;
      font-family: "myfont-5";
      border: 1px solid yellow;

      & > div {
        box-sizing: border-box;
        height: 60px;
        line-height: 60px;
        font-size: 20px;
        margin: 10px 0px;
        @media screen and (max-width: 500px) {
          height: 30px;
          line-height: 30px;
          font-size: 16px;
          margin: 5px 0px;
        }
      }
      .currrentLyr {
        font-size: 35px !important;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        @media screen and (max-width: 500px) {
          font-size: 20px !important;
        }
      }
    }
  }
}

.closeDialog {
  position: absolute;
  top: 20px;
  right: 20px;
  z-index: 3;
  cursor: pointer;
  transition: 0.3s all ease;

  &:hover {
    transform: scale(1.1);
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

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
