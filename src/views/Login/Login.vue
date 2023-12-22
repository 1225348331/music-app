<script setup>
import { ref } from "vue";
import { PhoneAndroidRound, PasswordRound } from "@vicons/material";
import { captchaSent, captchaVerify, phoneLogin } from "@/api/login.js";
// 二维码
import QrcodeVue from "qrcode.vue";
// 二维码数据
const qrImg = ref(null);
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
  <div class="login">
    <div class="logo"></div>
    <div class="title">登录PlayerMusic</div>
    <n-tabs
      animated
      justify-content="space-evenly"
      :pane-style="{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        paddingTop: '30px',
      }"
      class="tab"
      type="segment"
    >
      <n-tab-pane name="qr" tab="扫码登录">
        <n-card class="qr-img">
          <n-skeleton
            v-if="!qrImg"
            style="min-width: 180px"
            height="180px"
            width="180px"
          />
          <QrcodeVue
            v-else
            class="qr"
            :value="qrImg"
            :size="180"
            level="H"
            background="#00000000"
          />
        </n-card>
      </n-tab-pane>
      <n-tab-pane name="phone" tab="验证码登录">
        <n-form
          class="phone"
          ref="phoneFormRef"
          :model="phoneFormData"
          :show-label="false"
        >
          <n-form-item path="phone">
            <n-input
              placeholder="请输入手机号"
              v-model:value="phoneFormData.phone"
            >
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
      </n-tab-pane>
      <n-tab-pane name="email" tab="邮箱登录">
        <n-alert
          style="
            width: 100%;
            margin-top: -20px;
            margin-bottom: 12px;
            border-radius: 10px;
          "
          type="warning"
        >
          邮箱登录暂不安全,请使用其他方式~
        </n-alert>
      </n-tab-pane>
    </n-tabs>
  </div>
</template>
<style lang="scss" scoped>
.login {
  margin: 0 auto;
  margin-top: 50px;
  width: 50%;
  display: flex;
  flex-flow: column nowrap;
  justify-content: center;
  align-items: center;
  & > div {
    margin: 20px 0px;
  }
  .logo {
    width: 80px;
    height: 80px;
    background: url("@/assets/image/favicon.png");
    background-size: 100%;
    background-repeat: no-repeat;
  }
  .title {
    font-size: 25px;
    font-weight: 600;
  }
  .n-tabs {
    width: 50%;
    .qr-img {
      width: 220px;
      height: 220px;
      border-radius: 8px;
      background-color: #fff;
      :deep(.n-card__content) {
        display: flex;
        align-items: center;
        justify-content: center;
        .n-skeleton {
          border-radius: 8px;
        }
      }
    }
  }
}
</style>
