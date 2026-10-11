import React from 'react';
import { CloudRain, Droplets, Thermometer, Wind, CloudSun } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function WeatherCard({ weather }) {
  const { t } = useApp();
  if (!weather) return null;

  const {
    precipitationProbability,
    rainfallAmount,
    temperature,
    relativeHumidity,
    windSpeed,
    weatherCondition
  } = weather;

  return (
    <div className="metrics-grid">
      <div className="metric-tile">
        <div className="metric-header">
          <CloudRain size={18} color="#2563eb" />
          <span>{t('results.precipProb')}</span>
        </div>
        <div className="metric-value">
          {precipitationProbability != null ? `${Math.round(precipitationProbability)}%` : '--'}
        </div>
      </div>

      <div className="metric-tile">
        <div className="metric-header">
          <Droplets size={18} color="#0284c7" />
          <span>{t('results.rainAmount')}</span>
        </div>
        <div className="metric-value">
          {rainfallAmount != null ? `${rainfallAmount.toFixed(1)} mm` : '0.0 mm'}
        </div>
      </div>

      <div className="metric-tile">
        <div className="metric-header">
          <Thermometer size={18} color="#ea580c" />
          <span>{t('results.temperature')}</span>
        </div>
        <div className="metric-value">
          {temperature != null ? `${Math.round(temperature)}°C` : '--'}
        </div>
      </div>

      <div className="metric-tile">
        <div className="metric-header">
          <Droplets size={18} color="#059669" />
          <span>{t('results.humidity')}</span>
        </div>
        <div className="metric-value">
          {relativeHumidity != null ? `${Math.round(relativeHumidity)}%` : '--'}
        </div>
      </div>

      <div className="metric-tile">
        <div className="metric-header">
          <Wind size={18} color="#4b5563" />
          <span>{t('results.windSpeed')}</span>
        </div>
        <div className="metric-value">
          {windSpeed != null ? `${windSpeed.toFixed(1)} km/h` : '--'}
        </div>
      </div>

      {weatherCondition && (
        <div className="metric-tile">
          <div className="metric-header">
            <CloudSun size={18} color="#ca8a04" />
            <span>{t('results.condition')}</span>
          </div>
          <div className="metric-value" style={{ fontSize: '1.15rem', marginTop: '0.2rem' }}>
            {weatherCondition}
          </div>
        </div>
      )}
    </div>
  );
}
