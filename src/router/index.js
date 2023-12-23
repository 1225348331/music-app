import { createRouter, createWebHistory } from "vue-router";
import "element-plus/es/components/notification/style/css";
import { ElNotification } from "element-plus";
import useMainStore from "../store";
import { getUserAccount } from "@/api/user.js";

// 路由信息
let routes = [
  {
    path: "/",
    name: "home",
    component: () => import("@/views/playList/index.vue"),
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
    path: "/login",
    name: "login",
    component: () => import("@/views/Login/Login.vue"),
  },
  {
    path: "/test",
    name: "test",
    component: () => import("@/views/Test.vue"),
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
  } else {
    return true;
  }
});

export default router;
