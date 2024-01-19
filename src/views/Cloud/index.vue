<script setup>
/* vue生态 */
import { onMounted, ref, reactive, h } from "vue"; // vue
import useMainStore from "@/store/index.js"; // pinia
import * as dayjs from "dayjs"; // 时间库
import { NDataTable, NButton, NIcon } from "naive-ui"; // UI库
import { CloudUploadSharp } from "@vicons/material";
/* api */
import { getUserCloud } from "@/api/cloud.js";
import { playMusic } from "@/utils/play-utils";

const mainStore = useMainStore();

// 列数据
const columns = [
  {
    key: "name",
    title: "歌曲名",
  },
  {
    key: "artist",
    title: "歌手",
  },
  {
    key: "album",
    title: "专辑",
  },
  {
    key: "size",
    title: "大小",
  },
  {
    key: "addTime",
    title: "上传时间",
  },
];
// 渲染数据
const dataRef = ref([]);
// 加载中
const loadingRef = ref(true);
// 分页数据
const paginationReactive = reactive({
  page: 1,
  pageCount: 50,
  pageSize: 30,
  prefix({ itemCount }) {
    return `总共 ${itemCount} 首`;
  },
});
const cloudInfo = reactive({
  size: 12.98,
  maxSize: 100,
});

// 请求数据
function query(page, pageSize) {
  return new Promise((resolve) => {
    getUserCloud(pageSize, page - 1).then((res) => {
      console.log(res);
      cloudInfo.size = res.size / Math.pow(1024, 3);
      cloudInfo.maxSize = res.maxSize / Math.pow(1024, 3);
      // 总共多少数据
      const total = res.count;
      // 总共多少页数
      const pageCount = Math.ceil(total / pageSize);
      // 当前展示数据
      const pagedData = [];
      res.data.forEach((item) => {
        pagedData.push({
          id: item.songId, // id
          name: item.songName, // 歌曲名称
          artist: item.artist, // 歌手名称
          pic: item.simpleSong.al?.picUrl, // 封面
          album: item.album ? item.album : "未知", // 专辑
          size: (item.fileSize / 1024 / 1024).toFixed(2) + "M", // 大小
          addTime: dayjs(item.addTime).format("YYYY/MM/DD"), // 上传时间
        });
      });

      resolve({
        pageCount,
        data: pagedData,
        total,
      });
    });
  });
}

// 分页处理
const handlePageChange = (currentPage) => {
  if (!loadingRef.value) {
    loadingRef.value = true;
    query(currentPage, paginationReactive.pageSize).then((data) => {
      dataRef.value = data.data;
      paginationReactive.page = currentPage;
      paginationReactive.pageCount = data.pageCount;
      paginationReactive.itemCount = data.total;
      loadingRef.value = false;
    });
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
  query(paginationReactive.page, paginationReactive.pageSize).then((data) => {
    dataRef.value = data.data;
    paginationReactive.pageCount = data.pageCount;
    paginationReactive.itemCount = data.total;
    loadingRef.value = false;
  });
});
</script>
<template>
  <div class="cloud">
    <div class="header">
      <h1>我的云盘</h1>
      <div class="size">
        云盘容量<span
          >{{ cloudInfo.size.toFixed(2) }}GB/{{
            cloudInfo.maxSize.toFixed(2)
          }}GB</span
        >
      </div>
      <div class="functional">
        <n-button round>
          <template #icon>
            <n-icon><CloudUploadSharp /></n-icon>
          </template>
          上传歌曲
        </n-button>
      </div>
    </div>
    <n-data-table
      class="cloudTable"
      remote
      ref="table"
      :columns="columns"
      :data="dataRef"
      :loading="loadingRef"
      :pagination="paginationReactive"
      @update:page="handlePageChange"
      :bordered="false"
      :row-props="rowProps"
      flex-height
    />
  </div>
</template>
<style lang="scss">
.cloud {
  display: flex;
  flex-flow: column wrap;
  justify-content: flex-start;
  height: 100%;

  .header {
    padding-left: 10px;
    & > div {
      margin: 20px 0px;
    }
    .size {
      span {
        font-family: "";
        font-weight: 500;
      }
    }
  }
  .cloudTable {
    flex-grow: 1;
    .n-scrollbar-content {
      padding: 0px !important;
    }
  }
}
</style>
