import React, { useState, useEffect } from 'react';
import { assetApi, teamApi } from '../api/admin.api';
import { SiteAsset, Team } from '../api/admin.api';

interface AssetSlot {
  key: string;
  label: string;
  category: 'Global' | 'Team';
}

const GLOBAL_SLOTS: AssetSlot[] = [
  { key: 'home-hero', label: 'Home Hero Banner', category: 'Global' },
  { key: 'community-bg', label: 'Community Section Background', category: 'Global' },
  { key: 'about-image', label: 'About Us Image', category: 'Global' },
  { key: 'contact-bg', label: 'Contact Page Background', category: 'Global' },
];

const WebsiteEditor: React.FC = () => {
  const [assets, setAssets] = useState<SiteAsset[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [assetsData, teamsData] = await Promise.all([
        assetApi.getAll(),
        teamApi.getAll(),
      ]);
      setAssets(assetsData);
      setTeams(teamsData);
    } catch (error) {
      console.error('Error loading website assets:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAssetUpload = async (slot: AssetSlot, file: File) => {
    const formData = new FormData();
    formData.append('image', file);
    formData.append('key', slot.key);
    formData.append('altText', slot.label);
    formData.append('uploadFolder', 'settings');

    try {
      setUploading(slot.key);
      await assetApi.update(formData);
      await loadData();
    } catch (error) {
      console.error('Upload error:', error);
      alert('Failed to upload asset');
    } finally {
      setUploading(null);
    }
  };

  const handleTeamImageUpload = async (teamId: number, file: File) => {
    const formData = new FormData();
    formData.append('image', file);
    formData.append('uploadFolder', 'media');

    try {
      setUploading(`team-${teamId}`);
      await teamApi.updateImage(teamId, formData);
      await loadData();
    } catch (error) {
      console.error('Upload error:', error);
      alert('Failed to upload team image');
    } finally {
      setUploading(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-8">
      <header>
        <h1 className="text-3xl font-bold text-gray-800">Website Editor</h1>
        <p className="text-gray-600">Manage the visual assets and hero images across the entire website.</p>
      </header>

      <section className="space-y-6">
        <div className="flex items-center space-x-2">
          <div className="h-6 w-1 bg-blue-600 rounded-full"></div>
          <h2 className="text-xl font-semibold text-gray-700">Global Visuals</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {GLOBAL_SLOTS.map((slot) => {
            const asset = assets.find((a) => a.key === slot.key);
            return (
              <div key={slot.key} className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                <div className="aspect-video bg-gray-100 relative group">
                  {asset?.url ? (
                    <img
                      src={`http://localhost:3000${asset.url}`}
                      alt={asset.altText || slot.label}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-400 italic text-sm">
                      No image uploaded
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <label className="cursor-pointer bg-white text-gray-800 px-4 py-2 rounded-lg font-medium text-sm hover:bg-gray-100 transition-colors">
                      Change Image
                      <input
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={(e) => e.target.files?.[0] && handleAssetUpload(slot, e.target.files[0])}
                        disabled={uploading === slot.key}
                      />
                    </label>
                  </div>
                </div>
                <div className="p-4">
                  <p className="font-medium text-gray-800">{slot.label}</p>
                  <p className="text-xs text-gray-500 uppercase tracking-wider">{slot.key}</p>
                  {uploading === slot.key && (
                    <p className="text-xs text-blue-600 mt-2 animate-pulse">Uploading...</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section className="space-y-6">
        <div className="flex items-center space-x-2">
          <div className="h-6 w-1 bg-green-600 rounded-full"></div>
          <h2 className="text-xl font-semibold text-gray-700">Team Hero Images</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {teams.map((team) => (
            <div key={team.id} className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
              <div className="aspect-video bg-gray-100 relative group">
                {team.imageUrl ? (
                  <img
                    src={`http://localhost:3000${team.imageUrl}`}
                    alt={team.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-400 italic text-sm">
                    No image uploaded
                  </div>
                )}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <label className="cursor-pointer bg-white text-gray-800 px-4 py-2 rounded-lg font-medium text-sm hover:bg-gray-100 transition-colors">
                    Change Image
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={(e) => e.target.files?.[0] && handleTeamImageUpload(team.id, e.target.files[0])}
                      disabled={uploading === `team-${team.id}`}
                    />
                  </label>
                </div>
              </div>
              <div className="p-4">
                <p className="font-medium text-gray-800">{team.name}</p>
                <p className="text-xs text-gray-500">{team.identity || 'No identity set'}</p>
                {uploading === `team-${team.id}` && (
                  <p className="text-xs text-blue-600 mt-2 animate-pulse">Uploading...</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default WebsiteEditor;
