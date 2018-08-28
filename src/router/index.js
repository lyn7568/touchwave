import Vue from 'vue'
import Router from 'vue-router'

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
    roles: ['admin','editor']     will control the page roles (you can set multiple roles)
    title: 'title'               the name show in submenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar,
    noCache: true                if true ,the page will no be cached(default is false)
  }
**/

// 所有权限通用路由表
// 如首页和登录页和一些不用权限的公用页面

export const constantRouterMap = [
  { path: '/login', component: () => import('@/views/login/index'), hidden: true },
  { path: '/findPwd', component: () => import('@/views/findPwd/index'), hidden: true },
  { path: '/404', component: () => import('@/views/404'), hidden: true },
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    hidden: true,
    children: [{
      path: 'dashboard',
      component: () => import('@/views/dashboard'),
      name: 'dashboard',
      meta: { title: '主页' }
    }]
  },
  {
    path: '',
    hidden: true,
    component: Layout,
    name: 'bridgesConsole',
    meta: {
      roles: ['0']
    },
    children: [
      {
        path: 'bridgeHome',
        name: 'bridgeHome',
        component: () => import('@/views/bridgesConsole/index'),
        redirect: '/bridgeHome/bridgeDetail',
        meta: { title: '桥梁简称' },
        children: [
          {
            path: 'bridgeDetail',
            name: 'bridgeDetail',
            component: () => import('@/views/bridgesConsole/bridgeDetail/index')
          },
          {
            path: 'danger',
            name: 'danger',
            redirect: 'dangerList',
            meta: { title: '历史报警信息查询' },
            component: () => import('@/views/bridgesConsole/bridgeDanger/index'),
            children: [
              {
                path: 'dangerList',
                name: 'dangerList',
                component: () => import('@/views/bridgesConsole/bridgeDanger/dangerList')
              },
              {
                path: 'dangerDetail',
                name: 'dangerDetail',
                component: () => import('@/views/bridgesConsole/bridgeDanger/dangerDetail'),
                meta: { title: '报警信息浏览' }
              }
            ]
          },
          {
            path: 'bridgeMonitor',
            name: 'bridgeMonitor',
            component: () => import('@/views/bridgesConsole/bridgeMonitor/index'),
            meta: {
              title: '历史监测信息查询',
              roles: ['0']
            }
          }
        ]
      }
    ]
  },

  {
    path: '',
    component: Layout,
    name: 'peoplesManage',
    meta: {
      title: '用户系统管理',
      icon: 'peoples',
      roles: ['1']
    },
    alwaysShow: true,
    children: [
      {
        path: 'infoManage',
        name: 'infoManage',
        component: () => import('@/views/peoplesManage/infoManage/index'),
        meta: { title: '用户信息管理' }
      }
    ]
  },
  {
    path: '',
    component: Layout,
    name: 'BaseInfoManage',
    meta: {
      title: '基础信息管理',
      icon: 'list',
      roles: ['1']
    },
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

// 实例化vue的时候只挂载constantRouter

export default new Router({
  // mode: 'history', //后端支持可开
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})

// 异步挂载的路由
// 动态需要根据权限加载的路由表

export const asyncRouterMap = [
]
