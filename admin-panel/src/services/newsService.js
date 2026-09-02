const API_BASE_URL = 'http://localhost:5000/api';

export const newsService = {
  getNews: async () => {
    const response = await fetch(`${API_BASE_URL}/news`);
    if (!response.ok) throw new Error('Failed to fetch news');
    return response.json();
  },
  getNewsById: async (id) => {
    const response = await fetch(`${API_BASE_URL}/news/${id}`);
    if (!response.ok) throw new Error('Article not found');
    return response.json();
  },
  createNews: async (newsData) => {
    const response = await fetch(`${API_BASE_URL}/news`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newsData),
    });
    if (!response.ok) throw new Error('Failed to create news article');
    return response.json();
  },
  updateNews: async (id, updateData) => {
    const response = await fetch(`${API_BASE_URL}/news/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updateData),
    });
    if (!response.ok) throw new Error('Failed to update news article');
    return response.json();
  },
  deleteNews: async (id) => {
    const response = await fetch(`${API_BASE_URL}/news/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete news article');
    return response.json();
  }
};
