export const useContentGeneration = () => {
  const config = useRuntimeConfig()
  const API_BASE_URL = config.public.capi

  const generateContent = async (newsId: string) => {
    try {
      const response = await $fetch(`${API_BASE_URL}/news/generate-news`, {
        method: 'POST',
        body: { newsId },
        headers: {
          'Content-Type': 'application/json'
        }
      })
      
      return {
        success: true,
        data: response
      }
    } catch (error) {
      console.error('Generate content error:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to generate content'
      }
    }
  }

  return {
    generateContent
  }
}
