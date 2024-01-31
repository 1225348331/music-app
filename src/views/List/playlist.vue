<script setup name="playlist">
/* vue生态 */
import { onMounted, ref, reactive, h, computed, watch } from "vue"; // vue
import {
  NImage,
  NText,
  NCard,
  NEllipsis,
  NAvatar,
  NPagination,
} from "naive-ui"; // UI库
import { useRoute } from "vue-router";
import useMusicStore from "@/store/music.js";
/* 组件 */
import Loading from "@/components/Loading/index.vue";
/* api */
import { getMusicList, getPlaylistDescription } from "@/api/cover.js";
import { playMusic, playMusicList } from "@/utils/play-utils";
import dayjs from "dayjs";

const musicStore = useMusicStore();
const route = useRoute();
const id = computed(() => route.query.id);
const playListDetail = ref(null);
// 渲染数据
const data = ref([]);
// 是否是当前歌单
const isThisPlayList = computed(() => musicStore.musicList == data.value);
// 分页数据
const paginationReactive = reactive({
  page: 1, // 总共多少页
  pageCount: 5, // 总页数
  pageSize: 20, // 一页的数量
});

const isLoading = ref(true);

// 请求数据
function query() {
  return new Promise((resolve) => {
    getMusicList(id.value).then((res) => {
      // 总共多少数据
      const total = res.length;
      // 总共多少页数
      const pageCount = Math.ceil(total / paginationReactive.pageSize);
      resolve({
        pageCount,
        data: res,
        total,
      });
    });
  });
}

watch(
  () => id.value,
  async () => {
    if (id.value) {
      isLoading.value = true;
      query().then((res) => {
        isLoading.value = false;
        data.value = res.data;
        paginationReactive.pageCount = res.pageCount;
        paginationReactive.itemCount = res.total;
      });
      // 获取歌单描述
      playListDetail.value = await getPlaylistDescription(id.value);
    }
  },
  {
    immediate: true,
  }
);

/* 处理分页 */
const handlePage = (page) => {
  paginationReactive.page = page;
};

