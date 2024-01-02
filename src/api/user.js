import request from "@/utils/request.js";

/**
 * @description: 获取用户详情
 * @return {*}
 */
export async function getUserAccount() {
  const res = await request({
    url: `/user/account`,
    method: "get",
  });
  return res.data;
}

/**
 * @description: 获取用户歌单列表
 * @param {*} uid
 * @param {*} limit
 * @param {*} offset
 * @return {*}
 */
export async function getUserPlaylist(uid, limit = 30, offset = 0) {
  const res = await request({
    url: `/user/playlist`,
    method: "get",
    params: {
      uid,
      limit,
      offset,
    },
  });
  return res.data;
}

/**
 * @description: 获取用户信息 , 歌单，收藏，mv, dj 数量
 * @return {*}
 */
export async function getUserSubcount() {
  const res = await request({
    url: `/user/subcount`,
    method: "get",
  });
  console.log(res.data);
  return res.data;
}

/**
 * @description: 获取用户云盘数据
 * @param {*} limit - 返回数量，默认30
 * @param {*} offset - 偏移数量，默认0
 * @return {*}
 */
export async function getUserCloud(limit = 30, offset = 0) {
  const res = await request({
    url: `/user/cloud`,
    method: "get",
    params: {
      limit,
      offset,
    },
  });
  return res.data;
}
