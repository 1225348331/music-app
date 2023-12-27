import axios from "axios";
import "element-plus/es/components/notification/style/css";
import { ElNotification } from "element-plus";
// 创建实例时配置默认值
const request = axios.create({
  baseURL: "/api",
  // baseURL: "https://musicapi.jiangyuhui.top/",
  withCredentials: true,
  params: {},
});

// 请求拦截器
request.interceptors.request.use(
  function (config) {
    // post请求添加时间戳和cookie
    if (config.method == "post") {
      if (!config.data) config.data = {};
      if (config.url != "/login") {
        config.data.cookie = localStorage.getItem("music-cookie");
        config.data.timestamp = new Date().valueOf();
      }
    } else {
      // get请求添加时间戳和cookie
      config.params.cookie = encodeURIComponent(
        localStorage.getItem("music-cookie")
      );
      config.params.timestamp = new Date().valueOf();
    }
    return config;
  },
  function (error) {
    // 对请求错误做些什么
    return Promise.reject(error);
  }
);

// 请求拦截器
request.interceptors.response.use(
  function (response) {
    return response;
  },
  function (error) {
    // 超出 2xx 范围的状态码都会触发该函数。
    // 对响应错误做点什么
    return Promise.reject(error);
  }
);

export default request




