const API_BASE_URL = 'http://localhost:5000/api';

export const settingsService = {
  async getSettings(section) {
    const response = await fetch(`${API_BASE_URL}/settings/${section}`);
    if (!response.ok) throw new Error(`Failed to fetch ${section} settings`);
    return response.json();
  },

  async updateSettings(section, settingsData) {
    const response = await fetch(`${API_BASE_URL}/settings/${section}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(settingsData),
    });
    if (!response.ok) throw new Error(`Failed to update ${section} settings`);
    return response.json();
  }
};
