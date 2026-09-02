import { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router';
import { fixtureService } from '../services/fixtureService';
import { AdminTable, AdminButton, AdminInput, AdminSelect } from '../components/AdminUI';
import { Pencil, Eye, Trash2, CheckCircle2, ChevronRight } from 'lucide-react';
import AdminPageTitle from '../components/AdminPageTitle';
import '../styles/admin-pages.css';

export function FixtureList() {
  const [fixtures, setFixtures] = useState([]);
  const [deleteId, setDeleteId] = useState(null);
  const [toastMsg, setToastMsg] = useState('');

  useEffect(() => {
    async function loadFixtures() {
      try {
        const data = await fixtureService.getFixtures();
        setFixtures(data);
      } catch (error) {
        console.error("Error loading fixtures:", error);
      }
    }
    loadFixtures();
  }, []);

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 3000);
  };

  const handleDelete = async (id) => {
    try {
      await fixtureService.deleteFixture(id);
      setFixtures(prev => prev.filter(f => f.id !== id));
      setDeleteId(null);
      showToast('Fixture deleted successfully');
    } catch (error) {
      console.error("Error deleting fixture:", error);
      showToast('Error deleting fixture');
    }
  };

  return (
    <div className="admin-page-container">
      <AdminPageTitle title="Fixtures" />
      {toastMsg && (
        <div className="admin-toast">
          <CheckCircle2 size={14} style={{ marginRight: '4px' }} /> {toastMsg}
        </div>
      )}

      {deleteId && (
        <div className="admin-modal-overlay">
          <div className="admin-modal-content">
            <h3 className="admin-modal-title">Delete Fixture?</h3>
            <p className="admin-modal-text">Are you sure you want to delete this fixture? This action cannot be undone.</p>
            <div className="admin-modal-actions">
              <AdminButton onClick={() => handleDelete(deleteId)} variant="danger" className="flex-1">Delete</AdminButton>
              <AdminButton onClick={() => setDeleteId(null)} variant="secondary" className="flex-1">Cancel</AdminButton>
            </div>
          </div>
        </div>
      )}

      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Fixtures</h1>
          <p className="admin-page-subtitle">{fixtures.length} scheduled matches</p>
        </div>
        <Link
          to="/fixtures/new"
          className="admin-btn-primary admin-btn"
          style={{ textDecoration: 'none' }}
        >
          + Add Fixture
        </Link>
      </div>

      <AdminTable
        headers={['Match', 'Date & Time', 'Competition', 'Status', 'Actions']}
        data={fixtures}
        emptyMessage="No fixtures found"
        renderRow={(fix) => (
          <tr key={fix.id}>
            <td className="admin-table-cell">
              <div className="flex flex-col">
                <div className="admin-player-name">
                  {fix.homeTeam} <span className="text-slate-400 font-normal px-1">vs</span> {fix.awayTeam}
                </div>
                {fix.status === 'completed' && (
                  <div className="text-xs font-black text-brand-blue mt-1">
                    Score: {fix.homeScore} – {fix.awayScore}
                  </div>
                )}
              </div>
            </td>
            <td className="admin-table-cell">
              <div className="text-sm text-navy-900 font-medium">
                {new Date(fix.date).toLocaleDateString('en-ZA', { day: 'numeric', month: 'short', year: 'numeric' })}
              </div>
              <div className="text-[10px] text-slate-400 uppercase font-bold">{fix.kickOff}</div>
            </td>
            <td className="admin-table-cell text-sm text-slate-600">
              {fix.competition}
            </td>
            <td className="admin-table-cell">
              <span className={`admin-badge badge-${fix.status}`}>
                {fix.status}
              </span>
            </td>
            <td className="admin-table-cell admin-actions-cell">
              <div className="flex justify-end gap-2">
                <Link to={`/fixtures/edit/${fix.id}`} className="admin-action-btn" title="Edit">
                  <Pencil size={14} />
                </Link>
                <Link to={`/fixtures/${fix.id}`} className="admin-action-btn" title="View">
                  <Eye size={14} />
                </Link>
                <button onClick={() => setDeleteId(fix.id)} className="admin-action-btn admin-action-btn-delete" title="Delete">
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

export function AddEditFixture() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [existing, setExisting] = useState(null);
  const [isEdit, setIsEdit] = useState(false);

  useEffect(() => {
    async function loadFixture() {
      if (id) {
        try {
          const fixture = await fixtureService.getFixtureById(id);
          setExisting(fixture);
          setIsEdit(!!fixture);
        } catch (e) {
          console.error("Error loading fixture:", e);
        }
      }
    }
    loadFixture();
  }, [id]);

  const [form, setForm] = useState({
    homeTeam: 'Mphehli All Stars',
    awayTeam: '',
    date: '',
    kickOff: '15:00',
    competition: 'Regional League',
    venue: 'Mphehli Sports Ground',
    status: 'upcoming',
    homeScore: '',
    awayScore: '',
    preview: '',
    published: true,
  });

  useEffect(() => {
    if (existing) {
      setForm({
        homeTeam: existing.homeTeam,
        awayTeam: existing.awayTeam,
        date: existing.date,
        kickOff: existing.kickOff,
        competition: existing.competition,
        venue: existing.venue,
        status: existing.status,
        homeScore: existing.homeScore,
        awayScore: existing.awayScore,
        preview: existing.preview,
        published: existing.published,
      });
    }
  }, [existing]);

  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const set = (field, value) => setForm(f => ({ ...f, [field]: value }));

  const handleSave = async () => {
    setSaving(true);
    try {
      if (isEdit) {
        await fixtureService.updateFixture(id, form);
      } else {
        await fixtureService.createFixture(form);
      }
      setSaved(true);
      setTimeout(() => { setSaved(false); navigate('/fixtures'); }, 1500);
    } catch (error) {
      console.error("Error saving fixture:", error);
      alert("Error saving fixture");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="admin-form-container">
      <AdminPageTitle title={isEdit ? 'Edit Fixture' : 'Add Fixture'} />
      {saved && (
        <div className="admin-toast">
          <CheckCircle2 size={14} style={{ marginRight: '4px' }} /> Fixture saved successfully
        </div>
      )}

      <div className="admin-form-header">
        <div>
          <div className="admin-breadcrumb">
            <Link to="/fixtures" className="admin-breadcrumb-link">Fixtures</Link>
            <span className="admin-breadcrumb-sep"><ChevronRight size={12} /></span>
            <span className="admin-breadcrumb-active">{isEdit ? 'Edit Fixture' : 'Add Fixture'}</span>
          </div>
          <h1 className="admin-page-title">
            {isEdit ? 'Edit Fixture' : 'Add Fixture'}
          </h1>
        </div>
        <Link to="/fixtures" className="admin-btn-secondary admin-btn">
          Cancel
        </Link>
      </div>

      <div className="admin-form-grid">
        <div className="admin-form-section">
          <h2 className="admin-form-section-title">Match Details</h2>
          <div className="admin-form-fields">
            <AdminInput label="Home Team *" value={form.homeTeam} onChange={e => set('homeTeam', e.target.value)} />
            <AdminInput label="Away Team *" value={form.awayTeam} onChange={e => set('awayTeam', e.target.value)} placeholder="Opponent name" />
            <AdminInput label="Match Date *" type="date" value={form.date} onChange={e => set('date', e.target.value)} />
            <AdminInput label="Kick-off Time *" type="time" value={form.kickOff} onChange={e => set('kickOff', e.target.value)} />
            <AdminInput label="Competition" value={form.competition} onChange={e => set('competition', e.target.value)} />
            <AdminInput label="Venue" value={form.venue} onChange={e => set('venue', e.target.value)} />
            {form.status === 'completed' && (
              <>
                <AdminInput label="Home Score" type="number" value={form.homeScore} onChange={e => set('homeScore', e.target.value)} />
                <AdminInput label="Away Score" type="number" value={form.awayScore} onChange={e => set('awayScore', e.target.value)} />
              </>
            )}
            <div className="admin-form-field-full">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-1.5">Match Preview / Report</label>
              <textarea
                rows={4}
                value={form.preview}
                onChange={e => set('preview', e.target.value)}
                className="admin-form-textarea"
                placeholder="Preview text..."
              />
            </div>
          </div>
        </div>

        <div className="admin-form-section">
          <h2 className="admin-form-section-title">Status</h2>
          <div className="admin-form-actions">
            <AdminSelect
              label="Match Status"
              value={form.status}
              onChange={e => set('status', e.target.value)}
              options={[
                { label: 'Upcoming', value: 'upcoming' },
                { label: 'Live', value: 'live' },
                { label: 'Completed', value: 'completed' },
                { label: 'Postponed', value: 'postponed' },
                { label: 'Cancelled', value: 'cancelled' },
              ]}
            />
            <label className="admin-form-checkbox-group">
              <input
                type="checkbox"
                checked={form.published}
                onChange={e => set('published', e.target.checked)}
                className="admin-form-checkbox"
              />
              <span className="admin-form-checkbox-label">Publish Match</span>
            </label>
            <div className="admin-form-actions">
              <AdminButton
                onClick={handleSave}
                disabled={saving}
                variant="primary"
                className="admin-form-submit-btn"
              >
                {saving ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Saving...
                  </div>
                ) : (isEdit ? 'Save Changes' : 'Add Fixture')}
              </AdminButton>
              <Link
                to="/fixtures"
                className="admin-form-cancel-link"
              >
                Cancel
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FixtureList;
