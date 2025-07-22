<template>
  <!-- Desktop Sidebar (md and up) -->
  <nav class="hidden md:flex md:flex-col md:fixed md:left-0 md:top-0 md:h-full  md:bg-black md:border-r md:border-gray-200 md:p-4">
    <div class="flex flex-col space-y-2">
      <!-- Logo/Icon -->
      <div class="flex items-center space-x-3 p-3 rounded-xl hover:bg-gray-100 transition">
        <div class="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
          <span :class="colors.text.primary" class="font-bold text-lg">C</span>
        </div>
        <span class="text-xl font-bold">CMarket</span>
      </div>
      
      <!-- Profile -->
      <a href="#" class="flex items-center space-x-3 p-3 rounded-xl hover:bg-gray-100 transition">
        <div :class="colors.text.primary" class="w-6 h-6">
          <svg fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd" />
          </svg>
        </div>
        <span :class="colors.text.primary" class="text-xl">Profile</span>
      </a>
      
      <!-- Explore -->
      <a href="#" class="flex items-center space-x-3 p-3 rounded-xl hover:bg-gray-100 transition">
        <div :class="colors.text.primary" class="w-6 h-6">
          <svg fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd" />
          </svg>
        </div>
        <span class="text-xl text-white">Explore</span>
      </a>
    </div>
    
    <!-- Competition Section -->
    <div class="mt-6">
      <Competition />
    </div>
  </nav>
  
  <!-- Mobile Bottom Navigation (below md) -->
  <nav class="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2">
    <div class="flex justify-around items-center">
      <a href="#" class="flex flex-col items-center space-y-1 p-2">
        <div class="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
          <span class="text-white font-bold text-sm">C</span>
        </div>
        <span class="text-xs">Home</span>
      </a>
      
      <a href="#" class="flex flex-col items-center space-y-1 p-2">
        <div class="w-6 h-6">
          <svg fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd" />
          </svg>
        </div>
        <span class="text-xs">Explore</span>
      </a>
      
      <a href="#" class="flex flex-col items-center space-y-1 p-2">
        <div class="w-6 h-6">
          <svg fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd" />
          </svg>
        </div>
        <span class="text-xs">Profile</span>
      </a>
    </div>
    
    <!-- Mobile Competition Section -->
    <div class="mt-3 mb-2">
      <Competition />
    </div>
  </nav>
</template>

<script setup lang="ts">
import Competition from './Competition.vue'
const { colors } = useThemeStore()

</script>
