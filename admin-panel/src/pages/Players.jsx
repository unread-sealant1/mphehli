import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { playerService } from '../services/playerService';
import { AdminTable, AdminButton, AdminInput, AdminSelect } from '../components/AdminUI';
import { CheckCircle2, Eye, Pencil, Trash2 } from 'lucide-react';
import AdminPageTitle from '../components/AdminPageTitle';
import '../styles/admin-pages.css';

export default function AdminPlayers() {
  const [players, setPlayers] = useState([]);
  const [search, setSearch] = useState('');
  const [teamFilter, setTeamFilter] = useState('all');
  const [deleteId, setDeleteId] = useState(null);
  const [toastMsg, setToastMsg] = useState('');

  const teams = [
    { id: 'all', name: 'All Teams' },
    { id: 'abc_motsepe', name: 'ABC Motsepe Foundation' },
    { id: 'sab_regional', name: 'SAB Regional League' },
    { id: 'sasol_women', name: "2026 Sasol Women's League" },
  ];

  useEffect(() => {
    async function loadPlayers() {
      try {
        const data = await playerService.getPlayers(teamFilter === 'all' ? '' : teamFilter);
        setPlayers(data);
      } catch (error) {
        console.error("Error loading players:", error);
      }
    }
    loadPlayers();
  }, [teamFilter]);

  const filtered = players.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.position.toLowerCase().includes(search.toLowerCase())
  );

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 3000);
  };

  const handleDelete = async (id) => {
    try {
      await playerService.deletePlayer(id);
      setPlayers(prev => prev.filter(p => p.id !== id));
      setDeleteId(null);
      showToast('Player deleted successfully');
    } catch (error) {
      console.error("Error deleting player:", error);
      showToast('Error deleting player');
    }
  };

  const getPositionBadgeClass = (position) => {
    switch (position) {
      case 'Goalkeeper': return 'badge-goalkeeper';
      case 'Defender': return 'badge-defender';
      case 'Midfielder': return 'badge-midfielder';
      case 'Forward': return 'badge-forward';
      default: return 'badge-default';
    }
  };

  return (
    <div className="admin-page-container">
      <AdminPageTitle title="Players" />
      {toastMsg && (
        <div className="admin-toast">
          <CheckCircle2 size={14} style={{ marginRight: '4px' }} /> {toastMsg}
        </div>
      )}

      {deleteId && (
        <div className="admin-modal-overlay">
          <div className="admin-modal-content">
            <h3 className="admin-modal-title">Confirm Delete</h3>
            <p className="admin-modal-text">Are you sure you want to delete this player? This action cannot be undone.</p>
            <div className="admin-modal-actions">
              <AdminButton onClick={() => handleDelete(deleteId)} variant="danger" className="flex-1">Delete</AdminButton>
              <AdminButton onClick={() => setDeleteId(null)} variant="secondary" className="flex-1">Cancel</AdminButton>
            </div>
          </div>
        </div>
      )}

      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Players</h1>
          <p className="admin-page-subtitle">{players.filter(p => p.status === 'active').length} active players</p>
        </div>
        <Link
          to="/players/new"
          className="admin-btn-primary admin-btn"
          style={{ textDecoration: 'none' }}
        >
          + Add Player
        </Link>
      </div>

      <div className="admin-filter-bar">
        <div className="admin-filter-search">
          <AdminInput
            label="Search Players"
            placeholder="Search by name or position..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <div className="admin-filter-team">
          <AdminSelect
            label="Filter by Team"
            value={teamFilter}
            onChange={e => setTeamFilter(e.target.value)}
            options={teams.map(t => ({ label: t.name, value: t.id }))}
          />
        </div>
      </div>

      <AdminTable
        headers={['Player', '#', 'Position', 'Stats', 'Status', 'Actions']}
        data={filtered}
        emptyMessage="No players found"
        renderRow={(player) => (
          <tr key={player.id}>
            <td className="admin-table-cell">
              <div className="admin-player-info">
                <img src={player.image} alt={player.name} className="admin-player-avatar" />
                <div>
                  <div className="admin-player-name">{player.name}</div>
                  <div className="admin-player-meta">{player.nationality}</div>
                </div>
              </div>
            </td>
            <td className="admin-table-cell font-bold text-slate-600 text-sm">
              {player.number}
            </td>
            <td className="admin-table-cell">
              <span className={`admin-badge ${getPositionBadgeClass(player.position)}`}>
                {player.position}
              </span>
            </td>
            <td className="admin-table-cell admin-stats-cell">
              <div className="admin-stats-group">
                <span><span className="admin-stats-value">{player.appearances}</span> apps</span>
                <span><span className="admin-stats-value">{player.goals}</span> gls</span>
                <span><span className="admin-stats-value">{player.assists}</span> ast</span>
              </div>
            </td>
            <td className="admin-table-cell">
              <span className={`admin-badge ${player.status === 'active' ? 'badge-active' : 'badge-inactive'}`}>
                {player.status}
              </span>
            </td>
            <td className="admin-table-cell admin-actions-cell">
              <div className="flex justify-end gap-2">
                <Link to={`/team/${player.id}`} className="admin-action-btn" title="View">
                  <Eye size={14} />
                </Link>
                <Link to={`/players/edit/${player.id}`} className="admin-action-btn" title="Edit">
                  <Pencil size={14} />
                </Link>
                <button onClick={() => setDeleteId(player.id)} className="admin-action-btn admin-action-btn-delete" title="Delete">
                  <Trash2 size={14} />
                </button>
              </div>
            </td>
          </tr>
        )}
      />
    </div>
  );
}
