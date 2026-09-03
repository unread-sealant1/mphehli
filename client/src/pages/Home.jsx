import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { playerService } from '../services/playerService';
import { fixtureService } from '../services/fixtureService';
import { resultService } from '../services/resultService';
import { newsService } from '../services/newsService';
import { galleryService } from '../services/galleryService';
import { sponsorService } from '../services/sponsorService';
import { adminService } from '../services/adminService';
import { settingsService } from '../services/settingsService';
import PageTitle from '../components/PageTitle';
import ErrorMessage from '../components/ErrorMessage';
import styles from './Home.module.css';

function StatCard({ value, label }) {
  return (
    <div className={styles.statCard}>
      <div className={styles.statValue}>{value}</div>
      <div className={styles.statLabel}>{label}</div>
    </div>
  );
}

export default function Home() {
  const [data, setData] = useState({
    stats: {},
    featuredPlayers: [],
    latestNews: [],
    upcomingFixtures: [],
    latestResult: null,
    nextMatch: null,
    activeSponsors: [],
    galleryPreview: [],
    content: null,
    loading: true,
    error: null
  });

  useEffect(() => {
    async function loadData() {
      try {
        const [players, fixtures, news, gallery, sponsors, result, stats, content] = await Promise.all([
          playerService.getFeaturedPlayers(),
          fixtureService.getUpcomingFixtures(),
          newsService.getLatestNews(),
          galleryService.getGalleryPreview(),
          sponsorService.getActiveSponsors(),
          resultService.getLatestResult(),
          adminService.getDashboardStats(),
          settingsService.getSettings('home')
        ]);

        setData({
          stats,
          featuredPlayers: players,
          latestNews: news,
          upcomingFixtures: fixtures,
          latestResult: result,
          nextMatch: fixtures[0],
          activeSponsors: sponsors,
          galleryPreview: gallery,
          content,
          loading: false
        });
      } catch (error) {
        console.error("Error loading home page data:", error);
        setData(prev => ({ ...prev, loading: false, error: error.message }));
      }
    }
    loadData();
  }, []);

  if (data.loading) {
    return <div className={styles.loadingContainer}>Loading...</div>;
  }

  if (data.error) {
    return <ErrorMessage message={data.error} />;
  }

  const { stats, featuredPlayers, latestNews, upcomingFixtures, latestResult, nextMatch, activeSponsors, galleryPreview, content } = data;

  return (
    <div>
      <PageTitle title="Home" />
      {/* ── HERO ────────────────────────────────────────────────────────── */}
      <section className={styles.hero}>
        <div
          className={styles.heroBg}
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=1920&h=1080&fit=crop&auto=format')" }}
        />
        <div className={styles.heroOverlayB} />
        <div className={styles.heroOverlayR} />

        <div className={styles.heroContent}>
          <div className={styles.heroSub}>
            {content?.heroSub || 'Founded 2022 · Mphehli, South Africa · Champions 2025/26'}
          </div>
          <h1 className={styles.heroTitle}>
            {content?.heroTitle?.split('<br />')[0]}<br />
            {content?.heroTitle?.split('<br />')[1] || 'All Stars'}
          </h1>
          <div className={styles.heroDivider} />
          <p className={styles.heroQuote}>
            {content?.heroQuote || '"Cometh the hour, Cometh the man."'}
          </p>
          <div className={styles.heroActions}>
            <Link
              to="/team"
              className={styles.heroBtnPrimary}
            >
              Meet the Team
            </Link>
            <Link
              to="/fixtures"
              className={styles.heroBtnSecondary}
            >
              View Fixtures
            </Link>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className={styles.scrollIndicator}>
          <span className={styles.scrollText}>Scroll</span>
          <div className={styles.scrollLine} />
        </div>
      </section>

      {/* ── MATCH CENTRE ────────────────────────────────────────────────── */}
      <section className={styles.matchCentre}>
        <div className={styles.sectionContainer}>
          <div className={styles.matchGrid}>
            {/* Next Match */}
            {nextMatch && (
              <div className={styles.matchCard}>
                <div className={styles.matchLabel}>
                  Next Match
                </div>
                <div className={styles.matchTeams}>
                  <div className={styles.teamBox}>
                    <div className={styles.teamLogoPrimary}>
                      <span className={styles.logoTextPrimary}>MAS</span>
                    </div>
                    <div className={styles.teamName}>Mphehli All Stars</div>
                  </div>
                  <div className={styles.matchVs}>
                    <div className={styles.vsText}>VS</div>
                    <div className={styles.matchComp}>{nextMatch.competition}</div>
                  </div>
                  <div className={styles.teamBox}>
                    <div className={styles.teamLogoSecondary}>
                      <span className={styles.logoTextSecondary}>
                        {nextMatch.awayTeam.slice(0, 3)}
                      </span>
                    </div>
                    <div className={styles.teamName}>{nextMatch.awayTeam}</div>
                  </div>
                </div>
                <div className={styles.matchDetails}>
                  <div>
                    <div className={styles.detailLabel}>Date</div>
                    <div className={styles.detailValue}>{new Date(nextMatch.date).toLocaleDateString('en-ZA', { day: 'numeric', month: 'short' })}</div>
                  </div>
                  <div>
                    <div className={styles.detailLabel}>Kick-off</div>
                    <div className={styles.detailValue}>{nextMatch.kickOff}</div>
                  </div>
                  <div>
                    <div className={styles.detailLabel}>Venue</div>
                    <div className={styles.detailValue}>{nextMatch.venue.split(' ').slice(0, 2).join(' ')}</div>
                  </div>
                </div>
                <Link
                  to={`/fixtures/${nextMatch.id}`}
                  className={styles.matchBtn}
                >
                  View Match
                </Link>
              </div>
            )}

            {/* Latest Result */}
            {latestResult && (
              <div className={styles.matchCard}>
                <div className={styles.matchLabel}>
                  Latest Result
                </div>
                <div className={styles.matchTeams}>
                  <div className={styles.teamBox}>
                    <div className={styles.teamLogoPrimary}>
                      <span className={styles.logoTextPrimary}>MAS</span>
                    </div>
                    <div className={styles.teamName}>Mphehli All Stars</div>
                  </div>
                  <div className={styles.matchVs}>
                    <div className={styles.resultScore}>
                      {latestResult.homeTeam === 'Mphehli All Stars' ? latestResult.homeScore : latestResult.awayScore}
                      <span className={styles.scoreDivider}>–</span>
                      {latestResult.homeTeam === 'Mphehli All Stars' ? latestResult.awayScore : latestResult.homeScore}
                    </div>
                    <div className={`${styles.resultBadge} ${
                      getResult(latestResult) === 'WIN' ? styles.badgeWin :
                      getResult(latestResult) === 'DRAW' ? styles.badgeDraw :
                      styles.badgeLoss
                    }`}>
                      {getResult(latestResult)}
                    </div>
                  </div>
                  <div className={styles.teamBox}>
                    <div className={styles.teamLogoSecondary}>
                      <span className={styles.logoTextSecondary}>
                        {getOpponent(latestResult).slice(0, 3)}
                      </span>
                    </div>
                    <div className={styles.teamName}>{getOpponent(latestResult)}</div>
                  </div>
                </div>
                <div className={styles.resultFooter}>
                  <div className={styles.resultMeta}>
                    {latestResult.competition} · {new Date(latestResult.date).toLocaleDateString('en-ZA', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </div>
                </div>
                <Link
                  to={`/fixtures/${latestResult.id}`}
                  className={styles.reportBtn}
                >
                  Match Report
                </Link>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ── STATS ───────────────────────────────────────────────────────── */}
      <section className={styles.statsSection}>
        <div className={styles.sectionContainer}>
          <div className={styles.statsGrid}>
            <StatCard value={stats.matches} label="Matches" />
            <StatCard value={stats.wins} label="Wins" />
            <StatCard value={stats.draws} label="Draws" />
            <StatCard value={stats.losses} label="Losses" />
            <StatCard value={stats.goals} label="Goals" />
            <StatCard value={stats.players} label="Players" />
            <StatCard value={stats.followers} label="Followers" />
          </div>
        </div>
      </section>

      {/* ── LATEST NEWS ─────────────────────────────────────────────────── */}
      <section className={styles.newsSection}>
        <div className={styles.sectionContainer}>
          <div className={styles.newsHeader}>
            <div>
              <div className={styles.newsSub}>Latest</div>
              <h2 className={styles.newsTitle}>
                News
              </h2>
            </div>
            <Link to="/news" className={styles.newsAllLink}>
              All News →
            </Link>
          </div>
          <div className={styles.newsGrid}>
            {latestNews.map((article, i) => (
              <Link key={article.id} to={`/news/${article.id}`} className={styles.newsCard}>
                <div className={styles.newsCardInner}>
                  <div className={styles.newsImageWrapper}>
                    <img
                      src={article.image}
                      alt={article.title}
                      className={styles.newsImage}
                    />
                  </div>
                  <div className={styles.newsContent}>
                    <div className={styles.newsMeta}>
                      <span className={styles.newsCategory}>
                        {article.category}
                      </span>
                      <span className={styles.newsDate}>
                        {new Date(article.date).toLocaleDateString('en-ZA', { day: 'numeric', month: 'short' })}
                      </span>
                    </div>
                    <h3 className={styles.newsHeadline}>
                      {article.title}
                    </h3>
                    <p className={styles.newsExcerpt}>{article.excerpt}</p>
                    <div className={styles.newsReadMore}>
                      Read More →
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURED PLAYERS ────────────────────────────────────────────── */}
      <section className={styles.playersSection}>
        <div className={styles.sectionContainer}>
          <div className={styles.playersHeader}>
            <div>
              <div className={styles.playersSub}>The Squad</div>
              <h2 className={styles.playersTitle}>
                Players
              </h2>
            </div>
            <Link to="/team" className={styles.playersAllLink}>
              Full Squad →
            </Link>
          </div>
          <div className={styles.playersGrid}>
            {featuredPlayers.map(player => (
              <Link
                key={player.id}
                to={`/team/${player.id}`}
                className={styles.playerCard}
              >
                <div className={styles.playerImageWrapper}>
                  <img
                    src={player.image}
                    alt={player.name}
                    className={styles.playerImage}
                  />
                </div>
                <div className={styles.playerOverlay} />
                <div className={styles.playerNumberBox}>
                  <span className={styles.playerNumber}>
                    {player.number}
                  </span>
                </div>
                <div className={styles.playerInfo}>
                  <div className={styles.playerName}>
                    {player.name}
                  </div>
                  <div className={styles.playerPosition}>
                    {player.position}
                  </div>
                </div>
                <div className={styles.playerProfileBadge}>
                  Profile
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── UPCOMING FIXTURES ───────────────────────────────────────────── */}
      <section className={styles.fixturesSection}>
        <div className={styles.sectionContainer}>
          <div className={styles.fixturesHeader}>
            <div>
              <div className={styles.fixturesSub}>Coming Up</div>
              <h2 className={styles.fixturesTitle}>
                Fixtures
              </h2>
            </div>
            <Link to="/fixtures" className={styles.fixturesAllLink}>
              All Fixtures →
            </Link>
          </div>
          <div className={styles.fixturesList}>
            {upcomingFixtures.map(fix => (
              <Link
                key={fix.id}
                to={`/fixtures/${fix.id}`}
                className={styles.fixtureItem}
              >
                <div className={styles.fixtureDateBox}>
                  <div className={styles.fixtureDay}>
                    {new Date(fix.date).getDate()}
                  </div>
                  <div className={styles.fixtureMonth}>
                    {new Date(fix.date).toLocaleDateString('en-ZA', { month: 'short' })}
                  </div>
                </div>
                <div className={styles.fixtureDivider} />
                <div className={styles.fixtureTeams}>
                  <div className={styles.fixtureTeam}>
                    {fix.homeTeam}
                  </div>
                  <div className={styles.fixtureVs}>VS</div>
                  <div className={styles.fixtureTeamRight}>
                    {fix.awayTeam}
                  </div>
                </div>
                <div className={styles.fixtureMeta}>
                  <div className={styles.fixtureComp}>{fix.competition}</div>
                  <div className={styles.fixtureInfo}>{fix.kickOff} · {fix.venue.split(' ').slice(0, 2).join(' ')}</div>
                </div>
                <div className={styles.fixtureArrow}>
                  <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── CLUB STORY ──────────────────────────────────────────────────── */}
      <section className={styles.storySection}>
        <div
          className={styles.storyBg}
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=1920&h=800&fit=crop&auto=format')" }}
        />
        <div className={styles.storyOverlay} />
        <div className={styles.storyContainer}>
          <div className={styles.storyGrid}>
            <div>
              <div className={styles.storySub}>Our Story</div>
              <h2 className={styles.storyTitle}>
                {content?.storyTitle || 'Built on Belief'}
              </h2>
              <div className={styles.storyDivider} />
              <p className={styles.storyText}>
                {content?.storyText || 'Mphehli All Stars was founded in 2022 by a group of passionate individuals who believed that their community deserved more than just a football club — it deserved a symbol of excellence, ambition, and unity.'}
              </p>
              <p className={styles.storyTextSecondary}>
                {content?.storyTextSecondary || 'Three years on, that belief has been turned into results. On the pitch and off it, the All Stars continue to grow, inspire, and prove that when the hour comes — the men and women of Mphehli are ready.'}
              </p>
              <Link
                to="/about"
                className={styles.storyBtn}
              >
                Our Full Story
              </Link>
            </div>
            <div className={styles.storyTimeline}>
              {[
                { year: '2022', event: 'Club Founded' },
                { year: '2023', event: 'GMLFA Premier League 3rd' },
                { year: '2024', event: 'GMLFA Premier League 5th' },
                { year: '2025', event: 'League Champions' },
              ].map(item => (
                <div key={item.year} className={styles.timelineItem}>
                  <div className={styles.timelineYear}>{item.year}</div>
                  <div className={styles.timelineEvent}>{item.event}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── GALLERY PREVIEW ─────────────────────────────────────────────── */}
      <section className={styles.gallerySection}>
        <div className={styles.sectionContainer}>
          <div className={styles.galleryHeader}>
            <div>
              <div className={styles.gallerySub}>Media</div>
              <h2 className={styles.galleryTitle}>
                Gallery
              </h2>
            </div>
            <Link to="/gallery" className={styles.galleryAllLink}>
              Full Gallery →
            </Link>
          </div>
          <div className={styles.galleryGrid}>
            {galleryPreview.map(item => (
              <div key={item.id} className={styles.galleryItem}>
                <img
                  src={item.thumbnail}
                  alt={item.title}
                  className={styles.galleryImage}
                />
                <div className={styles.galleryOverlay}>
                  {item.type === 'video' && (
                    <div className={styles.galleryPlayBtn}>
                      <svg width="16" height="16" fill="white" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                    </div>
                  )}
                </div>
                <div className={styles.galleryCaption}>
                  <div className={styles.galleryCaptionTitle}>{item.title}</div>
                  <div className={styles.galleryCaptionCat}>{item.category}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SPONSORS ────────────────────────────────────────────────────── */}
      <section className={styles.sponsorsSection}>
        <div className={styles.sectionContainer}>
          <div className={styles.sponsorsHeader}>
            <div className={styles.sponsorsSub}>Partners</div>
            <h2 className={styles.sponsorsTitle}>Our Sponsors</h2>
          </div>
          <div className={styles.sponsorsGrid}>
            {activeSponsors.map(sponsor => (
              <a
                key={sponsor.id}
                href={sponsor.website}
                className={styles.sponsorItem}
              >
                <div className={styles.sponsorInner}>
                  <div className={styles.sponsorName}>
                    {sponsor.name}
                  </div>
                  <div className={styles.sponsorTier}>{sponsor.tier}</div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ───────────────────────────────────────────────────── */}
      <section className={styles.ctaSection}>
        <div
          className={styles.ctaBg}
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1574629181260-bc5e7d23e6d4?w=1920&h=600&fit=crop&auto=format')" }}
        />
        <div className={styles.ctaContent}>
          <h2 className={styles.ctaTitle}>
            Come All Stars
          </h2>
          <p className={styles.ctaSub}>Follow the journey. #ComeAllStars</p>
          <div className={styles.ctaActions}>
            <Link
              to="/team"
              className={styles.ctaBtnPrimary}
            >
              Meet the Team
            </Link>
            <Link
              to="/news"
              className={styles.ctaBtnSecondary}
            >
              Latest News
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
