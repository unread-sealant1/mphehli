const API_BASE_URL = (import.meta.env.VITE_API_URL || 'http://localhost:5000') + '/api';

export const resultService = {
  getResults: async () => {
    const response = await fetch(`${API_BASE_URL}/fixtures/completed`);
    if (!response.ok) throw new Error('Failed to fetch results');
    return response.json();
  },
  getLatestResult: async () => {
    const results = await resultService.getResults();
    return results[0];
  }
};
