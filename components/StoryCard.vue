<template>
  <div 
    @click="selectStory"
    :class="[
      colors.bg.primary, 
      colors.border.primary,
      isSelected ? 'ring-2 ring-blue-500 border-blue-300' : 'border-gray-200',
      'cursor-pointer hover:shadow-md transition-all duration-200'
    ]"
    class="border rounded-xl p-4 shadow-sm flex flex-col h-full
    w-full"

  >
    <!-- Story indicator -->
    <div class="flex items-center gap-2 mb-3">
      <span class="text-xs text-gray-500">{{ formatDate(timeAgo) }}</span>
      <div v-if="isSelected" class="ml-auto">
        <div class="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
      </div>
    </div>

    <!-- Headline -->
    <h3 :class="[colors.text.primary]" class="font-bold text-lg mb-2 leading-tight">
      {{ headline }}
    </h3>

    <!-- Summary - shortened -->
    <p :class="[colors.text.primary]" class="text-sm leading-relaxed mb-3  flex-grow">
      {{ summary }}
    </p>

    

    <!-- Expandable Subcontent Section -->
    <div v-if="Object.keys(groupedSubContent).length > 0" class="mt-4 pt-4 border-t border-gray-200">
      <!-- Clickable Title -->
      <div 
        @click="toggleSubContentExpanded" 
        class="flex items-center justify-between cursor-pointer hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 rounded-lg p-3 -m-2 mb-2 transition-all duration-200 border border-transparent hover:border-blue-200"
      >
        <div class="flex items-center gap-2">
          <div class="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center shadow-sm">
            <span class="text-white text-sm">📋</span>
          </div>
          <h3 class="text-sm font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Additional Context
          </h3>
        </div>
        <div class="transform transition-transform duration-200" :class="{ 'rotate-180': isSubContentExpanded }">
          <svg class="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
          </svg>
        </div>
      </div>

      <!-- Collapsible Content -->
      <div v-if="isSubContentExpanded" class="space-y-3">
        <div v-for="(items, type) in groupedSubContent" :key="type" class="mb-4 last:mb-0">
          <h4 class="text-sm font-semibold mb-2" :class="getTypeColorClass(type)">
            {{ getTypeIcon(type) }} {{ formatTypeName(type) }}
          </h4>
          <ul class="space-y-1">
            <li v-for="point in items" :key="point.id" class="text-xs text-gray-600 pl-2 border-l-2" :class="getTypeBorderClass(type)">
              {{ point.content }}
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

interface SubContent {
  id: string
  content: string
  type: string
  newsContentId: string
}

interface StoryProps {
  id: string
  headline: string
  summary: string
  timeAgo: string
  tags: string[]
  source: string
  isSelected?: boolean
  subContent?: SubContent[]
}

interface InteractiveOption {
  id: string
  label: string
  emoji: string
  description: string
}

const props = withDefaults(defineProps<StoryProps>(), {
  subContent: () => []
})

const emit = defineEmits<{
  select: [id: string]
}>()

const { colors } = useThemeStore()

const selectedOption = ref<string | null>(null)
const isSubContentExpanded = ref(false)

const interactiveOptions = ref<InteractiveOption[]>([
  {
    id: 'real-fake',
    label: "What's Real?",
    emoji: '🔍',
    description: 'AI analysis of facts vs. misinformation in this story'
  },
  {
    id: 'context',
    label: 'More Context',
    emoji: '📊',
    description: 'Historical background and related information'
  },
  {
    id: 'impact',
    label: 'Impact Analysis',
    emoji: '⚡',
    description: 'How this story affects different communities'
  },
  {
    id: 'trending',
    label: 'Why Trending',
    emoji: '📈',
    description: 'Social media sentiment and discussion topics'
  },
  {
    id: 'predictions',
    label: 'What Next?',
    emoji: '🔮',
    description: 'AI predictions on potential developments'
  },
  {
    id: 'explain-simply',
    label: 'Explain Simply',
    emoji: '💡',
    description: 'Break down complex topics in simple terms'
  }
])

const selectStory = () => {
  emit('select', props.id)
}

const selectOption = (option: InteractiveOption) => {
  selectedOption.value = selectedOption.value === option.id ? null : option.id
  console.log('Selected option:', option.label, 'for story:', props.id)
}

const getSelectedOptionLabel = () => {
  const option = interactiveOptions.value.find(opt => opt.id === selectedOption.value)
  return option ? option.label : ''
}

const getSelectedOptionDescription = () => {
  const option = interactiveOptions.value.find(opt => opt.id === selectedOption.value)
  return option ? option.description : ''
}

const groupedSubContent = computed(() => {
  const grouped: Record<string, SubContent[]> = {}
  props.subContent?.forEach(item => {
    if (!grouped[item.type]) {
      grouped[item.type] = []
    }
    grouped[item.type].push(item)
  })
  return grouped
})

const formatTypeName = (type: string): string => {
  // Convert camelCase to Title Case
  return type
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, str => str.toUpperCase())
    .trim()
}

const getTypeIcon = (type: string): string => {
  const iconMap: Record<string, string> = {
    contextPoints: '📊',
    controversyPoints: '⚠️',
    analysis: '🔍',
    summary: '📋',
    facts: '✅',
    opinions: '💭'
  }
  return iconMap[type] || '📌'
}

const getTypeColorClass = (type: string): string => {
  const colorMap: Record<string, string> = {
    contextPoints: 'text-blue-600',
    controversyPoints: 'text-orange-600',
    analysis: 'text-purple-600',
    summary: 'text-green-600',
    facts: 'text-emerald-600',
    opinions: 'text-pink-600'
  }
  return colorMap[type] || 'text-gray-600'
}

const getTypeBorderClass = (type: string): string => {
  const borderMap: Record<string, string> = {
    contextPoints: 'border-blue-200',
    controversyPoints: 'border-orange-200',
    analysis: 'border-purple-200',
    summary: 'border-green-200',
    facts: 'border-emerald-200',
    opinions: 'border-pink-200'
  }
  return borderMap[type] || 'border-gray-200'
}

const toggleSubContentExpanded = () => {
  isSubContentExpanded.value = !isSubContentExpanded.value
}

const formatDate = (timeAgo: string) => {
  // If timeAgo is already a date string, parse it, otherwise use current date
  const date = new Date(timeAgo) || new Date()
  return date.toLocaleDateString('en-US', { 
    month: '2-digit', 
    day: '2-digit', 
    year: 'numeric' 
  })
}
</script>