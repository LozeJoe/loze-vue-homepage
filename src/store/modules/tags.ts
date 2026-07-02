import api from '@/api/index'

interface TagState {
  list: any[]
  loading: boolean
}

export default {
  namespaced: true,
  state: (): TagState => ({
    list: [],
    loading: false,
  }),
  getters: {
    count: (state: TagState) => state.list.length,
    options: (state: TagState) => state.list.map((t: any) => ({ label: t.name, value: t.id })),
  },
  mutations: {
    SET_LIST(state: TagState, list: any[]) {
      state.list = list
    },
    ADD(state: TagState, item: any) {
      state.list.push(item)
    },
    UPDATE(state: TagState, { id, name }: { id: string; name: string }) {
      const idx = state.list.findIndex((t: any) => t.id === id)
      if (idx !== -1) state.list[idx].name = name
    },
    REMOVE(state: TagState, id: string) {
      state.list = state.list.filter((t: any) => t.id !== id)
    },
  },
  actions: {
    async fetchTags({ commit }: any) {
      const res = await api.get('/tags')
      commit('SET_LIST', res.data?.records || res.data || [])
    },
    async createTag({ commit }: any, name: string) {
      const res = await api.post('/tags', { name })
      commit('ADD', res.data)
      return res.data
    },
    async updateTag({ commit }: any, { id, name }: { id: string; name: string }) {
      await api.put(`/tags/${id}`, { name })
      commit('UPDATE', { id, name })
    },
    async deleteTag({ commit }: any, id: string) {
      await api.delete(`/tags/${id}`)
      commit('REMOVE', id)
    },
  },
}
