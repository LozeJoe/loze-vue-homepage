const HISTORY_KEY = 'loze_blog_history'
const MAX_HISTORY = 20

export interface HistoryItem {
  id: string | number
  title: string
  cover?: string
  category?: string
  timestamp: number
}

export function getHistory(): HistoryItem[] {
  try {
    const raw = localStorage.getItem(HISTORY_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

export function addHistory(item: Omit<HistoryItem, 'timestamp'>): void {
  const list = getHistory()
  // 去重：如果已存在则移除旧的
  const filtered = list.filter((h) => String(h.id) !== String(item.id))
  // 添加到最前面
  filtered.unshift({ ...item, timestamp: Date.now() })
  // 限制最大条数
  if (filtered.length > MAX_HISTORY) filtered.length = MAX_HISTORY
  localStorage.setItem(HISTORY_KEY, JSON.stringify(filtered))
}

export function clearHistory(): void {
  localStorage.removeItem(HISTORY_KEY)
}
