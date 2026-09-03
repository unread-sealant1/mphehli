const API_BASE_URL = (import.meta.env.VITE_API_URL || 'http://localhost:5000') + '/api';

export const uploadService = {
  uploadImage: async (file) => {
    const formData = new FormData();
    formData.append('image', file);

    const response = await fetch(`${API_BASE_URL}/uploads/upload`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) throw new Error('Failed to upload image');

    const data = await response.json();
    // Prepend server base URL to the image path
    const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
    return `${baseUrl}${data.imageUrl}`;
  },
};
