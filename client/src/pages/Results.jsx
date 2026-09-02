import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { resultService } from '../services/resultService';
import { getResult, getOpponent } from '../utils/fixtureUtils';
import PageTitle from '../components/PageTitle';
import styles from './Results.module.css';

export default function Results() {
  const [data, setData] = useState({
    results: [],
    loading: true
  });

  useEffect(() => {
    async function loadResults() {
      try {
        const results = await resultService.getResults();
        setData({ results, loading: false });
      } catch (error) {
        console.error("Error loading results:", error);
        setData(prev => ({ ...prev, loading: false }));
      }
    }
    loadResults();
  }, []);

  if (data.loading) {
    return <div className={styles.loadingContainer}>Loading...</div>;
  }

  const { results } = data;

  const resultClassMap = {
    WIN: { badge: styles.badgeWin, row: styles.rowWin, color: styles.colorWin },
    DRAW: { badge: styles.badgeDraw, row: styles.rowDraw, color: styles.colorDraw },
    LOSS: { badge: styles.badgeLoss, row: styles.rowLoss, color: styles.colorLoss },
  };

  const wins = results.filter(f => getResult(f) === 'WIN').length;
  const draws = results.filter(f => getResult(f) === 'DRAW').length;
  const losses = results.filter(f => getResult(f) === 'LOSS').length;

  return (
    <div className={styles.page}>
      <PageTitle title="Results" />
      {/* Hero */}
      <section className={styles.hero}>
        <div className={styles.heroContainer}>
          <div className={styles.heroSub}>2025 Season</div>
          <h1 className={styles.heroTitle}>Results</h1>
          <div className={styles.heroDivider} />
          <div className={styles.heroStats}>
            {[
              { label: 'Wins', value: wins, color: styles.colorWin },
              { label: 'Draws', value: draws, color: styles.colorDraw },
              { label: 'Losses', value: losses, color: styles.colorLoss },
            ].map(s => (
              <div key={s.label}>
                <div className={` ${styles.statValue} ${s.color}`}>{s.value}</div>
                <div className={styles.statLabel}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Results */}
      <section className={styles.resultsSection}>
        <div className={styles.resultsContainer}>
          {results.length === 0 ? (
            <div className={styles.emptyState}>
              <div className={styles.emptyTitle}>No results yet</div>
            </div>
          ) : (
            <div className={styles.resultsList}>
              {results.map(fix => {
                const res = getResult(fix);
                const style = res ? resultClassMap[res] : { badge: styles.badgeDefault, row: '', color: '' };
                const masScore = fix.homeTeam === 'Mphehli All Stars' ? fix.homeScore : fix.awayScore;
                const oppScore = fix.homeTeam === 'Mphehli All Stars' ? fix.awayScore : fix.homeScore;

                return (
                  <Link
                    key={fix.id}
                    to={`/fixtures/${fix.id}`}
                    className={` ${styles.resultItem} ${style.row}`}
                  >
                    <div className={styles.resultRow}>
                      {/* Date */}
                      <div className={styles.resultDateBox}>
                        <div className={styles.resultDay}>
                          {new Date(fix.date).getDate()}
                        </div>
                        <div className={styles.resultMonth}>
                          {new Date(fix.date).toLocaleDateString('en-ZA', { month: 'short' })}
                        </div>
                      </div>

                      <div className={styles.resultDivider} />

                      {/* Teams */}
                      <div className={styles.resultMain}>
                        <div className={styles.resultComp}>{fix.competition}</div>
                        <div className={styles.resultTeams}>
                          <span className={styles.teamName}>Mphehli All Stars</span>
                          <span className={styles.resultScore}>
                            {masScore} – {oppScore}
                          </span>
                          <span className={styles.teamName}>{getOpponent(fix)}</span>
                        </div>
                        <div className={styles.resultVenue}>{fix.venue}</div>
                      </div>

                      {/* Result badge */}
                      {res && (
                        <div className={` ${styles.resultBadge} ${style.badge}`}>
                          {res}
                        </div>
                      )}

                      <div className={styles.resultArrow}>
                        <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
