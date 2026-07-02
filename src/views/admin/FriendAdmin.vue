<script setup lang="ts">
import { ref, onMounted } from 'vue'
import api from '@/api'
import { Link, Plus, Trash2, Edit3, RefreshCw, Globe, FileText, ArrowUp, ArrowDown } from 'lucide-vue-next'
import { ElMessage, ElMessageBox } from 'element-plus'

const friends = ref<any[]>([])
const loading = ref(true)
const showForm = ref(false)
const editing = ref<any>(null)
const form = ref({ name: '', url: '', avatar: '', description: '', sort: 0 })

const fetch = async () => {
  loading.value = true
  try {
    const res = await api.get('/admin/friends')
    friends.value = Array.isArray(res.data) ? res.data : []
  } catch { friends.value = [] }
  finally { loading.value = false }
}

const openAdd = () => {
  editing.value = null
  form.value = { name: '', url: '', avatar: '', description: '', sort: 0 }
  showForm.value = true
}

const openEdit = (f: any) => {
  editing.value = f
  form.value = { name: f.name, url: f.url, avatar: f.avatar || '', description: f.description || '', sort: f.sort || 0 }
  showForm.value = true
}

const save = async () => {
  try {
    if (editing.value) {
      await api.put(`/admin/friends/${editing.value.id}`, form.value)
      ElMessage.success('已更新')
    } else {
      await api.post('/admin/friends', form.value)
      ElMessage.success('已添加')
    }
    showForm.value = false
    fetch()
  } catch { ElMessage.error('保存失败') }
}

const remove = async (f: any) => {
  try {
    await ElMessageBox.confirm(`确定删除友链「${f.name}」？`, '确认删除', { type: 'warning' })
    await api.delete(`/admin/friends/${f.id}`)
    ElMessage.success('已删除')
    fetch()
  } catch (e: any) { if (e !== 'cancel') ElMessage.error('删除失败') }
}

const move = async (f: any, dir: number) => {
  const newSort = (f.sort || 0) + dir
  await api.put(`/admin/friends/${f.id}`, { sort: newSort })
  fetch()
}

onMounted(fetch)
</script>

