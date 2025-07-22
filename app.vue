<template>
  <div>
    <NuxtRouteAnnouncer />
    <div class="container">
      <NuxtPage />
    </div>
  </div>
</template>
<script setup lang="ts">
import { useJokesStore } from '~/stores/jokes'
import { onMounted } from 'vue'

const jokesStore = useJokesStore()

onMounted(() => {
  console.log('Fetching jokes on app mount...')
  jokesStore.fetchJokes()
})
</script>