import request from "@/utils/request.js";
import useMusicStore from "@/store/music.js";
import { getArtist, getTrackURL } from "@/utils/utils";

/**
 * @description: 获取歌单
 * @param {*} id 歌单id
 * @return {*}
 */
export async function getMusicList(id, limit = 100, offset = 0) {
  const res = await request({
    url: `/playlist/track/all`,
    method: "get",
    params: {
      id,
      // limit,
      // offset,
    },
  });

  let list = [];
  res.data.songs.forEach((item) => {
    list.push({
      id: item.id,
      name: item.name,
      artist: getArtist(item.ar),
      pic: item.al.picUrl,
      album: item.al.name,
    });
  });
  return list;
}

/**
 * @description: 获取歌曲链接
 * @return {*}
 */
export async function getSongUrl(id) {
  const res = await request({
    url: `/song/url?id=${id}`,
    method: "get",
  });
  let url = res.data.data[0].url;
  if (!url?.includes("https")) url = url?.split("http").join("https");
  return url;
}

/**
 * @description: 获取歌曲歌词
 * @param {*} id 歌曲id
 * @return {*}
 */
export async function getLyric(id) {
  const res = await request({
    url: `/lyric?id=${id}`,
    method: "get",
  });
  return res.data?.lrc?.lyric;
}

/**
 * @description: 歌词解析
 * @param {*} lrcGet 歌词str
 * @return {*}
 */
export function lyricParser(lrcGet) {
  if (!lrcGet) {
    return [
      {
        t: 0,
        c: "暂未搜索到歌词",
      },
    ];
  }

  var lrcArray = []; //新建数组,用于存放歌词
  var lrc = lrcGet.split("\n"); //
  lrc.forEach((item) => {
    //过滤空白文本
    if (item.split("]")[1] == "" || item == "") {
      return true;
    }
    //转化时间
    var timeStr = item.substring(item.indexOf("[") + 1, item.indexOf("]"));
    var min = parseInt(timeStr.split(":")[0]) * 60;
    var sec = parseFloat(timeStr.split(":")[1]);
    var time = parseFloat((min + sec).toFixed(3));
    //添加进数组
    lrcArray.push({
      t: time,
      c: item.substring(item.indexOf("]") + 1),
    });
  });
  return lrcArray;
}

/**
 * @description: 获取我最喜欢的歌曲列表
 * @return {*}
 */
export async function getLikest() {
  let res = await getMusicList(482916379);
  return res;
}

/**
 * @description: 获取每日推荐歌曲
 * @return {*}
 */
export async function getRecommendSongs() {
  const res = await request({
    url: `/recommend/songs`,
    method: "get",
  });
  let data = res.data.data.dailySongs;
  let dailySongs = [];
  data.forEach((item) => {
    dailySongs.push({
      id: item.id,
      name: item.name,
      pic: item.al.picUrl,
      artist: getArtist(item.ar),
    });
  });

  return dailySongs;
}

/**
 * @description: 获取歌手全部歌曲
 * @param {*} id 歌手id
 * @return {*}
 */
export async function getArtistSongs(id, limit, offset) {
  const res = await request({
    url: `/artist/songs`,
    method: "get",
    params: { id, limit, offset },
  });
  let songs = {
    total: res.data.total,
    list: [],
  };
  res.data.songs.forEach((item) => {
    songs.list.push({
      id: item.id,
      name: item.name,
      artist: getArtist(item.ar),
      pic: getTrackURL(item.al.pic_str),
      album: item.al.name,
    });
  });
  return songs;
}

/**
 * @description: 获取专辑内容
 * @param {*} id 专辑id
 * @return {*}
 */
export async function getAlbumDetail(id) {
  const res = await request({
    url: `/album`,
    method: "get",
    params: { id },
  });
  return res.data;
}

/**
 * @description: 获取歌单描述
 * @param {*} id 歌单id
 * @return {*}
 */
export async function getPlaylistDescription(id) {
  const res = await request({
    url: `/playlist/detail`,
    method: "get",
    params: { id },
  });
  return res.data.playlist;
}

/**
 * @description: 获取歌手详情
 * @param {*} id 歌手id
 * @return {*}
 */
export async function getArtistDetail(id) {
  const res = await request({
    url: `/artist/detail`,
    method: "get",
    params: { id },
  });
  return res.data.data;
}
