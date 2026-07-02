<script setup lang="ts">
import { ref, onMounted } from 'vue'
import axios from 'axios'
import FloatingBack from '@/components/FloatingBack.vue'
import { useReveal } from '@/composables/useReveal'
import { Github, Mail, QrCode, Send, User, AtSign, MessageSquare, CheckCircle, Loader2, X, Copy, Check } from 'lucide-vue-next'

const form = ref({ name: '', email: '', message: '' })
const sending = ref(false)
const sent = ref(false)
const showQR = ref(false)
const showEmail = ref(false)
const emailCopied = ref(false)

const emailAddr = 'lozejoe@agent.qq.com'

const copyEmail = async () => {
  try {
    await navigator.clipboard.writeText(emailAddr)
    emailCopied.value = true
    setTimeout(() => emailCopied.value = false, 2000)
  } catch {
    // fallback
    const ta = document.createElement('textarea')
    ta.value = emailAddr
    document.body.appendChild(ta)
    ta.select()
    document.execCommand('copy')
    document.body.removeChild(ta)
    emailCopied.value = true
    setTimeout(() => emailCopied.value = false, 2000)
  }
}

const submit = async () => {
  if (!form.value.name || !form.value.email || !form.value.message) return
  sending.value = true
  try {
    await axios.post('/api/contact', {
      name: form.value.name,
      email: form.value.email,
      message: form.value.message
    })
    sent.value = true
    form.value = { name: '', email: '', message: '' }
    setTimeout(() => sent.value = false, 4000)
  } catch (e) {
    console.error('提交失败:', e)
    alert('提交失败，请稍后再试')
  } finally {
    sending.value = false
  }
}

onMounted(() => useReveal())
</script>

