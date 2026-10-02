import React, { useState, useEffect } from 'react';
import { fixtureApi } from '../api/admin.api';
import type { Fixture } from '../types/fixture';
import { Plus, Pencil, Trash2, Calendar as CalendarIcon } from 'lucide-react';
import { cn } from '../utils';

export default function FixtureManager() {
  const [fixtures, setFixtures] = useState<Fixture[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingFixture, setEditingFixture] = useState<Fixture | null>(null);
  const [formData, setFormData] = useState({
    opponent: '',
    date: '',
    location: '',
    result: '',
    status: 'SCHEDULED',
    homeAway: true,
  });

  useEffect(() => {
    fetchFixtures();
  }, []);

  const fetchFixtures = async () => {
    setLoading(true);
    try {
      const data = await fixtureApi.getAll();
      setFixtures(data || []);
    } catch (error) {
      console.error('Error fetching fixtures:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingFixture) {
        await fixtureApi.update(editingFixture.id, formData);
      } else {
        await fixtureApi.create(formData as any);
      }
      setIsModalOpen(false);
      setEditingFixture(null);
      setFormData({ opponent: '', date: '', location: '', result: '', status: 'SCHEDULED', homeAway: true });
      fetchFixtures();
    } catch (error) {
      console.error('Error saving fixture:', error);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this fixture?')) {
      try {
        await fixtureApi.delete(id);
        fetchFixtures();
      } catch (error) {
        console.error('Error deleting fixture:', error);
      }
    }
  };

  const openModal = (fixture?: Fixture) => {
    if (fixture) {
      setEditingFixture(fixture);
      setFormData({
        opponent: fixture.opponent,
        date: new Date(fixture.date).toISOString().split('T')[0],
        location: fixture.location,
        result: fixture.result || '',
        status: fixture.status,
        homeAway: fixture.homeAway,
      });
    } else {
      setEditingFixture(null);
      setFormData({ opponent: '', date: '', location: '', result: '', status: 'SCHEDULED', homeAway: true });
    }
    setIsModalOpen(true);
  };

  if (loading) {
    return <div className="p-8 text-center">Loading fixtures...</div>;
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Fixture Management</h1>
          <p className="text-slate-500">Manage match schedules and results</p>
        </div>
        <button
          onClick={() => openModal()}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <CalendarIcon size={20} />
          Add Fixture
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr className="text-sm font-semibold text-slate-600">
              <th className="px-6 py-4">Opponent</th>
              <th className="px-6 py-4">Date</th>
              <th className="px-6 py-4">Location</th>
              <th className="px-6 py-4">Result</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {fixtures.map((f) => (
              <tr key={f.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4 font-medium text-slate-900">{f.opponent}</td>
                <td className="px-6 py-4 text-slate-600">{new Date(f.date).toLocaleDateString()}</td>
                <td className="px-6 py-4 text-slate-600">{f.location}</td>
                <td className="px-6 py-4 font-bold text-slate-900">{f.result || '-'}</td>
                <td className="px-6 py-4">
                  <span className={cn(
                    "px-2 py-1 rounded-full text-xs font-medium",
                    f.status === 'SCHEDULED' ? "bg-blue-100 text-blue-700" :
                    f.status === 'COMPLETED' ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                  )}>
                    {f.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right space-x-2">
                  <button onClick={() => openModal(f)} className="p-2 text-slate-400 hover:text-blue-600 transition-colors">
                    <Pencil size={18} />
                  </button>
                  <button onClick={() => handleDelete(f.id)} className="p-2 text-slate-400 hover:text-red-600 transition-colors">
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
            {fixtures.length === 0 && (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                  No fixtures scheduled. Add your first match!
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-xl">
            <h2 className="text-2xl font-bold mb-6 text-slate-900">
              {editingFixture ? 'Edit Fixture' : 'Add New Fixture'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Opponent</label>
                <input
                  type="text"
                  required
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  value={formData.opponent}
                  onChange={(e) => setFormData({ ...formData, opponent: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Date</label>
                  <input
                    type="date"
                    required
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
                  <select
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  >
                    <option value="SCHEDULED">Scheduled</option>
                    <option value="COMPLETED">Completed</option>
                    <option value="CANCELLED">Cancelled</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Location</label>
                  <input
                    type="text"
                    required
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Result (e.g. 2-1)</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    value={formData.result}
                    onChange={(e) => setFormData({ ...formData, result: e.target.value })}
                  />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="homeAway"
                  className="w-4 h-4 text-blue-600"
                  checked={formData.homeAway}
                  onChange={(e) => setFormData({ ...formData, homeAway: e.target.checked })}
                />
                <label htmlFor="homeAway" className="text-sm font-medium text-slate-700">Home Match</label>
              </div>
              <div className="flex justify-end gap-3 mt-8">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Save Fixture
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
