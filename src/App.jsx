import React, { useState, useEffect, useMemo } from 'react';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import StatisticsCards from './components/StatisticsCards';
import GISMap from './components/MapView/GISMap';
import HotspotDetailsDrawer from './components/HotspotDetailsDrawer';
import AnalyticsModal from './components/AnalyticsModal';
import SihInfoModal from './components/SihInfoModal';
import NotificationsPopover from './components/NotificationsPopover';
import { getHotspots, getFacilities, getStatistics, getAnalytics } from './services/api';

const DEFAULT_FILTERS = {
  startDate: "2026-08-01",
  endDate: "2026-09-05",
  classification: "All",
  risk_level: "All",
  confidence: "All",
  satellite: "All",
  persistence: "All",
  facility_type: "All",
  quickFilter: null
};

export default function App() {
  const [allHotspots, setAllHotspots] = useState([]);
  const [facilities, setFacilities] = useState([]);
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [selectedHotspot, setSelectedHotspot] = useState(null);
  const [activeEmergencyRoute, setActiveEmergencyRoute] = useState(null);
  const [activePlumeData, setActivePlumeData] = useState(null);

  // Clear route/plume overlays when selected hotspot changes
  const handleSelectHotspot = (hotspot) => {
    setSelectedHotspot(hotspot);
    setActiveEmergencyRoute(null);
    setActivePlumeData(null);
  };

  
  // UI State
  const [liveMode, setLiveMode] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [isAnalyticsOpen, setIsAnalyticsOpen] = useState(false);
  const [isSihInfoOpen, setIsSihInfoOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  
  // Simulated Notifications Feed
  const [alerts, setAlerts] = useState([
    {
      id: "HS-2026-0102",
      time: "11:15 UTC",
      title: "High Risk Industrial Fire Detected",
      message: "Ankleshwar GIDC Chemical Complex - FRP 112.6 MW",
      frp: 112.6,
      hotspotId: "HS-2026-0102"
    },
    {
      id: "HS-2026-0402",
      time: "12:55 UTC",
      title: "Severe FRP Spike near Refinery",
      message: "Mathura Oil Refinery distillation unit - FRP 104.3 MW",
      frp: 104.3,
      hotspotId: "HS-2026-0402"
    },
    {
      id: "HS-2026-0101",
      time: "14:32 UTC",
      title: "Trombay Refinery Thermal Anomaly",
      message: "Repeat flare signature within 1.2 km of storage tank",
      frp: 84.2,
      hotspotId: "HS-2026-0101"
    }
  ]);

  // Initial Data Load
  useEffect(() => {
    async function loadInitialData() {
      const facilitiesData = await getFacilities();
      setFacilities(facilitiesData);

      const hotspotsData = await getHotspots();
      setAllHotspots(hotspotsData);
    }
    loadInitialData();
  }, []);

  // Filter Calculation
  const filteredHotspots = useMemo(() => {
    let result = [...allHotspots];

    if (filters.classification && filters.classification !== "All") {
      result = result.filter(h => h.classification === filters.classification);
    }

    if (filters.risk_level && filters.risk_level !== "All") {
      result = result.filter(h => h.risk_level === filters.risk_level);
    }

    if (filters.confidence && filters.confidence !== "All") {
      if (filters.confidence === "High") result = result.filter(h => h.confidence >= 90);
      else if (filters.confidence === "Medium") result = result.filter(h => h.confidence >= 75 && h.confidence < 90);
      else if (filters.confidence === "Low") result = result.filter(h => h.confidence < 75);
    }

    if (filters.satellite && filters.satellite !== "All") {
      result = result.filter(h => h.satellite === filters.satellite);
    }

    if (filters.persistence && filters.persistence !== "All") {
      if (filters.persistence === "High") result = result.filter(h => h.persistence >= 0.70);
      else if (filters.persistence === "Medium") result = result.filter(h => h.persistence >= 0.40 && h.persistence < 0.70);
      else if (filters.persistence === "Low") result = result.filter(h => h.persistence < 0.40);
    }

    if (filters.facility_type && filters.facility_type !== "All") {
      result = result.filter(h => h.facility_type === filters.facility_type);
    }

    if (filters.quickFilter === "high_risk") {
      result = result.filter(h => h.risk_level === "High");
    } else if (filters.quickFilter === "persistent") {
      result = result.filter(h => h.classification === "Persistent Thermal Source" || h.persistence >= 0.70);
    } else if (filters.quickFilter === "proximity") {
      result = result.filter(h => h.distance_km <= 2.0);
    }

    return result;
  }, [allHotspots, filters]);

  // Statistics Calculation
  const statistics = useMemo(() => {
    const total = filteredHotspots.length;
    const industrialFires = filteredHotspots.filter(h => h.classification === "Industrial Fire").length;
    const persistentSources = filteredHotspots.filter(h => h.classification === "Persistent Thermal Source").length;
    const highRisk = filteredHotspots.filter(h => h.risk_level === "High").length;
    const activeToday = filteredHotspots.filter(h => h.acq_date === "2026-09-05").length;
    
    const totalFrp = filteredHotspots.reduce((sum, h) => sum + (h.frp || 0), 0);
    const avgFrp = total > 0 ? (totalFrp / total).toFixed(1) : "0.0";

    return { total, industrialFires, persistentSources, highRisk, activeToday, avgFrp };
  }, [filteredHotspots]);

  // Analytics Calculation
  const analyticsData = useMemo(() => {
    const classificationCounts = {
      "Industrial Fire": 0,
      "Persistent Thermal Source": 0,
      "Forest / Wildfire": 0,
      "Agricultural Burning": 0,
      "Other / Unknown": 0
    };

    filteredHotspots.forEach(h => {
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

    const dates = ["09-01", "09-02", "09-03", "09-04", "09-05"];
    const trendChartData = dates.map(d => {
      const modisCount = filteredHotspots.filter(h => h.satellite === "MODIS").length;
      const viirsCount = filteredHotspots.filter(h => h.satellite === "VIIRS").length;
      return {
        date: d,
        MODIS: Math.round(modisCount * 0.4),
        VIIRS: Math.round(viirsCount * 0.6)
      };
    });

    const frpBuckets = { "< 25 MW": 0, "25-50 MW": 0, "50-75 MW": 0, "75-100 MW": 0, "> 100 MW": 0 };
    filteredHotspots.forEach(h => {
      if (h.frp < 25) frpBuckets["< 25 MW"]++;
      else if (h.frp < 50) frpBuckets["25-50 MW"]++;
      else if (h.frp < 75) frpBuckets["50-75 MW"]++;
      else if (h.frp < 100) frpBuckets["75-100 MW"]++;
      else frpBuckets["> 100 MW"]++;
    });
    const frpChartData = Object.keys(frpBuckets).map(k => ({ range: k, count: frpBuckets[k] }));

    const riskCounts = { High: 0, Medium: 0, Low: 0 };
    filteredHotspots.forEach(h => {
      if (riskCounts[h.risk_level] !== undefined) riskCounts[h.risk_level]++;
    });
    const riskChartData = Object.keys(riskCounts).map(k => ({ level: k, count: riskCounts[k] }));

    const stateCounts = {};
    filteredHotspots.forEach(h => {
      stateCounts[h.state] = (stateCounts[h.state] || 0) + 1;
    });
    const topRegionsData = Object.keys(stateCounts)
      .map(state => ({ state, count: stateCounts[state] }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 6);

    return { classificationChartData, trendChartData, frpChartData, riskChartData, topRegionsData };
  }, [filteredHotspots]);

  // Live Mode Refresh Simulation
  useEffect(() => {
    if (!liveMode) return;
    const interval = setInterval(() => {
      setLastUpdated(new Date());
    }, 15000);
    return () => clearInterval(interval);
  }, [liveMode]);

  // Active filter counter
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters.classification !== "All") count++;
    if (filters.risk_level !== "All") count++;
    if (filters.confidence !== "All") count++;
    if (filters.satellite !== "All") count++;
    if (filters.persistence !== "All") count++;
    if (filters.facility_type !== "All") count++;
    if (filters.quickFilter) count++;
    return count;
  }, [filters]);

  const handleSelectAlert = (alert) => {
    const found = allHotspots.find(h => h.id === alert.hotspotId);
    if (found) {
      handleSelectHotspot(found);
    }
  };


  return (
    <div className="flex flex-col h-screen w-screen bg-dark-950 text-slate-100 overflow-hidden font-sans">
      
      {/* Top Navbar */}
      <Navbar
        liveMode={liveMode}
        setLiveMode={setLiveMode}
        lastUpdated={lastUpdated}
        onRefresh={() => setLastUpdated(new Date())}
        onOpenAnalytics={() => setIsAnalyticsOpen(true)}
        onOpenSihInfo={() => setIsSihInfoOpen(true)}
        onOpenNotifications={() => setIsNotificationsOpen(!isNotificationsOpen)}
        unreadAlertCount={alerts.length}
      />

      {/* Dynamic Summary KPI Cards */}
      <StatisticsCards statistics={statistics} />

      {/* Main Workspace Area (Sidebar + GIS Map + Hotspot Drawer) */}
      <div className="flex-1 flex overflow-hidden relative">
        
        {/* Left Filter Sidebar */}
        <Sidebar
          filters={filters}
          onFilterChange={setFilters}
          onResetFilters={() => setFilters(DEFAULT_FILTERS)}
          activeFilterCount={activeFilterCount}
          totalHotspotsCount={allHotspots.length}
          filteredCount={filteredHotspots.length}
        />

        {/* Main Interactive GIS Map */}
        <main className="flex-1 h-full relative overflow-hidden">
          <GISMap
            hotspots={filteredHotspots}
            facilities={facilities}
            selectedHotspot={selectedHotspot}
            onSelectHotspot={handleSelectHotspot}
            activeClassificationFilter={filters.classification}
            onSelectClassificationFilter={(val) => setFilters({ ...filters, classification: val })}
            activeEmergencyRoute={activeEmergencyRoute}
            activePlumeData={activePlumeData}
          />

          {/* Right Hotspot Details Slide-over Panel */}
          {selectedHotspot && (
            <HotspotDetailsDrawer
              hotspot={selectedHotspot}
              onClose={() => handleSelectHotspot(null)}
              onToggleEmergencyRoute={setActiveEmergencyRoute}
              onTogglePlume={setActivePlumeData}
              activeEmergencyRoute={activeEmergencyRoute}
              activePlumeData={activePlumeData}
            />
          )}

          {/* Notifications Popover */}
          <NotificationsPopover
            isOpen={isNotificationsOpen}
            onClose={() => setIsNotificationsOpen(false)}
            alerts={alerts}
            onSelectAlert={handleSelectAlert}
          />
        </main>

      </div>

      {/* Fullscreen Analytics Modal */}
      <AnalyticsModal
        isOpen={isAnalyticsOpen}
        onClose={() => setIsAnalyticsOpen(false)}
        analyticsData={analyticsData}
        totalCount={filteredHotspots.length}
      />

      {/* SIH Info & Pipeline Modal */}
      <SihInfoModal
        isOpen={isSihInfoOpen}
        onClose={() => setIsSihInfoOpen(false)}
      />

    </div>
  );
}
