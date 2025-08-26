<script setup lang="ts">
import { ref, computed, defineProps, defineEmits, nextTick } from 'vue';
import type { News } from '../stores/newsInterface';
import { useNewsStore } from '../stores/newsInterface';
import { useNotificationStore } from '../stores/notifications';
import { useRoute } from 'vue-router';

const newsStore = useNewsStore();
const notificationStore = useNotificationStore();
const route = useRoute();

const newsId = route.params.id as string;
const newsFromStore = computed(() => newsStore.getNewsById(newsId));

const props = defineProps<{
    news: News
}>();

const emit = defineEmits(['submitVote']);

// Vote form data
const selectedVote = ref<'fake' | 'real' | null>(null);
const voterName = ref<string>('');
const voterComment = ref<string>('');
const voterImage = ref<string>('');

const fakeVotes = computed(() => props.news.voteSummary?.fake || 0);
const realVotes = computed(() => props.news.voteSummary?.real || 0);
const totalVotes = computed(() => fakeVotes.value + realVotes.value);

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const realPercentage = computed(() => {
    const total = totalVotes.value;
    if (total === 0) return 0;
    return Math.round((realVotes.value / total) * 100);
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const fakePercentage = computed(() => {
    const total = totalVotes.value;
    if (total === 0) return 0;
    return Math.round((fakeVotes.value / total) * 100);
});

const submitVote = () => {
    if (!selectedVote.value) {
        alert('Please select your vote (Real or Fake)');
        return;
    }

    emit('submitVote', {
        userName: voterName.value,
        vote: selectedVote.value,
        commentText: voterComment.value,
        imageUrl: voterImage.value
    });

    // Reset form
    selectedVote.value = null;
    voterName.value = '';
    voterComment.value = '';
    voterImage.value = '';
};

const handleVoteSubmission = async (data: {
  userName: string;
  vote: 'fake' | 'real';
  commentText: string;
  imageUrl: string | null;
}) => {
  try {
    if (!newsFromStore.value) return;

    const updatedNews = { ...newsFromStore.value };

    // update voteSummary
    if (!updatedNews.voteSummary) {
      updatedNews.voteSummary = { real: 0, fake: 0 };
    }
    if (data.vote === 'real') {
      updatedNews.voteSummary.real += 1;
    } else {
      updatedNews.voteSummary.fake += 1;
    }

    // update comments โดยเพิ่ม id ให้แต่ละ comment ใหม่!
    if (!updatedNews.comments) {
      updatedNews.comments = [];
    }
    updatedNews.comments.push({
      id: Date.now().toString(), // หรือ nanoid(), หรือ Math.random().toString()
      user: data.userName || 'Anonymous',
      text: data.commentText || '',
      image: data.imageUrl || null,
      time: new Date().toISOString(),
      vote: data.vote,
    });

    updatedNews.totalVotes = (updatedNews.totalVotes || 0) + 1;

    await fetch(`https://68ab38ab909a5835049e0ad3.mockapi.io/api/v1/News/${updatedNews.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedNews),
    });

    await newsStore.fetchNews();

    notificationStore.addNotification('Vote submitted and news updated.', 'success');
  } catch (e) {
    notificationStore.addNotification('Failed to send vote to server.', 'error');
    console.error(e);
  }
};

import AddEmojiButton from '@/components/AddEmojiButton.vue'

const commentTextarea = ref<HTMLTextAreaElement | null>(null)

function insertEmoji(emoji: string) {
  const textarea = commentTextarea.value
  if (textarea) {
    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    voterComment.value =
      voterComment.value.slice(0, start) + emoji + voterComment.value.slice(end)
    nextTick(() => {
      textarea.focus()
      textarea.selectionStart = textarea.selectionEnd = start + emoji.length
    })
  } else {
    voterComment.value += emoji
  }
}
</script>

<template>
    <div class="grid grid-cols-1 gap-8">
        <div class="bg-gray-100 border border-gray-300 p-6 rounded-xl">
            <div class="mb-6">
                <label class="block text-lg font-semibold text-gray-800 mb-4">vote:</label>
                <div class="flex space-x-4">
                  <button
                      @click="selectedVote = 'real'"
                      :class="{
                          'bg-green-500 text-white': selectedVote === 'real',
                          'bg-green-100 text-green-600 hover:bg-green-200': selectedVote !== 'real'
                      }"
                      class="px-6 py-2 rounded-full font-bold transition-colors duration-200 flex items-center gap-1"
                  >
                      <svg
                        :class="selectedVote === 'real' ? 'text-white' : 'text-green-500'"
                        class="w-6 h-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        stroke-width="4"
                      >
                        <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                      REAL
                  </button>

                  <button
                      @click="selectedVote = 'fake'"
                      :class="{
                          'bg-red-500 text-white': selectedVote === 'fake',
                          'bg-red-100 text-red-600 hover:bg-red-200': selectedVote !== 'fake'
                      }"
                      class="px-4 py-2 rounded-full font-bold transition-colors duration-200 flex items-center gap-1"
                  >
                      <svg
                        :class="selectedVote === 'fake' ? 'text-white' : 'text-red-500'"
                        class="w-6 h-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        stroke-width="4"
                      >
                        <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                      FAKE
                  </button>
                </div>
            </div>

            <div class="mb-4">
                <input
                    v-model="voterName"
                    type="text"
                    placeholder="Enter your name (optional)"
                    class="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
            </div>

            <div class="mb-4">
              <div class="flex items-center mb-2">
                <span class="mr-2 text-sm text-gray-600">Insert Emoji:</span>
                <AddEmojiButton @select="insertEmoji" />
              </div>
                <textarea
                    v-model="voterComment"
                    placeholder="Write a comment... (optional)"
                    rows="4"
                    class="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                ></textarea>
            </div>

            <div class="mb-6">
                <input
                    v-model="voterImage"
                    type="text"
                    placeholder="Enter an image url (optional)"
                    class="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
            </div>

            <button
                @click="submitVote"
                :news="news"
                @submitVote="handleVoteSubmission"
                :disabled="!selectedVote"
                class="w-full bg-nike-orange text-white font-bold py-3 rounded-lg hover:bg-nike-yellow disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-200"
            >
                Submit
            </button>
        </div>
    </div>
</template>

