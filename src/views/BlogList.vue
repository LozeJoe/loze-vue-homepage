<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useStore } from 'vuex'
import { Search, ChevronDown, Check, Eye } from 'lucide-vue-next'
import { Swiper, SwiperSlide } from 'swiper/vue'
import { Autoplay, Pagination } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/pagination'
import FloatingBack from '@/components/FloatingBack.vue'
import SkeletonCard from '@/components/SkeletonCard.vue'
import BackToTop from '@/components/BackToTop.vue'
import SpotlightCard from '@/components/SpotlightCard.vue'
import { useReveal } from '@/composables/useReveal'

const store = useStore()

const currentPage = ref(1)
const pageSize = 6
const searchQuery = ref('')
const selectedCategory = ref('')
const selectedTag = ref('')
const showCategoryMenu = ref(false)
const menuRef = ref<HTMLElement | null>(null)

const posts = computed(() => store.state.posts?.list || [])
const categories = computed(() => store.state.categories?.list || [])
const tags = computed(() => store.state.tags?.list || [])
const loading = computed(() => store.state.posts?.loading ?? true)

const selectedCategoryLabel = computed(() => {
  if (!selectedCategory.value) return '全部分类'
  return selectedCategory.value
})

function selectCategory(name: string) {
  selectedCategory.value = selectedCategory.value === name ? '' : name
  showCategoryMenu.value = false
}

function toggleCategoryMenu() {
  showCategoryMenu.value = !showCategoryMenu.value
}

function onClickOutside(e: MouseEvent) {
  if (menuRef.value && !menuRef.value.contains(e.target as Node)) {
    showCategoryMenu.value = false
  }
}

const filteredPosts = computed(() => {
  let list = posts.value
  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase()
    list = list.filter((p) =>
      p.title?.toLowerCase().includes(q) ||
      p.summary?.toLowerCase().includes(q)
    )
  }
  if (selectedCategory.value) {
    list = list.filter((p) => String(p.category || p.categoryId) === selectedCategory.value)
  }
  if (selectedTag.value) {
    list = list.filter((p) => {
      const ts = p.tags || []
      return ts.includes(selectedTag.value)
    })
  }
  return list
})

const pagedPosts = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  return filteredPosts.value.slice(start, start + pageSize)
})

watch([searchQuery, selectedCategory, selectedTag], () => { currentPage.value = 1 })
watch(selectedCategory, () => { selectedTag.value = '' })

function toggleTag(tagName: string) {
  selectedTag.value = selectedTag.value === tagName ? '' : tagName
}

const featuredPosts = computed(() =>
  posts.value.filter((p: any) => p.cover).slice(0, 3)
)

onMounted(async () => {
  useReveal()
  document.addEventListener('click', onClickOutside)
  await Promise.all([
    store.dispatch('posts/fetchPosts'),
    store.dispatch('categories/fetchCategories'),
    store.dispatch('tags/fetchTags'),
  ])
})

onUnmounted(() => {
  document.removeEventListener('click', onClickOutside)
})
</script>

