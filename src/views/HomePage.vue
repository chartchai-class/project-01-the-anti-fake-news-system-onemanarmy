<script setup lang="ts">
import { ref, computed, onMounted, watch, nextTick } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useNewsStore } from '../stores/newsInterface';
import { useLoadingStore } from '../stores/loadingEvents';
import NewsCard from '@/components/NewsCard.vue';
import Pagination from '@/components/PaginationButtons.vue';
import SearchBar from '@/components/SearchBar.vue';
import type { News } from '../stores/newsInterface';

const route = useRoute();
const router = useRouter();
const store = useNewsStore();
const loadingStore = useLoadingStore();

const filterStatus = ref<'all' | 'fake' | 'not fake' | 'equal'>(
  (route.query.filter as 'all' | 'fake' | 'not fake' | 'equal') || 'all'
);
const currentPage = ref<number>(Number(route.query.page) || 1);
const newsPerPage = ref<number>(Number(route.query.perPage) || 6);
const isDataLoading = ref(false);
const isFilterLoading = ref(false);
const pendingFilter = ref<'all' | 'fake' | 'not fake' | 'equal' | null>(null);

const searchQuery = ref<string>((route.query.search as string) || '');

const fetchNewsData = async () => {
  try {
    isDataLoading.value = true;
    loadingStore.startLoading();

    await store.fetchNews();
    await new Promise(resolve => setTimeout(resolve, 800));

  } catch (error) {
    console.error('Error fetching news:', error);
  } finally {
    isDataLoading.value = false;
    loadingStore.finishLoading();
  }
};

const handleFilterChange = async (newFilter: 'all' | 'fake' | 'not fake' | 'equal') => {
  if (filterStatus.value === newFilter || isFilterLoading.value) return;

  try {
    isFilterLoading.value = true;
    pendingFilter.value = newFilter;
    loadingStore.startLoading();

    await new Promise(resolve => setTimeout(resolve, 600));

    filterStatus.value = newFilter;
    currentPage.value = 1;

    await updateURL();

  } catch (error) {
    console.error('Error filtering news:', error);
  } finally {
    isFilterLoading.value = false;
    pendingFilter.value = null;
    loadingStore.finishLoading();
  }
};

const updateURL = async () => {
  await nextTick(() => {});

  const query: Record<string, string> = {};

  if (filterStatus.value !== 'all') {
    query.filter = filterStatus.value;
  }
  if (currentPage.value !== 1) {
    query.page = String(currentPage.value);
  }
  if (newsPerPage.value !== 6) {
    query.perPage = String(newsPerPage.value);
  }
  if (searchQuery.value) {
    query.search = searchQuery.value;
  }

  await router.replace({
    path: route.path,
    query
  });
};

watch(() => route.query, (newQuery) => {
  if (newQuery.filter && newQuery.filter !== filterStatus.value) {
    filterStatus.value = newQuery.filter as 'all' | 'fake' | 'not fake' | 'equal';
  }
  if (newQuery.page && Number(newQuery.page) !== currentPage.value) {
    currentPage.value = Number(newQuery.page);
  }
  if (newQuery.perPage && Number(newQuery.perPage) !== newsPerPage.value) {
    newsPerPage.value = Number(newQuery.perPage);
  }
  if (newQuery.search && newQuery.search !== searchQuery.value) {
    searchQuery.value = newQuery.search as string;
  }
});

watch(newsPerPage, () => {
  currentPage.value = 1;
  updateURL();
});

watch(searchQuery, () => {
  currentPage.value = 1;
  updateURL();
});

