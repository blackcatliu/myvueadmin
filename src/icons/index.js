import Vue from 'vue'
import SvgIcon from '@/components/SvgIcon'// svg component
import IconSvg from '@/components/icon-svg'

// register globally
Vue.component('svg-icon', SvgIcon)
Vue.component('IconSvg', IconSvg)

const req = require.context('./svg', false, /\.svg$/)
const iconList = req.keys().map(item => req(item))
const requireAll = requireContext => requireContext.keys().map(requireContext)
requireAll(req)

export default {
  // 获取图标icon-(*).svg名称列表, 例如[shouye, xitong, zhedie, ...]
  getNameList() {
    return iconList.map(item => item.default.id.replace('icon-', ''))
  }
}
