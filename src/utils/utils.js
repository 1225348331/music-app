import axios from "axios";
import "element-plus/es/components/notification/style/css";
import { ElNotification } from "element-plus";
// 创建实例时配置默认值
const request = axios.create({
  baseURL: "https://musicapi.jiangyuhui.top",
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
        config.data.date = new Date().valueOf();
      }
    } else {
      // get请求添加时间戳和cookie
      config.params.cookie = encodeURIComponent(
        localStorage.getItem("music-cookie")
      );
      config.params.date = new Date().valueOf();
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

// 登录
export async function login() {
  // 1467776391 苏淼琪id
  // 344515582  蒋钰辉id
  // 获取登录状态
  let userId = await getLoginStatus();
  // let userId = 344515582
  if (userId != "344515582") {
    console.log("账号正在重新登录~");
    const res = await request({
      url: `/login/cellphone`,
      method: "get",
      params: {
        phone: "15951605681",
        password: "jyh831928",
      },
    });
    if (res.data.code != 200) {
      ElNotification({
        title: "可恶,登录失败啦",
        message: `接口可能出现问题啦,code为${res.data.code}`,
        type: "error",
      });
    } else {
      ElNotification({
        title: "登录成功啦~",
        message: "欢迎首次登录",
        type: "success",
      });
    }
    localStorage.setItem("music-cookie", res.data.cookie);
    await getLoginStatus();
  } else {
    ElNotification({
      title: "再次登录成功啦~",
      type: "success",
    });
  }
}
// 刷新登录
export async function refreshLogin() {
  const res = await request({
    url: `/login/refresh`,
    method: "post",
  });
  localStorage.setItem("music-cookie", res.data.cookie);
}
// 获取歌单列表
export async function getMusicList() {
  // http://139.224.188.129:3003/likelist?uid=8906224199
  // http://139.224.188.129:3003/playlist/track/all?id=482916379&limit=50&offset=1
  // 登录
  await login();
  const res = await request({
    url: `/playlist/track/all?id=482916379&limit=100&offset=10`,
    method: "post",
  }).catch((err) => {
    ElNotification({
      title: "可恶,歌单获取失败啦",
      message: `${err}`,
      type: "error",
      duration: 0,
    });
  });

  let list = [];

  res.data.songs.forEach((item) => {
    list.push({
      id: item.id,
      name: item.name,
      artist: item.ar[0].name,
      url: "",
      lrc: "",
      pic: item.al.picUrl,
    });
  });

  return list;
}
// 获取歌曲歌词
export async function getLyric(id) {
  const res = await request({
    url: `/lyric?id=${id}`,
    method: "get",
  }).catch((err) => {
    ElNotification({
      title: "可恶,歌词获取失败啦",
      message: `${err}`,
      type: "error",
      duration: 0,
    });
  });
  return res.data.lrc.lyric;
}
// 获取歌曲链接
export async function getUrl(id) {
  const res = await request({
    url: `/song/url?id=${id}`,
    method: "get",
  }).catch((err) => {
    ElNotification({
      title: "可恶,歌曲链接获取失败啦",
      message: `${err}`,
      type: "error",
      duration: 0,
    });
  });
  return res.data.data[0].url;
}
// 获取用户详情
export async function getUserDetail(id) {
  // 8906224199
  const res = await request({
    url: `/user/detail`,
    method: "get",
    params: {
      uid: 8906224199,
      date: new Date().valueOf(),
    },
  });
  console.log(res.data);
}
// 获取登录状态
export async function getLoginStatus(id) {
  if (!localStorage.getItem("music-cookie")) {
    return null;
  }
  // 344515582
  const res = await request({
    url: `/login/status`,
    method: "get",
    params: {
      os: "pc",
    },
  }).catch((err) => {
    ElNotification({
      title: "可恶,登录状态获取失败啦",
      message: `${err}`,
      type: "error",
      duration: 0,
    });
  });
  console.log("当前账号ID为", res.data.data.account.id);
  console.log("当前账号会员等级为", res.data.data.account.vipType);
  return res.data.data.account.id;
}
// 获取账号信息
export async function getUserAccount() {
  const res = await request({
    url: `/user/account`,
    method: "get",
  });
  console.log(res.data);
}

// 歌词解析
export function lyricParser(lrcGet) {
  var lrcArray = []; //新建数组,用于存放歌词

  var lrc = lrcGet.split("\n"); //
  // console.log(lrc);

  lrc.forEach((item) => {
    //过滤空白文本
    if (
      item.split("]")[1] == "" ||
      item == ""
      // ||
      // item.indexOf("作曲") !== -1 ||
      // item.indexOf("作词") !== -1
    ) {
      return true;
    }
    //转化时间
    var timeStr = item.substring(item.indexOf("[") + 1, item.indexOf("]"));
    var min = parseInt(timeStr.split(":")[0]) * 60;
    var sec = parseFloat(timeStr.split(":")[1]);
    var time = parseFloat((min + sec).toFixed(3));
    //添加进数组
    lrcArray.push({
      t: time,
      c: item.substring(item.indexOf("]") + 1),
    });
  });
  return lrcArray;
}
export async function getAllMusicTest(idlist) {
  const res = await request({
    url: `/song/url?id=${idlist}`,
    method: "post",
  }).catch((err) => {
    ElNotification({
      title: "可恶,歌单获取失败啦",
      message: `${err}`,
      type: "error",
      duration: 0,
    });
  });

  return res.data.data;

  console.log(res.data);
}


