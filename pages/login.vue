<template>
  <div :class="colors.bg.primary" class="min-h-screen flex items-center justify-center p-4">
    <div :class="[colors.bg.secondary, colors.border.primary]" class="w-full max-w-md border rounded-xl p-8 shadow-lg relative">
      <button
        @click="navigateTo('/')"
        class="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full transition text-white hover:bg-white hover:bg-opacity-20 cursor-pointer"
      >
        🏠
      </button>
      
      <h1 :class="colors.text.primary" class="text-3xl font-bold text-center mb-8">
        Login
      </h1>
      
      <form @submit.prevent="handleLogin" class="space-y-6">
        <div>
          <label :class="colors.text.primary" class="block text-sm font-medium mb-2">
            Username
          </label>
          <input
            v-model="username"
            type="text"
            placeholder="Enter your username"
            :class="[
              colors.text.primary, 
              colors.bg.primary, 
              colors.border.primary,
              'w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
            ]"
            required
          />
        </div>
        
        <div>
          <label :class="colors.text.primary" class="block text-sm font-medium mb-2">
            Password
          </label>
          <input
            v-model="password"
            type="password"
            placeholder="Enter your password"
            :class="[
              colors.text.primary, 
              colors.bg.primary, 
              colors.border.primary,
              'w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
            ]"
            required
          />
        </div>
        
        <button
          type="submit"
          :disabled="loading"
          :class="[
            colors.bg.accent,
            colors.hover.secondary,
            'w-full text-white p-3 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition'
          ]"
        >
          {{ loading ? 'Logging in...' : 'Login' }}
        </button>
        
        <div v-if="error" class="text-red-500 text-center text-sm">
          {{ error }}
        </div>
        
        <div class="text-center">
          <NuxtLink 
            to="/signup"
            :class="[colors.text.accent, 'text-sm hover:underline']"
          >
            Don't have an account? Sign up
          </NuxtLink>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const { colors } = useThemeStore()
const authStore = useAuthStore()

const username = ref('')
const password = ref('')
const loading = ref(false)
const error = ref('')

const handleLogin = async () => {
  if (!username.value.trim() || !password.value.trim()) {
    error.value = 'Please fill in all fields'
    return
  }

  loading.value = true
  error.value = ''
  
  try {
    await authStore.login({
      username: username.value.trim(),
      password: password.value
    })
    
    // Redirect to home page on successful login
    await navigateTo('/')
  } catch (err: any) {
    error.value = err.data?.message || 'Invalid username or password'
  } finally {
    loading.value = false
  }
}

// Redirect if already authenticated
onMounted(() => {
  if (authStore.isAuthenticated) {
    navigateTo('/')
  }
})
</script>
