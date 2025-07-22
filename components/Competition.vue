<template>
  <div class="bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl p-4 text-white">
    <h3 class="text-lg font-bold mb-2">🏆 Daily Competition</h3>
    <p class="text-sm mb-3">Top joke gets $10!</p>
    
    <div class="bg-white bg-opacity-20 rounded-lg p-3">
      <div class="text-xs mb-1 opacity-90">Time remaining:</div>
      <div class="font-mono text-black text-sm font-bold">
        {{ timeRemaining }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const timeRemaining = ref('')
let interval: NodeJS.Timeout

function updateCountdown() {
  const now = new Date()
  const tomorrow = new Date(now)
  tomorrow.setDate(tomorrow.getDate() + 1)
  tomorrow.setHours(0, 0, 0, 0) // Reset to midnight
  
  const diff = tomorrow.getTime() - now.getTime()
  
  const hours = Math.floor(diff / (1000 * 60 * 60))
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
  const seconds = Math.floor((diff % (1000 * 60)) / 1000)
  
  timeRemaining.value = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
}

onMounted(() => {
  updateCountdown()
  interval = setInterval(updateCountdown, 1000)
})

onUnmounted(() => {
  if (interval) {
    clearInterval(interval)
  }
})
</script>
