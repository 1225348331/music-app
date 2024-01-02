import axios from "axios";
import "element-plus/es/components/notification/style/css";
import { ElNotification } from "element-plus";
// 创建实例时配置默认值
const request = axios.create({
  baseURL: "/api",
  withCredentials: true,
  params: {
    // 加上时间戳防止缓存
    timestamp: Date.now(),
  },
  data: {
    // 加上时间戳防止缓存
    timestamp: Date.now(),
  },
});

// 请求拦截器
request.interceptors.request.use(
  function (config) {
    // post请求添加时间戳和cookie
    if (config.method == "post") {
      if (!config.data.noCookie) {
        config.data.cookie = localStorage.getItem("music-cookie");
        config.data.timestamp = Date.now()
      }
    } else {
      if (!config.params.noCookie) {
        // get请求添加时间戳和cookie
        config.params.cookie = encodeURIComponent(
          localStorage.getItem("music-cookie")
        );
        config.params.timestamp = Date.now()
      }
    }
    return config;
  },
  function (error) {
    // 对请求错误做些什么
    ElNotification({
      title: "可恶,登录失败啦",
      message: `请求失败,问题为${error}`,
      type: "error",
    });
    return Promise.reject(error);
  }
);

// 响应拦截器
request.interceptors.response.use(
  function (response) {
    return response;
  },
  function (error) {
    // 超出 2xx 范围的状态码都会触发该函数。
    // 对响应错误做点什么
    ElNotification({
      title: "可恶,登录失败啦",
      message: `响应失败,问题为${error}`,
      type: "error",
    });
    return Promise.reject(error);
  }
);

export default request;
