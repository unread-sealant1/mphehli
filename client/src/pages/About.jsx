import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { settingsService } from '../services/settingsService';
import { Circle } from 'lucide-react';
import PageTitle from '../components/PageTitle';
import ErrorMessage from '../components/ErrorMessage';
import styles from './About.module.css';

export default function About() {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadAbout() {
      try {
        const data = await settingsService.getSettings('about');
        setSettings(data);
      } catch (error) {
        console.error("Error loading about settings:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    }
    loadAbout();
  }, []);

  if (loading) {
    return <div className={styles.loadingContainer}>Loading...</div>;
  }

  if (error) {
    return <ErrorMessage message={error} />;
  }

  return (
    <div>
      <PageTitle title="About" />
      {/* Hero */}
      <section className={styles.hero}>
        <div
          className={styles.heroBg}
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=1920&h=800&fit=crop&auto=format')" }}
        />
        <div className={styles.heroOverlay} />
        <div className={styles.heroContainer}>
          <div className={styles.heroSub}>
            Mphehli All Stars
          </div>
          <h1 className={styles.heroTitle}>
            About the<br />Club
          </h1>
          <div className={styles.heroDivider} />
          <p className={styles.heroText}>
            Founded in 2022. Rooted in community. Built on ambition.
          </p>
        </div>
      </section>

      {/* Club History */}
      <section className={styles.historySection}>
        <div className={styles.sectionContainer}>
          <div className={styles.historyGrid}>
            <div>
              <div className={styles.historySub}>Club History</div>
              <h2 className={styles.historyTitle}>
                {settings?.historyTitle || 'Where It All Began'}
              </h2>
              <p className={styles.historyText}>
                {settings?.historyText || 'Mphehli All Stars Football Club was founded in 2022 by Head Coach Themba Mabaso and a dedicated group of football lovers from the local community. Based in Greater Mayfair, operating under the Johannesburg Football Association in Gauteng (Club ID: 14D1IPI), what began as an idea — a conviction that the Mphehli community deserved a football club to call their own — quickly became a reality.'}
              </p>
              <p className={styles.historyText}>
                In just three years, the All Stars have built a squad, a culture, and a reputation. We compete with discipline, play with ambition, and represent our community with pride.
              </p>
              <p className={styles.historyText}>
                The slogan says it all: <em>"Cometh the hour, Cometh the man."</em> We have always believed that when the moment arrives, this club will rise to meet it.
              </p>
            </div>
            <div className={styles.imageWrapper}>
              <div
                className={styles.historyImage}
                style={{ backgroundImage: "url('https://images.unsplash.com/photo-1517466787929-bc90951d0974?w=900&h=600&fit=crop&auto=format')" }}
              />
              <div className={styles.foundedBadge}>
                <div className={styles.badgeYear}>2022</div>
                <div className={styles.badgeLabel}>Founded</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Identity / Mission / Vision */}
      <section className={styles.identitySection}>
        <div className={styles.sectionContainer}>
          <div className={styles.identityGrid}>
            {[
              {
                title: settings?.identityTitle || 'Our Identity',
                body: settings?.identityBody || 'Mphehli All Stars is a community football club built on the principles of excellence, inclusivity, and ambition. We represent every person in this community who has ever dared to dream big. Our blue and white colours are worn with honour.'
              },
              {
                title: settings?.missionTitle || 'Our Mission',
                body: settings?.missionBody || 'To build a competitive, professional football club that develops talent, inspires the community, and achieves sustained success on the regional and national stage. We do not accept mediocrity. We compete to win.'
              },
              {
                title: settings?.visionTitle || 'Our Vision',
                body: settings?.visionBody || 'To be recognised as the premier community football club in the region by 2028. To have a fully equipped training facility, a thriving youth academy, and a first team competing at the highest level of regional football.'
              },
            ].map(item => (
              <div key={item.title} className={styles.identityCard}>
                <h3 className={styles.identityTitle}>{item.title}</h3>
                <p className={styles.identityBody}>{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className={styles.valuesSection}>
        <div className={styles.sectionContainer}>
          <div className={styles.valuesHeader}>
            <div className={styles.valuesSub}>Who We Are</div>
            <h2 className={styles.valuesTitle}>
              Our Values
            </h2>
          </div>
          <div className={styles.valuesGrid}>
            {(settings?.values || []).map((v, i) => (
              <div key={v.name} className={styles.valueCard}>
                <div className={styles.valueNumber}>
                  0{i + 1}
                </div>
                <h3 className={styles.valueName}>
                  {v.name}
                </h3>
                <p className={styles.valueDesc}>{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className={styles.timelineSection}>
        <div className={styles.timelineContainer}>
          <div className={styles.timelineHeader}>
            <div className={styles.timelineSub}>Since 2022</div>
            <h2 className={styles.timelineTitle}>
              Our Journey
            </h2>
          </div>
          <div className={styles.timelineWrapper}>
            <div className={styles.timelineLine} />
            <div className={styles.timelineList}>
              {(settings?.timeline || []).map((item, i) => (
                <div key={item.year} className={styles.timelineItem}>
                  <div className={styles.timelineContent}>
                    <div className={styles.timelineCard}>
                      <div className={styles.timelineYear}>{item.year}</div>
                      <h3 className={styles.timelineTitleLabel}>{item.title}</h3>
                      <p className={styles.timelineDesc}>{item.description}</p>
                    </div>
                  </div>
                  <div className={styles.timelineDot} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className={styles.ctaSection}>
        <div className={styles.ctaContent}>
          <h2 className={styles.ctaTitle}>
            Be Part of the Story
          </h2>
          <p className={styles.ctaSub}>
            #ComeAllStars <Circle size={12} fill="blue" color="blue" style={{ display: 'inline', marginLeft: '4px' }} /> <Circle size={12} fill="white" color="gray" style={{ display: 'inline', marginLeft: '4px' }} />
          </p>
          <div className={styles.ctaActions}>
            <Link to="/team" className={styles.ctaBtnPrimary}>
              Meet the Squad
            </Link>
            <Link to="/contact" className={styles.ctaBtnSecondary}>
              Get in Touch
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
