import router from './router'
import store from './store'
import NProgress from 'nprogress' // Progress 进度条
import 'nprogress/nprogress.css'// Progress 进度条样式
import { Message } from 'element-ui'
import { getSession, getIfLoginUser } from '@/utils/auth' // 验权

NProgress.configure({ showSpinner: false })// NProgress Configuration

const whiteList = ['/login', '/findPwd'] // 不重定向白名单
getIfLoginUser()
router.beforeEach((to, from, next) => {
  NProgress.start()
  setTimeout(() => {
    console.log(getSession())
    console.log(store.getters.logins)
    if (store.getters.logins) {
      if (to.path === '/login') {
        next({ path: '/' })
        NProgress.done()
        console.log(1111)
      } else {
        if (store.getters.roles.indexOf('1') >= 0) {
          console.log(2222)
          store.dispatch('GetUserInfo').then(res => { // 拉取用户信息
            const dataS = res.data
            const roles = [dataS.type.toString()]
            store.dispatch('GenerateRoutes', { roles }).then(() => { // 根据roles权限生成可访问的路由表
              router.addRoutes(store.getters.addRouters) // 动态添加可访问路由表
              next({ ...to, replace: true })
            })
          }).catch(() => {
            store.dispatch('FedLogOut').then(() => {
              Message.error('登录状态超时，请重新登录')
              next({ path: '/' })
            })
          })
        } else {
          console.log(33333)
          next()
        }
      }
    } else {
      if (whiteList.indexOf(to.path) !== -1) {
        console.log(444444)
        next()
      } else {
        console.log(55555)
        next('/login')
        NProgress.done()
      }
    }
  }, 1000)
})

router.afterEach(() => {
  NProgress.done() // 结束Progress
})
