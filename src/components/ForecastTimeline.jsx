import React from 'react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { CloudRain } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function ForecastTimeline({ hourlyData }) {
  const { t } = useApp();
  if (!hourlyData || hourlyData.length === 0) return null;

  // Format data for Recharts
  const chartData = hourlyData.slice(0, 24).map(item => {
    let hourLabel = item.time;
    try {
      const d = new Date(item.time);
      hourLabel = d.toLocaleTimeString([], { hour: 'numeric', hour12: true });
    } catch {}

    return {
      hour: hourLabel,
      prob: item.precipitationProbability != null ? Math.round(item.precipitationProbability) : 0,
      rain: item.precipitation != null ? Number(item.precipitation.toFixed(1)) : 0,
      temp: item.temperature != null ? Math.round(item.temperature) : 0
    };
  });

  return (
    <div style={{ marginTop: '1.5rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
        <CloudRain size={20} color="#2563eb" />
        <h4 style={{ fontSize: '1.1rem', margin: 0 }}>
          {t('results.precipProb')} (24-Hour Horizon)
        </h4>
      </div>

      <div style={{ width: '100%', height: 220, background: '#f8fbf8', borderRadius: '14px', padding: '10px 10px 0 0' }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 10, right: 15, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="rainGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#2563eb" stopOpacity={0.4}/>
                <stop offset="95%" stopColor="#2563eb" stopOpacity={0.0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2ece4" vertical={false} />
            <XAxis dataKey="hour" tick={{ fontSize: 11, fill: '#4b6350' }} />
            <YAxis unit="%" domain={[0, 100]} tick={{ fontSize: 11, fill: '#4b6350' }} />
            <Tooltip
              formatter={(value, name) => [`${value}%`, 'Rain Probability']}
              contentStyle={{ borderRadius: '10px', border: '1px solid #d1ded3', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}
            />
            <Area
              type="monotone"
              dataKey="prob"
              stroke="#2563eb"
              strokeWidth={2.5}
              fillOpacity={1}
              fill="url(#rainGrad)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
