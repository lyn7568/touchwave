import Vue from 'vue'
import Router from 'vue-router'

// in development-env not use lazy-loading, because lazy-loading too many pages will cause webpack hot update too slow. so only in production use lazy-loading;
// detail: https://panjiachen.github.io/vue-element-admin-site/#/lazy-loading

Vue.use(Router)

/* Layout */
import Layout from '../views/layout/Layout'

/**
* hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
* alwaysShow: true               if set true, will always show the root menu, whatever its child routes length
*                                if not set alwaysShow, only more than one route under the children
*                                it will becomes nested mode, otherwise not show the root menu
* redirect: noredirect           if `redirect:noredirect` will no redirct in the breadcrumb
* name:'router-name'             the name is used by <keep-alive> (must set!!!)
* meta : {
    title: 'title'               the name show in submenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar,
  }
**/
export const constantRouterMap = [
  { path: '/login', component: () => import('@/views/login/index'), hidden: true },
  { path: '/findPwd', component: () => import('@/views/findPwd/index'), hidden: true },
  { path: '/404', component: () => import('@/views/404'), hidden: true },

  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    name: 'Dashboard',
    hidden: true,
    children: [{
      path: 'dashboard',
      component: () => import('@/views/dashboard/index')
    }]
  },

  {
    path: '/peoplesManage',
    component: Layout,
    redirect: '/peoplesManage/infoManage',
    name: 'peoplesManage',
    meta: { title: '用户系统管理', icon: 'peoples' },
    children: [
      {
        path: 'infoManage',
        name: 'infoManage',
        component: () => import('@/views/peoplesManage/infoManage/index'),
        meta: { title: '用户信息管理', icon: 'peoples' }
      }
    ]
  },
  {
    path: '/baseInfoManage',
    component: Layout,
    redirect: '/baseInfoManage/bridgesInfo',
    name: 'BaseInfoManage',
    meta: { title: '基础信息管理', icon: 'list' },
    children: [
      {
        path: 'bridgesInfo',
        name: 'BridgesInfo',
        component: () => import('@/views/baseInfoManage/bridgesInfo/index'),
        meta: { title: '桥梁信息管理' }
      },
      {
        path: 'serversConfig',
        name: 'ServersConfig',
        component: () => import('@/views/baseInfoManage/serversConfig/index'),
        meta: { title: '采集服务器配置' }
      },
      {
        path: 'boxesConfig',
        name: 'BoxesConfig',
        component: () => import('@/views/baseInfoManage/boxesConfig/index'),
        meta: { title: '采集盒配置' }
      },
      {
        path: 'sensorsConfig',
        name: 'SensorsConfig',
        component: () => import('@/views/baseInfoManage/sensorsConfig/index'),
        meta: { title: '传感器配置' }
      }
    ]
  },

  { path: '*', redirect: '/404', hidden: true }
]

export default new Router({
  // mode: 'history', //后端支持可开
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})

