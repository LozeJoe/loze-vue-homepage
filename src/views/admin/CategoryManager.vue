<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { Plus, Trash2, Edit3, Check, X } from 'lucide-vue-next'
import { useStore } from 'vuex'
import { ElMessage, ElMessageBox } from 'element-plus'

const store = useStore()
const categories = computed(() => store.state.categories.list)
const newName = ref('')
const editing = ref<{ id: string, name: string } | null>(null)

const fetch = async () => { await store.dispatch('categories/fetchCategories') }

const create = async () => {
  if (!newName.value.trim()) return
  try {
    await store.dispatch('categories/createCategory', newName.value.trim())
    newName.value = ''
    ElMessage.success('创建成功')
  } catch (e) { ElMessage.error('创建失败') }
}

const startEdit = (item: any) => { editing.value = { id: item.id, name: item.name } }
const cancelEdit = () => { editing.value = null }

const saveEdit = async () => {
  if (!editing.value) return
  try {
    await store.dispatch('categories/updateCategory', editing.value)
    editing.value = null
    ElMessage.success('已更新')
  } catch (e) { ElMessage.error('更新失败') }
}

const remove = async (id: string) => {
  try {
    await ElMessageBox.confirm('确定删除？', '确认删除', { type: 'warning' })
    await store.dispatch('categories/deleteCategory', id)
    ElMessage.success('已删除')
  } catch (e: any) { if (e !== 'cancel') ElMessage.error('删除失败') }
}

onMounted(fetch)
</script>

<template>
  <div class="p-6 md:p-8 max-w-2xl">
    <div class="mb-8">
      <h1 class="text-2xl font-black text-gray-800">分类管理</h1>
      <p class="text-sm text-gray-400 font-mono mt-1">共 {{ categories.length }} 个分类</p>
    </div>

    <!-- Add -->
    <div class="flex gap-3 mb-6">
      <el-input v-model="newName" placeholder="新分类名称" @keyup.enter="create" class="!flex-1" />
      <el-button type="primary" @click="create"><Plus :size="15" class="mr-1" />添加</el-button>
    </div>

    <!-- List -->
    <div class="glass rounded-2xl overflow-hidden">
      <div v-if="categories.length === 0" class="p-12 text-center text-gray-400">暂无分类</div>
      <div v-for="cat in categories" :key="cat.id"
        class="flex items-center justify-between px-5 py-3 border-b border-black/5 last:border-b-0 hover:bg-white/30 transition-colors">
        <template v-if="editing?.id === cat.id">
          <el-input v-model="editing.name" size="small" class="!flex-1 !mr-2" @keyup.enter="saveEdit" />
          <el-button size="small" type="primary" @click="saveEdit"><Check :size="14" /></el-button>
          <el-button size="small" @click="cancelEdit"><X :size="14" /></el-button>
        </template>
        <template v-else>
          <span class="font-bold text-gray-700 text-sm">{{ cat.name }}</span>
          <div class="flex gap-1">
            <button @click="startEdit(cat)" class="p-2 rounded-lg text-gray-400 hover:text-emerald-500 hover:bg-emerald-50 transition-colors">
              <Edit3 :size="14" />
            </button>
            <button @click="remove(cat.id)" class="p-2 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors">
              <Trash2 :size="14" />
            </button>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>