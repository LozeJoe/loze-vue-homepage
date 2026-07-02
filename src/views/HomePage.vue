<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue'
import { RouterLink } from 'vue-router'
import { useReveal } from '@/composables/useReveal'
import SpotlightCard from '@/components/SpotlightCard.vue'
import AnimatedCharacters from '@/components/AnimatedCharacters.vue'
import CloudlingPet from '@/components/CloudlingPet.vue'
import {
  Github, ExternalLink, Server, Palette,
  Sparkles, Zap, Mail, BookOpen, Check, Copy, X,
  CakeSlice, Bot, Cpu, Layers, Link
} from 'lucide-vue-next'

const navLinks = [
  { to: '/blog', icon: BookOpen, color: 'text-emerald-500 bg-emerald-400/10 group-hover:bg-emerald-400/20', title: '文章', desc: '技术博客' },
  { to: '/memory', icon: Layers, color: 'text-cyan-500 bg-cyan-400/10 group-hover:bg-cyan-400/20', title: '记忆', desc: '照片·回忆' },
  { to: '/contact', icon: Mail, color: 'text-violet-500 bg-violet-400/10 group-hover:bg-violet-400/20', title: '联系', desc: '社交·留言' },
  { to: '/friends', icon: Link, color: 'text-indigo-500 bg-indigo-400/10 group-hover:bg-indigo-400/20', title: '友链', desc: '友情链接' },
]

const githubStats = ref({
  repos: 2,
  pinned: [
    { name: 'CakeShop', desc: 'JavaEE 蛋糕商城 - Spring + MyBatis 全栈项目', icon: CakeSlice, lang: 'Java', langColor: '#f89820' },
    { name: 'loze-ai-skills', desc: 'AI Agent 技能集合 - 118+ 技能 30 分类', icon: Bot, lang: 'Python', langColor: '#3572A5' },
  ] as { name: string; desc: string; icon: any; lang: string; langColor: string }[]
})

const skillCategories = [
  {
    title: '前端',
    icon: Palette,
    color: 'emerald',
    skills: ['Vue 3', 'TypeScript', 'Tailwind CSS', 'Vite', 'Element Plus', 'Swiper', 'WangEditor']
  },
  {
    title: '后端',
    icon: Server,
    color: 'cyan',
    skills: ['Spring Boot', 'Java', 'MyBatis Plus', 'MySQL', 'JWT', 'RESTful API']
  },
  {
    title: '工具 & AI',
    icon: Cpu,
    color: 'violet',
    skills: ['Git', 'Maven', 'Axios', 'Three.js', 'DOMPurify', 'Marked']
  },
]

const colorMap: Record<string, { bg: string; border: string; text: string; glow: string }> = {
  emerald:  { bg: 'bg-emerald-400/5',  border: 'border-emerald-400/20',  text: 'text-emerald-400',  glow: 'shadow-emerald-400/20' },
  cyan:     { bg: 'bg-cyan-400/5',     border: 'border-cyan-400/20',     text: 'text-cyan-400',     glow: 'shadow-cyan-400/20' },
  violet:   { bg: 'bg-violet-400/5',   border: 'border-violet-400/20',   text: 'text-violet-400',   glow: 'shadow-violet-400/20' },
}

const socials = [
  { name: 'GitHub',   icon: Github,     url: 'https://github.com/LozeJoe',     color: 'hover:text-gray-900 hover:bg-white/80' },
  { name: 'Email',    icon: Mail,       url: 'mailto:lozejoe@agent.qq.com',  color: 'hover:text-emerald-400 hover:bg-emerald-400/10' },
  { name: 'Blog',     icon: BookOpen,   url: '/blog',                           color: 'hover:text-cyan-400 hover:bg-cyan-400/10', internal: true },
]

const emailCopied = ref(false); const showEmail = ref(false); const emailAddr = 'lozejoe@agent.qq.com'
const copyEmail = async () => {
  try {
    await navigator.clipboard.writeText('lozejoe@agent.qq.com')
    emailCopied.value = true
    setTimeout(() => emailCopied.value = false, 2000)
  } catch {
    const ta = document.createElement('textarea')
    ta.value = 'lozejoe@agent.qq.com'
    document.body.appendChild(ta)
    ta.select()
    document.execCommand('copy')
    document.body.removeChild(ta)
    emailCopied.value = true
    setTimeout(() => emailCopied.value = false, 2000)
  }
}


