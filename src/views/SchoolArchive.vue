<script setup lang="ts">
import { onMounted } from 'vue'
import FloatingBack from '@/components/FloatingBack.vue'
import { useReveal } from '@/composables/useReveal'
import { GraduationCap, BookOpen, Calendar } from 'lucide-vue-next'

const education = [
  {
    school: '专科在读',
    major: '软件技术',
    class: '软件技术3班',
    period: '2024 - 2026',
    desc: '主修 Java/Spring Boot/Vue.js 全栈开发，自学 AI 工具链集成',
    courses: ['Java SE/EE', 'Spring Boot', 'Vue.js', 'MySQL', '数据结构', '计算机网络'],
    icon: GraduationCap,
  },
  {
    title: '专升本备考',
    school: '高等数学筑基',
    period: '2025 - 2026',
    desc: 'B站陈哥专升本高数课程，136节 103小时',
    courses: ['函数极限', '导数微分', '不定积分', '定积分', '微分方程', '多元函数'],
    icon: BookOpen,
  },
]

onMounted(() => useReveal())
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50/20">
    <FloatingBack to="/" />
    <div class="max-w-4xl mx-auto px-4 sm:px-6 py-12 sm:py-20">
      <div class="text-center mb-12 reveal">
        <h1 class="text-4xl md:text-5xl font-black text-gray-800 mb-3">求学轨迹</h1>
        <div class="w-20 h-1 bg-gradient-to-r from-emerald-400 to-cyan-400 rounded-full mx-auto mb-6" />
        <p class="text-gray-500 text-lg">School_Timeline \u00b7 终身学习</p>
      </div>

      <div class="space-y-6 reveal">
        <div v-for="(item, i) in education" :key="i"
          class="bg-white/70 backdrop-blur border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all">
          <div class="flex items-start gap-4">
            <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-100 to-cyan-100 flex items-center justify-center flex-shrink-0">
              <component :is="item.icon" :size="22" class="text-emerald-600" />
            </div>
            <div class="flex-1">
              <div class="flex items-center gap-2 mb-1">
                <h3 class="text-lg font-bold text-gray-800">{{ item.title || item.school }}</h3>
                <span class="text-xs px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600">{{ item.major || item.class || '' }}</span>
              </div>
              <p class="text-sm text-gray-400 mb-2 flex items-center gap-1">
                <Calendar :size="13" /> {{ item.period }}
              </p>
              <p class="text-sm text-gray-500 mb-3">{{ item.desc }}</p>
              <div class="flex flex-wrap gap-1.5">
                <span v-for="c in item.courses" :key="c"
                  class="text-xs px-2 py-0.5 rounded-md bg-gray-50 text-gray-500 border border-gray-100">{{ c }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
