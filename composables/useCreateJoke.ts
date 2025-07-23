import { useRuntimeConfig } from 'nuxt/app'

export function useCreateJoke() {
  const createJoke = async (content: string, userId: string, username: string) => {
    const config = useRuntimeConfig()
    const apiBase = config.public.capi
    const res = await fetch(`${apiBase}/primary/jokes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        content,
        userId,
      }),
    })
    if (!res.ok) throw new Error('Failed to create joke')
    const result = await res.json()
result.username =  username;
    console.log('Joke created:', result)
    return result
  }

  return { createJoke }
}