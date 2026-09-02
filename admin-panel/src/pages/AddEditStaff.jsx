import { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router';
import { staffService } from '../services/staffService';
import ImageUpload from '../components/ImageUpload';
import { AdminTable, AdminButton, AdminInput, AdminSelect } from '../components/AdminUI';
import { CheckCircle2, AlertTriangle, ChevronRight } from 'lucide-react';
import '../styles/admin-pages.css';

const teams = [
  { id: 'abc_motsepe', name: 'ABC Motsepe Foundation' },
  { id: 'sab_regional', name: 'SAB Regional League' },
  { id: 'sasol_women', name: "2026 Sasol Women's League" },
];

export default function AddEditStaff() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [existing, setExisting] = useState(null);
  const [isEdit, setIsEdit] = useState(false);

  useEffect(() => {
    async function loadStaff() {
      if (id) {
        const member = await staffService.getStaffById(id);
        setExisting(member);
        setIsEdit(!!member);
      }
    }
    loadStaff();
  }, [id]);

  const [form, setForm] = useState({
    name: '',
    role: '',
    team: 'abc_motsepe',
    biography: '',
    photo: '',
    status: 'active',
  });

  useEffect(() => {
    if (existing) {
      setForm({
        name: existing.name,
        role: existing.role,
        team: existing.team || 'abc_motsepe',
        biography: existing.biography,
        photo: existing.photo,
        status: existing.status,
      });
    }
  }, [existing]);

  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  const set = (field, value) => {
    setForm(f => ({ ...f, [field]: value }));
    setHasChanges(true);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      if (isEdit) {
        await staffService.updateStaff(id, form);
      } else {
        await staffService.createStaff(form);
      }
      setSaved(true);
      setHasChanges(false);
      setTimeout(() => {
        setSaved(false);
        navigate('/staff');
      }, 2000);
    } catch (error) {
      console.error("Error saving staff member:", error);
      alert("Error saving staff member");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="admin-form-container">
      <div className="admin-form-header">
        <div>
          <div className="admin-breadcrumb">
            <Link to="/staff" className="admin-breadcrumb-link">Staff</Link>
            <span className="admin-breadcrumb-sep"><ChevronRight size={12} /></span>
            <span className="admin-breadcrumb-active">{isEdit ? 'Edit Staff' : 'Add Staff'}</span>
          </div>
          <h1 className="admin-page-title">
            {isEdit ? `Edit: ${existing?.name}` : 'Add New Staff Member'}
          </h1>
        </div>
        <Link to="/staff" className="admin-btn-secondary admin-btn">
          Cancel
        </Link>
      </div>

      {saved && (
        <div className="admin-toast">
          <CheckCircle2 size={14} style={{ marginRight: '4px' }} /> Staff member saved successfully
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
          <h2 className="admin-form-section-title">Staff Information</h2>
          <div className="admin-form-fields">
            <AdminInput
              label="Full Name *"
              value={form.name}
              onChange={e => set('name', e.target.value)}
              placeholder="Full name"
              className="admin-form-field-full"
            />
            <AdminInput
              label="Role *"
              value={form.role}
              onChange={e => set('role', e.target.value)}
              placeholder="e.g. Head Coach"
            />
            <AdminSelect
              label="Team *"
              value={form.team}
              onChange={e => set('team', e.target.value)}
              options={teams.map(t => ({ label: t.name, value: t.id }))}
            />
            <div className="admin-form-field-full">
              <label className="admin-form-label">Biography</label>
              <textarea
                rows={5}
                value={form.biography}
                onChange={e => set('biography', e.target.value)}
                className="admin-form-textarea"
                placeholder="Staff member biography..."
              />
            </div>
          </div>
        </div>

        <div className="admin-form-section">
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
              ) : (isEdit ? 'Save Changes' : 'Add Staff Member')}
            </AdminButton>
            <Link
              to="/staff"
              className="admin-form-cancel-link"
            >
              Cancel
            </Link>
          </div>

          <div className="admin-form-section" style={{ marginTop: '2rem', padding: '1.5rem', border: '1px solid var(--slate-200)', borderRadius: '0.5rem' }}>
            <h2 className="admin-form-section-title">Staff Photo</h2>
            <ImageUpload
              value={form.photo}
              onChange={value => set('photo', value)}
              label="Staff Photo"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
