<script setup>
import { onMounted } from 'vue';
import { getUserCloud } from '@/api/cloud'

onMounted(async () => {
  let cloudRes = await getUserCloud() 

})
</script>
<template>
  <div class="coverList">
    <h1>cloud</h1>
  </div>
</template>
<style lang="scss" scoped></style>
