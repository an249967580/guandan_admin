import axios from '@/libs/api.request'
import { Message } from 'iview';
import { getToken } from '@/libs/util'
import router from '@/router/index'
import store from '@/store'
import config from '@/config'
export const axiosHttp = (url,data,method='post',urlType=1)=>{
    const header = 'Access-Control-Allow-Origin'
    const params = {
        url,
        header,
        method,
    };
    // 加入token发送请求
    data.utoken = getToken();
    const { webConfig } = config
    Object.assign(data,webConfig);
    if(method == 'post'){
        params.data = data;
    }else{
        params.params = data;
    }
    let httpAxios = axios;
    return new Promise((resolve, reject)=> {
        httpAxios.request(params).then((resultData)=>{
            const resStatus = resultData.status;
            if(resStatus != '200'){
                reject();
            }
            const resData = resultData.data;
            switch(resData.code){
                case 200:
                    resolve(resData.data);
                    break;
                case 400:
                    // 错误弹出
                    alertMsg(resData.msg);
                    reject({code:resData.code,msg:resData.info});
                    break;
                case 2:
                    // 调用跳出登录
                    loginOutToLogin();
                    break;
                case 1:
                    // 无权访问
                    authError();
                    break;
                default:
            }
        }).catch(function (error) {
            reject();
        });
    })
};

function alertMsg(msg) {
    Message.error(msg);
}

function loginOutToLogin() {
    alertMsg("登陆状态已过期");
    store.dispatch("handleLogOut").then(result=>{
        router.push({
            name:'login'
        })
    })

}

function authError(){
    alertMsg("无权访问");
    router.push({
        name:'error_401'
    })
}
