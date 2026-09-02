import { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router';
import { playerService } from '../services/playerService';
import ImageUpload from '../components/ImageUpload';
import { AdminTable, AdminButton, AdminInput, AdminSelect } from '../components/AdminUI';
import { CheckCircle2, AlertTriangle, ChevronRight } from 'lucide-react';
import '../styles/admin-pages.css';

const positions = ['Goalkeeper', 'Defender', 'Midfielder', 'Forward'];
const feet = ['Left', 'Right', 'Both'];
const teams = [
  { id: 'abc_motsepe', name: 'ABC Motsepe Foundation' },
  { id: 'sab_regional', name: 'SAB Regional League' },
  { id: 'sasol_women', name: "2026 Sasol Women's League" },
];

export default function AddEditPlayer() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [existing, setExisting] = useState(null);
  const [isEdit, setIsEdit] = useState(false);

  useEffect(() => {
    async function loadPlayer() {
      if (id) {
        const player = await playerService.getPlayerById(id);
        setExisting(player);
        setIsEdit(!!player);
      }
    }
    loadPlayer();
  }, [id]);

  const [form, setForm] = useState({
    name: '',
    number: '',
    team: 'abc_motsepe',
    position: 'Forward',
    dob: '',
    nationality: 'South African',
    height: '',
    preferredFoot: 'Right',
    biography: '',
    appearances: 0,
    goals: 0,
    assists: 0,
    cleanSheets: 0,
    status: 'active',
    featured: false,
  });

  useEffect(() => {
    if (existing) {
      setForm({
        name: existing.name,
        number: existing.number,
        team: existing.team || 'abc_motsepe',
        position: existing.position,
        dob: existing.dob,
        nationality: existing.nationality,
        height: existing.height,
        preferredFoot: existing.preferredFoot,
        biography: existing.biography,
        appearances: existing.appearances,
        goals: existing.goals,
        assists: existing.assists,
        cleanSheets: existing.cleanSheets,
        status: existing.status,
        featured: existing.featured,
      });
    }
  }, [existing]);

  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [errors, setErrors] = useState({});

  const set = (field, value) => {
    setForm(f => ({ ...f, [field]: value }));
    setHasChanges(true);
    if (errors[field]) {
      setErrors(prev => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const handleSave = async () => {
    // Validation
    const newErrors = {};
    if (!form.name?.trim()) newErrors.name = 'Full Name is required';
    if (!form.number) newErrors.number = 'Squad Number is required';
    if (!form.team) newErrors.team = 'Team is required';
    if (!form.position) newErrors.position = 'Position is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setSaving(true);
    try {
      if (isEdit) {
        await playerService.updatePlayer(id, form);
      } else {
        await playerService.createPlayer(form);
      }
      setSaved(true);
      setHasChanges(false);
      setTimeout(() => {
        setSaved(false);
        navigate('/players');
      }, 2000);
    } catch (error) {
      console.error("Error saving player:", error);
      alert("Error saving player");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="admin-form-container">
      <div className="admin-form-header">
        <div>
          <div className="admin-breadcrumb">
            <Link to="/players" className="admin-breadcrumb-link">Players</Link>
            <span className="admin-breadcrumb-sep"><ChevronRight size={12} /></span>
            <span className="admin-breadcrumb-active">{isEdit ? 'Edit Player' : 'Add Player'}</span>
          </div>
          <h1 className="admin-page-title">
            {isEdit ? `Edit: ${existing?.name}` : 'Add New Player'}
          </h1>
        </div>
        <Link to="/players" className="admin-btn-secondary admin-btn">
          Cancel
        </Link>
      </div>

      {saved && (
        <div className="admin-toast">
          <CheckCircle2 size={14} style={{ marginRight: '4px' }} /> Player saved successfully
        </div>
      )}

      {hasChanges && (
        <div className="admin-unsaved-warning">
          <span style={{ display: 'inline-flex', marginRight: '4px' }}><AlertTriangle size={14} /></span>
          <span>You have unsaved changes.</span>
        </div>
      )}

      <div className="admin-form-grid">
        <div className="admin-form-section">
          <h2 className="admin-form-section-title">Player Information</h2>
          <div className="admin-form-fields">
            <AdminInput
              label="Full Name *"
              value={form.name}
              onChange={e => set('name', e.target.value)}
              placeholder="Player full name"
              className="admin-form-field-full"
              error={!!errors.name}
            />
            <AdminInput
              label="Squad Number *"
              type="number"
              value={form.number}
              onChange={e => set('number', e.target.value)}
              placeholder="e.g. 10"
              error={!!errors.number}
            />
            <AdminSelect
              label="Team *"
              value={form.team}
              onChange={e => set('team', e.target.value)}
              options={teams.map(t => ({ label: t.name, value: t.id }))}
              error={!!errors.team}
            />
            <AdminSelect
              label="Position *"
              value={form.position}
              onChange={e => set('position', e.target.value)}
              options={positions.map(p => ({ label: p, value: p }))}
              error={!!errors.position}
            />
            <AdminInput
              label="Date of Birth"
              type="date"
              value={form.dob}
              onChange={e => set('dob', e.target.value)}
            />
            <AdminInput
              label="Nationality"
              value={form.nationality}
              onChange={e => set('nationality', e.target.value)}
            />
            <AdminInput
              label="Height"
              value={form.height}
              onChange={e => set('height', e.target.value)}
              placeholder="e.g. 1.80m"
            />
            <AdminSelect
              label="Preferred Foot"
              value={form.preferredFoot}
              onChange={e => set('preferredFoot', e.target.value)}
              options={feet.map(f => ({ label: f, value: f }))}
            />
            <div className="admin-form-field-full">
              <label className="admin-form-label">Biography</label>
              <textarea
                rows={5}
                value={form.biography}
                onChange={e => set('biography', e.target.value)}
                className="admin-form-textarea"
                placeholder="Player biography..."
              />
            </div>
          </div>
        </div>

        <div className="admin-form-section">
          <h2 className="admin-form-section-title">Season Statistics</h2>
          <div className="admin-form-fields">
            {[
              { label: 'Appearances', field: 'appearances' },
              { label: 'Goals', field: 'goals' },
              { label: 'Assists', field: 'assists' },
              { label: 'Clean Sheets', field: 'cleanSheets' },
            ].map(stat => (
              <AdminInput
                key={stat.field}
                label={stat.label}
                type="number"
                value={form[stat.field]}
                onChange={e => set(stat.field, parseInt(e.target.value) || 0)}
                min="0"
              />
            ))}
          </div>

          <div className="admin-form-section" style={{ marginTop: '2rem', padding: '0', border: 'none', boxShadow: 'none' }}>
            <h2 className="admin-form-section-title">Publishing</h2>
            <div className="admin-form-fields">
              <AdminSelect
                label="Status"
                value={form.status}
                onChange={e => set('status', e.target.value)}
                options={[
                  { label: 'Active', value: 'active' },
                  { label: 'Inactive', value: 'inactive' },
                ]}
              />
              <label className="admin-form-checkbox-group">
                <input
                  type="checkbox"
                  checked={form.featured}
                  onChange={e => set('featured', e.target.checked)}
                  className="admin-form-checkbox"
                />
                <span className="admin-form-checkbox-label">Featured on homepage</span>
              </label>
            </div>

            <div className="admin-form-actions" style={{ marginTop: '2rem' }}>
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
                ) : (isEdit ? 'Save Changes' : 'Add Player')}
              </AdminButton>
              <Link
                to="/players"
                className="admin-form-cancel-link"
              >
                Cancel
              </Link>
            </div>
          </div>

          <div className="admin-form-section" style={{ marginTop: '2rem' }}>
            <h2 className="admin-form-section-title">Player Image</h2>
            <ImageUpload
              value={form.image}
              onChange={value => set('image', value)}
              label="Player Photo"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
