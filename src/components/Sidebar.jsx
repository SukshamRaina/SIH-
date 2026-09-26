import React from 'react';
import { Filter, RotateCcw, Calendar, Layers, ShieldAlert, Cpu, Satellite, Activity, Factory, Zap, CheckCircle2 } from 'lucide-react';

export default function Sidebar({
  filters,
  onFilterChange,
  onResetFilters,
  activeFilterCount,
  totalHotspotsCount,
  filteredCount
}) {
  const handleChange = (field, value) => {
    onFilterChange({ ...filters, [field]: value });
  };

  const handleQuickFilterToggle = (quickFilterKey) => {
    if (filters.quickFilter === quickFilterKey) {
      onFilterChange({ ...filters, quickFilter: null });
    } else {
      onFilterChange({ ...filters, quickFilter: quickFilterKey });
    }
  };

  return (
    <aside className="w-[300px] shrink-0 bg-dark-900 border-r border-dark-750 flex flex-col h-full overflow-hidden select-none z-20">
      {/* Header */}
      <div className="p-3.5 border-b border-dark-750 flex items-center justify-between bg-dark-950/80">
        <div className="flex items-center space-x-2">
          <Filter className="w-4 h-4 text-orange-400" />
          <h2 className="text-sm font-bold text-slate-100 font-sans tracking-wide">
            Filter Hotspots
          </h2>
          {activeFilterCount > 0 && (
            <span className="px-2 py-0.5 text-[10px] font-bold bg-orange-950 text-orange-400 border border-orange-800/60 rounded-full font-mono">
              {activeFilterCount} active
            </span>
          )}
        </div>
        <button
          onClick={onResetFilters}
          className="flex items-center space-x-1 text-xs text-slate-400 hover:text-orange-400 transition-colors font-sans"
          title="Reset all filters to default"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset</span>
        </button>
      </div>

      {/* Filter Options Scroll Area */}
      <div className="flex-1 overflow-y-auto p-3.5 space-y-4 text-xs font-sans">

        {/* QUICK PRESETS */}
        <div>
          <label className="text-[11px] font-semibold text-slate-300 uppercase tracking-wider block mb-2 font-mono flex items-center gap-1">
            <Zap className="w-3 h-3 text-yellow-400" /> Quick Smart Filters
          </label>
          <div className="grid grid-cols-1 gap-1.5 font-sans">
            <button
              onClick={() => handleQuickFilterToggle('high_risk')}
              className={`flex items-center justify-between px-3 py-2 rounded-lg border text-left transition-all ${
                filters.quickFilter === 'high_risk'
                  ? 'bg-red-950/80 border-red-700 text-red-300 font-semibold shadow-sm'
                  : 'bg-dark-850 border-dark-750 text-slate-300 hover:border-dark-700 hover:bg-dark-800'
              }`}
            >
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                <span>Critical / High Risk Only</span>
              </span>
              {filters.quickFilter === 'high_risk' && <CheckCircle2 className="w-4 h-4 text-red-400" />}
            </button>

            <button
              onClick={() => handleQuickFilterToggle('persistent')}
              className={`flex items-center justify-between px-3 py-2 rounded-lg border text-left transition-all ${
                filters.quickFilter === 'persistent'
                  ? 'bg-orange-950/80 border-orange-700 text-orange-300 font-semibold shadow-sm'
                  : 'bg-dark-850 border-dark-750 text-slate-300 hover:border-dark-700 hover:bg-dark-800'
              }`}
            >
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-orange-500"></span>
                <span>Continuous Thermal Flares</span>
              </span>
              {filters.quickFilter === 'persistent' && <CheckCircle2 className="w-4 h-4 text-orange-400" />}
            </button>

            <button
              onClick={() => handleQuickFilterToggle('proximity')}
              className={`flex items-center justify-between px-3 py-2 rounded-lg border text-left transition-all ${
                filters.quickFilter === 'proximity'
                  ? 'bg-blue-950/80 border-blue-700 text-blue-300 font-semibold shadow-sm'
                  : 'bg-dark-850 border-dark-750 text-slate-300 hover:border-dark-700 hover:bg-dark-800'
              }`}
            >
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-blue-400"></span>
                <span>Near Industrial Sites (≤ 2 km)</span>
              </span>
              {filters.quickFilter === 'proximity' && <CheckCircle2 className="w-4 h-4 text-blue-400" />}
            </button>
          </div>
        </div>

        <hr className="border-dark-750" />

        {/* DATE RANGE */}
        <div>
          <label className="text-[11px] font-semibold text-slate-300 uppercase tracking-wider block mb-1.5 font-mono flex items-center gap-1">
            <Calendar className="w-3 h-3 text-slate-400" /> Observation Date Range
          </label>
          <div className="grid grid-cols-2 gap-2 font-mono">
            <div>
              <span className="text-[10px] text-slate-400 block mb-0.5">From Date</span>
              <input
                type="date"
                value={filters.startDate || "2026-08-01"}
                onChange={(e) => handleChange('startDate', e.target.value)}
                className="w-full bg-dark-950 border border-dark-750 rounded-lg px-2.5 py-1.5 text-slate-200 text-[11px] focus:outline-none focus:border-orange-500"
              />
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block mb-0.5">To Date</span>
              <input
                type="date"
                value={filters.endDate || "2026-09-05"}
                onChange={(e) => handleChange('endDate', e.target.value)}
                className="w-full bg-dark-950 border border-dark-750 rounded-lg px-2.5 py-1.5 text-slate-200 text-[11px] focus:outline-none focus:border-orange-500"
              />
            </div>
          </div>
        </div>

        {/* CLASSIFICATION */}
        <div>
          <label className="text-[11px] font-semibold text-slate-300 uppercase tracking-wider block mb-1.5 font-mono flex items-center gap-1">
            <Layers className="w-3 h-3 text-slate-400" /> Classification Type
          </label>
          <select
            value={filters.classification || "All"}
            onChange={(e) => handleChange('classification', e.target.value)}
            className="w-full bg-dark-950 border border-dark-750 rounded-lg px-2.5 py-2 text-slate-200 focus:outline-none focus:border-orange-500 font-medium"
          >
            <option value="All">All Types & Sources</option>
            <option value="Industrial Fire">Industrial Fire 🔴</option>
            <option value="Persistent Thermal Source">Persistent Thermal Flare 🟠</option>
            <option value="Forest / Wildfire">Forest & Wildfire 🟡</option>
            <option value="Agricultural Burning">Agricultural Crop Burning 🟢</option>
          </select>
        </div>

        {/* RISK LEVEL */}
        <div>
          <label className="text-[11px] font-semibold text-slate-300 uppercase tracking-wider block mb-1.5 font-mono flex items-center gap-1">
            <ShieldAlert className="w-3 h-3 text-slate-400" /> Risk Severity Level
          </label>
          <select
            value={filters.risk_level || "All"}
            onChange={(e) => handleChange('risk_level', e.target.value)}
            className="w-full bg-dark-950 border border-dark-750 rounded-lg px-2.5 py-2 text-slate-200 focus:outline-none focus:border-orange-500 font-medium"
          >
            <option value="All">All Risk Severities</option>
            <option value="High">High Risk (Score ≥ 70)</option>
            <option value="Medium">Medium Risk (Score 45-69)</option>
            <option value="Low">Low Risk (Score &lt; 45)</option>
          </select>
        </div>

        {/* CONFIDENCE */}
        <div>
          <label className="text-[11px] font-semibold text-slate-300 uppercase tracking-wider block mb-1.5 font-mono flex items-center gap-1">
            <Cpu className="w-3 h-3 text-slate-400" /> Detection Confidence
          </label>
          <select
            value={filters.confidence || "All"}
            onChange={(e) => handleChange('confidence', e.target.value)}
            className="w-full bg-dark-950 border border-dark-750 rounded-lg px-2.5 py-2 text-slate-200 focus:outline-none focus:border-orange-500 font-medium"
          >
            <option value="All">All Confidence Levels</option>
            <option value="High">High Confidence (≥ 90%)</option>
            <option value="Medium">Medium Confidence (75-89%)</option>
            <option value="Low">Low Confidence (&lt; 75%)</option>
          </select>
        </div>

        {/* SATELLITE */}
        <div>
          <label className="text-[11px] font-semibold text-slate-300 uppercase tracking-wider block mb-1.5 font-mono flex items-center gap-1">
            <Satellite className="w-3 h-3 text-slate-400" /> Satellite Sensor
          </label>
          <select
            value={filters.satellite || "All"}
            onChange={(e) => handleChange('satellite', e.target.value)}
            className="w-full bg-dark-950 border border-dark-750 rounded-lg px-2.5 py-2 text-slate-200 focus:outline-none focus:border-orange-500 font-medium"
          >
            <option value="All">All Sensors (MODIS + VIIRS)</option>
            <option value="MODIS">MODIS (Aqua/Terra)</option>
            <option value="VIIRS">VIIRS (SNPP/NOAA-20)</option>
          </select>
        </div>

        {/* INDUSTRIAL FACILITY TYPE */}
        <div>
          <label className="text-[11px] font-semibold text-slate-300 uppercase tracking-wider block mb-1.5 font-mono flex items-center gap-1">
            <Factory className="w-3 h-3 text-slate-400" /> Facility Context
          </label>
          <select
            value={filters.facility_type || "All"}
            onChange={(e) => handleChange('facility_type', e.target.value)}
            className="w-full bg-dark-950 border border-dark-750 rounded-lg px-2.5 py-2 text-slate-200 focus:outline-none focus:border-orange-500 font-medium"
          >
            <option value="All">All Facility Contexts</option>
            <option value="Refinery">Petroleum Refinery 🛢️</option>
            <option value="Power Plant">Thermal Power Plant ⚡</option>
            <option value="Chemical Plant">Chemical Complex 🧪</option>
            <option value="Steel Plant">Steel & Metallurgy 🏗️</option>
          </select>
        </div>

      </div>

      {/* Footer Stats Summary */}
      <div className="p-3 border-t border-dark-750 bg-dark-950 text-slate-300 text-xs flex items-center justify-between font-sans">
        <span>Showing <strong className="text-orange-400 font-mono font-bold">{filteredCount.toLocaleString()}</strong> of <span className="font-mono text-slate-400">{totalHotspotsCount.toLocaleString()}</span></span>
        <button
          onClick={onResetFilters}
          className="text-slate-400 hover:text-white underline text-xs transition-colors"
        >
          Reset All
        </button>
      </div>
    </aside>
  );
}
