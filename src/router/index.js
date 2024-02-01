import { createRouter, createWebHistory } from "vue-router";
import "element-plus/es/components/notification/style/css";
import { ElNotification } from "element-plus";
import useMainStore from "../store";


// 路由信息
let routes = [
  {
    // 发现音乐
    path: "/",
    name: "Home",
    component: () => import("@/views/Home/index.vue"),
  },
  {
    // 登录
    path: "/Login",
    name: "Login",
    component: () => import("@/views/Login/Login.vue"),
  },
  {
    // 我的云盘
    path: "/Cloud",
    name: "Cloud",
    component: () => import("@/views/Cloud/index.vue"),
  },
  {
    // 搜索
    path: "/Search",
    name: "Search",
    component: () => import("@/views/Search/index.vue"),
  },
  {
    // 个性推荐
    path: "/Recommend",
    name: "Recommend",
    component: () => import("@/views/Recommend/index.vue"),
  },
  {
    // 歌单列表
    path: "/playlist",
    name: "playlist",
    component: () => import("@/views/List/playlist.vue"),
  },
  {
    // 歌手介绍
    path: "/artist",
    name: "artist",
    component: () => import("@/views/List/artist.vue"),
  },
  {
    // 新碟上架
    path: "/album",
    name: "album",
    component: () => import("@/views/List/album.vue"),
  },
];

// 路由器
const router = createRouter({
  history: createWebHistory(), // HTML5模式
  routes,
});

// 检验是否登录
router.beforeEach(async (to, from) => {
  let cookie = localStorage.getItem("music-cookie");
  if (!cookie) {
    if (to.name != "login") {
      ElNotification({
        title: "尚未登录",
        message: `您尚未登录，请登录后重试~`,
        type: "error",
      });
      // 重定向到登录界面
      return {
        name: "login",
      };
    }
  } else {
    return true;
  }
});

export default router;
