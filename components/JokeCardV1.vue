<template>
  <div
   :class="[colors.bg.primary]"
   class="border border-gray-200 rounded-xl p-5 shadow mb-4">
    <div 
    :class="[colors.text.primary]"
    class="text-base mb-4 text-gray-800">{{ joke }}</div>
    <div class="flex justify-between items-center">
      <span class="font-semibold text-teal-400">@{{ username }}</span>
      
      <div class="flex items-center gap-4">
        <span class="flex items-center gap-1 text-yellow-500 font-medium">
            <button
              :class="isRetweeted ? 'text-yellow-400 brightness-125 drop-shadow-lg scale-110' : 'text-gray-500 hover:text-gray-600'"
              class="cursor-pointer text-green-500 hover:text-green-600 transition"
              @click="onRetweetClick"
              title="Retweet this joke">
              🔁
            </button>
            <span>{{ retweetCount }}</span>
            <button
            class="cursor-pointer transition text-lg"
            :class="isLiked ? 'text-yellow-400 brightness-125 drop-shadow-lg scale-110' : 'text-gray-500 hover:text-gray-600'"
            @click="onLaughClick"
            title="Like this joke"
            >😂</button>
            <span>{{ currentLikes }}</span>
        </span>
        
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { useLikeJoke } from '~/composables/useLikeJoke'

const { colors } = useThemeStore()
const authStore = useAuthStore()

const props = defineProps<{
  joke: string
  username: string
  likes: number
  retweets: number
  jokeId: string
  userLiked?: boolean
  userRetweeted?: boolean
}>()


const currentLikes = ref(props.likes)
const retweetCount = ref(props.retweets)
const { toggleLike } = useLikeJoke()
const { toggleRetweet } = useRetweetJoke()

const isLiked = ref(props.userLiked || false)
const isRetweeted = ref(props.userRetweeted || false)

if(props.jokeId == "49c42d17-b365-4342-a087-aff46db5cb0e"){
    console.log("Joke ID is 627c518f-2386-438a-a335-8c418749261b")
    console.log("Initial likes:", props.likes)
    console.log("User liked status:", props.userLiked)
}
async function onLaughClick() {
  if (!authStore.isAuthenticated) {
    await navigateTo('/login')
    return
  }
  
  const newLikedState = !isLiked.value
  try {
    // Simple logic: if going to liked state (true), increment; if going to unliked (false), decrement
    if (newLikedState) {
      // Going from unliked to liked
      currentLikes.value += 1
    } else {
      // Going from liked to unliked
      currentLikes.value -= 1
    }
    
    await toggleLike(props.jokeId, authStore.user?.id || '', newLikedState)
    isLiked.value = newLikedState
  } catch (error) {
    console.error('Error toggling joke like:', error)
    // Revert the count change on error
    if (newLikedState) {
      currentLikes.value -= 1
    } else {
      currentLikes.value += 1
    }
  }
}

async function onRetweetClick() {
  if (!authStore.isAuthenticated) {
    navigateTo('/login')
    return
  }

  const newRetweetedState = !isRetweeted.value
  try {
    // Simple logic: if going to liked state (true), increment; if going to unliked (false), decrement
    if (newRetweetedState) {
      // Going from unliked to liked
      retweetCount.value += 1
    } else {
      // Going from liked to unliked
      retweetCount.value -= 1
    }
    
    await toggleRetweet(props.jokeId, authStore.user?.id || '', newRetweetedState)
    isRetweeted.value = newRetweetedState
  } catch (error) {
    console.error('Error toggling joke like:', error)
    // Revert the count change on error
    if (newRetweetedState) {
      retweetCount.value -= 1
    } else {
      retweetCount.value += 1
    }
  }


  
  console.log('Retweet clicked for joke:', props.jokeId)
}
</script>