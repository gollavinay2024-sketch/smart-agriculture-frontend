import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Calendar,
  Clock,
  MapPin,
  Navigation,
  User,
  Phone,
  Sparkles,
  AlertCircle,
  Loader2,
  CheckCircle2
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import CropSelector from '../components/CropSelector';
import { api } from '../services/api';

export default function HarvestPlanner() {
  const { t, language, setActiveResult } = useApp();
  const { user } = useAuth();
  const navigate = useNavigate();

  // Form states - pre-fill from authenticated user if available
  const [farmerName, setFarmerName] = useState(() => user?.fullName || localStorage.getItem('smart_farmer_name') || '');
  const [phone, setPhone] = useState(() => user?.phoneNumber || localStorage.getItem('smart_farmer_phone') || '');
  const [selectedCrop, setSelectedCrop] = useState('Rice');

  useEffect(() => {
    if (user) {
      if (!farmerName && user.fullName) setFarmerName(user.fullName);
      if (!phone && user.phoneNumber) setPhone(user.phoneNumber);
    }
  }, [user]);

  // Dates: default to tomorrow 10:00 AM
  const getTomorrowStr = () => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split('T')[0];
  };

  const [harvestDate, setHarvestDate] = useState(getTomorrowStr());
  const [harvestTime, setHarvestTime] = useState('10:00');

  // Location states
  const [locationName, setLocationName] = useState('Hyderabad, Telangana');
  const [latitude, setLatitude] = useState(17.3850);
  const [longitude, setLongitude] = useState(78.4867);
  const [searchResults, setSearchResults] = useState([]);
  const [isSearchingLoc, setIsSearchingLoc] = useState(false);
  const [isDetectingGps, setIsDetectingGps] = useState(false);
  const [gpsSuccessMsg, setGpsSuccessMsg] = useState('');

  // Submission & error
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Debounced location search
  useEffect(() => {
    if (!locationName || locationName.length < 3 || isDetectingGps) {
      setSearchResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearchingLoc(true);
      const results = await api.searchLocations(locationName);
      setSearchResults(results);
      setIsSearchingLoc(false);
    }, 400);

    return () => clearTimeout(timer);
  }, [locationName]);

  // GPS Detection
  const handleDetectLocation = () => {
    if (!navigator.geolocation) {
      setErrorMessage("Geolocation is not supported by your browser.");
      return;
    }

    setIsDetectingGps(true);
    setErrorMessage('');
    setGpsSuccessMsg('');

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lon = pos.coords.longitude;
        setLatitude(lat);
        setLongitude(lon);
        setIsDetectingGps(false);
        setGpsSuccessMsg(`Detected GPS: ${lat.toFixed(4)}°, ${lon.toFixed(4)}°`);

        // Reverse lookup or friendly label
        try {
          const res = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${lat.toFixed(2)},${lon.toFixed(2)}&count=1&language=en&format=json`);
          const data = await res.json();
          if (data && data.results && data.results.length > 0) {
            setLocationName(data.results[0].name);
          } else {
            setLocationName(`Current Field Location (${lat.toFixed(2)}°, ${lon.toFixed(2)}°)`);
          }
        } catch {
          setLocationName(`Current Field Location (${lat.toFixed(2)}°, ${lon.toFixed(2)}°)`);
        }
      },
      (err) => {
        setIsDetectingGps(false);
        setErrorMessage(`Could not access GPS (${err.message}). You can type your location name manually.`);
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  const handleSelectLocation = (loc) => {
    setLatitude(loc.latitude);
    setLongitude(loc.longitude);
    setLocationName(loc.displayName || loc.name);
    setSearchResults([]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!selectedCrop) {
      setErrorMessage("Please select a crop.");
      return;
    }

    if (!harvestDate) {
      setErrorMessage("Please select planned harvest date.");
      return;
    }

    if (!latitude || !longitude) {
      setErrorMessage("Please select or detect a valid farm location.");
      return;
    }

    // Persist farmer contact for convenience
    if (farmerName) localStorage.setItem('smart_farmer_name', farmerName);
    if (phone) localStorage.setItem('smart_farmer_phone', phone);

    setIsAnalyzing(true);

    try {
      const payload = {
        farmerName: farmerName.trim() || 'Farmer',
        phoneNumber: phone.trim(),
        cropType: selectedCrop,
        harvestDate: harvestDate,
        harvestTime: harvestTime + ':00',
        latitude: Number(latitude),
        longitude: Number(longitude),
        locationName: locationName,
        language: language,
        saveAssessment: true
      };

      const result = await api.analyzeRisk(payload);
      setActiveResult(result);
      setIsAnalyzing(false);
      navigate('/results');
    } catch (err) {
      console.error('Risk analysis error:', err);
      setIsAnalyzing(false);
      setErrorMessage(err.message || 'Failed to analyze rain risk. Please check connection and try again.');
    }
  };

  return (
    <div style={{ maxWidth: '820px', margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '2.25rem', marginBottom: '0.5rem' }}>{t('planner.title')}</h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem' }}>{t('planner.desc')}</p>
      </div>

      {errorMessage && (
        <div style={{
          background: '#fef2f2',
          border: '1px solid #fecaca',
          borderRadius: '14px',
          padding: '1rem 1.25rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          color: '#b91c1c',
          marginBottom: '1.5rem'
        }}>
          <AlertCircle size={22} />
          <span>{errorMessage}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="card" style={{ padding: '2.25rem' }}>
        {/* Farmer Info */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem' }}>
          <div className="form-group">
            <label className="form-label">
              <User size={16} />
              <span>{t('planner.farmerName')}</span>
            </label>
            <input
              type="text"
              className="form-input"
              placeholder={t('planner.farmerNamePlaceholder')}
              value={farmerName}
              onChange={(e) => setFarmerName(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">
              <Phone size={16} />
              <span>{t('planner.phone')}</span>
            </label>
            <input
              type="tel"
              className="form-input"
              placeholder={t('planner.phonePlaceholder')}
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>
        </div>

        {/* Crop Selection */}
        <div className="form-group" style={{ marginTop: '0.5rem' }}>
          <label className="form-label">
            <Sparkles size={16} />
            <span>{t('planner.selectCrop')}</span>
          </label>
          <CropSelector selectedCrop={selectedCrop} onSelect={setSelectedCrop} />
        </div>

        {/* Harvest Schedule */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem' }}>
          <div className="form-group">
            <label className="form-label">
              <Calendar size={16} />
              <span>{t('planner.harvestDate')}</span>
            </label>
            <input
              type="date"
              className="form-input"
              value={harvestDate}
              min={new Date().toISOString().split('T')[0]}
              onChange={(e) => setHarvestDate(e.target.value)}
              required
            />
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
              {t('planner.dateNote')}
            </span>
          </div>

          <div className="form-group">
            <label className="form-label">
              <Clock size={16} />
              <span>{t('planner.harvestTime')}</span>
            </label>
            <input
              type="time"
              className="form-input"
              value={harvestTime}
              onChange={(e) => setHarvestTime(e.target.value)}
              required
            />
          </div>
        </div>

        {/* Location Section */}
        <div className="form-group" style={{ marginTop: '0.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
            <label className="form-label" style={{ margin: 0 }}>
              <MapPin size={16} />
              <span>{t('planner.location')}</span>
            </label>

            <button
              type="button"
              className="btn btn-secondary"
              onClick={handleDetectLocation}
              disabled={isDetectingGps}
              style={{ padding: '0.45rem 0.85rem', fontSize: '0.82rem' }}
            >
              {isDetectingGps ? (
                <>
                  <Loader2 size={14} className="spin" />
                  <span>{t('planner.detecting')}</span>
                </>
              ) : (
                <>
                  <Navigation size={14} />
                  <span>{t('planner.detectLocation')}</span>
                </>
              )}
            </button>
          </div>

          <div className="location-input-wrap" style={{ marginTop: '0.4rem' }}>
            <input
              type="text"
              className="form-input"
              placeholder={t('planner.locationPlaceholder')}
              value={locationName}
              onChange={(e) => setLocationName(e.target.value)}
              required
            />

            {searchResults.length > 0 && (
              <ul className="location-dropdown">
                {searchResults.map((loc, idx) => (
                  <li
                    key={idx}
                    className="location-item"
                    onClick={() => handleSelectLocation(loc)}
                  >
                    <MapPin size={16} color="#16a34a" />
                    <span>{loc.displayName}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {gpsSuccessMsg && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#15803d', fontSize: '0.82rem', marginTop: '0.35rem' }}>
              <CheckCircle2 size={14} />
              <span>{gpsSuccessMsg}</span>
            </div>
          )}
        </div>

        {/* Submit Button */}
        <div style={{ marginTop: '2rem' }}>
          <button
            type="submit"
            className="btn btn-primary btn-lg"
            style={{ width: '100%' }}
            disabled={isAnalyzing}
          >
            {isAnalyzing ? (
              <>
                <Loader2 size={20} className="spin" />
                <span>{t('planner.analyzing')}</span>
              </>
            ) : (
              <>
                <Sparkles size={20} />
                <span>{t('planner.analyzeBtn')}</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
