import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import {
  ShieldAlert,
  ShieldCheck,
  Lock,
  Mail,
  User,
  LogIn,
  KeyRound,
  AlertCircle,
  CheckCircle2,
  Sprout,
  ArrowRight,
  Info
} from 'lucide-react';

export default function AdminLogin() {
  const { login, user, isAuthenticated, isAdmin } = useAuth();
  const navigate = useNavigate();

  // Mode: 'login' | 'setup'
  const [mode, setMode] = useState('login');

  // Login form state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Initial admin setup state
  const [setupData, setSetupData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [setupLoading, setSetupLoading] = useState(false);
  const [setupError, setSetupError] = useState('');
  const [setupSuccess, setSetupSuccess] = useState('');

  // Redirect if already authenticated as admin
  useEffect(() => {
    if (isAuthenticated) {
      if (isAdmin) {
        navigate('/admin/dashboard', { replace: true });
      } else {
        setError('Your current session is logged in as a regular Farmer (ROLE_USER). You must log in with an Administrator account to access the Control Center.');
      }
    }
  }, [isAuthenticated, isAdmin, navigate]);

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email.trim() || !password) {
      setError('Please provide administrator email and password.');
      return;
    }

    try {
      setLoading(true);
      const authenticatedUser = await login(email.trim(), password);
      if (authenticatedUser.role === 'ROLE_ADMIN') {
        navigate('/admin/dashboard', { replace: true });
      } else {
        setError('Access Denied: The account entered does not have ROLE_ADMIN privileges.');
      }
    } catch (err) {
      setError(err.message || 'Invalid administrator credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleSetupSubmit = async (e) => {
    e.preventDefault();
    setSetupError('');
    setSetupSuccess('');

    if (!setupData.fullName.trim()) {
      setSetupError('Full name is required.');
      return;
    }
    if (!setupData.email.trim()) {
      setSetupError('Administrator email is required.');
      return;
    }
    if (setupData.password.length < 8) {
      setSetupError('Administrator password must be at least 8 characters long.');
      return;
    }
    if (setupData.password !== setupData.confirmPassword) {
      setSetupError('Passwords do not match.');
      return;
    }

    try {
      setSetupLoading(true);
      const res = await api.setupAdmin({
        fullName: setupData.fullName.trim(),
        email: setupData.email.trim().toLowerCase(),
        password: setupData.password
      });

      setSetupSuccess(res.message || 'Initial administrator provisioned successfully. You can now log in.');
      setEmail(setupData.email.trim().toLowerCase());
      setPassword('');
      setMode('login');
    } catch (err) {
      setSetupError(err.message || 'Setup failed. If an administrator already exists, setup is permanently locked.');
    } finally {
      setSetupLoading(false);
    }
  };

  return (
    <div style={{
      maxWidth: '520px',
      margin: '2rem auto 4rem',
      padding: '0 1rem'
    }}>
      <div className="card" style={{
        padding: '2.5rem 2.2rem',
        borderRadius: '24px',
        boxShadow: 'var(--shadow-xl)',
        border: '1.5px solid rgba(22, 91, 45, 0.25)',
        background: '#ffffff'
      }}>
        {/* Admin Badge Header */}
        <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #0e3d1d 0%, #165b2d 100%)',
            color: '#86efac',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1rem',
            boxShadow: '0 6px 16px rgba(14, 61, 29, 0.3)'
          }}>
            <ShieldCheck size={36} />
          </div>
          <div style={{
            display: 'inline-block',
            background: '#f0fdf4',
            color: 'var(--primary-forest)',
            padding: '0.2rem 0.75rem',
            borderRadius: '999px',
            fontSize: '0.8rem',
            fontWeight: 700,
            letterSpacing: '0.05em',
            textTransform: 'uppercase',
            marginBottom: '0.5rem',
            border: '1px solid #bbf7d0'
          }}>
            Restricted System Area
          </div>
          <h2 style={{ fontSize: '1.85rem', color: 'var(--primary-deep)', margin: '0 0 0.4rem' }}>
            {mode === 'login' ? 'System Administrator Sign In' : 'One-Time Admin Provisioning'}
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', margin: 0 }}>
            {mode === 'login'
              ? 'Enter verified administrator credentials to access platform oversight'
              : 'Create the primary root administrator account for this instance'}
          </p>
        </div>

        {/* Success Alert */}
        {setupSuccess && (
          <div style={{
            background: '#f0fdf4',
            border: '1.5px solid #86efac',
            color: '#166534',
            borderRadius: '12px',
            padding: '0.85rem 1rem',
            marginBottom: '1.5rem',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '0.65rem',
            fontSize: '0.9rem'
          }}>
            <CheckCircle2 size={20} style={{ flexShrink: 0, marginTop: '2px', color: '#16a34a' }} />
            <div>{setupSuccess}</div>
          </div>
        )}

        {/* Error Alert */}
        {error && mode === 'login' && (
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

        {setupError && mode === 'setup' && (
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
            <div>{setupError}</div>
          </div>
        )}

        {/* Mode: LOGIN */}
        {mode === 'login' ? (
          <form onSubmit={handleLoginSubmit}>
            <div className="form-group">
              <label className="form-label" htmlFor="admin-email">
                <Mail size={16} />
                <span>Admin Email Address</span>
              </label>
              <input
                id="admin-email"
                type="email"
                className="form-input"
                placeholder="e.g., admin@smartagri.org"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                required
              />
            </div>

            <div className="form-group" style={{ marginBottom: '1.85rem' }}>
              <label className="form-label" htmlFor="admin-password">
                <Lock size={16} />
                <span>Admin Password</span>
              </label>
              <input
                id="admin-password"
                type="password"
                className="form-input"
                placeholder="Enter administrator password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                required
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              style={{
                width: '100%',
                padding: '0.85rem',
                fontSize: '1.02rem',
                background: 'linear-gradient(135deg, #0e3d1d 0%, #165b2d 100%)'
              }}
              disabled={loading}
            >
              {loading ? (
                <>
                  <Sprout size={18} className="spin-slow" />
                  <span>Authenticating Admin...</span>
                </>
              ) : (
                <>
                  <KeyRound size={18} />
                  <span>Access Admin Control Center</span>
                </>
              )}
            </button>
          </form>
        ) : (
          /* Mode: SETUP (One-Time Initial Administrator Provisioning) */
          <form onSubmit={handleSetupSubmit}>
            <div style={{
              background: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: '12px',
              padding: '0.85rem 1rem',
              marginBottom: '1.25rem',
              fontSize: '0.85rem',
              color: '#475569',
              display: 'flex',
              gap: '0.5rem',
              alignItems: 'flex-start'
            }}>
              <Info size={18} style={{ color: '#0284c7', flexShrink: 0, marginTop: '2px' }} />
              <div>
                <strong>Secure One-Time Bootstrap:</strong> This form creates the first administrator with <code>ROLE_ADMIN</code>. The backend permanently locks this endpoint as soon as an admin account exists.
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="setup-name">
                <User size={16} />
                <span>Admin Full Name</span>
              </label>
              <input
                id="setup-name"
                type="text"
                className="form-input"
                placeholder="e.g., Lead Agronomist"
                value={setupData.fullName}
                onChange={(e) => setSetupData(prev => ({ ...prev, fullName: e.target.value }))}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="setup-email">
                <Mail size={16} />
                <span>Admin Email Address</span>
              </label>
              <input
                id="setup-email"
                type="email"
                className="form-input"
                placeholder="e.g., admin@smartagri.org"
                value={setupData.email}
                onChange={(e) => setSetupData(prev => ({ ...prev, email: e.target.value }))}
                required
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.75rem' }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label" htmlFor="setup-password">
                  <Lock size={16} />
                  <span>Password</span>
                </label>
                <input
                  id="setup-password"
                  type="password"
                  className="form-input"
                  placeholder="Min 8 characters"
                  value={setupData.password}
                  onChange={(e) => setSetupData(prev => ({ ...prev, password: e.target.value }))}
                  required
                />
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label" htmlFor="setup-confirm">
                  <Lock size={16} />
                  <span>Confirm Password</span>
                </label>
                <input
                  id="setup-confirm"
                  type="password"
                  className="form-input"
                  placeholder="Repeat password"
                  value={setupData.confirmPassword}
                  onChange={(e) => setSetupData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              style={{
                width: '100%',
                padding: '0.85rem',
                fontSize: '1.02rem',
                background: 'linear-gradient(135deg, #0e3d1d 0%, #165b2d 100%)'
              }}
              disabled={setupLoading}
            >
              {setupLoading ? (
                <>
                  <Sprout size={18} className="spin-slow" />
                  <span>Provisioning Administrator...</span>
                </>
              ) : (
                <>
                  <ShieldCheck size={18} />
                  <span>Create Initial Administrator</span>
                </>
              )}
            </button>
          </form>
        )}

        {/* Toggle between Login and Setup */}
        <div style={{
          marginTop: '1.75rem',
          paddingTop: '1.25rem',
          borderTop: '1px solid #eef3ef',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.85rem',
          textAlign: 'center',
          fontSize: '0.88rem'
        }}>
          {mode === 'login' ? (
            <div>
              <span style={{ color: 'var(--text-muted)' }}>First time setting up the system? </span>
              <button
                type="button"
                onClick={() => { setMode('setup'); setError(''); }}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--primary-leaf)',
                  fontWeight: 600,
                  cursor: 'pointer',
                  textDecoration: 'underline',
                  padding: 0,
                  fontFamily: 'inherit',
                  fontSize: 'inherit'
                }}
              >
                Create Initial Administrator Account
              </button>
            </div>
          ) : (
            <div>
              <span style={{ color: 'var(--text-muted)' }}>Already have an administrator account? </span>
              <button
                type="button"
                onClick={() => { setMode('login'); setSetupError(''); }}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--primary-leaf)',
                  fontWeight: 600,
                  cursor: 'pointer',
                  textDecoration: 'underline',
                  padding: 0,
                  fontFamily: 'inherit',
                  fontSize: 'inherit'
                }}
              >
                Back to Admin Sign In
              </button>
            </div>
          )}

          <div>
            <Link to="/login" style={{ color: 'var(--text-muted)' }}>
              &larr; Return to Farmer Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
