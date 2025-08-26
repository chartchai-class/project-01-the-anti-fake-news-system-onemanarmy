<script setup lang="ts">
import { reactive, computed } from 'vue';
import { useRouter } from 'vue-router';
// import { useNewsStore } from '../stores/news';
import { useNotificationStore } from '../stores/notifications';
import ToastNotification from '../components/NotificationShow.vue';
// import type { News } from '../stores/news';

const router = useRouter();
// const newsStore = useNewsStore();
const notificationStore = useNotificationStore();

const formData = reactive({
  topic: '',
  shortDetail: '',
  fullDetail: '',
  image: '',
  reporter: '',
});

const isValidImageUrl = computed(() => {
  if (!formData.image) return false;
  try {
    const url = new URL(formData.image);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
});

const handleImageLoad = () => {
};

const handleImageError = () => {
  console.warn('Failed to load preview image');
};

const handleAddNews = async () => {
  try {
    const newNews = {
      ...formData,
      dateTime: new Date().toISOString(),
      voteSummary: { real: 0, fake: 0 },
      comments: [],
      totalVotes: 0,
    };

    // ส่ง POST ไปที่ MockAPI
    await fetch("https://68ab38ab909a5835049e0ad3.mockapi.io/api/v1/News", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newNews),
    });

    // แจ้งเตือนสำเร็จ
    notificationStore.addNotification('News added successfully.', 'success');

    // ล้างฟอร์ม
    Object.keys(formData).forEach(key => {
      formData[key as keyof typeof formData] = '';
    });

    // กลับหน้า Home
    setTimeout(() => {
      router.push('/');
    }, 700);

  } catch (error) {
    notificationStore.addNotification('Failed to add news. Please try again.', 'error');
    console.error(error);
  }
};
</script>

<template>
  <div class="bg-gradient-to-b from-black via-gray-900 to-black min-h-screen">
    <!--Notification-->
    <ToastNotification />

    <div class="container mx-auto p-4 max-w-4xl font-oswald bg-transparent min-h-screen">

      <!-- Content Card -->
      <div class="bg-white shadow-lg rounded-xl overflow-hidden">
        <div class="p-6">

          <!-- ส่วน Header -->
            <div class="mb-4">
              <div class="flex items-center justify-between md:items-center md:justify-between gap-2">
                <!-- Add News Title -->
                <h1 class="text-4xl font-extrabold text-gray-900 m-0">Add News</h1>
                <!-- Back to Homepage Button -->
                <router-link
                  to="/"
                  class="group inline-flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md shadow-sm text-gray-700 bg-white hover:bg-nike-orange hover:text-white transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-4 w-4 text-gray-500 transition-transform duration-200 group-hover:text-white group-hover:-translate-x-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    stroke-width="2"
                  >
                    <path stroke-linecap="round" stroke-linejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>

                  <!-- ซ่อนข้อความบน mobile, โชว์บน md+ -->
                  <span class="font-medium hidden md:inline">Back to Homepage</span>

                  <!-- Tooltip เฉพาะ mobile: โผล่มาเมื่อ hover/focus -->
                  <span
                    class="absolute left-full top-1/2 -translate-y-1/2 ml-1
                          text-xs bg-black text-white rounded px-2 py-1 opacity-0 pointer-events-none
                          group-hover:opacity-100 group-focus:opacity-100 transition-all duration-200
                          md:hidden z-10 whitespace-nowrap">
                    Go back
                  </span>
                </router-link>
              </div>
              <!-- Draft + Date อยู่ข้างล่าง -->
              <div class="flex items-center space-x-4 text-sm text-gray-600 mt-2">
                <span class="bg-nike-orange text-white font-bold px-3 py-1 rounded-full uppercase">DRAFT</span>
                <p>Date: <span class="font-semibold">{{ new Date().toLocaleDateString() }}</span></p>
              </div>
            </div>

          <!-- Form -->
          <form @submit.prevent="handleAddNews" class="space-y-8">

            <!-- Reporter -->
            <div class="group">
              <label for="reporter" class="block text-lg font-semibold text-gray-900 mb-3">
                Reporter
              </label>
              <input
                v-model="formData.reporter"
                type="text"
                id="reporter"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-800 text-lg"
                placeholder="Enter reporter name..."
                required
              >
            </div>

            <!-- Topic -->
            <div class="group">
              <label for="topic" class="block text-lg font-semibold text-gray-900 mb-3">
                News Title
              </label>
              <input
                v-model="formData.topic"
                type="text"
                id="topic"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-800 text-lg"
                placeholder="Enter an interesting title..."
                required
              >
            </div>

            <!-- Short Detail -->
            <div class="group">
              <label for="shortDetail" class="block text-lg font-semibold text-gray-900 mb-3">
                Short Description
              </label>
              <textarea
                v-model="formData.shortDetail"
                id="shortDetail"
                rows="4"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-800 text-lg leading-relaxed resize-none"
                placeholder="Give us a brief summary..."
                required
              ></textarea>
            </div>

            <!-- Full Detail -->
            <div class="group">
              <label for="fullDetail" class="block text-lg font-semibold text-gray-900 mb-3">
                Full News Content
              </label>
              <textarea
                v-model="formData.fullDetail"
                id="fullDetail"
                rows="8"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-800 text-lg leading-relaxed resize-none"
                placeholder="Write full news content here..."
                required
              ></textarea>
            </div>

            <!-- Image URL -->
            <div class="group">
              <label for="image" class="block text-lg font-semibold text-gray-900 mb-3">
                Image URL
              </label>
              <input
                v-model="formData.image"
                type="url"
                id="image"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-800 text-lg"
                placeholder="https://example.com/image.jpg"
                required
              >
            </div>

            <!-- Image Preview (if URL is provided) -->
            <div v-if="formData.image && isValidImageUrl" class="group">
              <label class="block text-lg font-semibold text-gray-900 mb-3">
                Image Preview
              </label>
              <img
                :src="formData.image"
                alt="News image preview"
                class="w-full h-auto rounded-lg shadow-md"
                @load="handleImageLoad"
                @error="handleImageError"
              >
            </div>

            <!-- Submit Button Section -->
            <div class="border-t border-gray-200 pt-8">
              <div class="flex justify-end space-x-4">
                <router-link
                  to="/"
                  class="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-red-500 hover:text-white transition-all duration-200 font-medium transform hover:scale-105 shadow-lg hover:shadow-xl"
                >
                  Cancel
                </router-link>
                <button
                  type="submit"
                  class="px-8 py-3 bg-nike-orange hover:bg-nike-yellow text-white font-semibold rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
                >
                  <span class="flex items-center space-x-2">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
                    </svg>
                    <span>Add News</span>
                  </span>
                </button>
              </div>
            </div>

          </form>
        </div>
      </div>

      <!-- Footer Note -->
      <div class="text-center mt-6">
        <p class="text-sm text-white">
          © One Man Army - All rights reserved.
        </p>
      </div>
    </div>
  </div>
</template>


