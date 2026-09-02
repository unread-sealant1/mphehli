import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { adminService } from '../services/adminService';
import { AdminButton, AdminInput } from '../components/AdminUI';
import { CheckCircle2 } from 'lucide-react';

export default function AdminProfile() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState({
    fullName: '',
    email: '',
    role: 'Administrator',
    password: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    async function loadProfile() {
      try {
        const data = await adminService.getProfile();
        setProfile(prev => ({ ...prev, ...data }));
      } catch (error) {
        console.error("Error loading profile:", error);
      } finally {
        setLoading(false);
      }
    }
    loadProfile();
  }, []);

  const set = (field, value) => setProfile(p => ({ ...p, [field]: value }));

  const handleSave = async () => {
    if (profile.password && profile.password !== profile.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    setSaving(true);
    try {
      const updateData = { ...profile };
      if (!updateData.password) {
        delete updateData.password;
        delete updateData.confirmPassword;
      }

      await adminService.updateProfile(updateData);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (error) {
      console.error("Error saving profile:", error);
      alert("Error saving profile");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center h-64 text-slate-400 italic animate-pulse">Loading profile...</div>;
  }

  return (
    <div className="space-y-6">
      {saved && (
        <div className="fixed top-6 right-6 z-50 bg-emerald-600 text-white px-4 py-3 rounded shadow-lg animate-fade-in font-bold text-xs uppercase tracking-widest">
          <CheckCircle2 size={14} style={{ marginRight: '4px' }} /> Profile updated successfully
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display font-black text-3xl uppercase text-slate-900">Admin Profile</h1>
          <p className="text-slate-500 text-sm mt-1">Manage your account details and security settings.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm">
            <h2 className="font-display font-bold text-lg uppercase text-slate-900 mb-6 border-b border-slate-100 pb-3">
              Personal Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <AdminInput label="Full Name *" value={profile.fullName} onChange={e => set('fullName', e.target.value)} />
              <AdminInput label="Email Address *" value={profile.email} onChange={e => set('email', e.target.value)} type="email" />
              <div className="md:col-span-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-1.5">Role</label>
                <input
                  type="text"
                  value={profile.role}
                  disabled
                  className="w-full px-3 py-2 bg-slate-100 border border-slate-200 rounded text-sm text-slate-500 cursor-not-allowed"
                />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm">
            <h2 className="font-display font-bold text-lg uppercase text-slate-900 mb-6 border-b border-slate-100 pb-3">
              Security
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <AdminInput label="New Password" type="password" value={profile.password} onChange={e => set('password', e.target.value)} placeholder="Leave blank to keep current" />
              <AdminInput label="Confirm New Password" type="password" value={profile.confirmPassword} onChange={e => set('confirmPassword', e.target.value)} placeholder="Confirm password" />
            </div>
            <p className="text-[11px] text-slate-400 mt-4 italic">
              * Password updates will take effect immediately. Ensure you use a strong password.
            </p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm">
            <h2 className="font-display font-bold text-lg uppercase text-slate-900 mb-6 border-b border-slate-100 pb-3">
              Account Actions
            </h2>
            <div className="space-y-4">
              <AdminButton
                onClick={handleSave}
                disabled={saving}
                variant="primary"
                className="w-full py-3 shadow-md"
              >
                {saving ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Saving...
                  </div>
                ) : 'Update Profile'}
              </AdminButton>
              <AdminButton
                onClick={() => navigate('/login')}
                variant="secondary"
                className="w-full py-3"
              >
                Sign Out
              </AdminButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
