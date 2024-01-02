<script setup>
import { onMounted, ref } from "vue";
import { qrLogin } from "@/api/login/qrLogin";
// 二维码数据
const qrImg = ref(null);

onMounted(async () => {
  qrImg.value = await qrLogin();
});
</script>
<template>
  <div class="qr-img">
    <n-skeleton
      v-if="!qrImg"
      style="min-width: 200px"
      height="200px"
      width="200px"
    />
    <n-image
      width="230"
      height="230"
      v-if="qrImg"
      :src="qrImg"
      preview-disabled
    />
  </div>
</template>
<style lang="scss">
.qr-img {
  width: 230px;
  height: 230px;
  border-radius: 10px;
  background-color: #fff;
  display: flex;
  justify-content: center;
  align-items: center;

  .n-skeleton {
    border-radius: 10px;
  }
}
</style>
