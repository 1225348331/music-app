import { createRouter, createWebHistory } from "vue-router";

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
    // redirect: "/playlists",
    children: [
      {
        path: "playlists",
        name: "user-playlists",
        component: () => import("@/views/User/playlists.vue"),
      },
      {
        path: "like",
        name: "user-like",
        component: () => import("@/views/User/like.vue"),
      },
      {
        path: "album",
        name: "user-album",
        component: () => import("@/views/User/album.vue"),
      },
      {
        path: "artists",
        name: "user-artists",
        component: () => import("@/views/User/artists.vue"),
      },
      {
        path: "cloud",
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
    path: "/Test",
    name: "Test",
    component: Test,
  },
];

// 路由器
const router = createRouter({
  history: createWebHistory(), // HTML5模式
  routes,
});

export default router;
