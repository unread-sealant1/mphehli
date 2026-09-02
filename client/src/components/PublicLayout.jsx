import { Outlet } from 'react-router';
import Header from './Header';
import Footer from './Footer';
import styles from './PublicLayout.module.css';

export default function PublicLayout() {
  return (
    <div className={styles.layoutContainer}>
      <Header />
      <main className={styles.mainContent}>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
