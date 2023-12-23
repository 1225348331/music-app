<script setup>
import { ref } from "vue";
// 二维码
import QrcodeVue from "qrcode.vue";
// 二维码数据
const qrImg = ref(null);
</script>
<template>
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
</template>
<style lang="scss" scoped></style>
