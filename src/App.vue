<script setup>
import { onMounted, h, ref, onBeforeMount } from "vue";
import "element-plus/es/components/notification/style/css";
import { RouterLink, useRouter } from "vue-router";
import { NIcon } from "naive-ui";
import Player from "@/components/player/player.vue";
import iconText from "@/components/icon-text.vue";
import { IosSettings, MdCloudy } from "@vicons/ionicons4";
import {
  FavoriteRound,
  AccountBalanceSharp,
  AddAPhotoRound,
  AttachEmailOutlined,
  CameraTwotone,
} from "@vicons/material";

const activeKey = ref("test");
function renderIcon(icon, color = "#68cb25") {
  return () =>
    h(
      NIcon,
      {
        size: 20,
        color: color,
      },
      { default: () => h(icon) }
    );
}
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
        { default: () => "我的歌单" }
      ),
    key: "home",
    icon: renderIcon(FavoriteRound, "#f55e55"),
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
        { default: () => "我的云盘" }
      ),
    key: "test",
    icon: renderIcon(MdCloudy, "#2b88c5"),
  },
  {
    label: "推荐歌手",
    key: "推荐歌手",
    icon: renderIcon(AccountBalanceSharp, "#b22c00"),
  },
  {
    label: "上传音乐",
    key: "上传音乐",
    icon: renderIcon(AddAPhotoRound, "#ff6501"),
  },
  {
    label: "统计",
    key: "统计",
    icon: renderIcon(AttachEmailOutlined, "#ffb200"),
  },
  {
    label: "关于网站",
    key: "关于网站",
    icon: renderIcon(CameraTwotone, "#eaacff"),
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
      <div
        class="container"
        style="height: 100vh; background-color: rgb(250, 250, 252)"
      >
        <!-- 菜单 + 路由 -->
        <div class="main-body">
          <!-- 左侧导航栏 -->
          <div class="left">
            <div class="login">登录</div>
            <n-menu v-model:value="activeKey" :options="menuOptions" />
          </div>
          <!-- 中间路由 -->
          <n-scrollbar class="body" style="max-height: calc(100vh - 70px)">
            <router-view v-slot="{ Component }">
              <Transition name="scale" mode="out-in">
                <keep-alive>
                  <component :is="Component" />
                </keep-alive>
              </Transition>
            </router-view>
          </n-scrollbar>
        </div>
        <!-- 底部播放器 -->
        <div class="musicPlayer">
          <Player />
        </div>
      </div>
    </n-config-provider>
  </n-notification-provider>
</template>
<style lang="scss">
.container {
  background-color: #f4f4f5;
  display: flex;
  flex-flow: column nowrap;
  font-family: '灵悦黑体';

  .main-body {
    width: 100vw;
    display: flex;
    flex-flow: row nowrap;
    flex-grow: 1;

    .left {
      font-weight: bold;
      align-items: center;
      width: 300px;
      height: calc(100vh - 70px);
      background: #fff;
      border-radius: 0px 10px 10px 0px;
      box-shadow: -12px -20px 16px 2px rgba(0, 0, 0, 0.04),
        2px -1px 20px 0px rgba(0, 0, 0, 0.08);

      & > div {
        padding: 15px 0px;
        border-radius: 10px;
        cursor: pointer;
        width: 100%;
        // box-shadow: 0px 6px 16px 2px rgba(0, 0, 0, 0.04),
        //   0px 4px 10px rgba(0, 0, 0, 0.08);
      }

      .login {
        text-align: center;
      }

      .functions {
        text-align: center;
      }
    }

    .body {
      width: calc(100vw - 300px);
      box-sizing: border-box;
      --n-scrollbar-width: 0px !important;

      .n-scrollbar-content {
        padding: 20px;
      }
    }
  }

  .musicPlayer {
    box-sizing: border-box;
    height: 70px;
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
