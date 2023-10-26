<script setup>
import { onBeforeMount, onMounted, ref } from "vue";
import useMainStore from "@/store/index.js";
import { useRouter } from "vue-router";
import { getUserAccount } from "@/api/user.js";

const userStore = useMainStore();
const router = useRouter();

// 头像
const avatarUrl = ref(null);
// 昵称
const nickname = ref(null);

const handleUpdateValue = (value) => {
  router.push({
    name: value,
  });
};

onBeforeMount(async () => {
  let res = await getUserAccount();
  avatarUrl.value = res.profile.avatarUrl;
  nickname.value = res.profile.nickname;
  userStore.userData.id = res.profile.userId;
  router.push({
    name: "user-playlists",
  });
});
</script>
<template>
  <div class="home">
    <div class="userInfo">
      <div
        class="userLogo"
        :style="{
          background: `url(${avatarUrl})`,
        }"
      ></div>
      <div class="userTitle">{{ nickname }}</div>
      <div
        style="
          font-size: 20px;
          font-weight: 550;
          transform: translateY(8px);
          margin-left: 10px;
          color: rgb(51, 54, 57);
        "
      >
        的音乐库
      </div>
    </div>
    <n-tabs type="line" animated @update:value="handleUpdateValue">
      <n-tab name="user-playlists"> 我的歌单 </n-tab>
      <n-tab name="user-like">收藏的歌单</n-tab>
      <n-tab name="user-album">收藏的专辑</n-tab>
      <n-tab name="user-artists">收藏的歌手</n-tab>
      <n-tab name="user-cloud">音乐云盘</n-tab>
    </n-tabs>
    <div class="router">
      <router-view></router-view>
    </div>
    
  </div>
</template>
<style lang="scss" scoped>
.home {
  height: 100%;
  display: flex;
  flex-flow: column nowrap;
  .userInfo {
    display: flex;
    flex-flow: row nowrap;
    align-items: center;
    margin-bottom: 20px;
    .userLogo {
      width: 80px;
      height: 80px;
      background-size: 100% !important;
      background-repeat: no-repeat !important;
      border-radius: 50%;
      box-shadow: 0 6px 8px -2px rgba(0, 0, 0, 0.16);
      margin-right: 20px;
    }
    .userTitle {
      font-size: 40px;
      font-weight: bolder;
    }
  }
}
</style>
