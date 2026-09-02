const API_BASE_URL = (import.meta.env.VITE_API_URL || 'http://localhost:5000') + '/api';

export const sponsorService = {
  getSponsors: async () => {
    const response = await fetch(`${API_BASE_URL}/sponsors`);
    if (!response.ok) throw new Error('Failed to fetch sponsors');
    return response.json();
  },
  getSponsorById: async (id) => {
    const response = await fetch(`${API_BASE_URL}/sponsors/${id}`);
    if (!response.ok) throw new Error('Sponsor not found');
    return response.json();
  },
  createSponsor: async (sponsorData) => {
    const response = await fetch(`${API_BASE_URL}/sponsors`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(sponsorData),
    });
    if (!response.ok) throw new Error('Failed to create sponsor');
    return response.json();
  },
  updateSponsor: async (id, updateData) => {
    const response = await fetch(`${API_BASE_URL}/sponsors/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updateData),
    });
    if (!response.ok) throw new Error('Failed to update sponsor');
    return response.json();
  },
  deleteSponsor: async (id) => {
    const response = await fetch(`${API_BASE_URL}/sponsors/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete sponsor');
    return response.json();
  }
};
