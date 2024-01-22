<script setup>
import { onMounted, ref, watch } from "vue";
import { useRoute } from "vue-router";
import { searchSong } from "@/api/search";
import { NSkeleton } from "naive-ui";
import { playMusic } from "@/utils/play-utils";
import { getArtist } from "@/utils/utils";

const route = useRoute();
const searchData = ref(null);
const loading = ref(true);

const play = (item) => {
  let song = {
    id: item.id,
    name: item.name,
    artist: getArtist(item.ar),
    pic: item.al.picUrl,
  };
  playMusic(song);
};

// 监听搜索关键词
watch(
  () => route.query,
  async () => {
    loading.value = true;
    searchData.value = null;
    let data = await searchSong({ keywords: route.query.key });
    searchData.value = data.result.songs;
    loading.value = false;
  }
);

onMounted(async () => {
  let data = await searchSong({ keywords: route.query.key });
  searchData.value = data.result.songs;
  loading.value = false;
});
</script>
<template>
  <div class="song-search">
    <n-skeleton
      class="song-item"
      height="73px"
      v-if="loading"
      v-for="item in 30"
    />
    <div
      class="song-item"
      v-else
      v-for="item in searchData"
      @click="play(item)"
    >
      <div class="coverImg">
        <img :src="item.al.picUrl + '?param=50y50'" alt="" />
      </div>
      <div class="info">
        <p>{{ item.name }}</p>
        <p>{{ getArtist(item.ar) }}</p>
      </div>
      <div class="albumInfo">{{ item.al.name }}</div>
    </div>
  </div>
</template>
<style lang="scss">
.song-search {
  width: 100%;
  display: flex;
  flex-flow: row wrap;
  margin-bottom: 20px;
  .song-item {
    width: 32%;
    display: flex;
    flex-flow: row nowrap;
    justify-content: space-between;
    box-shadow: 0px 2px 2px 2px rgba(0, 0, 0, 0.07);
    border: 1px solid transparent;
    border-radius: 5px;
    padding: 10px;
    box-sizing: border-box;
    margin: 8px;
    cursor: pointer;
    &:hover {
      box-shadow: 0px 4px 4px 4px rgba(0, 0, 0, 0.07);
    }

    .coverImg {
      width: 50px;
      height: 50px;

      img {
        border-radius: 5px;
        object-fit: contain;
      }
    }
    .info {
      text-align: left;
      flex-grow: 1;
      margin: 0px 10px;
      p {
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
    }
    .albumInfo {
      height: 50px;
      text-align: right;
      margin: 0px 5px;
      line-height: 50px;
      max-width: 45%;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
  }
}
</style>
