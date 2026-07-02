<script setup lang="ts">
import { onMounted } from 'vue'
import FloatingBack from '@/components/FloatingBack.vue'
import { useReveal } from '@/composables/useReveal'
import { Code2, Bot, Image, BookOpen, Music, Terminal } from 'lucide-vue-next'

const cards = [
  { icon: Code2, title: '全栈开发', desc: 'Vue + Spring Boot 技术栈，热爱从 0 到 1 构建项目', color: 'from-emerald-400 to-teal-400' },
  { icon: Bot, title: 'AI 工具链', desc: 'Agent 开发、本地模型部署、自动化工作流', color: 'from-violet-400 to-purple-400' },
  { icon: Image, title: 'AI 绘图', desc: 'ComfyUI 出图，探索 AI 视觉艺术的边界', color: 'from-rose-400 to-pink-400' },
  { icon: BookOpen, title: '高数备考', desc: '136 节专升本高数课程，冲刺本科上岸', color: 'from-amber-400 to-orange-400' },
  { icon: Music, title: '音乐', desc: '代码之外的精神必需品', color: 'from-cyan-400 to-blue-400' },
  { icon: Terminal, title: '命令行', desc: '终端重度用户，键盘比鼠标快', color: 'from-gray-500 to-gray-700' },
]

onMounted(() => useReveal())
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50/20">
    <FloatingBack to="/" />
    <div class="max-w-5xl mx-auto px-4 sm:px-6 py-12 sm:py-20">
      <div class="text-center mb-12 reveal">
        <h1 class="text-4xl md:text-5xl font-black text-gray-800 mb-3">兴趣爱好</h1>
        <div class="w-20 h-1 bg-gradient-to-r from-emerald-400 to-cyan-400 rounded-full mx-auto mb-6" />
        <p class="text-gray-500 text-lg">Personal_Interests_Grid \u00b7 代码之外的生活</p>
      </div>

      <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 reveal">
        <div v-for="card in cards" :key="card.title"
          class="bg-white/70 backdrop-blur border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 group">
          <div :class="['w-10 h-10 rounded-xl bg-gradient-to-br flex items-center justify-center mb-4', card.color]">
            <component :is="card.icon" :size="20" class="text-white" />
          </div>
          <h3 class="text-base font-bold text-gray-800 mb-2">{{ card.title }}</h3>
          <p class="text-sm text-gray-400 leading-relaxed">{{ card.desc }}</p>
        </div>
      </div>
    </div>
  </div>
</template>
