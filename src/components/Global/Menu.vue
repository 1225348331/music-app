<script setup>
import { ref, h, computed } from "vue";
import { useRouter, RouterLink } from "vue-router";
import { NIcon, NMenu } from "naive-ui";
import SvgIcon from "@/components/Global/SvgIcon.vue";

// 侧边栏折叠
let props = defineProps(["asideMenuCollapsed"]);
const router = useRouter();
// 菜单栏绑定值
const menuActiveKey = ref(router.currentRoute.value.name ?? "Home");
// 图标渲染
const renderIcon = (icon, color = "#68cb25") => {
  return () =>
    h(NIcon, { color }, { default: () => h(SvgIcon, { icon }, null) });
};

const menuOptions = computed(() => [
  {
    label: () =>
      h(
        RouterLink,
        {
          to: {
            name: "Home",
          },
        },
        () => ["个性推荐"]
      ),
    key: "Home",
    icon: renderIcon("home", "#f55e55"),
  },
  {
    label: () =>
      h(
        RouterLink,
        {
          to: {
            name: "Recommend",
          },
        },
        () => ["发现音乐"]
      ),
    key: "Recommend",
    icon: renderIcon("discover-fill", "#b22c00"),
  },
  {
    label: "私人漫游",
    key: "fm",
    icon: renderIcon("radio", "#2b88c5"),
  },
  {
    key: "divider-1",
    type: "divider",
  },
  {
    type: "group",
    label: "我的音乐",
    key: "user",
    children: [],
    show: !props.asideMenuCollapsed,
  },
  {
    label: () =>
      h(
        RouterLink,
        {
          to: {
            name: "Home",
          },
          class: "user-playlist",
        },
        () => ["我喜欢的音乐"]
      ),
    key: "like-songs",
    icon: renderIcon("favorite-rounded", "#ff6501"),
  },
  {
    label: () =>
      h(
        RouterLink,
        {
          to: {
            name: "Home",
          },
        },
        () => ["我的收藏"]
      ),
    key: "like",
    icon: renderIcon("star", "#ffb200"),
  },
  {
    label: () =>
      h(
        RouterLink,
        {
          to: {
            name: "Home",
          },
        },
        () => ["我的云盘"]
      ),
    key: "cloud",
    icon: renderIcon("cloud", "#eaacff"),
  },
  {
    label: () =>
      h(
        RouterLink,
        {
          to: {
            name: "Home",
          },
        },
        () => ["最近播放"]
      ),
    key: "history",
    icon: renderIcon("history"),
  },
  {
    key: "divider-2",
    type: "divider",
  },
]);
</script>
<template>
  <n-menu
    ref="mainMenuRef"
    v-model:value="menuActiveKey"
    :class="['main-menu', 'siderShowCover']"
    :root-indent="props.asideMenuCollapsed ? 36 : 26"
    :indent="0"
    :collapsed="props.asideMenuCollapsed"
    :defaultExpandedKeys="['user-playlists', 'favorite-playlists']"
    :collapsed-width="64"
    :collapsed-icon-size="22"
    :options="menuOptions"
    @contextmenu.stop
  />
</template>
<style lang="scss" scoped>
.main-menu {
  padding-bottom: 14px;
  :deep(.n-menu-item) {
    .n-menu-item-content {
      &.n-menu-item-content--selected {
        &::before {
          border-left: 4px solid var(--n-item-text-color-active);
        }
      }
      .n-text {
        display: inline-block;
        text-overflow: ellipsis;
        overflow: hidden;
      }
      // 普通歌单
      .user-playlist {
        display: flex;
        align-items: center;
        justify-content: space-between;
      }
      // 带封面歌单
      .user-pl-cover {
        display: flex;
        flex-direction: row;
        align-items: center;
        .n-avatar {
          border-radius: 8px;
          width: 34px;
          height: 34px;
          min-width: 34px;
          margin-right: 12px;
        }
      }
    }
  }
  // 折叠菜单
  :deep(.n-submenu) {
    .n-menu-item-content {
      &:hover {
        .n-base-icon {
          color: var(--n-group-text-color);
        }
      }
      .n-base-icon {
        color: var(--n-group-text-color);
        font-size: 0.93em;
      }
      .user-list {
        color: var(--n-group-text-color);
        font-size: 0.93em;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
        padding-right: 20px;
        .add {
          height: 20px;
          width: 34px;
          .n-icon {
            font-size: 12px;
          }
        }
      }
    }
  }
  &.cover {
    :deep(.n-submenu-children) {
      --n-item-height: 50px;
    }
  }
}
</style>

<!-- 特殊样式 -->
<style lang="scss">
.heart-rate-btn {
  &:hover {
    background-color: var(--main-second-color) !important;
    color: var(--main-color) !important;
  }
  &.collapsed {
    margin-left: 12px;
    background-color: #efefef40;
    color: #efefef;
    &:hover {
      background-color: #efefef60 !important;
      color: #efefef !important;
    }
  }
}
</style>
