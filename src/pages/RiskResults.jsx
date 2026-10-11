import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Calendar,
  Clock,
  MapPin,
  Printer,
  Share2,
  ArrowLeft,
  Info,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  ShieldAlert
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import RiskBadge from '../components/RiskBadge';
import WeatherCard from '../components/WeatherCard';
import VoiceAlertPlayer from '../components/VoiceAlertPlayer';
import ForecastTimeline from '../components/ForecastTimeline';
import { api } from '../services/api';

export default function RiskResults() {
  const { activeResult, t } = useApp();
  const navigate = useNavigate();
  const [hourlyForecast, setHourlyForecast] = useState([]);
  const [copiedShare, setCopiedShare] = useState(false);

  useEffect(() => {
    if (!activeResult) {
      navigate('/planner');
      return;
    }

    // Fetch hourly timeline if coordinates are present
    if (activeResult.latitude && activeResult.longitude) {
      api.getForecast(
        activeResult.latitude,
        activeResult.longitude,
        activeResult.harvestDate,
        activeResult.harvestTime
      ).then(fc => {
        if (fc && fc.hourlyForecast) {
          setHourlyForecast(fc.hourlyForecast);
        }
      }).catch(err => console.warn('Could not load hourly series:', err));
    }
  }, [activeResult, navigate]);

  if (!activeResult) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleShare = async () => {
    const text = `Harvest Rain Alert for ${activeResult.farmerName || 'Farmer'}:\nCrop: ${activeResult.cropType}\nRisk: ${activeResult.riskLevel} (${activeResult.riskScore || 0}/100)\nDate: ${activeResult.harvestDate}\nLocation: ${activeResult.locationName}\nWeather: ${activeResult.precipitationProbability || 0}% rain chance, ${activeResult.rainfallAmount || 0}mm.\nSmart Agriculture Rain Risk System.`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Harvest Rain Risk Assessment',
          text: text,
          url: window.location.href
        });
      } catch {}
    } else {
      await navigator.clipboard.writeText(text);
      setCopiedShare(true);
      setTimeout(() => setCopiedShare(false), 3000);
    }
  };

  const riskLevel = activeResult.riskLevel || 'UNKNOWN';

  return (
    <div style={{ maxWidth: '920px', margin: '0 auto' }}>
      {/* Top Bar Navigation */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <Link to="/planner" className="btn btn-secondary" style={{ padding: '0.55rem 1rem' }}>
          <ArrowLeft size={16} />
          <span>{t('results.checkAnother')}</span>
        </Link>

        <div style={{ display: 'flex', gap: '0.65rem' }}>
          <button type="button" className="btn btn-secondary" onClick={handlePrint} style={{ padding: '0.55rem 1rem' }}>
            <Printer size={16} />
            <span>{t('results.printReport')}</span>
          </button>
          <button type="button" className="btn btn-secondary" onClick={handleShare} style={{ padding: '0.55rem 1rem' }}>
            <Share2 size={16} />
            <span>{copiedShare ? t('common.copied') : t('results.shareReport')}</span>
          </button>
        </div>
      </div>

      {/* Main Results Container */}
      <div className="card" style={{ padding: '2.5rem', marginBottom: '2rem' }}>
        {/* Header Summary */}
        <div style={{ borderBottom: '1px solid var(--card-border)', paddingBottom: '1.75rem', marginBottom: '1.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--primary-leaf)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                {t('results.title')}
              </span>
              <h2 style={{ fontSize: '2.1rem', margin: '0.2rem 0' }}>
                {activeResult.farmerName || 'Farmer'} — {activeResult.cropType}
              </h2>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', color: 'var(--text-muted)', fontSize: '0.92rem', marginTop: '0.5rem', flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <Calendar size={16} />
                  <span>{activeResult.harvestDate}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <Clock size={16} />
                  <span>{activeResult.harvestTime}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <MapPin size={16} />
                  <span>{activeResult.locationName}</span>
                </div>
              </div>
            </div>

            <div style={{ textAlign: 'right' }}>
              <RiskBadge riskLevel={riskLevel} size="large" />
              {activeResult.riskScore != null && (
                <div style={{ marginTop: '0.4rem', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                  <strong>{t('risk.scoreLabel')}:</strong> {activeResult.riskScore} / 100
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Voice Alert Bar */}
        {activeResult.voiceAlertText && (
          <VoiceAlertPlayer alertText={activeResult.voiceAlertText} />
        )}

        {/* Weather Conditions Card */}
        <div>
          <h3 style={{ fontSize: '1.3rem', marginBottom: '0.5rem' }}>
            {t('results.weatherTitle')}
          </h3>
          <WeatherCard weather={{
            precipitationProbability: activeResult.precipitationProbability,
            rainfallAmount: activeResult.rainfallAmount,
            temperature: activeResult.temperature,
            relativeHumidity: activeResult.relativeHumidity,
            windSpeed: activeResult.windSpeed,
            weatherCondition: activeResult.weatherCondition
          }} />
        </div>

        {/* Hourly Forecast Chart */}
        {hourlyForecast.length > 0 && (
          <ForecastTimeline hourlyData={hourlyForecast} />
        )}

        {/* Explainability Factors */}
        <div style={{ marginTop: '2rem', background: '#f8faf8', border: '1px solid #d9e6dc', borderRadius: '16px', padding: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
            <Info size={20} color="#2e7d32" />
            <h4 style={{ fontSize: '1.15rem', margin: 0 }}>{t('results.factorsTitle')}</h4>
          </div>

          <p style={{ fontSize: '0.96rem', lineHeight: 1.6, marginBottom: '1rem', color: 'var(--text-dark)' }}>
            {activeResult.riskExplanation}
          </p>

          {activeResult.contributingFactors && activeResult.contributingFactors.length > 0 && (
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {activeResult.contributingFactors.map((factor, idx) => (
                <li key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                  <span style={{ color: 'var(--primary-leaf)', fontWeight: 'bold' }}>•</span>
                  <span>{factor}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Crop Protection Recommendations */}
        <div style={{ marginTop: '2.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
            <ShieldAlert size={22} color={riskLevel === 'HIGH' ? '#dc2626' : riskLevel === 'MEDIUM' ? '#d97706' : '#16a34a'} />
            <h3 style={{ fontSize: '1.3rem', margin: 0 }}>{t('results.recsTitle')}</h3>
          </div>

          <ul className="recs-list">
            {activeResult.recommendations && activeResult.recommendations.map((rec, idx) => (
              <li key={idx} className={`rec-item ${riskLevel.toLowerCase()}`}>
                <CheckCircle2 size={18} style={{ color: riskLevel === 'HIGH' ? '#dc2626' : riskLevel === 'MEDIUM' ? '#d97706' : '#16a34a', flexShrink: 0, marginTop: '2px' }} />
                <span>{rec}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Disclaimer Footer */}
        <div style={{ marginTop: '2rem', borderTop: '1px solid #edf2ee', paddingTop: '1.25rem', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
          {t('risk.scoreNotice')}
        </div>
      </div>
    </div>
  );
}
