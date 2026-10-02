import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import styles from './Header.module.css';

const navLinks = [
  { label: 'Home', path: '/' },
  { label: 'About', path: '/about' },
  { label: 'Team', path: '/team' },
  { label: 'Fixtures', path: '/fixtures' },
  { label: 'Results', path: '/results' },
  { label: 'News', path: '/news' },
  { label: 'Gallery', path: '/gallery' },
  { label: 'Sponsors', path: '/sponsors' },
  { label: 'Contact', path: '/contact' },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  const isActive = (path) =>
    path === '/' ? location.pathname === '/' : location.pathname.startsWith(path);

  return (
    <>
      <header
        className={`${styles.header} ${
          scrolled || mobileOpen
            ? styles.headerScrolled
            : styles.headerTransparent
        }`}
      >
        <div className={styles.headerInner}>
          <div className={styles.navContainer}>
            {/* Logo & Brand */}
            <Link to="/" className={styles.logoLink}>
              <img src="/color-logo-no-bg.png" alt="Mphehli All Stars Logo" className={styles.logoImg} />
              <div className={styles.logoBrand}>
                <div className={styles.brandName}>
                  Mphehli All Stars
                </div>
                <div className={styles.brandSub}>
                  Founded 2022
                </div>
              </div>
            </Link>

            {/* Right Side: Nav + CTA */}
            <div className={styles.navRight}>
              <nav className={styles.desktopNav}>
                {navLinks.map(link => (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`${styles.navLink} ${
                      isActive(link.path)
                        ? styles.navLinkActive
                        : styles.navLinkInactive
                    }`}
                  >
                    {link.label}
                    {isActive(link.path) && (
                      <span className={styles.activeIndicator} />
                    )}
                  </Link>
                ))}
              </nav>

              <div className={styles.ctaContainer}>
                <Link
                  to="/contact"
                  className={styles.ctaBtn}
                >
                  Join the All Stars
                </Link>
                <button
                  onClick={() => setMobileOpen(v => !v)}
                  className={styles.mobileToggle}
                  aria-label="Toggle menu"
                >
                  <span className={`block w-6 h-[2px] bg-white transition-all duration-300 ${mobileOpen ? styles.barOpen1 : ''}`} />
                  <span className={`block w-6 h-[2px] bg-white transition-all duration-300 ${mobileOpen ? styles.barOpen2 : ''}`} />
                  <span className={`block w-6 h-[2px] bg-white transition-all duration-300 ${mobileOpen ? styles.barOpen3 : ''}`} />
                </button>
              </div>
            </div>
          </div>

          {/* Mobile Menu */}
          <div
            className={`${styles.mobileMenu} ${
              mobileOpen ? styles.mobileMenuOpen : styles.mobileMenuClosed
            }`}
          >
            <div className={styles.mobileMenuInner}>
              <nav className={styles.mobileNav}>
                {navLinks.map(link => (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`${styles.mobileNavLink} ${
                      isActive(link.path)
                        ? styles.mobileNavLinkActive
                        : styles.mobileNavLinkInactive
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
                <Link
                  to="/contact"
                  className={styles.mobileCTA}
                >
                  Join the All Stars
                </Link>
              </nav>
            </div>
          </div>
        </div>
      </header>
    </>
  );
}
