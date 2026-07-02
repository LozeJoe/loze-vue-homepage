import api from '@/api/index'

interface PostsState {
  list: any[]
  featured: any[]
  total: number
  loading: boolean
  current: any | null
}

export default {
  namespaced: true,
  state: (): PostsState => ({
    list: [],
    featured: [],
    total: 0,
    loading: false,
    current: null,
  }),
  getters: {
    postCount: (state: PostsState) => state.total,
    featuredCount: (state: PostsState) => state.featured.length,
  },
  mutations: {
    SET_LIST(state: PostsState, { list, total }: { list: any[]; total: number }) {
      state.list = list
      state.total = total
    },
    SET_FEATURED(state: PostsState, posts: any[]) {
      state.featured = posts
    },
    SET_LOADING(state: PostsState, val: boolean) {
      state.loading = val
    },
    SET_CURRENT(state: PostsState, post: any | null) {
      state.current = post
    },
    REMOVE_POST(state: PostsState, id: string) {
      state.list = state.list.filter((p: any) => p.id !== id)
      state.featured = state.featured.filter((p: any) => p.id !== id)
      state.total--
    },
  },
  actions: {
    async fetchPosts({ commit }: any, params: any = {}) {
      commit('SET_LOADING', true)
      try {
        const res = await api.get('/posts', { params })
        commit('SET_LIST', { list: res.data?.records || res.data || [], total: res.data?.total || 0 })
      } finally {
        commit('SET_LOADING', false)
      }
    },
    async fetchFeatured({ commit }: any) {
      const res = await api.get('/posts', { params: { featured: true, limit: 6 } })
      commit('SET_FEATURED', res.data?.records || res.data || [])
    },
    async fetchPost({ commit }: any, id: string) {
      const res = await api.get(`/posts/${id}`)
      commit('SET_CURRENT', res.data)
      return res.data
    },
    async savePost(_: any, payload: any) {
      if (payload.id) {
        return api.put(`/posts/${payload.id}`, payload)
      }
      return api.post('/posts', payload)
    },

    async togglePost({ commit, state }: any, id: string) {
      const res = await api.put(`/posts/${id}/toggle`)
      if (res.data) {
        const updatedList = state.list.map((p: any) =>
          p.id === id ? { ...p, draft: p.draft === 1 ? 0 : 1 } : p
        )
        commit('SET_LIST', { list: updatedList, total: state.total })
      }
      return res.data
    },
    async deletePost({ commit }: any, id: string) {
      await api.delete(`/posts/${id}`)
      commit('REMOVE_POST', id)
    },
  },
}