// 点击事件
const handleClick = (song, index) => {
  if (!isThisPlayList.value) musicStore.musicList = data.value;
  musicStore.player.currentMusicIndex =
    (paginationReactive.page - 1) * paginationReactive.pageSize + index;
  playMusic(song);
};
</script>
<template>
  <div>
    <Loading v-if="isLoading" />
    <div class="playlist" v-if="!isLoading">
      <div class="header">
        <!-- 封面 -->
        <div class="cover">
          <n-image
            class="cover-img"
            :src="playListDetail?.coverImgUrl"
            preview-disabled
          />
        </div>
        <!-- 歌单详情 -->
        <div class="data">
          <!-- 歌单名称 -->
          <n-text class="name">
            {{ playListDetail?.name }}
          </n-text>
          <!-- 歌单创建者 -->
          <div class="creator">
            <n-avatar
              :src="
                (
                  playListDetail?.creator?.avatarUrl + '?param=300y$300'
                ).replace(/^http:/, 'https:')
              "
              fallback-src="/src/assets/image/avatar.jpg"
              round
            />
            <n-text class="nickname">{{
              playListDetail?.creator?.nickname || "未知创建者"
            }}</n-text>
            <n-text
              v-if="playListDetail?.createTime"
              class="create-time"
              depth="3"
            >
              {{ dayjs(playListDetail?.createTime).format("YYYY/MM/DD") }} 创建
            </n-text>
          </div>
          <!-- 歌单简介 -->
          <n-ellipsis
            class="description"
            expand-trigger="click"
            :tooltip="false"
            :line-clamp="2"
          >
            {{ playListDetail?.description }}
          </n-ellipsis>
        </div>
      </div>
      <!-- 歌单列表 -->
      <n-card
        v-for="(item, index) in data.slice(
          (paginationReactive.page - 1) * paginationReactive.pageSize,
          paginationReactive.page * paginationReactive.pageSize
        )"
        :id="'song-list-' + index"
        :key="index"
        :content-style="{
          padding: '16px',
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }"
        class="songs"
        :class="
          (musicStore.player.currentMusicIndex == index) & isThisPlayList
            ? 'songPlay'
            : ''
        "
        hoverable
        @click="handleClick(item, index)"
      >
        <!-- 序号 -->
        <n-text class="num" depth="3">
          {{ index + 1 }}
        </n-text>
        <!-- 封面 -->
        <div class="cover">
          <n-image
            :src="item.pic + '?param=45y45'"
            class="cover-img"
            preview-disabled
            lazy
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
                  src="/src/assets/image/song.jpg"
                  alt="song"
                />
              </div>
            </template>
          </n-image>
        </div>
        <!-- 信息 -->
        <div class="info">
          <div class="title">
            <!-- 名称 -->
            <n-text class="name" depth="2">
              {{ item?.name || "未知曲目" }}
            </n-text>
          </div>
          <!-- 歌手 -->
          <div v-if="Array.isArray(item.artist)" class="artist">
            <n-text v-for="ar in item.artists" :key="ar.id" class="ar">
              {{ ar.name }}
            </n-text>
          </div>
          <div v-else class="artist">
            <n-text class="ar" @dblclick.stop>
              {{ item.artist || "未知艺术家" }}
            </n-text>
          </div>
          <!-- 别名 -->
          <n-text v-if="item.alia" class="alia" depth="3">{{
            item.alia
          }}</n-text>
        </div>
        <!-- 专辑 -->
        <n-text v-if="item.album" class="album hidden">
          {{
            typeof item.album === "object"
              ? item.album?.name || "未知专辑"
              : item.album
          }}
        </n-text>
        <n-text v-else class="album hidden">未知专辑</n-text>
      </n-card>
      <!-- 分页 -->
      <n-pagination
        v-model:page="paginationReactive.page"
        :page-count="paginationReactive.pageCount"
        :on-update:page="handlePage"
      />
    </div>
  </div>
