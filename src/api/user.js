import axios from '@/libs/api.request';
import {axiosHttp} from '@/libs/request'

/**
 * 登录
 * @param {*} param0 
 */
export const login = (params) => {
  params.mobile = params.userName;
  return axiosHttp('/admin/Login/login',params);
}

/**
 * 获取code
 * @param {*} token 
 */
export const getCode = (data) => {
  return axiosHttp('/gateway/StoreAdminLoginApi/getLoginCode',data);
}


/**
 * 获取登录人信息
 * @param {*} token 
 */
export const getUserInfo = (token) => {
  return axiosHttp('/admin/Auth/getUserInfo',{});

}

/**
 * 上传图片
 * @param {*} token 
 */
 export const uploadImgBase64 = (data) => {
  return axiosHttp('/admin_shop_api/User/uploadImgBase64',data);
}

/**
 * 退出登录
 * @param {*} token 
 */
export const logout = (token) => {
  return axiosHttp('/admin/Login/loginOut',{});
}

export const getUnreadCount = () => {
  // return axios.request({
  //   url: 'message/count',
  //   method: 'get'
  // })
}

export const getMessage = () => {
  return axios.request({
    url: 'message/init',
    method: 'get'
  })
}

export const getContentByMsgId = msg_id => {
  return axios.request({
    url: 'message/content',
    method: 'get',
    params: {
      msg_id
    }
  })
}

export const hasRead = msg_id => {
  return axios.request({
    url: 'message/has_read',
    method: 'post',
    data: {
      msg_id
    }
  })
}

export const removeReaded = msg_id => {
  return axios.request({
    url: 'message/remove_readed',
    method: 'post',
    data: {
      msg_id
    }
  })
}

export const restoreTrash = msg_id => {
  return axios.request({
    url: 'message/restore',
    method: 'post',
    data: {
      msg_id
    }
  })
}




