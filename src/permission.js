import router from './router'
import store from './store'
import { Message } from 'element-ui'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import { getToken } from '@/utils/auth' // get token from cookie
import getPageTitle from '@/utils/get-page-title'

NProgress.configure({ showSpinner: false }) // NProgress Configuration

const whiteList = ['/login'] // no redirect whitelist  白名单

router.beforeEach(async(to, from, next) => {
  // start progress bar
  NProgress.start()
  const user = store.getters['user/getUser'] // 获取用户信息
  // set page title
  document.title = getPageTitle(to.meta.title)
  if (to.meta.auth) {
    // 说明要鉴权
    if (user) {
      // 说明已经登录过了
      next()
    } else {
      // 说明没有用户信息
      // 判断是否有token
      const hasToken = localStorage.getItem('adminToken')
      if (hasToken) {
        // 有token 还需要验证token的有效性
        try {
          // 根据token 判断该用户是否有效
          await store.dispatch('user/getInfo')
          next()
        } catch (err) {
          await store.dispatch('user/resetToken') // 移除token
          Message.error(err)
          next({
            name: 'login',
            query: {
              redirect: to.path
            }
          })
          NProgress.done()
        }
      } else {
        // 没有token 直接跳转到登录页
        next({
          name: 'login',
          query: {
            redirect: to.path
          }
        })
        NProgress.done()
      }
    }
  } else {
    // 不需要鉴权
    if (to.path === '/login') {
      // 说明是去login
      if (user) {
        // 说明有用户信息 直接跳转到首页
        console.log(1111);
        next('/')
      } else {
        next()
      }
    } else {
      // 说明不是去login 放行
      next()
    }
    NProgress.done()
  }
  

  // 下方是vue-element-admin默认的鉴权流程
  // const hasToken = getToken()

  // if (hasToken) {
  //   // 说明有token
  //   if (to.path === '/login') {
  //     // 如果访问的login 直接放行至首页
  //     next({ path: '/' })
  //     NProgress.done()
  //   } else {
  //     // 看一下是否有用户信息
  //     const hasGetUserInfo = store.getters.name
  //     if (hasGetUserInfo) {
  //       // 如果有 则放行
  //       next()
  //     } else {
  //       try {
  //         // 如果没有用户信息 但是有token 则根据这个token去服务器获取用户信息
  //         await store.dispatch('user/getInfo')
  //         next()
  //       } catch (error) {
  //         // remove token and go to login page to re-login
  //         await store.dispatch('user/resetToken') // 删除token
  //         Message.error(error || 'Has Error')
  //         next(`/login?redirect=${to.path}`)
  //         NProgress.done()
  //       }
  //     }
  //   }
  // } else {
  //   /* has no token*/

  //   if (whiteList.indexOf(to.path) !== -1) { // 判断白名单是否有要去的路径 如果有放行
  //     // in the free login whitelist, go directly
  //     next()
  //   } else {
  //     // other pages that do not have permission to access are redirected to the login page.
  //     next(`/login?redirect=${to.path}`)
  //     NProgress.done()
  //   }
  // }
})

router.afterEach(() => {
  // finish progress bar
  NProgress.done()
})
