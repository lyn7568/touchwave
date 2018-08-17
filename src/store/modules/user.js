import { login, logout, getInfo } from '@/api/login'
import { getSession, removeSession } from '@/utils/auth'

const user = {
  state: {
    account: '',
    userid: '',
    name: '',
    roles: [],
    logins: '',
    session: getSession()
  },
  mutations: {
    SET_ACCOUNT: (state, account) => {
      state.account = account
    },
    SET_USERID: (state, userid) => {
      state.userid = userid
    },
    SET_NAME: (state, name) => {
      state.name = name
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    },
    SET_LOGIN: (state, logins) => {
      state.logins = logins
    },
    SET_SESSION: (state, session) => {
      state.session = session
    }
  },

  actions: {
    // 用户名登录
    LoginByUsername({ commit }, userInfo) {
      const account = userInfo.username.trim()
      const pw = userInfo.password
      const vc = userInfo.imgVerifyCode.toLocaleUpperCase()
      return new Promise((resolve, reject) => {
        login(account, pw, vc).then((response) => {
          if (response.success) {
            if (response.data) {
              const dataS = response.data
              if (dataS.active) {
                commit('SET_ACCOUNT', dataS.account)
                commit('SET_USERID', dataS.id)
                commit('SET_ROLES', [dataS.type.toString()])
                commit('SET_NAME', dataS.name)
              }
            }
          }
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 获取用户信息
    GetUserInfo({ commit, state }) {
      return new Promise((resolve, reject) => {
        getInfo().then(response => {
          commit('SET_LOGIN', response.success)
          if (response.success) {
            if (response.data) {
              const dataS = response.data
              if (dataS.active) {
                commit('SET_ACCOUNT', dataS.account)
                commit('SET_USERID', dataS.id)
                commit('SET_ROLES', [dataS.type.toString()])
                commit('SET_NAME', dataS.name)
              }
            }
          }
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 登出
    LogOut({ commit, state }) {
      return new Promise((resolve, reject) => {
        logout().then(() => {
          commit('SET_ACCOUNT', '')
          commit('SET_USERID', '')
          commit('SET_ROLES', [])
          commit('SET_NAME', '')
          commit('SET_SESSION', '')
          removeSession()
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 前端 登出
    FedLogOut({ commit }) {
      return new Promise(resolve => {
        commit('SET_SESSION', '')
        removeSession()
        resolve()
      })
    }
  }
}

export default user
