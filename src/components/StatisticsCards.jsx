import React, { useRef } from 'react';
import { Flame, Factory, Activity, AlertTriangle, Zap, Gauge, Upload, RefreshCw } from 'lucide-react';

export default function StatisticsCards({
  matchedCount = 0,
  statistics = {},
  onUploadFirmsCSV,
  onUploadOsmCSV,
  isLoadingCSVs = false
}) {
  const firmsInputRef = useRef(null);
  const osmInputRef = useRef(null);

  const handleFirmsFileChange = (e) => {
    const file = e.target.files[0];
    if (file && onUploadFirmsCSV) {
      onUploadFirmsCSV(file);
    }
  };

  const handleOsmFileChange = (e) => {
    const file = e.target.files[0];
    if (file && onUploadOsmCSV) {
      onUploadOsmCSV(file);
    }
  };

  const cards = [
    {
      id: 'total_hotspots',
      label: 'Total Hotspots',
      value: (matchedCount || statistics.total || 0).toLocaleString(),
      subtext: 'Joined Telemetry Dataset',
      icon: Flame,
      iconColor: 'text-amber-400',
      borderColor: 'border-amber-500/40',
      bgGlow: 'from-amber-950/30 to-dark-900',
      tag: 'Active',
      isPrimary: true,
      hasUpload: true
    },
    {
      id: 'industrial',
      label: 'Industrial Fires',
      value: (statistics.industrialFires || 0).toLocaleString(),
      subtext: 'Confirmed ML classification',
      icon: Factory,
      iconColor: 'text-red-500',
      borderColor: 'border-red-500/40',
      bgGlow: 'from-red-950/30 to-dark-900',
      tag: 'High FRP'
    },
    {
      id: 'persistent',
      label: 'Persistent Sources',
      value: (statistics.persistentSources || 0).toLocaleString(),
      subtext: 'High repeat thermal ratio',
      icon: Activity,
      iconColor: 'text-orange-400',
      borderColor: 'border-orange-500/30',
      bgGlow: 'from-orange-950/20 to-dark-900',
      tag: 'Thermal'
    },
    {
      id: 'high_risk',
      label: 'High Risk',
      value: (statistics.highRisk || 0).toLocaleString(),
      subtext: 'Risk Score ≥ 70/100',
      icon: AlertTriangle,
      iconColor: 'text-rose-500',
      borderColor: 'border-rose-500/40',
      bgGlow: 'from-rose-950/30 to-dark-900',
      tag: 'Urgent'
    },
    {
      id: 'active_today',
      label: 'Active Today',
      value: (statistics.activeToday || 0).toLocaleString(),
      subtext: 'Detected in last 24h',
      icon: Zap,
      iconColor: 'text-emerald-400',
      borderColor: 'border-emerald-500/30',
      bgGlow: 'from-emerald-950/20 to-dark-900',
      tag: 'Live'
    },
    {
      id: 'avg_frp',
      label: 'Average FRP',
      value: `${statistics.avgFrp || '0.0'} MW`,
      subtext: 'Fire Radiative Power',
      icon: Gauge,
      iconColor: 'text-cyan-400',
      borderColor: 'border-cyan-500/30',
      bgGlow: 'from-cyan-950/20 to-dark-900',
      tag: 'Intensity'
    }
  ];

  return (
    <div className="bg-dark-950 border-b border-dark-750 p-2.5 shrink-0 select-none z-10">
      {/* Hidden File Inputs for CSV Upload */}
      <input
        type="file"
        ref={firmsInputRef}
        onChange={handleFirmsFileChange}
        accept=".csv"
        className="hidden"
      />
      <input
        type="file"
        ref={osmInputRef}
        onChange={handleOsmFileChange}
        accept=".csv"
        className="hidden"
      />

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2.5">
        {cards.map((card) => {
          const IconComponent = card.icon;
          return (
            <div
              key={card.id}
              className={`relative bg-gradient-to-b ${card.bgGlow} border ${card.borderColor} rounded-lg p-2.5 flex flex-col justify-between shadow-md transition-all ${
                card.isPrimary ? 'ring-1 ring-amber-500/40' : ''
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold font-mono text-slate-300 uppercase tracking-wider truncate">
                  {card.label}
                </span>
                <div className="flex items-center space-x-1">
                  {card.hasUpload && (
                    <button
                      onClick={() => firmsInputRef.current?.click()}
                      className="p-1 hover:bg-dark-750 text-slate-400 hover:text-orange-400 rounded transition-colors"
                      title="Upload custom FIRMS/OSM CSV files"
                    >
                      <Upload className="w-3 h-3 text-slate-400 hover:text-orange-400" />
                    </button>
                  )}
                  <IconComponent className={`w-3.5 h-3.5 ${card.iconColor} shrink-0`} />
                </div>
              </div>

              <div className="my-1 flex items-baseline justify-between">
                <span className="text-xl font-bold font-mono text-white tracking-tight">
                  {isLoadingCSVs ? (
                    <span className="text-xs text-slate-400 animate-pulse flex items-center gap-1">
                      <RefreshCw className="w-3 h-3 animate-spin" /> Loading...
                    </span>
                  ) : (
                    card.value
                  )}
                </span>
                <span className="px-1.5 py-0.5 text-[9px] font-mono font-semibold rounded bg-dark-950/80 text-slate-300 border border-dark-750">
                  {card.tag}
                </span>
              </div>

              <span className="text-[10px] text-slate-400 font-mono truncate">
                {card.subtext}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
