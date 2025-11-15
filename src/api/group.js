import {axiosHttp} from '@/libs/request'

/**
 * 查詢列表
 * @param {*} access 
 */
export const queryList = (data) => {
    return axiosHttp('/admin/Group/queryList',data);
}

/**
 * 查詢列表
 * @param {*} access 
 */
export const queryPartnerList = (data) => {
    return axiosHttp('/admin/Users/queryPartnerList',data);
}