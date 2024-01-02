<script setup>
import qrLogin from "@/components/login/qrLogin.vue";
import captchaLogin from "@/components/login/captchaLogin.vue";
import passwordLogin from "@/components/login/passwordLogin.vue";
import { login } from "@/api/login/passwordLogin";
import { onMounted } from "vue";


onMounted(() => {

})

// login()
</script>
<template>
  <div class="login">
    <div class="logo"></div>
    <div class="title">登录八月小辉辉的Music</div>
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
        <qrLogin />
      </n-tab-pane>
      <n-tab-pane name="phone" tab="验证码登录">
        <captchaLogin />
      </n-tab-pane>
      <n-tab-pane name="email" tab="密码登录">
        <passwordLogin />
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
  }
}
</style>
