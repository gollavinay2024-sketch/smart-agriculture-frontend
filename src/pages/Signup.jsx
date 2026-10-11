import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import { User, Mail, Phone, Lock, Globe, UserPlus, CheckCircle, AlertCircle, Sprout, ArrowRight } from 'lucide-react';

export default function Signup() {
  const { signup, isAuthenticated } = useAuth();
  const { language, setLanguage } = useApp();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    password: '',
    confirmPassword: '',
    preferredLanguage: language || 'en'
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // If already authenticated, redirect to dashboard
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (name === 'preferredLanguage') {
      setLanguage(value);
    }
  };

  const validate = () => {
    if (!formData.fullName.trim()) {
      return 'Please enter your full name.';
    }
    if (!formData.email.trim()) {
      return 'Please enter your email address.';
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email.trim())) {
      return 'Please enter a valid email address.';
    }
    if (formData.password.length < 6) {
      return 'Password must be at least 6 characters long.';
    }
    if (formData.password !== formData.confirmPassword) {
      return 'Passwords do not match. Please verify both password fields.';
    }
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setLoading(true);
      await signup({
        fullName: formData.fullName.trim(),
        email: formData.email.trim().toLowerCase(),
        phoneNumber: formData.phoneNumber.trim() || null,
        password: formData.password,
        preferredLanguage: formData.preferredLanguage
      });
      setSuccess(true);
    } catch (err) {
      if (err.status === 409 || err.message?.includes('already registered')) {
        setError('This email address is already registered. Please sign in or use a different email.');
      } else {
        setError(err.message || 'Registration failed. Please check your information and try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      maxWidth: '540px',
      margin: '2rem auto 4rem',
      padding: '0 1rem'
    }}>
      <div className="card" style={{
        padding: '2.5rem 2.2rem',
        borderRadius: '24px',
        boxShadow: 'var(--shadow-xl)',
        border: '1.5px solid rgba(46, 125, 50, 0.18)'
      }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
          <div style={{
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%)',
            color: 'var(--primary-leaf)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1rem',
            boxShadow: '0 4px 12px rgba(46, 125, 50, 0.2)'
          }}>
            <UserPlus size={30} />
          </div>
          <h2 style={{ fontSize: '1.85rem', color: 'var(--primary-deep)', marginBottom: '0.4rem' }}>
            New Farmer Registration
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', margin: 0 }}>
            Join the Smart Agriculture platform to safeguard your harvest with precision weather alerts
          </p>
        </div>

        {/* Success Banner */}
        {success ? (
          <div style={{
            background: '#f0fdf4',
            border: '1.5px solid #86efac',
            borderRadius: '16px',
            padding: '2rem 1.5rem',
            textAlign: 'center',
            color: '#166534'
          }}>
            <CheckCircle size={48} style={{ color: '#22c55e', margin: '0 auto 1rem' }} />
            <h3 style={{ margin: '0 0 0.5rem', fontSize: '1.35rem', color: '#14532d' }}>
              Account Created Successfully!
            </h3>
            <p style={{ color: '#166534', fontSize: '0.95rem', marginBottom: '1.5rem', lineHeight: 1.6 }}>
              Welcome, <strong>{formData.fullName}</strong>. Your farmer profile has been securely registered in the agricultural database.
            </p>
            <Link
              to="/login"
              className="btn btn-primary"
              style={{ width: '100%', padding: '0.85rem' }}
            >
              <span>Proceed to Farmer Sign In</span>
              <ArrowRight size={18} />
            </Link>
          </div>
        ) : (
          <>
            {/* Error Banner */}
            {error && (
              <div style={{
                background: '#fef2f2',
                border: '1px solid #fecaca',
                color: '#b91c1c',
                borderRadius: '12px',
                padding: '0.85rem 1rem',
                marginBottom: '1.5rem',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '0.65rem',
                fontSize: '0.9rem'
              }}>
                <AlertCircle size={20} style={{ flexShrink: 0, marginTop: '2px' }} />
                <div>{error}</div>
              </div>
            )}

            {/* Signup Form */}
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label" htmlFor="signup-name">
                  <User size={16} />
                  <span>Full Name</span>
                </label>
                <input
                  id="signup-name"
                  type="text"
                  name="fullName"
                  className="form-input"
                  placeholder="e.g., Ramesh Kumar"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="signup-email">
                  <Mail size={16} />
                  <span>Email Address</span>
                </label>
                <input
                  id="signup-email"
                  type="email"
                  name="email"
                  className="form-input"
                  placeholder="e.g., farmer@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  autoComplete="email"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="signup-phone">
                  <Phone size={16} />
                  <span>Phone Number (Optional)</span>
                </label>
                <input
                  id="signup-phone"
                  type="tel"
                  name="phoneNumber"
                  className="form-input"
                  placeholder="e.g., 9876543210"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label" htmlFor="signup-password">
                    <Lock size={16} />
                    <span>Password</span>
                  </label>
                  <input
                    id="signup-password"
                    type="password"
                    name="password"
                    className="form-input"
                    placeholder="Min 6 characters"
                    value={formData.password}
                    onChange={handleChange}
                    autoComplete="new-password"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="signup-confirm-password">
                    <Lock size={16} />
                    <span>Confirm Password</span>
                  </label>
                  <input
                    id="signup-confirm-password"
                    type="password"
                    name="confirmPassword"
                    className="form-input"
                    placeholder="Repeat password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    autoComplete="new-password"
                    required
                  />
                </div>
              </div>

              <div className="form-group" style={{ marginBottom: '1.85rem' }}>
                <label className="form-label" htmlFor="signup-lang">
                  <Globe size={16} />
                  <span>Preferred Language</span>
                </label>
                <select
                  id="signup-lang"
                  name="preferredLanguage"
                  className="form-select"
                  value={formData.preferredLanguage}
                  onChange={handleChange}
                >
                  <option value="en">English</option>
                  <option value="te">తెలుగు (Telugu)</option>
                  <option value="hi">हिंदी (Hindi)</option>
                </select>
              </div>

              <button
                type="submit"
                className="btn btn-primary"
                style={{ width: '100%', padding: '0.85rem', fontSize: '1.02rem' }}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Sprout size={18} className="spin-slow" />
                    <span>Creating Account...</span>
                  </>
                ) : (
                  <>
                    <UserPlus size={18} />
                    <span>Register New Account</span>
                  </>
                )}
              </button>
            </form>

            {/* Footer */}
            <div style={{
              marginTop: '1.75rem',
              paddingTop: '1.25rem',
              borderTop: '1px solid #eef3ef',
              textAlign: 'center',
              fontSize: '0.92rem'
            }}>
              <span style={{ color: 'var(--text-muted)' }}>Already registered? </span>
              <Link to="/login" style={{ color: 'var(--primary-leaf)', fontWeight: 600 }}>
                Sign In here &rarr;
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
