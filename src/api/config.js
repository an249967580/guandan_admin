import {axiosHttp} from '@/libs/request'
/**
 * 查詢列表
 * @param {*} access 
 */
export const queryConfigList = (data) => {
  return axiosHttp('/admin/Config/queryConfigList',data);
}
/** 
* 修改信息
* @param {*} access 
*/
export const editConfig = (data) => {
 return axiosHttp('/admin/Config/editConfig',data);
}


/** 
* 修改信息
* @param {*} access 
*/
export const getVideoUrl = (data) => {
  return axiosHttp('/admin/Config/getVideoUrl',data);
 }


 /** 
* 修改信息
* @param {*} access 
*/
export const editUrl = (data) => {
  return axiosHttp('/admin/Config/editUrl',data);
 }


 