<script setup>
import { onBeforeMount, ref, onMounted, watch, provide } from "vue";
import useMainStore from "@/store/index.js";
import { useRouter } from "vue-router";

const userStore = useMainStore();
const router = useRouter();
const drawerShow = ref(false);
const tabValue = ref(router.currentRoute.value.path.split("/")[1]);

const handleUpdateValue = (value) => {
  router.push({
    name: value,
  });
};

// 监听路由参数变化
watch(
  () => router.currentRoute.value,
  (val) => {
    tabValue.value = val.path.split("/")[1];
  }
);
</script>
<template>
  <div class="home">
    <div class="userInfo">
      <div
        class="userLogo"
        :style="{
          background: `url(${userStore.userData.avatarUrl})`,
        }"
      ></div>
      <div class="userTitle">{{ userStore.userData.name }}</div>
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
    <n-tabs
      type="line"
      :value="tabValue"
      animated
      @update:value="handleUpdateValue"
    >
      <n-tab name="user-playlists"> 我的歌单 </n-tab>
      <n-tab name="user-like">收藏的歌单</n-tab>
      <n-tab name="user-album">收藏的专辑</n-tab>
      <n-tab name="user-artists">收藏的歌手</n-tab>
      <n-tab name="user-cloud">音乐云盘</n-tab>
    </n-tabs>

    <router-view v-slot="{ Component }">
      <Transition name="scale" mode="out-in">
        <keep-alive>
          <component :is="Component" />
        </keep-alive>
      </Transition>
    </router-view>
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

/* 路由跳转动画 */
.scale-enter-active {
  transition: all 0.1s ease-out;
}

.scale-leave-active {
  transition: all 0.3s cubic-bezier(1, 0.5, 0.8, 1);
}
.scale-enter-from,
.scale-leave-to {
  transform: translateX(20px);
  opacity: 0;
}
</style>
