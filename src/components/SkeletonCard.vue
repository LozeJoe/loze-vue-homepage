<template>
  <div class="glass-card rounded-2xl p-5 space-y-3 overflow-hidden">
    <!-- 封面占位 -->
    <div class="skeleton w-full h-40 rounded-xl" />
    <!-- 标题 -->
    <div class="skeleton w-3/4 h-5 rounded-lg" />
    <!-- 摘要两行 -->
    <div class="skeleton w-full h-3 rounded-md" />
    <div class="skeleton w-2/3 h-3 rounded-md" />
    <!-- 底部标签 -->
    <div class="flex gap-2 pt-1">
      <div class="skeleton w-12 h-5 rounded-full" />
      <div class="skeleton w-16 h-5 rounded-full" />
    </div>
  </div>
</template>

<style scoped>
.skeleton {
  background: linear-gradient(90deg,
    rgba(0,0,0,0.04) 25%,
    rgba(0,0,0,0.07) 50%,
    rgba(0,0,0,0.04) 75%
  );
  background-size: 200% 100%;
  animation: shimmer 1.8s ease-in-out infinite;
}

@keyframes shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

.glass-card {
  background: rgba(255,255,255,0.5);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(255,255,255,0.6);
}
</style>
