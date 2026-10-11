import React from 'react';
import {
  Info,
  MapPin,
  CloudRain,
  Cpu,
  ShieldCheck,
  AlertTriangle,
  Server,
  Layers,
  Sparkles,
  BookOpen
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function About() {
  const { t } = useApp();

  return (
    <div style={{ maxWidth: '880px', margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
        <h2 style={{ fontSize: '2.25rem', marginBottom: '0.5rem' }}>{t('about.title')}</h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem' }}>{t('about.subtitle')}</p>
      </div>

      {/* 4-Step Architecture Workflow */}
      <section className="card" style={{ padding: '2.25rem', marginBottom: '2rem' }}>
        <h3 style={{ fontSize: '1.4rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <Sparkles size={22} color="#2e7d32" />
          <span>{t('about.workflowTitle')}</span>
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.5rem' }}>
          <div style={{ background: '#f8faf8', border: '1px solid #d9e6dc', borderRadius: '14px', padding: '1.25rem' }}>
            <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: '#e8f5e9', color: '#165b2d', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '0.75rem' }}>
              <MapPin size={22} />
            </div>
            <h4 style={{ fontSize: '1.1rem', margin: '0 0 0.35rem' }}>{t('about.step1')}</h4>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', margin: 0, lineHeight: 1.5 }}>
              {t('about.step1Desc')}
            </p>
          </div>

          <div style={{ background: '#f8faf8', border: '1px solid #d9e6dc', borderRadius: '14px', padding: '1.25rem' }}>
            <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: '#e0f2fe', color: '#0284c7', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '0.75rem' }}>
              <CloudRain size={22} />
            </div>
            <h4 style={{ fontSize: '1.1rem', margin: '0 0 0.35rem' }}>{t('about.step2')}</h4>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', margin: 0, lineHeight: 1.5 }}>
              {t('about.step2Desc')}
            </p>
          </div>

          <div style={{ background: '#f8faf8', border: '1px solid #d9e6dc', borderRadius: '14px', padding: '1.25rem' }}>
            <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: '#fef3c7', color: '#d97706', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '0.75rem' }}>
              <Cpu size={22} />
            </div>
            <h4 style={{ fontSize: '1.1rem', margin: '0 0 0.35rem' }}>{t('about.step3')}</h4>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', margin: 0, lineHeight: 1.5 }}>
              {t('about.step3Desc')}
            </p>
          </div>

          <div style={{ background: '#f8faf8', border: '1px solid #d9e6dc', borderRadius: '14px', padding: '1.25rem' }}>
            <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: '#f3e8ff', color: '#7e22ce', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '0.75rem' }}>
              <ShieldCheck size={22} />
            </div>
            <h4 style={{ fontSize: '1.1rem', margin: '0 0 0.35rem' }}>{t('about.step4')}</h4>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', margin: 0, lineHeight: 1.5 }}>
              {t('about.step4Desc')}
            </p>
          </div>
        </div>
      </section>

      {/* Transparent Decision Thresholds */}
      <section className="card" style={{ padding: '2.25rem', marginBottom: '2rem' }}>
        <h3 style={{ fontSize: '1.4rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <BookOpen size={22} color="#2e7d32" />
          <span>Configurable Rain Risk Decision Rules</span>
        </h3>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.94rem', marginBottom: '1.5rem', lineHeight: 1.5 }}>
          The rule-based engine evaluates real-time meteorological variables to classify risk into three transparent categories:
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ borderLeft: '4px solid #dc2626', background: '#fef2f2', padding: '1rem 1.25rem', borderRadius: '10px' }}>
            <h4 style={{ color: '#dc2626', margin: '0 0 0.25rem', fontSize: '1.05rem' }}>HIGH RISK THRESHOLD (≥70% probability OR ≥5.0 mm rain)</h4>
            <p style={{ margin: 0, fontSize: '0.9rem', color: '#7f1d1d' }}>
              Indicates heavy or sustained rain hazard. Significant risk of grain lodging, seed shattering, mold growth, or soil waterlogging. Advised action: postpone harvest or secure immediate tarpaulins and drying storage.
            </p>
          </div>

          <div style={{ borderLeft: '4px solid #d97706', background: '#fffbeb', padding: '1rem 1.25rem', borderRadius: '10px' }}>
            <h4 style={{ color: '#d97706', margin: '0 0 0.25rem', fontSize: '1.05rem' }}>MEDIUM RISK THRESHOLD (40%–69% probability OR 1.5–4.9 mm rain)</h4>
            <p style={{ margin: 0, fontSize: '0.9rem', color: '#78350f' }}>
              Indicates moderate chance of localized shower activity or high humidity. Advised action: harvest in phases, keep protective sheets ready on the field border, and monitor updated 6-hour radar scans.
            </p>
          </div>

          <div style={{ borderLeft: '4px solid #16a34a', background: '#f0fdf4', padding: '1rem 1.25rem', borderRadius: '10px' }}>
            <h4 style={{ color: '#16a34a', margin: '0 0 0.25rem', fontSize: '1.05rem' }}>LOW RISK THRESHOLD (&lt;40% probability AND &lt;1.5 mm rain)</h4>
            <p style={{ margin: 0, fontSize: '0.9rem', color: '#14532d' }}>
              Atmospheric models indicate favorable harvesting conditions with minimal rain likelihood. Advised action: proceed with planned harvest while observing standard daytime weather.
            </p>
          </div>
        </div>
      </section>

      {/* Limitations Disclaimer */}
      <section className="card" style={{ padding: '2.25rem', background: '#fffbeb', borderColor: '#fde68a' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
          <AlertTriangle size={24} color="#b45309" />
          <h3 style={{ fontSize: '1.3rem', color: '#92400e', margin: 0 }}>{t('about.disclaimerTitle')}</h3>
        </div>

        <ul style={{ listStyle: 'disc', paddingLeft: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem', color: '#78350f', fontSize: '0.92rem', lineHeight: 1.5 }}>
          <li>{t('about.disclaimer1')}</li>
          <li>{t('about.disclaimer2')}</li>
          <li>{t('about.disclaimer3')}</li>
          <li>
            <strong>14-Day Horizon:</strong> The system enforces a hard 14-day limit because atmospheric numerical models cannot resolve individual precipitation events beyond two weeks. Long-range seasonal forecasts must not be used for single-day harvest timing.
          </li>
        </ul>
      </section>
    </div>
  );
}
