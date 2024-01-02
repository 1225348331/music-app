import request from "@/utils/request.js";
import { ElNotification } from "element-plus";

/**
 * @description: 发送验证码
 * @param {*} phone 手机号码
 * @return {*}
 */
export async function captchaSent(phone) {
  const res = await request({
    url: `/captcha/sent`,
    method: "get",
    params: {
      phone: phone,
    },
  });
  console.log("验证码已发送");
}

/**
 * @description: 校验验证码
 * @param {*} phoneData {手机号码,验证码}
 * @return {*}
 */
export async function captchaVerify(phoneData) {
  const res = await request({
    url: `captcha/verify`,
    method: "get",
    params: {
      phone: phoneData.phone,
      captcha: phoneData.captcha,
    },
  });
  return res;
}

/**
 * @description: 手机验证码登录
 * @param {*} phoneData {手机号码,验证码}
 * @return {*}
 */
export async function phoneLogin(phoneData) {
  const res = await request({
    url: `/login/cellphone`,
    method: "get",
    params: {
      phone: phoneData.phone,
      captcha: phoneData.captcha,
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
    localStorage.setItem("music-cookie", res.data.cookie);
  }
}

export async function loginOut(){
  const res = await request({
    method: "get",
    url: `/logout`,
  });
  console.log(res)
}
