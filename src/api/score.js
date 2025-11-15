import { axiosHttp } from '@/libs/request'

/**
 * 用户积分流水列表
 * GET /admin/Users/queryNotices
 * @param {Object} data { user_id?, page?, limit? }
 */
export const queryScoreList = (data) => {
  return axiosHttp('/admin/Users/queryUserScoreLog', data)
}
