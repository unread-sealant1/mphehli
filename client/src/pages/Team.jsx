import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { playerService } from '../services/playerService';
import { staffService } from '../services/staffService';
import PageTitle from '../components/PageTitle';
import styles from './Team.module.css';

const positions = ['Goalkeeper', 'Defender', 'Midfielder', 'Forward'];
const genderFilters = ['All', 'Men', 'Women'];

function PlayerCard({ player }) {
  return (
    <Link to={`/team/${player.id}`} className={styles.playerCard}>
      <div className={styles.playerImageWrapper}>
        <img
          src={player.image}
          alt={player.name}
          className={styles.playerImage}
        />
        <div className={styles.playerOverlay} />
        <div className={styles.playerNumberBox}>
          <span className={styles.playerNumber}>{player.number}</span>
        </div>
        <div className={styles.playerBadgeBox}>
          <span className={styles.playerBadge}>
            Profile
          </span>
        </div>
        <div className={styles.playerInfo}>
          <div className={styles.playerName}>
            {player.name}
          </div>
          <div className={styles.playerMeta}>
            <span className={styles.playerPosition}>
              {player.position}
            </span>
            <span className={styles.playerNumberSmall}>#{player.number}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default function Team() {
  const [genderFilter, setGenderFilter] = useState('All');
  const [data, setData] = useState({
    players: [],
    staff: [],
    loading: true
  });

  useEffect(() => {
    async function loadData() {
      try {
        const [players, staff] = await Promise.all([
          playerService.getPlayers(),
          staffService.getActiveStaff()
        ]);
        setData({ players, staff, loading: false });
      } catch (error) {
        console.error("Error loading team data:", error);
        setData(prev => ({ ...prev, loading: false }));
      }
    }
    loadData();
  }, []);

  if (data.loading) {
    return <div className={styles.loadingContainer}>Loading...</div>;
  }

  const { players, staff } = data;

  const filteredPlayers = players.filter(p => {
    if (p.status !== 'active') return false;
    if (genderFilter === 'All') return true;
    const isWomen = p.team === 'sasol_women';
    return genderFilter === 'Women' ? isWomen : !isWomen;
  });

  return (
    <div className={styles.teamPage}>
      <PageTitle title="Squad" />
      {/* Hero */}
      <section className={styles.hero}>
        <div
          className={styles.heroBg}
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1517466787929-bc90951d0974?w=1920&h=600&fit=crop&auto=format')" }}
        />
        <div className={styles.heroOverlay} />
        <div className={styles.heroContainer}>
          <div className={styles.heroSub}>2025 Season</div>
          <h1 className={styles.heroTitle}>
            The Squad
          </h1>
          <div className={styles.heroDivider} />
          <p className={styles.heroText}>{filteredPlayers.length} players · Mphehli All Stars</p>
        </div>
      </section>

      {/* Gender Filter Bar */}
      <section className={styles.filterBar}>
        <div className={styles.filterContainer}>
          <div className={styles.filterControls}>
            {genderFilters.map(filter => (
              <button
                key={filter}
                onClick={() => setGenderFilter(filter)}
                className={` ${styles.filterBtn} ${
                  genderFilter === filter ? styles.filterBtnActive : styles.filterBtnInactive
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Players by position */}
      <div className={styles.squadContainer}>
        {positions.map(position => {
          const group = filteredPlayers.filter(p => p.position === position);
          if (!group.length) return null;
          return (
            <div key={position} className={styles.positionSection}>
              <div className={styles.positionHeader}>
                <h2 className={styles.positionTitle}>
                  {position}s
                </h2>
                <div className={styles.positionDivider} />
                <span className={styles.positionCount}>
                  {group.length} player{group.length > 1 ? 's' : ''}
                </span>
              </div>
              <div className={styles.playersGrid}>
                {group.map(player => (
                  <PlayerCard key={player.id} player={player} />
                ))}
              </div>
            </div>
          );
        })}

        {/* Technical Staff */}
        <div className={styles.staffSection}>
          <div className={styles.staffHeader}>
            <h2 className={styles.staffTitle}>
              Technical Staff
            </h2>
            <div className={styles.staffDivider} />
          </div>
          <div className={styles.staffGrid}>
            {staff.map(staffMember => (
              <div key={staffMember.id} className={styles.staffCard}>
                <div className={styles.staffImageWrapper}>
                  <img
                    src={staffMember.photo}
                    alt={staffMember.name}
                    className={styles.staffImage}
                  />
                </div>
                <div className={styles.staffInfo}>
                  <div className={styles.staffName}>{staffMember.name}</div>
                  <div className={styles.staffRole}>{staffMember.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
