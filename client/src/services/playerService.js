const API_BASE_URL = (import.meta.env.VITE_API_URL || 'http://localhost:5000') + '/api';
const SERVER_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

function formatImageUrl(url) {
  if (!url) return url;
  if (url.startsWith('http')) {
    return url.replace('http://localhost:5000', SERVER_BASE_URL);
  }
  return `${SERVER_BASE_URL}${url.startsWith('/') ? '' : '/'}${url}`;
}

export const playerService = {
  getPlayers: async (options = {}) => {
    const { team, featured, position } = options;
    const queryParams = [];
    if (team) queryParams.push(`team=${team}`);
    if (featured) queryParams.push(`featured=true`);
    if (position) queryParams.push(`position=${position}`);

    const url = queryParams.length > 0
      ? `${API_BASE_URL}/players?${queryParams.join('&')}`
      : `${API_BASE_URL}/players`;

    const response = await fetch(url);
    if (!response.ok) throw new Error('Failed to fetch players');
    const data = await response.json();
    return data.map(player => {
      const logo = formatImageUrl(player.logo);
      return {
        ...player,
        id: player._id,
        logo
      };
    });
  },
  getPlayerById: async (id) => {
    const response = await fetch(`${API_BASE_URL}/players/${id}`);
    if (!response.ok) throw new Error('Player not found');
    const player = await response.json();
    const logo = formatImageUrl(player.logo);
    return { ...player, id: player._id, logo };
  },
  getFeaturedPlayers: async () => {
    return playerService.getPlayers({ featured: true });
  },
  getPlayersByPosition: async (position) => {
    return playerService.getPlayers({ position });
  },
  createPlayer: async (playerData) => {
    const response = await fetch(`${API_BASE_URL}/players`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(playerData),
    });
    if (!response.ok) throw new Error('Failed to create player');
    return response.json();
  },
  updatePlayer: async (id, updateData) => {
    const response = await fetch(`${API_BASE_URL}/players/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updateData),
    });
    if (!response.ok) throw new Error('Failed to update player');
    return response.json();
  },
  deletePlayer: async (id) => {
    const response = await fetch(`${API_BASE_URL}/players/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete player');
    return response.json();
  }
};
