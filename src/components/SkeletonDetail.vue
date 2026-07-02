<template>
  <div class="max-w-3xl mx-auto px-4 py-12 sm:py-20 space-y-6">
    <!-- 封面占位 -->
    <div class="skeleton w-full h-64 sm:h-96 rounded-2xl" />
    <!-- 标题 -->
    <div class="skeleton w-4/5 h-8 rounded-lg" />
    <div class="skeleton w-3/5 h-8 rounded-lg" />
    <!-- 元信息行 -->
    <div class="flex gap-4">
      <div class="skeleton w-24 h-4 rounded-md" />
      <div class="skeleton w-16 h-4 rounded-md" />
      <div class="skeleton w-20 h-4 rounded-md" />
    </div>
    <div class="border-t border-gray-100 pt-6 space-y-3">
      <!-- 正文骨架行 -->
      <div class="skeleton w-full h-4 rounded-md" />
      <div class="skeleton w-full h-4 rounded-md" />
      <div class="skeleton w-11/12 h-4 rounded-md" />
      <div class="skeleton w-full h-4 rounded-md" />
      <div class="skeleton w-4/5 h-4 rounded-md" />
      <div class="skeleton w-full h-4 rounded-md" />
      <div class="skeleton w-3/4 h-4 rounded-md" />
      <div class="skeleton w-full h-4 rounded-md" />
      <div class="skeleton w-5/6 h-4 rounded-md" />
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
</style>
