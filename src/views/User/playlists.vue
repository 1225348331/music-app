<script setup>
import { onBeforeMount, onMounted, ref } from "vue";
import { getUserPlaylist } from "@/api/user.js";
import useMainStore from "@/store/index.js";
import { HeadsetRound } from "@vicons/material";

const mainStore = useMainStore();

const coverList = ref(null);

onMounted(async () => {
  console.log(mainStore.userData.id);
  let playlistRes = await getUserPlaylist(mainStore.userData.id);
  coverList.value = playlistRes.playlist;
  console.log(playlistRes);
  // playlistRes.coverImgUrl
  // playlistRes.name
  // playlistRes.playCount
  // playlistRes.creator.nickname
});
</script>
<template>
  <div class="coverList">
    <div class="cover" v-for="item in coverList">
      <div class="img">
        <div class="playCount">
          <n-icon>
            <HeadsetRound theme="filled" />
          </n-icon>
          {{ item.playCount }}
        </div>
        <img :src="item.coverImgUrl" alt="" />
      </div>
      <div style="max-width: 100%; font-size: 15px">
        {{ item.name }}
      </div>
      <n-ellipsis style="max-width: 100%; font-size: 12px; color: #838487">
        By{{ item.creator.nickname }}</n-ellipsis
      >
    </div>
  </div>
</template>
<style lang="scss" scoped>
.coverList {
  display: flex;
  flex-flow: row wrap;
  justify-content: space-between;
  height: 100%;
  margin-top: 20px;

  .cover {
    width: 210px;
    margin: 10px 0px;
    border-radius: 10px;
    cursor: pointer;
    display: flex;
    flex-flow: column nowrap;

    .img {
      width: 210px;
      height: 210px;
      border-radius: 8px;
      box-shadow: 0px 1px 1px 0px rgb(0, 0, 0, 0.1);
      overflow: hidden;
      position: relative;

      .playCount {
        position: absolute;
        display: flex;
        align-items: center;
        color: #fff;
        bottom: 0px;
        right: 0px;
        padding: 3px 8px;
        background-color: rgba(0, 24, 23, 0.5);
        border-top-left-radius: 8px;
        z-index: 1;
        .n-icon{
          margin-right: 3px;
        }
      }

      & > img {
        width: 100%;
        height: 100%;
        transition: transform 0.3s;

        &:hover {
          transform: scale(1.1);
        }
      }
    }
  }
}
</style>
