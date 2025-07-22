<template>
  <div class="border border-gray-200 rounded-xl p-5 bg-white  shadow mb-4">
    <div class="text-base mb-4 text-gray-800">{{ joke }}</div>
    <div class="flex justify-between items-center">
      <span class="font-semibold text-teal-400">@{{ username }}</span>
      
      <div class="flex items-center gap-4">
        <span class="flex items-center gap-1 text-yellow-500 font-medium">
            <span>{{ likes }}</span>
            <button
          class="cursor-pointer text-green-500 hover:text-green-600 transition"
          @click="onRetweetClick"
          title="Retweet this joke"
        >
          🔁
        </button>
            <span>{{ likes }}</span>
            <span
            class="cursor-pointer"
            @click="onLaughClick"
            title="Like this joke"
            >😂</span>
            <span>{{ likes }}</span>
          <span
            class="cursor-pointer"
            @click="onLaughClick"
            title="Like this joke"
          >😑</span>
        </span>
        
      </div>
    </div>
    <div v-if="showSignup" class="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div class="bg-white p-6 rounded shadow max-w-xs text-center">
        <h2 class="text-lg font-bold mb-2">Sign Up Required</h2>
        <p class="mb-4">Please sign up to like jokes!</p>
        <button class="px-4 py-2 bg-blue-600 text-white rounded" @click="showSignup = false">Close</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useLikeJoke } from '~/composables/useLikeJoke'

const props = defineProps<{
  joke: string
  username: string
  likes: number
  jokeId: string
}>()

const showSignup = ref(false)
const { likeJoke } = useLikeJoke()

function onLaughClick() {
    console.log('Laugh clicked for joke:', props.jokeId)
  // Here, since we don't have login, always show signup modal
  showSignup.value = true
  // Example for future use:
  // likeJoke(props.jokeId, userId)
}
</script>