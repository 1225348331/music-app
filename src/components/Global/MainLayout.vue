<script setup>
import { NBackTop, NIcon } from "naive-ui";
import SvgIcon from "@/components/Global/SvgIcon.vue";
const props = defineProps(["asideMenuCollapsed"]);
</script>
<template>
  <main
    id="main-layout"
    :class="['main-layout', { 'no-sider': !props.asideMenuCollapsed }]"
  >
    <!-- 回顶 -->
    <n-back-top
      :bottom="110"
      style="transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
    >
      <n-icon size="26">
        <SvgIcon icon="chevron-up" />
      </n-icon>
    </n-back-top>
    <!-- 路由页面 -->
    <router-view v-slot="{ Component }" class="main-router">
      <transition name="router" mode="out-in">
        <keep-alive>
          <component :is="Component" />
        </keep-alive>
      </transition>
    </router-view>
  </main>
</template>
<style lang="scss" scoped>
.main-layout {
  padding: 24px;
  &.no-sider {
    padding: 0;
    background-color: var(--n-color);
    .main-router {
      margin: 0 auto;
      padding: 24px;
    }
  }
}
</style>
