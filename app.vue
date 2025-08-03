<template>
  <div class="bg-black">
    <NuxtRouteAnnouncer />
    <div class="container place-self-center ">
      <NuxtPage />
    </div>
  </div>
</template>
<script setup lang="ts">
import { useJokesStore } from '~/stores/jokes'
import { useNewsStore } from '~/stores/news'
import { onMounted } from 'vue'

const jokesStore = useJokesStore()
const newsStore = useNewsStore()

onMounted(() => {
  console.log('Fetching news on app mount...')
  newsStore.getNewsToday();
  // jokesStore.fetchJokes()
})
</script>

<style>
html, body {
  overscroll-behavior: none;
  -webkit-overflow-scrolling: touch;
}

/* For iOS Safari specifically */
body {
  position: relative;
  overflow-x: hidden;
}
</style>