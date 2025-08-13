interface SubContent {
  id: string
  content: string
  type: string
  newsContentId: string
}

interface Post {
  id: string
  content: string
  username: string
  
}

interface NewsContentResponse {
  id: string
  title: string
  summary: string
  createdAt: string
  updatedAt: string
  sourcesCount: number
  updatePrompt: string | null
  pointsPrompt: string | null
  subContent: SubContent[]
  posts: Post[]
  news: News[]
}

interface ApiResponse {
  success: boolean
  message?: string
  newsContents: {
    success: boolean
    message: string
    newsContents: NewsContentResponse[]
  }
}

interface News {
  id: string
  topic: string
}

interface NewsItem {
  id: string
  headline: string
  summary: string
  content?: string
  source: string
  author?: string
  publishedAt: string
  timeAgo: string
  category: string
  tags: string[]
  imageUrl?: string
  url?: string
  subContent: SubContent[]
}


interface NewsWithoutContent {
  id: string
  title: string
  url: string
  summary?: string
  createdAt: string
  updatedAt: string
  timeAgo: string
}

interface NewsWithoutContentResponse {
  success: boolean
  message: string
  count: number
  news: NewsWithoutContent[]
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
  const newsWithoutContent = ref<NewsWithoutContent[]>([])
  const loading = ref(false)
  const loadingWithoutContent = ref(false)
  const error = ref<string | null>(null)
  const errorWithoutContent = ref<string | null>(null)

  // Get API base URL from runtime config
  const config = useRuntimeConfig()
  const API_BASE_URL = config.public.capi

  const getNewsToday = async (startDate?: string) => {
    loading.value = true
    error.value = null
    
    console.log('🚀 Starting news fetch with startDate:', startDate)
    
    try {
      const response = await $fetch<ApiResponse>(`${API_BASE_URL}/news/get-news-content`, {
        method: 'POST',
        body: startDate ? { startDate } : {},
        headers: {
          'Content-Type': 'application/json'
        }
      })

      console.log('📡 Raw API Response:', response)
      console.log('✅ Response success:', response.success)
      console.log('📰 NewsContents success:', response.newsContents?.success)
      console.log('📊 NewsContents array length:', response.newsContents?.newsContents?.length)

      if (response.success && response.newsContents?.success && response.newsContents.newsContents) {
        console.log('🔄 Processing news contents:', response.newsContents.newsContents)
        
        news.value = response.newsContents.newsContents.map((newsContent, index) => {
          console.log(`📝 Processing news item ${index + 1}:`, newsContent)
          
          const processedItem = {
            id: newsContent.id,
            headline: newsContent.title,
            summary: newsContent.summary,
            content: '', // You can set this from summary or leave empty
            timeAgo: calculateTimeAgo(newsContent.createdAt),
            source: '',
            author: '',
            publishedAt: newsContent.createdAt,
            category: '',
            tags: [],
            imageUrl: '',
            url: '',
            subContent: newsContent.subContent,
            posts: newsContent.posts,
            news: newsContent.news  
          }
          
          console.log(`✨ Processed item ${index + 1}:`, processedItem)
          return processedItem
        })
        
        console.log('🎉 Final news array:', news.value)
      } else {
        console.warn('⚠️ Response validation failed:', {
          responseSuccess: response.success,
          newsContentsSuccess: response.newsContents?.success,
          hasNewsContents: !!response.newsContents?.newsContents
        })
      }

      return response
    } catch (err) {
      console.error('💥 News fetch error details:', err)
      console.error('🔍 Error type:', typeof err)
      console.error('📋 Error properties:', Object.keys(err as any))
      error.value = 'Failed to fetch news'
      throw err
    } finally {
      loading.value = false
      console.log('🏁 News fetch completed. Loading:', loading.value)
    }
  }

  const getNewsWithoutContent = async () => {
    loadingWithoutContent.value = true
    errorWithoutContent.value = null
    
    console.log('🚀 Starting news without content fetch')
    
    try {
      const { getNewsWithoutContent: fetchNewsWithoutContent } = useNewsAPI()
      const response = await fetchNewsWithoutContent()

      console.log('📡 Raw API Response for news without content:', response)

      if (response.success && response.news) {
        console.log('🔄 Processing news without content:', response.news)
        
        newsWithoutContent.value = response.news.map((item, index) => {
          console.log(`📝 Processing news without content item ${index + 1}:`, item)
          
          const processedItem = {
            ...item,
            timeAgo: calculateTimeAgo(item.createdAt)
          }
          
          console.log(`✨ Processed item ${index + 1}:`, processedItem)
          return processedItem
        })
        
        console.log('🎉 Final news without content array:', newsWithoutContent.value)
      } else {
        console.warn('⚠️ Response validation failed:', response)
        errorWithoutContent.value = response.message || 'Failed to fetch news without content'
      }

      return response
    } catch (err) {
      console.error('💥 News without content fetch error:', err)
      errorWithoutContent.value = 'Failed to fetch news without content'
      throw err
    } finally {
      loadingWithoutContent.value = false
      console.log('🏁 News without content fetch completed')
    }
  }

  // Helper function to get subcontent by type
  const getSubContentByType = (newsItem: NewsItem, type: string): SubContent[] => {
    return newsItem.subContent.filter(sub => sub.type === type)
  }

  // Helper function to get all unique subcontent types
  const getSubContentTypes = (newsItem: NewsItem): string[] => {
    return [...new Set(newsItem.subContent.map(sub => sub.type))]
  }

  return {
    news: readonly(news),
    newsWithoutContent: readonly(newsWithoutContent),
    loading: readonly(loading),
    loadingWithoutContent: readonly(loadingWithoutContent),
    error: readonly(error),
    errorWithoutContent: readonly(errorWithoutContent),
    getNewsToday,
    getNewsWithoutContent,
    getSubContentByType,
    getSubContentTypes
  }
})