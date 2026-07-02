import { onMounted } from 'vue'

/**
 * 滚动入场动画 — IntersectionObserver 驱动
 * 核心：requestAnimationFrame 确保 DOM 已渲染，然后强制可见。
 * 如果元素不在视口内，用 IntersectionObserver 延迟触发。
 */
export function useReveal(rootSelector = '.reveal', threshold = 0.1) {
  onMounted(() => {
    // requestAnimationFrame 确保浏览器已完成首帧渲染
    requestAnimationFrame(() => {
      const elements = document.querySelectorAll(rootSelector)
      if (elements.length === 0) return

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('visible')
              observer.unobserve(entry.target)
            }
          })
        },
        { threshold }
      )

      elements.forEach((el) => {
        const rect = el.getBoundingClientRect()
        if (rect.top < window.innerHeight && rect.bottom > 0) {
          // 强制回流后添加类名，确保 CSS transition 触发
          // eslint-disable-next-line @typescript-eslint/no-unused-expressions
          el.offsetHeight
          el.classList.add('visible')
        } else {
          observer.observe(el)
        }
      })
    })
  })
}
