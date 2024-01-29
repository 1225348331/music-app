<script setup>
import { ref, h, computed, onMounted } from "vue";
import { useRouter, RouterLink } from "vue-router";
import { NIcon, NMenu, NButton, NAvatar, NText } from "naive-ui";
import SvgIcon from "@/components/Global/SvgIcon.vue";
import { getUserPlaylist } from "@/api/user.js";
import useMainStore from "@/store/index";
import { ConsoleSqlOutlined } from "@vicons/antd";

const mainStore = useMainStore();

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

// 创建的歌单
const userPlaylists = ref({
  label: () =>
    h("div", { class: "user-list" }, [
      h("span", { class: "name" }, ["创建的歌单"]),
    ]),
  key: "user-playlists",
  children: [],
});

// 收藏的歌单
const favoritePlaylists = ref({
  label: () =>
    h("div", { class: "user-list" }, [
      h("span", { class: "name" }, ["收藏的歌单"]),
    ]),
  key: "favorite-playlists",
  children: [],
});

const menuOptions = computed(() => [
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
        () => ["我的云盘"]
      ),
    key: "cloud",
    icon: renderIcon("cloud", "#eaacff"),
  },
  {
    key: "divider-2",
    type: "divider",
  },
  { ...userPlaylists.value, show: !props.asideMenuCollapsed },
  { ...favoritePlaylists.value, show: !props.asideMenuCollapsed },
]);

// 更改数据
const changeUserPlaylists = (data) => {
  // 用户ID
  let userId = mainStore.userData.id;
  // 创建的歌单
  const userPlaylistsData = data.filter(
    (playlist) => playlist.userId == userId
  );
  // 收藏的歌单
  const favoritePlaylistsData = data.filter(
    (playlist) => playlist.userId != userId
  );

  // 更改数据
  userPlaylists.value.children = userPlaylistsData.map((v) => {
    return {
      label: () =>
        !props.asideMenuCollapsed
          ? h(
              "div",
              {
                class: "user-pl-cover",
                onclick: () => {
                  router.push({
                    path: "/playlist",
                    query: {
                      id: v.id,
                    },
                  });
                },
              },
              [
                h(NAvatar, {
                  src: v?.coverImgUrl,
                  fallbackSrc: "/src/assets/image/album.jpg",
                }),
                h(NText, null, () => [v.name]),
              ]
            )
          : h(
              RouterLink,
              {
                to: {
                  path: "/playlist",
                  query: {
                    id: v.id,
                  },
                },
                class: "user-playlist",
              },
              () => [h(NText, null, () => [v.name])]
            ),
      key: v.id,
      icon: !props.asideMenuCollapsed
        ? null
        : renderIcon("queue-music-rounded"),
    };
  });
  favoritePlaylists.value.children = favoritePlaylistsData.map((v) => {
    return {
      label: () =>
        !props.asideMenuCollapsed
          ? h(
              "div",
              {
                class: "user-pl-cover",
                onclick: () => {
                  router.push({
                    path: "/playlist",
                    query: {
                      id: v.id,
                    },
                  });
                },
              },
              [
                h(NAvatar, {
                  src: v?.coverImgUrl,
                  fallbackSrc: "/src/assets/image/album.jpg",
                }),
                h(NText, null, () => [v.name]),
              ]
            )
          : h(
              RouterLink,
              {
                to: {
                  path: "/playlist",
                  query: {
                    id: v.id,
                  },
                },
                class: "user-playlist",
              },
              () => [h(NText, null, () => [v.name])]
            ),
      key: v.id,
      icon: !props.asideMenuCollapsed
        ? null
        : renderIcon("queue-music-rounded"),
    };
  });
};

onMounted(async () => {
  // 获取用户歌单
  let data = await getUserPlaylist(mainStore.userData.id);
  changeUserPlaylists(data.playlist);
});
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
    :default-expanded-keys="['favorite-playlists']"
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
        font-size: 12px;
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
          width: 25px;
          height: 25px;
          min-width: 25px;
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
