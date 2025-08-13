export const useGenerateNewsWithAI = () => {
  const config = useRuntimeConfig()
  const API_BASE_URL = config.public.capi

  const generateNewsWithAI = async (params: {
    topic: string
    numberOfArticles: number
    location: string
  }) => {
    try {
      const response = await $fetch(`${API_BASE_URL}/news/generate-news-with-ai`, {
        method: 'POST',
        body: {
          topic: params.topic,
          numberOfArticles: params.numberOfArticles,
          location: params.location
        },
        headers: {
          'Content-Type': 'application/json'
        }
      })

      return {
        success: true,
        data: response,
        message: `Successfully generated ${params.numberOfArticles} news articles about "${params.topic}" in ${params.location}`
      }
    } catch (error: any) {
      console.error('Generate news with AI error:', error)
      
      return {
        success: false,
        error: error?.data?.message || error?.message || 'Failed to generate news with AI',
        data: null
      }
    }
  }

  return {
    generateNewsWithAI
  }
}
