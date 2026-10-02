import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { newsService } from '../services/newsService';
import PageTitle from '../components/PageTitle';
import ErrorMessage from '../components/ErrorMessage';
import styles from './News.module.css';

const categories = ['All', 'Club News', 'Match Reports', 'Player News', 'Announcements', 'Transfers', 'Community'];

export default function News() {
  const [cat, setCat] = useState('All');
  const [search, setSearch] = useState('');
  const [data, setData] = useState({
    articles: [],
    loading: true,
    error: null
  });

  useEffect(() => {
    async function loadNews() {
      try {
        const articles = await newsService.getNews();
        setData({ articles, loading: false });
      } catch (error) {
        console.error("Error loading news:", error);
        setData(prev => ({ ...prev, loading: false, error: error.message }));
      }
    }
    loadNews();
  }, []);

  if (data.loading) {
    return <div className={styles.loadingContainer}>Loading...</div>;
  }

  if (data.error) {
    return <ErrorMessage message={data.error} />;
  }

  const published = data.articles.filter(a => a.status === 'published');
  const featured = published.find(a => a.featured);
  const filtered = published.filter(a => {
    if (cat !== 'All' && a.category !== cat) return false;
    if (search && !a.title.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });
  const rest = filtered.filter(a => a.id !== featured?.id);

  return (
    <div className={styles.page}>
      <PageTitle title="News" />
      {/* Hero */}
      <section className={styles.hero}>
        <div className={styles.heroContainer}>
          <div className={styles.heroSub}>All Stars Media</div>
          <h1 className={styles.heroTitle}>Latest News</h1>
          <div className={styles.heroDivider} />
        </div>
      </section>

      {/* Featured */}
      {featured && cat === 'All' && !search && (
        <section className={styles.featuredSection}>
          <Link to={`/news/${featured.id}`} className={styles.featuredLink}>
            <div className={styles.featuredGrid}>
              <div className={styles.featuredImageWrapper}>
                <img
                  src={featured.image}
                  alt={featured.title}
                  className={styles.featuredImage}
                />
              </div>
              <div className={styles.featuredContent}>
                <div className={styles.featuredSub}>
                  Featured · {featured.category}
                </div>
                <h2 className={styles.featuredTitle}>
                  {featured.title}
                </h2>
                <p className={styles.featuredExcerpt}>{featured.excerpt}</p>
                <div className={styles.featuredMeta}>
                  <span className={styles.metaText}>{featured.author}</span>
                  <span className={styles.metaDivider}>·</span>
                  <span className={styles.metaText}>
                    {new Date(featured.date).toLocaleDateString('en-ZA', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </span>
                </div>
                <div className={styles.featuredReadMore}>
                  Read Full Article →
                </div>
              </div>
            </div>
          </Link>
        </section>
      )}

      {/* Filters + Search */}
      <section className={styles.filterBar}>
        <div className={styles.filterContainer}>
          <div className={styles.filterControls}>
            <div className={styles.catList}>
              {categories.map(c => (
                <button
                  key={c}
                  onClick={() => setCat(c)}
                  className={` ${styles.catBtn} ${
                    cat === c ? styles.catBtnActive : styles.catBtnInactive
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
            <input
              type="text"
              placeholder="Search articles..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className={styles.searchField}
            />
          </div>
        </div>
      </section>

      {/* Articles grid */}
      <section className={styles.articlesSection}>
        <div className={styles.articlesContainer}>
          {rest.length === 0 ? (
            <div className={styles.emptyState}>
              <div className={styles.emptyTitle}>No articles found</div>
            </div>
          ) : (
            <div className={styles.articlesGrid}>
              {rest.map((article) => (
                <Link key={article.id} to={`/news/${article.id}`} className={styles.articleLink}>
                  <div className={styles.articleCard}>
                    <div className={styles.articleImageWrapper}>
                      <img
                        src={article.image}
                        alt={article.title}
                        className={styles.articleImage}
                      />
                    </div>
                    <div className={styles.articleContent}>
                      <div className={styles.articleMeta}>
                        <span className={styles.articleCategory}>
                          {article.category}
                        </span>
                        <span className={styles.articleDate}>
                          {new Date(article.date).toLocaleDateString('en-ZA', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </span>
                      </div>
                      <h3 className={styles.articleTitle}>
                        {article.title}
                      </h3>
                      <p className={styles.articleExcerpt}>{article.excerpt}</p>
                      <div className={styles.articleFooter}>
                        <span className={styles.articleAuthor}>{article.author}</span>
                        <span className={styles.articleReadMore}>Read →</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
