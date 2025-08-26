<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import type { News } from '../stores/newsInterface';

interface Props {
  news: News;
  searchQuery?: string;
}

const props = withDefaults(defineProps<Props>(), {
  searchQuery: ''
});

const router = useRouter();
const route = useRoute();
const isNavigating = ref(false);

// Highlight function
const highlightText = (text: string, searchQuery: string): string => {
  if (!searchQuery || !text) return text;

  const query = searchQuery.trim();
  if (!query) return text;

  // Escape special regex characters and create case-insensitive regex
  const escapedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const regex = new RegExp(`(${escapedQuery})`, 'gi');

  return text.replace(regex, '<mark class="bg-yellow-200 text-yellow-900 px-0.5 py-0.5 rounded font-semibold">$1</mark>');
};

// Check if search query matches any content
const hasMatch = computed(() => {
  if (!props.searchQuery) return false;

  const query = props.searchQuery.toLowerCase();
  return props.news.topic.toLowerCase().includes(query) ||
         props.news.shortDetail.toLowerCase().includes(query) ||
         props.news.fullDetail.toLowerCase().includes(query) ||
         props.news.reporter.toLowerCase().includes(query);
});

const handleNewsClick = async () => {
  try {
    isNavigating.value = true;

    // Preserve current filter state in URL
    const currentQuery = { ...route.query };

    // Navigate to news detail
    await router.push({
      path: `/news/${props.news.id}`,
      query: {
        from: route.path,
        ...currentQuery
      }
    });
  } catch (error) {
    console.error('Navigation error:', error);
  } finally {
    isNavigating.value = false;
  }
};

const getStatusText = () => {
  if (props.news.voteSummary.real > props.news.voteSummary.fake) {
    return 'REAL';
  } else if (props.news.voteSummary.fake > props.news.voteSummary.real) {
    return 'FAKE';
  } else {
    return 'EQUAL';
  }
};

const handleImageError = (event: Event) => {
  const target = event.target as HTMLImageElement;
  target.style.display = 'none';
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
};
</script>

