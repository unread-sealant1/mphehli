import { useState, useEffect } from 'react';
import { galleryService } from '../services/galleryService';
import ImageUpload from '../components/ImageUpload';
import { CheckCircle2, ArrowUp, Image, X } from 'lucide-react';
import '../styles/admin-pages.css';

const categories = ['Matchday', 'Training', 'Events', 'Players', 'Supporters'];

export default function GalleryManagement() {
  const [items, setItems] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toast, setToast] = useState('');
  const [deleteId, setDeleteId] = useState(null);
  const [filter, setFilter] = useState('all');

  // Form state
  const [newItem, setNewItem] = useState({
    title: '',
    category: categories[0],
    type: 'image',
    url: '',
    thumbnail: '',
    published: true,
  });

  useEffect(() => {
    loadGallery();
  }, []);

  const loadGallery = async () => {
    const data = await galleryService.getGallery();
    setItems(data);
  };

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 3000); };

  const handleSaveMedia = async () => {
    if (!newItem.title || !newItem.url) {
      showToast('Please provide title and media');
      return;
    }

    try {
      await galleryService.createItem({
        ...newItem,
        thumbnail: newItem.thumbnail || newItem.url,
      });
      setItems(await galleryService.getGallery());
      setIsModalOpen(false);
      setNewItem({
        title: '',
        category: categories[0],
        type: 'image',
        url: '',
        thumbnail: '',
        published: true,
      });
      showToast('Media added successfully');
    } catch (e) {
      showToast('Error adding media');
    }
  };

  const handleDelete = async (id) => {
    try {
      await galleryService.deleteItem(id);
      setItems(await galleryService.getGallery());
      setDeleteId(null);
      showToast('Item deleted');
    } catch (e) {
      showToast('Error deleting item');
    }
  };

  const handleTogglePublish = async (id) => {
    try {
      const item = items.find(i => i.id === id);
      await galleryService.updateItem(id, { published: !item.published });
      setItems(await galleryService.getGallery());
      showToast('Status updated');
    } catch (e) {
      showToast('Error updating status');
    }
  };

  const filtered = items.filter(i => {
    if (filter === 'all') return true;
    if (filter === 'images') return i.type === 'image';
    if (filter === 'videos') return i.type === 'video';
    return i.category.toLowerCase() === filter;
  });

  return (
    <div className="admin-page-container">
      {toast && (
        <div className="admin-toast">
          <CheckCircle2 size={14} style={{ marginRight: '4px' }} /> {toast}
        </div>
      )}
      {deleteId && (
        <div className="admin-modal-overlay">
          <div className="admin-modal-content">
            <h3 className="admin-modal-title">Delete Media?</h3>
            <p className="admin-modal-text">This cannot be undone.</p>
            <div className="admin-modal-actions">
              <AdminButton onClick={() => handleDelete(deleteId)} variant="danger" className="flex-1">Delete</AdminButton>
              <AdminButton onClick={() => setDeleteId(null)} variant="secondary" className="flex-1">Cancel</AdminButton>
            </div>
          </div>
        </div>
      )}

      {isModalOpen && (
        <div className="admin-modal-overlay">
          <div className="admin-modal-content">
            <h3 className="admin-modal-title">Add New Media</h3>
            <div className="admin-form-grid">
              <div className="admin-form-section">
                <h2 className="admin-form-section-title">Details</h2>
                <div className="admin-form-fields">
                  <div className="admin-form-group">
                    <label className="admin-form-label">Title</label>
                    <input
                      className="admin-form-textarea"
                      value={newItem.title}
                      onChange={e => setNewItem({ ...newItem, title: e.target.value })}
                      placeholder="e.g. Winning Goal vs Viasport"
                    />
                  </div>
                  <div className="admin-form-group">
                    <label className="admin-form-label">Category</label>
                    <select
                      className="admin-form-textarea"
                      value={newItem.category}
                      onChange={e => setNewItem({ ...newItem, category: e.target.value })}
                    >
                      {categories.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div className="admin-form-group">
                    <label className="admin-form-label">Type</label>
                    <div className="admin-filter-bar" style={{ background: 'var(--slate-100)', padding: '0.25rem', borderRadius: '4px' }}>
                      <button
                        className={`admin-btn ${newItem.type === 'image' ? 'admin-btn-primary' : 'admin-btn-ghost'}`}
                        onClick={() => setNewItem({ ...newItem, type: 'image' })}
                      >
                        Image
                      </button>
                      <button
                        className={`admin-btn ${newItem.type === 'video' ? 'admin-btn-primary' : 'admin-btn-ghost'}`}
                        onClick={() => setNewItem({ ...newItem, type: 'video' })}
                      >
                        Video/URL
                      </button>
                    </div>
                  </div>
                  <div className="admin-form-group">
                    <label className="admin-form-label">Visibility</label>
                    <div className="admin-filter-bar" style={{ background: 'var(--slate-100)', padding: '0.25rem', borderRadius: '4px' }}>
                      <button
                        className={`admin-btn ${newItem.published ? 'admin-btn-primary' : 'admin-btn-ghost'}`}
                        onClick={() => setNewItem({ ...newItem, published: true })}
                      >
                        Published
                      </button>
                      <button
                        className={`admin-btn ${!newItem.published ? 'admin-btn-primary' : 'admin-btn-ghost'}`}
                        onClick={() => setNewItem({ ...newItem, published: false })}
                      >
                        Draft
                      </button>
                    </div>
                  </div>
                </div>

                {newItem.type === 'image' ? (
                  <div className="admin-form-group">
                    <label className="admin-form-label">Media File</label>
                    <ImageUpload
                      value={newItem.url}
                      onChange={val => setNewItem({ ...newItem, url: val, thumbnail: val })}
                    />
                  </div>
                ) : (
                  <div className="admin-form-group">
                    <label className="admin-form-label">Video URL (YouTube/Vimeo)</label>
                    <input
                      className="admin-form-textarea"
                      value={newItem.url}
                      onChange={e => setNewItem({ ...newItem, url: e.target.value })}
                      placeholder="https://youtube.com/..."
                    />
                    <div className="admin-page-subtitle" style={{ fontStyle: 'italic', marginTop: '0.25rem' }}>Provide the embed URL for best results.</div>
                  </div>
                )}
              </div>
              <div className="admin-form-section">
                <h2 className="admin-form-section-title">Actions</h2>
                <div className="admin-modal-actions">
                  <AdminButton onClick={() => setIsModalOpen(false)} variant="secondary" className="flex-1">Cancel</AdminButton>
                  <AdminButton onClick={handleSaveMedia} variant="primary" className="flex-1">Save Media</AdminButton>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Gallery</h1>
          <p className="admin-page-subtitle">{items.filter(i => i.published).length} published items</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="admin-btn-primary admin-btn"
        >
          <ArrowUp size={14} style={{ marginRight: '4px', display: 'inline' }} /> Upload Media
        </button>
      </div>

      <div
        className="admin-upload-area"
        onClick={() => setIsModalOpen(true)}
        style={{
          border: '2px dashed var(--slate-200)',
          padding: '2.5rem',
          textAlign: 'center',
          marginBottom: '1.5rem',
          cursor: 'pointer',
          backgroundColor: 'white',
          borderRadius: '0.75rem'
        }}
      >
        <div className="flex flex-col items-center">
          <div style={{ fontSize: '2.25rem', marginBottom: '0.75rem' }}><Image size={48} /></div>
          <div className="admin-player-name" style={{ fontSize: '0.875rem' }}>Click to add new media</div>
          <div className="admin-page-subtitle">Manage your images and videos for the gallery</div>
        </div>
      </div>

      <div className="admin-filter-bar" style={{ marginBottom: '1.25rem' }}>
        {['all', 'images', 'videos', ...categories.map(c => c.toLowerCase())].map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`admin-btn ${filter === f ? 'admin-btn-primary' : 'admin-btn-ghost'} text-xs uppercase`}
            style={{ fontSize: '0.6875rem', letterSpacing: '0.1em' }}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="admin-gallery-grid">
        {filtered.map(item => (
          <div key={item.id} className="admin-gallery-item">
            <div className="admin-media-wrapper">
              <img src={item.thumbnail} alt={item.title} className="admin-media-img" />
              {item.type === 'video' && (
                <div className="admin-video-overlay">
                  <div className="admin-play-button">
                    <svg width="10" height="10" fill="white" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                  </div>
                </div>
              )}
              {!item.published && (
                <div className="admin-draft-badge">
                  Draft
                </div>
              )}
            </div>
            <div className="admin-item-details">
              <div className="admin-item-title">{item.title}</div>
              <div className="admin-item-category">{item.category}</div>
            </div>
            <div className="admin-item-actions">
              <button
                onClick={() => handleTogglePublish(item.id)}
                className={`admin-btn ${item.published ? 'admin-btn-ghost' : 'admin-btn-primary'} admin-publish-btn`}
              >
                {item.published ? 'Unpublish' : 'Publish'}
              </button>
              <button
                onClick={() => setDeleteId(item.id)}
                className="admin-delete-btn"
              >
                <X size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
