const API_BASE_URL = (import.meta.env.VITE_API_URL || 'http://localhost:5000') + '/api';

export const staffService = {
  getStaff: async (team = '') => {
    const url = team ? `${API_BASE_URL}/staff?team=${team}` : `${API_BASE_URL}/staff`;
    const response = await fetch(url);
    if (!response.ok) throw new Error('Failed to fetch staff');
    const data = await response.json();
    return data.map(s => ({
      ...s,
      id: s._id
    }));
  },
  getActiveStaff: async () => {
    const staff = await staffService.getStaff();
    return staff.filter(s => s.status === 'active');
  },
  getStaffById: async (id) => {
    const response = await fetch(`${API_BASE_URL}/staff/${id}`);
    if (!response.ok) throw new Error('Staff member not found');
    const staff = await response.json();
    return { ...staff, id: staff._id };
  },
  createStaff: async (staffData) => {
    const response = await fetch(`${API_BASE_URL}/staff`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(staffData),
    });
    if (!response.ok) throw new Error('Failed to create staff member');
    return response.json();
  },
  updateStaff: async (id, updateData) => {
    const response = await fetch(`${API_BASE_URL}/staff/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updateData),
    });
    if (!response.ok) throw new Error('Failed to update staff member');
    return response.json();
  },
  deleteStaff: async (id) => {
    const response = await fetch(`${API_BASE_URL}/staff/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete staff member');
    return response.json();
  }
};
