import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";
// 全局状态共享 pinia
import { createPinia } from "pinia";
// UI组件库 naive
import naive from "naive-ui";
// 路由 vue-router
import router from "@/router/index";

const pinia = createPinia();

const app = createApp(App);

app.use(pinia);
app.use(router);
app.use(naive);
app.mount("#app");
