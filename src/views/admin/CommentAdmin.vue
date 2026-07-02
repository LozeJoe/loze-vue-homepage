<script setup lang="ts">
import { ref, onMounted } from 'vue'
import api from '@/api'
import { MessageSquare, Trash2, User, Clock, RefreshCw } from 'lucide-vue-next'
import { ElMessage, ElMessageBox } from 'element-plus'

const comments = ref<any[]>([])
const loading = ref(true)

const fetchComments = async () => {
  loading.value = true
  try {
    const res = await api.get('/admin/comments')
    // ApiResponse: { success, data: [...], error }
    const data = res.data?.data || res.data || []
    comments.value = Array.isArray(data) ? data : []
  } catch (e) {
    console.error('加载评论失败:', e)
    comments.value = []
  } finally {
    loading.value = false
  }
}

const remove = async (id: number) => {
  try {
    await ElMessageBox.confirm('确定删除这条评论？', '确认删除', { type: 'warning' })
    await api.delete(`/admin/comments/${id}`)
    ElMessage.success('已删除')
    fetchComments()
  } catch (e: any) {
    if (e !== 'cancel') ElMessage.error('删除失败')
  }
}

const formatTime = (t: string) => {
  if (!t) return ''
  return new Date(t).toLocaleDateString('zh-CN', {
    year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit'
  })
}

onMounted(fetchComments)
</script>

<template>
  <div class="p-6 md:p-8">
    <div class="flex items-center justify-between mb-8">
      <div>
        <h1 class="text-2xl font-black text-gray-800 mb-1">评论管理</h1>
        <p class="text-sm text-gray-400 font-mono">共 {{ comments.length }} 条评论</p>
      </div>
      <button
        @click="fetchComments"
        :disabled="loading"
        class="flex items-center gap-1.5 px-4 py-2 rounded-xl glass text-sm text-gray-500 hover:text-emerald-600 transition-colors disabled:opacity-50"
      >
        <RefreshCw :size="15" :class="{ 'animate-spin': loading }" />
        刷新
      </button>
    </div>

    <div v-if="loading" class="flex justify-center py-20">
      <RefreshCw class="w-8 h-8 animate-spin text-emerald-500" />
    </div>

    <div v-else class="space-y-3 max-w-3xl">
      <div v-if="comments.length === 0"
        class="glass rounded-2xl p-12 text-center">
        <MessageSquare :size="40" class="text-gray-300 mx-auto mb-4" />
        <p class="text-gray-400">暂无评论</p>
        <p class="text-xs text-gray-300 mt-1">访客留言将显示在这里</p>
      </div>

      <div v-for="c in comments" :key="c.id"
        class="glass rounded-xl p-4 flex gap-4">
        <div class="w-9 h-9 rounded-full bg-gradient-to-br from-emerald-400 to-cyan-400 flex items-center justify-center shrink-0">
          <User :size="15" class="text-white" />
        </div>
        <div class="flex-1 min-w-0">
          <div class="flex items-center gap-2 mb-1">
            <span class="font-bold text-gray-700 text-sm">{{ c.username }}</span>
            <span class="text-xs text-gray-400 flex items-center gap-1">
              <Clock :size="10" /> {{ formatTime(c.createTime) }}
            </span>
            <el-tag v-if="c.postId" size="small" type="info" class="!ml-auto">文章 #{{ c.postId }}</el-tag>
          </div>
          <p class="text-sm text-gray-600 leading-relaxed">{{ c.content }}</p>
        </div>
        <button @click="remove(c.id)" class="p-2 rounded-lg text-gray-300 hover:text-red-400 hover:bg-red-50 shrink-0 transition-colors">
          <Trash2 :size="15" />
        </button>
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
