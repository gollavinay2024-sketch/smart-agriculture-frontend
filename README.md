# Smart Agriculture — Frontend Client

> **Rain Risk Prediction & Crop Protection Decision-Support System**  
> Modern, responsive React + Vite web application empowering farmers with precision precipitation forecasting, tailored agronomic safeguards, multilingual voice alerts, and secure role-based portals.

---

## 🌾 Overview

The **Smart Agriculture Frontend** is the user-facing interface for the Smart Agriculture platform. Designed with an accessible, high-contrast agricultural greenery theme, it allows farmers in the field to evaluate weather risks, receive spoken alerts in regional Indian languages, and access personalized harvest recommendations.

---

## 🚀 Key Features

1. **Three Dedicated Access Gateways**:
   - **Farmer Sign In (`/login`)**: Direct sign-in for registered farmers to access saved harvest plans and history.
   - **New Farmer Registration (`/signup`)**: Public onboarding with email, password policy validation, and language preference selection.
   - **Admin Portal (`/admin-login`)**: Restricted authentication portal with one-time initial administrator bootstrap support.
2. **Harvest Risk Planner (`/planner`)**:
   - Location input with Open-Meteo geocoding autocomplete and one-click GPS geolocation detection.
   - Crop selection across major crops: **Rice (Paddy)**, **Wheat**, **Cotton**, **Maize (Corn)**, **Vegetables**, and **Pulses**.
   - Planned harvest date & time slot selection (supporting up to 14-day forecast horizons).
3. **Dynamic Risk Assessment & Agronomic Safeguards (`/results`)**:
   - Rule-based risk level calculation (`LOW`, `MEDIUM`, `HIGH`).
   - Hourly rainfall probability, anticipated volume (mm), humidity, and wind speed cards.
   - Crop-specific protection checklists (e.g., tarpaulin deployment, drainage clearing, delayed threshing).
4. **Multilingual Regional Voice Alerts**:
   - Browser-native `SpeechSynthesis` audio player generating spoken alerts in **English (`en-IN`)**, **Telugu (`te-IN`)**, and **Hindi (`hi-IN`)**.
5. **Farmer Dashboard (`/dashboard`) & History (`/history`)**:
   - Visual charts powered by Recharts (risk distribution pie charts, crop breakdown bar charts).
   - User-scoped historical assessment vault with modal detail inspection and filtering.
6. **Administrator Control Center (`/admin/dashboard`)**:
   - Real-time platform metrics: total registered users, total assessments, risk category breakdowns.
   - Searchable user directory with roles and registration timestamps.
   - System-wide assessment oversight log.

---

## 🛠️ Technology Stack

- **Core**: React 18, JavaScript (ES2022+), Vite 8
- **Routing**: React Router DOM (HashRouter for zero-config static hosting)
- **State & Auth**: React Context API (`AuthContext`, `AppContext`) with REST cookie-based session verification
- **Data Visualization**: Recharts (PieChart, BarChart, ResponsiveContainer)
- **Icons**: Lucide React
- **Design System**: Vanilla CSS tokens (HSL agricultural palette, glassmorphism badges, mobile-responsive grid)
- **Audio**: Web Speech API (`window.speechSynthesis`)

---

## 📋 Prerequisites

- **Node.js**: `v18.0.0` or higher (recommended: `v20.x` or `v22.x`)
- **npm**: `v9.x` or higher
- **Backend Service**: Running instance of `smart-agriculture-backend` (defaults to `http://localhost:8080`)

---

## ⚡ Quick Start

### 1. Clone & Install Dependencies
```bash
git clone https://github.com/<your-username>/smart-agriculture-frontend.git
cd smart-agriculture-frontend
npm install
```

### 2. Configure Environment Variables
Copy the template file:
```bash
cp .env.example .env
```

Edit `.env` if your backend is running on a custom port or remote host:
```ini
# Defaults to http://localhost:8080/api for local development
VITE_API_BASE_URL=http://localhost:8080/api
```

### 3. Start Local Development Server
```bash
npm run dev
```
Open **[http://localhost:5173](http://localhost:5173)** in your browser.

---

## 📦 Production Build

To create an optimized production bundle:
```bash
npm run build
```
The compiled static assets are generated in the `dist/` directory.

To test the production build locally:
```bash
npm run preview
```

---

## 🐳 Docker Deployment

A production-ready multi-stage `Dockerfile` is included:
```bash
# Build Docker image with Nginx
docker build -t smart-agriculture-frontend .

# Run container on port 80
docker run -p 80:80 smart-agriculture-frontend
```

---

## 📂 Project Structure

```
smart-agriculture-frontend/
├── public/                 # Static assets & favicons
├── src/
│   ├── assets/             # Brand logos & imagery
│   ├── components/         # Reusable UI components
│   │   ├── CropSelector.jsx       # 6-crop selection cards
│   │   ├── Footer.jsx             # Disclaimer & links
│   │   ├── Navbar.jsx             # Nav menu, auth state & language switcher
│   │   ├── ProtectedRoute.jsx     # User & admin route guards
│   │   ├── RiskBadge.jsx          # Color-coded risk indicators
│   │   ├── VoiceAlertPlayer.jsx   # SpeechSynthesis regional audio
│   │   └── WeatherCard.jsx        # Atmospheric metric tiles
│   ├── context/
│   │   ├── AppContext.jsx         # Language state & active assessment
│   │   └── AuthContext.jsx        # User session, login, signup, logout
│   ├── pages/
│   │   ├── About.jsx              # Agronomic methodology & guidelines
│   │   ├── AdminDashboard.jsx     # Admin metrics & user registry
│   │   ├── AdminLogin.jsx         # Administrator authentication portal
│   │   ├── Dashboard.jsx          # Farmer metrics & charts
│   │   ├── HarvestPlanner.jsx     # Main harvest scheduling form
│   │   ├── History.jsx            # User-scoped private assessment logs
│   │   ├── Home.jsx               # Landing page with 3 auth cards
│   │   ├── Login.jsx              # Farmer login page
│   │   ├── RiskResults.jsx        # Atmospheric evaluation & safeguards
│   │   └── Signup.jsx             # New farmer onboarding form
│   ├── services/
│   │   └── api.js                 # HTTP fetch client with credentials support
│   ├── utils/
│   │   └── translations.js        # English, Telugu, & Hindi dictionaries
│   ├── App.jsx                    # Route configuration & providers
│   ├── index.css                  # Core CSS design tokens & utilities
│   └── main.jsx                   # Application entry point
├── .env.example            # Environment variables template
├── .gitignore              # Git ignore rules (excludes node_modules, dist, .env)
├── Dockerfile              # Multi-stage production container configuration
├── package.json            # Project dependencies & scripts
└── vite.config.js          # Vite build configuration
```

---

## 🔒 Security & Privacy

- **No Hardcoded Secrets**: All API endpoints use configurable environment variables (`VITE_API_BASE_URL`).
- **Session Protection**: All authenticated API calls transmit `credentials: 'include'` for secure, HttpOnly cookie authentication managed by Spring Security.
- **Route Authorization**: Route guards prevent unauthenticated users from entering protected farmer areas, and strictly bar non-administrators from accessing the admin console.

---

## 📄 License
This project is licensed under the MIT License.
