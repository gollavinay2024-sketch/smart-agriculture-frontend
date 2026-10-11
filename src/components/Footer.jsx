import React from 'react';
import { Link } from 'react-router-dom';
import { Sprout, ShieldCheck, Heart, ExternalLink } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function Footer() {
  const { t } = useApp();

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-top">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            <div style={{
              background: '#2e7d32',
              color: '#fff',
              width: '38px',
              height: '38px',
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Sprout size={22} />
            </div>
            <div>
              <h3 style={{ color: '#ffffff', fontSize: '1.15rem' }}>{t('appTitle')}</h3>
              <p style={{ color: '#8fa893', fontSize: '0.82rem' }}>{t('appSubtitle')}</p>
            </div>
          </div>

          <div className="footer-links">
            <Link to="/">{t('nav.home')}</Link>
            <Link to="/planner">{t('nav.planner')}</Link>
            <Link to="/dashboard">{t('nav.dashboard')}</Link>
            <Link to="/history">{t('nav.history')}</Link>
            <Link to="/about">{t('nav.about')}</Link>
          </div>
        </div>

        <div className="footer-bottom">
          <p>{t('common.footerText')} — {t('common.allRights')}</p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <ShieldCheck size={16} color="#86efac" />
            <span>Open-Meteo API Real-Time Forecast Integration</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
