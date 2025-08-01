interface NewsItem {
  id: string
  headline: string
  summary: string
  content?: string
  sourcesCount?: string
  author?: string
  publishedAt?: string
  timeAgo: string
  category?: string
  tags: string[]
  imageUrl?: string
  url?: string
}

interface NewsContentResponse {
  id: string | number
  title: string
  summary: string
  content: string
  createdAt: string
}

interface ApiResponse {
  success: boolean
  newsContents?: NewsContentResponse[]
  message?: string
}

// Helper function to calculate time ago
const calculateTimeAgo = (createdAt: string): string => {
  const now = new Date()
  const created = new Date(createdAt)
  const diffInMs = now.getTime() - created.getTime()
  const diffInMinutes = Math.floor(diffInMs / (1000 * 60))
  const diffInHours = Math.floor(diffInMinutes / 60)
  const diffInDays = Math.floor(diffInHours / 24)

  if (diffInMinutes < 60) {
    return `${diffInMinutes}m ago`
  } else if (diffInHours < 24) {
    return `${diffInHours}h ago`
  } else {
    return `${diffInDays}d ago`
  }
}

export const useNewsStore = defineStore('news', () => {
  const news = ref<NewsItem[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Get API base URL from runtime config
  const config = useRuntimeConfig()
  const API_BASE_URL = config.public.capi

  const getNewsToday = async (body?: any) => {
    loading.value = true
    error.value = null
    
    try {
       const response = await $fetch<ApiResponse>(`${API_BASE_URL}/news/get-news-content`, {
      method: 'POST',
      body: body,
      headers: {
        'Content-Type': 'application/json'
      }
    })

    if (response.success && response.newsContents) {
      news.value = response.newsContents.map((newsContent) => ({
        id: newsContent.id,
        headline: newsContent.title,
        summary: newsContent.summary,
        content: newsContent.content,
        timeAgo: calculateTimeAgo(newsContent.createdAt),
        source: '',
        author: '',        
        category: '',
        tags: [],
        imageUrl: '',
        url: ''
      }))
    }

      return response
    } catch (err) {
      error.value = 'Failed to fetch news'
      console.error('News fetch error:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  return {
    news: readonly(news),
    loading: readonly(loading),
    error: readonly(error),
    getNewsToday
  }
})