
import {axiosHttp} from '@/libs/request'

/**
 * 查詢列表
 * @param {*} access 
 */
export const queryOutList = (data) => {
    return axiosHttp('/admin/Match/queryOutList',data);
}
export const queryScoreList = (data) => {
    return axiosHttp('/admin/Match/queryScoreList',data);
}

export const editMatch = (data) => {
    return axiosHttp('/admin/Match/editMatch',data);
}

export const delMatch = (data) => {
    return axiosHttp('/admin/Match/delMatch',data);
}

export const editMatchScore = (data) => {
    return axiosHttp('/admin/Match/editMatchScore',data);
}

export const queryGameUserList = (data) => {
    return axiosHttp('/admin/Match/queryGameUserList',data);
}

export const upUserList = (data) => {
    return axiosHttp('/admin/Match/upUserList',data);
}

export const scoreGroupList = (data) => {
    return axiosHttp('/admin/Match/scoreGroupList',data);
}

export const scoreUserList = (data) => {
    return axiosHttp('/admin/Match/scoreUserList',data);
}

export const queryMassList = (data) => {
    return axiosHttp('/admin/Match/queryMassList',data);
}

export const editMatchMass= (data) => {
    return axiosHttp('/admin/Match/editMatchMass',data);
}

export const queryMassGroup= (data) => {
    return axiosHttp('/admin/Match/queryMassGroup',data);
}

export const addMassGroup= (data) => {
    return axiosHttp('/admin/Match/addMassGroup',data);
}

export const delMassGroup= (data) => {
    return axiosHttp('/admin/Match/delMassGroup',data);
}

export const upUserMassList= (data) => {
    return axiosHttp('/admin/Match/upUserMassList',data);
}
