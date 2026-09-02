const API_BASE_URL = 'http://localhost:5000/api';

export const galleryService = {
  getGallery: async () => {
    const response = await fetch(`${API_BASE_URL}/gallery`);
    if (!response.ok) throw new Error('Failed to fetch gallery');
    return response.json();
  },
  getGalleryItemById: async (id) => {
    const response = await fetch(`${API_BASE_URL}/gallery/${id}`);
    if (!response.ok) throw new Error('Gallery item not found');
    return response.json();
  },
  createGalleryItem: async (itemData) => {
    const response = await fetch(`${API_BASE_URL}/gallery`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(itemData),
    });
    if (!response.ok) throw new Error('Failed to create gallery item');
    return response.json();
  },
  updateGalleryItem: async (id, updateData) => {
    const response = await fetch(`${API_BASE_URL}/gallery/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updateData),
    });
    if (!response.ok) throw new Error('Failed to update gallery item');
    return response.json();
  },
  deleteGalleryItem: async (id) => {
    const response = await fetch(`${API_BASE_URL}/gallery/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete gallery item');
    return response.json();
  }
};