<template>
  <div class="min-h-screen w-full font-sans relative" style="background: linear-gradient(135deg, #f8fafc 0%, #f0fdf4 30%, #ecfeff 60%, #f5f3ff 100%);">
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
    <div class="relative z-10">
    <FloatingBack to="/" />

    <div class="max-w-5xl mx-auto px-4 sm:px-6 py-12 sm:py-20">
      <!-- Header -->
      <div class="text-center mb-12 reveal">
        <h1 class="text-4xl md:text-5xl font-black text-gray-800 mb-3">联系我</h1>
        <div class="w-20 h-1 bg-gradient-to-r from-emerald-400 to-cyan-400 rounded-full mx-auto mb-6" />
        <p class="text-gray-500 text-lg">Contact · 想法与反馈</p>
      </div>

      <div class="grid lg:grid-cols-5 gap-8">
        <!-- 社交媒体 -->
        <div class="lg:col-span-2 space-y-4 reveal">
          <!-- GitHub -->
          <a
            href="https://github.com/LozeJoe"
            target="_blank"
            class="flex items-center gap-4 p-4 rounded-2xl border-2 border-transparent bg-white/60 backdrop-blur transition-all duration-300 hover:border-gray-400 hover:text-gray-800"
          >
            <div class="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center">
              <Github :size="20" />
            </div>
            <div>
              <p class="font-semibold text-gray-800 text-sm">GitHub</p>
              <p class="text-xs text-gray-400">LozeJoe</p>
            </div>
          </a>
          <!-- Email 按钮 -->
          <button
            @click="showEmail = true"
            class="w-full flex items-center gap-4 p-4 rounded-2xl border-2 border-transparent bg-white/60 backdrop-blur transition-all duration-300 text-left hover:border-emerald-400 hover:text-emerald-600"
          >
            <div class="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center">
              <Mail :size="20" />
            </div>
            <div>
              <p class="font-semibold text-gray-800 text-sm">邮箱</p>
              <p class="text-xs text-gray-400">{{ emailAddr }}</p>
            </div>
          </button>
          <!-- QQ 二维码卡片 -->
          <button
            @click="showQR = true"
            class="w-full flex items-center gap-4 p-4 rounded-2xl border-2 border-transparent bg-white/60 backdrop-blur transition-all duration-300 text-left hover:border-green-400 hover:text-green-600"
          >
            <div class="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center">
              <QrCode :size="20" />
            </div>
            <div>
              <p class="font-semibold text-gray-800 text-sm">QQ</p>
              <p class="text-xs text-gray-400">扫码添加好友</p>
            </div>
          </button>
        </div>

        <!-- 留言表单 -->
        <div class="lg:col-span-3 reveal">
          <div class="bg-white/70 backdrop-blur border border-gray-100 rounded-2xl p-6 sm:p-8 shadow-sm">
            <div class="space-y-5">
              <div class="relative">
                <User :size="16" class="absolute left-3 top-3.5 text-gray-400" />
                <input v-model="form.name" placeholder="你的名字"
                  class="w-full pl-9 pr-3 py-3 rounded-xl border border-gray-200 bg-white/80 text-sm focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 transition-all" />
              </div>
              <div class="relative">
                <AtSign :size="16" class="absolute left-3 top-3.5 text-gray-400" />
                <input v-model="form.email" type="email" placeholder="邮箱地址"
                  class="w-full pl-9 pr-3 py-3 rounded-xl border border-gray-200 bg-white/80 text-sm focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 transition-all" />
              </div>
              <div class="relative">
                <MessageSquare :size="16" class="absolute left-3 top-3.5 text-gray-400" />
                <textarea v-model="form.message" rows="5" placeholder="想说点什么..."
                  class="w-full pl-9 pr-3 py-3 rounded-xl border border-gray-200 bg-white/80 text-sm focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 transition-all resize-none" />
              </div>
              <button
                @click="submit"
                :disabled="sending || sent"
                class="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-400 to-cyan-400 text-white font-medium text-sm hover:shadow-lg hover:shadow-emerald-200 transition-all active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <Loader2 v-if="sending" :size="16" class="animate-spin" />
                <CheckCircle v-else-if="sent" :size="16" />
                <Send v-else :size="16" />
                {{ sending ? '发送中...' : sent ? '已发送！' : '发送消息' }}
              </button>
            </div>
          </div>
        </div>
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
          <div class="relative bg-white/80 backdrop-blur-lg border border-emerald-100 rounded-2xl p-6 sm:p-8 shadow-xl shadow-emerald-500/10 max-w-sm w-full">
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

    <!-- QQ 二维码弹窗 -->
    <Teleport to="body">
      <Transition name="qr-fade">
        <div
          v-if="showQR"
          class="fixed inset-0 z-50 flex items-center justify-center p-4"
          @click.self="showQR = false"
        >
          <div class="absolute inset-0 bg-black/30 backdrop-blur-sm" />
          <div class="relative bg-white/80 backdrop-blur-lg border border-emerald-100 rounded-2xl p-6 sm:p-8 shadow-xl shadow-emerald-500/10 max-w-sm w-full">
            <button
              @click="showQR = false"
              class="absolute top-3 right-3 w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
            >
              <X :size="16" class="text-gray-500" />
            </button>
            <div class="text-center">
              <div class="w-16 h-1 bg-gradient-to-r from-emerald-400 to-cyan-400 rounded-full mx-auto mb-4" />
              <p class="text-gray-800 font-bold text-lg mb-1">扫码添加 QQ</p>
              <p class="text-gray-400 text-xs mb-5">扫一扫二维码，添加好友</p>
              <img
                src="/qq-qr.jpg"
                alt="QQ 二维码"
                class="w-48 h-48 mx-auto rounded-xl shadow-sm border border-gray-100"
              />
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
    </div>
</div>
</template>

<style scoped>
.qr-fade-enter-active { transition: all 0.25s ease-out; }
.qr-fade-leave-active { transition: all 0.2s ease-in; }
.qr-fade-enter-from { opacity: 0; }
.qr-fade-enter-from > div:last-child { transform: scale(0.95); opacity: 0; }
.qr-fade-leave-to { opacity: 0; }
.qr-fade-leave-to > div:last-child { transform: scale(0.95); opacity: 0; }
</style>
