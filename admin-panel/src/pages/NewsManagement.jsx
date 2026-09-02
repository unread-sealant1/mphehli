import { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router';
import { newsService } from '../services/newsService';
import { AdminTable, AdminButton, AdminInput, AdminSelect } from '../components/AdminUI';
import { Pencil, Eye, Trash2, TrendingDown, TrendingUp, CheckCircle2, ChevronRight } from 'lucide-react';
import '../styles/admin-pages.css';

const categories = ['Club News', 'Match Reports', 'Player News', 'Announcements', 'Transfers', 'Community'];

export function NewsManagementList() {
  const [articles, setArticles] = useState([]);
  const [deleteId, setDeleteId] = useState(null);
  const [toast, setToast] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadArticles() {
      try {
        const data = await newsService.getNews();
        setArticles(data);
      } catch (error) {
        console.error("Error loading news:", error);
      } finally {
        setLoading(false);
      }
    }
    loadArticles();
  }, []);

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 3000); };

  const handleDelete = async (id) => {
    try {
      await newsService.deleteNews(id);
      setArticles(prev => prev.filter(a => a.id !== id));
      setDeleteId(null);
      showToast('Article deleted');
    } catch (error) {
      console.error("Error deleting article:", error);
      showToast('Error deleting article');
    }
  };

  const handlePublish = async (id) => {
    try {
      const article = articles.find(a => a.id === id);
      const newStatus = article.status === 'published' ? 'draft' : 'published';
      await newsService.updateNews(id, { status: newStatus });
      setArticles(prev => prev.map(a => a.id === id ? { ...a, status: newStatus } : a));
      showToast('Status updated');
    } catch (error) {
      console.error("Error updating status:", error);
      showToast('Error updating status');
    }
  };

  if (loading) {
    return (
      <div className="admin-page-container" style={{ justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <div className="admin-page-subtitle">Loading news...</div>
      </div>
    );
  }

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
            <h3 className="admin-modal-title">Delete Article?</h3>
            <p className="admin-modal-text">This cannot be undone.</p>
            <div className="admin-modal-actions">
              <AdminButton onClick={() => handleDelete(deleteId)} variant="danger" className="flex-1">Delete</AdminButton>
              <AdminButton onClick={() => setDeleteId(null)} variant="secondary" className="flex-1">Cancel</AdminButton>
            </div>
          </div>
        </div>
      )}

      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">News</h1>
          <p className="admin-page-subtitle">{articles.filter(a => a.status === 'published').length} published articles</p>
        </div>
        <Link to="/news/new" className="admin-btn-primary admin-btn" style={{ textDecoration: 'none' }}>
          + Write Article
        </Link>
      </div>

      <AdminTable
        headers={['Title', 'Category', 'Author', 'Date', 'Status', 'Actions']}
        data={articles}
        emptyMessage="No news articles found"
        renderRow={(article) => (
          <tr key={article.id}>
            <td className="admin-table-cell">
              <div className="admin-player-info">
                <img src={article.image} alt="" className="admin-player-avatar" style={{ width: '2.5rem', height: '1.5rem', borderRadius: '4px' }} />
                <div>
                  <div className="admin-player-name">{article.title}</div>
                  {article.featured && (
                    <span className="admin-badge badge-goalkeeper" style={{ fontSize: '0.5rem', padding: '0 0.25rem' }}>Featured</span>
                  )}
                </div>
              </div>
            </td>
            <td className="admin-table-cell text-sm text-slate-600">
              {article.category}
            </td>
            <td className="admin-table-cell text-sm text-slate-600">{article.author}</td>
            <td className="admin-table-cell text-sm text-slate-600">
              {new Date(article.date).toLocaleDateString('en-ZA', { day: 'numeric', month: 'short' })}
            </td>
            <td className="admin-table-cell">
              <span className={`admin-badge ${
                article.status === 'published' ? 'badge-active' :
                article.status === 'draft' ? 'badge-inactive' :
                'badge-default'
              }`}>
                {article.status}
              </span>
            </td>
            <td className="admin-table-cell admin-actions-cell">
              <div className="flex justify-end gap-2">
                <Link to={`/news/edit/${article.id}`} className="admin-action-btn" title="Edit">
                  <Pencil size={14} />
                </Link>
                <Link to={`/news/${article.id}`} className="admin-action-btn" title="Preview">
                  <Eye size={14} />
                </Link>
                <button onClick={() => handlePublish(article.id)} className="admin-action-btn" title="Publish/Unpublish">
                  {article.status === 'published' ? <TrendingDown size={14} /> : <TrendingUp size={14} />}
                </button>
                <button onClick={() => setDeleteId(article.id)} className="admin-action-btn admin-action-btn-delete" title="Delete">
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

export function NewsEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [article, setArticle] = useState(null);
  const [form, setForm] = useState({
    title: '',
    category: 'Club News',
    author: 'Club Media',
    date: new Date().toISOString().split('T')[0],
    excerpt: '',
    content: '',
    tags: '',
    status: 'draft',
    featured: false,
    seoTitle: '',
    metaDescription: '',
  });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    async function loadArticle() {
      if (id) {
        try {
          const data = await newsService.getArticleById(id);
          setArticle(data);
          setForm({
            ...data,
            tags: data.tags.join(', '),
          });
        } catch (error) {
          console.error("Error loading article:", error);
        }
      }
    }
    loadArticle();
  }, [id]);

  const set = (field, value) => setForm(f => ({ ...f, [field]: value }));

  const handleSave = async (publish = false) => {
    setSaving(true);
    try {
      const payload = {
        ...form,
        tags: form.tags.split(',').map(t => t.trim()).filter(Boolean),
        status: publish ? 'published' : form.status,
      };
      if (id) {
        await newsService.updateNews(id, payload);
      } else {
        await newsService.createNews(payload);
      }
      setSaved(true);
      setTimeout(() => { setSaved(false); navigate('/news'); }, 1500);
    } catch (error) {
      console.error("Error saving article:", error);
    } finally {
      setSaving(false);
    }
  };

  if (id && !article) {
    return (
      <div className="admin-page-container" style={{ justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <div className="admin-page-subtitle">Loading article...</div>
      </div>
    );
  }

  return (
    <div className="admin-form-container">
      {saved && <div className="admin-toast"><CheckCircle2 size={14} style={{ marginRight: '4px' }} /> Saved</div>}

      <div className="admin-form-header">
        <div>
          <div className="admin-breadcrumb">
            <Link to="/news" className="admin-breadcrumb-link">News</Link>
            <span className="admin-breadcrumb-sep"><ChevronRight size={12} /></span>
            <span className="admin-breadcrumb-active">{id ? 'Edit' : 'New Article'}</span>
          </div>
          <h1 className="admin-page-title">{id ? 'Edit Article' : 'New Article'}</h1>
        </div>
        <Link to="/news" className="admin-btn-secondary admin-btn">Cancel</Link>
      </div>

      <div className="admin-form-grid">
        <div className="admin-form-section">
          <h2 className="admin-form-section-title">Content</h2>
          <div className="admin-form-fields">
            <AdminInput
              label="Article Title *"
              value={form.title}
              onChange={e => set('title', e.target.value)}
              placeholder="ARTICLE TITLE"
              className="admin-form-field-full"
            />
            <div className="admin-form-field-full">
              <label className="admin-form-label">Excerpt *</label>
              <textarea
                rows={2}
                value={form.excerpt}
                onChange={e => set('excerpt', e.target.value)}
                className="admin-form-textarea"
                placeholder="Short article summary..."
              />
            </div>
            <div className="admin-form-field-full">
              <label className="admin-form-label">Article Body *</label>
              <textarea
                rows={14}
                value={form.content}
                onChange={e => set('content', e.target.value)}
                className="admin-form-textarea"
                placeholder="Write the full article here. Use ## for headings."
              />
            </div>
          </div>
        </div>

        <div className="admin-form-section">
          <h2 className="admin-form-section-title">Publishing</h2>
          <div className="admin-form-fields">
            <AdminSelect
              label="Category"
              value={form.category}
              onChange={e => set('category', e.target.value)}
              options={categories.map(c => ({ label: c, value: c }))}
            />
            <AdminInput
              label="Author"
              value={form.author}
              onChange={e => set('author', e.target.value)}
            />
            <AdminInput
              label="Publication Date"
              type="date"
              value={form.date}
              onChange={e => set('date', e.target.value)}
            />
            <AdminInput
              label="Tags (comma separated)"
              value={form.tags}
              onChange={e => set('tags', e.target.value)}
              placeholder="Tag1, Tag2"
            />
            <label className="admin-form-checkbox-group">
              <input
                type="checkbox"
                checked={form.featured}
                onChange={e => set('featured', e.target.checked)}
                className="admin-form-checkbox"
              />
              <span className="admin-form-checkbox-label">Featured article</span>
            </label>
          </div>

          <div className="admin-form-actions" style={{ marginTop: '2rem' }}>
            <AdminButton
              onClick={() => handleSave(true)}
              disabled={saving}
              variant="primary"
              className="admin-form-submit-btn"
            >
              {saving ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Publishing...
                </div>
              ) : 'Publish'}
            </AdminButton>
            <AdminButton
              onClick={() => handleSave(false)}
              variant="secondary"
              className="admin-form-submit-btn"
              style={{ marginTop: '0.75rem' }}
            >
              Save Draft
            </AdminButton>
          </div>

          <div className="admin-form-section" style={{ marginTop: '2rem', padding: '1.5rem', border: '1px solid var(--slate-200)', borderRadius: '0.5rem' }}>
            <h2 className="admin-form-section-title">SEO</h2>
            <div className="admin-form-fields">
              <AdminInput
                label="SEO Title"
                value={form.seoTitle}
                onChange={e => set('seoTitle', e.target.value)}
              />
              <div className="admin-form-field-full">
                <label className="admin-form-label">Meta Description</label>
                <textarea
                  rows={2}
                  value={form.metaDescription}
                  onChange={e => set('metaDescription', e.target.value)}
                  className="admin-form-textarea"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default NewsManagementList;
