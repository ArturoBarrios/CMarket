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
          class="flex items-center gap-3 mb-4 cursor-pointer rounded-lg p-2 -m-2 transition-colors"
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
          <!-- First story (always visible) -->
          <StoryCard
            v-if="newsStore.news[0]"
            :key="newsStore.news[0].id"
            :id="newsStore.news[0].id"
            :headline="newsStore.news[0].headline"
            :summary="newsStore.news[0].summary"
            :time-ago="newsStore.news[0].timeAgo"
            :tags="newsStore.news[0].tags"
            :source="newsStore.news[0].source || 'Unknown Source'"
            :sub-content="newsStore.news[0].subContent"
            :is-selected="selectedStoryId === newsStore.news[0].id"
            @select="selectStory"
          />

          <!-- Show More Stories Button (only if there are more stories and not expanded) -->
          <div v-if="newsStore.news.length > 1 && !isStoriesExpanded" class="relative my-6">
            
            <div class="relative flex justify-end">
              <button
                @click="toggleStoriesExpanded"
                class=" px-6 py-3 text-sm font-medium text-white rounded-full bg-gray-800 transition-colors duration-200 flex items-center gap-2 cursor-pointer"
              >
                <span>Show More Stories</span>
                <svg 
                  class="w-4 h-4" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                </svg>
              </button>
            </div>
          </div>

          <!-- Additional stories (toggleable) -->
          <div v-if="isStoriesExpanded && newsStore.news.length > 1" class="space-y-4">
            <StoryCard
              v-for="story in newsStore.news.slice(1)"
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

          <!-- Show Less Stories Button (when expanded, appears below stories) -->
          <div v-if="newsStore.news.length > 1 && isStoriesExpanded" class="relative my-6">
            
            <div class="relative flex justify-end">
              <button
                @click="toggleStoriesExpanded"
                class="px-6 py-3 text-sm font-medium text-white rounded-full bg-gray-800 transition-colors duration-200 flex items-center gap-2 cursor-pointer"
              >
                <span>Show Less Stories</span>
                <svg 
                  class="w-4 h-4 rotate-180" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                </svg>
              </button>
            </div>
          </div>
        </div>
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
</script>