const onPageChanged = (page: number) => {
  currentPage.value = page;
  updateURL();
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

const filteredNews = computed<News[]>(() => {
  return store.getNewsWithStatus(filterStatus.value);
});

const filteredAndSearchedNews = computed<News[]>(() => {
  if (!searchQuery.value) {
    return filteredNews.value;
  }
  const query = searchQuery.value.toLowerCase();
  return filteredNews.value.filter(news =>
    news.topic.toLowerCase().includes(query) ||
    news.fullDetail.toLowerCase().includes(query) ||
    news.reporter.toLowerCase().includes(query)
  );
});

const paginatedNews = computed<News[]>(() => {
  const start = (currentPage.value - 1) * newsPerPage.value;
  const end = start + newsPerPage.value;
  return filteredAndSearchedNews.value.slice(start, end);
});

onMounted(() => {
  fetchNewsData();
});
</script>

<template>
  <div class="container mx-auto p-4 font-oswald bg-gradient-to-b from-black via-gray-900 to-black min-h-screen ">

    <div class="flex flex-col md:flex-row justify-between items-center mb-6 space-y-4 md:space-y-0">
      <div class="flex space-x-2 ">
        <button
          @click="handleFilterChange('all')"
          :disabled="isFilterLoading"
          :class="[
            'px-4 py-2 rounded-lg font-medium transition-colors duration-200 relative ',
            {
              'bg-nike-orange text-white': filterStatus === 'all',
              'bg-white text-gray-800 hover:bg-nike-yellow hover:text-white': filterStatus !== 'all',
              'opacity-75 cursor-not-allowed': isFilterLoading
            }
          ]">
          <span :class="{ 'opacity-50': isFilterLoading && pendingFilter === 'all' }">All</span>
          <div v-if="isFilterLoading && pendingFilter === 'all'" class="absolute inset-0 flex items-center justify-center">
            <div class="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
          </div>
        </button>
        <button
          @click="handleFilterChange('not fake')"
          :disabled="isFilterLoading"
          :class="[
            'px-4 py-2 rounded-lg font-medium transition-colors duration-200 relative',
            {
              'bg-green-600 text-white': filterStatus === 'not fake',
              'bg-white text-gray-800 hover:bg-green-500 hover:text-white': filterStatus !== 'not fake',
              'opacity-75 cursor-not-allowed': isFilterLoading
            }
          ]">
          <span :class="{ 'opacity-50': isFilterLoading && pendingFilter === 'not fake' }">Real</span>
          <div v-if="isFilterLoading && pendingFilter === 'not fake'" class="absolute inset-0 flex items-center justify-center">
            <div class="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
          </div>
        </button>
        <button
          @click="handleFilterChange('fake')"
          :disabled="isFilterLoading"
          :class="[
            'px-4 py-2 rounded-lg font-medium transition-colors duration-200 relative',
            {
              'bg-red-600 text-white': filterStatus === 'fake',
              'bg-white text-gray-800 hover:bg-red-500 hover:text-white': filterStatus !== 'fake',
              'opacity-75 cursor-not-allowed': isFilterLoading
            }
          ]">
          <span :class="{ 'opacity-50': isFilterLoading && pendingFilter === 'fake' }">Fake</span>
          <div v-if="isFilterLoading && pendingFilter === 'fake'" class="absolute inset-0 flex items-center justify-center">
            <div class="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
          </div>
        </button>
        <button
          @click="handleFilterChange('equal')"
          :disabled="isFilterLoading"
          :class="[
            'px-4 py-2 rounded-lg font-medium transition-colors duration-200 relative',
            {
              'bg-gray-600 text-white': filterStatus === 'equal',
              'bg-white text-gray-800 hover:bg-gray-500 hover:text-white': filterStatus !== 'equal',
              'opacity-75 cursor-not-allowed': isFilterLoading
            }
          ]">
          <span :class="{ 'opacity-50': isFilterLoading && pendingFilter === 'equal' }">Equal</span>
          <div v-if="isFilterLoading && pendingFilter === 'equal'" class="absolute inset-0 flex items-center justify-center">
            <div class="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
          </div>
        </button>
      </div>

      <div class="flex items-center space-x-2">
        <span class="text-white">News per page:</span>
        <select
          v-model="newsPerPage"
          :disabled="isFilterLoading || isDataLoading"
          class="p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-nike-orange disabled:opacity-50 disabled:cursor-not-allowed">
          <option>3</option>
          <option>6</option>
          <option>9</option>
          <option>12</option>
          <option>24</option>
        </select>
      </div>
    </div>

    <SearchBar v-model="searchQuery" />

    <div v-if="isDataLoading || isFilterLoading" class="text-center text-white text-xl py-20">
      <div class="inline-flex flex-col items-center">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
        <span v-if="isDataLoading">Loading news...</span>
        <span v-else-if="isFilterLoading">Loading news...</span>
      </div>
    </div>

    <div v-else-if="paginatedNews.length" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <NewsCard v-for="news in paginatedNews" :key="news.id" :news="news" :search-query="searchQuery" />
    </div>

    <div v-else class="text-center text-gray-500 text-xl py-10">
      <div class="flex flex-col items-center">
        <svg class="w-16 h-16 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
        </svg>
        <h3 class="text-lg font-medium mb-1">No news found</h3>
        <p class="text-sm text-gray-400">Try changing the filter or search terms.</p>
      </div>
    </div>

    <Pagination
      v-if="!isDataLoading && !isFilterLoading && paginatedNews.length"
      :total-items="filteredAndSearchedNews.length"
      :items-per-page="newsPerPage"
      :current-page="currentPage"
      @page-changed="onPageChanged"
      class="mt-8"
    />

    <!-- Footer -->
    <div class="text-center mt-6">
      <p class="text-sm text-white">
       © One Man Army - All rights reserved.
      </p>
    </div>
  </div>
</template>


