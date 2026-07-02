<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { RouterLink } from 'vue-router'
import api from '@/api'
import { FileText, FolderOpen, Tags, MessageSquare, Plus, List, Link, Mail, Sparkles, Layers } from 'lucide-vue-next'

const stats = ref<Record<string, number>>({})
const loading = ref(true)

const fetch = async () => {
  loading.value = true
  try {
    const res = await api.get('/admin/dashboard')
    stats.value = res.data || {}
  } catch { stats.value = {} }
  finally { loading.value = false }
}

const cards = computed(() => [
  { title: '文章', value: stats.value.posts ?? 0, icon: FileText, color: 'emerald', label: '篇' },
  { title: '分类', value: stats.value.categories ?? 0, icon: FolderOpen, color: 'cyan', label: '个' },
  { title: '标签', value: stats.value.tags ?? 0, icon: Tags, color: 'violet', label: '个' },
  { title: '评论', value: stats.value.comments ?? 0, icon: MessageSquare, color: 'amber', label: '条' },
  { title: '留言', value: stats.value.contacts ?? 0, icon: Mail, color: 'rose', label: '条' },
  { title: '友链', value: stats.value.friends ?? 0, icon: Link, color: 'indigo', label: '个' },
  { title: '记忆', value: stats.value.memories ?? 0, icon: Layers, color: 'teal', label: '条' },
  { title: '便签', value: stats.value.stars ?? 0, icon: Sparkles, color: 'orange', label: '张' },
])

const actions = [
  { to: '/admin/write', icon: Plus, title: '写文章', desc: '撰写新文章', color: 'emerald' },
  { to: '/admin/posts', icon: List, title: '文章', desc: '管理文章', color: 'cyan' },
  { to: '/admin/categories', icon: FolderOpen, title: '分类', desc: '管理分类', color: 'violet' },
  { to: '/admin/tags', icon: Tags, title: '标签', desc: '管理标签', color: 'amber' },
  { to: '/admin/memories', icon: Layers, title: '记忆', desc: '管理记忆', color: 'teal' },
]

const colorMap: Record<string, string> = {
  emerald: 'bg-emerald-400/10 text-emerald-500',
  cyan: 'bg-cyan-400/10 text-cyan-500',
  violet: 'bg-violet-400/10 text-violet-500',
  amber: 'bg-amber-400/10 text-amber-500',
  rose: 'bg-rose-400/10 text-rose-500',
  indigo: 'bg-indigo-400/10 text-indigo-500',
  orange: 'bg-orange-400/10 text-orange-500',
  teal: 'bg-teal-400/10 text-teal-500',
}

onMounted(() => {
  fetch()
})
</script>

<template>
  <div class="p-6 md:p-8">
    <div class="flex items-center justify-between mb-8">
      <div>
        <h1 class="text-2xl font-black text-gray-800">仪表盘</h1>
        <p class="text-sm text-gray-400 font-mono mt-1">仪表盘 // SYSTEM_OVERVIEW</p>
      </div>
    </div>

    <!-- Stats -->
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <div v-for="card in cards" :key="card.title"
        class="glass rounded-2xl p-5 hover:shadow-md transition-shadow">
        <div class="flex items-center gap-3 mb-3">
          <div class="w-9 h-9 rounded-lg flex items-center justify-center"
            :class="colorMap[card.color]">
            <component :is="card.icon" :size="18" />
          </div>
          <span class="font-bold text-gray-700 text-sm">{{ card.title }}</span>
        </div>
        <div class="flex items-baseline gap-1">
          <span v-if="loading" class="text-2xl text-gray-300 font-black">...</span>
          <span v-else class="text-3xl font-black text-gray-800">{{ card.value }}</span>
          <span v-if="!loading" class="text-xs text-gray-400">{{ card.label }}</span>
        </div>
      </div>
    </div>

    <!-- Quick Actions -->
    <h2 class="font-bold text-gray-700 mb-4">快捷操作</h2>
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <RouterLink v-for="action in actions" :key="action.to" :to="action.to"
        class="glass rounded-2xl p-5 hover:shadow-md hover:-translate-y-0.5 transition-all group">
        <div class="w-9 h-9 rounded-lg flex items-center justify-center mb-3"
          :class="colorMap[action.color]">
          <component :is="action.icon" :size="18" />
        </div>
        <h3 class="font-bold text-gray-800 text-sm mb-1">{{ action.title }}</h3>
        <p class="text-xs text-gray-400">{{ action.desc }}</p>
      </RouterLink>
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
