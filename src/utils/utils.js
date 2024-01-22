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
