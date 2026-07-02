<template>
  <div
    ref="cardRef"
    class="relative rounded-3xl border border-white/10 bg-white/5 overflow-hidden transition-all duration-300 hover:border-white/20"
    :class="className"
    @mousemove="handleMouseMove"
    @mouseenter="opacity = 1"
    @mouseleave="opacity = 0"
    @click="$emit('click')"
  >
    <div
      class="pointer-events-none absolute -inset-px transition duration-300"
      :style="{
        opacity,
        background: `radial-gradient(600px circle at ${position.x}px ${position.y}px, rgba(255,255,255,.15), transparent 40%)`
      }"
    />
    <slot />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'

defineProps<{ className?: string }>()
defineEmits(['click'])

const cardRef = ref<HTMLElement>()
const opacity = ref(0)
const position = reactive({ x: 0, y: 0 })

function handleMouseMove(e: MouseEvent) {
  if (!cardRef.value) return
  const rect = cardRef.value.getBoundingClientRect()
  position.x = e.clientX - rect.left
  position.y = e.clientY - rect.top
}
</script>
