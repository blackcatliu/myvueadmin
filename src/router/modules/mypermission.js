/** When your routing table is too long, you can split it into small modules **/

import Layout from '@/layout'

const mypermissionRouter = {
  path: '/mypermission',
  component: Layout,
  redirect: '/mypermission/role',
  name: 'Mypermission',
  meta: {
    title: '权限管理',
    icon: 'lock'
  },
  children: [
    {
      path: 'role',
      component: () => import('@/views/mypermission/role'),
      name: 'Role',
      meta: { title: '角色管理' }
    },
    {
      path: 'user',
      component: () => import('@/views/mypermission/user'),
      name: 'user',
      meta: { title: '管理员列表' }
    },
    {
      path: 'syslog',
      component: () => import('@/views/mypermission/log'),
      name: 'SysLog',
      meta: { title: '系统日志' }
    },
    {
      path: 'sysmenu',
      component: () => import('@/views/mypermission/menu'),
      name: 'Sysmenu',
      meta: { title: '菜单管理', keepAlive: true }
    },
    {
      path: 'dooraccess',
      component: () => import('@/views/mypermission/dooraccess'),
      name: 'dooraccess',
      meta: { title: '门禁卡管理', keepAlive: true },
      hidden: true
    }
  ]
}
export default mypermissionRouter
