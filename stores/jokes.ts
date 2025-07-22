import { useRuntimeConfig } from 'nuxt/app'
import { defineStore } from 'pinia'

export const useJokesStore = defineStore('jokes', {
  state: () => ({
    jokes: [] as any[],
    loading: false,
    error: null as string | null,
  }),
  actions: {
    async fetchJokes() {
      this.loading = true
      this.error = null
      try {
        // Use runtime config for the API base URL
        const config = useRuntimeConfig()
        const apiBase = config.public.capi
        const res = await fetch(`${apiBase}/primary/jokes`)
        if (!res.ok) throw new Error('Failed to fetch jokes')
        const data = await res.json()
        this.jokes = data
        console.log('Fetched jokes:', this.jokes)
      } catch (err: any) {
        this.error = err.message || 'Unknown error'
      } finally {
        this.loading = false
      }
    },
  },
})