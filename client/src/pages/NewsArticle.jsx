import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router';
import { newsService } from '../services/newsService';
import { ChevronRight } from 'lucide-react';
import PageTitle from '../components/PageTitle';

export default function NewsArticle() {
  const { id } = useParams();
  const [data, setData] = useState({
    article: null,
    related: [],
    loading: true
  });

  useEffect(() => {
    async function loadArticle() {
      if (!id || id === 'undefined') return;
      try {
        const [article, allNews] = await Promise.all([
          newsService.getNewsById(id),
          newsService.getNews()
        ]);
        const related = allNews
          .filter(a => a.id !== id && a.status === 'published')
          .slice(0, 3);
        setData({ article, related, loading: false });
      } catch (error) {
        console.error("Error loading article:", error);
        setData(prev => ({ ...prev, loading: false }));
      }
    }
    loadArticle();
  }, [id]);

  if (data.loading) {
    return <div className="min-h-screen bg-white flex items-center justify-center text-[#050D1A]">Loading...</div>;
  }

  const { article, related } = data;

  if (!article) {
    return (
      <div className="min-h-screen bg-[#050D1A] flex items-center justify-center">
        <div className="text-center">
          <div className="font-display font-900 text-white text-4xl uppercase mb-4">Article Not Found</div>
          <Link to="/news" className="text-[#3B82F6] font-display font-700 uppercase tracking-widest">← Back to News</Link>
        </div>
      </div>
    );
  }

  const paragraphs = article.content.split('\n\n').filter(Boolean);

  return (
    <div className="bg-white">
      <PageTitle title={article.title} />
      {/* Hero image */}
      <section className="relative h-[50vh] min-h-[400px] overflow-hidden">
        <img
          src={article.image}
          alt={article.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#050D1A] via-[#050D1A]/30 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 max-w-[900px] mx-auto px-6 lg:px-10 pb-10">
          <div className="flex items-center gap-3 mb-3">
            <span className="bg-[#121B47] text-white font-display font-700 text-[10px] tracking-[0.2em] uppercase px-3 py-1">
              {article.category}
            </span>
          </div>
          <h1 className="font-display font-900 text-white text-3xl md:text-5xl uppercase leading-tight">
            {article.title}
          </h1>
          <div className="flex items-center gap-4 mt-4">
            <span className="text-[#94A3B8] text-sm">{article.author}</span>
            <span className="text-[#334155]">·</span>
            <span className="text-[#94A3B8] text-sm">
              {new Date(article.date).toLocaleDateString('en-ZA', { day: 'numeric', month: 'long', year: 'numeric' })}
            </span>
          </div>
        </div>
      </section>

      {/* Breadcrumb */}
      <div className="bg-[#F8FAFC] border-b border-[#E2E8F0]">
        <div className="max-w-[900px] mx-auto px-6 lg:px-10 py-4 flex items-center gap-2 text-[11px] font-display font-700 uppercase tracking-[0.1em]">
          <Link to="/news" className="text-[#64748B] hover:text-[#121B47] transition-colors">News</Link>
          <span className="text-[#E2E8F0]"><ChevronRight size={12} /></span>
          <span className="text-[#121B47]">{article.category}</span>
        </div>
      </div>

      {/* Content */}
      <article className="max-w-[900px] mx-auto px-6 lg:px-10 py-16">
        <p className="text-[#334155] text-lg leading-relaxed font-medium border-l-4 border-[#121B47] pl-6 mb-12">
          {article.excerpt}
        </p>
        <div className="prose-content">
          {paragraphs.map((para, i) => {
            if (para.startsWith('## ')) {
              return (
                <h2 key={i} className="font-display font-900 text-[#050D1A] text-3xl uppercase tracking-wide mt-10 mb-4">
                  {para.replace('## ', '')}
                </h2>
              );
            }
            return (
              <p key={i} className="text-[#334155] leading-relaxed mb-5 text-base">
                {para}
              </p>
            );
          })}
        </div>

        {/* Tags */}
        <div className="mt-12 pt-8 border-t border-[#E2E8F0] flex flex-wrap gap-2">
          {article.tags.map(tag => (
            <span key={tag} className="font-display font-700 text-[10px] tracking-[0.15em] uppercase border border-[#E2E8F0] px-3 py-1.5 text-[#64748B] hover:border-[#121B47] hover:text-[#121B47] transition-colors cursor-pointer">
              {tag}
            </span>
          ))}
        </div>

        {/* Share */}
        <div className="mt-6 flex items-center gap-4">
          <span className="font-display font-700 text-[11px] tracking-[0.2em] uppercase text-[#64748B]">Share</span>
          {[
            { name: 'Twitter/X', href: `https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(article.title)}` },
            { name: 'Facebook', href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}` },
            { name: 'WhatsApp', href: `https://api.whatsapp.com/send?text=${encodeURIComponent(article.title + ' ' + window.location.href)}` },
          ].map(s => (
            <a key={s.name} href={s.href} target="_blank" rel="noopener noreferrer" className="font-display font-700 text-[11px] tracking-[0.1em] uppercase text-[#121B47] hover:text-[#050D1A] transition-colors">
              {s.name}
            </a>
          ))}
        </div>
      </article>

      {/* Related */}
      {related.length > 0 && (
        <section className="bg-[#F8FAFC] border-t border-[#E2E8F0] py-16">
          <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
            <h2 className="font-display font-900 text-[#050D1A] text-3xl uppercase mb-8">Related Articles</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {related.map(a => (
                <Link key={a.id} to={`/news/${a.id}`} className="group block border border-[#E2E8F0] hover:border-[#121B47] bg-white transition-all">
                  <div className="aspect-video overflow-hidden">
                    <img src={a.image} alt={a.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  </div>
                  <div className="p-5">
                    <div className="font-display font-700 text-[#121B47] text-[10px] tracking-[0.2em] uppercase mb-2">{a.category}</div>
                    <h3 className="font-display font-800 text-[#050D1A] text-base uppercase leading-tight group-hover:text-[#121B47] transition-colors">{a.title}</h3>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