<template>
  <div class="p-6 md:p-8">
    <div class="flex items-center justify-between mb-8">
      <div>
        <h1 class="text-2xl font-black text-gray-800 mb-1">友链管理</h1>
        <p class="text-sm text-gray-400 font-mono">共 {{ friends.length }} 个友链</p>
      </div>
      <div class="flex gap-2">
        <button @click="fetch" :disabled="loading"
          class="flex items-center gap-1.5 px-4 py-2 rounded-xl glass text-sm text-gray-500 hover:text-emerald-600 transition-colors disabled:opacity-50">
          <RefreshCw :size="15" :class="{ 'animate-spin': loading }" /> 刷新
        </button>
        <button @click="openAdd"
          class="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm text-white font-semibold transition-all"
          style="background: linear-gradient(135deg, #10b981, #06b6d4); box-shadow: 0 2px 8px rgba(16,185,129,0.2);">
          <Plus :size="15" /> 添加友链
        </button>
      </div>
    </div>

    <!-- Table -->
    <div v-if="loading" class="flex justify-center py-20">
      <RefreshCw class="w-8 h-8 animate-spin text-emerald-500" />
    </div>
    <div v-else class="glass rounded-2xl overflow-hidden max-w-4xl">
      <table class="w-full text-sm">
        <thead>
          <tr class="border-b border-black/5 bg-white/30">
            <th class="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">名称</th>
            <th class="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">链接</th>
            <th class="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">描述</th>
            <th class="text-center px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider w-20">排序</th>
            <th class="text-right px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider w-24">操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="friends.length === 0">
            <td colspan="5" class="text-center py-12 text-gray-400">
              <Link :size="32" class="mx-auto mb-2 text-gray-300" />
              暂无友链
            </td>
          </tr>
          <tr v-for="f in friends" :key="f.id" class="border-b border-black/5 hover:bg-white/40 transition-colors">
            <td class="px-5 py-3 font-semibold text-gray-700">{{ f.name }}</td>
            <td class="px-5 py-3">
              <a :href="f.url" target="_blank" class="text-emerald-600 hover:underline flex items-center gap-1">
                <Globe :size="12" /> {{ f.url }}
              </a>
            </td>
            <td class="px-5 py-3 text-gray-500">
              <span class="flex items-center gap-1"><FileText :size="12" /> {{ f.description || '-' }}</span>
            </td>
            <td class="px-5 py-3 text-center">
              <div class="flex items-center justify-center gap-1">
                <span class="text-gray-500 text-xs w-6">{{ f.sort }}</span>
                <div class="flex flex-col">
                  <button @click="move(f, 1)" class="text-gray-400 hover:text-gray-600 leading-none"><ArrowUp :size="10" /></button>
                  <button @click="move(f, -1)" class="text-gray-400 hover:text-gray-600 leading-none"><ArrowDown :size="10" /></button>
                </div>
              </div>
            </td>
            <td class="px-5 py-3 text-right">
              <div class="flex items-center justify-end gap-1">
                <button @click="openEdit(f)" class="p-1.5 rounded-lg text-gray-300 hover:text-emerald-500 hover:bg-emerald-50 transition-colors">
                  <Edit3 :size="14" />
                </button>
                <button @click="remove(f)" class="p-1.5 rounded-lg text-gray-300 hover:text-red-400 hover:bg-red-50 transition-colors">
                  <Trash2 :size="14" />
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Form Modal -->
    <div v-if="showForm" class="fixed inset-0 z-50 flex items-center justify-center" @click.self="showForm = false">
      <div class="absolute inset-0 bg-black/20 backdrop-blur-sm"></div>
      <div class="relative glass rounded-2xl p-6 w-full max-w-md mx-4 z-10" style="background: rgba(255,255,255,0.9);">
        <h2 class="text-lg font-bold text-gray-800 mb-4">{{ editing ? '编辑友链' : '添加友链' }}</h2>
        <div class="space-y-3">
          <div>
            <label class="block text-xs font-semibold text-gray-500 mb-1">名称 *</label>
            <input v-model="form.name" class="w-full px-3 py-2 rounded-xl border border-gray-200 bg-white/60 text-gray-700 text-sm focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 transition-all" placeholder="如：Vue.js">
          </div>
          <div>
            <label class="block text-xs font-semibold text-gray-500 mb-1">链接 *</label>
            <input v-model="form.url" class="w-full px-3 py-2 rounded-xl border border-gray-200 bg-white/60 text-gray-700 text-sm focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 transition-all" placeholder="https://...">
          </div>
          <div>
            <label class="block text-xs font-semibold text-gray-500 mb-1">头像 URL</label>
            <input v-model="form.avatar" class="w-full px-3 py-2 rounded-xl border border-gray-200 bg-white/60 text-gray-700 text-sm focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 transition-all" placeholder="https://...">
          </div>
          <div>
            <label class="block text-xs font-semibold text-gray-500 mb-1">描述</label>
            <input v-model="form.description" class="w-full px-3 py-2 rounded-xl border border-gray-200 bg-white/60 text-gray-700 text-sm focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 transition-all" placeholder="简短介绍">
          </div>
        </div>
        <div class="flex justify-end gap-2 mt-5 pt-4 border-t border-black/5">
          <button @click="showForm = false" class="px-4 py-2 rounded-xl text-sm text-gray-500 hover:bg-gray-100 transition-colors">取消</button>
          <button @click="save" class="px-5 py-2 rounded-xl text-sm text-white font-semibold transition-all"
            style="background: linear-gradient(135deg, #10b981, #06b6d4);">保存</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.glass {
  background: rgba(255, 255, 255, 0.65);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.8);
  box-shadow: 0 1px 3px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.03);
}
</style>
