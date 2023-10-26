import { defineStore } from "pinia";

const mainStore = defineStore("mainStore", {
  state: () => {
    return {
      // 用户基础数据
      userData: {
        id: "",
      },
      // 用户歌单
      userPlayLists: {
        isLoading: false,
        has: false,
        own: [], // 创建歌单
        like: [], // 收藏歌单
      },
    };
  },
  getters: {},
  actions: {},
});

export default mainStore;
