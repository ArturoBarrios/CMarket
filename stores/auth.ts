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

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const accessToken = ref<string | null>(null)
  const refreshToken = ref<string | null>(null)
  const isAuthenticated = computed(() => !!accessToken.value)

  // Get API base URL from runtime config
  const config = useRuntimeConfig()
  const API_BASE_URL = config.public.capi

  // Initialize from localStorage on app start
  const initAuth = () => {
    if (import.meta.client) {
      const storedToken = localStorage.getItem('accessToken')
      const storedRefreshToken = localStorage.getItem('refreshToken')
      const storedUser = localStorage.getItem('user')
      
      if (storedToken && storedUser) {
        accessToken.value = storedToken
        refreshToken.value = storedRefreshToken
        user.value = JSON.parse(storedUser)
      }
    }
  }

  const signup = async (userData: { username: string, password: string }) => {
    try {
      const response = await $fetch<AuthResponse>(`${API_BASE_URL}/auth/signup`, {
        method: 'POST',
        body: userData,
        headers: {
          'Content-Type': 'application/json'
        }
      })

      // Store tokens and user info
      accessToken.value = response.accessToken
      refreshToken.value = response.refreshToken
      user.value = response.user

      // Persist to localStorage
      if (import.meta.client) {
        localStorage.setItem('accessToken', response.accessToken)
        localStorage.setItem('refreshToken', response.refreshToken)
        localStorage.setItem('user', JSON.stringify(response.user))
      }

      return response
    } catch (error) {
      console.error('Signup error:', error)
      throw error
    }
  }

  const login = async (credentials: { username: string, password: string }) => {
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

  const logout = () => {
    user.value = null
    accessToken.value = null
    refreshToken.value = null

    if (import.meta.client) {
      localStorage.removeItem('accessToken')
      localStorage.removeItem('refreshToken')
      localStorage.removeItem('user')
    }
  }

  // Helper function to get auth headers for API calls
  const getAuthHeaders = () => {
    return accessToken.value ? {
      'Authorization': `Bearer ${accessToken.value}`,
      'Content-Type': 'application/json'
    } : {
      'Content-Type': 'application/json'
    }
  }

  return {
    user: readonly(user),
    accessToken: readonly(accessToken),
    refreshToken: readonly(refreshToken),
    isAuthenticated,
    initAuth,
    signup,
    login,
    logout,
    getAuthHeaders
  }
})