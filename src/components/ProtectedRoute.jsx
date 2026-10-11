import React from 'react';
import { Navigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShieldAlert, RefreshCw, Sprout } from 'lucide-react';

export default function ProtectedRoute({ children, adminOnly = false }) {
  const { user, loading, isAuthenticated, isAdmin } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '60vh',
        gap: '1rem',
        color: 'var(--primary-forest)'
      }}>
        <div style={{
          width: '56px',
          height: '56px',
          borderRadius: '50%',
          background: 'var(--primary-subtle)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <Sprout size={32} className="spin-slow" style={{ color: 'var(--primary-leaf)' }} />
        </div>
        <div style={{ textAlign: 'center' }}>
          <h3 style={{ margin: '0 0 0.25rem', fontSize: '1.15rem' }}>Verifying Security Session</h3>
          <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Connecting with Smart Agriculture security vault...
          </p>
        </div>
      </div>
    );
  }

  // Not logged in
  if (!isAuthenticated) {
    const redirectTarget = adminOnly ? '/admin-login' : '/login';
    return <Navigate to={redirectTarget} state={{ from: location }} replace />;
  }

  // Admin required but user is not admin
  if (adminOnly && !isAdmin) {
    return (
      <div style={{
        maxWidth: '540px',
        margin: '4rem auto',
        padding: '2.5rem',
        background: '#ffffff',
        borderRadius: '20px',
        border: '1.5px solid #fee2e2',
        boxShadow: 'var(--shadow-lg)',
        textAlign: 'center'
      }}>
        <div style={{
          width: '64px',
          height: '64px',
          borderRadius: '50%',
          background: '#fef2f2',
          color: '#dc2626',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 1.25rem'
        }}>
          <ShieldAlert size={36} />
        </div>
        <h2 style={{ color: '#991b1b', marginBottom: '0.5rem', fontSize: '1.5rem' }}>
          403 — Administrator Access Required
        </h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '1.75rem', lineHeight: 1.6 }}>
          Your account (<strong>{user?.email}</strong>) has the <strong>ROLE_USER</strong> role. Access to the system control center and administrative management APIs is strictly restricted to verified Administrators.
        </p>
        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
          <Link to="/dashboard" className="btn btn-primary">
            Return to Farmer Dashboard
          </Link>
          <Link to="/" className="btn btn-secondary">
            Go to Home
          </Link>
        </div>
      </div>
    );
  }

  return children;
}
