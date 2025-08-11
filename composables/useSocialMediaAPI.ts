export interface CreateProfilePostDto {
  socialMediaUsername: string;
  content: string;
  createdPostAt: Date;
  platform: string;
  link: string;
  newsContentId: string;
  success: boolean;
  message?: string;
}

export const useSocialMediaAPI = () => {
  const config = useRuntimeConfig()
  const API_BASE_URL = config.public.capi

  const createSocialMediaPost = async (postData: {
    content: string;
    username: string;
    platform: string;
    link: string;
    newsContentId: string;
  }): Promise<{ success: boolean; error?: string; data?: CreateProfilePostDto }> => {
    try {
      const body: CreateProfilePostDto = {
        socialMediaUsername: postData.username,
        content: postData.content,
        createdPostAt: new Date(),
        platform: postData.platform,
        link: postData.link,
        newsContentId: postData.newsContentId,
        success: false
      }

      const response = await $fetch<CreateProfilePostDto>(`${API_BASE_URL}/socialmedia/create-post`, {
        method: 'POST',
        body,
        headers: {
          'Content-Type': 'application/json'
        }
      })

      return {
        success: true,
        data: response
      }
    } catch (error: any) {
      console.error('Create social media post error:', error)
      return {
        success: false,
        error: error.message || 'Failed to create social media post'
      }
    }
  }

  return {
    createSocialMediaPost
  }
}
