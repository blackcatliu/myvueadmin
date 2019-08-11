/** When your routing table is too long, you can split it into small modules**/

import Layout from '@/layout'

const accessRouter = {
  path: '/access',
  component: Layout,
  redirect: '/access/passage',
  name: 'AccessContrul',
  alwaysShow: true,
  meta: {
    title: '门禁管理'
  },
  children: [
    {
      path: 'passage',
      component: () => import('@/views/access/passage'),
      name: 'Passage',
      meta: { title: '通行策略' }
    }
  ]
}

export default accessRouter
