<template>
  <RouterLink
    :to="to"
    class="fixed top-6 left-6 z-[110] w-9 h-9 rounded-full glass flex items-center justify-center text-gray-700 hover:text-emerald-500 hover:shadow-lg transition-all"
    title="返回首页"
  >
    <Sparkles :size="16" />
  </RouterLink>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { Sparkles } from 'lucide-vue-next'

withDefaults(defineProps<{ to?: string }>(), { to: '/' })
</script>

<style scoped>
.glass {
  background: rgba(255, 255, 255, 0.75);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(0, 0, 0, 0.08);
  box-shadow: 0 1px 3px rgba(0,0,0,0.06), 0 4px 12px rgba(0,0,0,0.04);
}
</style>
