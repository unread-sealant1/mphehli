import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { sponsorService } from '../services/sponsorService';
import PageTitle from '../components/PageTitle';
import styles from './Sponsors.module.css';

export default function Sponsors() {
  const [data, setData] = useState({
    sponsors: [],
    loading: true
  });

  useEffect(() => {
    async function loadSponsors() {
      try {
        const sponsors = await sponsorService.getSponsors();
        setData({ sponsors, loading: false });
      } catch (error) {
        console.error("Error loading sponsors:", error);
        setData(prev => ({ ...prev, loading: false }));
      }
    }
    loadSponsors();
  }, []);

  if (data.loading) {
    return <div className={styles.loadingContainer}>Loading...</div>;
  }

  const { sponsors } = data;
  const main = sponsors.filter(s => s.active && s.tier === 'Main Partner');
  const official = sponsors.filter(s => s.active && s.tier === 'Official Partner');
  const community = sponsors.filter(s => s.active && s.tier === 'Community Partner');

  return (
    <div className={styles.page}>
      <PageTitle title="Sponsors" />
      {/* Hero */}
      <section className={styles.hero}>
        <div className={styles.heroContainer}>
          <div className={styles.heroSub}>Our Partners</div>
          <h1 className={styles.heroTitle}>Sponsors</h1>
          <div className={styles.heroDivider} />
          <p className={styles.heroText}>
            The organisations and individuals who share our vision and make Mphehli All Stars possible.
          </p>
        </div>
      </section>

      {/* Main Partners */}
      {main.length > 0 && (
        <section className={styles.mainSponsorsSection}>
          <div className={styles.sectionContainer}>
            <div className={styles.sectionSub}>Main Partners</div>
            <div className={styles.mainGrid}>
              {main.map(s => (
                <a
                  key={s.id}
                  href={s.website}
                  className={styles.mainCard}
                >
                  <div className={styles.mainCardHeader}>
                    <div className={styles.mainLogo}>
                      <span className={styles.logoText}>
                        {s.name.split(' ').map(w => w[0]).join('').slice(0, 3)}
                      </span>
                    </div>
                    <div>
                      <div className={styles.mainName}>{s.name}</div>
                      <div className={styles.mainTier}>{s.tier}</div>
                    </div>
                  </div>
                  <p className={styles.mainDesc}>{s.description}</p>
                  <div className={styles.mainVisitLink}>
                    Visit Website →
                  </div>
                </a>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Official Partners */}
      {official.length > 0 && (
        <section className={styles.officialSponsorsSection}>
          <div className={styles.sectionContainer}>
            <div className={styles.sectionSub}>Official Partners</div>
            <div className={styles.officialGrid}>
              {official.map(s => (
                <a
                  key={s.id}
                  href={s.website}
                  className={styles.officialCard}
                >
                  <div className={styles.officialLogo}>
                    <span className={styles.officialLogoText}>
                      {s.name.split(' ').map(w => w[0]).join('').slice(0, 3)}
                    </span>
                  </div>
                  <div className={styles.officialName}>{s.name}</div>
                  <div className={styles.officialTier}>{s.tier}</div>
                  <p className={styles.officialDesc}>{s.description}</p>
                </a>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Community Partners */}
      {community.length > 0 && (
        <section className={styles.communitySponsorsSection}>
          <div className={styles.sectionContainer}>
            <div className={styles.sectionSub}>Community Partners</div>
            <div className={styles.communityGrid}>
              {community.map(s => (
                <a
                  key={s.id}
                  href={s.website}
                  className={styles.communityCard}
                >
                  <div className={styles.communityLogo}>
                    <span className={styles.communityLogoText}>
                      {s.name.split(' ').map(w => w[0]).join('').slice(0, 3)}
                    </span>
                  </div>
                  <div className={styles.communityName}>{s.name}</div>
                  <div className={styles.communityTier}>{s.tier}</div>
                </a>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Become a Partner CTA */}
      <section className={styles.ctaSection}>
        <div className={styles.ctaContainer}>
          <div className={styles.ctaSub}>Partner With Us</div>
          <h2 className={styles.ctaTitle}>
            Become a Partner
          </h2>
          <p className={styles.ctaText}>
            Align your brand with an ambitious, growing football club that is making a real impact in the community. Mphehli All Stars offers exceptional partnership opportunities at every level.
          </p>
          <Link
            to="/contact"
            className={styles.ctaBtn}
          >
            Get in Touch
          </Link>
        </div>
      </section>
    </div>
  );
}
