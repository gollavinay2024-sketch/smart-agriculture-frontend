const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

async function handleResponse(res) {
  if (!res.ok) {
    let errorMsg = `Server error (${res.status})`;
    try {
      const errorData = await res.json();
      if (errorData.message) {
        errorMsg = errorData.message;
      } else if (errorData.error) {
        errorMsg = errorData.error;
      }
    } catch {
      // Body is not JSON
    }
    const err = new Error(errorMsg);
    err.status = res.status;
    throw err;
  }
  return res.json();
}

export const api = {
  // Authentication Endpoints
  async signup(data) {
    const res = await fetch(`${API_BASE_URL}/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(data)
    });
    return await handleResponse(res);
  },

  async login(credentials) {
    const res = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(credentials)
    });
    return await handleResponse(res);
  },

  async logout() {
    const res = await fetch(`${API_BASE_URL}/auth/logout`, {
      method: 'POST',
      credentials: 'include'
    });
    return await handleResponse(res);
  },

  async getCurrentUser() {
    const res = await fetch(`${API_BASE_URL}/auth/me`, {
      method: 'GET',
      credentials: 'include'
    });
    return await handleResponse(res);
  },

  async setupAdmin(data) {
    const res = await fetch(`${API_BASE_URL}/auth/setup-admin`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(data)
    });
    return await handleResponse(res);
  },

  // Admin-Only Endpoints
  async getAdminDashboard() {
    const res = await fetch(`${API_BASE_URL}/admin/dashboard`, {
      method: 'GET',
      credentials: 'include'
    });
    return await handleResponse(res);
  },

  async getAdminUsers() {
    const res = await fetch(`${API_BASE_URL}/admin/users`, {
      method: 'GET',
      credentials: 'include'
    });
    return await handleResponse(res);
  },

  async getAdminAssessments() {
    const res = await fetch(`${API_BASE_URL}/admin/assessments`, {
      method: 'GET',
      credentials: 'include'
    });
    return await handleResponse(res);
  },

  // Weather & Risk Assessment Endpoints
  async checkHealth() {
    try {
      const res = await fetch(`${API_BASE_URL}/health`, { credentials: 'include' });
      return await handleResponse(res);
    } catch (e) {
      return { status: 'DOWN', error: e.message };
    }
  },

  async searchLocations(query) {
    if (!query || query.trim().length < 2) return [];
    try {
      const res = await fetch(`${API_BASE_URL}/weather/geocode?query=${encodeURIComponent(query.trim())}`, {
        credentials: 'include'
      });
      return await handleResponse(res);
    } catch (e) {
      console.warn('Geocoding search fallback:', e);
      try {
        const directRes = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=5&language=en&format=json`);
        const data = await directRes.json();
        if (data.results) {
          return data.results.map(r => ({
            name: r.name,
            latitude: r.latitude,
            longitude: r.longitude,
            country: r.country,
            admin1: r.admin1,
            displayName: `${r.name}${r.admin1 ? ', ' + r.admin1 : ''}${r.country ? ', ' + r.country : ''}`
          }));
        }
      } catch {}
      return [];
    }
  },

  async getForecast(lat, lon, harvestDate, harvestTime) {
    let url = `${API_BASE_URL}/weather/forecast?lat=${lat}&lon=${lon}`;
    if (harvestDate) url += `&harvestDate=${harvestDate}`;
    if (harvestTime) url += `&harvestTime=${harvestTime}`;
    const res = await fetch(url, { credentials: 'include' });
    return await handleResponse(res);
  },

  async analyzeRisk(payload) {
    const res = await fetch(`${API_BASE_URL}/risk/analyze`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(payload)
    });
    return await handleResponse(res);
  },

  async getAssessments(crop, risk) {
    let url = `${API_BASE_URL}/assessments`;
    const params = new URLSearchParams();
    if (crop && crop !== 'all') params.append('crop', crop);
    if (risk && risk !== 'all') params.append('risk', risk);
    if (params.toString()) url += `?${params.toString()}`;

    const res = await fetch(url, { credentials: 'include' });
    return await handleResponse(res);
  },

  async getAssessmentById(id) {
    const res = await fetch(`${API_BASE_URL}/assessments/${id}`, {
      credentials: 'include'
    });
    return await handleResponse(res);
  },

  async getDashboardSummary() {
    const res = await fetch(`${API_BASE_URL}/dashboard/summary`, {
      credentials: 'include'
    });
    return await handleResponse(res);
  }
};
