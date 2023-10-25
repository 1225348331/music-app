<script setup>
import { onMounted, ref } from "vue";
import "element-plus/es/components/notification/style/css";
import { ElNotification } from "element-plus";

const active = ref(false);

onMounted(() => {
  ElNotification({
    title: "Error",
    message: "This is an error message",
    type: "error",
  });
});
</script>

<template>
  <n-space>
    <n-switch v-model:value="active" />
    <n-switch v-model:value="active" disabled />
  </n-space>
</template>

<style scoped></style>
