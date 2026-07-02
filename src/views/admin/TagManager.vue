<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { Plus, Trash2 } from 'lucide-vue-next'
import { useStore } from 'vuex'
import { ElMessage, ElMessageBox } from 'element-plus'

const store = useStore()
const tags = computed(() => store.state.tags.list)
const newName = ref('')

const fetch = async () => { await store.dispatch('tags/fetchTags') }

const create = async () => {
  if (!newName.value.trim()) return
  try {
    await store.dispatch('tags/createTag', newName.value.trim())
    newName.value = ''
    ElMessage.success('创建成功')
  } catch (e) { ElMessage.error('创建失败') }
}

const remove = async (id: string) => {
  try {
    await ElMessageBox.confirm('确定删除？', '确认删除', { type: 'warning' })
    await store.dispatch('tags/deleteTag', id)
    ElMessage.success('已删除')
  } catch (e: any) { if (e !== 'cancel') ElMessage.error('删除失败') }
}

onMounted(fetch)
</script>

<template>
  <div class="p-6 md:p-8 max-w-2xl">
    <div class="mb-8">
      <h1 class="text-2xl font-black text-gray-800">标签管理</h1>
      <p class="text-sm text-gray-400 font-mono mt-1">共 {{ tags.length }} 个标签</p>
    </div>

    <div class="flex gap-3 mb-6">
      <el-input v-model="newName" placeholder="新标签名称" @keyup.enter="create" class="!flex-1" />
      <el-button type="primary" @click="create"><Plus :size="15" class="mr-1" />添加</el-button>
    </div>

    <div class="glass rounded-2xl overflow-hidden">
      <div v-if="tags.length === 0" class="p-12 text-center text-gray-400">暂无标签</div>
      <div v-for="tag in tags" :key="tag.id"
        class="flex items-center justify-between px-5 py-3 border-b border-black/5 last:border-b-0 hover:bg-white/30 transition-colors">
        <el-tag size="small">{{ tag.name }}</el-tag>
        <button @click="remove(tag.id)" class="p-2 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors">
          <Trash2 :size="14" />
        </button>
      </div>
    </div>
  </div>
</template>