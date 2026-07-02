import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', name: 'home', component: () => import('@/views/HomePage.vue') },
    { path: '/blog', name: 'blog', component: () => import('@/views/BlogList.vue') },
    { path: '/blog/:id', name: 'blog-detail', component: () => import('@/views/BlogDetail.vue') },
    { path: '/memory', name: 'memory', component: () => import('@/views/MemoryArchive.vue') },
    { path: '/contact', name: 'contact', component: () => import('@/views/ContactArchive.vue') },
    { path: '/school', name: 'school', component: () => import('@/views/SchoolArchive.vue') },
    { path: '/expertise', name: 'expertise', component: () => import('@/views/ExpertiseArchive.vue') },
    { path: '/hobbies', name: 'hobbies', component: () => import('@/views/HobbiesSection.vue') },
    { path: '/admin/login', name: 'login', component: () => import('@/views/admin/Login.vue') },
    {
      path: '/admin',
      component: () => import('@/views/admin/AdminLayout.vue'),
      meta: { requiresAuth: true },
      children: [
        { path: '', name: 'admin', component: () => import('@/views/admin/Dashboard.vue') },
        { path: 'posts', name: 'admin-posts', component: () => import('@/views/admin/PostList.vue') },
        { path: 'write', name: 'write', component: () => import('@/views/admin/PostEditor.vue') },
        { path: 'write/:id', name: 'edit-post', component: () => import('@/views/admin/PostEditor.vue') },
        { path: 'categories', name: 'admin-categories', component: () => import('@/views/admin/CategoryManager.vue') },
        { path: 'tags', name: 'admin-tags', component: () => import('@/views/admin/TagManager.vue') },
        { path: 'comments', name: 'admin-comments', component: () => import('@/views/admin/CommentAdmin.vue') },
        { path: 'contacts', name: 'admin-contacts', component: () => import('@/views/admin/ContactAdmin.vue') },
        { path: 'stars', name: 'admin-stars', component: () => import('@/views/admin/StarAdmin.vue') },
        { path: 'friends', name: 'admin-friends', component: () => import('@/views/admin/FriendAdmin.vue') },
        { path: 'configs', name: 'admin-configs', component: () => import('@/views/admin/SiteConfigAdmin.vue') },
        { path: 'memories', name: 'admin-memories', component: () => import('@/views/admin/MemoryAdmin.vue') },
      ],
    },

    { path: '/friends', name: 'friends', component: () => import('@/views/FriendsPage.vue') },
    { path: '/:pathMatch(.*)*', name: 'not-found', component: () => import('@/views/NotFound.vue') },
  ],
  scrollBehavior() {
    return { top: 0, behavior: 'smooth' }
  },
})

// Auth guard - token must be non-empty and not 'undefined'/'null' string
router.beforeEach((to, _from, next) => {
  const raw = localStorage.getItem('token')
  const token = raw && raw !== 'undefined' && raw !== 'null' ? raw : ''
  if (to.meta.requiresAuth && !token) {
    next('/admin/login')
  } else if (to.path === '/admin/login' && token) {
    next('/admin')
  } else {
    next()
  }
})

// SEO: dynamic page titles
const titles: Record<string, string> = {
  home: 'LozeJoe · 个人主页',
  blog: '博客 · LozeJoe',
  'blog-detail': '文章详情 · LozeJoe',
  memory: '记忆存档 · LozeJoe',
  contact: '联系我 · LozeJoe',
  school: '求学之路 · LozeJoe',
  expertise: '技术栈 · LozeJoe',
  hobbies: '兴趣爱好 · LozeJoe',
  login: '登录 · LozeJoe',
  admin: '管理后台 · LozeJoe',
  'admin-posts': '文章管理 · LozeJoe',
  'admin-categories': '分类管理 · LozeJoe',
  'admin-tags': '标签管理 · LozeJoe',
  'admin-comments': '评论管理 · LozeJoe',
  write: '写文章 · LozeJoe',
  'edit-post': '编辑文章 · LozeJoe',
  'not-found': '404 · LozeJoe',
}

router.afterEach((to) => {
  const name = String(to.name || '')
  document.title = titles[name] || name ? `${name} · LozeJoe` : 'LozeJoe'
})

export default router
