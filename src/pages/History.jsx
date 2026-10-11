import React, { useEffect, useState } from 'react';
import {
  RotateCw,
  Filter,
  Eye,
  Calendar,
  Clock,
  MapPin,
  X,
  Volume2,
  FileSpreadsheet,
  AlertCircle
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import RiskBadge from '../components/RiskBadge';
import VoiceAlertPlayer from '../components/VoiceAlertPlayer';
import WeatherCard from '../components/WeatherCard';
import { CROPS } from '../components/CropSelector';

export default function History() {
  const { t, setActiveResult } = useApp();
  const { user } = useAuth();
  const [assessments, setAssessments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCrop, setSelectedCrop] = useState('all');
  const [selectedRisk, setSelectedRisk] = useState('all');
  const [activeModalItem, setActiveModalItem] = useState(null);

  const loadAssessments = async () => {
    setLoading(true);
    try {
      const data = await api.getAssessments(selectedCrop, selectedRisk);
      setAssessments(data);
    } catch (e) {
      console.warn('Could not load history:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAssessments();
  }, [selectedCrop, selectedRisk]);

  return (
    <div>
      {/* Title */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.75rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '2.1rem', margin: 0 }}>{t('history.title')}</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.96rem', margin: '0.2rem 0 0' }}>
            {user ? `Private Log for ${user.fullName} — ` : ''}{t('history.subtitle')}
          </p>
        </div>

        <button
          type="button"
          className="btn btn-secondary"
          onClick={loadAssessments}
          disabled={loading}
          style={{ padding: '0.6rem 1rem' }}
        >
          <RotateCw size={16} className={loading ? 'spin' : ''} />
          <span>{t('history.refresh')}</span>
        </button>
      </div>

      {/* Filters Bar */}
      <div className="card" style={{ padding: '1.25rem 1.5rem', marginBottom: '1.75rem', display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary-leaf)', fontWeight: 600 }}>
          <Filter size={18} />
          <span>Filters:</span>
        </div>

        {/* Crop Filter */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>{t('history.filterCrop')}:</span>
          <select
            className="form-select"
            style={{ width: 'auto', padding: '0.45rem 0.85rem', fontSize: '0.88rem' }}
            value={selectedCrop}
            onChange={(e) => setSelectedCrop(e.target.value)}
          >
            <option value="all">{t('history.all')}</option>
            {CROPS.map(c => (
              <option key={c.id} value={c.id}>{t(c.key)}</option>
            ))}
          </select>
        </div>

        {/* Risk Filter */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>{t('history.filterRisk')}:</span>
          <select
            className="form-select"
            style={{ width: 'auto', padding: '0.45rem 0.85rem', fontSize: '0.88rem' }}
            value={selectedRisk}
            onChange={(e) => setSelectedRisk(e.target.value)}
          >
            <option value="all">{t('history.all')}</option>
            <option value="LOW">{t('risk.low')}</option>
            <option value="MEDIUM">{t('risk.medium')}</option>
            <option value="HIGH">{t('risk.high')}</option>
          </select>
        </div>
      </div>

      {/* Table / Cards */}
      {loading ? (
        <div className="card" style={{ padding: '3rem', textAlign: 'center' }}>
          <p style={{ color: 'var(--text-muted)' }}>{t('common.loading')}</p>
        </div>
      ) : assessments.length === 0 ? (
        <div className="card" style={{ padding: '3.5rem', textAlign: 'center' }}>
          <FileSpreadsheet size={44} color="#8fa893" style={{ margin: '0 auto 1rem' }} />
          <h3 style={{ fontSize: '1.3rem', marginBottom: '0.5rem' }}>{t('history.emptyHistory')}</h3>
          <p style={{ color: 'var(--text-muted)', maxWidth: '420px', margin: '0 auto' }}>
            No matching harvest risk records stored in database. Try clearing your filters or creating a new assessment.
          </p>
        </div>
      ) : (
        <div className="card" style={{ padding: '1.25rem' }}>
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>{t('history.tableDate')}</th>
                  <th>{t('history.tableFarmer')}</th>
                  <th>{t('history.tableCrop')}</th>
                  <th>{t('history.tableLocation')}</th>
                  <th>{t('history.tableRisk')}</th>
                  <th>{t('history.tablePrecip')}</th>
                  <th>{t('history.tableActions')}</th>
                </tr>
              </thead>
              <tbody>
                {assessments.map((item) => (
                  <tr key={item.id}>
                    <td>
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <span style={{ fontWeight: 600 }}>{item.harvestDate}</span>
                        <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{item.harvestTime}</span>
                      </div>
                    </td>
                    <td>
                      <strong>{item.farmerName}</strong>
                    </td>
                    <td>
                      <span style={{ background: '#f0fdf4', color: '#166534', padding: '0.2rem 0.6rem', borderRadius: '6px', fontSize: '0.85rem', fontWeight: 600 }}>
                        {item.cropType}
                      </span>
                    </td>
                    <td>{item.locationName}</td>
                    <td>
                      <RiskBadge riskLevel={item.riskLevel} />
                    </td>
                    <td>
                      <span>
                        {item.precipitationProbability != null ? `${Math.round(item.precipitationProbability)}%` : '--'} / {item.rainfallAmount != null ? `${item.rainfallAmount.toFixed(1)}mm` : '0mm'}
                      </span>
                    </td>
                    <td>
                      <button
                        type="button"
                        className="btn btn-secondary"
                        style={{ padding: '0.4rem 0.75rem', fontSize: '0.82rem' }}
                        onClick={() => setActiveModalItem(item)}
                      >
                        <Eye size={14} />
                        <span>{t('history.viewDetails')}</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {activeModalItem && (
        <div className="modal-overlay" onClick={() => setActiveModalItem(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              className="modal-close"
              onClick={() => setActiveModalItem(null)}
            >
              <X size={20} />
            </button>

            <div style={{ marginBottom: '1.25rem' }}>
              <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--primary-leaf)', textTransform: 'uppercase' }}>
                Historical Assessment #{activeModalItem.id}
              </span>
              <h2 style={{ fontSize: '1.75rem', margin: '0.2rem 0' }}>
                {activeModalItem.farmerName} — {activeModalItem.cropType}
              </h2>
              <div style={{ display: 'flex', gap: '1rem', color: 'var(--text-muted)', fontSize: '0.88rem', marginTop: '0.4rem', flexWrap: 'wrap' }}>
                <span>Date: {activeModalItem.harvestDate} {activeModalItem.harvestTime}</span>
                <span>Location: {activeModalItem.locationName}</span>
              </div>
            </div>

            <div style={{ margin: '1.25rem 0' }}>
              <RiskBadge riskLevel={activeModalItem.riskLevel} size="large" />
            </div>

            {activeModalItem.voiceAlertText && (
              <VoiceAlertPlayer alertText={activeModalItem.voiceAlertText} />
            )}

            <WeatherCard weather={{
              precipitationProbability: activeModalItem.precipitationProbability,
              rainfallAmount: activeModalItem.rainfallAmount,
              temperature: activeModalItem.temperature,
              relativeHumidity: activeModalItem.relativeHumidity,
              windSpeed: activeModalItem.windSpeed,
              weatherCondition: activeModalItem.weatherCondition
            }} />

            {activeModalItem.riskExplanation && (
              <div style={{ marginTop: '1.25rem', background: '#f8faf8', padding: '1.15rem', borderRadius: '12px', border: '1px solid #d9e6dc' }}>
                <h4 style={{ margin: '0 0 0.5rem', fontSize: '1.05rem' }}>Risk Explanation</h4>
                <p style={{ margin: 0, fontSize: '0.92rem', lineHeight: 1.5 }}>
                  {activeModalItem.riskExplanation}
                </p>
              </div>
            )}

            {activeModalItem.recommendations && (
              <div style={{ marginTop: '1.25rem' }}>
                <h4 style={{ margin: '0 0 0.5rem', fontSize: '1.05rem' }}>Protection Safeguards</h4>
                <p style={{ margin: 0, fontSize: '0.9rem', lineHeight: 1.5, color: 'var(--text-muted)' }}>
                  {activeModalItem.recommendations}
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
