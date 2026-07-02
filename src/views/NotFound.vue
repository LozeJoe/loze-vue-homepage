<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { Home, ArrowLeft } from 'lucide-vue-next'

const router = useRouter()
const glitchText = ref('404')

const messages = [
  '这个页面像玻璃一样碎掉了 💔',
  '你走进了不存在的那一页...',
  '404 — 数字花园里没有这朵花 🌸',
  '路由迷路了，请原路返回',
]
const msg = ref(messages[Math.floor(Math.random() * messages.length)])

onMounted(() => {
  let i = 0
  const chars = ['404', '4O4', '40④', '④04']
  const timer = setInterval(() => {
    glitchText.value = chars[i % chars.length]
    i++
  }, 300)
  setTimeout(() => {
    clearInterval(timer)
    glitchText.value = '404'
  }, 2000)
})
</script>

<template>
  <div class="min-h-screen relative overflow-hidden flex items-center justify-center"
       style="background: linear-gradient(135deg, #f0fdf4 0%, #ecfeff 50%, #f5f3ff 100%);">
    
    <div class="absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full opacity-20 pointer-events-none"
         style="background: radial-gradient(circle, rgba(16,185,129,0.3) 0%, transparent 70%);" />
    <div class="absolute -bottom-20 -left-20 w-[400px] h-[400px] rounded-full opacity-15 pointer-events-none"
         style="background: radial-gradient(circle, rgba(6,182,212,0.3) 0%, transparent 70%);" />
    
    <div
      v-for="i in 12"
      :key="i"
      class="shard absolute pointer-events-none"
      :style="{
        width: (20 + (i * 7) % 35) + 'px',
        height: (8 + (i * 3) % 14) + 'px',
        left: (8 + i * 7.5) + '%',
        top: (5 + i * 8.2) + '%',
        opacity: 0.15 + (i % 5) * 0.04,
        transform: 'rotate(' + (i * 31) + 'deg)',
        animationDelay: (i * 0.25) + 's',
      }"
    />

    <div class="relative z-10 text-center px-4">
      <div class="relative inline-block mb-6">
        <h1 class="text-[10rem] md:text-[12rem] font-black leading-none select-none"
            style="background: linear-gradient(135deg, #d1d5db 0%, #9ca3af 40%, #10b981 60%, #06b6d4 80%, #d1d5db 100%);
                   background-size: 300% 300%;
                   -webkit-background-clip: text;
                   -webkit-text-fill-color: transparent;
                   background-clip: text;
                   animation: gradient-shift 4s ease-in-out infinite;">
          {{ glitchText }}
        </h1>
        <svg class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] pointer-events-none" viewBox="0 0 200 100">
          <line x1="20" y1="10" x2="80" y2="50" stroke="rgba(16,185,129,0.12)" stroke-width="1.5" />
          <line x1="80" y1="50" x2="60" y2="90" stroke="rgba(16,185,129,0.08)" stroke-width="1" />
          <line x1="80" y1="50" x2="160" y2="60" stroke="rgba(6,182,212,0.1)" stroke-width="1" />
          <line x1="150" y1="20" x2="160" y2="60" stroke="rgba(6,182,212,0.08)" stroke-width="1" />
        </svg>
      </div>

      <h2 class="text-2xl md:text-3xl font-bold text-gray-800 mb-3">页面不存在</h2>
      <p class="text-gray-500 text-lg mb-8 max-w-md mx-auto leading-relaxed">{{ msg }}</p>

      <div class="flex gap-3 justify-center">
        <button @click="router.push('/')"
                class="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-medium text-white text-sm transition-all shadow-md hover:shadow-lg active:scale-[0.98]"
                style="background: linear-gradient(135deg, #10b981, #06b6d4);">
          <Home :size="18" /> 回到首页
        </button>
        <button @click="router.back()"
                class="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-medium text-gray-500 text-sm border border-gray-200 hover:border-emerald-300 hover:text-emerald-600 transition-all bg-white/60 backdrop-blur">
          <ArrowLeft :size="18" /> 返回上页
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.shard {
  background: linear-gradient(135deg, rgba(16,185,129,0.6), rgba(6,182,212,0.4));
  border-radius: 2px;
  animation: float-shard 8s ease-in-out infinite;
}

@keyframes float-shard {
  0%, 100% { transform: translateY(0) rotate(0deg); }
  50% { transform: translateY(-15px) rotate(10deg); }
}

@keyframes gradient-shift {
  0%, 100% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
}
</style>
