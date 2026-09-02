import { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router';
import {
  LayoutDashboard,
  Users,
  CreditCard,
  Calendar,
  Trophy,
  Newspaper,
  Image,
  Handshake,
  UserCog,
  Home,
  Info,
  Phone,
  Share2,
  UserCircle,
  ShieldCheck,
  Settings
} from 'lucide-react';
import '../index.css';
import '../styles/admin-layout.css';

const navGroups = [
  {
    label: 'Overview',
    items: [
      { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    ],
  },
  {
    label: 'Content',
    items: [
      { label: 'Players', path: '/players', icon: Users },
      { label: 'Player Cards', path: '/player-cards', icon: CreditCard },
      { label: 'Fixtures', path: '/fixtures', icon: Calendar },
      { label: 'Results', path: '/results', icon: Trophy },
      { label: 'News', path: '/news', icon: Newspaper },
      { label: 'Gallery', path: '/gallery', icon: Image },
      { label: 'Sponsors', path: '/sponsors', icon: Handshake },
      { label: 'Technical Team', path: '/staff', icon: UserCog },
    ],
  },
  {
    label: 'Website',
    items: [
      { label: 'Homepage', path: '/settings/homepage', icon: Home },
      { label: 'About', path: '/settings/about', icon: Info },
      { label: 'Contact', path: '/settings/contact', icon: Phone },
      { label: 'Social Media', path: '/settings/social', icon: Share2 },
    ],
  },
  {
    label: 'System',
    items: [
      { label: 'Profile', path: '/profile', icon: UserCircle },
      { label: 'Admin Users', path: '/users', icon: ShieldCheck },
      { label: 'Settings', path: '/settings', icon: Settings },
    ],
  },
];

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path) => location.pathname === path || location.pathname.startsWith(path + '/');

  const handleLogout = () => {
    navigate('/');
  };

  return (
    <div className="admin-layout">
      {/* Sidebar */}
      <aside className={`admin-sidebar ${sidebarOpen ? 'admin-sidebar-open' : 'admin-sidebar-closed'}`}>
        {/* Logo */}
        <div className="admin-sidebar-header">
          <img src="/color-logo-no-bg.png" alt="Mphehli All Stars Logo" className="admin-sidebar-logo" />
          <div className="admin-sidebar-brand">
            <div className="admin-sidebar-brand-main">Mphehli All Stars</div>
            <div className="admin-sidebar-brand-sub">Admin Portal</div>
          </div>
        </div>

        {/* Nav */}
        <nav className="admin-sidebar-nav">
          {navGroups.map(group => (
            <div key={group.label} className="admin-nav-group">
              <div className="admin-nav-group-label">
                {group.label}
              </div>
              {group.items.map(item => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setSidebarOpen(false)}
                    className={`admin-nav-item ${isActive(item.path) ? 'admin-nav-item-active' : ''}`}
                  >
                    <Icon size={18} className="admin-nav-item-icon" />
                    <span className="admin-nav-item-label">{item.label}</span>
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>

        {/* Bottom */}
        <div className="admin-sidebar-footer">
          <div className="admin-user-profile">
            <div className="admin-user-avatar">
              <span>A</span>
            </div>
            <div className="admin-user-name">Admin</div>
          </div>
          <button
            onClick={handleLogout}
            className="admin-logout-btn"
          >
            <span style={{ fontSize: '1rem' }}>→</span>
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Overlay */}
      {sidebarOpen && (
        <div
          className="admin-sidebar-overlay"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main */}
      <div className="admin-main-wrapper">
        {/* Top bar */}
        <header className="admin-top-bar">
          <div className="admin-top-bar-left">
            <button
              onClick={() => setSidebarOpen(v => !v)}
              className="admin-menu-toggle"
            >
              <span></span>
              <span></span>
              <span></span>
            </button>
            <nav className="admin-breadcrumbs">
              <span className="breadcrumb-item-muted">Admin</span>
              <span className="breadcrumb-separator">›</span>
              <span className="breadcrumb-item-active">
                {navGroups.flatMap(g => g.items).find(i => isActive(i.path))?.label ?? 'Dashboard'}
              </span>
            </nav>
          </div>
          <div className="admin-top-bar-right">
            <Link
              to="/"
              target="_blank"
              className="admin-view-site-link"
            >
              View Site →
            </Link>
            <div className="admin-top-bar-user">
              <span>A</span>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="admin-page-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
