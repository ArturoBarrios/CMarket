<template>
  <div :class="[colors.border.primary, colors.bg.primary]" class="border border-gray-200 rounded-xl p-4  shadow mb-6">
    <textarea
      v-model="jokeText"
      placeholder="Write a joke..."
      :class="[colors.text.primary]"
      class="w-full resize-none border-none outline-none text-lg placeholder-gray-500"
      rows="3"
      maxlength="280"
    ></textarea>
    <div class="flex justify-between items-center mt-3 pt-3 border-t border-gray-100">
      <div class="flex flex-col items-center">
        <div class="w-8 h-8">
          <svg class="w-full h-full transform -rotate-90" viewBox="0 0 32 32">
            <!-- Background circle -->
            <circle
              cx="16"
              cy="16"
              r="14"
              fill="none"
              stroke="#e5e7eb"
              stroke-width="2"
            />
            <!-- Progress circle -->
            <circle
              cx="16"
              cy="16"
              r="14"
              fill="none"
              :stroke="circleColor"
              stroke-width="2"
              stroke-linecap="round"
              :stroke-dasharray="circumference"
              :stroke-dashoffset="strokeDashoffset"
              class="transition-all duration-300"
            />
          </svg>
        </div>
        <div class="text-xs mt-1" :class="textColor">
          {{ charactersLeft }} left
        </div>
      </div>
      <button
        @click="postJoke"
        :disabled="!canPost"
        :class="[colors.text.secondary]"
        class="px-6 py-2 bg-blue-500 rounded-full font-semibold cursor-pointer transition disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-blue-600"
      >
        Post Joke
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

const { colors } = useThemeStore()

const jokeText = ref('')

const charactersLeft = computed(() => 280 - jokeText.value.length)
const canPost = computed(() => jokeText.value.trim().length > 0 && jokeText.value.length <= 280)

// Circle progress calculations
const circumference = 2 * Math.PI * 14 // radius = 14
const progress = computed(() => jokeText.value.length / 280)
const strokeDashoffset = computed(() => circumference * (1 - progress.value))
const circleColor = computed(() => charactersLeft.value <= 50 ? '#ef4444' : '#22c55e')
const textColor = computed(() => charactersLeft.value <= 50 ? 'text-red-500' : 'text-green-500')

function postJoke() {
  if (!canPost.value) return
  
  // For now, just show an alert - later this will call your API
  alert(`Posting joke: "${jokeText.value}"`)
  
  // Clear the input after posting
  jokeText.value = ''
}
</script>