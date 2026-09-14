# 🔥 AgniDrishti — Industrial Fire & Persistent Thermal Source Intelligence

> **Smart India Hackathon (SIH) — Problem Statement 162**  
> **AI-Based Detection and Classification of Industrial Fires & Persistent Thermal Sources using Satellite Telemetry & Spatial GIS Indexing**

---

## 📌 Overview

**AgniDrishti** is a next-generation real-time GIS command & control intelligence system engineered to identify, classify, and prioritize industrial fire hazards and persistent thermal emission sources across India. 

By fusing high-frequency thermal remote sensing pixels (**NASA FIRMS MODIS & VIIRS**) with **OpenStreetMap (OSM)** industrial infrastructure spatial layers, AgniDrishti automatically discriminates between routine industrial activity (flare stacks, power plant cooling/furnaces), dangerous industrial blazes, forest fires, and agricultural stubble burning.

```
┌────────────────────────┐      ┌─────────────────────────┐      ┌─────────────────────────┐      ┌───────────────────────────┐
│ NASA FIRMS Telemetry   │ ───► │  OSM Infrastructure     │ ───► │   AI Hazard Classifier  │ ───► │   GIS Command Dashboard   │
│ (MODIS 1km / VIIRS 375m)│      │  Spatial Proximity Index│      │   & Risk Engine (0-100) │      │   (React + Leaflet + FastAPI) │
└────────────────────────┘      └─────────────────────────┘      └─────────────────────────┘      └───────────────────────────┘
```

---

## ✨ Key Features

- **🛰️ Satellite Telemetry Ingestion**: Live parsing of NASA FIRMS thermal anomaly pixels from MODIS (1 km) and VIIRS (375 m) sensors.
- **🏷️ Automated Hazard Classification**: AI rules engine categorizes anomalies into **Industrial Fire**, **Persistent Thermal Source**, **Forest / Wildfire**, or **Agricultural Burning**.
- **📍 OSM Infrastructure Spatial Buffer**: Maps proximities to high-risk industrial facilities including petroleum refineries, chemical zones, power plants, and steel mills.
- **⚡ AI Risk Prioritization (0–100)**: Calculates multi-factor risk scores considering Fire Radiative Power (FRP), satellite sensor confidence, land cover type, and chemical asset proximity.
- **📈 Multi-Month Temporal Persistence**: Tracks historical FRP trendlines and temporal persistence ratios to distinguish flare stacks from accidental structural fires.
- **🗺️ Command-Center GIS Map**: Custom Leaflet visualizer featuring FRP-scaled animated pulse markers, industrial overlays, and quick filtering presets.
- **📊 Real-time Analytics & Alerting**: Dynamic KPI metrics, regional breakdown charts, FRP distribution histograms, and live notification feed.

---

## 🛠️ Tech Stack

### **Frontend (GIS Dashboard)**
- **Framework**: React 19 + Vite
- **Mapping & GIS**: Leaflet & React-Leaflet
- **Styling**: Tailwind CSS (Dark Command-Center Theme)
- **Charts & Data Viz**: Recharts
- **Icons**: Lucide React

### **Backend (REST API)**
- **Framework**: Python 3 (FastAPI + Uvicorn)
- **Data Validation**: Pydantic v2
- **Spatial Calculations**: Haversine Spatial Engine
- **Data Source**: NASA FIRMS Telemetry CSV Data & OSM Infrastructure Database

---

## 📁 Repository Structure

```
.
├── backend/
│   ├── main.py              # FastAPI REST endpoints & spatial intelligence engine
│   ├── hotspots_data.csv    # Telemetry dataset (NASA FIRMS satellite anomalies)
│   └── requirements.txt     # Python dependencies
├── src/
│   ├── components/
│   │   ├── MapView/         # GIS Leaflet Map, Industrial Layers & Legend
│   │   ├── AnalyticsModal.jsx   # Data visualization & chart modal
│   │   ├── SihInfoModal.jsx     # SIH PS 162 compliance overview modal
│   │   ├── HotspotDetailsDrawer.jsx # Detail drawer for selected anomaly
│   │   ├── NotificationsPopover.jsx # Live hazard alert popover
│   │   └── StatisticsCards.jsx  # KPI summary metrics cards
│   ├── services/
│   │   ├── api.js           # REST API client with local mock fallback
│   │   └── mockData.js      # Fallback telemetry data
│   ├── App.jsx              # Main dashboard view & state hub
│   ├── main.jsx             # React entry point
│   └── index.css            # Global CSS & dark mode styling
├── index.html               # HTML entry point
├── package.json             # Frontend dependencies & scripts
├── vite.config.js           # Vite build configuration
└── README.md                # Project documentation
```

---

## 🚀 Quick Start Guide

### Prerequisites
- **Node.js** v18 or higher
- **Python** v3.10 or higher
- **npm** or **yarn**

---

### 1. Launch Backend API (Python FastAPI)

```bash
# Navigate to backend directory
cd backend

# Install dependencies
pip install -r requirements.txt

# Start FastAPI server
python main.py
```
> The API server will start on `http://localhost:8000`. You can inspect interactive OpenAPI docs at `http://localhost:8000/docs`.

---

### 2. Launch Frontend Dashboard (React + Vite)

```bash
# In project root directory
npm install

# Start Vite development server
npm run dev
```
> Open your browser at `http://localhost:5173` to access the GIS Command Center.

---

## 🔗 API Reference

| Endpoint | Method | Description |
| :--- | :---: | :--- |
| `GET /` | `GET` | Service status, FIRMS status, and total active anomalies count |
| `GET /api/v1/hotspots` | `GET` | Fetch thermal hotspots (Supports query filters: `classification`, `risk_level`, `confidence`, `satellite`, `persistence`, `facility_type`, `quickFilter`) |
| `GET /api/v1/hotspots/{id}` | `GET` | Get telemetry details & AI rationale for a specific anomaly ID |
| `GET /api/v1/statistics` | `GET` | Retrieve aggregate metrics (Industrial fires count, high risk count, avg FRP) |
| `GET /api/v1/facilities` | `GET` | Get industrial infrastructure GIS markers database |

---

## 📋 SIH Problem Statement 162 Compliance Matrix

| Requirement | Implementation Status |
| :--- | :---: |
| Thermal Anomaly Detection (FIRMS MODIS/VIIRS) | ✅ Completed |
| Industrial Fire vs Wildfire Discrimination | ✅ Completed |
| Persistent Thermal Source Identifier | ✅ Completed |
| OSM Industrial Asset Spatial Buffer Engine | ✅ Completed |
| Interactive GIS Leaflet Command Dashboard | ✅ Completed |
| AI Multi-Factor Risk Scoring (0–100) | ✅ Completed |
| Historical Trend & FRP Sparklines | ✅ Completed |
| Python FastAPI REST Service Integration | ✅ Completed |

---

## 📄 License

Developed for **Smart India Hackathon (SIH) 2026** — Open Source under MIT License.

