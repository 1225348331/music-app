import request from "@/utils/request.js";
import { getArtist } from "@/utils/utils";
import useMusicStore from "@/store/music";

/**
 * @description: 获取每日推荐歌单
 * @return {*}
 */
export async function getRecommendResource() {
  const res = await request({
    url: `/recommend/resource`,
    method: "get",
  });
  console.log(res.data.recommend)
  return res.data.recommend;
}

/**
 * @description: 获取热门歌手
 * @return {*}
 */
export async function getTopArtists(limit = 6, offset = 0) {
  const res = await request({
    url: `/top/artists`,
    method: "get",
    params: {
      limit,
      offset,
    },
  });
  console.log(res.data.artists)
  return res.data.artists;
}

/**
 * @description: 获取最新专辑
 * @return {*}
 */
export async function getAlbumNewest() {
  const res = await request({
    url: `/album/newest`,
    method: "get",
  });
  console.log(res.data.albums)
  return res.data.albums;
}

/**
 * @description: 获取最新专辑
 * @return {*}
 */
export async function getPrivateFm() {
  const musicStore = useMusicStore();
  const res = await request({
    url: `/personal_fm`,
    method: "get",
  });
  let song = [];
  res.data.data.forEach((item) => {
    song.push({
      id: item.id,
      name: item.name,
      artist: getArtist(item.artists),
      pic: item.album.picUrl,
      album: item.album.name,
    });
  });
  musicStore.musicList = song;
  return song;
}
