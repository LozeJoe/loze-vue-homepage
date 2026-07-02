<script setup lang="ts">
import { ref } from 'vue'
import { RouterLink, RouterView, useRoute, useRouter } from 'vue-router'
import {
  LayoutDashboard, FileText, FolderOpen, Tags, MessageSquare, Mail,
  LogOut, Home, Menu, X, Sparkles, Link, Settings, Layers
} from 'lucide-vue-next'

const route = useRoute()
const router = useRouter()
const collapsed = ref(false)

const menuItems = [
  { path: '/admin', icon: LayoutDashboard, label: '仪表盘', exact: true },
  { path: '/admin/posts', icon: FileText, label: '文章' },
  { path: '/admin/write', icon: Sparkles, label: '写' },
  { path: '/admin/categories', icon: FolderOpen, label: '分类' },
  { path: '/admin/tags', icon: Tags, label: '标签' },
  { path: '/admin/memories', icon: Layers, label: '记忆' },
  { path: '/admin/comments', icon: MessageSquare, label: '评论' },
  { path: '/admin/contacts', icon: Mail, label: '留言' },
  { path: '/admin/stars', icon: Sparkles, label: '便签' },
  { path: '/admin/friends', icon: Link, label: '友链' },
  { path: '/admin/configs', icon: Settings, label: '设置' },
]

const isActive = (path: string, exact = false) => {
  if (exact) return route.path === path
  return route.path.startsWith(path)
}

const logout = () => {
  localStorage.removeItem('token')
  router.push('/admin/login')
}
</script>

<template>
  <div class="h-screen flex overflow-hidden" style="background: linear-gradient(135deg, #f8fafc 0%, #f0fdf4 30%, #ecfeff 60%, #f5f3ff 100%);">
    <!-- Sidebar -->
    <aside :class="['glass border-r border-white/60 flex flex-col transition-all duration-300 shrink z-20', collapsed ? 'w-[70px]' : 'w-[240px]']">
      <!-- Logo bar: centered when collapsed, space-between when expanded -->
      <div :class="['h-16 flex items-center border-b border-black/5 transition-all shrink-0',
        collapsed ? 'justify-center gap-1' : 'justify-between px-5']">
        <div class="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
             style="background: linear-gradient(135deg, rgba(16,185,129,0.2), rgba(6,182,212,0.2)); color: #059669;">
          <Sparkles :size="18" />
        </div>
        <transition name="fade-fast">
          <span v-if="!collapsed" class="font-black text-gray-800 text-sm whitespace-nowrap">LOZE 后台</span>
        </transition>
        <button @click="collapsed = !collapsed"
          class="p-1.5 rounded-lg hover:bg-black/5 text-gray-400 transition-colors shrink-0"
          :title="collapsed ? '展开' : '收起'">
          <Menu v-if="collapsed" :size="16" />
          <X v-else :size="16" />
        </button>
      </div>

      <!-- Menu -->
      <nav class="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
        <RouterLink v-for="item in menuItems" :key="item.path" :to="item.path"
          class="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 group"
          :class="isActive(item.path, item.exact) ? 'bg-white/80 shadow-sm text-gray-800' : 'text-gray-500 hover:text-gray-700 hover:bg-white/40'">
          <component :is="item.icon" :size="18" class="shrink-0" />
          <transition name="fade-fast">
            <span v-if="!collapsed" class="whitespace-nowrap">{{ item.label }}</span>
          </transition>
        </RouterLink>
      </nav>

      <!-- Footer -->
      <div class="p-3 border-t border-black/5 space-y-1">
        <a href="/" target="_blank" class="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-400 hover:text-gray-600 hover:bg-white/40 transition-all"><Home :size="18" class="shrink-0" /><transition name="fade-fast"><span v-if="!collapsed">查看站点</span></transition></a>
        <button @click="logout"
          class="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-400 hover:text-red-500 hover:bg-red-50 w-full transition-all">
          <LogOut :size="18" class="shrink-0" />
          <transition name="fade-fast"><span v-if="!collapsed">退出登录</span></transition>
        </button>
      </div>
    </aside>

    <!-- Content -->
    <main class="flex-1 overflow-y-auto">
      <RouterView />
    </main>
  </div>
</template>

<style scoped>
.glass {
  background: rgba(255, 255, 255, 0.6);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
}
.fade-fast-enter-active, .fade-fast-leave-active { transition: opacity 0.15s; }
.fade-fast-enter-from, .fade-fast-leave-to { opacity: 0; }
</style>
