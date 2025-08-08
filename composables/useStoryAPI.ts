export const useStoryAPI = () => {
  const config = useRuntimeConfig()
  const API_BASE_URL = config.public.capi

  const sendStoryToAPI = async (story: {
    title: string
    summary: string
    content?: string | string[]
    date?: string
    timestamp?: string
  }) => {
    try {
      // Prepare the payload
      const payload = {
        title: story.title || '',
        summary: story.summary || '',
        content: Array.isArray(story.content) 
          ? story.content.join('\n\n') 
          : (story.content || ''),
        date: story.date || story.timestamp || new Date().toISOString()
      }

      const headers = {
        'Content-Type': 'application/json',
        'User-Agent': 'CMarketApp/1.0'
      }

      console.log(`Sending story to API: ${API_BASE_URL}/news/create`)
      
      const response = await $fetch(`${API_BASE_URL}/news/create`, {
        method: 'POST',
        body: payload,
        headers,
        timeout: 10000
      })

      console.log(`✓ Successfully sent story: ${story.title.substring(0, 50)}...`)
      return { success: true, data: response }
      
    } catch (error: any) {
      console.error(`✗ Failed to send story to API:`, error)
      
      // Handle different error types
      if (error.response?.status) {
        console.error(`✗ API error ${error.response.status}: ${error.response._data}`)
        return { 
          success: false, 
          error: `API error ${error.response.status}: ${error.response._data || 'Unknown error'}` 
        }
      }
      
      return { 
        success: false, 
        error: error.message || 'Failed to send story to API' 
      }
    }
  }

  return {
    sendStoryToAPI
  }
}
