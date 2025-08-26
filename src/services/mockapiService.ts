import axios from 'axios';

const YOUR_PROJECT_ID = '68ab38ab909a5835049e0ad3';

const apiClient = axios.create({
  baseURL: `https://${YOUR_PROJECT_ID}.mockapi.io/api/v1`,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
  timeout: 60000,
});

// เรียก endpoint /News บน MockAPI.io
export default {
  getNews() {
    return apiClient.get('/News');
  },
};
