import React, { useState, useEffect } from 'react';
import { mediaApi, type MediaAsset } from '../api/admin.api';
import { Plus, Trash2, Image as ImageIcon, Film, Upload } from 'lucide-react';

export default function MediaManager() {
  const [media, setMedia] = useState<MediaAsset[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    url: '',
    type: 'IMAGE' as const,
    altText: '',
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  useEffect(() => {
    fetchMedia();
  }, []);

  const fetchMedia = async () => {
    setLoading(true);
    try {
      const data = await mediaApi.getAll();
      setMedia(data || []);
    } catch (error) {
      console.error('Error fetching media:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data = new FormData();
      data.append('type', formData.type);
      data.append('altText', formData.altText);
      if (imageFile) {
        data.append('file', imageFile);
      }
      await mediaApi.create(data);
      setIsModalOpen(false);
      setFormData({ url: '', type: 'IMAGE', altText: '' });
      setImageFile(null);
      setImagePreview(null);
      fetchMedia();
    } catch (error) {
      console.error('Error saving media:', error);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this asset?')) {
      try {
        await mediaApi.delete(id);
        fetchMedia();
      } catch (error) {
        console.error('Error deleting media:', error);
      }
    }
  };

  if (loading) {
    return <div className="p-8 text-center">Loading media library...</div>;
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-3">
          <ImageIcon className="text-blue-600" size={32} />
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Media Library</h1>
            <p className="text-slate-500">Manage club photos and videos</p>
          </div>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus size={20} />
          Add Asset
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {media.map((asset) => (
          <div key={asset.id} className="group relative bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="aspect-square relative bg-slate-100">
              {asset.type === 'IMAGE' ? (
                <img src={asset.url} alt={asset.altText} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-slate-800 text-white">
                  <Film size={48} />
                </div>
              )}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <button
                  onClick={() => handleDelete(asset.id!)}
                  className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                  title="Delete Asset"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
            <div className="p-3">
              <p className="text-sm font-medium text-slate-900 truncate">{asset.altText || 'Untitled Asset'}</p>
              <p className="text-xs text-slate-500">{asset.type}</p>
            </div>
          </div>
        ))}
        {media.length === 0 && (
          <div className="col-span-full text-center py-20 bg-white rounded-xl border-2 border-dashed border-slate-200">
            <ImageIcon className="mx-auto text-slate-300 mb-4" size={48} />
            <p className="text-slate-500">No media assets found. Start building your gallery!</p>
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-xl">
            <h2 className="text-2xl font-bold mb-6 text-slate-900">Add Media Asset</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex items-center gap-4 mb-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="type"
                    className="w-4 h-4 text-blue-600"
                    checked={formData.type === 'IMAGE'}
                    onChange={() => setFormData({ ...formData, type: 'IMAGE' })}
                  />
                  <span className="text-sm font-medium text-slate-700">Image</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="type"
                    className="w-4 h-4 text-blue-600"
                    checked={formData.type === 'VIDEO'}
                    onChange={() => setFormData({ ...formData, type: 'VIDEO' })}
                  />
                  <span className="text-sm font-medium text-slate-700">Video</span>
                </label>
              </div>

              <div className="flex flex-col items-center gap-4 mb-6">
                <div className="w-32 h-32 rounded-lg border-2 border-dashed border-slate-300 overflow-hidden bg-slate-50 relative group">
                  {imagePreview ? (
                    <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-400">
                      <Upload size={24} />
                    </div>
                  )}
                </div>
                <label className="cursor-pointer text-sm text-blue-600 hover:text-blue-700 font-medium">
                  Upload File
                  <input type="file" className="hidden" accept="image/*,video/*" onChange={handleFileChange} />
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Alt Text / Description</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  value={formData.altText}
                  onChange={(e) => setFormData({ ...formData, altText: e.target.value })}
                />
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
                  Save Asset
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
