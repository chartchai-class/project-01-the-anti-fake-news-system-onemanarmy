import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import apiClient from '../services/mockapiService';

export interface Comment {
  id: string;
  user: string;
  text: string;
  image: string | null;
  time: string;
  vote: 'real' | 'fake';
}

export interface News {
  id: string;
  topic: string;
  shortDetail: string;
  fullDetail: string;
  image: string;
  reporter: string;
  dateTime: string;
  voteSummary: {
    real: number;
    fake: number;
  };
  totalVotes: number;
  comments: Comment[];
  status?: 'fake' | 'not fake' | 'equal';
}

export interface VoteSummary {
  real: number;
  fake: number;
}

export type Vote = 'real' | 'fake';

export const useNewsStore = defineStore('news', () => {
  const allNews = ref<News[]>([]);
  const unsavedNews = ref<News[]>([]);
  const getCombinedNews = computed(() => {
    return [...allNews.value, ...unsavedNews.value];
  });

  const getNewsById = computed(() => (id: string): News | undefined => {
    const newsItem = getCombinedNews.value.find((news) => news.id === id);
    if (!newsItem) return undefined;

    let calculatedStatus: 'fake' | 'not fake' | 'equal';
    if (newsItem.voteSummary.real > newsItem.voteSummary.fake) {
      calculatedStatus = 'not fake';
    } else if (newsItem.voteSummary.real < newsItem.voteSummary.fake) {
      calculatedStatus = 'fake';
    } else {
      calculatedStatus = 'equal';
    }

    return { ...newsItem, status: calculatedStatus };
  });

  const getNewsWithStatus = computed(() => (statusFilter: 'all' | 'fake' | 'not fake' | 'equal'): News[] => {
    const allNewsWithStatus = getCombinedNews.value.map((news) => {
      let calculatedStatus: 'fake' | 'not fake' | 'equal';
      if (news.voteSummary.real > news.voteSummary.fake) {
        calculatedStatus = 'not fake';
      } else if (news.voteSummary.real < news.voteSummary.fake) {
        calculatedStatus = 'fake';
      } else {
        calculatedStatus = 'equal';
      }
      return { ...news, status: calculatedStatus };
    });

    if (statusFilter === 'all') {
      return allNewsWithStatus;
    }
    return allNewsWithStatus.filter((news) => news.status === statusFilter);
  });

  async function fetchNews() {
    try {
      const response = await apiClient.getNews();
      allNews.value = response.data;
    } catch (error) {
      console.error('Error fetching news:', error);
      allNews.value = [];
    }
  }

  function addUnsavedNews(newNews: Omit<News, 'id'>) {
    const tempId = ((Math.random() * -1000000) - Date.now()).toString();
    unsavedNews.value.push({ ...newNews, id: tempId });
  }

  function addCommentToNews(
    newsId: string,
    user: string,
    text: string,
    image: string | null,
    vote: 'real' | 'fake',
  ) {

    const newsItem = getNewsById.value(newsId);
    if (!newsItem) {
      console.error('News item not found!');
      return;
    }

    const newCommentId =
      newsItem.comments.length > 0 ? (
          Math.max(...newsItem.comments.map((c) => Number(c.id))) + 1
        ).toString() : '1';

    const newComment: Comment = {
      id: newCommentId,
      user,
      text,
      image,
      time: new Date().toISOString(),
      vote,
    };

    newsItem.comments.push(newComment);

    if (vote === 'real') {
      newsItem.voteSummary.real++;
    } else {
      newsItem.voteSummary.fake++;
    }
  }

  return { allNews, unsavedNews, getCombinedNews, getNewsById, getNewsWithStatus, fetchNews, addCommentToNews, addUnsavedNews };
});
