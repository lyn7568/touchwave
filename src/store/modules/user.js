import { login, logout } from '@/api/login'
// import { getToken, setToken, removeToken } from '@/utils/auth'

const user = {
  state: {
    name: '',
    roles: []
  },

  mutations: {
    SET_NAME: (state, name) => {
      state.name = name
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    }
  },

  actions: {
    // 用户名登录
    LoginByUsername({ commit }, userInfo) {
      console.log(userInfo)
      const account = userInfo.username.trim()
      const pw = userInfo.password.trim()
      const vc = userInfo.imgVerifyCode.trim()
      const param = {
        account,
        pw,
        vc
      }
      return new Promise((resolve, reject) => {
        login(param).then(response => {
          console.log(response)
          // if (response.success) {
          //   const data = response.data
          // }
          // setToken(response.data.type)
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 获取用户信息
    GetUserInfo({ commit, state }) {
      commit('SET_ROLES', '0')
      // return new Promise((resolve, reject) => {
      //   getInfo().then(response => {
      //     if (response.success) {
      //       console.log(response)
      //     }
      //     const data = response.data

      //     if (data.type) {
      //       commit('SET_ROLES', data.type)
      //     }
      //     // commit('SET_NAME', data.name)
      //     // commit('SET_AVATAR', data.avatar)
      //     resolve(response)
      //   }).catch(error => {
      //     reject(error)
      //   })
      // })
    },

    // 登出
    LogOut({ commit, state }) {
      return new Promise((resolve, reject) => {
        logout(state.token).then(() => {
          commit('SET_ROLES', '')
          // removeToken()
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 前端 登出
    FedLogOut({ commit }) {
      return new Promise(resolve => {
        // removeToken()
        resolve()
      })
    }
  }
}

export default user
