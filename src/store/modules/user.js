import { login, getUserInfo } from '@/api/login'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { resetRouter } from '@/router'

const getDefaultState = () => {
  return {
    token: getToken(),
    name: '',
    avatar: '',
    user: null, // 存储登录后用户的信息
  }
}

const state = getDefaultState()

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState())
  },
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_USER (state, payload) {
    state.user = payload
  }
}

const actions = {
  // user login
  login({ commit }, userInfo) {
    console.log(commit);
    return new Promise(async (resolve, reject) => {
      try {
        const res = await login(userInfo)
        const { data } = res  
        if (data) {
          commit('SET_USER', data)
          resolve(data)
        } else {
          reject(res)
        }
      } catch (error) {
        reject(error)
      }    
    })
  },

  // get user info
  getInfo({ commit, state }) {
    return new Promise(async (resolve, reject) => {
      try {
        const res = await getUserInfo()
        if (typeof res === 'object') {
          commit('SET_USER', res)
          resolve(res)
        } else {
          const data = JSON.parse(res)
          if (data.code === 401) {
            reject(data.msg)
          }
        }
      } catch (error) {
        reject(error)
      }
    })
  },

  // user logout
  logout(context) {
    return new Promise((resolve, reject) => {
      context.commit('SET_USER', null)
      resolve()
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      removeToken() // must remove  token  first
      commit('RESET_STATE')
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters: {
    getUser (state) {
      return state.user || null
    }
  }
}

