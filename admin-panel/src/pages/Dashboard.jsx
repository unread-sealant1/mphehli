import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { adminService } from '../services/adminService';
import { fixtureService } from '../services/fixtureService';
import { resultService } from '../services/resultService';
import { getResult } from '../utils/footballUtils';
import AdminPageTitle from '../components/AdminPageTitle';
import '../styles/admin-pages.css';

function StatCard({ label, value, color, link }) {
  return (
    <Link to={link} className="admin-stat-card" style={{ borderLeftColor: color }}>
      <div className="admin-stat-value">{value}</div>
      <div className="admin-stat-label">{label}</div>
    </Link>
  );
}

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [activity, setActivity] = useState([]);
  const [nextFixture, setNextFixture] = useState(null);
  const [latestResults, setLatestResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboardData() {
      try {
        const [dashboardStats, recentActivity, allFixtures, results] = await Promise.all([
          adminService.getDashboardStats(),
          adminService.getRecentActivity(),
          fixtureService.getFixtures(),
          resultService.getResults()
        ]);

        setStats(dashboardStats);
        setActivity(recentActivity);
        setLatestResults(results.slice(0, 3));

        const upcoming = allFixtures.find(f => f.status === 'upcoming');
        setNextFixture(upcoming);
      } catch (error) {
        console.error("Error loading dashboard:", error);
      } finally {
        setLoading(false);
      }
    }
    loadDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="admin-page-container" style={{ justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <div className="admin-page-subtitle">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="admin-dashboard-container">
      <AdminPageTitle title="Dashboard" />
      <div className="admin-dashboard-header">
        <div>
          <h1 className="admin-dashboard-title">Dashboard</h1>
          <p className="admin-dashboard-subtitle">Welcome back, Administrator. Here's what's happening at Mphehli All Stars.</p>
        </div>
      </div>

      {stats && (
        <div className="admin-stats-grid">
          <StatCard label="Total Players" value={stats.totalPlayers} color="#121B47" link="/players" />
          <StatCard label="Upcoming Fixtures" value={stats.upcomingFixtures} color="#16A34A" link="/fixtures" />
          <StatCard label="Published News" value={stats.publishedNews} color="#CA8A04" link="/news" />
          <StatCard label="Gallery Items" value={stats.galleryCount} color="#7C3AED" link="/gallery" />
          <StatCard label="Active Sponsors" value={stats.activeSponsors} color="#059669" link="/sponsors" />
          <StatCard label="Total Results" value={stats.totalResults} color="#DC2626" link="/results" />
        </div>
      )}

      <div className="admin-dashboard-main-grid">
        {/* Recent Activity */}
        <div className="admin-dashboard-card">
          <h2 className="admin-card-title">Recent Activity</h2>
          <div className="admin-activity-list">
            {activity.length > 0 ? activity.map((item, i) => (
              <div key={i} className="admin-activity-item">
                <div className="admin-activity-dot" style={{ backgroundColor: item.color }} />
                <div className="admin-activity-content">
                  <div className="admin-activity-action">{item.action}</div>
                  <div className="admin-activity-detail">{item.detail}</div>
                </div>
                <div className="admin-activity-time">{item.time}</div>
              </div>
            )) : (
              <div className="admin-page-subtitle">No recent activity.</div>
            )}
          </div>
        </div>

        {/* Next Fixture */}
        <div className="admin-dashboard-card">
          <h2 className="admin-card-title">Next Fixture</h2>
          {nextFixture ? (
            <div className="admin-next-fixture">
              <div className="admin-fixture-competition">
                {nextFixture.competition}
              </div>
              <div className="admin-fixture-teams">
                <div className="admin-fixture-team">
                  <div className="admin-fixture-team-logo admin-fixture-team-home">MAS</div>
                  <div className="admin-fixture-team-name">{nextFixture.homeTeam.split(' ')[0]}</div>
                </div>
                <div className="admin-fixture-vs">VS</div>
                <div className="admin-fixture-team">
                  <div className="admin-fixture-team-logo admin-fixture-team-away">
                    {nextFixture.awayTeam.split(' ').map(w => w[0]).join('').slice(0, 3)}
                  </div>
                  <div className="admin-fixture-team-name">{nextFixture.awayTeam.split(' ')[0]}</div>
                </div>
              </div>
              <div className="admin-fixture-date">
                {new Date(nextFixture.date).toLocaleDateString('en-ZA', { day: 'numeric', month: 'short', year: 'numeric' })} · {nextFixture.kickOff}
              </div>
              <div className="admin-fixture-venue">{nextFixture.venue}</div>
              <Link to="/fixtures" className="admin-fixture-manage-link">
                Manage Fixtures →
              </Link>
            </div>
          ) : (
            <p className="admin-page-subtitle" style={{ fontStyle: 'italic' }}>No upcoming fixtures.</p>
          )}
        </div>

        {/* Latest Results */}
        <div className="admin-dashboard-card">
          <h2 className="admin-card-title">Latest Results</h2>
          {latestResults.length === 0 ? (
            <p className="admin-page-subtitle" style={{ fontStyle: 'italic' }}>No results yet.</p>
          ) : (
            <div className="admin-result-list">
              {latestResults.map(fix => {
                const res = getResult(fix);
                const resColors = { WIN: 'result-win', DRAW: 'result-draw', LOSS: 'result-loss' };
                const masScore = fix.homeTeam === 'Mphehli All Stars' ? fix.homeScore : fix.awayScore;
                const oppScore = fix.homeTeam === 'Mphehli All Stars' ? fix.awayScore : fix.homeScore;
                const opponent = fix.homeTeam === 'Mphehli All Stars' ? fix.awayTeam : fix.homeTeam;

                return (
                  <div key={fix.id} className="admin-result-item">
                    {res && <span className={`admin-result-badge ${resColors[res]}`}>{res}</span>}
                    <div className="admin-result-info">
                      <div className="admin-result-opponent">vs {opponent}</div>
                      <div className="admin-result-comp">{fix.competition}</div>
                    </div>
                    <div className="admin-result-score">{masScore}–{oppScore}</div>
                  </div>
                );
              })}
              <Link to="/results" className="admin-results-all-link">
                View All Results →
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="admin-quick-actions">
        <h2 className="admin-quick-actions-title">Quick Actions</h2>
        <div className="admin-quick-actions-grid">
          {[
            { label: '+ Add Player', path: '/players/new', color: 'action-blue' },
            { label: '+ Add Fixture', path: '/fixtures/new', color: 'action-green' },
            { label: '+ Write Article', path: '/news/new', color: 'action-gold' },
            { label: '+ Upload Media', path: '/gallery', color: 'action-purple' },
            { label: '+ Add Sponsor', path: '/sponsors', color: 'action-emerald' },
          ].map(a => (
            <Link
              key={a.label}
              to={a.path}
              className={`admin-action-btn-quick ${a.color}`}
            >
              {a.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
