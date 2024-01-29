import request from "@/utils/request.js";

/**
 * @description: 获取搜索建议
 * @return {*}
 */
export async function getSearchSuggset() {
  const res = await request({
    url: `/search/suggest`,
    method: "get",
  });
  return res.data;
}

/**
 * @description: 搜索歌曲
 * @param {*} keywords 关键词
 * @return {*}
 */
export async function searchSong({
  keywords,
  type = 1,
  limit = 30,
  offset = 0,
}) {
  const res = await request({
    url: `/cloudsearch`,
    method: "get",
    params: {
      keywords: keywords,
      type,
      limit,
      offset,
    },
  });
  return res.data;
}