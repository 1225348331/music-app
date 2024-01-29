import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import path from "path";
import VueSetupExtend from "vite-plugin-vue-setup-extend";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), VueSetupExtend()],
  resolve: {
    // 配置路径别名
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    port: "3000",
    proxy: {
      "/api": {
        target: "https://musicapi.jiangyuhui.top/",
        // target: "http://localhost:3003/",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""), // 不可以省略rewrite
      },
    },
  },
});