<template>
  <div class="min-h-screen w-full font-sans relative" style="background: linear-gradient(135deg, #f8fafc 0%, #f0fdf4 30%, #ecfeff 60%, #f5f3ff 100%);">
    <div class="absolute inset-0 pointer-events-none overflow-hidden" style="z-index:0">
      <div class="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full opacity-30"
           style="background: radial-gradient(circle, rgba(16,185,129,0.3) 0%, transparent 70%); animation: float 20s ease-in-out infinite;" />
      <div class="absolute -bottom-20 -left-20 w-[500px] h-[500px] rounded-full opacity-20"
           style="background: radial-gradient(circle, rgba(6,182,212,0.3) 0%, transparent 70%); animation: float 25s ease-in-out infinite reverse;" />
      <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] rounded-full opacity-10"
           style="background: radial-gradient(ellipse, rgba(139,92,246,0.2) 0%, transparent 70%); animation: float 30s ease-in-out infinite;" />
    </div>
    <div class="absolute inset-0 pointer-events-none opacity-[0.03]"
         style="background-image: radial-gradient(circle, #000 1px, transparent 1px); background-size: 30px 30px;" />
    <div class="relative z-10">
    <FloatingBack to="/" />

    <div class="max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-20">
      <div class="text-center mb-10 reveal">
        <h1 class="text-3xl md:text-4xl font-black text-gray-800 mb-2">博客</h1>
        <div class="w-16 h-1 bg-gradient-to-r from-emerald-400 to-cyan-400 rounded-full mx-auto mb-4" />
        <p class="text-gray-500 text-sm mb-6">技术文章 · 学习笔记 · 项目复盘</p>
      </div>

      <div v-if="featuredPosts.length" class="mb-12 reveal">
        <swiper
          :modules="[Autoplay, Pagination]"
          :slides-per-view="1"
          :space-between="20"
          :loop="true"
          :autoplay="{ delay: 4000, disableOnInteraction: false }"
          :pagination="{ clickable: true }"
          class="rounded-2xl overflow-hidden"
        >
          <swiper-slide v-for="post in featuredPosts" :key="post.id">
            <router-link :to="`/blog/${post.id}`" class="block relative h-56 md:h-72">
              <img :src="post.cover" class="w-full h-full object-cover" />
              <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-6">
                <div>
                  <h3 class="text-white font-bold text-xl mb-1">{{ post.title }}</h3>
                  <p class="text-white/70 text-sm line-clamp-1">{{ post.summary }}</p>
                </div>
              </div>
            </router-link>
          </swiper-slide>
        </swiper>
      </div>

      <div class="flex flex-col sm:flex-row gap-3 mb-6 reveal">
        <div class="flex-1 relative">
          <Search :size="16" class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            v-model="searchQuery"
            placeholder="搜索文章..."
            class="w-full pl-9 pr-4 py-2.5 rounded-xl bg-white/70 backdrop-blur-sm border border-gray-200 text-sm text-gray-700 placeholder-gray-400 transition-all duration-200 hover:border-emerald-200 focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/10"
          />
        </div>

        <div ref="menuRef" class="relative">
          <button
            @click="toggleCategoryMenu"
            class="flex items-center gap-2 w-full sm:w-40 pl-4 pr-3 py-2.5 rounded-xl bg-white/70 backdrop-blur-sm border text-sm transition-all duration-200 hover:border-emerald-300 hover:shadow-sm hover:shadow-emerald-100/50 focus:outline-none"
            :class="showCategoryMenu ? 'border-emerald-400 ring-2 ring-emerald-400/10' : 'border-gray-200'"
          >
            <span class="flex-1 text-left truncate" :class="selectedCategory ? 'text-emerald-600 font-medium' : 'text-gray-500'">
              {{ selectedCategoryLabel }}
            </span>
            <ChevronDown :size="14" class="text-gray-400 shrink-0 transition-transform duration-200" :class="{ 'rotate-180': showCategoryMenu }" />
          </button>

          <Transition name="dropdown">
            <div
              v-if="showCategoryMenu"
              class="absolute left-0 right-0 sm:w-44 mt-2 py-1.5 rounded-xl bg-white/95 backdrop-blur-xl border border-gray-100 shadow-lg shadow-gray-200/50 z-30 overflow-hidden"
            >
              <button
                @click="selectCategory('')"
                class="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm transition-colors hover:bg-emerald-50/80"
                :class="!selectedCategory ? 'text-emerald-600 font-medium bg-emerald-50/50' : 'text-gray-600'"
              >
                <Check v-if="!selectedCategory" :size="14" class="text-emerald-500 shrink-0" />
                <span v-else class="w-3.5 shrink-0" />
                全部分类
              </button>
              <div class="h-px bg-gray-50 mx-3 my-1" />
              <button
                v-for="c in categories"
                :key="c.id || c.name"
                @click="selectCategory(c.name)"
                class="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm transition-colors hover:bg-emerald-50/80"
                :class="selectedCategory === c.name ? 'text-emerald-600 font-medium bg-emerald-50/50' : 'text-gray-600'"
              >
                <Check v-if="selectedCategory === c.name" :size="14" class="text-emerald-500 shrink-0" />
                <span v-else class="w-3.5 shrink-0" />
                {{ c.name }}
              </button>
            </div>
          </Transition>
        </div>
      </div>

      <div class="mb-8">
        <div v-if="tags.length" class="flex flex-wrap gap-2 mt-4">
          <button
            v-for="tag in tags"
            :key="tag.id || tag.name"
            @click="toggleTag(String(tag.name || tag))"
            :class="[
              'px-3 py-1.5 rounded-full text-xs font-medium transition-all',
              selectedTag === String(tag.name || tag)
                ? 'bg-emerald-500 text-white shadow-md shadow-emerald-200'
                : 'bg-white/60 backdrop-blur border border-gray-200 text-gray-500 hover:border-emerald-300 hover:text-emerald-600'
            ]"
          >
            {{ tag.name || tag }}
          </button>
          <button
            v-if="selectedTag"
            @click="selectedTag = ''"
            class="px-3 py-1.5 rounded-full text-xs text-gray-400 hover:text-gray-600 bg-white/60 border border-gray-200 transition-all"
          >
            清除
          </button>
        </div>
      </div>

      <div v-if="loading" class="grid sm:grid-cols-2 gap-5 reveal">
        <SkeletonCard v-for="n in 6" :key="n" />
      </div>

      <div v-else class="grid sm:grid-cols-2 gap-5 reveal">
        <SpotlightCard
          v-for="post in pagedPosts"
          :key="post.id"
          class="bg-white/70 backdrop-blur border border-gray-100 rounded-2xl p-5 hover:shadow-lg hover:shadow-gray-100 transition-all duration-300"
        >
          <router-link :to="`/blog/${post.id}`" class="block">
            <img
              v-if="post.cover"
              :src="post.cover"
              class="w-full h-40 object-cover rounded-xl mb-4"
            />
            <span
              v-if="post.category"
              class="inline-block text-xs px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600 mb-2"
            >
              {{ post.category || '未分类' }}
            </span>
            <h3 class="text-base font-semibold text-gray-800 mb-2 line-clamp-2 hover:text-emerald-600 transition-colors">
              {{ post.title }}
            </h3>
            <p class="text-sm text-gray-400 line-clamp-2 mb-3">{{ post.summary || '' }}</p>
            <div class="flex items-center gap-3 text-xs text-gray-400">
              <span>{{ post.createdAt?.slice(0, 10) || '' }}</span>
              <span v-if="post.viewCount !== undefined" class="inline-flex items-center gap-1">
                <Eye :size="13" /> {{ post.viewCount }}
              </span>
              <span v-if="post.tags?.length" class="flex gap-1">
                <span v-for="t in post.tags.slice(0,2)" :key="t" class="text-emerald-500">#{{ t }}</span>
              </span>
            </div>
          </router-link>
        </SpotlightCard>
      </div>

      <div v-if="!loading && pagedPosts.length === 0" class="text-center py-20 reveal">
        <p class="text-gray-400 text-lg">暂无文章</p>
        <p class="text-gray-300 text-sm mt-2">换个关键词试试？</p>
      </div>

      <div v-if="filteredPosts.length > pageSize" class="flex justify-center mt-10 reveal">
        <el-pagination
          background
          layout="prev, pager, next"
          :total="filteredPosts.length"
          :page-size="pageSize"
          v-model:current-page="currentPage"
        />
      </div>
    </div>

    <BackToTop />
    </div>
</div>
</template>

<style scoped>
.dropdown-enter-active {
  transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
}
.dropdown-leave-active {
  transition: all 0.15s ease-in;
}
.dropdown-enter-from {
  opacity: 0;
  transform: translateY(-8px) scale(0.96);
}
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-4px) scale(0.98);
}
</style>

<style>
.el-pager li {
  background: rgba(255,255,255,0.5) !important;
  backdrop-filter: blur(12px);
  border-radius: 10px !important;
}
.el-pager li.is-active {
  background: linear-gradient(135deg, #10b981, #06b6d4) !important;
}
.el-pagination .btn-prev,
.el-pagination .btn-next {
  background: rgba(255,255,255,0.5) !important;
  backdrop-filter: blur(12px);
  border-radius: 12px !important;
}
</style>
