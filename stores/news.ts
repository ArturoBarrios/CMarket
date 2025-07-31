// Add these interfaces at the top of the file
interface User {
  id: string
  username: string
}

interface AuthResponse {
  accessToken: string
  refreshToken: string
  user: User
}

export const useNewsStore = defineStore('news', () => {
  const user = ref<User | null>(null)
  const accessToken = ref<string | null>(null)
  const refreshToken = ref<string | null>(null)
  const isAuthenticated = computed(() => !!accessToken.value)

  // Get API base URL from runtime config
  const config = useRuntimeConfig()
  const API_BASE_URL = config.public.capi

  const getNewsToday = async (body ) => {
    try {
      const response = await $fetch<AuthResponse>(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        body: credentials,
        headers: {
          'Content-Type': 'application/json'
        }
      })

      accessToken.value = response.accessToken
      refreshToken.value = response.refreshToken
      user.value = response.user

      if (import.meta.client) {
        localStorage.setItem('accessToken', response.accessToken)
        localStorage.setItem('refreshToken', response.refreshToken)
        localStorage.setItem('user', JSON.stringify(response.user))
      }

      return response
    } catch (error) {
      console.error('Login error:', error)
      throw error
    }
  }

    
})