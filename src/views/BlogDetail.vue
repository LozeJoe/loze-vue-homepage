<script setup lang="ts">
import { ref, onMounted, watch, computed } from 'vue'
import { useRoute } from 'vue-router'
import axios from 'axios'
import { marked } from 'marked'
import DOMPurify from 'dompurify'
import { ArrowLeft, Clock, Tag, Eye, MessageSquare, Send, User } from 'lucide-vue-next'
import { useReveal } from '@/composables/useReveal'
import { addHistory } from '@/utils/history'
import FloatingBack from '@/components/FloatingBack.vue'
import SkeletonDetail from '@/components/SkeletonDetail.vue'
import BackToTop from '@/components/BackToTop.vue'

interface Post {
  id: number
  title: string
  content?: string
  summary?: string
  cover?: string
  categoryName?: string
  tags?: string[]
  createdAt?: string
  updatedAt?: string
  viewCount?: number
}

interface Comment {
  id: number
  postId: number
  username: string
  content: string
  createTime?: string
}

const route = useRoute()
const post = ref<Post | null>(null)
const loading = ref(true)
const error = ref('')
const htmlContent = ref('')

// Comments
const comments = ref<Comment[]>([])
const commentAuthor = ref('')
const commentContent = ref('')
const commentSubmitting = ref(false)
const commentError = ref('')

// 重置状?
function resetState() {
  post.value = null
  htmlContent.value = ''
  error.value = ''
  loading.value = true
  comments.value = []
  commentError.value = ''
}

async function fetchPost() {
  resetState()
  const id = route.params.id
  if (!id) {
    error.value = '缺少文章ID'
    loading.value = false
    return
  }
  try {
    const res = await axios.get(`/api/posts/${id}`).then(r => r.data)
    post.value = res
    if (res) {
      const rawHtml = marked(res.content || '')
      htmlContent.value = DOMPurify.sanitize(rawHtml)
      addHistory({ id: String(res.id), title: res.title, slug: String(res.id) })
      document.title = res.title + ' \u00B7 LozeJoe'
      // 加载评论
      fetchComments()
      // 增加浏览次数
      axios.post(`/api/posts/${id}/view`).then(r => {
        if (post.value) post.value.viewCount = r.data.viewCount
      }).catch(() => {})
    }
  } catch (e: any) {
    error.value = e?.response?.status === 404 ? '文章不存在' : '加载失败'
  } finally {
    loading.value = false
  }
}

// 加载评论
async function fetchComments() {
  const id = route.params.id
  if (!id) return
  try {
    const res = await axios.get(`/api/comments/${id}`)
    // ApiResponse 包装: { code, data: [...], message }
    const data = res.data?.data || res.data || []
    comments.value = Array.isArray(data) ? data : []
  } catch {
    comments.value = []
  }
}

// 发表评论
async function submitComment() {
  const author = commentAuthor.value.trim()
  const content = commentContent.value.trim()
  if (!content) return
  if (!author) {
    commentError.value = '请输入昵称'
    return
  }
  commentSubmitting.value = true
  commentError.value = ''
  try {
    await axios.post('/api/comments', {
      postId: route.params.id,
      username: author,
      content,
    })
    commentContent.value = ''
    commentError.value = ''
    // 刷新评论列表
    await fetchComments()
  } catch (e: any) {
    commentError.value = '发表失败，请稍后重试'
  } finally {
    commentSubmitting.value = false
  }
}

function formatCommentTime(t: string) {
  if (!t) return ''
  return new Date(t).toLocaleDateString('zh-CN', {
    year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit'
  })
}

onMounted(() => {
  useReveal()
  fetchPost()
})

watch(() => route.params.id, () => {
  fetchPost()
})


