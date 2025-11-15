import { axiosHttp } from '@/libs/request'
/**
 * 查詢列表
 * @param {*} access 
 */
export const queryList = (data) => {
  return axiosHttp('/admin/Users/queryUserList', data);
}

/**
 * 设置合伙人
 */
export function setRole(data) {
  return axiosHttp('/admin/Users/setRole', data);
}

export function setBan(data) {
  return axiosHttp('/admin/Users/setBan', data);
}

export function batchSetBan(data) {
  return axiosHttp('/admin/Users/batchSetBan', data);
}

export function batchDeleteUsers(data) {
  return axiosHttp('/admin/Users/batchDeleteUsers', data);
}




