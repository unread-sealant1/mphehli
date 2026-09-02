import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { staffService } from '../services/staffService';
import { AdminTable, AdminButton, AdminInput, AdminSelect } from '../components/AdminUI';
import { CheckCircle2, Pencil, Trash2 } from 'lucide-react';
import AdminPageTitle from '../components/AdminPageTitle';
import '../styles/admin-pages.css';

export default function AdminStaff() {
  const [staff, setStaff] = useState([]);
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
    async function loadStaff() {
      try {
        const data = await staffService.getStaff(teamFilter === 'all' ? '' : teamFilter);
        setStaff(data);
      } catch (error) {
        console.error("Error loading staff:", error);
      }
    }
    loadStaff();
  }, [teamFilter]);

  const filtered = staff.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.role.toLowerCase().includes(search.toLowerCase())
  );

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 3000);
  };

  const handleDelete = async (id) => {
    try {
      await staffService.deleteStaff(id);
      setStaff(prev => prev.filter(s => s.id !== id));
      setDeleteId(null);
      showToast('Staff member deleted successfully');
    } catch (error) {
      console.error("Error deleting staff:", error);
      showToast('Error deleting staff');
    }
  };

  return (
    <div className="admin-page-container">
      <AdminPageTitle title="Staff" />
      {toastMsg && (
        <div className="admin-toast">
          <CheckCircle2 size={14} style={{ marginRight: '4px' }} /> {toastMsg}
        </div>
      )}

      {deleteId && (
        <div className="admin-modal-overlay">
          <div className="admin-modal-content">
            <h3 className="admin-modal-title">Confirm Delete</h3>
            <p className="admin-modal-text">Are you sure you want to delete this staff member? This action cannot be undone.</p>
            <div className="admin-modal-actions">
              <AdminButton onClick={() => handleDelete(deleteId)} variant="danger" className="flex-1">Delete</AdminButton>
              <AdminButton onClick={() => setDeleteId(null)} variant="secondary" className="flex-1">Cancel</AdminButton>
            </div>
          </div>
        </div>
      )}

      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Staff</h1>
          <p className="admin-page-subtitle">{staff.filter(s => s.status === 'active').length} active staff members</p>
        </div>
        <Link
          to="/staff/new"
          className="admin-btn-primary admin-btn"
          style={{ textDecoration: 'none' }}
        >
          + Add Staff
        </Link>
      </div>

      <div className="admin-filter-bar">
        <div className="admin-filter-search">
          <AdminInput
            label="Search Staff"
            placeholder="Search by name or role..."
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
        headers={['Staff Member', 'Role', 'Team', 'Status', 'Actions']}
        data={filtered}
        emptyMessage="No staff found"
        renderRow={(member) => (
          <tr key={member.id}>
            <td className="admin-table-cell">
              <div className="admin-player-info">
                <img src={member.photo} alt={member.name} className="admin-player-avatar" />
                <div>
                  <div className="admin-player-name">{member.name}</div>
                  <div className="admin-player-meta">{member.role}</div>
                </div>
              </div>
            </td>
            <td className="admin-table-cell text-sm text-slate-600">
              {member.role}
            </td>
            <td className="admin-table-cell text-sm text-slate-600">
              {member.team}
            </td>
            <td className="admin-table-cell">
              <span className={`admin-badge ${member.status === 'active' ? 'badge-active' : 'badge-inactive'}`}>
                {member.status}
              </span>
            </td>
            <td className="admin-table-cell admin-actions-cell">
              <div className="flex justify-end gap-2">
                <Link to={`/staff/edit/${member.id}`} className="admin-action-btn" title="Edit">
                  <Pencil size={14} />
                </Link>
                <button onClick={() => setDeleteId(member.id)} className="admin-action-btn admin-action-btn-delete" title="Delete">
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
