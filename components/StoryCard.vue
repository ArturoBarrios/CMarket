<template>
  <div 
    @click="selectStory"
    :class="[
      colors.bg.primary, 
      colors.border.primary,
      isSelected ? 'ring-2 ring-blue-500 border-blue-300' : 'border-gray-200',
      'cursor-pointer hover:shadow-md transition-all duration-200'
    ]"
    class="border rounded-xl p-4 shadow-sm"
  >
    <!-- Story indicator -->
    <div class="flex items-center gap-2 mb-3">
      <div class="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
        <span class="text-white text-xs font-bold">📰</span>
      </div>
      <span class="text-sm font-medium text-blue-600">Story</span>
      <span class="text-xs text-gray-500">• {{ timeAgo }}</span>
      <div v-if="isSelected" class="ml-auto">
        <div class="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
      </div>
    </div>

    <!-- Headline -->
    <h3 :class="[colors.text.primary]" class="font-bold text-lg mb-2 leading-tight">
      {{ headline }}
    </h3>

    <!-- Summary - shortened -->
    <p :class="[colors.text.secondary]" class="text-sm leading-relaxed mb-3 line-clamp-2">
      {{ summary }}
    </p>

    <!-- Source only -->
    <div class="flex items-center justify-between mb-3">
      <span class="text-xs text-gray-500">{{ source }}</span>
    </div>

    <!-- Interactive Options -->
    <div v-if="isSelected" class="border-t border-gray-100 pt-3">
      <!-- Selection indicator -->
      <div class="flex items-center gap-2 text-blue-600 text-sm mb-3">
        <span class="text-blue-500">✓</span>
        <span class="font-medium">Selected Story</span>
      </div>

      <!-- Action buttons - 3 cols for more compact layout -->
      <div class="grid grid-cols-3 gap-2">
        <button
          v-for="option in interactiveOptions"
          :key="option.id"
          @click.stop="selectOption(option)"
          :class="[
            selectedOption === option.id 
              ? 'bg-blue-500 text-white' 
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200',
            'cursor-pointer px-2 py-2 rounded-lg text-xs font-medium transition-colors'
          ]"
        >
          {{ option.emoji }} {{ option.label }}
        </button>
      </div>

      <!-- Selected option feedback -->
      <div v-if="selectedOption" class="mt-3 p-2 bg-blue-50 rounded-lg">
        <p class="text-xs text-blue-700">
          <span class="font-medium">{{ getSelectedOptionLabel() }}:</span>
          {{ getSelectedOptionDescription() }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

interface StoryProps {
  id: string
  headline: string
  summary: string
  timeAgo: string
  tags: string[]
  source: string
  isSelected?: boolean
}

interface InteractiveOption {
  id: string
  label: string
  emoji: string
  description: string
}

const props = defineProps<StoryProps>()

const emit = defineEmits<{
  select: [id: string]
}>()

const { colors } = useThemeStore()

const selectedOption = ref<string | null>(null)

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
</script>