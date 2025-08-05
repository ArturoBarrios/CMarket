<template>
  <div class="min-h-screen bg-gray-50">
    <Nav />
    
    <!-- Main content with left margin on desktop -->
    <div class="md:ml-64 max-w-7xl mx-auto p-4">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900 mb-2">News Management</h1>
        <p class="text-gray-600">Manage and scrape news content</p>
      </div>

      <!-- Scrape Section -->
      <div class="bg-white rounded-lg shadow-sm border p-6 mb-8">
        <h2 class="text-xl font-semibold text-gray-900 mb-4">Scrape New Stories</h2>
        <div class="flex items-center gap-4">
          <div class="flex items-center gap-2">
            <label for="count" class="text-sm font-medium text-gray-700">Count:</label>
            <input
              id="count"
              v-model.number="scrapeCount"
              type="number"
              min="1"
              max="50"
              class="w-20 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <button
            @click="scrapeNYTimes"
            :disabled="scraping"
            class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            <span v-if="scraping" class="flex items-center">
              <div class="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Scraping...
            </span>
            <span v-else>Scrape NYTimes</span>
          </button>
        </div>
        <div v-if="scrapeMessage" class="mt-4">
          <p :class="scrapeError ? 'text-red-600' : 'text-green-600'" class="text-sm">
            {{ scrapeMessage }}
          </p>
        </div>
      </div>

      <!-- News Table -->
      <div class="bg-white rounded-lg shadow-sm border overflow-hidden">
        <div class="px-6 py-4 border-b border-gray-200">
          <h2 class="text-xl font-semibold text-gray-900">All Stories</h2>
          <p class="text-sm text-gray-600 mt-1">{{ newsStore.news.length }} stories total</p>
        </div>

        <!-- Loading State -->
        <div v-if="newsStore.loading" class="flex justify-center items-center py-12">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          <span class="ml-2 text-gray-600">Loading news...</span>
        </div>

        <!-- Error State -->
        <div v-else-if="newsStore.error" class="text-center py-12">
          <p class="text-red-500 mb-4">{{ newsStore.error }}</p>
          <button @click="newsStore.getNewsToday()" class="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 cursor-pointer">
            Retry
          </button>
        </div>

        <!-- No News State -->
        <div v-else-if="newsStore.news.length === 0" class="text-center py-12">
          <p class="text-gray-500">No news available</p>
          <button @click="newsStore.getNewsToday()" class="mt-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 cursor-pointer">
            Load News
          </button>
        </div>

        <!-- News Table -->
        <div v-else class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Story
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Time
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Sub Content
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="story in newsStore.news" :key="story.id" class="hover:bg-gray-50">
                <td class="px-6 py-4">
                  <div class="max-w-sm">
                    <h3 class="text-sm font-medium text-gray-900 mb-1">{{ story.headline }}</h3>
                    <p class="text-sm text-gray-600 line-clamp-2">{{ story.summary }}</p>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span class="text-sm text-gray-500">{{ story.timeAgo }}</span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span class="text-sm text-gray-500">
                    {{ story.subContent.length }} items
                  </span>
                  <div v-if="story.subContent.length > 0" class="text-xs text-gray-400 mt-1">
                    {{ getSubContentTypes(story).join(', ') }}
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    @click="viewStory(story)"
                    class="text-blue-600 hover:text-blue-900 mr-3 cursor-pointer"
                  >
                    View
                  </button>
                  <button
                    @click="deleteStory(story.id)"
                    class="text-red-600 hover:text-red-900 cursor-pointer"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useNewsStore } from '~/stores/news'
import Nav from '~/components/Nav.vue'

const newsStore = useNewsStore()

// Scraping functionality
const scrapeCount = ref(5)
const scraping = ref(false)
const scrapeMessage = ref('')
const scrapeError = ref(false)

// Get API base URL from runtime config
const config = useRuntimeConfig()
const API_BASE_URL = config.public.capi

const scrapeNYTimes = async () => {
  scraping.value = true
  scrapeMessage.value = ''
  scrapeError.value = false

  try {
    const response = await $fetch(`${API_BASE_URL}/scrape-nytimes`, {
      method: 'POST',
      body: { count: scrapeCount.value },
      headers: {
        'Content-Type': 'application/json'
      }
    })

    scrapeMessage.value = `Successfully scraped ${scrapeCount.value} stories from NYTimes`
    scrapeError.value = false
    
    // Refresh news after scraping
    await newsStore.getNewsToday()
  } catch (error) {
    console.error('Scraping error:', error)
    scrapeMessage.value = 'Failed to scrape stories. Please try again.'
    scrapeError.value = true
  } finally {
    scraping.value = false
  }
}

const getSubContentTypes = (story: any) => {
  return [...new Set(story.subContent.map((sub: any) => sub.type))]
}

const viewStory = (story: any) => {
  console.log('Viewing story:', story)
  // You can implement a modal or navigation to detailed view
}

const deleteStory = async (storyId: string) => {
  if (confirm('Are you sure you want to delete this story?')) {
    console.log('Deleting story:', storyId)
    // Implement delete functionality if needed
  }
}

onMounted(() => {
  // Load news when component mounts
  newsStore.getNewsToday()
})
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
