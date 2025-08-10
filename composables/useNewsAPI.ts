interface NewsWithoutContent {
  id: string
  title: string
  url: string
  summary?: string
  createdAt: string
  updatedAt: string
}

interface NewsWithoutContentResponse {
  success: boolean
  message: string
  count: number
  news: NewsWithoutContent[]
}

export const useNewsAPI = () => {
  const config = useRuntimeConfig()
  const API_BASE_URL = config.public.capi

  const getNewsWithoutContent = async (): Promise<NewsWithoutContentResponse> => {
    try {
      const response = await $fetch<NewsWithoutContentResponse>(`${API_BASE_URL}/news/without-content`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      })

      return response
    } catch (error) {
      console.error('Error fetching news without content:', error)
      throw error
    }
  }

  const deleteNews = async (newsId: string) => {
    try {
      const response = await $fetch(`${API_BASE_URL}/news/delete-news`, {
        method: 'POST',
        body: { newsId },
        headers: {
          'Content-Type': 'application/json'
        }
      })

      return {
        success: response.success,
        message: response.message
      }
    } catch (error) {
      console.error('Delete news error:', error)
      return {
        success: false,
        message: 'Failed to delete news. Please try again.'
      }
    }
  }

  return {
    getNewsWithoutContent,
    deleteNews
  }
}
