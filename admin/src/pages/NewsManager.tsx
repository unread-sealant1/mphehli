import React, { useState, useEffect } from 'react';
import { newsApi, type NewsArticle } from '../api/admin.api';
import { Plus, Pencil, Trash2, Newspaper, Upload } from 'lucide-react';
import { cn } from '../utils';

export default function NewsManager() {
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingNews, setEditingNews] = useState<NewsArticle | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: 'Announcement',
    imageUrl: '',
    published: true,
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    setLoading(true);
    try {
      const data = await newsApi.getAll();
      setNews(data || []);
    } catch (error) {
      console.error('Error fetching news:', error);
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
      data.append('title', formData.title);
      data.append('content', formData.content);
      data.append('category', formData.category);
      data.append('published', String(formData.published));
      if (imageFile) {
        data.append('image', imageFile);
      }

      if (editingNews) {
        await newsApi.update(editingNews.id!, data);
      } else {
        await newsApi.create(data);
      }
      setIsModalOpen(false);
      setEditingNews(null);
      setFormData({ title: '', content: '', category: 'Announcement', imageUrl: '', published: true });
      setImageFile(null);
      setImagePreview(null);
      fetchNews();
    } catch (error) {
      console.error('Error saving news:', error);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this article?')) {
      try {
        await newsApi.delete(id);
        fetchNews();
      } catch (error) {
        console.error('Error deleting news:', error);
      }
    }
  };

  const openModal = (article?: NewsArticle) => {
    if (article) {
      setEditingNews(article);
      setFormData({
        title: article.title,
        content: article.content,
        category: article.category,
        imageUrl: article.imageUrl || '',
        published: article.published,
      });
      setImagePreview(article.imageUrl || null);
    } else {
      setEditingNews(null);
      setFormData({ title: '', content: '', category: 'Announcement', imageUrl: '', published: true });
      setImagePreview(null);
    }
    setImageFile(null);
    setIsModalOpen(true);
  };

  if (loading) {
    return <div className="p-8 text-center">Loading news...</div>;
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-3">
          <Newspaper className="text-blue-600" size={32} />
          <div>
            <h1 className="text-3xl font-bold text-slate-900">News Management</h1>
            <p className="text-slate-500">Create and manage club announcements and match reports</p>
          </div>
        </div>
        <button
          onClick={() => openModal()}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus size={20} />
          Create Article
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {news.map((article) => (
          <div key={article.id} className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex justify-between items-center hover:border-blue-300 transition-colors">
            <div className="flex gap-6 items-start">
              {article.imageUrl && (
                <img src={article.imageUrl} alt={article.title} className="w-24 h-24 object-cover rounded-lg" />
              )}
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                    {article.category}
                  </span>
                  {article.published ? (
                    <span className="text-xs text-green-600 font-medium flex items-center gap-1">
                      <span className="w-2 h-2 bg-green-500 rounded-full" /> Published
                    </span>
                  ) : (
                    <span className="text-xs text-slate-400 font-medium flex items-center gap-1">
                      <span className="w-2 h-2 bg-slate-300 rounded-full" /> Draft
                    </span>
                  )}
                </div>
                <h3 className="text-xl font-bold text-slate-900">{article.title}</h3>
                <p className="text-slate-500 line-clamp-2 mt-1">{article.content}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={() => openModal(article)} className="p-2 text-slate-400 hover:text-blue-600 transition-colors">
                <Pencil size={18} />
              </button>
              <button onClick={() => handleDelete(article.id!)} className="p-2 text-slate-400 hover:text-red-600 transition-colors">
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        ))}
        {news.length === 0 && (
          <div className="text-center py-20 bg-white rounded-xl border-2 border-dashed border-slate-200">
            <Newspaper className="mx-auto text-slate-300 mb-4" size={48} />
            <p className="text-slate-500">No news articles found. Start by creating your first story!</p>
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-2xl p-6 shadow-xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-6 text-slate-900">
              {editingNews ? 'Edit Article' : 'Create New Article'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
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
                  Change Image
                  <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Title</label>
                <input
                  type="text"
                  required
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
                  <select
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  >
                    <option value="Announcement">Announcement</option>
                    <option value="Match Report">Match Report</option>
                    <option value="Team News">Team News</option>
                    <option value="Community">Community</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Publish Status</label>
                  <select
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    value={formData.published ? 'true' : 'false'}
                    onChange={(e) => setFormData({ ...formData, published: e.target.value === 'true' })}
                  >
                    <option value="true">Published</option>
                    <option value="false">Draft</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Content</label>
                <textarea
                  required
                  rows={6}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                />
              </div>
              <div className="flex justify-end gap-3 mt-8">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  Cancel</button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Save Article
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
