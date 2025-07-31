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
          <div class="flex-1">
            <h2 :class="[colors.text.primary]" class="text-xl font-bold">{{ selectedCategory.name }}</h2>
            <p class="text-gray-500 text-sm">{{ selectedCategory.description }}</p>
          </div>
          <div class="text-gray-400">
            <span class="text-2xl transition-transform duration-200" :class="{ 'rotate-180': isExpanded }">⌄</span>
          </div>
        </div>

        <!-- Category tabs (horizontal scrollable) with blur gradients -->
        <div v-if="isExpanded" class="mb-4 relative">
          <div class="overflow-x-auto scrollbar-hide">
            <div class="flex gap-2 pb-2">
              <button
                v-for="category in categories"
                :key="category.id"
                @click="selectCategory(category)"
                :class="[
                  selectedCategory.id === category.id 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200',
                  'px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors'
                ]"
              >
                {{ category.emoji }} {{ category.name }}
              </button>
            </div>
          </div>
          
           
        </div>

        <!-- Stories grid -->
        <div v-if="isExpanded" class="flex gap-3 items-stretch">
          <div class="flex-1">
            <StoryCard
              :id="currentStories[0].id"
              :headline="currentStories[0].headline"
              :summary="currentStories[0].summary"
              :time-ago="currentStories[0].timeAgo"
              :tags="currentStories[0].tags"
              :source="currentStories[0].source"
              :is-selected="selectedStoryId === currentStories[0].id"
              @select="selectStory"
              class="h-full"
            />
          </div>
          <div class="flex-1">
            <StoryCard
              :id="currentStories[1].id"
              :headline="currentStories[1].headline"
              :summary="currentStories[1].summary"
              :time-ago="currentStories[1].timeAgo"
              :tags="currentStories[1].tags"
              :source="currentStories[1].source"
              :is-selected="selectedStoryId === currentStories[1].id"
              @select="selectStory"
              class="h-full"
            />
          </div>
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
import { useAuthStore } from '~/stores/auth'
import JokeCardV1 from '~/components/JokeCardV1.vue'
import StoryCard from '~/components/StoryCard.vue'
import Nav from '~/components/Nav.vue'
import { onMounted } from 'vue'
import { storeToRefs } from 'pinia'

const { colors } = useThemeStore()

const jokesStore = useJokesStore()
const { jokes, loading } = storeToRefs(jokesStore)

const authStore = useAuthStore()
const { isAuthenticated } = storeToRefs(authStore)

const selectedStoryId = ref<string>('1')
const isExpanded = ref(true)
const selectedCategoryId = ref('top-stories')

// 10 Categories
const categories = ref([
  { id: 'top-stories', name: 'Top Stories', emoji: '📰', description: 'Latest news and updates' },
  { id: 'technology', name: 'Technology', emoji: '💻', description: 'Latest tech innovations' },
  { id: 'movies', name: 'Movies', emoji: '🎬', description: 'Film news and reviews' },
  { id: 'video-games', name: 'Video Games', emoji: '🎮', description: 'Gaming industry updates' },
  { id: 'music', name: 'Music', emoji: '🎵', description: 'Music industry news' },
  { id: 'science', name: 'Science', emoji: '🔬', description: 'Scientific discoveries' },
  { id: 'space', name: 'Space', emoji: '🚀', description: 'Space exploration news' },
  { id: 'health', name: 'Health', emoji: '🏥', description: 'Health and wellness' },
  { id: 'sports', name: 'Sports', emoji: '⚽', description: 'Sports highlights' },
  { id: 'cooking', name: 'Cooking', emoji: '👨‍🍳', description: 'Food and recipes' }
])

