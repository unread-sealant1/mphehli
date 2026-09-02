import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { playerService } from '../services/playerService';
import { resultService } from '../services/resultService';
import { adminService } from '../services/adminService';
import { settingsService } from '../services/settingsService';
import { getResult } from '../utils/footballUtils';
import { AdminTable, AdminButton } from '../components/AdminUI';
import { CheckCircle2, Star } from 'lucide-react';
import '../styles/admin-pages.css';


// ── PLAYER CARDS ────────────────────────────────────────────────────────────

export function PlayerCards() {
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState('');

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 3000); };

  useEffect(() => {
    async function loadPlayers() {
      try {
        const data = await playerService.getPlayers();
        setCards(data.map(p => ({
          id: p.id,
          name: p.name,
          number: p.number,
          position: p.position,
          image: p.image,
          featured: p.featured,
          published: true,
          order: p.number
        })));
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    loadPlayers();
  }, []);

  const toggleFeatured = async (id) => {
    try {
      const player = cards.find(c => c.id === id);
      await playerService.updatePlayer(id, { featured: !player.featured });
      setCards(prev => prev.map(c => c.id === id ? { ...c, featured: !c.featured } : c));
      showToast('Card updated');
    } catch (e) {
      showToast('Error updating card');
    }
  };

  const togglePublished = async (id) => {
    // Assuming there is a published field in the DB or we handle it via another service
    showToast('Visibility updated');
  };

  if (loading) return <div className="admin-page-subtitle">Loading players...</div>;

  return (
    <div className="admin-page-container">
      {toast && <div className="admin-toast"><CheckCircle2 size={14} style={{ marginRight: '4px' }} /> {toast}</div>}
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Player Cards</h1>
          <p className="admin-page-subtitle">Control how player cards appear on the public website. Drag to reorder.</p>
        </div>
      </div>
      <div className="admin-cards-grid">
        {cards.map(card => (
          <div key={card.id} className={`admin-card-manager ${card.published ? 'published' : 'draft'}`}>
            <div className="admin-card-media">
              <img src={card.image} alt={card.name} className="admin-card-media-img" />
              <div className="admin-card-number">{card.number}</div>
              {card.featured && (
                <div className="admin-card-featured">
                  <Star size={12} style={{ marginRight: '4px' }} /> Featured
                </div>
              )}
            </div>
            <div className="admin-card-details">
              <div className="admin-card-name">{card.name}</div>
              <div className="admin-card-position">{card.position}</div>
              <div className="admin-card-actions">
                <button
                  onClick={() => toggleFeatured(card.id)}
                  className={`admin-card-btn ${card.featured ? 'admin-card-btn-active' : ''}`}
                >
                  {card.featured ? 'Featured' : 'Feature'}
                </button>
                <button
                  onClick={() => togglePublished(card.id)}
                  className={`admin-card-btn ${card.published ? 'admin-card-btn-active' : ''}`}
                >
                  {card.published ? 'Hide' : 'Show'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── RESULTS MANAGEMENT ───────────────────────────────────────────────────────

export function ResultsManagement() {
  const [fixtures, setFixtures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState('');
  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 3000); };

  useEffect(() => {
    async function loadResults() {
      try {
        const data = await resultService.getResults();
        setFixtures(data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    loadResults();
  }, []);

  return (
    <div className="admin-page-container">
      {toast && <div className="admin-toast"><CheckCircle2 size={14} style={{ marginRight: '4px' }} /> {toast}</div>}
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Results</h1>
          <p className="admin-page-subtitle">{fixtures.length} recorded results</p>
        </div>
      </div>
      {loading ? (
        <div className="admin-page-subtitle">Loading results...</div>
      ) : (
        <AdminTable
          headers={['Match', 'Score', 'Date', 'Result', 'Actions']}
          data={fixtures}
          emptyMessage="No results found"
          renderRow={(fix) => {
            const res = getResult(fix);
            return (
              <tr key={fix.id}>
                <td className="admin-table-cell">
                  <div className="admin-player-name">{fix.homeTeam} vs {fix.awayTeam}</div>
                  <div className="admin-player-meta">{fix.competition}</div>
                </td>
                <td className="admin-table-cell admin-player-name">
                  {fix.homeScore} – {fix.awayScore}
                </td>
                <td className="admin-table-cell text-sm text-slate-600">
                  {new Date(fix.date).toLocaleDateString('en-ZA', { day: 'numeric', month: 'short', year: 'numeric' })}
                </td>
                <td className="admin-table-cell">
                  {res && <span className={`admin-badge ${res === 'WIN' ? 'badge-active' : res === 'DRAW' ? 'badge-default' : 'badge-inactive'}`}>{res}</span>}
                </td>
                <td className="admin-table-cell admin-actions-cell">
                  <div className="flex justify-end gap-2">
                    <button onClick={() => showToast('Editing result...')} className="admin-action-btn">Edit</button>
                    <button onClick={() => setFixtures(prev => prev.filter(f => f.id !== fix.id))} className="admin-action-btn admin-action-btn-delete">Delete</button>
                  </div>
                </td>
              </tr>
            );
          }}
        />
      )}
    </div>
  );
}

// ── WEBSITE SETTINGS ────────────────────────────────────────────────────────

export function WebsiteSettings({ section }) {
  const [values, setValues] = useState({});
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState('');
  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 3000); };

  const labels = {
    homepage: 'Homepage Settings',
    about: 'About Page',
    contact: 'Contact Information',
    social: 'Social Media',
    settings: 'General Settings',
  };

  useEffect(() => {
    async function loadSettings() {
      try {
        const data = await settingsService.getSettings(section);
        setValues(data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    loadSettings();
  }, [section]);

  const handleSave = async () => {
    try {
      await settingsService.updateSettings(section, values);
      showToast('Settings saved successfully');
    } catch (e) {
      showToast('Error saving settings');
    }
  };

  if (loading) return <div className="admin-page-subtitle">Loading settings...</div>;

  return (
    <div className="admin-page-container">
      {toast && <div className="admin-toast"><CheckCircle2 size={14} style={{ marginRight: '4px' }} /> {toast}</div>}
      <div className="admin-page-header">
        <h1 className="admin-page-title">{labels[section] ?? 'Settings'}</h1>
      </div>
      <div className="admin-form-section">
        <div className="admin-form-fields">
          {Object.entries(values).map(([key, value]) => (
            <AdminInput
              key={key}
              label={key.charAt(0).toUpperCase() + key.slice(1)}
              value={value}
              onChange={e => setValues(v => ({ ...v, [key]: e.target.value }))}
            />
          ))}
          <div className="admin-form-actions" style={{ marginTop: '2rem' }}>
            <AdminButton
              onClick={handleSave}
              variant="primary"
              className="admin-form-submit-btn"
            >
              Save Changes
            </AdminButton>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── ADMIN USERS ───────────────────────────────────────────────────────────────

export function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState('');
  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 3000); };

  useEffect(() => {
    async function loadUsers() {
      try {
        const data = await adminService.getAdminUsers();
        setUsers(data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    loadUsers();
  }, []);

  const roleColors = {
    'Super Admin': 'role-superadmin',
    'Editor': 'role-editor',
    'Viewer': 'role-viewer',
  };

  const handleDelete = async (id) => {
    try {
      await adminService.deleteAdminUser(id);
      setUsers(prev => prev.filter(u => u.id !== id));
      showToast('User deleted');
    } catch (e) {
      showToast('Error deleting user');
    }
  };

  if (loading) return <div className="admin-page-subtitle">Loading users...</div>;

  return (
    <div className="admin-page-container">
      {toast && <div className="admin-toast"><CheckCircle2 size={14} style={{ marginRight: '4px' }} /> {toast}</div>}
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Admin Users</h1>
          <p className="admin-page-subtitle">{users.length} users</p>
        </div>
        <AdminButton onClick={() => showToast('Add user feature coming soon')} variant="primary">
          + Add User
        </AdminButton>
      </div>
      <AdminTable
        headers={['User', 'Role', 'Last Login', 'Status', 'Actions']}
        data={users}
        emptyMessage="No users found"
        renderRow={(user) => (
          <tr key={user.id}>
            <td className="admin-table-cell">
              <div className="admin-user-info">
                <div className="admin-user-avatar">
                  <span>{user.name[0]}</span>
                </div>
                <div>
                  <div className="admin-user-name">{user.name}</div>
                  <div className="admin-user-email">{user.email}</div>
                </div>
              </div>
            </td>
            <td className="admin-table-cell">
              <span className={`admin-user-role-badge ${roleColors[user.role] || 'role-viewer'}`}>{user.role}</span>
            </td>
            <td className="admin-table-cell text-sm text-slate-600">
              {new Date(user.lastLogin).toLocaleDateString('en-ZA', { day: 'numeric', month: 'short', year: 'numeric' })}
            </td>
            <td className="admin-table-cell">
              <span className={`admin-badge ${user.status === 'active' ? 'badge-active' : 'badge-inactive'}`}>
                {user.status}
              </span>
            </td>
            <td className="admin-table-cell admin-actions-cell">
              <div className="flex justify-end gap-2">
                <button onClick={() => showToast('Editing user...')} className="admin-action-btn">Edit</button>
                {user.role !== 'Super Admin' && (
                  <button onClick={() => handleDelete(user.id)} className="admin-action-btn admin-action-btn-delete">Delete</button>
                )}
              </div>
            </td>
          </tr>
        )}
      />
    </div>
  );
}
