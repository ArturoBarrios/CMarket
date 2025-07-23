<template>
  <div class="min-h-screen">
    <Nav />
    
    <!-- Main content with left margin on desktop -->
    <div class="md:ml-64 max-w-2xl mx-auto p-4 pb-20 md:pb-4">      
      <!-- Create Joke Input -->
      <CreateInput />
      
      <!-- Jokes Feed -->
      <div v-if="loading" class="text-center py-8">Loading jokes...</div>
      <div v-else-if="error" class="text-red-500 text-center py-8">{{ error }}</div>
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
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useJokesStore } from '~/stores/jokes'
import CreateInput from '~/components/CreateInput.vue'
import JokeCardV1 from '~/components/JokeCardV1.vue'
import Nav from '~/components/Nav.vue'
import { onMounted } from 'vue'
import { storeToRefs } from 'pinia'

const jokesStore = useJokesStore()
const { jokes, loading, error } = storeToRefs(jokesStore)

onMounted(() => {
  if (!jokesStore.jokes.length) {
    jokesStore.fetchJokes()
  }
  console.log("Jokes fetched:", jokesStore.jokes)
})
</script>