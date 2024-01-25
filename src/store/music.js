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
      currentMusicIndex: -1,
      // 顺序播放 0/ 随机播放 1/ 私人FM 2/循环播放 3
      playType: 0,
    },
    // 进度条参数
    progress: {
      min: 0,
      max: 400,
      value: 0,
    },
    // 歌单
    musicList: [],
    // 私人FM歌单
    FMList: [],
    // 当前播放音乐信息
    currentMusicInfo: {
      id: "",
      name: "请选择歌曲~",
      artist: "请选择歌曲~",
      url: "",
      pic: "/src/assets/image/1.jpg",
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
