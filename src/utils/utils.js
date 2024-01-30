import * as CryptoJS from "crypto-js";
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
 * @description: 获取歌曲的歌手
 * @param {*} artistList 歌手列表
 * @return {*}
 */
export const getArtist = (artistList) => {
  let str = "";
  artistList.forEach((item) => {
    str += item.name + "&";
  });
  return str.slice(0, str.length - 1);
};

/**
 * @description: 获取网易云图片外链（特殊情况下，有些接口只有id，没有链接）
 * @param {*} dfsId 图片id
 * @return {*}
 */
export const getTrackURL = (dfsId) => {
  var byte1 = "3go8&$8*3*3h0k(2)2";
  var byte2 = dfsId + "";
  var byte3 = [];
  for (var i = 0; i < byte2.length; i++) {
    byte3[i] = byte2.charCodeAt(i) ^ byte1.charCodeAt(i % byte1.length);
  }
  byte3 = byte3
    .map(function (i) {
      return String.fromCharCode(i);
    })
    .join("");
  var results = CryptoJS.MD5(byte3)
    .toString(CryptoJS.enc.Base64)
    .replace(/\//g, "_")
    .replace(/\+/g, "-");
  var url = "https://p2.music.126.net/" + results + "/" + byte2;
  return url;
};
