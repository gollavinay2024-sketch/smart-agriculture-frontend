import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid
} from 'recharts';
import {
  LayoutDashboard,
  CheckCircle2,
  AlertCircle,
  AlertTriangle,
  RotateCw,
  PlusCircle,
  Sprout,
  Calendar,
  MapPin,
  Clock
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import RiskBadge from '../components/RiskBadge';

const RISK_COLORS = {
  LOW: '#16a34a',
  MEDIUM: '#d97706',
  HIGH: '#dc2626'
};

export default function Dashboard() {
  const { t, setActiveResult } = useApp();
  const { user } = useAuth();
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await api.getDashboardSummary();
      setSummary(data);
    } catch (e) {
      console.warn('Could not load dashboard data:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const total = summary ? summary.totalAssessments : 0;
  const lowCount = summary ? summary.lowRiskCount : 0;
  const medCount = summary ? summary.mediumRiskCount : 0;
  const highCount = summary ? summary.highRiskCount : 0;

  // Pie chart data
  const riskPieData = [
    { name: 'Low Risk', value: lowCount, color: RISK_COLORS.LOW },
    { name: 'Medium Risk', value: medCount, color: RISK_COLORS.MEDIUM },
    { name: 'High Risk', value: highCount, color: RISK_COLORS.HIGH }
  ].filter(d => d.value > 0);

  // Bar chart data for crop distribution
  const cropBarData = summary && summary.cropDistribution
    ? Object.entries(summary.cropDistribution).map(([crop, count]) => ({ crop, count }))
    : [];

  return (
    <div>
      {/* Title & Refresh */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '2.1rem', margin: 0 }}>{t('dashboard.title')}</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.96rem', margin: '0.2rem 0 0' }}>
            {user ? `Farmer: ${user.fullName} (${user.email}) — ` : ''}{t('dashboard.subtitle')}
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button type="button" className="btn btn-secondary" onClick={loadData} disabled={loading} style={{ padding: '0.6rem 1rem' }}>
            <RotateCw size={16} className={loading ? 'spin' : ''} />
            <span>{t('history.refresh')}</span>
          </button>
          <Link to="/planner" className="btn btn-primary" style={{ padding: '0.6rem 1.15rem' }}>
            <PlusCircle size={18} />
            <span>{t('nav.planner')}</span>
          </Link>
        </div>
      </div>

      {/* Metric Stat Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem', marginBottom: '2rem' }}>
        <div className="card" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ width: '52px', height: '52px', borderRadius: '14px', background: '#e8f5e9', color: '#165b2d', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <LayoutDashboard size={28} />
          </div>
          <div>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>{t('dashboard.total')}</span>
            <h3 style={{ fontSize: '1.85rem', margin: 0, color: 'var(--primary-deep)' }}>{total}</h3>
          </div>
        </div>

        <div className="card" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ width: '52px', height: '52px', borderRadius: '14px', background: '#f0fdf4', color: '#15803d', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <CheckCircle2 size={28} />
          </div>
          <div>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>{t('dashboard.lowCount')}</span>
            <h3 style={{ fontSize: '1.85rem', margin: 0, color: '#15803d' }}>{lowCount}</h3>
          </div>
        </div>

        <div className="card" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ width: '52px', height: '52px', borderRadius: '14px', background: '#fffbeb', color: '#d97706', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <AlertCircle size={28} />
          </div>
          <div>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>{t('dashboard.medCount')}</span>
            <h3 style={{ fontSize: '1.85rem', margin: 0, color: '#d97706' }}>{medCount}</h3>
          </div>
        </div>

        <div className="card" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ width: '52px', height: '52px', borderRadius: '14px', background: '#fef2f2', color: '#dc2626', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <AlertTriangle size={28} />
          </div>
          <div>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>{t('dashboard.highCount')}</span>
            <h3 style={{ fontSize: '1.85rem', margin: 0, color: '#dc2626' }}>{highCount}</h3>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      {total > 0 ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '1.5rem', marginBottom: '2.5rem' }}>
          {/* Risk Pie Chart */}
          <div className="card" style={{ padding: '1.75rem' }}>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>{t('dashboard.trendChartTitle')}</h3>
            <div style={{ width: '100%', height: 260 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={riskPieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={95}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {riskPieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value, name) => [`${value} assessments`, name]} />
                  <Legend verticalAlign="bottom" height={36} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Crop Bar Chart */}
          <div className="card" style={{ padding: '1.75rem' }}>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>{t('dashboard.cropChartTitle')}</h3>
            <div style={{ width: '100%', height: 260 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={cropBarData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e8ede9" />
                  <XAxis dataKey="crop" tick={{ fontSize: 11 }} />
                  <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Bar dataKey="count" fill="#2e7d32" radius={[6, 6, 0, 0]} name="Assessments" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      ) : (
        <div className="card" style={{ padding: '3.5rem', textAlign: 'center', marginBottom: '2.5rem' }}>
          <Sprout size={48} color="#2e7d32" style={{ margin: '0 auto 1rem' }} />
          <h3 style={{ fontSize: '1.4rem', marginBottom: '0.5rem' }}>Welcome to the Risk Dashboard</h3>
          <p style={{ color: 'var(--text-muted)', maxWidth: '480px', margin: '0 auto 1.5rem' }}>
            {t('dashboard.noData')}
          </p>
          <Link to="/planner" className="btn btn-primary">
            <PlusCircle size={18} />
            <span>{t('hero.ctaPrimary')}</span>
          </Link>
        </div>
      )}

      {/* Recent Farmer Assessments */}
      {summary && summary.recentAssessments && summary.recentAssessments.length > 0 && (
        <div className="card" style={{ padding: '1.75rem' }}>
          <h3 style={{ fontSize: '1.3rem', marginBottom: '1.25rem' }}>{t('dashboard.recentTitle')}</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {summary.recentAssessments.map((item) => (
              <div
                key={item.id}
                style={{
                  background: '#f8faf8',
                  border: '1px solid #e2ebe4',
                  borderRadius: '12px',
                  padding: '1rem 1.25rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '1rem'
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                    <strong style={{ fontSize: '1.05rem', color: 'var(--primary-deep)' }}>{item.farmerName}</strong>
                    <span style={{ fontSize: '0.85rem', background: '#e8f5e9', color: '#165b2d', padding: '0.2rem 0.6rem', borderRadius: '6px', fontWeight: 600 }}>
                      {item.cropType}
                    </span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '0.35rem', flexWrap: 'wrap' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      <Calendar size={14} />
                      <span>{item.harvestDate}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      <Clock size={14} />
                      <span>{item.harvestTime}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      <MapPin size={14} />
                      <span>{item.locationName}</span>
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <RiskBadge riskLevel={item.riskLevel} />
                  <button
                    type="button"
                    className="btn btn-secondary"
                    style={{ padding: '0.45rem 0.85rem', fontSize: '0.82rem' }}
                    onClick={() => {
                      setActiveResult(item);
                      window.location.hash = '#/results';
                    }}
                  >
                    {t('history.tableActions')}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
