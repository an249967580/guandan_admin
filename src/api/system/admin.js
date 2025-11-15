import {axiosHttp} from '@/libs/request';

/**
 * 查询列表
 * @param {*} data 
 */
export const getAdminList = (data)=>{
    return axiosHttp('/admin/Auth/queryAdminList',data);
}

/**
 * 添加用户
 * @param {*} data 
 */
export const addAdmin = (data)=>{
    return axiosHttp('/admin/Auth/addAdminUser',data);
}