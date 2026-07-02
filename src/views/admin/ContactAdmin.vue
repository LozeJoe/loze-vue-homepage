<script setup lang="ts">
import { ref, onMounted } from 'vue'
import api from '@/api'
import { Mail, Trash2, User, Clock, RefreshCw } from 'lucide-vue-next'
import { ElMessage, ElMessageBox } from 'element-plus'

const messages = ref<any[]>([])
const loading = ref(true)

const fetch = async () => {
  loading.value = true
  try {
    const res = await api.get('/admin/contacts')
    messages.value = Array.isArray(res.data) ? res.data : []
  } catch { messages.value = [] }
  finally { loading.value = false }
}

const remove = async (id: string) => {
  try {
    await ElMessageBox.confirm('确定删除这条消息？', '确认删除', { type: 'warning' })
    await api.delete(`/admin/contacts/${id}`)
    ElMessage.success('已删除')
    fetch()
  } catch (e: any) { if (e !== 'cancel') ElMessage.error('删除失败') }
}

const formatTime = (t: string) => {
  if (!t) return ''
  return new Date(t).toLocaleDateString('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' })
}

onMounted(fetch)
</script>

<template>
  <div class="p-6 md:p-8">
    <div class="flex items-center justify-between mb-8">
      <div>
        <h1 class="text-2xl font-black text-gray-800 mb-1">联系消息</h1>
        <p class="text-sm text-gray-400 font-mono">共 {{ messages.length }} 条消息</p>
      </div>
      <button @click="fetch" :disabled="loading"
        class="flex items-center gap-1.5 px-4 py-2 rounded-xl glass text-sm text-gray-500 hover:text-emerald-600 transition-colors disabled:opacity-50">
        <RefreshCw :size="15" :class="{ 'animate-spin': loading }" /> 刷新
      </button>
    </div>

    <div v-if="loading" class="flex justify-center py-20">
      <RefreshCw class="w-8 h-8 animate-spin text-emerald-500" />
    </div>

    <div v-else class="space-y-3 max-w-3xl">
      <div v-if="messages.length === 0" class="glass rounded-2xl p-12 text-center">
        <Mail :size="40" class="text-gray-300 mx-auto mb-4" />
        <p class="text-gray-400">暂无联系消息</p>
      </div>

      <div v-for="m in messages" :key="m.id" class="glass rounded-xl p-4">
        <div class="flex items-start justify-between mb-2">
          <div class="flex items-center gap-2">
            <User :size="14" class="text-emerald-500" />
            <span class="font-bold text-gray-700 text-sm">{{ m.name }}</span>
            <span class="text-xs text-gray-400">{{ m.email }}</span>
          </div>
          <div class="flex items-center gap-2">
            <span class="text-xs text-gray-400 flex items-center gap-1"><Clock :size="10" /> {{ formatTime(m.createdAt) }}</span>
            <button @click="remove(m.id)" class="p-1.5 rounded-lg text-gray-300 hover:text-red-400 hover:bg-red-50 transition-colors">
              <Trash2 :size="14" />
            </button>
          </div>
        </div>
        <p class="text-sm text-gray-600 leading-relaxed bg-gray-50/50 rounded-lg px-3 py-2">{{ m.message }}</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.glass { background: rgba(255,255,255,0.65); backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px); border: 1px solid rgba(255,255,255,0.8); box-shadow: 0 1px 3px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.03); }
</style>
