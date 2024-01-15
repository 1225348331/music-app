<script setup>
/* vue生态 */
import { onMounted, ref, reactive } from "vue"; // vue
import useMainStore from "@/store/index.js"; // pinia
import * as dayjs from "dayjs"; // 时间库
import { NDataTable } from "naive-ui"; // UI库
/* api */
import { getUserCloud } from "@/api/cloud.js";
import { playMusicList, playMusic } from "@/utils/play-utils";

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

// 请求数据
function query(page, pageSize) {
  return new Promise((resolve) => {
    getUserCloud(pageSize, page - 1).then((res) => {
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

onMounted(async () => {
  let res = await getUserCloud();
  console.log(res.data);
  query(paginationReactive.page, paginationReactive.pageSize).then((data) => {
    dataRef.value = data.data;
    paginationReactive.pageCount = data.pageCount;
    paginationReactive.itemCount = data.total;
    loadingRef.value = false;
  });
  // let song = {
  //   id: res.data[502].simpleSong.id,
  //   name: res.data[502].simpleSong.name,
  //   artist: res.data[502].simpleSong.ar[0].name,
  //   pic: res.data[502].simpleSong.al.picUrl,
  // };
  // await playMusic(song);
  // 获取用户歌单
  // let playlistRes = await getUserPlaylist(mainStore.userData.id);
  // allCoverList.value = playlistRes.playlist;
});
</script>
<template>
  <div class="cloud">
    <div class="header">
      <h1>我的云盘</h1>
      <div>云盘容量</div>
      <div class="functional">
        <span>上传歌曲</span>
        <span>模糊搜索</span>
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
    height: 15%;
  }
  .cloudTable {
    flex-grow: 1;
  }
}
</style>
