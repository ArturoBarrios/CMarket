import { useRuntimeConfig } from 'nuxt/app'

export function useLikeJoke() {
  const likeJoke = async (jokeId: string, userId: string) => {
    const config = useRuntimeConfig()
    const apiBase = config.public.capi
    const res = await fetch(`${apiBase}/primary/like-objects`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jokeId,
        userId,
        liked: true,
      }),
    })
    if (!res.ok) throw new Error('Failed to like joke')
    return await res.json()
  }
  return { likeJoke }
}