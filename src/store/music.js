import { defineStore } from "pinia";
/* 工具类 */
import player from "@/utils/player";

const useMusicStore = defineStore("musicStore", {
  state: () => ({
    audioPlayer: new player(),
    // 播放器参数
    player: {
      // 音量
      volume: 1,
      // 播放 / 暂停
      isPlay: false,
      // 当前播放音乐在音乐列表中的索引
      currentMusicIndex: 0,
    },
    // 进度条参数
    progress: {
      min: 0,
      max: 400,
      value: 0
    },
    // 歌单
    musicList: [],
    // 当前播放音乐信息
    currentMusicInfo: {
      id: "",
      name: "",
      artist: "",
      url: "",
      pic: "",
      lyric: [],
    },
    // 歌词
    lyric: {
      marginTop: 0,
      currentLyricIndex: 0,
    },
  }),
  actions: {},
});

export default useMusicStore;
