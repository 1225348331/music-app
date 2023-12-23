import { Howl, Howler } from "howler";
import useMusicStore from "@/store/music";
import { getCurrentLyricIndex } from "@/utils/play-utils";

/* 音乐播放器 */
class player {
  constructor() {}
  loadMusic(src, autoPlay = true) {
    let _this = this;
    Howler.unload();
    const musicStore = useMusicStore();
    musicStore.audioPlayer.cancelTimeUpdate();
    musicStore.lyric.currentLyricIndex = 0;
    const player = new Howl({
      src: [src],
      format: ["mp3", "flac"],
      html5: true,
      preload: true,
      volume: musicStore.volume,
    });
    // 首次加载事件
    player?.once("load", () => {
      musicStore.progress.value = 0;
      musicStore.progress.max = _this.getDurationTime();
      console.log("load被触发了");
    });
    // 播放事件
    player?.on("play", () => {
      _this.timeUpdate();
      musicStore.player.isPlay = true;
      console.log("play被触发了");
    });
    // 声音fade事件
    player?.on("fade", () => {
      console.log("fade被触发了");
    });
    // 暂停事件
    player?.on("pause", () => {
      _this.cancelTimeUpdate();
      musicStore.player.isPlay = false;
      console.log("pause被触发了");
    });
    // 播放进行中时间
    player?.on("seek", () => {
      console.log("我被触发了");
    });
    // 结束事件
    player?.on("end", () => {
      _this.cancelTimeUpdate();
      musicStore.player.isPlay = false;
      console.log("当前音乐播放结束啦");
    });
    // 错误事件
    player?.on("loaderror", () => {});
    // 错误事件
    player?.on("playerror", () => {});
    player.play();
    console.log(player);
    // _this.player = player;
    window.player = player;
  }
  getCurrentTime() {
    return window.player.seek();
  }
  getDurationTime() {
    return window.player._duration;
  }
  play() {
    if (window.player) window.player.play();
  }
  pause() {
    if (window.player) window.player.pause();
  }
  seek(value) {
    const musicStore = useMusicStore();
    musicStore.progress.value = value;
    if (window.player) window.player.seek(value);
  }
  stop() {
    if (window.player) window.player.stop();
  }
  timeUpdate() {
    let _this = this;
    const musicStore = useMusicStore();
    let updateTime = function () {
      // 当前播放时刻
      musicStore.progress.value = _this.getCurrentTime();
      musicStore.lyric.currentLyricIndex = getCurrentLyricIndex(
        musicStore.progress.value + 0.1
      );
      _this.animateID = requestAnimationFrame(updateTime);
    };
    updateTime();
  }
  cancelTimeUpdate() {
    let _this = this;
    if (_this.animateID) {
      cancelAnimationFrame(_this.animateID);
    }
  }
}

export default player;