const formattedDate = computed(() => {
  if (!post.value?.createdAt) return ''
  return new Date(post.value.createdAt).toLocaleDateString('zh-CN', {
    year: 'numeric', month: 'long', day: 'numeric'
  })
})
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50/30">
    <FloatingBack to="/blog" />

    <div class="max-w-3xl mx-auto px-4 py-12 sm:py-20">
      <!-- Loading -->
      <SkeletonDetail v-if="loading" />

      <!-- Post Content -->
      <article v-else-if="post" class="reveal">
        <!-- Cover -->
        <div v-if="post.cover" class="mb-8 rounded-2xl overflow-hidden shadow-lg">
          <img :src="post.cover" :alt="post.title" class="w-full object-cover max-h-96" />
        </div>

        <!-- Title -->
        <h1 class="text-2xl sm:text-3xl font-bold text-gray-800 mb-4 leading-snug">
          {{ post.title }}
        </h1>

        <!-- Meta -->
        <div class="flex flex-wrap items-center gap-4 text-sm text-gray-400 mb-8 pb-6 border-b border-gray-100">
          <span v-if="formattedDate" class="inline-flex items-center gap-1.5">
            <Clock :size="14" /> {{ formattedDate }}
          </span>
          <span v-if="post.categoryName" class="inline-flex items-center gap-1.5">
            <Tag :size="14" /> {{ post.categoryName }}
          </span>
          <span v-if="post.viewCount !== undefined" class="inline-flex items-center gap-1.5">
            <Eye :size="14" /> {{ post.viewCount }} 次阅?
          </span>
          <span class="inline-flex items-center gap-1.5">
            <MessageSquare :size="14" /> {{ comments.length }} 条评?
          </span>
        </div>

        <!-- Body -->
        <div
          class="prose prose-slate max-w-none prose-img:rounded-xl prose-a:text-emerald-600 prose-code:text-rose-500 prose-pre:bg-gray-900"
          v-html="htmlContent"
        />

        <!-- Tags -->
        <div v-if="post.tags?.length" class="mt-10 pt-6 border-t border-gray-100">
          <div class="flex flex-wrap gap-2">
            <span
              v-for="tag in post.tags"
              :key="tag"
              class="px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 text-xs font-medium"
            >{{ tag }}</span>
          </div>
        </div>

        <!-- Empty content -->
        <div v-if="!post.content" class="text-gray-400 text-center py-12">暂无内容</div>

        <!-- ============ 评论?============ -->
        <section class="mt-12 pt-8 border-t border-gray-100">
          <h3 class="text-lg font-bold text-gray-700 mb-6 flex items-center gap-2">
            <MessageSquare :size="18" class="text-emerald-500" />
            评论 ({{ comments.length }})
          </h3>

          <!-- Comment List -->
          <div v-if="comments.length > 0" class="space-y-4 mb-8">
            <div
              v-for="c in comments"
              :key="c.id"
              class="glass-card rounded-xl p-4 flex gap-3"
            >
              <div class="w-9 h-9 rounded-full bg-gradient-to-br from-emerald-400 to-cyan-400 flex items-center justify-center shrink-0">
                <User :size="15" class="text-white" />
              </div>
              <div class="flex-1 min-w-0">
                <div class="flex items-center gap-2 mb-1">
                  <span class="font-bold text-gray-700 text-sm">{{ c.username }}</span>
                  <span class="text-xs text-gray-400">{{ formatCommentTime(c.createTime || '') }}</span>
                </div>
                <p class="text-sm text-gray-600 leading-relaxed">{{ c.content }}</p>
              </div>
            </div>
          </div>

          <!-- Empty State -->
          <div v-else class="text-center py-8 mb-8">
            <MessageSquare :size="36" class="text-gray-200 mx-auto mb-3" />
            <p class="text-gray-400 text-sm">暂无评论，来抢沙发吧~</p>
          </div>

          <!-- Comment Form -->
          <div class="glass-card rounded-2xl p-5">
            <h4 class="text-sm font-bold text-gray-600 mb-4">发表评论</h4>
            <div class="space-y-3">
              <div class="flex gap-3">
                <input
                  v-model="commentAuthor"
                  type="text"
                  placeholder="你的昵称"
                  maxlength="20"
                  class="flex-1 px-4 py-2.5 rounded-xl bg-white/70 border border-gray-200 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/10 transition-all"
                />
                <button
                  @click="submitComment"
                  :disabled="commentSubmitting || !commentContent.trim()"
                  class="px-5 py-2.5 rounded-xl text-sm font-bold text-white transition-all shadow-sm disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5"
                  style="background: linear-gradient(135deg, #10b981, #06b6d4);"
                >
                  <Send :size="14" />
                  {{ commentSubmitting ? '发送中...' : '发表' }}
                </button>
              </div>
              <textarea
                v-model="commentContent"
                rows="3"
                placeholder="写下你的想法..."
                maxlength="500"
                class="w-full px-4 py-3 rounded-xl bg-white/70 border border-gray-200 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/10 transition-all resize-none"
              ></textarea>
              <p v-if="commentError" class="text-xs text-red-400">{{ commentError }}</p>
              <p class="text-xs text-gray-400 text-right">{{ commentContent.length }}/500</p>
            </div>
          </div>
        </section>
      </article>

      <!-- Back -->
      <div class="mt-12 text-center">
        <router-link to="/blog"
          class="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/80 backdrop-blur border border-gray-200 text-gray-500 hover:border-emerald-300 hover:text-emerald-600 transition-all text-sm">
          <ArrowLeft :size="14" /> 返回列表
        </router-link>
      </div>
    </div>
  </div>
    <BackToTop />
</template>

<style scoped>
.prose {
  --tw-prose-body: #374151;
  --tw-prose-headings: #111827;
  --tw-prose-links: #059669;
  line-height: 1.8;
}

.glass-card {
  background: rgba(255, 255, 255, 0.65);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.8);
  box-shadow: 0 1px 3px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.03);
  transition: all 0.2s ease;
}
.glass-card:hover {
  background: rgba(255, 255, 255, 0.85);
  box-shadow: 0 2px 8px rgba(16,185,129,0.08), 0 8px 24px rgba(0,0,0,0.06);
}
</style>
