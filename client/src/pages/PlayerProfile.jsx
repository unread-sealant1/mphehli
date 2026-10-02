import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { playerService } from '../services/playerService';
import PageTitle from '../components/PageTitle';
import styles from './PlayerProfile.module.css';

export default function PlayerProfile() {
  const { id } = useParams();
  const [data, setData] = useState({
    player: null,
    related: [],
    loading: true
  });

  useEffect(() => {
    async function loadPlayer() {
      try {
        const [player, allPlayers] = await Promise.all([
          playerService.getPlayerById(id),
          playerService.getPlayers()
        ]);
        const related = allPlayers
          .filter(p => p.id !== id && p.position === player?.position)
          .slice(0, 3);
        setData({ player, related, loading: false });
      } catch (error) {
        console.error("Error loading player profile:", error);
        setData(prev => ({ ...prev, loading: false }));
      }
    }
    loadPlayer();
  }, [id]);

  if (data.loading) {
    return <div className={styles.loadingContainer}>Loading...</div>;
  }

  const { player, related } = data;

  if (!player) {
    return (
      <div className={styles.notFoundContainer}>
        <div className={styles.notFoundContent}>
          <div className={styles.notFoundTitle}>Player Not Found</div>
          <Link to="/team" className={styles.notFoundLink}>← Back to Squad</Link>
        </div>
      </div>
    );
  }

  const statItems = [
    { label: 'Appearances', value: player.appearances },
    { label: 'Goals', value: player.goals },
    { label: 'Assists', value: player.assists },
    ...(player.position === 'Goalkeeper' ? [{ label: 'Clean Sheets', value: player.cleanSheets }] : []),
  ];

  return (
    <div className={styles.page}>
      <PageTitle title={player.name} />
      {/* Hero */}
      <section className={styles.hero}>
        <div
          className={styles.coverImage}
          style={{ backgroundImage: `url('${player.coverImage}')` }}
        />
        <div className={styles.gradientOverlayT} />
        <div className={styles.gradientOverlayR} />

        {/* Large player image */}
        <div className={styles.playerImgWrapper}>
          <img
            src={player.image}
            alt={player.name}
            className={styles.playerImg}
          />
          <div className={styles.playerGradR} />
          <div className={styles.playerGradT} />
        </div>

        <div className={styles.heroContainer}>
          <Link to="/team" className={styles.backLink}>
            ← Back to Squad
          </Link>
          <div className={styles.bigNumber}>
            #{player.number}
          </div>
          <div className={styles.relative}>
            <div className={styles.playerMeta}>
              #{player.number} · {player.position}
            </div>
            <h1 className={styles.playerName}>
              {player.name.split(' ')[0]}<br />
              <span className={styles.playerNameAccent}>{player.name.split(' ').slice(1).join(' ')}</span>
            </h1>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className={styles.statsSection}>
        <div className={styles.statsContainer}>
          <div className={styles.statsGrid}>
            {statItems.map(stat => (
              <div key={stat.label} className={styles.statItem}>
                <div className={styles.statValue}>{stat.value}</div>
                <div className={styles.statLabel}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bio + Details */}
      <section className={styles.bioSection}>
        <div className={styles.bioContainer}>
          <div className={styles.bioGrid}>
            <div className={styles.bioMainCol}>
              <h2 className={styles.bioTitle}>
                Player Biography
              </h2>
              <p className={styles.bioText}>{player.biography}</p>

              <div className={styles.careerSection}>
                <h3 className={styles.careerTitle}>Career Information</h3>
                <div className={styles.careerList}>
                  {[
                    { label: 'Current Club', value: 'Mphehli All Stars' },
                    { label: 'Position', value: player.position },
                    { label: 'Squad Number', value: `#${player.number}` },
                    { label: 'Nationality', value: player.nationality },
                    { label: 'Date of Birth', value: new Date(player.dob).toLocaleDateString('en-ZA', { day: 'numeric', month: 'long', year: 'numeric' }) },
                    { label: 'Height', value: player.height },
                    { label: 'Preferred Foot', value: player.preferredFoot },
                  ].map(item => (
                    <div key={item.label} className={styles.careerRow}>
                      <span className={styles.careerLabel}>{item.label}</span>
                      <span className={styles.careerValue}>{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className={styles.sidebar}>
              <div className={styles.sidebarImgWrapper}>
                <img
                  src={player.image}
                  alt={player.name}
                  className={styles.sidebarImg}
                />
              </div>
              <div className={styles.statsCard}>
                <div className={styles.statsCardTitle}>Season Stats</div>
                {statItems.map(stat => (
                  <div key={stat.label} className={styles.statsCardRow}>
                    <span className={styles.statsCardLabel}>{stat.label}</span>
                    <span className={styles.statsCardValue}>{stat.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Related */}
      {related.length > 0 && (
        <section className={styles.relatedSection}>
          <div className={styles.relatedContainer}>
            <h2 className={styles.relatedTitle}>
              More {player.position}s
            </h2>
            <div className={styles.relatedGrid}>
              {related.map(p => (
                <Link key={p.id} to={`/team/${p.id}`} className={styles.relatedLink}>
                  <img src={p.image} alt={p.name} className={styles.relatedImg} />
                  <div>
                    <div className={styles.relatedName}>{p.name}</div>
                    <div className={styles.relatedNumber}>#{p.number}</div>
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
