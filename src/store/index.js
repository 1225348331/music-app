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
      // 用户歌单
      userPlayLists: [],
      // slider相关参数
      slider: {
        currentValue: 0,
        currentTime: "00:00",
        durationTime: "02:34",
        max: 0,
      },
      // 当前播放音乐参数
      currentMusic: {
        id: "",
        name: "",
        artist: "",
        url: "",
        pic: "",
        lyr: "",
      },
      // 歌词相关参数
      currentLrcIndex: 0,
    };
  },
  getters: {},
  actions: {},
});

export default mainStore;
