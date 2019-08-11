import { asyncRoutes, constantRoutes } from '@/router'
import request from '@/utils/request'
import { isURL } from '@/utils/validate'/* Layout */
import Layout from '@/layout'

const _import = require('@/router/import-' + process.env.NODE_ENV)
// 主入口路由(需嵌套上左右整体布局)
var dynamicMenuRoutesParent = {
  path: '/sys',
  component: Layout,
  name: '系统管理',
  children: []
}
// 主入口路由(需嵌套上左右整体布局)
var dynamicMenuRoutes = {
  // path: '/sys',
  // component: Layout,
  // name: '系统管理',
  // meta: { title: '动态路由' },
  // children: []
}
/**
 * Use meta.role to determine if the current user has permission
 * @param roles
 * @param route
 */
function hasPermission(roles, route) {
  if (route.meta && route.meta.roles) {
    return roles.some(role => route.meta.roles.includes(role))
  } else {
    return true
  }
}

// 建立动态菜单入口 处理根
function fnAddDynamicMenuRoutes(menuList = []) {
  var routerArr = []
  var newRouter = {}
  for (var i = 0; i < menuList.length; i++) {
    if (menuList[i].name) {
      newRouter = {
        path: !menuList[i].url ? '/menu' + i : menuList[i].url,
        component: _import('publicmenu/index') || null,
        name: menuList[i].name,
        meta: {             
          menuId: menuList[i].menuId,
          title: menuList[i].name,
          isDynamic: true,
          isTab: true,
          iframeUrl: '' },
        children: []
      }
    }
    newRouter = fnAddDynamicMenuRoutesLoop(menuList[i], newRouter)
    routerArr.push(newRouter)
  }
  return routerArr
}

/**
 * 添加动态(菜单)路由
 * @param {*} menuList 菜单列表
 * @param {*} routes 递归创建的动态(菜单)路由
 */
function fnAddDynamicMenuRoutesLoop(menuList = [], routes = []) {
  var temp = []
  // 如果地址为空的话，则应该为目录名
  // if (!menuList[i].url)
  if (menuList.list && menuList.list.length >= 1) {
    for (var i = 0; i < menuList.list.length; i++) {
      var menuItem = menuList.list[i]
      var route = {}
      if (menuItem.url && /\S/.test(menuItem.url)) {
        menuItem.url = menuItem.url.replace(/^\//, '')
        route = {
          path: !menuItem.url ? i : menuItem.url,
          component: null,
          name: menuItem.url.replace('/', '-'),
          meta: {
            menuId: menuItem.menuId,
            title: menuItem.name,
            isDynamic: true,
            isTab: true,
            iframeUrl: ''
          }
        }
        // url以http[s]://开头, 通过iframe展示
        if (isURL(menuItem.url)) {
          route['path'] = `i-${menuItem.menuId}`
          route['name'] = `i-${menuItem.menuId}`
          route['meta']['iframeUrl'] = menuItem.url
        } else {
          try {
            route['component'] = _import(`${menuItem.url}`) || null
          } catch (e) {}
        }
        routes.children.push(route)
      } else if (menuItem.url === null) {
        route = {
          path: menuItem.url,
          component: () => import('@/views/nested/menu1/index'),
          name: menuItem.url.replace('/', '-'),
          meta: {
            menuId: menuItem.menuId,
            title: menuItem.name,
            isDynamic: true,
            isTab: true,
            iframeUrl: ''
          }
        }
        routes.children.push(route)
      }
      if (menuItem.list && menuItem.list.length >= 1) {
        fnAddDynamicMenuRoutesLoop(temp, routes)
      }
    }
  }
  return routes
}

/**
 * Filter asynchronous routing tables by recursion
 * @param routes asyncRoutes
 * @param roles
 */
export function filterAsyncRoutes(routes, roles) {
  const res = []

  routes.forEach(route => {
    const tmp = { ...route }
    if (hasPermission(roles, tmp)) {
      if (tmp.children) {
        tmp.children = filterAsyncRoutes(tmp.children, roles)
      }
      res.push(tmp)
    }
  })

  return res
}

const state = {
  routes: [],
  addRoutes: []
}

const mutations = {
  SET_ROUTES: (state, routes) => {
    state.addRoutes = routes
    state.routes = constantRoutes.concat(routes)
  }
}

const actions = {
  generateRoutes({ commit }, roles) {
    return new Promise(resolve => {
      let accessedRoutes
      request({
        url: '/sys/menu/nav',
        method: 'get',
        params: request.adornParams()
      }).then((ret) => {
        const { data } = ret
        if (roles.includes('admin')) {
          accessedRoutes = asyncRoutes || []
        } else {
          accessedRoutes = filterAsyncRoutes(asyncRoutes, roles)
        }
        if (data && (ret.code === 0 || ret.code === 200)) {
          dynamicMenuRoutes = fnAddDynamicMenuRoutes(data.menuList)
          dynamicMenuRoutesParent.children = []
          dynamicMenuRoutesParent.children = dynamicMenuRoutesParent.children.concat(dynamicMenuRoutes)
          sessionStorage.setItem('menuList', JSON.stringify(data.menuList || '[]'))
          sessionStorage.setItem('permissions', JSON.stringify(data.permissions || '[]'))
        } else {
          sessionStorage.setItem('menuList', '[]')
          sessionStorage.setItem('permissions', '[]')
        }
        accessedRoutes = accessedRoutes.concat(dynamicMenuRoutesParent)
        accessedRoutes.push({ path: '*', redirect: '/404', hidden: true })
        commit('SET_ROUTES', accessedRoutes)
        resolve(accessedRoutes)
      }).catch((e) => {
        console.log(`%c${e} 请求菜单列表和权限失败，跳转至登录页！！`, 'color:blue')
      })
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
