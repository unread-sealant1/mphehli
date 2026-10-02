import axios from 'axios';
import type { Player } from '../types';
import type { Fixture } from '../types/fixture';

export interface NewsArticle {
  id?: number;
  title: string;
  content: string;
  category: string;
  imageUrl?: string;
  published: boolean;
  createdAt?: Date;
}

export interface MediaAsset {
  id?: number;
  url: string;
  type: 'IMAGE' | 'VIDEO';
  altText?: string;
  uploadedAt?: Date;
}

export interface ClubSettings {
  id?: number;
  clubName: string;
  contactEmail: string;
  facebookUrl?: string;
  twitterUrl?: string;
  instagramUrl?: string;
  logoUrl?: string;
}

export interface SiteAsset {
  id?: number;
  key: string;
  url: string;
  altText?: string;
  updatedAt?: Date;
}

export interface Team {
  id: number;
  name: string;
  slug: string;
  identity?: string;
  competition?: string;
  imageUrl?: string;
}

const api = axios.create({
  baseURL: 'http://localhost:3000/api/admin',
});

// Request interceptor to add JWT token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('admin_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const playerApi = {
  getAll: async (): Promise<Player[]> => {
    const response = await api.get('/players');
    return response.data;
  },
  create: async (formData: FormData): Promise<Player> => {
    const response = await api.post('/players', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },
  update: async (id: number, formData: FormData): Promise<Player> => {
    const response = await api.put(`/players/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },
  delete: async (id: number): Promise<{ message: string }> => {
    const response = await api.delete(`/players/${id}`);
    return response.data;
  },
};

export const fixtureApi = {
  getAll: async (): Promise<Fixture[]> => {
    const response = await api.get('/fixtures');
    return response.data;
  },
  create: async (fixture: Omit<Fixture, 'id'>): Promise<Fixture> => {
    const response = await api.post('/fixtures', fixture);
    return response.data;
  },
  update: async (id: number, fixture: Partial<Fixture>): Promise<Fixture> => {
    const response = await api.put(`/fixtures/${id}`, fixture);
    return response.data;
  },
  delete: async (id: number): Promise<{ message: string }> => {
    const response = await api.delete(`/fixtures/${id}`);
    return response.data;
  },
};

export const newsApi = {
  getAll: async (): Promise<NewsArticle[]> => {
    const response = await api.get('/news');
    return response.data;
  },
  create: async (formData: FormData): Promise<NewsArticle> => {
    const response = await api.post('/news', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },
  update: async (id: number, formData: FormData): Promise<NewsArticle> => {
    const response = await api.put(`/news/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },
  delete: async (id: number): Promise<{ message: string }> => {
    const response = await api.delete(`/news/${id}`);
    return response.data;
  },
};

export const mediaApi = {
  getAll: async (): Promise<MediaAsset[]> => {
    const response = await api.get('/media');
    return response.data;
  },
  create: async (formData: FormData): Promise<MediaAsset> => {
    const response = await api.post('/media', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },
  delete: async (id: number): Promise<{ message: string }> => {
    const response = await api.delete(`/media/${id}`);
    return response.data;
  },
};

export const settingsApi = {
  get: async (): Promise<ClubSettings> => {
    const response = await api.get('/settings');
    return response.data;
  },
  update: async (formData: FormData): Promise<ClubSettings> => {
    const response = await api.post('/settings', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },
};

export const assetApi = {
  getAll: async (): Promise<SiteAsset[]> => {
    const response = await api.get('/assets');
    return response.data;
  },
  update: async (formData: FormData): Promise<SiteAsset> => {
    const response = await api.post('/assets', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },
};

export const teamApi = {
  getAll: async (): Promise<Team[]> => {
    const response = await api.get('/teams');
    return response.data;
  },
  updateImage: async (id: number, formData: FormData): Promise<Team> => {
    const response = await api.put(`/teams/${id}/image`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },
};
