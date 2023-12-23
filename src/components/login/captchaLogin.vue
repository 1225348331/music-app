<script setup>
import { ref } from "vue";
import { PhoneAndroidRound, PasswordRound } from "@vicons/material";
import { captchaSent, captchaVerify, phoneLogin } from "@/api/login/captchaLogin.js";
// 手机号登录数据
const phoneFormRef = ref(null);
const phoneFormData = ref({
  phone: "15951605681",
  captcha: null,
});
const captchaText = ref("获取验证码");
const captchaDisabled = ref(false);

// 获取验证码
const getCaptcha = async (phone) => {
  captchaDisabled.value = !captchaDisabled.value;
  await captchaSent(phone);
};
// 手机验证码登录
const usePhoneLogin = async (phoneFormData) => {
  let Verifyres = await captchaVerify(phoneFormData);
  if (Verifyres.data.code == 200) {
    phoneLogin(phoneFormData);
  } else {
    console.log("验证码错误");
  }
};
</script>
<template>
  <n-form
    class="phone"
    ref="phoneFormRef"
    :model="phoneFormData"
    :show-label="false"
  >
    <n-form-item path="phone">
      <n-input placeholder="请输入手机号" v-model:value="phoneFormData.phone">
        <template #prefix>
          <n-icon :component="PhoneAndroidRound" />
        </template>
      </n-input>
    </n-form-item>
    <n-form-item path="captcha">
      <n-input-number
        style="width: 100%"
        placeholder="请输入短信验证码"
        v-model:value="phoneFormData.captcha"
        :show-button="false"
      >
        <template #prefix>
          <n-icon :component="PasswordRound" />
        </template>
      </n-input-number>
      <n-button
        color="#f55e55"
        type="primary"
        style="margin-left: 12px"
        :disabled="captchaDisabled"
        @click="getCaptcha(phoneFormData.phone)"
      >
        {{ captchaText }}
      </n-button>
    </n-form-item>
    <n-form-item>
      <n-button
        color="#f55e55"
        style="width: 100%"
        type="primary"
        @click="usePhoneLogin(phoneFormData)"
      >
        登录
      </n-button>
    </n-form-item>
  </n-form>
</template>
<style lang="scss" scoped></style>
