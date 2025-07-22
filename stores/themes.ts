export const useThemeStore = defineStore('theme', () => {
  const colorSchemes = {
    dark: {
      text: {
        primary: 'text-white',
        secondary: 'text-black',
        accent: 'text-blue-400'
      },      
      bg: {
        primary: 'bg-black',
        secondary: 'bg-gray-900',
        accent: 'bg-blue-500'
      },
      border: {
        primary: 'border-gray-700',
        secondary: 'border-gray-600',
      },
      hover: {
          primary: 'hover:bg-gray-500'
      }
    },
    light: {
      text: {
        primary: 'text-black',
        secondary: 'text-gray-700',
        accent: 'text-blue-600'
      },
      bg: {
        primary: 'bg-white',
        secondary: 'bg-gray-100',
        accent: 'bg-blue-500'
      },
      border: {
        primary: 'border-gray-200',
        secondary: 'border-gray-300',
      },
      hover: 'hover:bg-gray-100'
    }
  }

  const currentScheme = ref<keyof typeof colorSchemes>('dark')
  
  const colors = computed(() => colorSchemes[currentScheme.value])
  
  const setScheme = (scheme: keyof typeof colorSchemes) => {
    currentScheme.value = scheme
  }

  return {
    colors,
    currentScheme,
    setScheme,
    schemes: colorSchemes
  }
})