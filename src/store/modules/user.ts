import api from '@/api/index'

interface UserState {
  token: string
  user: any
}

export default {
  namespaced: true,
  state: (): UserState => ({
    token: localStorage.getItem('token') || '',
    user: null,
  }),
  getters: {
    isLoggedIn: (state: UserState) => !!state.token,
    username: (state: UserState) => state.user?.username || '',
  },
  mutations: {
    SET_TOKEN(state: UserState, token: string) {
      state.token = token
      if (token) {
        localStorage.setItem('token', token)
      } else {
        localStorage.removeItem('token')
      }
    },
    SET_USER(state: UserState, user: any) {
      state.user = user
    },
    LOGOUT(state: UserState) {
      state.token = ''
      state.user = null
      localStorage.removeItem('token')
    },
  },
  actions: {
    async login({ commit }: any, { username, password }: { username: string; password: string }) {
      const res = await api.post('/auth/login', { username, password })
      // 检查后端返回的 code 字段，401 表示登录失败
      if (res.data.code === 401 || !res.data.token) {
        const msg = res.data.message || '用户名或密码错误'
        throw new Error(msg)
      }
      commit('SET_TOKEN', res.data.token)
      commit('SET_USER', res.data.user || { username: res.data.username })
      return res.data
    },
    logout({ commit }: any) {
      commit('LOGOUT')
    },
  },
}
