<script setup lang="ts">
import { ref, onMounted } from 'vue'
import api from '@/api'
import { Settings, Save, RefreshCw, Globe, Palette, FileText } from 'lucide-vue-next'
import { ElMessage } from 'element-plus'

const configs = ref<any[]>([])
const loading = ref(true)
const saving = ref<string | null>(null)
const editValues = ref<Record<number, string>>({})

const labelMap: Record<string, { label: string; icon: any }> = {
  site_title: { label: '网站标题', icon: Globe },
  site_description: { label: '网站描述', icon: FileText },
  bg_type: { label: '背景类型', icon: Palette },
  bg_color: { label: '背景颜色', icon: Palette },
  light_bg: { label: '浅色背景', icon: Palette },
}

const fetch = async () => {
  loading.value = true
  try {
    const res = await api.get('/admin/configs')
    configs.value = Array.isArray(res.data) ? res.data : []
  } catch { configs.value = [] }
  finally { loading.value = false }
}

const saveConfig = async (c: any) => {
  const val = editValues.value[c.id] ?? c.configValue
  saving.value = c.id
  try {
    await api.put(`/admin/configs/${c.id}`, { configValue: val })
    c.configValue = val
    ElMessage.success(`「${getLabel(c.configKey)}」已保存`)
  } catch { ElMessage.error('保存失败') }
  finally { saving.value = null }
}

const getLabel = (key: string) => labelMap[key]?.label || key
const getIcon = (key: string) => labelMap[key]?.icon || Settings
const getValue = (c: any) => editValues.value[c.id] ?? c.configValue

const onInput = (c: any, val: string) => {
  editValues.value[c.id] = val
}

onMounted(fetch)
</script>

<template>
  <div class="p-6 md:p-8">
    <div class="flex items-center justify-between mb-8">
      <div>
        <h1 class="text-2xl font-black text-gray-800 mb-1">站点设置</h1>
        <p class="text-sm text-gray-400 font-mono">共 {{ configs.length }} 项配置</p>
      </div>
      <button @click="fetch" :disabled="loading"
        class="flex items-center gap-1.5 px-4 py-2 rounded-xl glass text-sm text-gray-500 hover:text-emerald-600 transition-colors disabled:opacity-50">
        <RefreshCw :size="15" :class="{ 'animate-spin': loading }" /> 刷新
      </button>
    </div>

    <div v-if="loading" class="flex justify-center py-20">
      <RefreshCw class="w-8 h-8 animate-spin text-emerald-500" />
    </div>

    <div v-else class="space-y-3 max-w-2xl">
      <div v-for="c in configs" :key="c.id" class="glass rounded-xl p-4 flex items-center gap-4">
        <div class="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
             style="background: linear-gradient(135deg, rgba(16,185,129,0.15), rgba(6,182,212,0.15)); color: #059669;">
          <component :is="getIcon(c.configKey)" :size="16" />
        </div>
        <div class="flex-1 min-w-0">
          <label class="block text-xs font-semibold text-gray-400 mb-1">{{ getLabel(c.configKey) }}</label>
          <div class="flex items-center gap-2">
            <input
              :value="getValue(c)"
              @input="onInput(c, ($event.target as HTMLInputElement).value)"
              class="flex-1 px-3 py-1.5 rounded-lg border border-gray-200 bg-white/60 text-gray-700 text-sm focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 transition-all"
              :class="{ 'border-emerald-300 bg-emerald-50/30': editValues[c.id] !== undefined && editValues[c.id] !== c.configValue }" />
            <button @click="saveConfig(c)" :disabled="saving === c.id"
              class="p-1.5 rounded-lg transition-colors shrink-0"
              :class="(editValues[c.id] !== undefined && editValues[c.id] !== c.configValue)
                ? 'text-emerald-500 hover:bg-emerald-50'
                : 'text-gray-300'">
              <Save :size="16" :class="{ 'animate-pulse': saving === c.id }" />
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.glass {
  background: rgba(255, 255, 255, 0.65);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.8);
  box-shadow: 0 1px 3px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.03);
}
</style>
