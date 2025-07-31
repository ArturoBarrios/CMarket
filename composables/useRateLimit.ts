import { ref, computed } from 'vue'

export interface RateLimitConfig {
  minInterval: number // milliseconds between actions
  maxAttempts?: number // max attempts in time window
  timeWindow?: number // time window in milliseconds
}

export function useRateLimit(config: RateLimitConfig) {
  const lastAction = ref(0)
  const attempts = ref<number[]>([])
  
  const canPerformAction = computed(() => {
    const now = Date.now()
    
    // Check minimum interval
    if (now - lastAction.value < config.minInterval) {
      return false
    }
    
    // Check rate limiting if configured
    if (config.maxAttempts && config.timeWindow) {
      // Clean old attempts
      attempts.value = attempts.value.filter(
        time => now - time < config.timeWindow!
      )
      
      if (attempts.value.length >= config.maxAttempts) {
        return false
      }
    }
    
    return true
  })
  
  const timeUntilNextAction = computed(() => {
    const timeSinceLastAction = Date.now() - lastAction.value
    return Math.max(0, config.minInterval - timeSinceLastAction)
  })
  
  function recordAction() {
    const now = Date.now()
    lastAction.value = now
    
    if (config.maxAttempts && config.timeWindow) {
      attempts.value.push(now)
    }
  }
  
  function reset() {
    lastAction.value = 0
    attempts.value = []
  }
  
  return {
    canPerformAction,
    timeUntilNextAction,
    recordAction,
    reset
  }
}