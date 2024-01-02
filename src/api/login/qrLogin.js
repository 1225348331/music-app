import request from "@/utils/request.js";
import { useRouter } from "vue-router";

/**
 * @description: 二维码状态校验
 * @param {*} key
 * @return {*}
 */
async function checkStatus(key) {
  const res = await request({
    url: `/login/qr/check?key=${key}&noCookie=true`,
  });
  console.log(res)
  return res.data;
}

/**
 * @description: 二维码登录
 * @return {*} 二维码图片
 */
async function qrLogin() {
  let timer;
  const cookie = localStorage.getItem("music-cookie");
  getLoginStatus(cookie);
  // 二维码key生成
  const res = await request({
    url: `/login/qr/key`,
  });
  const key = res.data.data.unikey;
  // 二维码图片生成
  const res2 = await request({
    url: `/login/qr/create?key=${key}&qrimg=true`,
  });

  // 定时器请求是否登录成功
  timer = setInterval(async () => {
    // 如果通过其他方式登录了,则清除定时器
    if (localStorage.getItem("music-cookie")) {
      clearInterval(timer);
    }

    const statusRes = await checkStatus(key);
    if (statusRes.code === 800) {
      ElNotification({
        title: "可恶,登录失败啦",
        message: `二维码已经过期，请刷新页面重试`,
        type: "error",
      });
      clearInterval(timer);
    }
    if (statusRes.code === 803) {
      // 这一步会返回cookie
      clearInterval(timer);
      // 获取登录状态
      await getLoginStatus(statusRes.cookie);
      // 存储cookie
      localStorage.setItem("music-cookie", statusRes.cookie);
      // 路由导航至首页
      const router = useRouter();
      router.push({
        name: home,
      });
    }
  }, 3000);

  return res2.data.data.qrimg;
}

/**
 * @description: 获取登录状态
 * @param {*} cookie
 * @return {*}
 */
async function getLoginStatus(cookie = "") {
  const res = request({
    url: `/login/status`,
    method: "post",
    data: {
      cookie,
    },
  });
  console.log(res);
}

export { qrLogin };
