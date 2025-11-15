import {
  getBreadCrumbList,
  setTagNavListInLocalstorage,
  getMenuByRouter,
  getTagNavListFromLocalstorage,
  getHomeRoute,
  getNextRoute,
  routeHasExist,
  routeEqual,
  getRouteTitleHandled,
  localSave,
  localRead,
  backendMenusToRouters,
} from '@/libs/util'
import { saveErrorLogger } from '@/api/data'
import router from '@/router'
import config from '@/config'
/////加载动态路由的请求引入一下
import { getRouterReq } from '@/api/routers'
const { homeName } = config

const closePage = (state, route) => {
  const nextRoute = getNextRoute(state.tagNavList, route)
  state.tagNavList = state.tagNavList.filter(item => {
    return !routeEqual(item, route)
  })
  router.push(nextRoute)
}

export default {
  state: {
    breadCrumbList: [],
    tagNavList: [],
    homeRoute: {},
    local: localRead('local'),
    errorList: [],
    hasReadErrorPage: false,
    routers: [],
    hasGetRouter: false,
    buttonRoleList: [],
    loginDeviceType: 1,// 1 电脑端 2 手机端
  },
  getters: {
    menuList: (state, getters, rootState) => getMenuByRouter(state.routers, rootState.user.access),
    errorCount: state => state.errorList.length
  },
  mutations: {
    setLoginDeviceType(state, type) {
      // 获取电脑端还是手机端登录
      let flag = navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i);
      if (flag) {
        state.loginDeviceType = 2;
      } else {
        state.loginDeviceType = 1;
      }
    },
    //设置路由数据
    setRouters(state, routers) {
      state.routers = routers
    },
    //设置是否已经拿过路由
    setHasGetRouter(state, status) {
      state.hasGetRouter = status
    },
    //设置按钮权限
    setButtonRoleList(state, data) {
      state.buttonRoleList = data
    },
    setBreadCrumb(state, route) {
      state.breadCrumbList = getBreadCrumbList(route, state.homeRoute)
    },
    setHomeRoute(state, routes) {
      state.homeRoute = getHomeRoute(routes, homeName)
    },
    setTagNavList(state, list) {
      let tagList = []
      if (list) {
        tagList = [...list]
      } else tagList = getTagNavListFromLocalstorage() || []
      if (tagList[0] && tagList[0].name !== homeName) tagList.shift()
      let homeTagIndex = tagList.findIndex(item => item.name === homeName)
      if (homeTagIndex > 0) {
        let homeTag = tagList.splice(homeTagIndex, 1)[0]
        tagList.unshift(homeTag)
      }
      state.tagNavList = tagList
      setTagNavListInLocalstorage([...tagList])
    },
    closeTag(state, route) {
      let tag = state.tagNavList.filter(item => routeEqual(item, route))
      route = tag[0] ? tag[0] : null
      if (!route) return
      closePage(state, route)
    },
    addTag(state, { route, type = 'unshift' }) {
      let router = getRouteTitleHandled(route)
      if (!routeHasExist(state.tagNavList, router)) {
        if (type === 'push') state.tagNavList.push(router)
        else {
          if (router.name === homeName) state.tagNavList.unshift(router)
          else state.tagNavList.splice(1, 0, router)
        }
        setTagNavListInLocalstorage([...state.tagNavList])
      }
    },
    setLocal(state, lang) {
      localSave('local', lang)
      state.local = lang
    },
    addError(state, error) {
      state.errorList.push(error)
    },
    setHasReadErrorLoggerStatus(state, status = true) {
      state.hasReadErrorPage = status
    }
  },
  actions: {
    /**
     * 获取系统路由
     * @param commit
     * @returns {Promise<unknown>}
     */
    getRouters({ commit }) {
      return new Promise((resolve, reject) => {
        try {
          getRouterReq().then(res => {
            let tree = res.tree;
            let button = res.button;
            commit('setButtonRoleList', button);
            let routers = backendMenusToRouters(tree);
            const fixedRoutes = [
              {
                path: '/score',
                name: 'score',
                meta: {
                  icon: 'md-list-box',
                  title: '积分流水',
                  white: true // ✅ 表示此菜单不需权限验证
                },
                component: () => import('@/components/main'),
                children: [
                  {
                    path: 'logs',
                    name: 'score_logs',
                    meta: {
                      icon: 'ios-paper',
                      title: '积分流水列表',
                      white: true // ✅ 同样加入白名单
                    },
                    component: () => import('@/view/score/score-logs.vue')
                  }
                ]
              }
            ];
            const routerPush = [
              // {
              //   path: 'logs',
              //   name: 'score_logs',
              //   meta: {
              //     icon: 'ios-paper',
              //     title: '积分流水列表'
              //   },
              //   component: () => import('@/view/score/score-logs.vue')
              // },
              {
                path: '/401',
                name: 'error_401',
                meta: {
                  hideInMenu: true
                },
                component: () => import('@/view/error-page/401.vue')
              },
              {
                path: '/500',
                name: 'error_500',
                meta: {
                  hideInMenu: true
                },
                component: () => import('@/view/error-page/500.vue')
              },
              {
                path: '*',
                name: 'error_404',
                meta: {
                  hideInMenu: true
                },
                component: () => import('@/view/error-page/404.vue')
              }
            ];
            routers.push(...routerPush);
            commit('setRouters', routers);
            commit('setHasGetRouter', true);
            commit('setLoginDeviceType', '');

            let firstRule = localRead('firstRule');
            if (firstRule) {
              localSave("saveRouter", JSON.stringify({
                name: firstRule
              }))
              localSave("firstRule", '')
            }


            resolve(routers)
          }).catch(err => {
            reject(err)
          })
        } catch (error) {
          reject(error)
        }
      })
    },
    addErrorLog({ commit, rootState }, info) {
      if (!window.location.href.includes('error_logger_page')) commit('setHasReadErrorLoggerStatus', false)
      const { user: { token, userId, userName } } = rootState
      let data = {
        ...info,
        time: Date.parse(new Date()),
        token,
        userId,
        userName
      }
      saveErrorLogger(info).then(() => {
        commit('addError', data)
      })
    },
    // 初始化登录信息
    resetLoginTabNav({ commit }) {
      // 初始化导航面包屑
      commit('setTagNavList', [{
        name: "home",
        meta: { hideInMenu: true, title: "首页", notCache: true, icon: "md-home" }
      }]);
      // 初始化当前页
      localSave("saveRouter", null);
    }
  }
}
