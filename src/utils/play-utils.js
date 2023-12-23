import { getMusicList, getSongUrl, getLyric, lyricParser } from "@/api/cover";
import useMusicStore from "@/store/music";
/**
 * @description: 播放歌单
 * @param {*} id 歌单id
 * @return {*}
 */
export async function playMusicList(id) {
  let musicStore = useMusicStore();

  // 获取歌单列表
  let list = await getMusicList(id);
  console.log(list);
  // 设置歌单列表
  musicStore.musicList = list;
  // 设置当前歌曲信息
  musicStore.player.currentMusicIndex = 0;
  musicStore.currentMusicInfo.id = list[0].id;
  musicStore.currentMusicInfo.name = list[0].name;
  musicStore.currentMusicInfo.artist = list[0].artist;
  musicStore.currentMusicInfo.pic = list[0].pic + "?param=700y700";
  await setLyric(list[0].id);
  await playSong(list[0].id);
}

/**
 * @description: 播放歌曲
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