<template>
  <div
    class="relative block bg-white shadow-lg rounded-3xl overflow-hidden transition-all duration-300 hover:scale-105 cursor-pointer border-2"
    :class="{
      'hover:border-green-600 hover:border-4': news.status === 'not fake',
      'hover:border-red-600 hover:border-4': news.status === 'fake',
      'hover:border-gray-500 hover:border-4': news.voteSummary.real === news.voteSummary.fake
    }"
    @click="handleNewsClick"
  >
    <!-- News Image Section -->
    <div
      v-if="news.image && (news.image.startsWith('http') || news.image.startsWith('https'))"
      class="relative"
    >
      <img
        :src="news.image"
        :alt="news.topic"
        class="w-full h-48 object-cover transition-transform duration-300 hover:scale-105"
        @error="handleImageError"
      >
      <div class="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center p-4">
        <h3 class="text-white text-lg font-bold text-center drop-shadow-lg line-clamp-2">
          <span v-html="highlightText(news.topic, searchQuery)"></span>
        </h3>
      </div>
    </div>

    <!-- No Image Section -->
    <div
      v-else
      class="relative bg-gradient-to-br from-gray-100 to-gray-200 w-full h-48 flex items-center justify-center"
    >
      <div class="text-center">
        <svg class="w-12 h-12 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
        </svg>
        <h3 class="text-gray-500 text-lg text-center font-bold px-4 line-clamp-2">
          <span v-html="highlightText(news.topic, searchQuery)"></span>
        </h3>
      </div>
    </div>

    <!-- Status Badge Section -->
    <div class="p-4 flex justify-between items-center">
      <div class="flex items-center space-x-2">
        <span
          class="px-3 py-1 rounded-full text-xs font-bold transition-colors duration-200"
          :class="{
            'bg-green-100 text-green-700': news.voteSummary.real > news.voteSummary.fake,
            'bg-red-100 text-red-700': news.voteSummary.fake > news.voteSummary.real,
            'bg-gray-200 text-gray-700': news.voteSummary.real === news.voteSummary.fake,
          }"
        >
          {{ getStatusText() }}
        </span>

        <!-- Vote counts -->
        <div class="flex items-center space-x-2 text-xs text-gray-500">
          <span class="flex items-center">
            <svg class="w-3 h-3 mr-1 text-green-500" fill="currentColor" viewBox="0 0 20 20">
              <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z"></path>
            </svg>
            {{ news.voteSummary.real }}
          </span>
          <span class="flex items-center">
            <svg class="w-3 h-3 mr-1 text-red-500" fill="currentColor" viewBox="0 0 20 20">
              <path d="M18 9.5a1.5 1.5 0 11-3 0v-6a1.5 1.5 0 013 0v6zM14 9.667v-5.43a2 2 0 00-1.106-1.79l-.05-.025A4 4 0 0011.057 2H5.641a2 2 0 00-1.962 1.608l-1.2 6A2 2 0 004.44 12H8v4a2 2 0 002 2 1 1 0 001-1v-.667a4 4 0 01.8-2.4l1.4-1.866a4 4 0 00.8-2.4z"></path>
            </svg>
            {{ news.voteSummary.fake }}
          </span>
        </div>
      </div>

      <!-- Comments count ย้ายไปขวาสุด -->
      <div class="flex items-center text-sm text-gray-500 ml-3">
        <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
        </svg>
        {{ news.comments?.length || 0 }} comments
      </div>
    </div>

    <!-- Content Section -->
    <div class="p-6 pt-0">
      <p class="text-gray-600 mb-4 line-clamp-3 leading-relaxed">
        <span v-html="highlightText(news.shortDetail, searchQuery)"></span>
      </p>

      <!-- Meta Information -->
      <div class="flex justify-between items-center text-sm text-gray-500 mb-4">
        <p class="flex items-center">
          <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <circle cx="12" cy="8" r="4" stroke="currentColor" stroke-width="2" />
            <path stroke="currentColor" stroke-width="2" stroke-linecap="round" d="M4 20c0-3.3 3.6-6 8-6s8 2.7 8 6"/>
          </svg>
          <span v-html="highlightText(news.reporter, searchQuery)"></span>
        </p>
        <p class="flex items-center">
          <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" stroke-width="2" />
            <path d="M16 2v4M8 2v4M3 10h18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          </svg>
          {{ formatDate(news.dateTime) }}
        </p>
      </div>

      <!-- Comments count -->
      <!-- <div class="flex items-center text-sm text-gray-500">
        <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
        </svg>
        {{ news.comments?.length || 0 }} comments
      </div> -->

      <!-- Read More Indicator -->
      <div class="mt-6 flex justify-end items-center">
        <span class="text-nike-orange text-sm font-medium flex items-center gap-1">
          Read more
          <!-- สองลูกศร ต่อกัน! -->
          <svg class="w-6 h-4 text-nike-orange" fill="none" stroke="currentColor" viewBox="0 0 36 24">
            <!-- ลูกศรชุดแรก -->
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M5 5l7 7-7 7"/>
            <!-- ลูกศรชุดสอง ขยับไปขวา -->
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M17 5l7 7-7 7"/>
          </svg>
        </span>
      </div>

      <!-- Search Match Indicator -->
      <div v-if="searchQuery && hasMatch" class="mt-3 flex items-center text-xs text-blue-600">
        <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
        Search match found
      </div>
    </div>
  </div>

  <div
    v-if="isNavigating"
    class="absolute inset-0 bg-white bg-opacity-90 z-10 flex items-center justify-center rounded-xl"
  >
    <div class="flex flex-col items-center">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mb-2"></div>
      <span class="text-gray-600 text-sm">Loading news...</span>
    </div>
  </div>
</template>

