<script setup>
import { storeToRefs } from "pinia";
import { useRouter } from "vue-router";
import { getPrivateFm } from "@/api/recommend.js";

import { computed, onBeforeMount, onMounted, ref } from "vue";
import { NImage, NIcon, NButton } from "naive-ui";
import SvgIcon from "@/components/Global/SvgIcon.vue";
import { playMusicList, playNextIndex } from "@/utils/play-utils";
import useMusicStore from "@/store/music";

const musicStore = useMusicStore();

/**
 * @description: 播放私人音乐
 * @return {*}
 */
const playPrivateFm = async () => {
  if (musicStore.player.playType != 2) {
    // 播放歌单
    playMusicList({
      musicList: musicStore.FMList,
    });
    musicStore.player.playType = 2;
  } else {
    musicStore.audioPlayer.play();
  }
};

onMounted(async () => {
  musicStore.FMList = await getPrivateFm();
});
</script>
<!-- 私人 FM -->
<template>
  <div
    class="private-fm"
    :style="{
      '--color': '#efefef',
    }"
  >
    <!-- 背景 -->
    <div
      class="overlay"
      :style="{
        backgroundImage: `url(${
          musicStore.FMList[0]?.pic
            ? musicStore.FMList[0].pic
            : 'src/assets/image/song.jpg'
        })`,
      }"
    />
    <!-- 内容 -->
    <div class="content">
      <!-- 封面 -->
      <Transition name="fade" mode="out-in">
        <div :key="musicStore.FMList[0]?.id" class="cover">
          <n-image
            :src="musicStore.FMList[0]?.pic"
            class="cover-img"
            preview-disabled
            @load="
              (e) => {
                e.target.style.opacity = 1;
              }
            "
          >
            <template #placeholder>
              <div class="cover-loading">
                <img
                  class="loading-img"
                  src="src/assets/image/song.jpg"
                  alt="loading-img"
                />
              </div>
            </template>
          </n-image>
        </div>
      </Transition>
      <div class="data">
        <!-- 信息 -->
        <div class="info">
          <span class="name">{{
            musicStore.FMList[0]?.name || "未知歌曲"
          }}</span>
          <div class="artist">
            <n-icon depth="3" size="20">
              <SvgIcon icon="account-music" />
            </n-icon>
            <div class="all-ar">
              {{ musicStore.FMList[0]?.artist || "未知艺术家" }}
            </div>
          </div>
          <div class="album">
            <n-icon depth="3" size="20">
              <SvgIcon icon="album" />
            </n-icon>
            <span class="al">
              {{ musicStore.FMList[0]?.album || "未知专辑" }}
            </span>
          </div>
        </div>
        <!-- 操作 -->
        <div class="control">
          <!-- 播放暂停 -->
          <n-button
            :loading="
              musicStore.player.playType == 2 && !musicStore.progress.value
            "
            :focusable="false"
            class="play-control"
            color="#efefef"
            type="primary"
            strong
            secondary
            circle
          >
            <template #icon>
              <n-icon
                v-if="
                  !musicStore.player.isPlay || musicStore.player.playType != 2
                "
                size="32"
                @click="playPrivateFm"
              >
                <SvgIcon icon="play-arrow-rounded" />
              </n-icon>
              <n-icon
                v-if="
                  musicStore.player.isPlay && musicStore.player.playType == 2
                "
                @click="musicStore.audioPlayer.pause"
                size="32"
              >
                <SvgIcon icon="pause-circle" />
              </n-icon>
            </template>
          </n-button>
          <!-- 下一曲 -->
          <n-icon class="play-other" size="26" @click.stop="playNextIndex">
            <SvgIcon icon="skip-next-rounded" />
          </n-icon>
          <!-- 不喜欢 -->
          <n-icon class="play-other" size="26" @click.stop="">
            <SvgIcon size="18" icon="thumb-down" />
          </n-icon>
          <!-- 私人 FM 图标 -->
          <div class="radio">
            <div class="icon">
              <n-icon class="play-other" size="20">
                <SvgIcon icon="radio" />
              </n-icon>
              <span>私人 FM</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.private-fm {
  position: relative;
  border-radius: 16px;
  overflow: hidden;
  padding: 20px;
  z-index: 0;
  box-sizing: border-box;
  .overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-repeat: no-repeat;
    background-size: 150% 150%;
    background-position: center;
    z-index: -1;
    &::after {
      content: "";
      width: 100%;
      height: 100%;
      position: absolute;
      top: 0;
      left: 0;
      background-color: #00000060;
      backdrop-filter: blur(20px);
      // border: 4px solid var(--n-scrollbar-color);
      box-sizing: border-box;
      border-radius: 16px;
    }
  }
  .content {
    position: relative;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: stretch;
    width: 100%;
    height: 100%;

    .cover {
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      height: 100%;
      // height: calc(100% - 80px);
      width: auto;
      aspect-ratio: 1 / 1;
      margin-right: 20px;
      .cover-img {
        width: 100%;
        height: 100%;
        border-radius: 16px;
        overflow: hidden;
        z-index: 1;
        box-shadow: 0 0 10px 6px #00000008;
        transition: opacity 0.1s ease-in-out;
        :deep(img) {
          width: 100%;
          height: 100%;
          opacity: 0;
          transition: opacity 0.3s ease-in-out;
        }
      }
    }
    .data {
      display: flex;
      flex-direction: column;
      width: 100%;
      color: var(--color);
      .info {
        .name {
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 1;
          overflow: hidden;
          word-break: break-all;
          font-size: 24px;
          font-weight: bold;
        }
        .artist {
          margin-top: 4px;
          display: flex;
          align-items: center;
          .n-icon {
            margin-right: 4px;
            color: var(--color);
          }
          .all-ar {
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 1;
            overflow: hidden;
            word-break: break-all;
            .ar {
              font-size: 16px;
              opacity: 0.7;
              display: inline-flex;
              transition: opacity 0.3s;
              cursor: pointer;
              &::after {
                content: "/";
                margin: 0 4px;
                transition: none;
              }
              &:last-child {
                &::after {
                  display: none;
                }
              }
              &:hover {
                opacity: 1;
              }
            }
          }
        }
        .album {
          margin-top: 4px;
          font-size: 16px;
          display: flex;
          align-items: center;
          .n-icon {
            margin-right: 4px;
            color: var(--color);
          }
          .al {
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 1;
            overflow: hidden;
            word-break: break-all;
            opacity: 0.7;
            transition: opacity 0.3s;
            cursor: pointer;
            &:hover {
              opacity: 1;
            }
          }
        }
      }
      .control {
        position: relative;
        display: flex;
        flex-direction: row;
        align-items: center;
        height: 46px;
        margin-top: auto;
        color: var(--color);
        .play-control {
          --n-width: 46px;
          --n-height: 46px;
          color: var(--color);
          margin-right: 12px;
          transition: background-color 0.3s, transform 0.3s;
          .n-icon {
            transition: opacity 0.1s ease-in-out;
          }
          &:hover {
            transform: scale(1.1);
          }
          &:active {
            transform: scale(1);
          }
        }
        .play-other {
          margin-right: 12px;
          padding: 6px;
          border-radius: 50%;
          transition: background-color 0.3s, transform 0.3s;
          cursor: pointer;
          &:hover {
            transform: scale(1.1);
            background-color: #efefef29;
          }
          &:active {
            transform: scale(1);
          }
        }
        .radio {
          position: absolute;
          right: 0;
          bottom: 0;
          color: var(--color);
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          opacity: 0.6;
          font-size: 16px;
          font-weight: bold;
          pointer-events: none;
          z-index: -1;
          .icon {
            display: flex;
            align-items: center;
            .n-icon {
              margin-right: 6px;
              transform: translateY(-1px);
            }
          }
          .tip {
            font-size: 12px;
            font-weight: normal;
            display: block;
          }
        }
      }
    }
    @media (max-width: 1300px) {
      .cover {
        position: absolute;
        top: 0;
        left: 0;
        height: calc(100% - 60px);
      }
      .data {
        .info {
          padding-left: 140px;
        }
      }
    }
  }
}
</style>
