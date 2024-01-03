import request from "@/utils/request.js";

/**
 * @description: 获取用户云盘数据
 * @param {*} limit - 返回数量，默认30
 * @param {*} offset - 偏移数量，默认0
 * @return {*}
 */
export async function getUserCloud(limit = 691, offset = 0) {
  const res = await request({
    url: `/user/cloud`,
    method: "get",
    params: {
      limit,
      offset,
    },
  });
  console.log(res.data)
  return res.data;
}
