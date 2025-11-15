import Vue from 'vue'
import Router from 'vue-router'
import routes from './routers'
import store from '@/store'
import iView from 'iview'
import { setToken, getToken, canTurnTo, setTitle ,localRead} from '@/libs/util'
import config from '@/config'
import { setTokenKey } from '../libs/util'
const { homeName } = config

Vue.use(Router)
const router = new Router({
  routes,
  mode: 'history'
})
const LOGIN_PAGE_NAME = 'login'

const initRouters = (store,next) => {

  //这个人登录了已经
  if (store.state.user.hasGetInfo) {
    //路由加载过了
    if (store.state.app.hasGetRouter && store.state.app.routers && store.state.app.routers.length > 0) {
    } else {
      //加载路由
      // console.log("开始加载路由权限...")
      store.dispatch('getRouters').then(routers => {
        //此处routers已经是按照权限过滤后的路由了，没权限的，不加入路由，无法访问
        //路由重置一下把404放最后
        const newRouter = new Router({
          routes,
          mode: config.routerModel
        })
        router.matcher = newRouter.matcher;
        //把404加最后面，如果用router.push({name:'xxxx'})这种的话，404页面可能空白，用path:'/aa/bb'
        router.addRoutes(routers.concat([{
          path: '*',
          name: 'error_404',
          meta: {
            hideInMenu: true
          },
          component: () => import(/* webpackChunkName: "404" */'@/view/error-page/404.vue')
        }]))
        fromTo(next);
      }).finally(() => {

      })
      next()
      // return false;
    }
  }
}

const fromTo = (next) => {
  let saveRouter = localRead("saveRouter");
  if(saveRouter == 'null'){
    next();
    return ;
  }
  let route = JSON.parse(saveRouter);
  let { name, params, query } = {}
  if (typeof route === 'string') name = route
  else {
    name = route.name ?  route.name : 'home'
    params = route.params ? route.params : {}
    query = route.query ? route.query : {}
  }
  if(route){
    next({
      name,
      params,
      query
    });
  }else{
    next();
  }

}

const turnTo = (to, access, next) => {
  if (canTurnTo(to.name, access, routes)) next() // 有权限，可访问
  else next({ replace: true, name: 'error_401' }) // 无权限，重定向到401页面
}
const NoRule = [LOGIN_PAGE_NAME,'addWorker',"submitAudit","loginCode"];

router.beforeEach((to, from, next) => {
  iView.LoadingBar.start()
  const token = getToken()


  if (!token && !NoRule.includes(to.name)) {
    // 未登录且要跳转的页面不是登录页
    next({
      name: LOGIN_PAGE_NAME // 跳转到登录页
    })
  } else if (!token && NoRule.includes(to.name)) {
    // 未登陆且要跳转的页面是登录页
    next() // 跳转
  } else if (token && to.name === LOGIN_PAGE_NAME) {
    // 已登录且要跳转的页面是登录页
    next({
      name: homeName // 跳转到homeName页
    })
  } else if (token && to.name == "loginCode") {
    console.log("跳转到登录了");
    // 未登陆且要跳转的页面是登录页
    next() // 跳转
  } else {
    if(to.name == null){
      next({name:'/'})
    }else if (store.state.user.hasGetInfo) {

      if (store.state.app.hasGetRouter && store.state.app.routers && store.state.app.routers.length > 0) {
        // 验证权限
        turnTo(to, store.state.app.routers, next)
      }else{
        initRouters(store,next);
      }
    } else {
      store.dispatch('getUserInfo').then(user => {
        // 拉取用户信息，通过用户权限和跳转的页面的name来判断是否有权限访问;access必须是一个数组，如：['super_admin'] ['super_admin', 'admin']
        // turnTo(to, user.access, next)
        initRouters(store,next);
      }).catch(() => {
        setToken('')
        next({
          name: 'login'
        })
      })
    }
  }
})

router.afterEach(to => {
  setTitle(to, router.app)
  iView.LoadingBar.finish()
  window.scrollTo(0, 0)
})

export default router
