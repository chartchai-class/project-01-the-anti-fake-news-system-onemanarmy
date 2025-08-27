<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

const refreshPage = () => {
  if (router.currentRoute.value.path === '/') {
    window.location.reload()
  } else {
    router.push('/')
  }
}
</script>

<template>
  <link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700&display=swap" rel="stylesheet">
  <nav class="bg-white shadow-lg relative overflow-hidde">
    <div class="container mx-auto px-4">
      <div class="flex justify-between items-center py-4 relative">

        <!-- Logo (ซ้าย) -->
        <router-link to="/" class="flex items-center space-x-3" @click="refreshPage">
          <img src="/logo.png" alt="One Man Army News Logo" class="md:h-14 h-12 w-auto " />
        </router-link>

        <!-- Brand Name (กลาง) -->
        <router-link to="/" class="absolute left-1/2 -translate-x-1/2" @click="refreshPage">
          <span
            class="font-orbitron text-sm font-extrabold text-nike-black hover:text-nike-orange transition-colors drop-shadow-sm duration-500 sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl tracking-widest uppercase"
          >
            One Man Army News
          </span>
        </router-link>

        <!-- Add News Button (ขวา) -->
        <router-link
          to="/add-news"
          class="flex items-center space-x-1 px-2 py-2 bg-nike-yellow text-nike-black rounded-lg hover:bg-nike-orange hover:text-nike-white transition-colors duration-500 text-xs sm:text-sm sm:space-x-2 sm:px-3 md:px-4 md:py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <rect x="3" y="3" width="18" height="18" rx="4" stroke-width="2"/>
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v8M8 12h8"/>
          </svg>
          <span class="font-medium hidden xs:inline sm:inline">Add News</span>
        </router-link>
      </div>
    </div>
    <div class="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-nike-orange via-nike-yellow to-yellow-200 transition-all duration-300 ease-out"></div>
  </nav>
</template>


