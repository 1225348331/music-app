import request from "@/utils/request.js";

/**
 * @description: 获取用户云盘数据
 * @param {*} limit - 返回数量，默认30
 * @param {*} offset - 偏移数量，默认0
 * @return {*}
 */
export async function getUserCloud(limit = 30, page = 0) {
  const res = await request({
    url: `/user/cloud`,
    method: "get",
    params: {
      limit,
      offset: page * limit,
    },
  });
  return res.data;
}

/**
 * @description: 获取云盘数据详情
 * @param {*} id 云盘歌曲id
 * @return {*}
 */
export async function getCloudDetail(id) {
  const res = await request({
    url: `/user/cloud/detail`,
    method: "get",
    params: {
      id: id,
    },
  });
  console.log(res.data);
  return res.data;
}
