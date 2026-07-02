<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

// Wave animation for text
const chars = 'LozeJoe'.split('')
const charStates = ref(chars.map((_, i) => ({ y: 0, delay: i * 0.08 })))
let waveRafId = 0

onMounted(() => {
  let frame = 0
  const wave = () => {
    frame++
    charStates.value.forEach((s, i) => {
      s.y = Math.sin(frame * 0.03 + i * 0.6) * 3.5
    })
    waveRafId = requestAnimationFrame(wave)
  }
  waveRafId = requestAnimationFrame(wave)
})

onUnmounted(() => {
  if (waveRafId) cancelAnimationFrame(waveRafId)
})
</script>

<template>
  <span class="text-4xl font-black tracking-tighter">
    <span v-for="(ch, i) in chars" :key="i"
          class="inline-block transition-colors duration-500"
          :class="i < 3 ? 'text-gray-800' : (i < 5 ? 'text-emerald-400' : 'text-cyan-400')"
          :style="{
            transform: `translateY(${charStates[i]?.y ?? 0}px)`,
            transition: 'transform 0.3s ease-out',
          }">
      {{ ch }}
    </span>
  </span>
</template>
