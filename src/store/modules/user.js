import { login, logout, getInfo } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import router, { resetRouter } from '@/router'

const state = {
  token: getToken(),
  name: '',
  avatar: '',
  introduction: '',
  roles: []
}

const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_INTRODUCTION: (state, introduction) => {
    state.introduction = introduction
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles
  }
}

const actions = {
  // user login
  login({ commit }, userInfo) {
    const { username, password, uuid, captcha } = userInfo
    return new Promise((resolve, reject) => {
      login({ username: username.trim(), password: password, uuid: uuid, captcha: captcha }).then(response => {
        const { data } = response
        if (!!data && !!data.token) {
          commit('SET_TOKEN', data.token)
          setToken(data.token)
        }
        resolve(response)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // get user info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getInfo(state.token).then(response => {
        var { data } = response

        if (!data) {
          reject('Verification failed, please Login again.')
        }
        // 暂时把返回值写死为管理员，目前user/info 接口返回的data类型跟这个项目里的不一样，user/info返回的是
        // {"code":200,"msg":"Success",
        // "data":{"userId":1,"username":"admin","password":"9ec9750e709431dad22365cabc5c625482e574c74adaebba7dd02f1129e4ce1d",
        // "salt":"YzcmCZNvbXocrsz9dm8e","email":"root@renren.io","mobile":"13612345678","status":1,"roleIdList":null,"createUserId":1,"createTime":"2016-11-11 11:11:11"}}
        // 需要将data的格式转一下，目前后台返回的rolelist是空，所以暂时写死。
        var transdata = { 'roles': ['admin'], 'introduction': 'I am a super administrator', 'avatar': 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif', 'name': 'Super Admin' }
        transdata.name = data.username
        const { roles, name, avatar, introduction } = transdata

        // roles must be a non-empty array
        // if (!roles || roles.length <= 0) {
        //   reject('getInfo: roles must be a non-null array!')
        // }
        // const rolelist = ["admin"]
        commit('SET_ROLES', roles)
        commit('SET_NAME', name)
        commit('SET_AVATAR', avatar)
        commit('SET_INTRODUCTION', introduction)
        resolve(transdata)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // user logout
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      logout(state.token).then(() => {
        commit('SET_TOKEN', '')
        commit('SET_ROLES', [])
        removeToken()
        resetRouter()
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      commit('SET_TOKEN', '')
      commit('SET_ROLES', [])
      removeToken()
      resolve()
    })
  },

  // dynamically modify permissions
  changeRoles({ commit, dispatch }, role) {
    return new Promise(async resolve => {
      const token = role + '-token'

      commit('SET_TOKEN', token)
      setToken(token)

      const { roles } = await dispatch('getInfo')

      resetRouter()

      // generate accessible routes map based on roles
      const accessRoutes = await dispatch('permission/generateRoutes', roles, { root: true })

      // dynamically add accessible routes
      router.addRoutes(accessRoutes)

      // reset visited views and cached views
      dispatch('tagsView/delAllViews', null, { root: true })

      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
