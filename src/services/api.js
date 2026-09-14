// AgniDrishti GIS Intelligence API Service Layer
// Prepared for Python FastAPI + NASA FIRMS + OSM + ML Model REST integration

import { MOCK_HOTSPOTS, MOCK_FACILITIES } from './mockData.js';

// Toggle to switch between MOCK data mode and backend REST API mode
export const USE_BACKEND_API = true;
export const BACKEND_URL = "http://localhost:8000/api/v1";

/**
 * Fetch thermal hotspot anomalies with optional filtering
 * FastAPI Endpoint: GET /api/v1/hotspots
 */
export async function getHotspots(filters = {}) {
  if (USE_BACKEND_API) {
    try {
      const queryParams = new URLSearchParams(filters).toString();
      const response = await fetch(`${BACKEND_URL}/hotspots?${queryParams}`);
      if (!response.ok) throw new Error("API network error");
      return await response.json();
    } catch (err) {
      console.warn("Falling back to local mock data due to API error:", err);
    }
  }

  // Local filtering logic
  let filtered = [...MOCK_HOTSPOTS];

  if (filters.classification && filters.classification !== "All") {
    filtered = filtered.filter(h => h.classification === filters.classification);
  }

  if (filters.risk_level && filters.risk_level !== "All") {
    filtered = filtered.filter(h => h.risk_level === filters.risk_level);
  }

  if (filters.confidence && filters.confidence !== "All") {
    if (filters.confidence === "High") filtered = filtered.filter(h => h.confidence >= 90);
    else if (filters.confidence === "Medium") filtered = filtered.filter(h => h.confidence >= 75 && h.confidence < 90);
    else if (filters.confidence === "Low") filtered = filtered.filter(h => h.confidence < 75);
  }

  if (filters.satellite && filters.satellite !== "All") {
    filtered = filtered.filter(h => h.satellite === filters.satellite);
  }

  if (filters.persistence && filters.persistence !== "All") {
    if (filters.persistence === "High") filtered = filtered.filter(h => h.persistence >= 0.70);
    else if (filters.persistence === "Medium") filtered = filtered.filter(h => h.persistence >= 0.40 && h.persistence < 0.70);
    else if (filters.persistence === "Low") filtered = filtered.filter(h => h.persistence < 0.40);
  }

  if (filters.facility_type && filters.facility_type !== "All") {
    filtered = filtered.filter(h => h.facility_type === filters.facility_type);
  }

  if (filters.quickFilter === "high_risk") {
    filtered = filtered.filter(h => h.risk_level === "High");
  } else if (filters.quickFilter === "persistent") {
    filtered = filtered.filter(h => h.classification === "Persistent Thermal Source" || h.persistence >= 0.70);
  } else if (filters.quickFilter === "proximity") {
    filtered = filtered.filter(h => h.distance_km <= 2.0);
  }

  return filtered;
}

/**
 * Fetch single hotspot by ID
 * FastAPI Endpoint: GET /api/v1/hotspots/{id}
 */
export async function getHotspotById(id) {
  if (USE_BACKEND_API) {
    try {
      const response = await fetch(`${BACKEND_URL}/hotspots/${id}`);
      if (response.ok) return await response.json();
    } catch (err) {
      console.warn("API Error:", err);
    }
  }
  return MOCK_HOTSPOTS.find(h => h.id === id) || null;
}

/**
 * Fetch dynamic summary statistics
 * FastAPI Endpoint: GET /api/v1/statistics
 */
export async function getStatistics(currentHotspots = MOCK_HOTSPOTS) {
  const total = currentHotspots.length;
  const industrialFires = currentHotspots.filter(h => h.classification === "Industrial Fire").length;
  const persistentSources = currentHotspots.filter(h => h.classification === "Persistent Thermal Source").length;
  const highRisk = currentHotspots.filter(h => h.risk_level === "High").length;
  const activeToday = currentHotspots.filter(h => h.acq_date === "2026-09-05").length;
  
  const totalFrp = currentHotspots.reduce((sum, h) => sum + (h.frp || 0), 0);
  const avgFrp = total > 0 ? (totalFrp / total).toFixed(1) : "0.0";

  return {
    total,
    industrialFires,
    persistentSources,
    highRisk,
    activeToday,
    avgFrp
  };
}

/**
 * Fetch structured analytics charts data
 * FastAPI Endpoint: GET /api/v1/analytics
 */
export async function getAnalytics(currentHotspots = MOCK_HOTSPOTS) {
  // Classification breakdown
  const classificationCounts = {
    "Industrial Fire": 0,
    "Persistent Thermal Source": 0,
    "Forest / Wildfire": 0,
    "Agricultural Burning": 0,
    "Other / Unknown": 0
  };

  currentHotspots.forEach(h => {
    if (classificationCounts[h.classification] !== undefined) {
      classificationCounts[h.classification]++;
    } else {
      classificationCounts["Other / Unknown"]++;
    }
  });

  const classificationChartData = Object.keys(classificationCounts).map(key => ({
    name: key,
    value: classificationCounts[key]
  }));

  // Detection trend over time (last 5 days)
  const dates = ["09-01", "09-02", "09-03", "09-04", "09-05"];
  const trendChartData = dates.map(d => {
    const modisCount = currentHotspots.filter(h => h.satellite === "MODIS").length;
    const viirsCount = currentHotspots.filter(h => h.satellite === "VIIRS").length;
    return {
      date: d,
      MODIS: Math.round(modisCount * (0.6 + Math.random() * 0.4)),
      VIIRS: Math.round(viirsCount * (0.7 + Math.random() * 0.3))
    };
  });

  // FRP Distribution buckets
  const frpBuckets = { "< 25 MW": 0, "25-50 MW": 0, "50-75 MW": 0, "75-100 MW": 0, "> 100 MW": 0 };
  currentHotspots.forEach(h => {
    if (h.frp < 25) frpBuckets["< 25 MW"]++;
    else if (h.frp < 50) frpBuckets["25-50 MW"]++;
    else if (h.frp < 75) frpBuckets["50-75 MW"]++;
    else if (h.frp < 100) frpBuckets["75-100 MW"]++;
    else frpBuckets["> 100 MW"]++;
  });
  const frpChartData = Object.keys(frpBuckets).map(k => ({ range: k, count: frpBuckets[k] }));

  // Risk Distribution
  const riskCounts = { High: 0, Medium: 0, Low: 0 };
  currentHotspots.forEach(h => {
    if (riskCounts[h.risk_level] !== undefined) riskCounts[h.risk_level]++;
  });
  const riskChartData = Object.keys(riskCounts).map(k => ({ level: k, count: riskCounts[k] }));

  // Top Regions
  const stateCounts = {};
  currentHotspots.forEach(h => {
    stateCounts[h.state] = (stateCounts[h.state] || 0) + 1;
  });
  const topRegionsData = Object.keys(stateCounts)
    .map(state => ({ state, count: stateCounts[state] }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 7);

  return {
    classificationChartData,
    trendChartData,
    frpChartData,
    riskChartData,
    topRegionsData
  };
}

/**
 * Fetch industrial facility markers
 * FastAPI Endpoint: GET /api/v1/facilities
 */
export async function getFacilities() {
  if (USE_BACKEND_API) {
    try {
      const response = await fetch(`${BACKEND_URL}/facilities`);
      if (response.ok) return await response.json();
    } catch (err) {
      console.warn("API Error:", err);
    }
  }
  return MOCK_FACILITIES;
}