// Stories data for each category
const allStories = ref({
  'top-stories': [
    {
      id: '1',
      headline: 'Trump Announces Major AI Initiative for 2025 Campaign',
      summary: 'Former President Donald Trump unveiled plans to integrate artificial intelligence tools into his campaign strategy, promising to use AI for better voter outreach and policy development.',
      timeAgo: '2 hours ago',
      tags: ['Trump', 'AI', 'Politics'],
      source: '24 sources'
    },
    {
      id: '2',
      headline: 'Elon Musk\'s xAI Reaches $50 Billion Valuation After Latest Funding Round',
      summary: 'Elon Musk\'s artificial intelligence company xAI has secured a massive funding round, bringing its valuation to $50 billion. The company plans to compete directly with OpenAI.',
      timeAgo: '4 hours ago',
      tags: ['Elon Musk', 'AI', 'Startup'],
      source: '30 sources'
    }
  ],
  'technology': [
    {
      id: '3',
      headline: 'Apple Unveils Revolutionary AR Glasses at Developer Conference',
      summary: 'Apple\'s new augmented reality glasses promise to revolutionize how we interact with digital content, featuring advanced spatial computing and all-day battery life.',
      timeAgo: '1 hour ago',
      tags: ['Apple', 'AR', 'Innovation'],
      source: 'TechCrunch'
    },
    {
      id: '4',
      headline: 'Google Announces Breakthrough in Quantum Computing',
      summary: 'Google\'s quantum computer achieves new milestone in solving complex problems that would take classical computers thousands of years to complete.',
      timeAgo: '3 hours ago',
      tags: ['Google', 'Quantum', 'Computing'],
      source: 'Wired'
    }
  ],
  'movies': [
    {
      id: '5',
      headline: 'Marvel Studios Announces Phase 6 Movie Lineup',
      summary: 'Marvel reveals exciting new superhero films including Fantastic Four reboot and X-Men introduction to the MCU, scheduled for release through 2027.',
      timeAgo: '5 hours ago',
      tags: ['Marvel', 'MCU', 'Superhero'],
      source: 'Entertainment Weekly'
    },
    {
      id: '6',
      headline: 'Christopher Nolan\'s Next Film Gets 2026 Release Date',
      summary: 'The acclaimed director\'s mysterious new project starring Tom Holland and Zendaya will hit theaters in IMAX format worldwide.',
      timeAgo: '7 hours ago',
      tags: ['Nolan', 'Hollywood', 'IMAX'],
      source: 'Variety'
    }
  ],
  'video-games': [
    {
      id: '7',
      headline: 'GTA 6 Finally Gets Official Release Date',
      summary: 'Rockstar Games announces Grand Theft Auto 6 will launch in fall 2025 with revolutionary new gameplay mechanics and stunning graphics.',
      timeAgo: '30 minutes ago',
      tags: ['GTA', 'Rockstar', 'Gaming'],
      source: 'IGN'
    },
    {
      id: '8',
      headline: 'Nintendo Reveals Next-Gen Console at Tokyo Game Show',
      summary: 'Nintendo\'s successor to the Switch features 4K gaming capabilities and backward compatibility with all previous titles.',
      timeAgo: '2 hours ago',
      tags: ['Nintendo', 'Console', 'Switch'],
      source: 'GameSpot'
    }
  ],
  'music': [
    {
      id: '9',
      headline: 'Taylor Swift Announces Surprise Album Release',
      summary: 'The pop superstar drops hints about a new album coming next month, featuring collaborations with unexpected artists.',
      timeAgo: '1 hour ago',
      tags: ['Taylor Swift', 'Album', 'Pop'],
      source: 'Rolling Stone'
    },
    {
      id: '10',
      headline: 'Kendrick Lamar Wins Pulitzer Prize for New Album',
      summary: 'The rapper makes history again with his latest work being recognized for its artistic and cultural significance.',
      timeAgo: '6 hours ago',
      tags: ['Kendrick', 'Pulitzer', 'Hip Hop'],
      source: 'Billboard'
    }
  ],
  'science': [
    {
      id: '11',
      headline: 'Scientists Discover New Form of Matter',
      summary: 'Researchers at MIT have created a new state of matter that could revolutionize quantum computing and energy storage.',
      timeAgo: '4 hours ago',
      tags: ['Physics', 'MIT', 'Research'],
      source: 'Nature'
    },
    {
      id: '12',
      headline: 'Gene Therapy Cures Inherited Blindness in Clinical Trial',
      summary: 'Breakthrough treatment restores sight to patients with rare genetic condition, offering hope for millions worldwide.',
      timeAgo: '8 hours ago',
      tags: ['Medicine', 'Gene Therapy', 'Breakthrough'],
      source: 'Science Journal'
    }
  ],
  'space': [
    {
      id: '13',
      headline: 'SpaceX Successfully Lands Crew on Mars',
      summary: 'Historic mission marks humanity\'s first crewed landing on the Red Planet, opening new chapter in space exploration.',
      timeAgo: '12 hours ago',
      tags: ['SpaceX', 'Mars', 'Exploration'],
      source: 'NASA News'
    },
    {
      id: '14',
      headline: 'James Webb Telescope Discovers Earth-Like Planet',
      summary: 'New exoplanet shows signs of water and atmosphere, located just 20 light-years away in the habitable zone.',
      timeAgo: '1 day ago',
      tags: ['JWST', 'Exoplanet', 'Discovery'],
      source: 'Space.com'
    }
  ],
  'health': [
    {
      id: '15',
      headline: 'New Alzheimer\'s Drug Shows 80% Success Rate',
      summary: 'Revolutionary treatment completely halts progression of Alzheimer\'s disease in Phase 3 clinical trials.',
      timeAgo: '3 hours ago',
      tags: ['Alzheimer', 'Medicine', 'Breakthrough'],
      source: 'Medical News'
    },
    {
      id: '16',
      headline: 'Mediterranean Diet Extends Lifespan by 10 Years',
      summary: 'Long-term study of 100,000 participants confirms dramatic health benefits of traditional Mediterranean eating patterns.',
      timeAgo: '1 day ago',
      tags: ['Diet', 'Longevity', 'Health'],
      source: 'Health Today'
    }
  ],
  'sports': [
    {
      id: '17',
      headline: 'Lionel Messi Announces Return to Barcelona',
      summary: 'The soccer legend confirms his emotional return to Barcelona after successful stint with Inter Miami.',
      timeAgo: '2 hours ago',
      tags: ['Messi', 'Barcelona', 'Soccer'],
      source: 'ESPN'
    },
    {
      id: '18',
      headline: 'NBA Expands to Europe with London Franchise',
      summary: 'The league announces its first European team, the London Lions, set to begin play in the 2026-27 season.',
      timeAgo: '5 hours ago',
      tags: ['NBA', 'London', 'Basketball'],
      source: 'Sports Illustrated'
    }
  ],
  'cooking': [
    {
      id: '19',
      headline: 'Gordon Ramsay Opens First Plant-Based Restaurant',
      summary: 'The celebrity chef surprises fans with innovative vegan menu featuring molecular gastronomy techniques.',
      timeAgo: '4 hours ago',
      tags: ['Ramsay', 'Vegan', 'Restaurant'],
      source: 'Food & Wine'
    },
    {
      id: '20',
      headline: 'Ancient Roman Recipes Discovered in Pompeii',
      summary: 'Archaeologists uncover perfectly preserved cookbook revealing culinary secrets from 2,000 years ago.',
      timeAgo: '1 day ago',
      tags: ['Pompeii', 'Ancient', 'Recipes'],
      source: 'Culinary History'
    }
  ]
})

// Computed properties
const selectedCategory = computed(() => {
  return categories.value.find(cat => cat.id === selectedCategoryId.value) || categories.value[0]
})

const currentStories = computed(() => {
  return allStories.value[selectedCategoryId.value] || allStories.value['top-stories']
})

// Methods
const toggleExpanded = () => {
  isExpanded.value = !isExpanded.value
}

const selectCategory = (category: any) => {
  selectedCategoryId.value = category.id
  if (currentStories.value.length > 0) {
    selectedStoryId.value = currentStories.value[0].id
  }
}

const selectStory = (storyId: string) => {
  selectedStoryId.value = storyId
  console.log('Selected story:', storyId)
}

onMounted(() => {
  if (!jokesStore.jokes.length) {
    jokesStore.fetchJokes()
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