<script setup>
import {
  NLayout,
  NLayoutHeader,
  NLayoutSider,
  NIcon,
  NNotificationProvider,
  NConfigProvider,
} from "naive-ui";
/* vue生态 */
import { onMounted, h, ref } from "vue";
/* 组件 */
import Menu from "@/components/Global/Menu.vue";
import MainLayout from "@/components/Global/MainLayout.vue";
import Player from "@/components/player/player.vue";
import MainNav from "@/components/Nav/MainNav.vue";

const themeOverrides = {
  Input: {
    loadingColor: "#f55e55",
    caretColor: "#f55e55",
    borderHover: "1px solid #f55e55",
    borderFocus: "1px solid #f55e55",
    boxShadowFocus: "0 0 0 1px #f55e55",
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

const asideMenuCollapsed = ref(false);

onMounted(() => {});
</script>
<template>
  <n-notification-provider :max="3">
    <n-config-provider
      :theme-overrides="themeOverrides"
      :style="{ height: '100vh' }"
    >
      <!-- 主框架 -->
      <n-layout class="all-layout">
        <!-- 导航栏 -->
        <n-layout-header bordered> <MainNav /> </n-layout-header>
        <!-- 主内容 - 有侧边栏 -->
        <n-layout position="absolute" class="body-layout player-bar" has-sider>
          <!-- 侧边栏 -->
          <n-layout-sider
            :native-scrollbar="false"
            :collapsed-width="64"
            :width="240"
            class="main-sider"
            show-trigger
            collapse-mode="width"
            bordered
            :collapsed="asideMenuCollapsed"
            @collapse="asideMenuCollapsed = true"
            @expand="asideMenuCollapsed = false"
          >
            <!-- 菜单 -->
            <div class="sider-all">
              <Menu :asideMenuCollapsed="asideMenuCollapsed" />
            </div>
          </n-layout-sider>
          <!-- 页面区 -->
          <n-layout class="content-layout" :native-scrollbar="false" embedded>
            <MainLayout :asideMenuCollapsed="asideMenuCollapsed" />
          </n-layout>
        </n-layout>
      </n-layout>
      <!-- 主播放器 -->
      <Player />
    </n-config-provider>
  </n-notification-provider>
</template>

<style lang="scss" scoped>
.all-layout {
  height: 100%;
  transition: transform 0.3s, opacity 0.3s;
  font-family: "myfont-3";
  .n-layout-header {
    height: 60px;
    display: flex;
    flex-direction: row;
    align-items: center;
    -webkit-app-region: drag;
  }
  .body-layout {
    width: 100vw;
    top: 60px;
    transition: bottom 0.3s;
    .main-sider {
      :deep(.n-scrollbar-content) {
        height: 100%;
      }
      .sider-all {
        height: 100%;
      }
      @media (max-width: 900px) {
        display: none;
      }
    }

    .content-layout {
      flex-grow: 1;
    }
    &.player-bar {
      bottom: 80px;
    }
  }
  &.full-player {
    opacity: 0;
    transform: scale(0.9);
  }
}
</style>
