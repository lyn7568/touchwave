import router from './router'
import store from './store'
import NProgress from 'nprogress' // Progress 进度条
import 'nprogress/nprogress.css'// Progress 进度条样式
import { Message } from 'element-ui'
import { getCookiesName } from '@/utils/auth' // 验权

NProgress.configure({ showSpinner: false })// NProgress Configuration

function hasPermission(roles, permissionRoles) {
  if (roles.indexOf('1') >= 0) return true // admin permission passed directly
  if (!permissionRoles) return true
  return roles.some(role => permissionRoles.indexOf(role) >= 0)
}

const whiteList = ['/login', '/findPwd'] // 不重定向白名单
router.beforeEach((to, from, next) => {
  NProgress.start()
  setTimeout(() => {
    if (getCookiesName()) {
      if (to.path === '/login') {
        console.log(3333)
        next({ path: '/' })
        NProgress.done()
      } else {
        if (store.getters.roles.length === 0) { // 判断当前用户是否已拉取完user_info信息
          store.dispatch('GetUserInfo').then(res => { // 拉取user_info
            const roles = [res.data.type.toString()]
            store.dispatch('GenerateRoutes', { roles }).then(() => { // 根据roles权限生成可访问的路由表
              router.addRoutes(store.getters.addRouters) // 动态添加可访问路由表
              next({ ...to, replace: true }) // hack方法 确保addRoutes已完成
            })
          }).catch((err) => {
            store.dispatch('FedLogOut').then(() => {
              Message.error(err || '登录状态失效，请重新登录')
              next({ path: '/' })
            })
          })
        } else {
          if (hasPermission(store.getters.roles, to.meta.roles)) {
            next()//
          } else {
            next({ path: '/401', replace: true, query: { noGoBack: true }})
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
  }, 1000)
})

router.afterEach(() => {
  NProgress.done() // 结束Progress
})
