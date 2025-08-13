<template>
  <div class="min-h-screen">    
    
    <!-- Main content with left margin on desktop -->
    <div class="max-w-4xl mx-auto p-4 pb-20 md:pb-4">
      <!-- Newspaper Header -->
      <div class="border-b-2 border-gray-900 mb-8 pb-4">
        <h1 :class="[colors.text.primary]" class="text-4xl font-bold text-center font-serif">Cincinnati Tribune</h1>
        <p class="text-center text-gray-500 text-sm mt-1">{{ new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) }}</p>
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
      

      <!-- Newspaper Sections -->
      <div v-else class="space-y-12">
        <!-- Dynamic Topic Sections -->
        <section 
          v-for="(stories, topic) in storiesByTopic" 
          :key="topic"
          class="border-b border-gray-300 pb-8"
        >
          <div class="flex items-center gap-3 mb-6">
            <div class="w-8 h-8 bg-red-600 rounded flex items-center justify-center">
              <span class="text-white text-sm">📰</span>
            </div>
            <h2 :class="[colors.text.primary]" class="text-2xl font-bold font-serif capitalize">{{ topic }}</h2>
            <span class="text-gray-500 text-sm">{{ stories.length }} {{ stories.length === 1 ? 'story' : 'stories' }}</span>
          </div>

          <!-- Stories Grid -->
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <article 
              v-for="story in stories" 
              :key="story.id"
              class="border-l-4 border-red-600 pl-4 cursor-pointer hover:bg-gray-600 transition-colors p-3 -m-3 rounded"
              @click="selectStory(story.id)"
            >
              <h3 :class="[colors.text.primary]" class="font-bold text-lg mb-2 font-serif leading-tight">
                {{ story.headline }}
              </h3>
              <p class="text-gray-100 text-sm mb-3 ">
                {{ story.summary }}
              </p>
              <div class="flex items-center justify-between text-xs text-gray-500">
                <span>{{ story.timeAgo }}</span>
              </div>
              <div v-if="story.tags && story.tags.length > 0" class="flex flex-wrap gap-1 mt-2">
                <span 
                  v-for="tag in story.tags.slice(0, 2)" 
                  :key="tag" 
                  class="inline-block px-2 py-0.5 bg-red-100 text-red-700 text-xs rounded"
                >
                  {{ tag }}
                </span>
              </div>
            </article>
          </div>
        </section>
      </div>

      <!-- Posts Section - Show when story is selected and has posts -->
      <div v-if="selectedStory && selectedStory.posts && selectedStory.posts.length > 0" class="mb-6">
        <div class="flex items-center gap-3 mb-4">
          <div class="w-10 h-10 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center">
            <span class="text-white text-lg">💬</span>
          </div>
          <div>
            <h2 :class="[colors.text.primary]" class="text-xl font-bold">Community Posts</h2>
            <p class="text-gray-500 text-sm">{{ selectedStory.posts.length }} {{ selectedStory.posts.length === 1 ? 'post' : 'posts' }} about this story</p>
          </div>
        </div>

        <!-- Posts List -->
        <div class="space-y-4">
          <PostCard
            v-for="post in selectedStory.posts"
            :key="post.id"
            :content="post.content"
            :username="post.socialMediaAccount.username"
            :platform="post.socialMediaAccount.platform"
          />
        </div>
      </div>
    </div>

    <!-- Authentication Banner - Trumps everything when not authenticated -->
    <div v-if="!isAuthenticated" class="fixed bottom-0 left-0 right-0 bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 shadow-2xl border-t-2 border-white/20 z-[9999]">
      <div class="max-w-md mx-auto text-center">
        <h3 class="text-lg font-bold mb-2">Join Today!</h3>
        <p class="text-sm mb-4 opacity-90">Sign up to create your own custom news feed!!!!</p>
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
import { ref, computed, onMounted, watch } from 'vue'
import { useNewsStore } from '~/stores/news'
import { useAuthStore } from '~/stores/auth'
import JokeCardV1 from '~/components/JokeCardV1.vue'
import StoryCard from '~/components/StoryCard.vue'
import Nav from '~/components/Nav.vue'
import PostCard from '~/components/PostCard.vue'
import { storeToRefs } from 'pinia'

const { colors } = useThemeStore()


const newsStore = useNewsStore()

const authStore = useAuthStore()
const { isAuthenticated } = storeToRefs(authStore)

const selectedStoryId = ref<string>('')
const isExpanded = ref(true)
const isStoriesExpanded = ref(false)

// Methods
const toggleExpanded = () => {
  isExpanded.value = !isExpanded.value
}

const toggleStoriesExpanded = () => {
  isStoriesExpanded.value = !isStoriesExpanded.value
}

const selectStory = (storyId: string) => {
  selectedStoryId.value = storyId
  const story = newsStore.news.find(s => s.id === storyId)
  console.log('Selected story:', story)
}

onMounted(() => {

  // Set first story as selected when news loads
  if (newsStore.news.length > 0) {
    selectedStoryId.value = newsStore.news[0].id
  }
  console.log("newsStore on mounted:", newsStore.news)
})

// Watch for when news data becomes available and auto-select first story
watch(() => newsStore.news, (newNews) => {
  if (newNews.length > 0 && !selectedStoryId.value) {
    selectedStoryId.value = newNews[0].id
    console.log('Auto-selected first story:', newNews[0])
  }
}, { immediate: true })

// Computed property to get the selected story
const selectedStory = computed(() => {
  return newsStore.news.find(story => story.id === selectedStoryId.value)
})

// Computed property to group stories by topic
const storiesByTopic = computed(() => {
  const grouped: Record<string, any[]> = {}
  
  newsStore.news.forEach(story => {
    const topic = story.news?.[0]?.topic || 'General'
    if (!grouped[topic]) {
      grouped[topic] = []
    }
    grouped[topic].push(story)
  })
  
  return grouped
})
</script>


