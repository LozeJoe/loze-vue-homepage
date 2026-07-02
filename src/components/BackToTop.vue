<template>
  <Transition name="btn-fade">
    <button
      v-show="visible"
      @click="scrollTop"
      class="fixed bottom-6 right-6 z-40 w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 shadow-lg"
      :style="{
        background: 'linear-gradient(135deg, rgba(16,185,129,0.85), rgba(6,182,212,0.85))',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        border: '1px solid rgba(255,255,255,0.3)',
      }"
      title="回到顶部"
    >
      <svg
        width="18" height="18" viewBox="0 0 24 24" fill="none"
        stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"
      >
        <path d="M12 19V5" />
        <polyline points="5 12 12 5 19 12" />
      </svg>
    </button>
  </Transition>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const visible = ref(false)

function onScroll() {
  visible.value = window.scrollY > 400
}

function scrollTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

onMounted(() => window.addEventListener('scroll', onScroll, { passive: true }))
onUnmounted(() => window.removeEventListener('scroll', onScroll))
</script>

<style scoped>
.btn-fade-enter-active,
.btn-fade-leave-active {
  transition: opacity 0.25s ease, transform 0.25s ease;
}
.btn-fade-enter-from,
.btn-fade-leave-to {
  opacity: 0;
  transform: translateY(12px);
}
</style>
