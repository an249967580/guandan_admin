
import {axiosHttp} from '@/libs/request'

// /**
//  * 查詢列表
//  * @param {*} access 
//  */
// export const queryList = (data) => {
//     return axiosHttp('/admin/notice/queryList',data);
// }
// export const delNotice = (data) => {
//     return axiosHttp('/admin/notice/delNotice',data);
// }
// export const editNotice = (data) => {
//     return axiosHttp('/admin/notice/editNotice',data);
// }

// export const getContent = (data) => {
//     return axiosHttp('/admin/notice/getContent',data);
// }



// export const queryXieYiList = (data) => {
//     return axiosHttp('/admin/notice/queryXieYiList',data);
// }

// export const editXieYi = (data) => {
//     return axiosHttp('/admin/notice/editXieYi',data);
// }

// export const queryBList = (data) => {
//     return axiosHttp('/admin/notice/queryBList',data);
// }

// export const editBInfo = (data) => {
//     return axiosHttp('/admin/notice/editBInfo',data);
// }

/**
 * 公告列表查询
 * GET /admin/notice/queryList
 * @param {Object} data { page, limit }
 */
export const queryList = (data) => {
  return axiosHttp('/admin/Users/queryNotices', data)
}

/**
 * 添加或编辑公告
 * POST /admin/notice/editNotice
 * @param {Object} data { id?, title, content }
 */
export const editNotice = (data) => {
  return axiosHttp('/admin/Users/addNotice', data)
}

/**
 * 删除公告
 * POST /admin/notice/delNotice
 * @param {Object} data { id }
 */
export const delNotice = (data) => {
  return axiosHttp('/admin/Users/deleteNotice', data)
}

/**
 * 获取公告详情（如果有用到）
 * GET /admin/notice/getContent
 * @param {Object} data { id }
 */
export const getContent = (data) => {
  return axiosHttp('/admin/notice/getContent', data)
}



