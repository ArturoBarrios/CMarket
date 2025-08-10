<template>
  <div class="min-h-screen">
    <Nav />
    
    <!-- Main content with left margin on desktop -->
    <div class="md:ml-64 max-w-7xl mx-auto p-4">
      <!-- Header -->
      <div class="mb-8">
        <h1 :class="[colors.text.primary]" class="text-3xl font-bold mb-2">News Management</h1>
        <p class="text-gray-500">Manage and scrape news content</p>
      </div>

      <!-- Create News Section -->
      <div :class="[colors.bg.primary]" class="rounded-lg shadow-sm border  mb-8">
        <h2 :class="[colors.text.primary]" class="text-xl font-semibold mb-4">Create News</h2>
        <form @submit.prevent="createNews" class="space-y-4">
          <div>
            <label for="title" :class="[colors.text.primary]" class="block text-sm font-medium mb-2">Title</label>
            <input
              id="title"
              v-model="newsForm.title"
              type="text"
              required
              class="w-full px-4 py-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white bg-gray-800"
              placeholder="Enter news headline..."
            />
          </div>
          
          <div>
            <label for="summary" :class="[colors.text.primary]" class="block text-sm font-medium mb-2">Summary</label>
            <textarea
              id="summary"
              v-model="newsForm.summary"
              rows="3"
              required
              class="w-full px-4 py-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white bg-gray-800"
              placeholder="Enter a brief summary..."
            ></textarea>
          </div>
          
          <div>
            <label for="content" :class="[colors.text.primary]" class="block text-sm font-medium mb-2">Content</label>
            <textarea
              id="content"
              v-model="newsForm.content"
              rows="6"
              required
              class="w-full px-4 py-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white bg-gray-800"
              placeholder="Enter the full article content..."
            ></textarea>
          </div>
          
          <div class="flex items-center gap-4">
            <button
              type="submit"
              :disabled="creating"
              class="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              <span v-if="creating" class="flex items-center">
                <div class="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Creating...
              </span>
              <span v-else>Create News Article</span>
            </button>
            
            <button
              type="button"
              @click="resetForm"
              class="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 cursor-pointer"
            >
              Reset
            </button>
          </div>
        </form>
        
        <div v-if="createMessage" class="mt-4">
          <p :class="createError ? 'text-red-600' : 'text-green-600'" class="text-sm">
            {{ createMessage }}
          </p>
        </div>
      </div>

      <!-- Scrape Section -->
      <div :class="[colors.bg.primary]" class="rounded-lg shadow-sm border  mb-8">
        <h2 :class="[colors.text.primary]" class="text-xl font-semibold mb-4">Scrape New Stories</h2>
        <div class="flex items-center gap-4">
          <div class="flex items-center gap-2">
            <label for="count" :class="[colors.text.primary]" class="text-sm font-medium">Count:</label>
            <input
              id="count"
              v-model.number="scrapeCount"
              type="number"
              min="1"
              max="50"
              class="w-20 px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white bg-gray-800"
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

      <!-- News Without Content Section -->
      <div :class="[colors.bg.primary]" class="rounded-lg shadow-sm border overflow-hidden mb-8">
        <div class="py-4 border-b border-gray-200 flex justify-between items-center">
          <div>
            <h2 :class="[colors.text.primary]" class="text-xl font-semibold">News Without Content</h2>
            <p class="text-sm text-gray-500 mt-1">{{ newsStore.newsWithoutContent.length }} stories need content</p>
          </div>
          <button
            @click="loadNewsWithoutContent"
            :disabled="newsStore.loadingWithoutContent"
            class=" py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            <span v-if="newsStore.loadingWithoutContent" class="flex items-center">
              <div class="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Loading...
            </span>
            <span v-else>Refresh</span>
          </button>
        </div>

        <!-- Loading State -->
        <div v-if="newsStore.loadingWithoutContent" class="flex justify-center items-center py-12">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          <span class="ml-2 text-gray-600">Loading news without content...</span>
        </div>

        <!-- Error State -->
        <div v-else-if="newsStore.errorWithoutContent" class="text-center py-12">
          <p class="text-red-500 mb-4">{{ newsStore.errorWithoutContent }}</p>
          <button @click="loadNewsWithoutContent" class="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 cursor-pointer">
            Retry
          </button>
        </div>

        <!-- No News State -->
        <div v-else-if="newsStore.newsWithoutContent.length === 0" class="text-center py-12">
          <p class="text-gray-500">No news without content found</p>
          <button @click="loadNewsWithoutContent" class="mt-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 cursor-pointer">
            Load News
          </button>
        </div>

        <!-- News Without Content Table -->
        <div v-else class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class=" py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Title
                </th>
                <th class=" py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  URL
                </th>
                <th class=" py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Time
                </th>
                <th class=" py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody :class="[colors.bg.primary]" class="divide-y divide-gray-200">
              <tr v-for="story in newsStore.newsWithoutContent" :key="story.id">
                <td class=" py-4">
                  <div class="max-w-sm">
                    <h3 :class="[colors.text.primary]" class="text-sm font-medium mb-1">{{ story.title }}</h3>
                    <p v-if="story.summary" :class="[colors.text.primary]" class="text-sm text-gray-400 line-clamp-2">{{ story.summary }}</p>
                  </div>
                </td>
                <td class=" py-4">
                  <a 
                    :href="story.url" 
                    target="_blank" 
                    class="text-blue-600 hover:text-blue-900 text-sm truncate block max-w-xs"
                  >
                    {{ story.url }}
                  </a>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span class="text-sm text-gray-500">{{ story.timeAgo }}</span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div class="flex items-center gap-2">
                    <button
                      @click="handleGenerateContent(story)"
                      :disabled="generatingContentForStory[story.id]"
                      class="px-3 py-1 text-sm font-medium text-green-600 hover:text-green-900 focus:outline-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <span v-if="generatingContentForStory[story.id]" class="flex items-center">
                        <div class="animate-spin rounded-full h-3 w-3 border-b-2 border-green-600 mr-1"></div>
                        Generating...
                      </span>
                      <span v-else>Generate content</span>
                    </button>
                    <button
                      @click="deleteNewsStory(story.id)"
                      class="px-3 py-1 text-sm font-medium text-red-600 hover:text-red-900 cursor-pointer"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- News Table -->
      <div :class="[colors.bg.primary]" class="rounded-lg shadow-sm border overflow-hidden">
        <div class=" py-4 border-b border-gray-200">
          <h2 :class="[colors.text.primary]" class="text-xl font-semibold">All Stories</h2>
          <p class="text-sm text-gray-500 mt-1">{{ newsStore.news.length }} stories total</p>
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
                <th class=" py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Story
                </th>
                <th class=" py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Time
                </th>
                <th class=" py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Sub Content
                </th>
                <th class=" py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody :class="[colors.bg.primary]" class="divide-y divide-gray-200">
              <tr v-for="story in newsStore.news" :key="story.id" class="">
                <td class=" py-4">
                  <div class="max-w-sm">
                    <h3 :class="[colors.text.primary]" class="text-sm font-medium mb-1">{{ story.headline }}</h3>
                    <p :class="[colors.text.primary]" class="text-sm line-clamp-2">{{ story.summary }}</p>
                  </div>
                </td>
                <td class=" py-4 whitespace-nowrap">
                  <span class="text-sm text-gray-500">{{ story.timeAgo }}</span>
                </td>
                <td class=" py-4 whitespace-nowrap">
                  <span class="text-sm text-gray-500">
                    {{ story.subContent.length }} items
                  </span>
                  <div v-if="story.subContent.length > 0" class="text-xs text-gray-400 mt-1">
                    {{ getSubContentTypes(story).join(', ') }}
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div class="space-y-2">
                    <!-- Action buttons row -->
                    <div class="flex items-center gap-2">
                      <button
                        @click="generateMoreContent(story)"
                        class="px-3 py-1 text-sm font-medium text-blue-600 hover:text-blue-900 focus:outline-none cursor-pointer"
                      >
                        Generate more
                      </button>
                      <button
                        @click="viewStory(story)"
                        class="px-3 py-1 text-sm font-medium text-gray-600 hover:text-gray-900 focus:outline-none cursor-pointer"
                      >
                        View
                      </button>
                      <button
                        @click="deleteStory(story.id)"
                        class="px-3 py-1 text-sm font-medium text-red-600 hover:text-red-900 cursor-pointer"
                      >
                        Delete
                      </button>
                    </div>
                    
                    <!-- Generate Context section -->
                    <div class="flex items-center gap-2">
                      <input
                        v-model="contextInputs[story.id]"
                        type="text"
                        placeholder="Enter context..."
                        class="flex-1 px-2 py-1 text-xs border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500 text-white bg-gray-800"
                      />
                      <button
                        @click="generateContext(story, contextInputs[story.id])"
                        :disabled="!contextInputs[story.id] || generatingContext[story.id]"
                        class="px-3 py-1 text-xs font-medium text-purple-600 hover:text-purple-900 focus:outline-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <span v-if="generatingContext[story.id]" class="flex items-center">
                          <div class="animate-spin rounded-full h-3 w-3 border-b-2 border-purple-600 mr-1"></div>
                          Generating...
                        </span>
                        <span v-else>Generate Context</span>
                      </button>
                    </div>
                  </div>
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
import { ref, onMounted, onUnmounted } from 'vue'
import { useNewsStore } from '~/stores/news'
import Nav from '~/components/Nav.vue'

