import React, { useState } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import {
  Sprout,
  CloudRain,
  LayoutDashboard,
  History,
  Info,
  Menu,
  X,
  Globe,
  LogIn,
  LogOut,
  User,
  ShieldCheck,
  UserPlus
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { language, setLanguage, t } = useApp();
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const toggleMobile = () => setMobileMenuOpen(!mobileMenuOpen);
  const closeMobile = () => setMobileMenuOpen(false);

  const handleLogout = async () => {
    closeMobile();
    await logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <NavLink to="/" className="brand-link" onClick={closeMobile}>
          <div className="brand-icon-wrap">
            <Sprout size={26} strokeWidth={2.4} />
          </div>
          <div className="brand-text">
            <h1>{t('appTitle')}</h1>
            <p>{t('appSubtitle')}</p>
          </div>
        </NavLink>

        {/* Nav Links */}
        <ul className={`nav-menu ${mobileMenuOpen ? 'open' : ''}`}>
          <li>
            <NavLink to="/" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} onClick={closeMobile} end>
              <Sprout size={18} />
              <span>{t('nav.home')}</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/planner" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} onClick={closeMobile}>
              <CloudRain size={18} />
              <span>{t('nav.planner')}</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/dashboard" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} onClick={closeMobile}>
              <LayoutDashboard size={18} />
              <span>{t('nav.dashboard')}</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/history" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} onClick={closeMobile}>
              <History size={18} />
              <span>{t('nav.history')}</span>
            </NavLink>
          </li>

          {isAdmin && (
            <li>
              <NavLink to="/admin/dashboard" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} onClick={closeMobile} style={{ color: '#0e3d1d', fontWeight: 700 }}>
                <ShieldCheck size={18} color="#15803d" />
                <span>Admin Console</span>
              </NavLink>
            </li>
          )}

          <li>
            <NavLink to="/about" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} onClick={closeMobile}>
              <Info size={18} />
              <span>{t('nav.about')}</span>
            </NavLink>
          </li>
        </ul>

        {/* Action Controls & Language Switcher & Auth Controls */}
        <div className="nav-actions">
          {/* Language Switcher */}
          <div className="lang-selector" title="Change Language">
            <Globe size={15} style={{ marginLeft: '4px', color: '#2e7d32' }} />
            <button
              type="button"
              className={`lang-btn ${language === 'en' ? 'active' : ''}`}
              onClick={() => setLanguage('en')}
            >
              EN
            </button>
            <button
              type="button"
              className={`lang-btn ${language === 'te' ? 'active' : ''}`}
              onClick={() => setLanguage('te')}
            >
              తెలుగు
            </button>
            <button
              type="button"
              className={`lang-btn ${language === 'hi' ? 'active' : ''}`}
              onClick={() => setLanguage('hi')}
            >
              हिंदी
            </button>
          </div>

          {/* User Status / Login Buttons */}
          {isAuthenticated ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                background: isAdmin ? '#dcfce7' : '#f1f8f3',
                border: `1px solid ${isAdmin ? '#86efac' : '#d1ded3'}`,
                padding: '0.35rem 0.75rem',
                borderRadius: '999px',
                fontSize: '0.85rem',
                fontWeight: 600,
                color: 'var(--primary-deep)'
              }}>
                {isAdmin ? <ShieldCheck size={16} color="#15803d" /> : <User size={16} color="var(--primary-leaf)" />}
                <span style={{ maxWidth: '140px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {user?.fullName || user?.email}
                </span>
              </div>
              <button
                type="button"
                onClick={handleLogout}
                className="btn btn-secondary"
                style={{ padding: '0.45rem 0.85rem', fontSize: '0.85rem' }}
                title="Sign Out"
              >
                <LogOut size={15} />
                <span className="hide-mobile">Logout</span>
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Link
                to="/login"
                className="btn btn-secondary"
                style={{ padding: '0.45rem 0.85rem', fontSize: '0.85rem' }}
                onClick={closeMobile}
              >
                <LogIn size={15} />
                <span>Sign In</span>
              </Link>
              <Link
                to="/signup"
                className="btn btn-primary"
                style={{ padding: '0.45rem 0.85rem', fontSize: '0.85rem' }}
                onClick={closeMobile}
              >
                <UserPlus size={15} />
                <span className="hide-mobile">Register</span>
              </Link>
            </div>
          )}

          <button
            className="mobile-nav-toggle"
            onClick={toggleMobile}
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>
      </div>
    </nav>
  );
}
