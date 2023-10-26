<script setup>
import { onMounted, h, ref, onBeforeMount } from "vue";
import "element-plus/es/components/notification/style/css";
import { ElNotification } from "element-plus";
import { RouterLink, useRouter } from "vue-router";

const router = useRouter();

const active = ref(false);
const activeKey = ref("home");

const menuOptions = [
  {
    label: () =>
      h(
        RouterLink,
        {
          to: {
            name: "login",
          },
        },
        { default: () => "首页" }
      ),
    key: "home",
  },
  {
    label: () =>
      h(
        RouterLink,
        {
          to: {
            name: "home",
          },
        },
        { default: () => "发现" }
      ),
    key: "faxian",
  },
  {
    label: () =>
      h(
        RouterLink,
        {
          to: {
            name: "home",
          },
        },
        { default: () => "音乐馆" }
      ),
    key: "music",
  },
];

const themeOverrides = {
  Input: {
    loadingColor: "#f55e55",
    caretColor: "#f55e55",
    borderHover: "1px solid #f55e55",
    borderFocus: "1px solid #f55e55",
  },
};

onBeforeMount(() => {
  let cookie = localStorage.getItem("music-cookie");
  if (cookie) {
    router.push({
      name: "home",
    });
    ElNotification({
      title: "欢迎登录",
      message: `欢迎来到小辉辉的音乐屋~`,
      type: "success",
    });
  } else {
    router.push({
      name: "login",
    });
    ElNotification({
      title: "尚未登录",
      message: `您尚未登录，请登录后重试~`,
      type: "success",
    });
  }
});

onMounted(() => {});
</script>

<template>
  <n-config-provider :theme-overrides="themeOverrides">
    <div style="height: 100vh; background-color: rgb(250, 250, 252)">
      <n-space justify="space-around" size="large">
        <div class="left">
          <div class="logo"></div>
          <div class="prev"></div>
          <div class="next"></div>
        </div>
        <div class="center">
          <n-menu
            v-model:value="activeKey"
            mode="horizontal"
            :options="menuOptions"
          />
        </div>
        <div class="right">33</div>
      </n-space>
      <n-scrollbar style="max-height: calc(100vh - 60px)">
        <div class="main">
          <router-view v-slot="{ Component }">
            <keep-alive>
              <Transition name="scale" mode="out-in">
                <component :is="Component" />
              </Transition>
            </keep-alive>
          </router-view>
        </div>
      </n-scrollbar>
    </div>
  </n-config-provider>
</template>
<style lang="scss" scoped>
.n-space {
  margin: 0 auto;
  height: 60px;
  line-height: 60px;
  box-shadow: 0px 1px 1px 0px rgba(0, 0, 0, 0.1);
  font-weight: bold;
  align-items: center;
  background-color: #fff;

  .left {
    .logo {
      width: 30px;
      height: 30px;
      background: url("@/assets/image/favicon.png");
      background-size: 100%;
      background-repeat: no-repeat;
    }
  }
}
.n-scrollbar {
  .main {
    margin: 0 auto;
    max-width: 1400px;
    padding-top: 50px;
  }
}
/* 路由跳转动画 */
.scale-enter-active {
  transition: all 0.1s ease-out;
}

.scale-leave-active {
  transition: all 0.3s cubic-bezier(1, 0.5, 0.8, 1);
}
.scale-enter-from,
.scale-leave-to {
  transform: translateX(20px);
  opacity: 0;
}
</style>
