import { useRuntimeConfig } from 'nuxt/app'
import { defineStore } from 'pinia'
import { processJokeWithStats } from '~/utils/jokeHelpers'
import { useAuthStore } from '~/stores/auth'
import { useCreateJoke } from '~/composables/useCreateJoke'

export const useJokesStore = defineStore('jokes', {
  state: () => ({
    jokes: [] as any[],
    loading: false,
    error: null as string | null,
    creating: false, // Add creating state for UI feedback
  }),
  actions: {
    async fetchJokes() {
      this.loading = true
      this.error = null
      try {
        // Get current user ID from auth store
        const authStore = useAuthStore()
        const userId = authStore.user?.id
        if (!userId) {
          // throw new Error('User not authenticated')
          //route to login           
        }
        // Use runtime config for the API base URL
        const config = useRuntimeConfig()
        const apiBase = config.public.capi
        const res = await fetch(`${apiBase}/primary/jokes`)
        if (!res.ok) throw new Error('Failed to fetch jokes')
        const data = await res.json()
        
        
        // Process each joke to add likes, dislikes, and userLiked
        this.jokes = data.map((joke: any) => processJokeWithStats(joke, userId ? userId : ""))
        //sort jokes by createdAt in descending order
        this.jokes.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

        console.log('Fetched jokes:', this.jokes)
      } catch (err: any) {
        this.error = err.message || 'Unknown error'
      } finally {
        this.loading = false
      }
    },
    async createJoke(content: string) {
      this.creating = true
      this.error = null
      try {
        const authStore = useAuthStore()
        const userId = authStore.user?.id
        const username = authStore.user?.username
        if (!userId) {
          throw new Error('User not authenticated')
        }
        
        const { createJoke } = useCreateJoke()
        const newJoke = await createJoke(content, userId, username ? username : '')
        
        console.log('New joke created:', newJoke)
        // Process the new joke with stats and add to the beginning of the array
        const processedJoke = processJokeWithStats(newJoke, userId)
        console.log('Processed new joke:', processedJoke)
        this.jokes.unshift(processedJoke)
        
        return newJoke
      } catch (err: any) {
        this.error = err.message || 'Failed to create joke'
        throw err
      } finally {
        this.creating = false
      }
    },
  },
})