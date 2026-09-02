import { useState, useEffect } from 'react';
import { galleryService } from '../services/galleryService';
import { X } from 'lucide-react';
import PageTitle from '../components/PageTitle';
import styles from './Gallery.module.css';

const filters = ['All', 'Images', 'Videos', 'Matchday', 'Training', 'Events', 'Players', 'Supporters'];

export default function Gallery() {
  const [filter, setFilter] = useState('All');
  const [lightbox, setLightbox] = useState(null);
  const [data, setData] = useState({
    items: [],
    loading: true
  });

  useEffect(() => {
    async function loadGallery() {
      try {
        const items = await galleryService.getGallery();
        setData({ items, loading: false });
      } catch (error) {
        console.error("Error loading gallery:", error);
        setData(prev => ({ ...prev, loading: false }));
      }
    }
    loadGallery();
  }, []);

  if (data.loading) {
    return <div className={styles.loadingContainer}>Loading...</div>;
  }

  const published = data.items.filter(g => g.published);
  const filtered = published.filter(g => {
    if (filter === 'All') return true;
    if (filter === 'Images') return g.type === 'image';
    if (filter === 'Videos') return g.type === 'video';
    return g.category === filter;
  });

  return (
    <div className={styles.page}>
      <PageTitle title="Gallery" />
      {/* Hero */}
      <section className={styles.hero}>
        <div className={styles.heroContainer}>
          <div className={styles.heroSub}>Media Centre</div>
          <h1 className={styles.heroTitle}>Gallery</h1>
          <div className={styles.heroDivider} />
        </div>
      </section>

      {/* Filters */}
      <section className={styles.filterBar}>
        <div className={styles.filterContainer}>
          <div className={styles.filterControls}>
            {filters.map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={` ${styles.filterBtn} ${
                  filter === f ? styles.filterBtnActive : styles.filterBtnInactive
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Grid */}
      <section className={styles.gridSection}>
        <div className={styles.gridContainer}>
          {filtered.length === 0 ? (
            <div className={styles.emptyState}>
              <div className={styles.emptyTitle}>No media found</div>
            </div>
          ) : (
            <div className={styles.galleryGrid}>
              {filtered.map(item => (
                <div
                  key={item.id}
                  onClick={() => setLightbox(item)}
                  className={styles.galleryItem}
                >
                  <div className={styles.imageWrapper}>
                    <img
                      src={item.thumbnail}
                      alt={item.title}
                      className={styles.galleryImage}
                    />
                  </div>
                  <div className={styles.galleryOverlay}>
                    {item.type === 'video' ? (
                      <div className={styles.playBtn}>
                        <svg width="16" height="16" fill="white" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                      </div>
                    ) : (
                      <div className={styles.expandBtn}>
                        <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                        </svg>
                      </div>
                    )}
                  </div>
                  <div className={styles.galleryCaption}>
                    <div className={styles.captionTitle}>{item.title}</div>
                    <div className={styles.captionCat}>{item.category}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Lightbox */}
      {lightbox && (
        <div
          className={styles.lightboxOverlay}
          onClick={() => setLightbox(null)}
        >
          <div className={styles.lightboxContent} onClick={e => e.stopPropagation()}>
            <button
              onClick={() => setLightbox(null)}
              className={styles.lightboxClose}
            >
              Close <X size={14} />
            </button>
            {lightbox.type === 'image' ? (
              <img
                src={lightbox.url}
                alt={lightbox.title}
                className={styles.lightboxImage}
              />
            ) : (
              <div className={styles.lightboxVideo}>
                <iframe
                  src={lightbox.url}
                  className={styles.iframe}
                  allow="autoplay; fullscreen"
                  allowFullScreen
                  title={lightbox.title}
                />
              </div>
            )}
            <div className={styles.lightboxDetails}>
              <div className={styles.detailsTitle}>{lightbox.title}</div>
              <div className={styles.detailsDesc}>{lightbox.description}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
