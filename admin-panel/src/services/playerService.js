const API_BASE_URL = 'http://localhost:5000/api';

export const playerService = {
  getPlayers: async (team = '') => {
    const url = team ? `${API_BASE_URL}/players?team=${team}` : `${API_BASE_URL}/players`;
    const response = await fetch(url);
    if (!response.ok) throw new Error('Failed to fetch players');
    const data = await response.json();
    return data.map(player => ({
      ...player,
      id: player._id
    }));
  },
  getPlayerById: async (id) => {
    const response = await fetch(`${API_BASE_URL}/players/${id}`);
    if (!response.ok) throw new Error('Player not found');
    const player = await response.json();
    return { ...player, id: player._id };
  },
  getFeaturedPlayers: async () => {
    const players = await playerService.getPlayers();
    return players.filter(p => p.featured);
  },
  getPlayersByPosition: async (position) => {
    const players = await playerService.getPlayers();
    return players.filter(p => p.position === position);
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
