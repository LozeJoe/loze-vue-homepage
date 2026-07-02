<script setup lang="ts">
import { ref, onMounted, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { User, Lock, RefreshCw, Shield, ArrowRight } from 'lucide-vue-next'
import { ElMessage } from 'element-plus'

const router = useRouter()
const store = useStore()

const captchaRef = ref<HTMLCanvasElement | null>(null)
const loading = ref(false)

const loginForm = reactive({
  username: '',
  password: '',
  captcha: '',
})

let captchaCode = ''

const generateCaptcha = () => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  captchaCode = ''
  for (let i = 0; i < 4; i++) {
    captchaCode += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  drawCaptcha()
}

const drawCaptcha = () => {
  const canvas = captchaRef.value
  if (!canvas) return
  const ctx = canvas.getContext('2d')
  if (!ctx) return
  const w = canvas.width, h = canvas.height

  ctx.fillStyle = 'rgba(255,255,255,0.6)'
  ctx.fillRect(0, 0, w, h)

  for (let i = 0; i < 5; i++) {
    ctx.strokeStyle = `rgba(16,185,129,${Math.random() * 0.3 + 0.1})`
    ctx.beginPath()
    ctx.moveTo(Math.random() * w, Math.random() * h)
    ctx.lineTo(Math.random() * w, Math.random() * h)
    ctx.lineWidth = Math.random() * 1.2 + 0.5
    ctx.stroke()
  }

  for (let i = 0; i < 20; i++) {
    ctx.fillStyle = `rgba(16,185,129,${Math.random() * 0.4})`
    ctx.beginPath()
    ctx.arc(Math.random() * w, Math.random() * h, Math.random() * 1.5, 0, Math.PI * 2)
    ctx.fill()
  }

  ctx.font = 'bold 24px "Courier New", monospace'
  ctx.textBaseline = 'middle'
  for (let i = 0; i < captchaCode.length; i++) {
    const x = 15 + i * 28 + Math.random() * 5 - 2
    const y = h / 2 + Math.random() * 8 - 4
    const angle = Math.random() * 0.3 - 0.15
    ctx.save()
    ctx.translate(x, y)
    ctx.rotate(angle)
    ctx.fillStyle = '#1e293b'
    ctx.fillText(captchaCode[i], 0, 0)
    ctx.restore()
  }
}

const handleLogin = async () => {
  if (!loginForm.username.trim()) {
    ElMessage.warning('请输入用户名')
    return
  }
  if (!loginForm.password) {
    ElMessage.warning('请输入密码')
    return
  }
  if (loginForm.captcha.toUpperCase() !== captchaCode) {
    ElMessage.error('验证码错误')
    generateCaptcha()
    loginForm.captcha = ''
    return
  }
  loading.value = true
  try {
    await store.dispatch('user/login', {
      username: loginForm.username.trim(),
      password: loginForm.password,
    })
    ElMessage.success('登录成功')
    router.push('/admin')
  } catch (err: any) {
    ElMessage.error(err?.response?.data?.message || '登录失败')
    generateCaptcha()
    loginForm.captcha = ''
  } finally {
    loading.value = false
  }
}

onMounted(() => generateCaptcha())
</script>

<template>
  <div class="min-h-screen w-full flex items-center justify-center relative overflow-hidden page-bg">
    <!-- 装饰光斑 -->
    <div class="absolute inset-0 pointer-events-none overflow-hidden">
      <div class="absolute -top-32 -right-32 w-[500px] h-[500px] rounded-full opacity-20"
        style="background: radial-gradient(circle, rgba(16,185,129,0.4) 0%, transparent 70%);" />
      <div class="absolute -bottom-20 -left-20 w-[400px] h-[400px] rounded-full opacity-15"
        style="background: radial-gradient(circle, rgba(6,182,212,0.4) 0%, transparent 70%);" />
    </div>

    <!-- 登录卡片 -->
    <div class="relative z-10 w-full max-w-[420px] mx-4">
      <!-- Logo -->
      <div class="text-center mb-6 reveal">
        <div class="inline-flex items-center justify-center w-16 h-16 rounded-2xl glass mb-4 shadow-lg shadow-emerald-400/5">
          <Shield :size="28" class="text-emerald-500" />
        </div>
        <h1 class="text-2xl font-black text-gray-800">后台管理</h1>
        <p class="text-sm text-gray-400 mt-1">登录以管理博客内容</p>
      </div>

      <!-- 表单卡片 -->
      <div class="glass rounded-3xl p-8 shadow-lg shadow-gray-200/30 reveal" style="animation-delay: 0.1s">
        <el-form
          :model="loginForm"
          @keyup.enter="handleLogin"
          class="space-y-5"
        >
          <!-- 用户名 -->
          <div>
            <label class="flex items-center gap-2 mb-2 text-xs font-medium text-gray-500">
              <User :size="13" /> 用户名
            </label>
            <el-input
              v-model="loginForm.username"
              placeholder="请输入用户名"
              size="large"
              class="glass-input"
            />
          </div>

          <!-- 密码 -->
          <div>
            <label class="flex items-center gap-2 mb-2 text-xs font-medium text-gray-500">
              <Lock :size="13" /> 密码
            </label>
            <el-input
              v-model="loginForm.password"
              type="password"
              placeholder="请输入密码"
              size="large"
              show-password
              class="glass-input"
            />
          </div>

          <!-- 验证码 -->
          <div>
            <label class="flex items-center gap-2 mb-2 text-xs font-medium text-gray-500">
              <RefreshCw :size="13" /> 验证码
            </label>
            <div class="flex gap-3">
              <el-input
                v-model="loginForm.captcha"
                placeholder="验证码"
                size="large"
                maxlength="4"
                class="glass-input flex-1"
              />
              <div class="shrink-0 cursor-pointer group" @click="generateCaptcha">
                <canvas
                  ref="captchaRef"
                  width="120"
                  height="44"
                  class="rounded-xl border border-gray-200 transition-all group-hover:border-emerald-300 group-hover:shadow-sm group-hover:shadow-emerald-100"
                />
              </div>
            </div>
          </div>

          <!-- 登录按钮 -->
          <button
            :disabled="loading"
            @click="handleLogin"
            class="w-full h-12 rounded-xl text-sm font-bold text-white flex items-center justify-center gap-2 transition-all duration-300 shadow-lg shadow-emerald-400/20 hover:shadow-xl hover:shadow-emerald-400/30 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
            style="background: linear-gradient(135deg, #10b981, #06b6d4);"
          >
            <span v-if="loading" class="flex items-center gap-2">
              <svg class="animate-spin w-4 h-4" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none"/><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
              验证中..
            </span>
            <span v-else class="flex items-center gap-1.5">
              登录<ArrowRight :size="16" />
            </span>
          </button>
        </el-form>

        <div class="mt-6 text-center">
          <p class="text-xs text-gray-400">&copy; 2026 LozeJoe · 个人博客管理系统</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.glass-input :deep(.el-input__wrapper) {
  background: rgba(255, 255, 255, 0.65) !important;
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-radius: 12px !important;
  border: 1px solid rgba(0, 0, 0, 0.06) !important;
  box-shadow: 0 1px 2px rgba(0,0,0,0.03) !important;
  transition: all 0.25s ease;
}
.glass-input :deep(.el-input__wrapper:hover) {
  border-color: rgba(16, 185, 129, 0.3) !important;
  box-shadow: 0 1px 3px rgba(16,185,129,0.06) !important;
}
.glass-input :deep(.el-input__wrapper.is-focus) {
  border-color: rgba(16, 185, 129, 0.5) !important;
  box-shadow: 0 0 0 3px rgba(16,185,129,0.06), 0 1px 3px rgba(16,185,129,0.08) !important;
}
.glass-input :deep(.el-input__inner) {
  color: #1e293b !important;
}
.glass-input :deep(.el-input__inner::placeholder) {
  color: rgba(0,0,0,0.25) !important;
}
</style>
