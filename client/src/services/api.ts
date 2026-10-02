import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000/api/public';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const api = {
  getSettings: async () => {
    const response = await apiClient.get('/settings');
    return response.data;
  },

  getTeams: async () => {
    const response = await apiClient.get('/teams');
    return response.data;
  },

  getTeamBySlug: async (slug: string) => {
    const response = await apiClient.get(`/teams/${slug}`);
    return response.data;
  },

  getFixtures: async (params?: { teamSlug?: string; status?: string }) => {
    const response = await apiClient.get('/fixtures', { params });
    return response.data;
  },

  getNews: async (params?: { teamSlug?: string }) => {
    const response = await apiClient.get('/news', { params });
    return response.data;
  },

  getArticle: async (id: string | number) => {
    const response = await apiClient.get(`/news/${id}`);
    return response.data;
  },

  getPlayer: async (id: string | number) => {
    const response = await apiClient.get(`/players/${id}`);
    return response.data;
  },

  getMedia: async () => {
    const response = await apiClient.get('/media');
    return response.data;
  },
};

export default apiClient;
