<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import { Plus, Search, Edit3, Trash2, Eye, EyeOff } from 'lucide-vue-next'
import { useStore } from 'vuex'
import { ElMessage, ElMessageBox } from 'element-plus'

const store = useStore()

const posts = computed(() => store.state.posts.list)
const total = computed(() => store.state.posts.total)
const loading = ref(false)
const keyword = ref('')
const page = ref(1)
const size = 10

const totalPages = computed(() => Math.max(1, Math.ceil(total.value / size)))

const fetchPosts = async () => {
  loading.value = true
  try { await store.dispatch('posts/fetchPosts', { keyword: keyword.value, page: page.value, size }) }
  catch (e) { console.error(e) }
  finally { loading.value = false }
}

const deletePost = async (id: string) => {
  try {
    await ElMessageBox.confirm('确定删除这篇文章？', '确认删除', { type: 'warning' })
    await store.dispatch('posts/deletePost', id)
    ElMessage.success('已删除')
    fetchPosts()
  } catch (e: any) { if (e !== 'cancel') ElMessage.error('删除失败') }
}

const togglePost = async (row: any) => {
  try {
    await store.dispatch('posts/togglePost', row.id)
    ElMessage.success(row.draft ? '已上架' : '已下架')
    fetchPosts()
  } catch (e) { ElMessage.error('操作失败') }
}

const formatDate = (d: string) => d ? new Date(d).toLocaleDateString('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit' }) : ''

onMounted(fetchPosts)
</script>

<template>
  <div class="p-6 md:p-8">
    <div class="flex items-center justify-between mb-8">
      <div>
        <h1 class="text-2xl font-black text-gray-800">文章管理</h1>
        <p class="text-sm text-gray-400 font-mono mt-1">共 {{ total }} 篇文章</p>
      </div>
      <RouterLink to="/admin/write"
        class="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold text-white transition-all shadow-sm hover:shadow-md"
        style="background: linear-gradient(135deg, #10b981, #06b6d4);">
        <Plus :size="16" /> 写文章
      </RouterLink>
    </div>

    <!-- Search -->
    <div class="flex gap-3 mb-6">
      <div class="flex-1 relative">
        <Search :size="15" class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
        <input v-model="keyword" @keyup.enter="page=1;fetchPosts()" placeholder="搜索文章..."
          class="w-full pl-11 pr-4 py-2.5 rounded-xl glass text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-400/20" />
      </div>
      <button @click="page=1;fetchPosts()"
        class="px-5 py-2.5 rounded-xl text-sm font-bold text-white transition-all shadow-sm hover:shadow-md"
        style="background: linear-gradient(135deg, #10b981, #06b6d4);">
        搜索
      </button>
    </div>

    <!-- Table -->
    <div class="glass rounded-2xl overflow-hidden">
      <table class="w-full text-sm">
        <thead>
          <tr class="border-b border-gray-100/50 text-left">
            <th class="px-5 py-3.5 text-xs font-semibold text-gray-400 uppercase tracking-wider">标题</th>
            <th class="px-5 py-3.5 text-xs font-semibold text-gray-400 uppercase tracking-wider w-24">分类</th>
            <th class="px-5 py-3.5 text-xs font-semibold text-gray-400 uppercase tracking-wider w-20">状态</th>
            <th class="px-5 py-3.5 text-xs font-semibold text-gray-400 uppercase tracking-wider w-28 hidden md:table-cell">日期</th>
            <th class="px-5 py-3.5 text-xs font-semibold text-gray-400 uppercase tracking-wider w-44 text-right">操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="loading" class="border-b border-gray-100/30">
            <td colspan="5" class="px-5 py-16 text-center text-gray-400">
              <div class="w-6 h-6 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin mx-auto" />
            </td>
          </tr>
          <tr v-else-if="posts.length === 0" class="border-b border-gray-100/30">
            <td colspan="5" class="px-5 py-16 text-center text-gray-400">暂无文章</td>
          </tr>
          <tr v-for="row in posts" :key="row.id" class="border-b border-gray-100/30 hover:bg-white/40 transition-colors">
            <td class="px-5 py-3.5">
              <div class="font-bold text-gray-800">{{ row.title }}</div>
              <div class="text-xs text-gray-400 mt-0.5 line-clamp-1">{{ row.description || row.summary }}</div>
            </td>
            <td class="px-5 py-3.5">
              <span class="text-xs px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600 font-medium">{{ row.categoryName || row.category || '未分类' }}</span>
            </td>
            <td class="px-5 py-3.5">
              <span :class="['text-xs px-2 py-0.5 rounded-full font-medium', row.draft ? 'bg-gray-100 text-gray-500' : 'bg-emerald-50 text-emerald-600']">
                {{ row.draft ? '草稿' : '已发布' }}
              </span>
            </td>
            <td class="px-5 py-3.5 hidden md:table-cell">
              <span class="text-xs text-gray-400">{{ formatDate(row.createdAt || row.date) }}</span>
            </td>
            <td class="px-5 py-3.5 text-right">
              <div class="flex items-center justify-end gap-1.5">
                <button @click="$router.push(`/blog/${row.id}`)" title="查看"
                  class="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-emerald-500 hover:bg-emerald-50 transition-all">
                  <Eye :size="15" />
                </button>
                <button @click="$router.push(`/admin/write/${row.id}`)" title="编辑"
                  class="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-cyan-500 hover:bg-cyan-50 transition-all">
                  <Edit3 :size="14" />
                </button>
                <button @click="togglePost(row)" :title="row.draft ? '上架' : '下架'"
                  class="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-amber-500 hover:bg-amber-50 transition-all">
                  <EyeOff v-if="!row.draft" :size="14" />
                  <Eye v-else :size="14" />
                </button>
                <button @click="deletePost(row.id)" title="删除"
                  class="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all">
                  <Trash2 :size="14" />
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- el-pagination -->
    <div v-if="totalPages > 1" class="flex justify-center pt-6">
      <el-pagination
        background
        layout="prev, pager, next"
        :total="total"
        :page-size="size"
        v-model:current-page="page"
        @current-change="fetchPosts"
      />
    </div>
  </div>
</template>

<style scoped>
.glass {
  background: rgba(255, 255, 255, 0.55);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.7);
}
</style>
