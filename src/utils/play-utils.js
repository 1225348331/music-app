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
  playMusic(musicStore.musicList[0].id);
}

/**
 * @description: 播放单曲
 * @param {*} id
 * @return {*}
 */
export async function playMusic(id) {
  setMusicInfo();
  await setLyric(id);
  await playSong(id);
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
  // 播放歌曲
  musicStore.audioPlayer.loadMusic(url);
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
  console.log(musicStore.currentMusicInfo.lyric);
}

/**
 * @description: 设置音乐信息
 * @return {*}
 */
export async function setMusicInfo() {
  let musicStore = useMusicStore();
  let index = musicStore.player.currentMusicIndex;
  let list = musicStore.musicList;

  musicStore.currentMusicInfo.id = list[index].id;
  musicStore.currentMusicInfo.name = list[index].name;
  musicStore.currentMusicInfo.artist = list[index].artist;
  musicStore.currentMusicInfo.pic = list[index].pic + "?param=700y700";
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
  musicStore.audioPlayer.stop();
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
}
