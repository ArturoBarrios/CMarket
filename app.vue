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
import { onMounted } from 'vue'

const jokesStore = useJokesStore()

onMounted(() => {
  console.log('Fetching jokes on app mount...')
  jokesStore.fetchJokes()
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