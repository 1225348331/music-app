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
let backgroundColor = ref([40, 50, 59]);
let bgColor = computed(() => {
  console.log(
    `rgb(${backgroundColor.value[0]},${backgroundColor.value[1]},${backgroundColor.value[2]})`
  );
  return `rgb(${backgroundColor.value[0]},${backgroundColor.value[1]},${backgroundColor.value[2]})`;
});

// 歌词滚动距离
const lyricHeight = ref(80);
const marginTop = computed(() => {
  return musicStore.lyric.currentLyricIndex >= 2
    ? -(musicStore.lyric.currentLyricIndex - 1) * lyricHeight.value + "px"
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
    // let img = document.createElement("img");
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
    }"
  >
    <n-image
      id="bigImage"
      class="left"
      :src="musicStore.currentMusicInfo.pic + '?param=700y700'"
      preview-disabled
    />
    <div class="right">
      <div class="name">{{ musicStore.currentMusicInfo.name }}</div>
      <div class="info">
        <p>{{ musicStore.currentMusicInfo.artist }}</p>
      </div>
      <div class="lyric">
        <div
          class="lyricList"
          :style="{ transform: `translateY(${marginTop})` }"
        >
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
          <n-icon :component="SkipPreviousRound" @click="playPreIndex"></n-icon>
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
  z-index: 1;
  background-color: var(--bg-color);

  @media screen and (max-width: 500px) {
    flex-flow: column wrap;
  }
  // &::before {
  //   content: "";
  //   position: absolute;
  //   box-sizing: border-box;
  //   width: 100%;
  //   height: 100%;
  //   top: 0;
  //   left: 0;
  //   // background-image: linear-gradient(to top, #989898 0%, var(--bg-color) 100%);
  //   background-color: var(--bg-color);
  //   // opacity: 0.5;
  //   // filter: blur(5px);
  //   z-index: -1;
  // }

  .left {
    width: 35vw;
    height: 35vw;
    border-radius: 5px;
    box-shadow: 15px 15px 5px rgba(0, 0, 0, 0.3);
    @media screen and (max-width: 500px) {
      width: 35vh;
      height: 35vh;
    }
  }
  .right {
    height: 35vw;
    width: 45vw;
    text-align: center;
    // color: rgb(
    //   from var(--bg-color) calc(1 - r) calc(1 - g) calc(1 - b)
    // ); /** 基于背景反转颜色 **/

    // color: var(--bg-color);

    // color: #000;

    // 基于背景色自适应文字颜色
    // background-color: var(--bg-color);
    // color: #000;
    // color: #000;
    background-color: var(--bg-color);
    // mix-blend-mode: screen;
    display: flex;
    flex-flow: column nowrap;
    justify-content: space-between;
    align-items: center;
    padding: 20px 0px;
    box-sizing: border-box;

    @media screen and (max-width: 500px) {
      width: 100vw;
      height: 55vh;
      justify-content: flex-end;
    }

    .name {
      font-size: 50px;
      max-width: 75%;
      font-family: "myfont-1";
      @media screen and (max-width: 500px) {
        font-size: 25px;
        max-width: 95%;
      }
    }
    .info {
      font-family: "myfont-1";
      font-size: 35px;
      @media screen and (max-width: 500px) {
        font-size: 16px;
      }
    }
    .lyric {
      height: calc(180px + 60px);
      width: 100%;
      padding: 8px 0px;
      max-width: 80%;
      overflow: hidden;
      @media screen and (max-width: 500px) {
        height: 160px;
      }

      .lyricList {
        display: flex;
        flex-flow: column nowrap;
        justify-content: center;
        align-items: center;
        transition: all 1s ease-in-out;
        font-family: "myfont-2";

        & > div {
          box-sizing: border-box;
          height: 60px;
          line-height: 60px;
          font-size: 24px;
          margin: 10px 0px;
          @media screen and (max-width: 500px) {
            height: 30px;
            line-height: 30px;
            font-size: 16px;
            margin: 5px 0px;
          }
        }
        .currrentLyr {
          font-size: 40px !important;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          @media screen and (max-width: 500px) {
            font-size: 20px !important;
          }
        }
      }
    }

    .control {
      width: 80%;
      @media screen and (max-width: 500px) {
        width: 90%;
      }
      .btn {
        width: 90%;
        margin: 0 auto;
        display: flex;
        flex-flow: row nowrap;
        justify-content: space-around;
        align-items: center;
        @media screen and (max-width: 500px) {
          width: 100%;
          margin-top: -5px;
        }
        .n-icon {
          cursor: pointer;
          font-size: 50px;
          transition: 0.2s all ease;

          @media screen and (max-width: 500px) {
            font-size: 40px;
          }
          &:nth-child(1):hover,
          &:nth-child(4):hover {
            color: #f55e55;
            transform: scale(1.1);
          }
          &:nth-child(2):hover,
          &:nth-child(3):hover {
            color: #f55e55;
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
