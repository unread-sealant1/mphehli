import { Link } from 'react-router-dom';
import styles from './Footer.module.css';

const links = {
  Club: [
    { label: 'About', path: '/about' },
    { label: 'Team', path: '/team' },
    { label: 'Sponsors', path: '/sponsors' },
    { label: 'Contact', path: '/contact' },
  ],
  Football: [
    { label: 'Fixtures', path: '/fixtures' },
    { label: 'Results', path: '/results' },
    { label: 'Gallery', path: '/gallery' },
    { label: 'News', path: '/news' },
  ],
};

export default function Footer() {
  return (
    <footer className={styles.footer}>
      {/* Main footer */}
      <div className={styles.footerMain}>
        <div className={styles.footerGrid}>
          {/* Brand */}
          <div className={styles.brandSection}>
            <div className={styles.brandLogo}>
              <img src="/color-logo-no-bg.png" alt="Mphehli All Stars Logo" className={styles.logoImg} />
              <div className={styles.brandInfo}>
                <div className={styles.brandName}>Mphehli All Stars</div>
                <div className={styles.brandSub}>Founded 2022</div>
              </div>
            </div>
            <p className={styles.brandQuote}>
              "Cometh the hour, Cometh the man."
            </p>
            <p className={styles.brandHash}>
              #ComeAllStars
            </p>
            {/* Social */}
            <div className={styles.socials}>
              {['Facebook', 'Instagram', 'X', 'TikTok'].map(s => (
                <a
                  key={s}
                  href="#"
                  className={styles.socialBtn}
                  aria-label={s}
                >
                  <span className={styles.socialBtnText}>{s[0]}</span>
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(links).map(([title, items]) => (
            <div key={title} className={styles.linkSection}>
              <h4 className={styles.linkTitle}>
                {title}
              </h4>
              <ul className={styles.linkList}>
                {items.map(item => (
                  <li key={item.path}>
                    <Link
                      to={item.path}
                      className={styles.linkItem}
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom bar */}
      <div className={styles.bottomBar}>
        <div className={styles.bottomBarInner}>
          <p className={styles.copyright}>
            © 2025 Mphehli All Stars. All rights reserved.
          </p>
          <div className={styles.bottomLinks}>
            <a href="#" className={styles.bottomLink}>Privacy Policy</a>
            <a href="#" className={styles.bottomLink}>Terms of Use</a>
            <Link to="/admin" className={`${styles.bottomLink} ${styles.adminLink}`}>Admin</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
