import axios from '@/libs/api.request'
import {axiosHttp} from '@/libs/request'
/**
 * 查询菜单
 * @param {*} access 
 */
export const getRouterReq = (access) => {
  return axiosHttp('/admin/Auth/getMenuList',{});
}