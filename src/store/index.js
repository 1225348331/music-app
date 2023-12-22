import { defineStore } from "pinia";

const mainStore = defineStore("mainStore", {
  state: () => {
    return {
      // 用户基础数据
      userData: {
        id: "", // 用户uid
        name: "", // 用户昵称
        avatarUrl: "", // 用户头像
      },
    };
  },
  getters: {},
  actions: {},
});

export default mainStore;
