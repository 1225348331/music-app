import request from "@/utils/request.js";
import { useRouter } from "vue-router";
import { ElNotification } from "element-plus";

// 手机密码登录
export async function login() {
  // 1467776391 苏淼琪id
  // 344515582  蒋钰辉id

  const res = await request({
    url: `/login/cellphone`,
    method: "get",
    params: {
      phone: "15951605681",
      password: "jyh831928",
      // phone: "17712280112",
      // password: "Smq@123+",
      noCookie: true,
    },
  });
  if (res.data.code == 200) {
    ElNotification({
      title: "登录成功啦~",
      message: "欢迎来到八月小辉辉的音乐库",
      type: "success",
    });
    localStorage.setItem("music-cookie", res.data.cookie);
    // 登录成功跳转至首页
    const router = useRouter();
    router.push({
      name: "home",
    });
  } else {
    ElNotification({
      title: "可恶,登录失败啦",
      message: `登录接口可能出现问题啦,code为${res.data.code}`,
      type: "error",
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
