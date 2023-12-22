import { Howl, Howler } from "howler";
import useMusicStore from "@/store/music";

/* 音乐播放器 */
class player {
  constructor() {}
  loadMusic(src, autoPlay = true) {
    let _this = this;
    Howler.unload();
    const musicStore = useMusicStore();
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
    });
    // 播放事件
    player?.on("play", () => {});
    // 暂停事件
    player?.on("pause", () => {});
    // 结束事件
    player?.on("end", () => {
      console.log('当前音乐播放结束啦')
    });
    // 错误事件
    player?.on("loaderror", () => {});
    // 错误事件
    player?.on("playerror", () => {});
    player.play()
    console.log(player)
    _this.player = player;
  }
  getCurrentTime() {
    return this.player.seek();
  }
  getDurationTime() {
    return this.player._duration;
  }
  play(){
    if(this.player) this.player.play()
  }
  pause(){
    if(this.player) this.player.pause()
  }
  stop(){
    if(this.player) this.player.stop()
  }
}

export default player;
