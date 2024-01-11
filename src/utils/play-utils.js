import { getMusicList, getSongUrl, getLyric, lyricParser } from "@/api/cover";
import useMusicStore from "@/store/music";
/**
 * @description: 播放歌单
 * @param {*} id 歌单id
 * @return {*}
 */
export async function playMusicList(id) {
    // 重置播放器信息
  resetPlayInfo();
  let musicStore = useMusicStore();
  // 获取歌单列表
  musicStore.musicList = await getMusicList(id);
  // 设置歌曲索引
  musicStore.player.currentMusicIndex = 0;
  // 播放音乐列表第一首
  playMusic(musicStore.musicList[0]);
}

/**
 * @description: 播放单曲
 * @param {*} song {id,name,artist,pic}
 * @return {*}
 */
export async function playMusic(song) {
  // 重置播放器信息
  resetPlayInfo();
  // 设置音乐基础信息
  setMusicInfo(song);
  // 设置歌词
  await setLyric(song.id);
  // 播放歌曲
  await playSong(song.id);
}

/**
 * @description: 设置歌曲
 * @param {*} id 歌曲id
 * @return {*}
 */
export async function playSong(id) {
  let musicStore = useMusicStore();
  // 获取歌曲链接
  let url = await getSongUrl(id);
  // 加载歌曲
  musicStore.audioPlayer.loadMusic(url);
  // 播放歌曲
  musicStore.audioPlayer.play();
}

/**
 * @description: 设置歌词
 * @param {*} id 歌曲id
 * @return {*}
 */
export async function setLyric(id) {
  let musicStore = useMusicStore();
  // 获取歌词
  let lyrString = await getLyric(id);
  // 解析设置歌词
  musicStore.currentMusicInfo.lyric = lyricParser(lyrString);
}

/**
 * @description: 设置音乐基础信息
 * @return {*}
 */
export async function setMusicInfo(song) {
  let musicStore = useMusicStore();
  musicStore.currentMusicInfo.id = song.id;
  musicStore.currentMusicInfo.name = song.name;
  musicStore.currentMusicInfo.artist = song.artist;
  musicStore.currentMusicInfo.pic = song.pic;
  
}

/**
 * @description: 根据当前时间，获取歌词索引
 * @param {*} x 当前时间
 * @return {*}
 */
export function getCurrentLyricIndex(x) {
  let musicStore = useMusicStore();
  let arr = musicStore.currentMusicInfo.lyric;
  let left = 0;
  let right = arr.length - 1;

  while (left <= right) {
    const mid = Math.floor((left + right) / 2);

    if (arr[mid].t === x) {
      return mid;
    } else if (arr[mid].t < x) {
      left = mid + 1;
    } else {
      right = mid - 1;
    }
  }

  return left - 1 >= 0 ? left - 1 : 0;
}

/**
 * @description: 重置播放信息
 * @return {*}
 */
function resetPlayInfo() {
  let musicStore = useMusicStore();
  // 播放器停止
  musicStore.audioPlayer.unload();
  // 进度条归0
  musicStore.progress.value = 0;
  // 歌曲名重置
  musicStore.currentMusicInfo.name = "正在获取中...";
  // 歌手名重置
  musicStore.currentMusicInfo.artist = "正在获取中...";
  // 歌曲封面重置
  musicStore.currentMusicInfo.pic = "/src/assets/loading.gif";
  // 歌词重置
  musicStore.currentMusicInfo.lyric.length = 0;
  // 歌词索引重置
  musicStore.lyric.currentLyricIndex = 0;
}

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
  playMusic(musicStore.musicList[musicStore.player.currentMusicIndex]);
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

  playMusic(musicStore.musicList[musicStore.player.currentMusicIndex]);
};
