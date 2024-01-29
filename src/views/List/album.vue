<script setup name="playlist">
/* vue生态 */
import { onMounted, ref, reactive, h, computed } from "vue"; // vue
import { NImage, NText, NCard, NEllipsis } from "naive-ui"; // UI库
import { useRouter, useRoute } from "vue-router";
/* api */
import {
  getMusicList,
  getArtistHot,
  getAlbumDetail,
  getPlaylistDescription,
} from "@/api/cover.js";
import { playMusic, playMusicList } from "@/utils/play-utils";

const router = useRouter();
const route = useRoute();
const id = computed(() => route.query.id);
const playListDetail = ref(null);
// playMusicList({ id: id.value });
// 渲染数据
const data = ref([]);

// 分页数据
const paginationReactive = reactive({
  page: 1, // 总共多少页
  pageCount: 5, // 总页数
  pageSize: 30, // 一页的数量
  prefix({ itemCount }) {
    return `总共 ${itemCount} 首`;
  },
});

// 请求数据
function query(page, pageSize, callBack) {
  return new Promise((resolve) => {
    callBack(id.value, pageSize, page - 1).then((res) => {
      // 总共多少数据
      const total = res.length;
      // 总共多少页数
      const pageCount = Math.ceil(total / pageSize);
      resolve({
        pageCount,
        data: res,
        total,
      });
    });
  });
}

// 分页处理
const handlePageChange = (currentPage) => {
  if (!loadingRef.value) {
    loadingRef.value = true;
    query(currentPage, paginationReactive.pageSize, getMusicList).then(
      (data) => {
        data.value = data.data;
        paginationReactive.page = currentPage;
        paginationReactive.pageCount = data.pageCount;
        paginationReactive.itemCount = data.total;
        loadingRef.value = false;
      }
    );
  }
};

// 点击事件
const rowProps = (row) => {
  return {
    style: "cursor:pointer",
    onClick: async () => {
      await playMusic(row);
    },
  };
};

onMounted(async () => {
  query(
    paginationReactive.page,
    paginationReactive.pageSize,
    getMusicList
  ).then((res) => {
    data.value = res.data;
    paginationReactive.pageCount = res.pageCount;
    paginationReactive.itemCount = res.total;
  });
  playListDetail.value = await getPlaylistDescription(id.value);
});
</script>
<template>
  <div class="cloud">
    <div class="header">
      <div class="cover">
        <!-- 封面 -->
        <n-image
          class="cover-img"
          :src="playListDetail?.pic"
          preview-disabled
        />
        <!-- 封面背板 -->
        <n-image :src="route.query.pic" class="cover-shadow" preview-disabled />
      </div>
      <div class="description">
        <h1 class="title">{{ playListDetail?.name }}</h1>
        <n-ellipsis class="desc" :line-clamp="2">
          {{ playListDetail?.description }}
        </n-ellipsis>
      </div>
    </div>
    <n-card
      v-for="(item, index) in data"
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
      hoverable
      @click="checkCanClick(data, item, songsIndex + index)"
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
        <n-text v-if="item.alia" class="alia" depth="3">{{ item.alia }}</n-text>
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
  </div>
</template>
<style lang="scss">
.cloud {
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
    .description {
      display: flex;
      flex-flow: column nowrap;
      .desc {
        margin-top: 20px;
      }
    }
  }
}
</style>
<style lang="scss">
.songs {
  border-radius: 8px;
  margin-bottom: 12px;
  transition: transform 0.3s, border-color 0.3s, box-shadow 0.3s;
  cursor: pointer;
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
  .action {
    width: 40px;
    display: flex;
    align-items: center;
    justify-content: space-evenly;
    .favorite {
      padding-top: 1px;
      transition: transform 0.3s;
      cursor: pointer;
      &:hover {
        transform: scale(1.15);
      }
      &:active {
        transform: scale(1);
      }
    }
    .more {
      display: none;
    }
  }
  .update {
    width: 80px;
    text-align: center;
  }
  .count {
    width: 120px;
    text-align: center;
  }
  .duration {
    width: 50px;
    text-align: center;
  }
  .size {
    width: 80px;
    text-align: right;
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
    border-color: var(--main-color);
    box-shadow: 0 1px 2px -2px var(--main-boxshadow-color),
      0 3px 6px 0 var(--main-boxshadow-color),
      0 5px 12px 4px var(--main-boxshadow-hover-color);
  }
  &:active {
    transform: scale(0.995);
  }
}
</style>