// 留言板便利贴
const frameRef = ref<HTMLDivElement | null>(null)
const nameInputRef = ref<HTMLInputElement | null>(null)
const messages = ref<any[]>([])
const showingForm = ref(false)
const submitting = ref(false)
const formName = ref(''); const formMsg = ref('')
const detailMsg = ref<any>(null)
const clickPos = ref<{ x: number; y: number } | null>(null)
const noteColors = ['yellow','pink','blue','green','purple','orange']
const noteSizes = ['sm','md','md','lg']

async function loadMessages() {
  try {
    const res = await fetch('/api/stars'); const data = await res.json()
    const occupied: {x:number;y:number}[] = []
    messages.value = data.map((s: any, idx: number) => {
      const hash = s.id ? parseInt(s.id) || s.id.charCodeAt(0) : idx
      const ci = Math.abs(hash) % noteColors.length
      const si = 1  // fixed md size
      const rot = ((hash * 7) % 16) - 8
      let pos: {x:number;y:number}
      if (s.x != null && s.y != null && (s.x !== 0.5 || s.y !== 0.5)) {
        pos = { x: s.x * 100, y: s.y * 100 }
      } else {
        const seed = Math.abs(hash * 2654435761)
        pos = { x: 5 + (seed % 80), y: 4 + ((seed * 7) % 74) }
      }
      if (occupied.some(p => Math.hypot(p.x - pos.x, p.y - pos.y) < 10)) {
        const j = occupied.length * 7
        pos = { x: ((pos.x + j) % 86) + 5, y: ((pos.y + j * 1.7) % 76) + 4 }
      }
      occupied.push(pos)
      return { id: s.id, name: s.name, message: s.message||'', createdAt: s.createdAt,
        _x: pos.x, _y: pos.y, _r: rot, _color: noteColors[ci], _size: noteSizes[si] }
    })
  } catch { messages.value = [] }
}

function onFrameClick(e: MouseEvent) {
  const r = frameRef.value?.getBoundingClientRect()
  if (!r) return
  clickPos.value = { x: ((e.clientX - r.left) / r.width) * 100, y: ((e.clientY - r.top) / r.height) * 100 }
  openForm()
}
function openForm() { showingForm.value = true; formName.value = ''; formMsg.value = ''; nextTick(() => nameInputRef.value?.focus()) }

async function submitMsg() {
  if (!formName.value.trim() || submitting.value) return
  submitting.value = true
  try {
    const res = await fetch('/api/stars', { method: 'POST', headers: {'Content-Type':'application/json'},
      body: JSON.stringify({ name: formName.value.trim(), message: formMsg.value.trim(),
        x: clickPos.value ? clickPos.value.x/100 : 0.5, y: clickPos.value ? clickPos.value.y/100 : 0.5 }) })
    if (res.ok) {
      const c = await res.json(); const pos = clickPos.value || { x: 5+Math.random()*78, y: 4+Math.random()*72 }
      const hash = c.id ? parseInt(c.id)||c.id.charCodeAt(0) : Date.now()
      const m = { id: c.id, name: c.name, message: c.message||'?', createdAt: c.createdAt,
        _x: pos.x, _y: pos.y, _r: ((hash*7)%16)-8, _color: noteColors[Math.abs(hash)%noteColors.length],
        _size: 'md', _justAdded: true }
      messages.value.push(m); setTimeout(() => { const f = messages.value.find(x => x.id === c.id); if(f) f._justAdded = false }, 600)
    }
  } catch {}
  showingForm.value = false; submitting.value = false; formName.value = ''; formMsg.value = ''; clickPos.value = null
}

function msgFmt(iso: string) {
  if (!iso) return ''
  return new Date(iso).toLocaleDateString('zh-CN', { month:'2-digit', day:'2-digit', hour:'2-digit', minute:'2-digit' })
}

onMounted(() => { useReveal(); loadMessages();  })
</script>

<template>
  
