import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fixtureService } from '../services/fixtureService';
import { getResult } from '../utils/fixtureUtils';
import { Target } from 'lucide-react';
import PageTitle from '../components/PageTitle';
import styles from './FixtureDetails.module.css';

export default function FixtureDetails() {
  const { id } = useParams();
  const [fix, setFix] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadFixture() {
      try {
        const fixture = await fixtureService.getFixtureById(id);
        setFix(fixture);
      } catch (error) {
        console.error("Error loading fixture details:", error);
      } finally {
        setLoading(false);
      }
    }
    loadFixture();
  }, [id]);

  if (loading) {
    return <div className={styles.loadingContainer}>Loading...</div>;
  }

  if (!fix) {
    return (
      <div className={styles.notFoundContainer}>
        <div className={styles.notFoundContent}>
          <div className={styles.notFoundTitle}>Fixture Not Found</div>
          <Link to="/fixtures" className={styles.notFoundLink}>← Back to Fixtures</Link>
        </div>
      </div>
    );
  }

  const result = getResult(fix);
  const resultColors = {
    WIN: styles.resultWin,
    DRAW: styles.resultDraw,
    LOSS: styles.resultLoss,
  };

  return (
    <div className={styles.page}>
      <PageTitle title="Fixture Details" />
      {/* Header */}
      <section className={styles.header}>
        <div className={styles.headerContainer}>
          <Link to="/fixtures" className={styles.backLink}>
            ← All Fixtures
          </Link>
          <div className={styles.metaRow}>
            <span className={styles.metaCompetition}>{fix.competition}</span>
            <span className={styles.metaDivider}>·</span>
            <span className={styles.metaDate}>{new Date(fix.date).toLocaleDateString('en-ZA', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</span>
          </div>
        </div>
      </section>

      {/* Match Centre */}
      <section className={styles.matchCentre}>
        <div className={styles.matchCentreContainer}>
          <div className={styles.matchGrid}>
            {/* Home */}
            <div className={styles.teamContainer}>
              <div className={`teamLogo ${fix.homeTeam === 'Mphehli All Stars' ? styles.logoPrimary : styles.logoSecondary}`}>
                <span className={`logoText ${fix.homeTeam === 'Mphehli All Stars' ? styles.logoTextPrimary : styles.logoTextSecondary}`}>
                  {fix.homeTeam.split(' ').map(w => w[0]).join('').slice(0, 3)}
                </span>
              </div>
              <div className={styles.teamName}>
                {fix.homeTeam}
              </div>
            </div>

            {/* Score */}
            <div className={styles.scoreContainer}>
              {fix.status === 'completed' && fix.homeScore !== undefined ? (
                <>
                  <div className={styles.scoreValue}>
                    {fix.homeScore}<span className={styles.scoreDivider}>–</span>{fix.awayScore}
                  </div>
                  {result && (
                    <div className={`resultBadge ${resultColors[result]}`}>
                      {result}
                    </div>
                  )}
                </>
              ) : fix.status === 'upcoming' ? (
                <>
                  <div className={styles.vsText}>VS</div>
                  <div className={styles.kickOffTime}>{fix.kickOff}</div>
                </>
              ) : (
                <div className={styles.statusText}>{fix.status}</div>
              )}
              <div className={styles.venueText}>{fix.venue}</div>
            </div>

            {/* Away */}
            <div className={styles.teamContainer}>
              <div className={`teamLogo ${fix.awayTeam === 'Mphehli All Stars' ? styles.logoPrimary : styles.logoSecondary}`}>
                <span className={`logoText ${fix.awayTeam === 'Mphehli All Stars' ? styles.logoTextPrimary : styles.logoTextSecondary}`}>
                  {fix.awayTeam.split(' ').map(w => w[0]).join('').slice(0, 3)}
                </span>
              </div>
              <div className={styles.teamName}>
                {fix.awayTeam}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Details */}
      <section className={styles.detailsSection}>
        <div className={styles.detailsContainer}>
          <div className={styles.detailsGrid}>
            {/* Main content */}
            <div className={styles.mainDetailsCol}>
              {/* Preview or Report */}
              {(fix.report || fix.preview) && (
                <div className={styles.detailCard}>
                  <h3 className={styles.detailTitle}>
                    {fix.status === 'completed' ? 'Match Report' : 'Match Preview'}
                  </h3>
                  <div className={styles.reportContent}>
                    {(fix.report || fix.preview).split('\n').map((para, i) => (
                      <p key={i} className={styles.reportContent}>{para}</p>
                    ))}
                  </div>
                </div>
              )}

              {/* Goals */}
              {fix.goalScorers && fix.goalScorers.length > 0 && (
                <div className={styles.detailCard}>
                  <h3 className={styles.detailTitle}>Goals</h3>
                  <div className={styles.goalRowContainer}>
                    {fix.goalScorers.map((g, i) => (
                      <div key={i} className={`goalRow ${g.team === 'away' ? styles.goalRowAway : ''}`}>
                        <span className={styles.goalIcon}><Target size={14} /></span>
                        <span className={styles.goalPlayer}>{g.player}</span>
                        <span className={styles.goalMinute}>{g.minute}'</span>
                        <span className={`goalTeam ${g.team === 'home' ? styles.teamHome : styles.teamAway}`}>
                          {g.team === 'home' ? fix.homeTeam.split(' ')[0] : fix.awayTeam.split(' ')[0]}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Cards */}
              {fix.cards && fix.cards.length > 0 && (
                <div className={styles.detailCard}>
                  <h3 className={styles.detailTitle}>Cards</h3>
                  <div className={styles.cardRowContainer}>
                    {fix.cards.map((c, i) => (
                      <div key={i} className={styles.cardRow}>
                        <div className={`cardColor ${c.type === 'yellow' ? styles.cardColorYellow : styles.cardColorRed}`} />
                        <span className={styles.cardPlayer}>{c.player}</span>
                        <span className={styles.cardMinute}>{c.minute}'</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Lineups */}
              {fix.lineupHome && fix.lineupAway && (
                <div className={styles.lineupContainer}>
                  <h3 className={styles.lineupTitle}>Lineups</h3>
                  <div className={styles.lineupGrid}>
                    <div className={styles.lineupCol}>
                      <div className={`lineupTeamName ${styles.teamHomeLabel}`}>{fix.homeTeam}</div>
                      {fix.lineupHome.map((p, i) => (
                        <div key={i} className={styles.lineupPlayer}>
                          <span className={styles.playerNum}>{i + 1}</span>
                          <span className={styles.playerName}>{p}</span>
                        </div>
                      ))}
                    </div>
                    <div className={styles.lineupCol}>
                      <div className={`lineupTeamName ${styles.teamAwayLabel}`}>{fix.awayTeam}</div>
                      {fix.lineupAway.map((p, i) => (
                        <div key={i} className={styles.lineupPlayer}>
                          <span className={styles.playerNum}>{i + 1}</span>
                          <span className={styles.playerName}>{p}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className={styles.sidebar}>
              <div className={styles.infoCard}>
                <h3 className={styles.infoTitle}>Match Info</h3>
                {[
                  { label: 'Competition', value: fix.competition },
                  { label: 'Date', value: new Date(fix.date).toLocaleDateString('en-ZA', { day: 'numeric', month: 'long', year: 'numeric' }) },
                  { label: 'Kick-off', value: fix.kickOff },
                  { label: 'Venue', value: fix.venue },
                  { label: 'Status', value: fix.status.toUpperCase() },
                ].map(item => (
                  <div key={item.label} className={styles.infoRow}>
                    <div className={styles.infoLabel}>{item.label}</div>
                    <div className={styles.infoValue}>{item.value}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
