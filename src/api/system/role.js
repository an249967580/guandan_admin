import {axiosHttp} from '@/libs/request';

/**
 * 查询角色列表
 * @param {*} data 
 */
export const queryRoleList = (data) => {
    return axiosHttp('/admin/Auth/getRoleList',data);
}


/**
 * 修改角色信息
 * @param {*} data 
 */
export const editRoleInfo = (data) => {
    return axiosHttp('/admin/Auth/editRole',data);
}

/**
 * 添加角色信息
 * @param {*} data 
 */
export const addRoleInfo = (data) => {
    return axiosHttp('/admin/Auth/addRole',data);
}

/**
 * 获取角色权限
 * @param {*} data 
 */
export const getMenuByRoleID = (data) => {
    return axiosHttp('/admin/Auth/getMenuByRoleID',data);
}

/**
 * 按照登录用户获得权限信息
 * @param {*} data 
 */
export const getMenuListByUserRole = (data) => {
    return axiosHttp('/admin/Auth/getMenuListToRule',data);
}

/**
 * 修改角色权限规则
 * @param {*} data 
 */
export const editRoleMenu = (data) => {
    return axiosHttp('/admin/Auth/editRoleMenu',data);
}

export const editMenu = (data) => {
    return axiosHttp('/admin/Auth/editMenu',data);
}

export const getMenuList = (data) => {
    return axiosHttp('/admin/Auth/getMenuListAll',data);
}

export const getMenuInfo = (data) => {
    return axiosHttp('/admin/Auth/getMenuInfo',data);
}

