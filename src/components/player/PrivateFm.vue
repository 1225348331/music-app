<script setup>
import { storeToRefs } from "pinia";
import { useRouter } from "vue-router";
import { onBeforeMount, ref } from "vue";
import { NImage, NIcon, NButton } from "naive-ui";
import SvgIcon from "@/components/Global/SvgIcon.vue";

const privateFmSong = {};
const playMode = ref("fm");
const playState = ref(false);
const playLoading = ref(false);

// 播放暂停
const fmPlayOrPause = () => {
  if (playMode.value === "fm") {
    playOrPause();
  } else {
    // 更改播放模式
    playMode.value = "fm";
    initPlayer(true);
  }
};

// 重新加载
const personalFmReload = async () => {
  console.log(111);
  await music.setPersonalFm();
};

onBeforeMount(async () => {});
</script>
<!-- 私人 FM -->
<template>
  <div
    class="private-fm"
    :style="{
      '--color': playMode === 'fm' ? '#efefef' : `rgb(30, 30, 34)`,
    }"
  >
    <!-- 背景 -->
    <div
      class="overlay"
      :style="{
        backgroundImage: `url(${
          privateFmSong?.coverSize?.m || 'src/assets/image/song.jpg'
        })`,
      }"
    />
    <!-- 内容 -->
    <div class="content">
      <!-- 封面 -->
      <Transition name="fade" mode="out-in">
        <div :key="privateFmSong?.id" class="cover">
          <n-image
            :src="privateFmSong?.coverSize?.l"
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
                  src="src/assets/image/song.jpg?assest"
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
          <span class="name">{{ privateFmSong?.name || "未知歌曲" }}</span>
          <div class="artist">
            <n-icon depth="3" size="20">
              <SvgIcon icon="account-music" />
            </n-icon>
            <div v-if="privateFmSong?.artists" class="all-ar">
              <span
                v-for="ar in privateFmSong.artists"
                :key="ar.id"
                class="ar"
                @click.stop="router.push(`/artist?id=${ar.id}`)"
              >
                {{ ar.name }}
              </span>
            </div>
            <div v-else class="all-ar">
              <span class="ar">未知艺术家</span>
            </div>
          </div>
          <div
            class="album"
            @click.stop="router.push(`/album?id=${privateFmSong?.album.id}`)"
          >
            <n-icon depth="3" size="20">
              <SvgIcon icon="album" />
            </n-icon>
            <span v-if="privateFmSong?.album" class="al">
              {{ privateFmSong.album.name }}
            </span>
            <span v-else class="album">未知专辑</span>
          </div>
        </div>
        <!-- 操作 -->
        <div class="control">
          <!-- 播放暂停 -->
          <n-button
            :loading="playMode === 'fm' && playLoading"
            :focusable="false"
            class="play-control"
            color="#efefef"
            type="primary"
            strong
            secondary
            circle
            @click.stop="fmPlayOrPause"
          >
            <template #icon>
              <Transition name="fade" mode="out-in">
                <n-icon :key="playMode === 'fm' && playState" size="32">
                  <SvgIcon
                    :icon="
                      playMode === 'fm'
                        ? playState
                          ? 'pause-rounded'
                          : 'play-arrow-rounded'
                        : 'play-arrow-rounded'
                    "
                  />
                </n-icon>
              </Transition>
            </template>
          </n-button>
          <!-- 下一曲 -->
          <n-icon class="play-other" size="26" @click.stop="">
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
      border: 4px solid var(--n-scrollbar-color);
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