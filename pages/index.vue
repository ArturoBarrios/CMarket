<template>
  <div class="min-h-screen">
    <Nav />
    
    <!-- Main content with left margin on desktop -->
    <div class="md:ml-64 max-w-2xl mx-auto p-4 pb-20 md:pb-4">      
      <!-- Stories Section -->
      <div class="mb-6">
        <!-- Expandable header -->
        <div 
          @click="toggleExpanded"
          class="flex items-center gap-3 mb-4 cursor-pointer hover:bg-gray-50 rounded-lg p-2 -m-2 transition-colors"
        >
          <div class="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
            <span class="text-white text-lg">📰</span>
          </div>
          <div>
            <h2 :class="[colors.text.primary]" class="text-xl font-bold">Today's News</h2>
            <p class="text-gray-500 text-sm">{{ newsStore.news.length }} {{ newsStore.news.length === 1 ? 'story' : 'stories' }} available</p>
          </div>
        </div>

        <!-- Loading State -->
        <div v-if="newsStore.loading" class="flex justify-center items-center py-8">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          <span class="ml-2 text-gray-600">Loading news...</span>
        </div>

        <!-- Error State -->
        <div v-else-if="newsStore.error" class="text-center py-8">
          <p class="text-red-500">{{ newsStore.error }}</p>
          <button @click="newsStore.getNewsToday()" class="mt-2 px-4 py-2 bg-blue-500 text-white rounded">
            Retry
          </button>
        </div>

        <!-- No News State -->
        <div v-else-if="newsStore.news.length === 0" class="text-center py-8">
          <p class="text-gray-500">No news available</p>
        </div>

        <!-- Stories grid -->
        <div v-else-if="isExpanded" class="space-y-4">
          <StoryCard
            v-for="story in newsStore.news"
            :key="story.id"
            :id="story.id"
            :headline="story.headline"
            :summary="story.summary"
            :time-ago="story.timeAgo"
            :tags="story.tags"
            :source="story.source || 'Unknown Source'"
            :sub-content="story.subContent"
            :is-selected="selectedStoryId === story.id"
            @select="selectStory"
          />
        </div>
      </div>

      <!-- Top Opinions Section Header -->
      <div class="mb-6">
        <div class="flex items-center gap-3 mb-4">
          <div class="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center">
            <span class="text-white text-lg">💭</span>
          </div>
          <div>
            <h2 :class="[colors.text.primary]" class="text-xl font-bold">Top Opinions</h2>
            <p class="text-gray-500 text-sm">Community reactions and comedy</p>
          </div>
        </div>
      </div>
      
      <!-- Jokes Feed -->
      <div v-if="loading" class="text-white text-center py-8">Loading jokes...</div>
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
        <h3 class="text-lg font-bold mb-2">Join Story Town Today!</h3>
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
import { ref, computed } from 'vue'
import { useJokesStore } from '~/stores/jokes'
import { useNewsStore } from '~/stores/news'
import { useAuthStore } from '~/stores/auth'
import JokeCardV1 from '~/components/JokeCardV1.vue'
import StoryCard from '~/components/StoryCard.vue'
import Nav from '~/components/Nav.vue'
import { onMounted } from 'vue'
import { storeToRefs } from 'pinia'

const { colors } = useThemeStore()

const jokesStore = useJokesStore()
const { jokes, loading } = storeToRefs(jokesStore)

const newsStore = useNewsStore()

const authStore = useAuthStore()
const { isAuthenticated } = storeToRefs(authStore)

const selectedStoryId = ref<string>('')
const isExpanded = ref(true)

// Methods
const toggleExpanded = () => {
  isExpanded.value = !isExpanded.value
}

const selectStory = (storyId: string) => {
  selectedStoryId.value = storyId
  const story = newsStore.news.find(s => s.id === storyId)
  console.log('Selected story:', story)
}

onMounted(() => {
  if (!jokesStore.jokes.length) {
    jokesStore.fetchJokes()
  }
  // Set first story as selected when news loads
  if (newsStore.news.length > 0) {
    selectedStoryId.value = newsStore.news[0].id
  }
  console.log("Jokes fetched:", jokesStore.jokes)
})
</script>

<style scoped>
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
</style>