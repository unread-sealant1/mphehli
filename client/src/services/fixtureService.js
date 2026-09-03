const API_BASE_URL = (import.meta.env.VITE_API_URL || 'http://localhost:5000') + '/api';

export const fixtureService = {
  getFixtures: async (options = {}) => {
    const { upcoming } = options;
    const url = upcoming ? `${API_BASE_URL}/fixtures?upcoming=true` : `${API_BASE_URL}/fixtures`;
    const response = await fetch(url);
    if (!response.ok) throw new Error('Failed to fetch fixtures');
    return response.json();
  },
  getUpcomingFixtures: async () => {
    return fixtureService.getFixtures({ upcoming: true });
  },
  getFixtureById: async (id) => {
    const response = await fetch(`${API_BASE_URL}/fixtures/${id}`);
    if (!response.ok) throw new Error('Fixture not found');
    return response.json();
  },
  createFixture: async (fixtureData) => {
    const response = await fetch(`${API_BASE_URL}/fixtures`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(fixtureData),
    });
    if (!response.ok) throw new Error('Failed to create fixture');
    return response.json();
  },
  updateFixture: async (id, updateData) => {
    const response = await fetch(`${API_BASE_URL}/fixtures/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updateData),
    });
    if (!response.ok) throw new Error('Failed to update fixture');
    return response.json();
  },
  deleteFixture: async (id) => {
    const response = await fetch(`${API_BASE_URL}/fixtures/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete fixture');
    return response.json();
  }
};
