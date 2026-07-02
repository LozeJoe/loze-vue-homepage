<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Save, ArrowLeft } from 'lucide-vue-next'
import RichEditor from '@/components/RichEditor.vue'
import { useStore } from 'vuex'
import { ElMessage } from 'element-plus'

const store = useStore()
const route = useRoute()
const router = useRouter()
const editId = route.params.id as string | undefined

const form = ref({ title: '', category: '', tagIds: [] as number[], description: '', coverImage: '', content: '', featured: false })
const loading = ref(false)
const saving = ref(false)

const categories = computed(() => store.state.categories.list)
const tags = computed(() => store.state.tags.list)

onMounted(async () => {
  store.dispatch('categories/fetchCategories'); store.dispatch('tags/fetchTags')
  if (editId) {
    loading.value = true
    try {
      const p = await store.dispatch('posts/fetchPost', editId)
      form.value = {
        title: p.title || '',
        category: p.categoryName || p.category || '',
        tagIds: Array.isArray(p.tags) ? p.tags.map((t: any) => t.id || t) : [],
        description: p.description || '',
        content: p.content || '',
        featured: p.featured || false,
        coverImage: p.coverImage || '',
      }
    } catch (e) { ElMessage.error('加载文章失败') }
    loading.value = false
  }
})

const save = async () => {
  if (!form.value.title.trim()) { ElMessage.warning('请输入标题'); return }
  saving.value = true
  try {
    const payload = {
      ...form.value,
      tagIds: form.value.tagIds,
    }
    if (editId) {
      await store.dispatch('posts/savePost', { ...payload, id: editId })
    } else {
      await store.dispatch('posts/savePost', payload)
    }
    ElMessage.success('保存成功')
    router.push('/admin/posts')
  } catch (e) {
    ElMessage.error('保存失败')
  } finally {
    saving.value = false
  }
}
</script>

<template>
  <div class="p-6 md:p-8 max-w-4xl">
    <div class="flex items-center gap-4 mb-8">
      <RouterLink to="/admin/posts" class="p-2 rounded-xl glass text-gray-400 hover:text-gray-600 transition-colors">
        <ArrowLeft :size="18" />
      </RouterLink>
      <div>
        <h1 class="text-2xl font-black text-gray-800">{{ editId ? '编辑文章' : '新建文章' }}</h1>
        <p class="text-sm text-gray-400 font-mono mt-1">{{ editId ? 'ID: ' + editId : '创建新内容' }}</p>
      </div>
      <el-button type="primary" :loading="saving" @click="save" class="!ml-auto">
        <Save :size="15" class="mr-1.5" />{{ saving ? '保存中...' : '保存' }}
      </el-button>
    </div>

    <div v-if="loading" class="text-center py-20 text-gray-400">加载中...</div>
    <div v-else class="space-y-5">
      <div>
        <label class="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">标题</label>
        <el-input v-model="form.title" placeholder="文章标题" size="large" />
      </div>
      <div class="grid grid-cols-2 gap-4">
        <div>
          <label class="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">分类</label>
          <el-select v-model="form.category" placeholder="选择分类" class="!w-full" clearable allow-create>
            <el-option v-for="c in categories" :key="c.id || c.name" :label="c.name" :value="c.name" />
          </el-select>
        </div>
        <div>
          <label class="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">标签</label>
          <el-select v-model="form.tagIds" multiple placeholder="选择标签" class="!w-full" clearable>
            <el-option v-for="t in tags" :key="t.id" :label="t.name" :value="t.id" />
          </el-select>
        </div>
      </div>
      <div>
        <label class="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">摘要</label>
        <el-input v-model="form.description" placeholder="简短描述..." />
      </div>
      <div>
        <el-checkbox v-model="form.featured">精选文章</el-checkbox>
      </div>
      <div>
        <label class="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">正文</label>
        <RichEditor v-model="form.content" />
      </div>
    </div>
  </div>
</template>