const { colors } = useThemeStore()
const { sendStoryToAPI } = useStoryAPI()
const { generateContent } = useContentGeneration()
const { deleteNews } = useNewsAPI()

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
    const tenDaysAgo = new Date()
    tenDaysAgo.setDate(tenDaysAgo.getDate() - 10)
    await newsStore.getNewsToday(tenDaysAgo.toISOString())
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
  if (confirm('Are you sure you want to delete this news story?')) {
    try {
      const result = await deleteNews(storyId)
      
      if (result.success) {
        console.log('News story deleted successfully:', result.message)
        // Refresh the news without content list
        await loadNewsWithoutContent()
      } else {
        console.error('Failed to delete news story:', result.message)
        // You could add a toast notification here
      }
    } catch (error) {
      console.error('Delete news story error:', error)
    }
  }
}

// Create news functionality
const newsForm = ref({
  title: '',
  summary: '',
  content: ''
})
const creating = ref(false)
const createMessage = ref('')
const createError = ref(false)

const createNews = async () => {
  creating.value = true
  createMessage.value = ''
  createError.value = false

  try {
    const result = await sendStoryToAPI({
      title: newsForm.value.title,
      summary: newsForm.value.summary,
      content: newsForm.value.content
    })

    if (result.success) {
      createMessage.value = 'News article created successfully!'
      createError.value = false
      resetForm()
      
      // Refresh news after creating
      const tenDaysAgo = new Date()
      tenDaysAgo.setDate(tenDaysAgo.getDate() - 10)
      await newsStore.getNewsToday(tenDaysAgo.toISOString())
    } else {
      createMessage.value = result.error || 'Failed to create news article. Please try again.'
      createError.value = true
    }
  } catch (error) {
    console.error('Create news error:', error)
    createMessage.value = 'Failed to create news article. Please try again.'
    createError.value = true
  } finally {
    creating.value = false
  }
}

