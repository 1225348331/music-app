import { createRouter, createWebHistory } from "vue-router";
import "element-plus/es/components/notification/style/css";
import { ElNotification } from "element-plus";
import useMainStore from "../store";
import { getUserAccount } from "@/api/user.js";

// 引入
import Home from "@/views/Home.vue";
import Login from "@/views/Login/Login.vue";
import Test from "@/views/Test.vue";

// 路由信息
let routes = [
  {
    path: "/",
    name: "home",
    component: Home,
    redirect: "/user-playlists",
    children: [
      {
        path: "user-playlists",
        name: "user-playlists",
        component: () => import("@/views/User/playlists.vue"),
        beforeEnter: async (to, from) => {
          const userStore = useMainStore();
          if (!userStore.userData.id) {
            let res = await getUserAccount();
            userStore.userData.avatarUrl = res.profile.avatarUrl;
            userStore.userData.name = res.profile.nickname;
            userStore.userData.id = res.profile.userId;
          }
          // reject the navigation
          return true;
        },
      },
      {
        path: "user-like",
        name: "user-like",
        component: () => import("@/views/User/like.vue"),
      },
      {
        path: "user-album",
        name: "user-album",
        component: () => import("@/views/User/album.vue"),
      },
      {
        path: "user-artists",
        name: "user-artists",
        component: () => import("@/views/User/artists.vue"),
      },
      {
        path: "user-cloud",
        name: "user-cloud",
        component: () => import("@/views/User/cloud.vue"),
      },
    ],
  },
  {
    path: "/login",
    name: "login",
    component: Login,
  },
  {
    path: "/test",
    name: "test",
    component: Test,
  },
];

// 路由器
const router = createRouter({
  history: createWebHistory(), // HTML5模式
  routes,
});

router.beforeEach((to, from) => {
  let cookie = localStorage.getItem("music-cookie");
  if (!cookie) {
    ElNotification({
      title: "尚未登录",
      message: `您尚未登录，请登录后重试~`,
      type: "success",
    });
    return {
      name: "login",
    };
  }
});

export default router;
