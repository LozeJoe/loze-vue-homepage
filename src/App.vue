<template>
  <div class="min-h-screen" style="background: var(--bg)">
    <router-view v-slot="{ Component, route }">
      <component :is="Component" :key="route.fullPath" />
    </router-view>
  </div>
</template>
