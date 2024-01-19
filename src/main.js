import { createApp } from "vue";
import "@/style/main.scss";
import "@/style/animate.scss";
import App from "./App.vue";
// 全局状态共享 pinia
import { createPinia } from "pinia";
// 路由 vue-router
import router from "@/router/index";

const pinia = createPinia();
const app = createApp(App);

app.use(pinia);
app.use(router);
app.mount("#app");
