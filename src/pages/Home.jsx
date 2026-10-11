import React from 'react';
import { Link } from 'react-router-dom';
import {
  CloudRain,
  ShieldCheck,
  Volume2,
  Sliders,
  ArrowRight,
  Sparkles,
  CheckCircle,
  AlertTriangle,
  LayoutDashboard,
  LogIn,
  UserPlus,
  ShieldAlert,
  UserCheck,
  KeyRound
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { CROPS } from '../components/CropSelector';

export default function Home() {
  const { t } = useApp();
  const { user, isAuthenticated, isAdmin } = useAuth();

  return (
    <div>
      {/* Hero Section */}
      <section className="hero">
        <div>
          <div className="hero-tag">
            <Sparkles size={16} />
            <span>{t('tagline')}</span>
          </div>
          <h2>{t('hero.title')}</h2>
          <p>{t('hero.subtitle')}</p>

          <div className="hero-actions">
            {isAuthenticated ? (
              <>
                <Link to="/planner" className="btn btn-accent btn-lg">
                  <span>{t('hero.ctaPrimary')}</span>
                  <ArrowRight size={20} />
                </Link>
                <Link
                  to={isAdmin ? "/admin/dashboard" : "/dashboard"}
                  className="btn btn-secondary btn-lg"
                  style={{ background: 'rgba(255,255,255,0.15)', color: '#ffffff', borderColor: 'rgba(255,255,255,0.3)' }}
                >
                  <LayoutDashboard size={20} />
                  <span>{isAdmin ? "Admin Console" : t('hero.ctaSecondary')}</span>
                </Link>
              </>
            ) : (
              <>
                <Link to="/login" className="btn btn-accent btn-lg">
                  <LogIn size={20} />
                  <span>Farmer Sign In</span>
                </Link>
                <Link
                  to="/signup"
                  className="btn btn-secondary btn-lg"
                  style={{ background: 'rgba(255,255,255,0.15)', color: '#ffffff', borderColor: 'rgba(255,255,255,0.3)' }}
                >
                  <UserPlus size={20} />
                  <span>New Farmer Signup</span>
                </Link>
              </>
            )}
          </div>
        </div>

        <div className="hero-graphic">
          <div className="hero-badge-card">
            <div className="hero-stat">
              <div className="hero-stat-icon">
                <CloudRain size={26} />
              </div>
              <div>
                <h4 style={{ color: '#ffffff', fontSize: '1.25rem', margin: 0 }}>Open-Meteo Ingestion</h4>
                <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '0.85rem', margin: '0.15rem 0 0' }}>
                  Hourly rainfall & prob up to 14 days
                </p>
              </div>
            </div>

            <div className="hero-stat">
              <div className="hero-stat-icon" style={{ color: '#86efac' }}>
                <ShieldCheck size={26} />
              </div>
              <div>
                <h4 style={{ color: '#ffffff', fontSize: '1.25rem', margin: 0 }}>Crop Protection</h4>
                <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '0.85rem', margin: '0.15rem 0 0' }}>
                  Rice, Wheat, Cotton, Maize, Veg & Pulses
                </p>
              </div>
            </div>

            <div className="hero-stat">
              <div className="hero-stat-icon" style={{ color: '#fef08a' }}>
                <Volume2 size={26} />
              </div>
              <div>
                <h4 style={{ color: '#ffffff', fontSize: '1.25rem', margin: 0 }}>Voice Alerts</h4>
                <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '0.85rem', margin: '0.15rem 0 0' }}>
                  English, తెలుగు & हिंदी audio
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* THREE AUTHENTICATION OPTIONS SECTION */}
      <section style={{ marginBottom: '3.5rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            background: 'var(--primary-subtle)',
            color: 'var(--primary-forest)',
            padding: '0.3rem 0.85rem',
            borderRadius: '999px',
            fontSize: '0.85rem',
            fontWeight: 700,
            marginBottom: '0.5rem'
          }}>
            <ShieldCheck size={16} />
            <span>Secure System Access</span>
          </div>
          <h2 style={{ fontSize: '2rem', margin: '0 0 0.5rem' }}>
            Choose Your Access Portal
          </h2>
          <p style={{ color: 'var(--text-muted)', maxWidth: '600px', margin: '0 auto', fontSize: '0.98rem' }}>
            Dedicated portals for registered farmers, new agricultural accounts, and system administrators.
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '1.5rem',
          maxWidth: '1100px',
          margin: '0 auto'
        }}>
          {/* Card 1: Farmer/User Login */}
          <div className="card" style={{
            padding: '2rem',
            borderRadius: '20px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            border: '2px solid rgba(46, 125, 50, 0.18)',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <div>
              <div style={{
                width: '54px',
                height: '54px',
                borderRadius: '16px',
                background: 'linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%)',
                color: 'var(--primary-forest)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1.25rem'
              }}>
                <LogIn size={28} />
              </div>
              <h3 style={{ fontSize: '1.4rem', marginBottom: '0.5rem', color: 'var(--primary-deep)' }}>
                1. Farmer Sign In
              </h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', lineHeight: 1.6, marginBottom: '1.5rem' }}>
                Existing users can access their saved harvest plans, precipitation evaluations, voice alerts, and personal risk history.
              </p>
            </div>
            <Link
              to="/login"
              className="btn btn-primary"
              style={{ width: '100%', justifyContent: 'space-between' }}
            >
              <span>Farmer Sign In</span>
              <ArrowRight size={18} />
            </Link>
          </div>

          {/* Card 2: New User Signup */}
          <div className="card" style={{
            padding: '2rem',
            borderRadius: '20px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            border: '2px solid #86efac',
            background: 'linear-gradient(180deg, #ffffff 0%, #f4fbf5 100%)',
            position: 'relative'
          }}>
            <div>
              <div style={{
                position: 'absolute',
                top: '16px',
                right: '16px',
                background: 'var(--primary-leaf)',
                color: '#ffffff',
                fontSize: '0.72rem',
                fontWeight: 700,
                padding: '0.2rem 0.6rem',
                borderRadius: '999px',
                textTransform: 'uppercase'
              }}>
                Free Registration
              </div>
              <div style={{
                width: '54px',
                height: '54px',
                borderRadius: '16px',
                background: 'linear-gradient(135deg, #dcfce7 0%, #86efac 100%)',
                color: '#15803d',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1.25rem'
              }}>
                <UserPlus size={28} />
              </div>
              <h3 style={{ fontSize: '1.4rem', marginBottom: '0.5rem', color: 'var(--primary-deep)' }}>
                2. New Farmer Signup
              </h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', lineHeight: 1.6, marginBottom: '1.5rem' }}>
                Register a new agricultural account with your name, email, preferred language, and secure password.
              </p>
            </div>
            <Link
              to="/signup"
              className="btn btn-accent"
              style={{ width: '100%', justifyContent: 'space-between' }}
            >
              <span>Create Account</span>
              <ArrowRight size={18} />
            </Link>
          </div>

          {/* Card 3: Admin Login */}
          <div className="card" style={{
            padding: '2rem',
            borderRadius: '20px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            border: '2px solid rgba(14, 61, 29, 0.25)',
            background: '#ffffff'
          }}>
            <div>
              <div style={{
                width: '54px',
                height: '54px',
                borderRadius: '16px',
                background: 'linear-gradient(135deg, #0e3d1d 0%, #165b2d 100%)',
                color: '#86efac',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1.25rem'
              }}>
                <KeyRound size={28} />
              </div>
              <h3 style={{ fontSize: '1.4rem', marginBottom: '0.5rem', color: 'var(--primary-deep)' }}>
                3. Admin Portal
              </h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', lineHeight: 1.6, marginBottom: '1.5rem' }}>
                Restricted portal for system administrators to review aggregated analytics, user registries, and system health.
              </p>
            </div>
            <Link
              to="/admin-login"
              className="btn"
              style={{
                width: '100%',
                justifyContent: 'space-between',
                background: '#0e3d1d',
                color: '#ffffff'
              }}
            >
              <span>Admin Sign In</span>
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* Feature Cards Grid */}
      <section style={{ marginBottom: '3rem' }}>
        <h2 style={{ fontSize: '1.85rem', marginBottom: '0.5rem', textAlign: 'center' }}>
          Why Farmers Rely on This System
        </h2>
        <p style={{ color: 'var(--text-muted)', textAlign: 'center', maxWidth: '640px', margin: '0 auto 2rem' }}>
          Avoid devastating harvest losses from unexpected monsoon showers, squalls, or moisture accumulation.
        </p>

        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon-wrap">
              <CloudRain size={28} />
            </div>
            <h3>{t('features.f1Title')}</h3>
            <p>{t('features.f1Desc')}</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon-wrap" style={{ background: '#fef3c7', color: '#d97706' }}>
              <ShieldCheck size={28} />
            </div>
            <h3>{t('features.f2Title')}</h3>
            <p>{t('features.f2Desc')}</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon-wrap" style={{ background: '#e0f2fe', color: '#0284c7' }}>
              <Volume2 size={28} />
            </div>
            <h3>{t('features.f3Title')}</h3>
            <p>{t('features.f3Desc')}</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon-wrap" style={{ background: '#f3e8ff', color: '#7e22ce' }}>
              <Sliders size={28} />
            </div>
            <h3>{t('features.f4Title')}</h3>
            <p>{t('features.f4Desc')}</p>
          </div>
        </div>
      </section>

      {/* Supported Crops Preview */}
      <section className="card" style={{ marginBottom: '3rem', textAlign: 'center' }}>
        <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Supported Major Crops</h3>
        <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
          Agronomic guidelines tailored to the physical moisture vulnerabilities of each harvest.
        </p>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
          gap: '1rem',
          maxWidth: '900px',
          margin: '0 auto'
        }}>
          {CROPS.map(c => {
            const Icon = c.icon;
            return (
              <div
                key={c.id}
                style={{
                  background: '#f7faf7',
                  border: '1px solid #d9e6dc',
                  borderRadius: '14px',
                  padding: '1.25rem 0.75rem',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}
              >
                <div style={{
                  width: '46px',
                  height: '46px',
                  borderRadius: '50%',
                  background: c.color,
                  color: '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Icon size={24} />
                </div>
                <strong style={{ fontSize: '0.92rem', color: 'var(--primary-deep)' }}>{t(c.key)}</strong>
              </div>
            );
          })}
        </div>
      </section>

      {/* Transparent Disclaimer */}
      <div style={{
        background: '#fffbeb',
        border: '1px solid #fde68a',
        borderRadius: '16px',
        padding: '1.25rem 1.5rem',
        display: 'flex',
        alignItems: 'flex-start',
        gap: '1rem',
        color: '#92400e'
      }}>
        <AlertTriangle size={24} style={{ flexShrink: 0, marginTop: '2px' }} />
        <div>
          <h4 style={{ color: '#b45309', margin: '0 0 0.25rem', fontSize: '0.98rem' }}>Agricultural Advisory Disclaimer</h4>
          <p style={{ fontSize: '0.88rem', margin: 0, lineHeight: 1.5 }}>
            {t('hero.disclaimer')}
          </p>
        </div>
      </div>
    </div>
  );
}
