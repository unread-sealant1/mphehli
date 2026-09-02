import { useState } from 'react';
import { useNavigate } from 'react-router';
import '../styles/admin-login.css';

export default function AdminLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (data.success) {
        navigate('/dashboard');
      } else {
        setError(data.message || 'Invalid email or password');
      }
    } catch (error) {
      setError('An error occurred. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-container">
      <div className="admin-login-card">
        {/* Left panel - Brand Section */}
        <div className="admin-login-brand">
          <div className="admin-login-bg-glow">
             <div className="admin-login-glow-1" />
             <div className="admin-login-glow-2" />
          </div>

          <div className="admin-login-brand-header">
            <img src="/color-logo-no-bg.png" alt="Mphehli All Stars Logo" className="admin-login-logo" />
            <div className="admin-login-brand-text">
              <div className="admin-login-brand-main">Mphehli All Stars</div>
              <div className="admin-login-brand-sub">Admin Portal</div>
            </div>
          </div>

          <div className="admin-login-brand-content">
            <h2 className="admin-login-hero-title">
              Club<br />Management<br />Portal
            </h2>
            <div className="admin-login-hero-accent" />
            <p className="admin-login-hero-text">
              Full control over your club's digital presence. Manage players, fixtures, news, media, and more.
            </p>
          </div>

          <div className="admin-login-brand-footer">
            <p className="admin-login-footer-quote">"Cometh the hour, Cometh the man." #ComeAllStars</p>
          </div>
        </div>

        {/* Right panel - Form Section */}
        <div className="admin-login-form-container">
          <div className="admin-login-form-wrapper">
            <div className="admin-login-mobile-header">
              <img src="/color-logo-no-bg.png" alt="Mphehli All Stars Logo" className="admin-login-logo" />
              <div className="admin-login-brand-main" style={{ color: 'var(--navy-900)' }}>Mphehli All Stars</div>
            </div>

            <h1 className="admin-login-title">Sign In</h1>
            <p className="admin-login-subtitle">Enter your credentials to access the dashboard.</p>

            {error && (
              <div className="admin-login-error">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="admin-login-form">
              <div className="admin-login-field">
                <label className="admin-login-label">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="admin-login-input"
                  placeholder="email@example.com"
                />
              </div>
              <div className="admin-login-field">
                <label className="admin-login-label">
                  Password
                </label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="admin-login-input"
                  placeholder="••••••••"
                />
              </div>
              <div className="admin-login-options">
                <label className="admin-login-remember">
                  <input
                    type="checkbox"
                    checked={remember}
                    onChange={e => setRemember(e.target.checked)}
                    className="admin-login-checkbox"
                  />
                  <span className="admin-login-remember-text">Remember me</span>
                </label>
                <a href="#" className="admin-login-forgot">Forgot password?</a>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="admin-login-submit"
              >
                {loading ? (
                  <>
                    <div className="admin-login-spinner" />
                    Signing in...
                  </>
                ) : 'Sign In'}
              </button>
            </form>

          </div>
        </div>
      </div>
    </div>
  );
}
