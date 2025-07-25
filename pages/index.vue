<template>
  <div class="min-h-screen">
    <Nav />
    
    <!-- Main content with left margin on desktop -->
    <div class="md:ml-64 max-w-2xl mx-auto p-4 pb-20 md:pb-4">      
      <!-- Create Joke Input -->
      <CreateInput />
      
      <!-- Jokes Feed -->
      <div v-if="loading" class="text-center py-8">Loading jokes...</div>
      <div v-else class="space-y-4">
        <JokeCardV1
          v-for="joke in jokes"
          :key="joke.id"
          :joke="joke.content"
          :username="joke.user ? joke.user.username : joke.username"
          :likes="joke.likes || 0"
          :dislikes="joke.dislikes || 0"
          :retweets="joke.retweets || 0"
          :jokeId="joke.id"
          :userLiked="joke.userLiked"
          :userRetweeted="joke.userRetweeted"
          :timeAgo="joke.timeAgo"
        />
      </div>
    </div>

    <!-- Authentication Banner - Trumps everything when not authenticated -->
    <div v-if="!isAuthenticated" class="fixed bottom-0 left-0 right-0 bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 shadow-2xl border-t-2 border-white/20 z-[9999]">
      <div class="max-w-md mx-auto text-center">
        <h3 class="text-lg font-bold mb-2">Join CMarkett Today!</h3>
        <p class="text-sm mb-4 opacity-90">Sign up to create jokes, vote, and compete with others!</p>
        <div class="flex space-x-3">
          <NuxtLink 
            to="/signup" 
            class="flex-1 bg-white text-blue-600 font-semibold py-2 px-4 rounded-lg hover:bg-gray-100 transition duration-200">
            Sign Up
          </NuxtLink>
          <NuxtLink 
            to="/login" 
            class="flex-1 bg-transparent border-2 border-white text-white font-semibold py-2 px-4 rounded-lg hover:bg-white/10 transition duration-200">
            Login
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useJokesStore } from '~/stores/jokes'
import { useAuthStore } from '~/stores/auth'
import CreateInput from '~/components/CreateInput.vue'
import JokeCardV1 from '~/components/JokeCardV1.vue'
import Nav from '~/components/Nav.vue'
import { onMounted } from 'vue'
import { storeToRefs } from 'pinia'

const jokesStore = useJokesStore()
const { jokes, loading } = storeToRefs(jokesStore)

const authStore = useAuthStore()
const { isAuthenticated } = storeToRefs(authStore)

onMounted(() => {
  if (!jokesStore.jokes.length) {
    jokesStore.fetchJokes()
  }
  console.log("Jokes fetched:", jokesStore.jokes)
})
</script>