<script setup lang="ts">
import { onMounted } from 'vue'
import FloatingBack from '@/components/FloatingBack.vue'
import { useReveal } from '@/composables/useReveal'

interface Skill {
  title: string
  items: string[]
  icon: string
}
interface Learning {
  name: string
  level: number
}

const skills: Skill[] = [
  { title: '前端开发', icon: '\ud83c\udfa8', items: ['Vue 3', 'TypeScript', 'Tailwind CSS', 'Vite', 'Element Plus', 'GSAP'] },
  { title: '后端开发', icon: '\u2699\ufe0f', items: ['Spring Boot', 'Java', 'MyBatis Plus', 'MySQL', 'JWT', 'RESTful API'] },
  { title: 'AI & 工具链', icon: '\ud83e\udd16', items: ['Git', 'Maven', 'Linux', 'EasyOCR', 'Ollama', 'ComfyUI'] },
]

const learning: Learning[] = [
  { name: '高等数学', level: 50 },
  { name: '数据结构', level: 45 },
  { name: '算法设计', level: 30 },
]

onMounted(() => useReveal())
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50/20">
    <FloatingBack to="/" />
    <div class="max-w-5xl mx-auto px-4 sm:px-6 py-12 sm:py-20">
      <div class="text-center mb-12 reveal">
        <h1 class="text-4xl md:text-5xl font-black text-gray-800 mb-3">专业技能</h1>
        <div class="w-20 h-1 bg-gradient-to-r from-emerald-400 to-cyan-400 rounded-full mx-auto mb-6" />
        <p class="text-gray-500 text-lg">Expertise_Grid \u00b7 技术栈掌握程度一览</p>
      </div>

      <div class="grid sm:grid-cols-3 gap-5 mb-12 reveal">
        <div v-for="sk in skills" :key="sk.title"
          class="bg-white/70 backdrop-blur border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all">
          <h3 class="text-lg font-bold text-gray-800 mb-4">{{ sk.icon }} {{ sk.title }}</h3>
          <div class="flex flex-wrap gap-2">
            <span v-for="item in sk.items" :key="item"
              class="text-xs px-2.5 py-1 rounded-lg bg-gradient-to-r from-emerald-50 to-cyan-50 text-emerald-700 border border-emerald-100">{{ item }}</span>
          </div>
        </div>
      </div>

      <div class="reveal">
        <h2 class="text-xl font-bold text-gray-800 mb-6 text-center">正在学习</h2>
        <div class="bg-white/70 backdrop-blur border border-gray-100 rounded-2xl p-6 shadow-sm max-w-md mx-auto">
          <div v-for="item in learning" :key="item.name" class="mb-4 last:mb-0">
            <div class="flex justify-between text-sm mb-1">
              <span class="text-gray-600">{{ item.name }}</span>
              <span class="text-emerald-600 font-medium">{{ item.level }}%</span>
            </div>
            <div class="h-2 rounded-full bg-gray-100 overflow-hidden">
              <div class="h-full rounded-full bg-gradient-to-r from-emerald-400 to-cyan-400 transition-all duration-500"
                :style="{ width: item.level + '%' }" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
