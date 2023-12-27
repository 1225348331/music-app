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


