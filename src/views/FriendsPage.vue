<script setup lang="ts">
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { ExternalLink, Globe } from 'lucide-vue-next'
import FloatingBack from '@/components/FloatingBack.vue'

const friends = ref<any[]>([])
const loading = ref(true)

onMounted(async () => {
  try {
    const res = await axios.get('/api/friends')
    friends.value = Array.isArray(res.data) ? res.data : []
  } catch {
    try {
      const res = await axios.get('/api/admin/friends')
      friends.value = Array.isArray(res.data) ? res.data : []
    } catch { friends.value = [] }
  } finally { loading.value = false }
})
</script>

<template>
  <div class="min-h-screen w-full font-sans relative" style="background: linear-gradient(135deg, #f8fafc 0%, #f0fdf4 30%, #ecfeff 60%, #f5f3ff 100%);">
    <!-- Animated gradient orbs -->
    <div class="absolute inset-0 pointer-events-none overflow-hidden" style="z-index:0">
      <div class="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full opacity-30"
           style="background: radial-gradient(circle, rgba(16,185,129,0.3) 0%, transparent 70%); animation: float 20s ease-in-out infinite;" />
      <div class="absolute -bottom-20 -left-20 w-[500px] h-[500px] rounded-full opacity-20"
           style="background: radial-gradient(circle, rgba(6,182,212,0.3) 0%, transparent 70%); animation: float 25s ease-in-out infinite reverse;" />
      <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] rounded-full opacity-10"
           style="background: radial-gradient(ellipse, rgba(139,92,246,0.2) 0%, transparent 70%); animation: float 30s ease-in-out infinite;" />
    </div>
    <!-- Grid pattern -->
    <div class="absolute inset-0 pointer-events-none opacity-[0.03]"
         style="background-image: radial-gradient(circle, #000 1px, transparent 1px); background-size: 30px 30px;" />
    <div class="relative z-10">
    <div class="px-4 py-16 md:py-24">
    <FloatingBack to="/" />
    <!-- Header -->
    <div class="text-center mb-12 reveal">
      <h1 class="text-4xl md:text-5xl font-black text-gray-800 mb-3">友情链接</h1>
      <div class="w-20 h-1 bg-gradient-to-r from-emerald-400 to-cyan-400 rounded-full mx-auto mb-6" />
      <p class="text-gray-500 text-lg max-w-md mx-auto">这些是我经常访问的网站，也许你也会喜欢</p>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="flex justify-center py-20">
      <div class="w-8 h-8 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin"></div>
    </div>

    <!-- Friend Cards -->
    <div v-else class="w-full max-w-3xl mx-auto space-y-3">
      <div v-if="friends.length === 0" class="glass rounded-2xl p-12 text-center">
        <Globe :size="40" class="text-gray-300 mx-auto mb-4" />
        <p class="text-gray-400">暂无友链</p>
      </div>

      <a v-for="f in friends" :key="f.id" :href="f.url" target="_blank" rel="noopener"
        class="glass rounded-xl p-4 flex items-center gap-4 hover:shadow-md hover:-translate-y-0.5 transition-all group">
        <!-- Avatar: 自定义头像 or 首字母占位 -->
        <div class="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 overflow-hidden"
             style="background: linear-gradient(135deg, rgba(16,185,129,0.15), rgba(6,182,212,0.15));">
          <img v-if="f.avatar" :src="f.avatar" :alt="f.name" class="w-full h-full object-cover" loading="lazy" />
          <span v-else class="text-emerald-600 font-bold text-sm">{{ f.name?.charAt(0) || '?' }}</span>
        </div>
        <!-- Info -->
        <div class="flex-1 min-w-0">
          <div class="font-bold text-gray-700 text-sm group-hover:text-emerald-600 transition-colors">{{ f.name }}</div>
          <div class="text-xs text-gray-400 truncate">{{ f.description || f.url }}</div>
        </div>
        <!-- Arrow -->
        <ExternalLink :size="14" class="text-gray-300 group-hover:text-emerald-400 shrink-0 transition-colors" />
      </a>
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
