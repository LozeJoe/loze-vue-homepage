<template>
  <div class="rich-editor-wrapper">
    <div class="editor-toolbar" ref="toolbarRef" />
    <div class="editor-body" ref="editorRef" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch, nextTick } from 'vue'
import { createEditor } from '@wangeditor/editor'
import '@wangeditor/editor/dist/css/style.css'

interface Props { modelValue: string }
interface Emits { (e: 'update:modelValue', val: string): void }

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const toolbarRef = ref<HTMLDivElement>()
const editorRef = ref<HTMLDivElement>()
let editor: any = null

onMounted(async () => {
  await nextTick()

  editor = createEditor({
    selector: editorRef.value!,
    html: props.modelValue || '',
    config: {
      placeholder: '写点什么吧...支持 Markdown 格式',
      MENU_CONF: {},
    },
    mode: 'default',
  })

  // Listen for content changes ?sync to v-model
  editor.on('change', () => {
    emit('update:modelValue', editor.getHtml())
  })

  // Mount toolbar
  if (toolbarRef.value) {
    // WangEditor requires the toolbar to be created via createToolbar
    // But we can inject the toolbar DOM manually
    const toolbar = editor.getToolbar()
    if (toolbar) {
      toolbarRef.value.appendChild(toolbar.getConfig().selector
        ? document.querySelector(toolbar.getConfig().selector) || toolbarRef.value
        : toolbarRef.value)
    }
  }
})

onBeforeUnmount(() => {
  if (editor) {
    editor.destroy()
    editor = null
  }
})

// Watch external modelValue changes ?set editor content
watch(() => props.modelValue, (val) => {
  if (editor && val !== editor.getHtml()) {
    editor.setHtml(val)
  }
})
</script>

<style scoped>
.rich-editor-wrapper {
  border-radius: 0.75rem;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.65);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.8);
  box-shadow: 0 1px 3px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.03);
  transition: box-shadow 0.2s;
}
.rich-editor-wrapper:focus-within {
  box-shadow: 0 0 0 2px rgba(16,185,129,0.2), 0 1px 3px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.03);
}
.editor-toolbar {
  border-bottom: 1px solid rgba(0,0,0,0.06);
}
.editor-body {
  min-height: 360px;
}

/* ── Glass-skin overrides for WangEditor internal styles ── */
:deep(.w-e-toolbar) {
  background: rgba(255,255,255,0.3) !important;
  border: none !important;
}
:deep(.w-e-toolbar .w-e-bar-item button:hover) {
  background: rgba(16,185,129,0.1) !important;
}
:deep(.w-e-toolbar .w-e-bar-item button.active) {
  background: rgba(16,185,129,0.08) !important;
  color: #10b981 !important;
}
:deep(.w-e-text-container) {
  background: transparent !important;
  border: none !important;
}
:deep(.w-e-text-container [data-slate-editor]) {
  padding: 1rem 1.25rem;
  min-height: 340px;
  font-size: 0.9375rem;
  color: #374151;
  line-height: 1.75;
}
:deep(.w-e-text-container [data-slate-editor]:focus) {
  outline: none;
}
:deep(.w-e-text-placeholder) {
  padding: 1rem 1.25rem;
  color: #9ca3af;
  font-style: normal;
  font-size: 0.9375rem;
}
:deep(.w-e-bar) {
  background: transparent !important;
}
:deep(.w-e-bar-item) {
  padding: 0 !important;
}
:deep(.w-e-bar-item button) {
  color: #6b7280 !important;
  font-size: 0.8125rem;
  padding: 6px 10px !important;
  border-radius: 6px !important;
  transition: all 0.15s;
}
</style>