const resetForm = () => {
  newsForm.value = {
    title: '',
    summary: '',
    content: ''
  }
  createMessage.value = ''
  createError.value = false
}

const loadNewsWithoutContent = async () => {
  try {
    await newsStore.getNewsWithoutContent()
  } catch (error) {
    console.error('Failed to load news without content:', error)
  }
}

const processStory = (story: any) => {
  console.log('Processing story:', story)
  // You can implement processing logic here
}

const deleteNewsStory = async (storyId: string) => {
  if (confirm('Are you sure you want to delete this news story?')) {
    try {
      const result = await deleteNews(storyId)
      
      if (result.success) {
        console.log('News story deleted successfully:', result.message)
        // Refresh the news without content list
        await loadNewsWithoutContent()
      } else {
        console.error('Failed to delete news story:', result.message)
        // You could add a toast notification here
      }
    } catch (error) {
      console.error('Delete news story error:', error)
    }
  }
}

// Generate Context functionality
const contextInputs = ref<Record<string, string>>({})
const generatingContext = ref<Record<string, boolean>>({})

const generateContext = async (story: any, context: string) => {
  if (!context || !context.trim()) return
  
  generatingContext.value[story.id] = true
  
  try {
    console.log('Generating context for story:', story.id, 'with context:', context)
    // Implement context generation logic here
    
    // Clear the input after successful generation
    contextInputs.value[story.id] = ''
  } catch (error) {
    console.error('Generate context error:', error)
  } finally {
    generatingContext.value[story.id] = false
  }
}

// Generate Content functionality for news without content
const generatingContentForStory = ref<Record<string, boolean>>({})

const handleGenerateContent = async (story: any) => {
  generatingContentForStory.value[story.id] = true
  
  try {
    const result = await generateContent(story.id)
    
    if (result.success) {
      console.log('Content generated successfully for story:', story.id)
      // Refresh the news without content list
      await loadNewsWithoutContent()
      // Also refresh the main news list
      const tenDaysAgo = new Date()
      tenDaysAgo.setDate(tenDaysAgo.getDate() - 10)
      await newsStore.getNewsToday(tenDaysAgo.toISOString())
    } else {
      console.error('Failed to generate content:', result.error)
      // You could add a toast notification here
    }
  } catch (error) {
    console.error('Generate content error:', error)
  } finally {
    generatingContentForStory.value[story.id] = false
  }
}

onMounted(() => {
  // Load news when component mounts
  console.log('Fetching news on admin mount...')
  const tenDaysAgo = new Date()
  tenDaysAgo.setDate(tenDaysAgo.getDate() - 10)
  newsStore.getNewsToday(tenDaysAgo.toISOString())

  // Load news without content
  loadNewsWithoutContent()
})

onUnmounted(() => {
})

const generateMoreContent = (story: any) => {
  console.log('Generating more content for story:', story)
  // Implement more content generation logic here
}
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
