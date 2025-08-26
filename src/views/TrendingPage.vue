<script setup lang="ts">
// import { computed } from 'vue'
// import { useNewsStore } from '@/stores/newsInterface'

// const store = useNewsStore()

// ดึง top 7 ข่าวยอดโหวตมากสุด
// const topNews = computed(() => {
//   return [...store.news]
//     .map(news => ({
//       ...news,
//       totalVotes:
//         (news.voteSummary?.fake || 0) +
//         (news.voteSummary?.not_fake || 0) +
//         (news.voteSummary?.equal || 0),
//     }))
//     .sort((a, b) => b.totalVotes - a.totalVotes)
//     .slice(0, 7)
// })

// function getVoteCount(news: any) {
//   return (
//     (news.voteSummary?.fake || 0) +
//     (news.voteSummary?.not_fake || 0) +
//     (news.voteSummary?.equal || 0)
//   )
// }
</script>

<template>
  <div class="min-h-screen bg-black text-white py-8 px-2 md:px-12">
    <div class="flex justify-between items-center mb-8">
      <h1 class="text-3xl md:text-4xl font-bold">Trending News</h1>
      <router-link
        to="/news"
        class="flex items-center gap-2 text-base md:text-lg font-medium hover:underline transition"
      >
        See all
        <svg class="w-5 h-5 ml-1" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"/>
        </svg>
      </router-link>
    </div>

    <!-- <div v-if="topNews.length" class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div class="md:col-span-1 flex flex-col">
        <div class="rounded-lg overflow-hidden bg-gray-800 mb-2 shadow-lg">
          <img
            :src="topNews[0].image"
            :alt="topNews[0].topic"
            class="w-full object-cover aspect-video"
          />
        </div>
        <div class="p-4 bg-gray-900 rounded-b-xl">
          <div class="font-semibold text-lg mb-2 line-clamp-2">{{ topNews[0].topic }}</div>
          <div class="text-gray-300 text-sm line-clamp-2">{{ topNews[0].shortDetail }}</div>
        </div>
      </div>
      <div class="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div
          v-for="(news, i) in topNews.slice(1, 7)"
          :key="news.id"
          class="bg-gray-900 rounded-xl shadow hover:shadow-xl overflow-hidden transition"
        >
          <img :src="news.image" :alt="news.topic" class="w-full aspect-video object-cover" />
          <div class="px-4 py-3">
            <div class="font-semibold line-clamp-2 mb-2">{{ news.topic }}</div>
            <div class="text-gray-400 text-xs line-clamp-2">{{ news.shortDetail }}</div>
            <div class="mt-2 flex items-center gap-2 text-xs text-gray-500">
              👍 {{ getVoteCount(news) }} โหวต
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-else class="text-center text-gray-400 py-32">ไม่มีข้อมูลข่าว</div> -->
  </div>
</template>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
