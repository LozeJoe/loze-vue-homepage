<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import axios from 'axios'
import FloatingBack from '@/components/FloatingBack.vue'
import { useReveal } from '@/composables/useReveal'
import MemoryTree from '@/components/MemoryTree.vue'
import { Sparkles, Image, Camera } from 'lucide-vue-next'

const activeTab = ref('全部')
const memories = ref<any[]>([])
const loading = ref(true)

const tabs = [
  { name: '全部', icon: Sparkles },
  { name: '项目', icon: Image },
  { name: '学习', icon: Camera },
]

const filtered = computed(() => {
  if (activeTab.value === '全部') return memories.value
  return memories.value.filter((m: any) => m.cat === activeTab.value)
})

async function fetchMemories() {
  try {
    const res = await axios.get('/api/memories')
    memories.value = res.data.data || []
  } catch {
    memories.value = []
  } finally {
    loading.value = false
  }
}

function scrollToMemory(memory: any) {
  const idx = filtered.value.findIndex((m: any) => m.id === memory.id)
  if (idx >= 0) {
    const cards = document.querySelectorAll('.memory-card')
    if (cards[idx]) {
      cards[idx].scrollIntoView({ behavior: 'smooth', block: 'center' })
      cards[idx].classList.add('ring-2', 'ring-emerald-400')
      setTimeout(() => cards[idx].classList.remove('ring-2', 'ring-emerald-400'), 2000)
    }
  }
}

onMounted(() => {
  useReveal()
  fetchMemories()
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
    <FloatingBack to="/" />
    <div class="max-w-5xl mx-auto px-4 sm:px-6 py-12 sm:py-20">
      <div class="text-center mb-12 reveal">
        <h1 class="text-4xl md:text-5xl font-black text-gray-800 mb-3">记忆存档</h1>
        <div class="w-20 h-1 bg-gradient-to-r from-emerald-400 to-cyan-400 rounded-full mx-auto mb-6" />
        <p class="text-gray-500 text-lg">Memory_Archive · 项目与学习记录</p>
      </div>

      <!-- Tabs -->
      <div class="flex justify-center gap-2 mb-8 reveal">
        <button v-for="t in tabs" :key="t.name" @click="activeTab = t.name"
          :class="['px-5 py-2 rounded-xl text-sm font-bold transition-all flex items-center gap-2',
            activeTab === t.name
              ? 'text-white shadow-md'
              : 'text-gray-500 glass hover:text-emerald-600']"
          :style="activeTab === t.name ? 'background: linear-gradient(135deg, #10b981, #06b6d4);' : ''">
          <component :is="t.icon" :size="15" />
          {{ t.name }}
        </button>
      </div>

      <!-- Loading -->
      <div v-if="loading" class="flex justify-center py-20">
        <div class="w-8 h-8 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin" />
      </div>

      <!-- Tree + Cards -->
      <template v-else>
        <MemoryTree :memories="filtered" @select="scrollToMemory" />
        
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-12">
          <div v-for="m in filtered" :key="m.id"
            class="memory-card glass rounded-2xl p-5 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer reveal"
            @click="scrollToMemory(m)">
            <div class="flex items-center gap-2 mb-3">
              <span :class="['text-xs px-2 py-0.5 rounded-full font-medium',
                m.cat === '项目' ? 'bg-emerald-50 text-emerald-600' : 'bg-cyan-50 text-cyan-600']">
                {{ m.cat }}
              </span>
              <span class="text-xs text-gray-400">{{ m.date }}</span>
            </div>
            <h3 class="text-base font-bold text-gray-800 mb-1">{{ m.title }}</h3>
            <p class="text-sm text-gray-400 leading-relaxed">{{ m.description }}</p>
          </div>
        </div>

        <div v-if="filtered.length === 0" class="text-center py-16 text-gray-400">
          暂无记录
        </div>
      </template>
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
