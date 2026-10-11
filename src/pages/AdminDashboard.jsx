import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import {
  ShieldCheck,
  Users,
  FileSpreadsheet,
  AlertTriangle,
  CheckCircle,
  HelpCircle,
  LogOut,
  RefreshCw,
  Search,
  Calendar,
  Phone,
  Mail,
  User,
  ExternalLink,
  Filter
} from 'lucide-react';

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [stats, setStats] = useState(null);
  const [usersList, setUsersList] = useState([]);
  const [assessmentsList, setAssessmentsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'users' | 'assessments'
  const [userSearch, setUserSearch] = useState('');

  const loadData = async () => {
    try {
      setLoading(true);
      setError('');
      const [dashData, usersData, assessData] = await Promise.all([
        api.getAdminDashboard(),
        api.getAdminUsers(),
        api.getAdminAssessments()
      ]);
      setStats(dashData);
      setUsersList(usersData || []);
      setAssessmentsList(assessData || []);
    } catch (err) {
      setError(err.message || 'Failed to retrieve administrative data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate('/admin-login', { replace: true });
  };

  const filteredUsers = usersList.filter(u => {
    if (!userSearch) return true;
    const q = userSearch.toLowerCase();
    return (
      (u.fullName && u.fullName.toLowerCase().includes(q)) ||
      (u.email && u.email.toLowerCase().includes(q)) ||
      (u.phoneNumber && u.phoneNumber.includes(q)) ||
      (u.role && u.role.toLowerCase().includes(q))
    );
  });

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', paddingBottom: '3rem' }}>
      {/* Admin Top Header Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #0e3d1d 0%, #165b2d 60%, #2e7d32 100%)',
        color: '#ffffff',
        borderRadius: '20px',
        padding: '2rem 2.5rem',
        marginBottom: '2rem',
        boxShadow: 'var(--shadow-lg)',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '1.5rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <div style={{
            width: '56px',
            height: '56px',
            borderRadius: '16px',
            background: 'rgba(255, 255, 255, 0.15)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#86efac'
          }}>
            <ShieldCheck size={32} />
          </div>
          <div>
            <div style={{
              display: 'inline-block',
              background: 'rgba(134, 239, 172, 0.2)',
              color: '#86efac',
              padding: '0.15rem 0.6rem',
              borderRadius: '999px',
              fontSize: '0.75rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              marginBottom: '0.25rem'
            }}>
              ROLE_ADMIN Verified
            </div>
            <h1 style={{ color: '#ffffff', fontSize: '1.85rem', margin: 0, fontWeight: 700 }}>
              System Administration Console
            </h1>
            <p style={{ color: 'rgba(255, 255, 255, 0.85)', fontSize: '0.92rem', margin: '0.2rem 0 0' }}>
              Connected Administrator: <strong>{user?.fullName || user?.email}</strong> ({user?.email})
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <button
            type="button"
            className="btn"
            onClick={loadData}
            style={{
              background: 'rgba(255, 255, 255, 0.15)',
              color: '#ffffff',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              padding: '0.65rem 1.1rem'
            }}
            disabled={loading}
          >
            <RefreshCw size={16} className={loading ? 'spin-slow' : ''} />
            <span>Refresh</span>
          </button>

          <button
            type="button"
            className="btn"
            onClick={handleLogout}
            style={{
              background: '#dc2626',
              color: '#ffffff',
              border: 'none',
              padding: '0.65rem 1.2rem',
              boxShadow: '0 4px 12px rgba(220, 38, 38, 0.3)'
            }}
          >
            <LogOut size={16} />
            <span>Admin Sign Out</span>
          </button>
        </div>
      </div>

      {error && (
        <div style={{
          background: '#fef2f2',
          border: '1px solid #fecaca',
          color: '#b91c1c',
          borderRadius: '12px',
          padding: '1rem',
          marginBottom: '1.5rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem'
        }}>
          <AlertTriangle size={20} />
          <div>{error}</div>
        </div>
      )}

      {/* Metric Cards Row */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '1.25rem',
        marginBottom: '2rem'
      }}>
        {/* Total Users */}
        <div className="card" style={{ padding: '1.5rem', borderRadius: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)' }}>Registered Users</span>
            <div style={{
              width: '38px',
              height: '38px',
              borderRadius: '10px',
              background: 'var(--primary-subtle)',
              color: 'var(--primary-leaf)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Users size={20} />
            </div>
          </div>
          <div style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--primary-deep)', fontFamily: 'Outfit' }}>
            {stats ? stats.totalUsers : (loading ? '...' : 0)}
          </div>
          <p style={{ margin: '0.25rem 0 0', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            Farmers & Agronomists in DB
          </p>
        </div>

        {/* Total Assessments */}
        <div className="card" style={{ padding: '1.5rem', borderRadius: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)' }}>Total Assessments</span>
            <div style={{
              width: '38px',
              height: '38px',
              borderRadius: '10px',
              background: '#e0f2fe',
              color: '#0284c7',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <FileSpreadsheet size={20} />
            </div>
          </div>
          <div style={{ fontSize: '2.2rem', fontWeight: 800, color: '#0369a1', fontFamily: 'Outfit' }}>
            {stats ? stats.totalAssessments : (loading ? '...' : 0)}
          </div>
          <p style={{ margin: '0.25rem 0 0', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            Forecast risk evaluations
          </p>
        </div>

        {/* High Rain Risk */}
        <div className="card" style={{ padding: '1.5rem', borderRadius: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#b91c1c' }}>High Rain Risk</span>
            <div style={{
              width: '38px',
              height: '38px',
              borderRadius: '10px',
              background: '#fee2e2',
              color: '#dc2626',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <AlertTriangle size={20} />
            </div>
          </div>
          <div style={{ fontSize: '2.2rem', fontWeight: 800, color: '#dc2626', fontFamily: 'Outfit' }}>
            {stats ? stats.highRiskCount : (loading ? '...' : 0)}
          </div>
          <p style={{ margin: '0.25rem 0 0', fontSize: '0.8rem', color: '#b91c1c' }}>
            Urgent tarp / delay warnings
          </p>
        </div>

        {/* Moderate / Low Risk */}
        <div className="card" style={{ padding: '1.5rem', borderRadius: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#15803d' }}>Low / Favorable Risk</span>
            <div style={{
              width: '38px',
              height: '38px',
              borderRadius: '10px',
              background: '#dcfce7',
              color: '#16a34a',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <CheckCircle size={20} />
            </div>
          </div>
          <div style={{ fontSize: '2.2rem', fontWeight: 800, color: '#15803d', fontFamily: 'Outfit' }}>
            {stats ? stats.lowRiskCount : (loading ? '...' : 0)}
          </div>
          <p style={{ margin: '0.25rem 0 0', fontSize: '0.8rem', color: '#15803d' }}>
            Safe for active harvesting
          </p>
        </div>
      </div>

      {/* Tabs Control */}
      <div style={{
        display: 'flex',
        gap: '0.5rem',
        borderBottom: '2px solid #e2ebe4',
        marginBottom: '1.5rem'
      }}>
        <button
          type="button"
          onClick={() => setActiveTab('overview')}
          style={{
            background: 'none',
            border: 'none',
            padding: '0.75rem 1.25rem',
            fontWeight: 600,
            fontSize: '0.95rem',
            cursor: 'pointer',
            borderBottom: activeTab === 'overview' ? '3px solid var(--primary-leaf)' : '3px solid transparent',
            color: activeTab === 'overview' ? 'var(--primary-leaf)' : 'var(--text-muted)'
          }}
        >
          Recent Activity & Summary
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('users')}
          style={{
            background: 'none',
            border: 'none',
            padding: '0.75rem 1.25rem',
            fontWeight: 600,
            fontSize: '0.95rem',
            cursor: 'pointer',
            borderBottom: activeTab === 'users' ? '3px solid var(--primary-leaf)' : '3px solid transparent',
            color: activeTab === 'users' ? 'var(--primary-leaf)' : 'var(--text-muted)'
          }}
        >
          Registered Users Directory ({usersList.length})
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('assessments')}
          style={{
            background: 'none',
            border: 'none',
            padding: '0.75rem 1.25rem',
            fontWeight: 600,
            fontSize: '0.95rem',
            cursor: 'pointer',
            borderBottom: activeTab === 'assessments' ? '3px solid var(--primary-leaf)' : '3px solid transparent',
            color: activeTab === 'assessments' ? 'var(--primary-leaf)' : 'var(--text-muted)'
          }}
        >
          System-Wide Assessments ({assessmentsList.length})
        </button>
      </div>

      {/* TAB 1: OVERVIEW */}
      {activeTab === 'overview' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
          {/* Recent User Registrations */}
          <div className="card" style={{ padding: '1.75rem', borderRadius: '18px' }}>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Users size={20} color="var(--primary-leaf)" />
              <span>Latest Registered Users</span>
            </h3>
            {stats?.recentUsers && stats.recentUsers.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {stats.recentUsers.slice(0, 5).map((u) => (
                  <div key={u.id} style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.75rem 1rem',
                    background: '#f8faf8',
                    borderRadius: '12px',
                    border: '1px solid #e8f0e9'
                  }}>
                    <div>
                      <strong style={{ display: 'block', fontSize: '0.92rem', color: 'var(--primary-deep)' }}>
                        {u.fullName}
                      </strong>
                      <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                        {u.email}
                      </span>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <span style={{
                        display: 'inline-block',
                        background: u.role === 'ROLE_ADMIN' ? '#dcfce7' : '#f1f5f9',
                        color: u.role === 'ROLE_ADMIN' ? '#15803d' : '#475569',
                        padding: '0.15rem 0.5rem',
                        borderRadius: '6px',
                        fontSize: '0.72rem',
                        fontWeight: 700
                      }}>
                        {u.role}
                      </span>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                        {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : 'N/A'}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>No users registered yet.</p>
            )}
          </div>

          {/* Risk Level Distribution Breakdown */}
          <div className="card" style={{ padding: '1.75rem', borderRadius: '18px' }}>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Filter size={20} color="var(--primary-leaf)" />
              <span>Risk Classification Breakdown</span>
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.3rem', fontSize: '0.88rem' }}>
                  <span style={{ color: '#dc2626', fontWeight: 600 }}>High Risk (Rain &gt; 5mm / Prob &ge; 70%)</span>
                  <strong>{stats?.highRiskCount || 0}</strong>
                </div>
                <div style={{ width: '100%', height: '8px', background: '#fee2e2', borderRadius: '999px', overflow: 'hidden' }}>
                  <div style={{
                    width: `${stats?.totalAssessments ? ((stats.highRiskCount / stats.totalAssessments) * 100) : 0}%`,
                    height: '100%',
                    background: '#dc2626'
                  }} />
                </div>
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.3rem', fontSize: '0.88rem' }}>
                  <span style={{ color: '#d97706', fontWeight: 600 }}>Medium Risk (Rain 2-5mm / Prob 40-70%)</span>
                  <strong>{stats?.mediumRiskCount || 0}</strong>
                </div>
                <div style={{ width: '100%', height: '8px', background: '#fef3c7', borderRadius: '999px', overflow: 'hidden' }}>
                  <div style={{
                    width: `${stats?.totalAssessments ? ((stats.mediumRiskCount / stats.totalAssessments) * 100) : 0}%`,
                    height: '100%',
                    background: '#d97706'
                  }} />
                </div>
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.3rem', fontSize: '0.88rem' }}>
                  <span style={{ color: '#16a34a', fontWeight: 600 }}>Low Risk / Favorable Weather</span>
                  <strong>{stats?.lowRiskCount || 0}</strong>
                </div>
                <div style={{ width: '100%', height: '8px', background: '#dcfce7', borderRadius: '999px', overflow: 'hidden' }}>
                  <div style={{
                    width: `${stats?.totalAssessments ? ((stats.lowRiskCount / stats.totalAssessments) * 100) : 0}%`,
                    height: '100%',
                    background: '#16a34a'
                  }} />
                </div>
              </div>
            </div>

            <div style={{
              marginTop: '1.5rem',
              padding: '1rem',
              background: '#f8faf8',
              borderRadius: '12px',
              fontSize: '0.82rem',
              color: 'var(--text-muted)'
            }}>
              <strong>Data Integrity Guarantee:</strong> Passwords and password hashes are never serialized or returned across any admin API response. All counts are generated through real database aggregate queries.
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: USERS DIRECTORY */}
      {activeTab === 'users' && (
        <div className="card" style={{ padding: '1.75rem', borderRadius: '18px' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '1.25rem',
            flexWrap: 'wrap',
            gap: '1rem'
          }}>
            <div>
              <h3 style={{ fontSize: '1.25rem', margin: 0 }}>Registered Farmer & User Accounts</h3>
              <p style={{ margin: '0.2rem 0 0', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                Viewing {filteredUsers.length} of {usersList.length} total accounts in MySQL
              </p>
            </div>

            <div style={{ position: 'relative', width: '280px' }}>
              <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input
                type="text"
                className="form-input"
                style={{ paddingLeft: '2.2rem', paddingRight: '0.75rem', fontSize: '0.88rem' }}
                placeholder="Search name, email, phone..."
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
              />
            </div>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
              <thead>
                <tr style={{ background: '#f1f8f3', borderBottom: '2px solid #d8e6db' }}>
                  <th style={{ padding: '0.85rem 1rem' }}>User ID</th>
                  <th style={{ padding: '0.85rem 1rem' }}>Full Name</th>
                  <th style={{ padding: '0.85rem 1rem' }}>Email Address</th>
                  <th style={{ padding: '0.85rem 1rem' }}>Phone Number</th>
                  <th style={{ padding: '0.85rem 1rem' }}>Role</th>
                  <th style={{ padding: '0.85rem 1rem' }}>Language</th>
                  <th style={{ padding: '0.85rem 1rem' }}>Created At</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((u) => (
                  <tr key={u.id} style={{ borderBottom: '1px solid #edf4ee' }}>
                    <td style={{ padding: '0.85rem 1rem', fontFamily: 'monospace', color: 'var(--text-muted)' }}>
                      #{u.id}
                    </td>
                    <td style={{ padding: '0.85rem 1rem', fontWeight: 600, color: 'var(--primary-deep)' }}>
                      {u.fullName}
                    </td>
                    <td style={{ padding: '0.85rem 1rem' }}>
                      {u.email}
                    </td>
                    <td style={{ padding: '0.85rem 1rem', color: 'var(--text-muted)' }}>
                      {u.phoneNumber || '—'}
                    </td>
                    <td style={{ padding: '0.85rem 1rem' }}>
                      <span style={{
                        display: 'inline-block',
                        background: u.role === 'ROLE_ADMIN' ? '#dcfce7' : '#f1f5f9',
                        color: u.role === 'ROLE_ADMIN' ? '#15803d' : '#475569',
                        padding: '0.2rem 0.55rem',
                        borderRadius: '6px',
                        fontSize: '0.75rem',
                        fontWeight: 700
                      }}>
                        {u.role}
                      </span>
                    </td>
                    <td style={{ padding: '0.85rem 1rem', textTransform: 'uppercase', fontSize: '0.82rem' }}>
                      {u.preferredLanguage || 'EN'}
                    </td>
                    <td style={{ padding: '0.85rem 1rem', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                      {u.createdAt ? new Date(u.createdAt).toLocaleString() : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: SYSTEM-WIDE ASSESSMENTS */}
      {activeTab === 'assessments' && (
        <div className="card" style={{ padding: '1.75rem', borderRadius: '18px' }}>
          <div style={{ marginBottom: '1.25rem' }}>
            <h3 style={{ fontSize: '1.25rem', margin: 0 }}>System-Wide Rain Assessments</h3>
            <p style={{ margin: '0.2rem 0 0', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              All assessments logged across the platform ({assessmentsList.length} entries)
            </p>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
              <thead>
                <tr style={{ background: '#f1f8f3', borderBottom: '2px solid #d8e6db' }}>
                  <th style={{ padding: '0.85rem 1rem' }}>ID</th>
                  <th style={{ padding: '0.85rem 1rem' }}>Farmer</th>
                  <th style={{ padding: '0.85rem 1rem' }}>Crop</th>
                  <th style={{ padding: '0.85rem 1rem' }}>Location</th>
                  <th style={{ padding: '0.85rem 1rem' }}>Risk Level</th>
                  <th style={{ padding: '0.85rem 1rem' }}>Score</th>
                  <th style={{ padding: '0.85rem 1rem' }}>Planned Harvest</th>
                  <th style={{ padding: '0.85rem 1rem' }}>Timestamp</th>
                </tr>
              </thead>
              <tbody>
                {assessmentsList.map((a) => (
                  <tr key={a.id} style={{ borderBottom: '1px solid #edf4ee' }}>
                    <td style={{ padding: '0.85rem 1rem', fontFamily: 'monospace' }}>#{a.id}</td>
                    <td style={{ padding: '0.85rem 1rem', fontWeight: 600 }}>{a.farmerName}</td>
                    <td style={{ padding: '0.85rem 1rem' }}>{a.cropName}</td>
                    <td style={{ padding: '0.85rem 1rem', color: 'var(--text-muted)' }}>{a.locationName}</td>
                    <td style={{ padding: '0.85rem 1rem' }}>
                      <span style={{
                        display: 'inline-block',
                        padding: '0.2rem 0.6rem',
                        borderRadius: '6px',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        background: a.riskLevel === 'HIGH' ? '#fee2e2' : a.riskLevel === 'MEDIUM' ? '#fef3c7' : '#dcfce7',
                        color: a.riskLevel === 'HIGH' ? '#dc2626' : a.riskLevel === 'MEDIUM' ? '#d97706' : '#15803d'
                      }}>
                        {a.riskLevel}
                      </span>
                    </td>
                    <td style={{ padding: '0.85rem 1rem', fontWeight: 700 }}>{a.riskScore}/100</td>
                    <td style={{ padding: '0.85rem 1rem', fontSize: '0.85rem' }}>{a.plannedHarvestDate} {a.plannedHarvestTime}</td>
                    <td style={{ padding: '0.85rem 1rem', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                      {a.createdAt ? new Date(a.createdAt).toLocaleString() : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
