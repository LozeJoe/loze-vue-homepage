<script setup lang="ts">
import { ref, onMounted } from 'vue'
import api from '@/api/index'
import { Plus, Edit3, Trash2, Save, X } from 'lucide-vue-next'
import { ElMessage, ElMessageBox } from 'element-plus'

interface Memory { id?: number; title: string; cat: string; date: string; description: string }

const memories = ref<Memory[]>([])
const loading = ref(true)
const editingId = ref<number | null>(null)
const isNew = ref(false)
const editForm = ref<Memory>({ title: '', cat: '项目', date: '', description: '' })

const catOptions = ['项目', '学习']

async function load() {
  loading.value = true
  try {
    const res = await api.get('/admin/memories')
    memories.value = res.data.data || []
  } catch { memories.value = [] }
  loading.value = false
}

function startAdd() {
  editForm.value = { title: '', cat: '项目', date: new Date().toISOString().slice(0, 7), description: '' }
  isNew.value = true
  editingId.value = null
}

function startEdit(m: Memory) {
  editForm.value = { ...m }
  isNew.value = false
  editingId.value = m.id || null
}

function cancelEdit() { editingId.value = null; isNew.value = false }

async function saveEdit() {
  if (!editForm.value.title.trim() || !editForm.value.date.trim()) {
    ElMessage.warning('标题和日期必填'); return
  }
  try {
    if (isNew.value) {
      const res = await api.post('/admin/memories', editForm.value)
      memories.value.unshift(res.data.data)
      ElMessage.success('已添加')
    } else if (editingId.value) {
      await api.put(`/admin/memories/${editingId.value}`, editForm.value)
      const idx = memories.value.findIndex(m => m.id === editingId.value)
      if (idx >= 0) memories.value[idx] = { ...editForm.value, id: editingId.value }
      ElMessage.success('已保存')
    }
    editingId.value = null
    isNew.value = false
  } catch { ElMessage.error('操作失败') }
}

async function deleteMemory(m: Memory) {
  try {
    await ElMessageBox.confirm('确定删除这条记忆？', '确认删除', { type: 'warning' })
    await api.delete(`/admin/memories/${m.id}`)
    memories.value = memories.value.filter(item => item.id !== m.id)
    ElMessage.success('已删除')
  } catch (e: any) { if (e !== 'cancel' && e?.response) ElMessage.error('删除失败') }
}

onMounted(load)
</script>

<template>
  <div class="p-6 md:p-8">
    <div class="flex items-center justify-between mb-8">
      <div>
        <h1 class="text-2xl font-black text-gray-800">记忆管理</h1>
        <p class="text-sm text-gray-400 font-mono mt-1">{{ memories.length }} 条记忆 · 数据库存储</p>
      </div>
      <button @click="startAdd"
        class="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold text-white transition-all shadow-sm hover:shadow-md"
        style="background: linear-gradient(135deg, #10b981, #06b6d4);">
        <Plus :size="16" /> 添加记忆
      </button>
    </div>

    <!-- Edit Form -->
    <div v-if="editingId !== null || isNew" class="glass rounded-2xl p-6 mb-6 space-y-4">
      <h3 class="text-sm font-bold text-gray-700">{{ isNew ? '新增记忆' : '编辑记忆' }}</h3>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label class="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">标题</label>
          <el-input v-model="editForm.title" placeholder="记忆标题" maxlength="50" size="large" />
        </div>
        <div class="grid grid-cols-2 gap-3">
          <div>
            <label class="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">分类</label>
            <el-select v-model="editForm.cat" placeholder="选择分类" class="!w-full">
              <el-option
                v-for="c in catOptions"
                :key="c"
                :label="c"
                :value="c"
              />
            </el-select>
          </div>
          <div>
            <label class="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">日期</label>
            <el-input v-model="editForm.date" placeholder="如 2025-06" maxlength="7" />
          </div>
        </div>
      </div>
      <div>
        <label class="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">描述</label>
        <el-input v-model="editForm.description" placeholder="简短描述..." maxlength="200" />
      </div>
      <div class="flex gap-2 pt-2">
        <el-button type="success" @click="saveEdit" :icon="Save">
          保存
        </el-button>
        <el-button @click="cancelEdit" :icon="X">
          取消
        </el-button>
      </div>
    </div>

    <!-- Table -->
    <div class="glass rounded-2xl overflow-hidden">
      <table class="w-full text-sm">
        <thead>
          <tr class="border-b border-gray-100/50 text-left">
            <th class="px-5 py-3.5 text-xs font-semibold text-gray-400 uppercase tracking-wider">标题</th>
            <th class="px-5 py-3.5 text-xs font-semibold text-gray-400 uppercase tracking-wider w-20">分类</th>
            <th class="px-5 py-3.5 text-xs font-semibold text-gray-400 uppercase tracking-wider w-28">日期</th>
            <th class="px-5 py-3.5 text-xs font-semibold text-gray-400 uppercase tracking-wider">描述</th>
            <th class="px-5 py-3.5 text-xs font-semibold text-gray-400 uppercase tracking-wider w-24 text-right">操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="loading" class="border-b border-gray-100/30">
            <td colspan="5" class="px-5 py-16 text-center text-gray-400">
              <div class="w-6 h-6 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin mx-auto" />
            </td>
          </tr>
          <tr v-else-if="memories.length === 0" class="border-b border-gray-100/30">
            <td colspan="5" class="px-5 py-16 text-center text-gray-400">暂无记忆，点击上方按钮添加</td>
          </tr>
          <tr v-for="m in memories" :key="m.id"
            :class="['border-b border-gray-100/30 hover:bg-white/40 transition-colors', editingId === m.id ? 'bg-emerald-50/50' : '']">
            <td class="px-5 py-3.5 font-bold text-gray-800">{{ m.title }}</td>
            <td class="px-5 py-3.5">
              <span :class="['text-xs px-2 py-0.5 rounded-full font-medium', m.cat === '项目' ? 'bg-emerald-50 text-emerald-600' : 'bg-cyan-50 text-cyan-600']">
                {{ m.cat }}
              </span>
            </td>
            <td class="px-5 py-3.5 text-xs text-gray-400">{{ m.date }}</td>
            <td class="px-5 py-3.5 text-xs text-gray-400 line-clamp-1">{{ m.description }}</td>
            <td class="px-5 py-3.5 text-right">
              <div class="flex items-center justify-end gap-1.5">
                <button @click="startEdit(m)" title="编辑"
                  class="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-cyan-500 hover:bg-cyan-50 transition-all">
                  <Edit3 :size="14" />
                </button>
                <button @click="deleteMemory(m)" title="删除"
                  class="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all">
                  <Trash2 :size="14" />
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
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
