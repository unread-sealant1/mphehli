import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fixtureService } from '../services/fixtureService';
import PageTitle from '../components/PageTitle';
import ErrorMessage from '../components/ErrorMessage';
import styles from './Fixtures.module.css';

export default function Fixtures() {
  const [filter, setFilter] = useState('all');
  const [competition, setCompetition] = useState('all');
  const [data, setData] = useState({
    fixtures: [],
    loading: true,
    error: null
  });

  useEffect(() => {
    async function loadFixtures() {
      try {
        const fixtures = await fixtureService.getFixtures();
        setData({ fixtures, loading: false });
      } catch (error) {
        console.error("Error loading fixtures:", error);
        setData(prev => ({ ...prev, loading: false, error: error.message }));
      }
    }
    loadFixtures();
  }, []);

  if (data.loading) {
    return <div className={styles.loadingContainer}>Loading...</div>;
  }

  if (data.error) {
    return <ErrorMessage message={data.error} />;
  }

  const competitions = ['all', ...Array.from(new Set(data.fixtures.map(f => f.competition)))];
  const filtered = data.fixtures.filter(f => {
    if (filter !== 'all' && f.status !== filter) return false;
    if (competition !== 'all' && f.competition !== competition) return false;
    return true;
  });

  const getStatusClass = (status) => {
    switch (status) {
      case 'upcoming': return styles.badgeUpcoming;
      case 'live': return styles.badgeLive;
      case 'completed': return styles.badgeCompleted;
      case 'postponed': return styles.badgePostponed;
      case 'cancelled': return styles.badgeCancelled;
      default: return '';
    }
  };

  return (
    <div className={styles.page}>
      <PageTitle title="Fixtures" />
      {/* Hero */}
      <section className={styles.hero}>
        <div className={styles.heroContainer}>
          <div className={styles.heroSub}>2025 Season</div>
          <h1 className={styles.heroTitle}>Fixtures</h1>
          <div className={styles.heroDivider} />
        </div>
      </section>

      {/* Filters */}
      <section className={styles.filterBar}>
        <div className={styles.filterContainer}>
          <div className={styles.filterControls}>
            {(['all', 'upcoming', 'completed']).map(f => (
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
            <div className={styles.filterSelectBox}>
              <select
                value={competition}
                onChange={e => setCompetition(e.target.value)}
                className={styles.competitionSelect}
              >
                {competitions.map(c => (
                  <option key={c} value={c} className="uppercase">{c === 'all' ? 'All Competitions' : c}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* Fixture List */}
      <section className={styles.listSection}>
        <div className={styles.listContainer}>
          {filtered.length === 0 ? (
            <div className={styles.emptyState}>
              <div className={styles.emptyTitle}>No fixtures found</div>
            </div>
          ) : (
            <div className={styles.fixturesList}>
              {filtered.map(fix => (
                <Link
                  key={fix.id}
                  to={`/fixtures/${fix.id}`}
                  className={styles.fixtureItem}
                >
                  <div className={styles.fixtureRow}>
                    {/* Date */}
                    <div className={styles.fixtureDateBox}>
                      <div className={styles.fixtureDay}>
                        {new Date(fix.date).getDate()}
                      </div>
                      <div className={styles.fixtureMonth}>
                        {new Date(fix.date).toLocaleDateString('en-ZA', { month: 'short' })}
                      </div>
                      <div className={styles.fixtureYear}>
                        {new Date(fix.date).getFullYear()}
                      </div>
                    </div>

                    {/* Main */}
                    <div className={styles.fixtureMain}>
                      <div className={styles.fixtureDetails}>
                        <div className={styles.fixtureMeta}>
                          <span className={` ${styles.statusBadge} ${getStatusClass(fix.status)}`}>
                            {fix.status}
                          </span>
                          <span className={styles.competitionTag}>{fix.competition}</span>
                        </div>
                        <div className={styles.fixtureTeams}>
                          <div className={styles.teamLeft}>
                            <div className={` ${styles.teamLogo} ${fix.homeTeam === 'Mphehli All Stars' ? styles.logoPrimary : styles.logoSecondary}`}>
                              <span className={` ${styles.logoText} ${fix.homeTeam === 'Mphehli All Stars' ? styles.logoTextPrimary : styles.logoTextSecondary}`}>
                                {fix.homeTeam.split(' ').map(w => w[0]).join('').slice(0, 3)}
                              </span>
                            </div>
                            <span className={styles.teamName}>
                              {fix.homeTeam}
                            </span>
                          </div>
                          <div className={styles.fixtureScore}>
                            {fix.status === 'completed' && fix.homeScore !== undefined ? (
                              <span className={styles.scoreText}>
                                {fix.homeScore} – {fix.awayScore}
                              </span>
                            ) : (
                              <span className={styles.vsText}>VS</span>
                            )}
                          </div>
                          <div className={styles.teamRight}>
                            <span className={styles.teamNameRight}>
                              {fix.awayTeam}
                            </span>
                            <div className={` ${styles.teamLogo} ${fix.awayTeam === 'Mphehli All Stars' ? styles.logoPrimary : styles.logoSecondary}`}>
                              <span className={` ${styles.logoText} ${fix.awayTeam === 'Mphehli All Stars' ? styles.logoTextPrimary : styles.logoTextSecondary}`}>
                                {fix.awayTeam.split(' ').map(w => w[0]).join('').slice(0, 3)}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Meta */}
                      <div className={styles.fixtureMetaRight}>
                        <div className={styles.kickOff}>{fix.kickOff}</div>
                        <div className={styles.venue}>{fix.venue}</div>
                      </div>

                      <div className={styles.fixtureArrow}>
                        <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                        </svg>
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
