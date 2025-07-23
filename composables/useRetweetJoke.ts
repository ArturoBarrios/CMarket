import { useRuntimeConfig } from 'nuxt/app'

export function useRetweetJoke() {
  const toggleRetweet = async (jokeId: string, userId: string, retweeted: boolean) => {
    const config = useRuntimeConfig()
    const apiBase = config.public.capi
    const res = await fetch(`${apiBase}/primary/retweet-objects`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jokeId,
        userId,
        retweeted,
      }),
    })
    if (!res.ok) throw new Error('Failed to Retweet')
    const result = await res.json()
    return result
  }

  return { toggleRetweet }
}