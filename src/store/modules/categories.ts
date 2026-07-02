import api from '@/api/index'

interface CategoryState {
  list: any[]
  loading: boolean
}

export default {
  namespaced: true,
  state: (): CategoryState => ({
    list: [],
    loading: false,
  }),
  getters: {
    count: (state: CategoryState) => state.list.length,
    options: (state: CategoryState) => state.list.map((c: any) => ({ label: c.name, value: c.name })),
  },
  mutations: {
    SET_LIST(state: CategoryState, list: any[]) {
      state.list = list
    },
    ADD(state: CategoryState, item: any) {
      state.list.push(item)
    },
    UPDATE(state: CategoryState, { id, name }: { id: string; name: string }) {
      const idx = state.list.findIndex((c: any) => c.id === id)
      if (idx !== -1) state.list[idx].name = name
    },
    REMOVE(state: CategoryState, id: string) {
      state.list = state.list.filter((c: any) => c.id !== id)
    },
  },
  actions: {
    async fetchCategories({ commit }: any) {
      const res = await api.get('/categories')
      commit('SET_LIST', res.data?.records || res.data || [])
    },
    async createCategory({ commit }: any, name: string) {
      const res = await api.post('/categories', { name })
      commit('ADD', res.data)
      return res.data
    },
    async updateCategory({ commit }: any, { id, name }: { id: string; name: string }) {
      await api.put(`/categories/${id}`, { name })
      commit('UPDATE', { id, name })
    },
    async deleteCategory({ commit }: any, id: string) {
      await api.delete(`/categories/${id}`)
      commit('REMOVE', id)
    },
  },
}
