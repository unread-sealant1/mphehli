const API_BASE_URL = 'http://localhost:5000/api';

export const adminService = {
  async getProfile() {
    const response = await fetch(`${API_BASE_URL}/admin/profile`);
    if (!response.ok) throw new Error('Failed to fetch profile');
    return response.json();
  },

  async updateProfile(profileData) {
    const response = await fetch(`${API_BASE_URL}/admin/profile`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(profileData),
    });
    if (!response.ok) throw new Error('Failed to update profile');
    return response.json();
  },

  async getDashboardStats() {
    const response = await fetch(`${API_BASE_URL}/admin/stats`);
    if (!response.ok) throw new Error('Failed to fetch dashboard stats');
    return response.json();
  },

  async getRecentActivity() {
    const response = await fetch(`${API_BASE_URL}/admin/activity`);
    if (!response.ok) throw new Error('Failed to fetch recent activity');
    return response.json();
  },

  async getAdminUsers() {
    const response = await fetch(`${API_BASE_URL}/admin/users`);
    if (!response.ok) throw new Error('Failed to fetch admin users');
    return response.json();
  },

  async updateAdminUser(id, updateData) {
    const response = await fetch(`${API_BASE_URL}/admin/users/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updateData),
    });
    if (!response.ok) throw new Error('Failed to update admin user');
    return response.json();
  },

  async deleteAdminUser(id) {
    const response = await fetch(`${API_BASE_URL}/admin/users/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete admin user');
    return response.json();
  }
};
