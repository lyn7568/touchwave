import router from './router'
import store from './store'
import NProgress from 'nprogress' // Progress 进度条
import 'nprogress/nprogress.css'// Progress 进度条样式
import { getCookiesName } from '@/utils/auth' // 验权
import queryInfo from '@/utils/queryInfo'

NProgress.configure({ showSpinner: false })// NProgress Configuration

function hasPermission(roles, permissionRoles) {
  if (roles.indexOf('1') >= 0) return true
  if (!permissionRoles) return true
  return roles.some(role => permissionRoles.indexOf(role) >= 0)
}

const whiteList = ['/login', '/findPwd'] // 不重定向白名单

router.beforeEach((to, from, next) => {
  NProgress.start()
  if (getCookiesName()) {
    if (to.path === '/login') {
      next({ path: '/' })
      NProgress.done()
    } else {
      queryInfo.queryAllInfo()
      if (store.getters.roles.length === 0) { // 判断当前用户是否已拉取完user_info信息
        // console.log(5555)
        store.dispatch('GetUserInfo').then(res => { // 拉取user_info
          if (res.success) {
            const roles = [res.data.type.toString()]
            store.dispatch('GenerateRoutes', { roles }).then(() => { // 根据roles权限生成可访问的路由表
              router.addRoutes(store.getters.addRouters) // 动态添加可访问路由表
              next({ ...to, replace: true })
            })
          }
        })
      } else {
        // console.log(4444)
        if (hasPermission(store.getters.roles, to.meta.roles)) {
          next()
        } else {
          // console.log(777)
        }
      }
    }
  } else {
    if (whiteList.indexOf(to.path) !== -1) {
      next()
    } else {
      next('/login')
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  NProgress.done() // 结束Progress
})
