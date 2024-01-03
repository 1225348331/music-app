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
    // component: () => import("@/views/playList/index.vue"),
    component: () => import("@/views/Home/index.vue"),
    beforeEnter: async (to, from) => {
      const userStore = useMainStore();
      if (!userStore.userData.id) {
        let res = await getUserAccount();
        console.log(res);
        userStore.userData.avatarUrl = res.profile.avatarUrl;
        userStore.userData.backgroundUrl = res.profile.backgroundUrl;
        userStore.userData.name = res.profile.nickname;
        userStore.userData.id = res.profile.userId;
        userStore.userData.signature = res.profile.signature;
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
    component: () => import("@/views/Cloud/index.vue"),
  },
];

// 路由器
const router = createRouter({
  history: createWebHistory(), // HTML5模式
  routes,
});

// 检验是否登录
router.beforeEach((to, from) => {
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