<div class="min-h-screen w-full font-sans relative page-bg">
    <!-- Animated gradient orbs -->
    <div class="absolute inset-0 pointer-events-none overflow-hidden" style="z-index:0">
      <div class="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full opacity-30"
           style="background: radial-gradient(circle, rgba(16,185,129,0.3) 0%, transparent 70%); animation: float 20s ease-in-out infinite;" />
      <div class="absolute -bottom-20 -left-20 w-[500px] h-[500px] rounded-full opacity-20"
           style="background: radial-gradient(circle, rgba(6,182,212,0.3) 0%, transparent 70%); animation: float 25s ease-in-out infinite reverse;" />
      <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] rounded-full opacity-10"
           style="background: radial-gradient(ellipse, rgba(139,92,246,0.2) 0%, transparent 70%); animation: float 30s ease-in-out infinite;" />
    </div>

    <!-- Grid pattern -->
    <div class="absolute inset-0 pointer-events-none opacity-[0.03]"
         style="background-image: radial-gradient(circle, #000 1px, transparent 1px); background-size: 30px 30px;" />

    <div class="relative z-10 w-full max-w-[1400px] mx-auto p-4 md:p-6 flex flex-col lg:grid gap-4 md:gap-6 content-grid">

      <!-- LEFT SIDEBAR -->
      <aside class="w-full lg:w-[320px] shrink-0 reveal lg:sticky lg:top-6 lg:self-start">
        <!-- 名片 -->
        <div class="glass rounded-3xl p-6 md:p-8 flex flex-col items-center text-center">
          <div class="relative group mb-5">
            <div class="w-28 h-28 rounded-2xl overflow-hidden ring-2 ring-white/60 ring-offset-2 ring-offset-transparent shadow-lg shadow-emerald-400/10 group-hover:shadow-emerald-400/30 transition-shadow duration-500">
              <img src="/avatar.png" alt="LozeJoe" class="w-full h-full object-cover" />
            </div>
            <div class="absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-white shadow-sm"
                 style="background: linear-gradient(135deg, #10b981, #06b6d4)">
              <div class="w-full h-full rounded-full bg-white/30 animate-ping absolute inset-0" />
            </div>
          </div>
          <h1 class="text-2xl font-black mb-1 tracking-tight text-gray-800">LozeJoe</h1>
          <div class="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold mb-5 border"
               style="background: linear-gradient(135deg, rgba(16,185,129,0.08), rgba(6,182,212,0.08)); border-color: rgba(16,185,129,0.2); color: #059669;">
            <Sparkles :size="13" />全栈开发者
          </div>
          <p class="text-sm text-gray-500 leading-relaxed mb-6">
            Vue + Spring Boot 技术栈<br />
             热衷 AI 工具链与自动化
          </p>
          <div class="flex gap-2">
            <component
               v-for="s in socials.filter(x => x.name !== 'Email')" :key="s.name"
               :is="s.internal ? 'RouterLink' : 'a'"
               :href="s.internal ? undefined : s.url"
               :to="s.internal ? s.url : undefined"
               :target="s.internal ? undefined : '_blank'"
               :title="s.name"
               class="w-10 h-10 rounded-xl glass flex items-center justify-center transition-all duration-300 text-gray-400 hover:scale-110 hover:shadow-md"
               :class="s.color">
              <component :is="s.icon" :size="18" />
            </component>
            <button
               @click="showEmail = true"
               title="查看邮箱"
               class="w-10 h-10 rounded-xl glass flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-md hover:text-emerald-400 hover:bg-emerald-400/10">
              <Check v-if="emailCopied" :size="18" class="text-emerald-400" />
              <Mail v-else :size="18" class="text-gray-400" />
            </button>
          </div>
        </div>

        <!-- 导航网格：卡片式布局，类似名片风格 -->
        <div class="grid grid-cols-2 gap-2.5 mt-3">
          <RouterLink
            v-for="item in navLinks"
            :key="item.to"
            :to="item.to"
            class="glass rounded-2xl p-4 flex flex-col items-center text-center gap-1.5 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 group"
          >
            <div class="w-9 h-9 rounded-lg flex items-center justify-center transition-colors" :class="item.color">
              <component :is="item.icon" :size="16" />
            </div>
            <span class="text-xs font-semibold text-gray-700">{{ item.title }}</span>
            <span class="text-[10px] text-gray-400">{{ item.desc }}</span>
          </RouterLink>
        </div>
      </aside>

      <!-- RIGHT CONTENT -->
      <main class="flex-1 lg:overflow-y-auto pb-6 space-y-4 md:space-y-6">
        <!-- HERO -->
        <SpotlightCard class="reveal relative overflow-hidden rounded-3xl p-8 md:p-12 min-h-[260px] flex flex-col justify-end">
          <div class="absolute inset-0 rounded-3xl"
               style="background: linear-gradient(135deg, rgba(16,185,129,0.08) 0%, rgba(6,182,212,0.06) 50%, rgba(139,92,246,0.04) 100%);" />
          <div class="absolute top-6 left-6 z-20">
            <div class="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold border shadow-sm"
                 style="background: linear-gradient(135deg, rgba(16,185,129,0.1), rgba(6,182,212,0.1)); border-color: rgba(16,185,129,0.15); color: #059669;">
              <Zap :size="12" /> 构建未来
            </div>
          </div>
          <!-- Cloudling 桌宠 — 右上角 -->
          <div class="absolute top-0 right-0 z-20 cloudling-wrapper">
            <CloudlingPet />
          </div>

          <div class="relative z-20">
            <div class="mb-4">
              <span class="block text-3xl md:text-4xl mb-3 text-gray-500 font-semibold">你好，我是</span>
              <AnimatedCharacters />
            </div>
            <p class="text-lg text-gray-500 max-w-xl">
              Vue + Spring Boot · 构建有价值的应用
            </p>
          </div>
        </SpotlightCard>

        <!-- GITHUB PINS -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          <SpotlightCard v-for="repo in githubStats.pinned" :key="repo.name"
                         class="reveal glass rounded-2xl p-6 group cursor-pointer hover:shadow-lg transition-shadow duration-500">
            <a :href="`https://github.com/LozeJoe/${repo.name}`" target="_blank" class="block">
              <div class="flex items-start justify-between mb-4">
                <div class="w-10 h-10 rounded-xl flex items-center justify-center"
                     :style="{ background: `linear-gradient(135deg, ${repo.langColor}20, ${repo.langColor}08)`, color: repo.langColor }">
                  <component :is="repo.icon" :size="20" />
                </div>
                <ExternalLink :size="14" class="text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <h3 class="font-bold text-gray-800 mb-1.5">{{ repo.name }}</h3>
              <p class="text-sm text-gray-500 leading-relaxed mb-3">{{ repo.desc }}</p>
              <div class="flex items-center gap-2">
                <span class="w-2.5 h-2.5 rounded-full" :style="{ background: repo.langColor }" />
                <span class="text-xs text-gray-400 font-mono">{{ repo.lang }}</span>
              </div>
            </a>
          </SpotlightCard>
        </div>

        <!-- TECH STACK -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 reveal">
          <div v-for="cat in skillCategories" :key="cat.title"
               class="glass rounded-2xl p-6 hover:shadow-lg transition-shadow duration-500 group">
            <div class="flex items-center gap-3 mb-5">
              <div class="w-9 h-9 rounded-lg flex items-center justify-center"
                   :class="[colorMap[cat.color].bg, colorMap[cat.color].text]">
                <component :is="cat.icon" :size="18" />
              </div>
              <h3 class="font-bold text-gray-700 text-sm tracking-wide">{{ cat.title }}</h3>
            </div>
            <div class="flex flex-wrap gap-2">
              <span v-for="skill in cat.skills" :key="skill"
                    class="px-2.5 py-1 text-xs font-medium rounded-md border transition-all duration-300 text-gray-500 bg-white/40 border-gray-200/80 hover:border-gray-300 hover:text-gray-700 hover:shadow-sm">
                {{ skill }}
              </span>
            </div>
          </div>
        </div>


        <!-- MESSAGE BOARD -->
        <div class="reveal" style="animation-delay: 0.35s">
          <div class="glass rounded-3xl p-4 md:p-6">
            <div class="flex items-center justify-between mb-3">
              <div class="flex items-center gap-3">
                <div class="w-9 h-9 rounded-lg flex items-center justify-center bg-amber-400/10 text-amber-400">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="9" y1="9" x2="15" y2="9"/><line x1="9" y1="13" x2="15" y2="13"/><line x1="9" y1="17" x2="12" y2="17"/></svg>
                </div>
                <div>
                  <h3 class="font-bold text-gray-800 text-sm">留言板</h3>
                  <p class="text-xs text-gray-400 font-mono">{{ messages.length }} 条留言</p>
                </div>
              </div>
            </div>
            <div class="relative w-full rounded-2xl overflow-hidden board-frame" ref="frameRef" @click="onFrameClick">
              <div class="cork-bg"></div>
              <div v-if="messages.length === 0 && !showingForm" class="absolute inset-0 flex flex-col items-center justify-center z-10">
                <span class="text-2xl mb-2">📌</span>
                <p class="text-sm text-gray-400">想说什么，写一张便利贴吧</p>
              </div>
              <div v-for="m in messages" :key="m.id" class="sticky-note" :class="[m._color, 'md', { 'note-new': m._justAdded }]"
                   :style="{ left: m._x+'%', top: m._y+'%', transform: `rotate(${m._r||0}deg)` }" @click.stop="detailMsg = m">
                <div class="pin"></div><div class="note-lines"><div class="note-name">{{ m.name }}</div><div class="note-msg">{{ m.message || '✨' }}</div></div>
                <div class="tape tape-tl"></div>
              </div>
              <div v-if="showingForm" class="msg-form-card" @click.stop>
                <button class="msg-form-close" @click="showingForm = false">✕</button>
                <h3 class="msg-form-title">📝 写下留言</h3>
                <input v-model="formName" placeholder="你的名字" maxlength="20" class="msg-form-input" ref="nameInputRef" @keyup.enter="submitMsg" />
                <textarea v-model="formMsg" placeholder="想说的话..." maxlength="100" rows="3" class="msg-form-textarea" @keyup.enter.exact="submitMsg" />
                <div class="msg-form-footer"><span class="msg-form-count">{{ formMsg.length }}/100</span>
                  <button class="msg-form-submit" @click="submitMsg" :disabled="!formName.trim() || submitting">{{ submitting ? '...' : '贴上' }}</button></div>
              </div>
              <div v-if="detailMsg" class="msg-detail-overlay" @click.self="detailMsg = null">
                <div class="msg-detail-card">
                  <button class="msg-detail-close" @click="detailMsg = null">✕</button><div class="msg-detail-pin"></div>
                  <div class="msg-detail-avatar">{{ detailMsg.name.charAt(0) }}</div><div class="msg-detail-name">{{ detailMsg.name }}</div>
                  <p class="msg-detail-msg">「{{ detailMsg.message }}」</p>
                  <span class="msg-detail-time">{{ msgFmt(detailMsg.createdAt) }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <!-- FOOTER -->
        <footer class="py-10 flex justify-center border-t border-gray-200/50 reveal">
          <div class="flex items-center gap-4 text-sm text-gray-400 font-mono">
            <span>LozeJoe &copy; 2026</span>
            <span class="w-1 h-1 rounded-full bg-gray-300" />
            <span class="flex items-center gap-1.5">
              <span class="w-1.5 h-1.5 rounded-full animate-pulse" style="background: #10b981;" />
              
            </span>
          </div>
        </footer>
      </main>
    </div>
  </div>

  <!-- 邮箱弹窗 -->
  <Teleport to="body">
    <Transition name="qr-fade">
      <div
        v-if="showEmail"
        class="fixed inset-0 z-50 flex items-center justify-center p-4"
        @click.self="showEmail = false"
      >
        <div class="absolute inset-0 bg-black/30 backdrop-blur-sm" />
        <div class="relative bg-white/95 backdrop-blur-xl border border-emerald-100 rounded-2xl p-6 sm:p-8 shadow-xl shadow-emerald-500/10 max-w-sm w-full">
          <button
            @click="showEmail = false"
            class="absolute top-3 right-3 w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
          >
            <X :size="16" class="text-gray-500" />
          </button>
          <div class="text-center">
            <div class="w-16 h-1 bg-gradient-to-r from-emerald-400 to-cyan-400 rounded-full mx-auto mb-4" />
            <p class="text-gray-800 font-bold text-lg mb-1">邮箱地址</p>
            <p class="text-gray-400 text-xs mb-5">欢迎交流</p>
            <div class="bg-gray-50 rounded-xl px-4 py-3 mb-4 font-mono text-sm text-gray-700 break-all border border-gray-100">
              {{ emailAddr }}
            </div>
            <button
              @click="copyEmail"
              class="w-full py-2.5 rounded-xl bg-gradient-to-r from-emerald-400 to-cyan-400 text-white font-medium text-sm hover:shadow-lg hover:shadow-emerald-200 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
            >
              <Check v-if="emailCopied" :size="16" />
              <Copy v-else :size="16" />
              {{ emailCopied ? '已复制！' : '复制地址' }}
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
@media (min-width: 1024px) {
  .content-grid {
    grid-template-columns: 320px 1fr;
    align-items: start;
  }
  aside {
    position: sticky;
    top: 1.5rem;
  }
}


/* 留言板便利贴 */
.board-frame { height: 380px; border: 2px solid rgba(255,255,255,0.7); background: rgba(255,255,255,0.45); backdrop-filter: blur(8px); cursor: pointer; }
.cork-bg { position: absolute; inset: 0; opacity: 0.04; pointer-events: none;
  background: radial-gradient(circle at 20% 30%, #8b6914 1px, transparent 1px), radial-gradient(circle at 60% 70%, #8b6914 0.8px, transparent 0.8px), radial-gradient(circle at 80% 20%, #8b6914 1.2px, transparent 1.2px);
  background-size: 80px 80px, 100px 100px, 120px 120px; }
.sticky-note { position: absolute; z-index: 2; border-radius: 2px 2px 8px 2px;
  box-shadow: 2px 3px 8px rgba(0,0,0,0.1), 1px 1px 2px rgba(0,0,0,0.06);
  cursor: pointer; transition: transform 0.2s, box-shadow 0.2s; display: flex; flex-direction: column; align-items: center; }
.sticky-note::after { content: ''; position: absolute; bottom: 10px; left: 4px; right: 4px; height: 1px;
  background: repeating-linear-gradient(to bottom, transparent, transparent 17px, rgba(0,0,0,0.03) 17px, rgba(0,0,0,0.03) 18px); pointer-events: none; }
.sticky-note:hover { transform: scale(1.08) !important; box-shadow: 4px 6px 16px rgba(0,0,0,0.15); z-index: 20; }
.sticky-note.sm { width: 96px; padding: 24px 8px 10px; } .sm .note-name { font-size: 0.68rem; } .sm .note-msg { font-size: 0.63rem; }
.sticky-note.md { width: 114px; padding: 34px 10px 16px; } .md .note-name { font-size: 0.72rem; } .md .note-msg { font-size: 0.68rem; }
.sticky-note.lg { width: 132px; padding: 28px 12px 14px; } .lg .note-name { font-size: 0.76rem; } .lg .note-msg { font-size: 0.7rem; }
.pin { position: absolute; top: -4px; left: 50%; transform: translateX(-50%); width: 12px; height: 12px; border-radius: 50%;
  background: radial-gradient(circle at 35% 35%, #fbbf24, #d97706); box-shadow: 0 1px 3px rgba(0,0,0,0.2); z-index: 3; }
.pin::after { content: ''; position: absolute; top: 4px; left: 50%; transform: translateX(-50%); width: 3px; height: 3px; border-radius: 50%; background: rgba(255,255,255,0.6); }
.tape { position: absolute; width: 22px; height: 9px; opacity: 0.5; pointer-events: none; background: rgba(200,200,200,0.4); border-radius: 1px; }
.tape-tl { top: -2px; left: 8px; transform: rotate(-8deg); }
.sticky-note.yellow{background:#fef9c3}.yellow .pin{background:radial-gradient(circle at 35% 35%,#facc15,#ca8a04)}
.sticky-note.pink{background:#fce7f3}.pink .pin{background:radial-gradient(circle at 35% 35%,#f9a8d4,#db2777)}
.sticky-note.blue{background:#dbeafe}.blue .pin{background:radial-gradient(circle at 35% 35%,#93c5fd,#2563eb)}
.sticky-note.green{background:#d1fae5}.green .pin{background:radial-gradient(circle at 35% 35%,#6ee7b7,#059669)}
.sticky-note.purple{background:#ede9fe}.purple .pin{background:radial-gradient(circle at 35% 35%,#c4b5fd,#7c3aed)}
.sticky-note.orange{background:#ffedd5}.orange .pin{background:radial-gradient(circle at 35% 35%,#fdba74,#ea580c)}
.note-name{font-weight:700;color:#374151;text-align:center;margin-bottom:3px;line-height:1.3}
.note-msg{color:#6b7280;text-align:center;line-height:1.5;word-break:break-word;display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical;overflow:hidden}
.note-lines{position:relative;z-index:1;width:100%}
.note-new{animation:popIn .5s cubic-bezier(.34,1.56,.64,1)}@keyframes popIn{from{opacity:0;transform:scale(.2)!important}}
.msg-form-card{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);z-index:50;width:270px;max-width:90%;background:rgba(255,255,255,.95);backdrop-filter:blur(30px);-webkit-backdrop-filter:blur(30px);border:1px solid rgba(255,255,255,.9);border-radius:1.25rem;padding:1.25rem;box-shadow:0 12px 40px rgba(0,0,0,.1);animation:formIn .25s ease-out}@keyframes formIn{from{opacity:0;transform:translate(-50%,-50%) scale(.9)}}
.msg-form-close{position:absolute;top:.5rem;right:.75rem;background:none;border:none;font-size:1.1rem;color:#9ca3af;cursor:pointer}.msg-form-close:hover{color:#374151}
.msg-form-title{font-size:1rem;font-weight:700;color:#1f2937;text-align:center;margin:0 0 .75rem}
.msg-form-input,.msg-form-textarea{width:100%;padding:.5rem .65rem;border-radius:.65rem;font-size:.85rem;background:rgba(255,255,255,.6);border:1px solid rgba(0,0,0,.1);color:#374151;outline:none;transition:border-color .2s;margin-bottom:.5rem;font-family:inherit;resize:none;box-sizing:border-box}
.msg-form-input:focus,.msg-form-textarea:focus{border-color:#10b981;box-shadow:0 0 0 3px rgba(16,185,129,.08)}
.msg-form-input::placeholder,.msg-form-textarea::placeholder{color:#9ca3af}
.msg-form-footer{display:flex;align-items:center;justify-content:space-between;margin-top:.25rem}
.msg-form-count{font-size:.7rem;color:#9ca3af}
.msg-form-submit{padding:.45rem 1.25rem;border-radius:.65rem;font-size:.85rem;font-weight:700;color:#fff;background:linear-gradient(135deg,#10b981,#06b6d4);border:none;cursor:pointer;box-shadow:0 2px 6px rgba(16,185,129,.2)}.msg-form-submit:hover:not(:disabled){opacity:.9}.msg-form-submit:disabled{opacity:.4;cursor:not-allowed}
.msg-detail-overlay{position:absolute;inset:0;z-index:60;background:rgba(0,0,0,.06);backdrop-filter:blur(2px);display:flex;align-items:center;justify-content:center;animation:fadeIn .2s}@keyframes fadeIn{from{opacity:0}}
.msg-detail-card{background:#fef9c3;border-radius:2px 2px 12px 2px;padding:1.75rem 1.25rem 1.25rem;text-align:center;max-width:250px;width:90%;box-shadow:3px 4px 12px rgba(0,0,0,.12);position:relative;animation:popIn .3s cubic-bezier(.34,1.56,.64,1)}
.msg-detail-pin{position:absolute;top:-4px;left:50%;transform:translateX(-50%);width:14px;height:14px;border-radius:50%;background:radial-gradient(circle at 35% 35%,#fbbf24,#d97706);box-shadow:0 1px 4px rgba(0,0,0,.2)}.msg-detail-pin::after{content:'';position:absolute;top:5px;left:50%;transform:translateX(-50%);width:4px;height:4px;border-radius:50%;background:rgba(255,255,255,.5)}
.msg-detail-close{position:absolute;top:.5rem;right:.7rem;background:none;border:none;font-size:.9rem;color:#9ca3af;cursor:pointer;z-index:2}.msg-detail-close:hover{color:#374151}
.msg-detail-avatar{width:48px;height:48px;border-radius:50%;background:linear-gradient(135deg,#10b981,#06b6d4);color:#fff;font-size:1.2rem;font-weight:700;display:flex;align-items:center;justify-content:center;margin:0 auto .6rem}
.msg-detail-name{font-size:1.05rem;font-weight:700;color:#1f2937;margin-bottom:.4rem}
.msg-detail-msg{font-size:.9rem;color:#6b7280;line-height:1.6;margin:0 0 .6rem}
.msg-detail-time{font-size:.7rem;color:#9ca3af}
.qr-fade-enter-active { transition: all 0.25s ease-out; }
.qr-fade-leave-active { transition: all 0.2s ease-in; }
.cloudling-wrapper {
  width: 400px;
  height: 330px;
  opacity: 0.85;
  transition: opacity 0.3s;
}
.cloudling-wrapper:hover {
  opacity: 1;
}
.qr-fade-enter-from { opacity: 0; }
.cloudling-wrapper {
  width: 400px;
  height: 330px;
  opacity: 0.85;
  transition: opacity 0.3s;
}
.cloudling-wrapper:hover {
  opacity: 1;
}
.qr-fade-enter-from > div:last-child { transform: scale(0.95); opacity: 0; }
.qr-fade-leave-to { opacity: 0; }
.qr-fade-leave-to > div:last-child { transform: scale(0.95); opacity: 0; }
</style>
