import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import { Mail, Lock, LogIn, Sprout, AlertCircle, ArrowRight, ShieldCheck, UserCheck } from 'lucide-react';

export default function Login() {
  const { login, isAuthenticated, isAdmin } = useAuth();
  const { t } = useApp();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Redirect if already logged in
  useEffect(() => {
    if (isAuthenticated) {
      if (isAdmin) {
        navigate('/admin/dashboard', { replace: true });
      } else {
        const dest = location.state?.from?.pathname || '/dashboard';
        navigate(dest, { replace: true });
      }
    }
  }, [isAuthenticated, isAdmin, navigate, location]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email.trim()) {
      setError('Please enter your registered email address.');
      return;
    }
    if (!password) {
      setError('Please enter your password.');
      return;
    }

    try {
      setLoading(true);
      const user = await login(email.trim(), password);
      // Success redirection handled by useEffect or explicit navigate
      if (user.role === 'ROLE_ADMIN') {
        navigate('/admin/dashboard', { replace: true });
      } else {
        const dest = location.state?.from?.pathname || '/dashboard';
        navigate(dest, { replace: true });
      }
    } catch (err) {
      setError(err.message || 'Invalid email or password. Please check your credentials and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      maxWidth: '480px',
      margin: '2rem auto 4rem',
      padding: '0 1rem'
    }}>
      <div className="card" style={{
        padding: '2.5rem 2.2rem',
        borderRadius: '24px',
        boxShadow: 'var(--shadow-xl)',
        border: '1.5px solid rgba(46, 125, 50, 0.18)'
      }}>
        {/* Header with Icon */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%)',
            color: 'var(--primary-leaf)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1rem',
            boxShadow: '0 4px 12px rgba(46, 125, 50, 0.2)'
          }}>
            <UserCheck size={32} />
          </div>
          <h2 style={{ fontSize: '1.85rem', color: 'var(--primary-deep)', marginBottom: '0.4rem' }}>
            Farmer Sign In
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', margin: 0 }}>
            Access your personalized rain risk assessments and crop safeguards
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div style={{
            background: '#fef2f2',
            border: '1px solid #fecaca',
            color: '#b91c1c',
            borderRadius: '12px',
            padding: '0.85rem 1rem',
            marginBottom: '1.5rem',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '0.65rem',
            fontSize: '0.9rem'
          }}>
            <AlertCircle size={20} style={{ flexShrink: 0, marginTop: '2px' }} />
            <div>{error}</div>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="login-email">
              <Mail size={16} />
              <span>Email Address</span>
            </label>
            <input
              id="login-email"
              type="email"
              className="form-input"
              placeholder="e.g., farmer@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              required
            />
          </div>

          <div className="form-group" style={{ marginBottom: '1.85rem' }}>
            <label className="form-label" htmlFor="login-password">
              <Lock size={16} />
              <span>Password</span>
            </label>
            <input
              id="login-password"
              type="password"
              className="form-input"
              placeholder="Enter your account password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', padding: '0.85rem', fontSize: '1.02rem' }}
            disabled={loading}
          >
            {loading ? (
              <>
                <Sprout size={18} className="spin-slow" />
                <span>Signing In...</span>
              </>
            ) : (
              <>
                <LogIn size={18} />
                <span>Sign In to Dashboard</span>
              </>
            )}
          </button>
        </form>

        {/* Footer Navigation Links */}
        <div style={{
          marginTop: '2rem',
          paddingTop: '1.5rem',
          borderTop: '1px solid #eef3ef',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
          textAlign: 'center',
          fontSize: '0.92rem'
        }}>
          <div>
            <span style={{ color: 'var(--text-muted)' }}>Don't have an account yet? </span>
            <Link to="/signup" style={{ color: 'var(--primary-leaf)', fontWeight: 600 }}>
              Create New Account &rarr;
            </Link>
          </div>

          <div style={{
            background: '#f8faf8',
            padding: '0.75rem',
            borderRadius: '10px',
            border: '1px solid #e2ebe4'
          }}>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Are you a system administrator? </span>
            <Link to="/admin-login" style={{ color: 'var(--primary-forest)', fontWeight: 600, fontSize: '0.85rem' }}>
              Admin Portal &rarr;
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