</template>
<style lang="scss">
.playlist {
  display: flex;
  flex-flow: column wrap;
  justify-content: flex-start;
  height: 100%;

  .header {
    display: flex;
    flex-direction: row;
    align-items: stretch;
    margin-bottom: 20px;
    .cover {
      position: relative;
      display: flex;
      width: 200px;
      height: 200px;
      min-width: 200px;
      margin-right: 20px;
      border-radius: 8px;
      .cover-img {
        width: 100%;
        height: 100%;
        border-radius: 8px;
        z-index: 1;
        transition: filter 0.3s, transform 0.3s;
        :deep(img) {
          width: 100%;
          opacity: 0;
          transition: opacity 0.35s ease-in-out;
        }
        &:active {
          transform: scale(0.98);
        }
      }
      .cover-shadow {
        position: absolute;
        top: 4px;
        height: 100%;
        width: 100%;
        filter: blur(16px) opacity(0.6);
        transform: scale(0.92, 0.96);
        z-index: 0;
        background-size: cover;
        aspect-ratio: 1/1;
      }
    }
    .data {
      width: 100%;
      .name {
        font-size: 30px;
        font-weight: bold;
        margin-bottom: 12px;
        -webkit-line-clamp: 2;
      }
      .creator {
        display: flex;
        flex-direction: row;
        align-items: center;
        .n-avatar {
          width: 28px;
          height: 28px;
          margin-right: 8px;
        }
        .nickname {
          transition: color 0.3s;
          cursor: pointer;
          &:hover {
            color: var(--main-color);
          }
        }
        .create-time {
          margin-left: 12px;
          font-size: 13px;
        }
      }
      .tags {
        margin-top: 12px;
        .pl-tags {
          font-size: 13px;
          padding: 0 16px;
          line-height: 0;
          cursor: pointer;
          transition: transform 0.3s, background-color 0.3s, color 0.3s;
          &:hover {
            background-color: var(--main-second-color);
            color: var(--main-color);
          }
          &:active {
            transform: scale(0.95);
          }
        }
      }
      .num {
        margin-top: 12px;
        .num-item {
          display: flex;
          flex-direction: row;
          align-items: center;
          .n-icon {
            margin-right: 4px;
            // color: var(--main-color);
          }
        }
      }
      .description {
        margin-top: 12px;
        margin-left: 2px;
        .n-text {
          display: initial;
        }
      }
      :deep(.n-skeleton) {
        &:first-child {
          width: 60%;
          margin-top: 0;
          height: 40px;
        }
        height: 30px;
        margin-top: 12px;
        border-radius: 8px;
      }
    }
  }

  .n-pagination {
    margin: 0 auto;
  }

  .songs {
    border-radius: 8px;
    margin-bottom: 12px;
    transition: transform 0.3s, border-color 0.3s, box-shadow 0.3s;
    cursor: pointer;

    .num {
      width: 30px;
      height: 30px;
      min-width: 30px;
      border-radius: 8px;
      margin-right: 16px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .cover {
      width: 50px;
      height: 50px;
      min-width: 50px;
      border-radius: 8px;
      margin-right: 16px;
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
      .cover-img {
        width: 100%;
        height: 100%;
        z-index: 1;
        transition: filter 0.3s, transform 0.3s;
        :deep(img) {
          width: 100%;
          opacity: 0;
          transition: opacity 0.35s ease-in-out;
        }
      }
    }
    .info {
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: center;
      padding-right: 20px;
      .title {
        display: flex;
        align-items: center;
        flex-direction: row;
        .name {
          font-size: 16px;
          font-weight: bold;
          transition: color 0.3s;
          -webkit-line-clamp: 2;
          &:hover {
            color: var(--main-color);
          }
        }
        .n-tag {
          margin-left: 8px;
          height: 18px;
          &.cloud {
            padding: 0 10px;
            align-items: center;
            justify-content: center;
            :deep(.n-tag__icon) {
              margin-right: 0;
              width: 100%;
            }
          }
          &.mv {
            cursor: pointer;
          }
        }
      }
      .artist {
        margin-top: 2px;
        font-size: 13px;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 1;
        overflow: hidden;
        word-break: break-all;
        .ar {
          display: inline-flex;
          transition: opacity 0.3s;
          opacity: 0.6;
          cursor: pointer;
          &::after {
            content: "/";
            margin: 0 4px;
          }
          &:last-child {
            &::after {
              display: none;
            }
          }
          &:hover {
            opacity: 0.8;
          }
        }
      }
      .alia {
        margin-top: 2px;
        font-size: 12px;
        opacity: 0.8;
      }
    }
    .album {
      flex: 1;
      padding-right: 20px;
      transition: color 0.3s;
      -webkit-line-clamp: 2;
      &:hover {
        color: var(--main-color);
      }
    }
    &.play {
      background-color: var(--main-second-color);
      border-color: var(--main-color);
      a,
      span,
      .play {
        color: var(--main-color) !important;
      }
      .artist {
        .ar {
          opacity: 0.8;
          transition: opacity 0.3s;
          &:hover {
            opacity: 1;
          }
        }
      }
      .album {
        opacity: 0.8;
        transition: opacity 0.3s;
        &:hover {
          opacity: 1;
        }
      }
    }
    &:last-child {
      margin-bottom: 0;
    }
    &:hover {
      border: 1px dashed black;
      box-shadow: 0 1px 2px -2px var(--main-boxshadow-color),
        0 3px 6px 0 var(--main-boxshadow-color),
        0 5px 12px 4px var(--main-boxshadow-hover-color);
    }
    &:active {
      transform: scale(0.995);
    }
  }

  .songPlay {
    border: 1px dashed red;
  }
}
</style>
