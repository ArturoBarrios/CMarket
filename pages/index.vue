<template>
  <div class="max-w-2xl mx-auto p-4">
    <h1 class="text-3xl font-bold mb-6 text-center">CMarket</h1>
    
    <!-- Create Joke Input -->
    <CreateInput />
    
    <!-- Jokes Feed -->
    <div v-if="jokesStore.loading" class="text-center py-8">Loading jokes...</div>
    <div v-else-if="jokesStore.error" class="text-red-500 text-center py-8">{{ jokesStore.error }}</div>
    <div v-else class="space-y-4">
      <JokeCardV1
        v-for="joke in jokesStore.jokes"
        :key="joke.id"
        :joke="joke.content"
        :username="joke.user.username"
        :likes="joke.likes || 0"
        :jokeId="joke.id"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useJokesStore } from '~/stores/jokes'
import CreateInput from '~/components/CreateInput.vue'
import JokeCardV1 from '~/components/JokeCardV1.vue'
import { onMounted } from 'vue'

const jokesStore = useJokesStore()

onMounted(() => {
  if (!jokesStore.jokes.length) {
    jokesStore.fetchJokes()
  }
})
</script>