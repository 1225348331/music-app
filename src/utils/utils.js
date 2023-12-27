import useMusicStore from "@/store/music.js";
import { playMusic } from "@/utils/play-utils";

/**
 * @description: 格式化时间 // 329 => 05:29
 * @param {*} time eg: 329
 * @return {*} eg: 05:29
 */
export const formatTime = (time) => {
  var min = parseInt(time / 60);
  var sec = parseInt(time % 60);
  min = min < 10 ? "0" + min : min;
  sec = sec < 10 ? "0" + sec : sec;
  return `${min}:${sec}`;
};

/**
 * @description: 播放上一首歌曲
 * @return {*}
 */
export const playPreIndex = () => {
  const musicStore = useMusicStore();
  // 顺序播放
  if (musicStore.player.playType == 0) {
    musicStore.player.currentMusicIndex--;
    if (musicStore.player.currentMusicIndex < 0) {
      musicStore.player.currentMusicIndex += musicStore.musicList.length;
    }
  }
  // 随机播放
  else if (musicStore.player.playType == 1) {
    musicStore.player.currentMusicIndex = parseInt(
      Math.random() * musicStore.musicList.length
    );
  }
  // 循环播放
  else {
    // 不做处理
  }
  playMusic(musicStore.musicList[musicStore.player.currentMusicIndex].id);
};

/**
 * @description: 播放下一首歌曲
 * @return {*}
 */
export const playNextIndex = () => {
  const musicStore = useMusicStore();
  // 顺序播放
  if (musicStore.player.playType == 0) {
    musicStore.player.currentMusicIndex++;
    if (musicStore.player.currentMusicIndex >= musicStore.musicList.length) {
      musicStore.player.currentMusicIndex -= musicStore.musicList.length;
    }
  }
  // 随机播放
  else if (musicStore.player.playType == 1) {
    musicStore.player.currentMusicIndex = parseInt(
      Math.random() * musicStore.musicList.length
    );
  }
  // 循环播放
  else {
    // 不做处理
  }

  playMusic(musicStore.musicList[musicStore.player.currentMusicIndex].id);
};
