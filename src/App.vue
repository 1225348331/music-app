<script setup>
import { onMounted, h, ref, onBeforeMount } from "vue";
import "element-plus/es/components/notification/style/css";
import { RouterLink, useRouter } from "vue-router";
import Player from "@/components/player/player.vue";

const activeKey = ref("home");

const menuOptions = [
  {
    label: () =>
      h(
        RouterLink,
        {
          to: {
            name: "home",
          },
        },
        { default: () => "首页" }
      ),
    key: "home",
  },
  {
    label: () =>
      h(
        RouterLink,
        {
          to: {
            name: "login",
          },
        },
        { default: () => "发现" }
      ),
    key: "faxian",
  },
  {
    label: () =>
      h(
        RouterLink,
        {
          to: {
            name: "test",
          },
        },
        { default: () => "音乐馆" }
      ),
    key: "music",
  },
];

const themeOverrides = {
  Input: {
    loadingColor: "#f55e55",
    caretColor: "#f55e55",
    borderHover: "1px solid #f55e55",
    borderFocus: "1px solid #f55e55",
  },
  Slider: {
    fillColor: "#f55e55",
    fillColorHover: "#f55e55",
  },
  Tabs: {
    tabTextColorActiveLine: "#f55e55",
    tabTextColorHoverLine: "#f55e55",
    tabTextColorActiveBar: "#f55e55",
    tabTextColorHoverBar: "#f55e55",
    tabTextColorActiveCard: "#f55e55",
    barColor: "#f55e55",
  },
  Menu: {
    itemTextColorActive: "#f55e55",
    itemTextColorActiveHover: "#f55e55",
    itemTextColorChildActive: "#f55e55",
    itemTextColorChildActiveHover: "#f55e55",
    itemTextColorHoverHorizontal: "#f55e55",
    itemTextColorActiveHorizontal: "#f55e55",
    itemTextColorActiveHoverHorizontal: "#f55e55",
    itemTextColorChildActiveHorizontal: "#f55e55",
    itemTextColorChildActiveHoverHorizontal: "#f55e55",
  },
};

onMounted(() => {});
</script>

<template>
  <n-notification-provider :max="3">
    <n-config-provider :theme-overrides="themeOverrides">
      <div style="height: 100vh; background-color: rgb(250, 250, 252)">
        <n-space justify="space-around" size="large">
          <div class="left">
            <div class="logo"></div>
            <div class="prev"></div>
            <div class="next"></div>
          </div>
          <div class="center">
            <n-menu
              v-model:value="activeKey"
              mode="horizontal"
              :options="menuOptions"
            />
          </div>
          <div class="right">33</div>
        </n-space>
        <n-scrollbar style="max-height: calc(100vh - 130px)">
          <div class="main">
            <router-view v-slot="{ Component }">
              <Transition name="scale" mode="out-in">
                <keep-alive>
                  <component :is="Component" />
                </keep-alive>
              </Transition>
            </router-view>
          </div>
        </n-scrollbar>
        <div class="musicPlayer">
          <Player />
        </div>
      </div>
    </n-config-provider>
  </n-notification-provider>
</template>
<style lang="scss" scoped>
.n-space {
  margin: 0 auto;
  height: 60px;
  line-height: 60px;
  box-shadow: 0px 1px 1px 0px rgba(0, 0, 0, 0.1);
  font-weight: bold;
  align-items: center;
  background-color: #fff;

  .left {
    .logo {
      width: 30px;
      height: 30px;
      background: url("@/assets/image/favicon.png");
      background-size: 100%;
      background-repeat: no-repeat;
    }
  }
}
.n-scrollbar {
  .main {
    margin: 0 auto;
    max-width: 1400px;
    padding-top: 50px;
  }
}

.musicPlayer {
  box-sizing: border-box;
  height: 70px;
  // border: 1px solid red;
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