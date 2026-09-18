import React, { useEffect, useState } from 'react';
import { X, MapPin, Satellite, Factory, History, Brain, Copy, Check, ShieldAlert, Sparkles, Flame, TrendingUp, Navigation, Wind, Users, Hospital, Activity } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { getHotspotForecast, getHotspotEmergencyRoute, getHotspotPlumeExposure } from '../services/api';

export default function HotspotDetailsDrawer({
  hotspot,
  onClose,
  onToggleEmergencyRoute,
  onTogglePlume,
  activeEmergencyRoute,
  activePlumeData
}) {
  const [copied, setCopied] = useState(false);
  const [forecast, setForecast] = useState(null);
  const [routeInfo, setRouteInfo] = useState(null);
  const [plumeInfo, setPlumeInfo] = useState(null);
  const [loadingMetrics, setLoadingMetrics] = useState(false);

  useEffect(() => {
    if (!hotspot) return;

    let isMounted = true;
    setLoadingMetrics(true);

    Promise.all([
      getHotspotForecast(hotspot.id, hotspot),
      getHotspotEmergencyRoute(hotspot.id, hotspot),
      getHotspotPlumeExposure(hotspot.id, hotspot)
    ]).then(([fData, rData, pData]) => {
      if (isMounted) {
        setForecast(fData);
        setRouteInfo(rData);
        setPlumeInfo(pData);
        setLoadingMetrics(false);
      }
    }).catch(err => {
      console.warn("Drawer metrics fetch error:", err);
      if (isMounted) setLoadingMetrics(false);
    });

    return () => { isMounted = false; };
  }, [hotspot?.id]);

  if (!hotspot) return null;

  const handleCopyCoords = () => {
    navigator.clipboard.writeText(`${hotspot.latitude}, ${hotspot.longitude}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getRiskBadgeColor = (level) => {
    switch (level) {
      case 'High': return 'bg-red-950/80 text-red-400 border-red-800';
      case 'Medium': return 'bg-orange-950/80 text-orange-400 border-orange-800';
      default: return 'bg-slate-800 text-slate-300 border-slate-700';
    }
  };

  const getClassificationIcon = (type) => {
    switch (type) {
      case 'Industrial Fire': return '🏭';
      case 'Persistent Thermal Source': return '🟠';
      case 'Forest / Wildfire': return '🌲';
      case 'Agricultural Burning': return '🌾';
      default: return '⚪';
    }
  };

  const isRouteActive = activeEmergencyRoute && activeEmergencyRoute.hotspot_id === hotspot.id;
  const isPlumeActive = activePlumeData && activePlumeData.hotspot_id === hotspot.id;

  return (
    <div className="absolute top-0 right-0 h-full w-full sm:w-[420px] md:w-[460px] bg-dark-900/95 backdrop-blur-xl border-l border-dark-750 shadow-2xl z-[1500] flex flex-col overflow-hidden animate-in slide-in-from-right duration-300 select-none">
      
      {/* Drawer Header */}
      <div className="p-4 border-b border-dark-750 bg-dark-950 flex items-center justify-between">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-md bg-orange-950 border border-orange-700/60 flex items-center justify-center text-orange-400 font-bold font-mono text-sm">
            {hotspot.id.substring(3)}
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-mono font-bold text-sm text-slate-100">{hotspot.id}</span>
              <span className={`px-2 py-0.5 text-[10px] font-bold uppercase rounded border ${getRiskBadgeColor(hotspot.risk_level)}`}>
                {hotspot.risk_level} Risk
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-mono">
              Detected: {hotspot.acq_date} @ {hotspot.acq_time} UTC
            </p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="p-1.5 text-slate-400 hover:text-white bg-dark-850 hover:bg-dark-750 rounded border border-dark-700 transition-colors"
          title="Close details panel"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Drawer Content Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-5 text-xs text-slate-300">

        {/* 1. HOTSPOT OVERVIEW & RISK SCORE GAUGE */}
        <div className="bg-dark-850 border border-dark-750 rounded-lg p-3.5 space-y-3">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[10px] font-semibold font-mono text-slate-400 uppercase tracking-wider block">
                AI Classification
              </span>
              <h3 className="text-base font-bold text-white flex items-center gap-1.5 mt-0.5">
                <span>{getClassificationIcon(hotspot.classification)}</span>
                <span>{hotspot.classification}</span>
              </h3>
            </div>
            <div className="text-right">
              <span className="text-[10px] font-semibold font-mono text-slate-400 uppercase tracking-wider block">
                Model Confidence
              </span>
              <span className="text-sm font-bold font-mono text-emerald-400">
                {Math.round(hotspot.ai_confidence * 100)}%
              </span>
            </div>
          </div>

          {/* Risk Score Progress Gauge */}
          <div>
            <div className="flex justify-between items-center text-[11px] font-mono mb-1">
              <span className="text-slate-400">Risk Assessment Score:</span>
              <span className="font-bold text-orange-400">{hotspot.risk_score} / 100</span>
            </div>
            <div className="w-full h-2 bg-dark-950 rounded-full overflow-hidden border border-dark-750">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  hotspot.risk_score >= 75
                    ? 'bg-gradient-to-r from-orange-500 to-red-600'
                    : hotspot.risk_score >= 50
                    ? 'bg-gradient-to-r from-yellow-500 to-orange-500'
                    : 'bg-emerald-500'
                }`}
                style={{ width: `${hotspot.risk_score}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* 🌟 NEW FEATURE 1: PREDICTIVE FRP ESCALATION ENGINE */}
        <div>
          <h4 className="text-[11px] font-bold font-mono uppercase tracking-wider text-orange-400 mb-2 flex items-center gap-1.5">
            <TrendingUp className="w-3.5 h-3.5" /> Predictive Escalation Engine
          </h4>
          <div className="bg-dark-850 border border-dark-750 rounded-lg p-3 space-y-2.5">
            {forecast ? (
              <>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-slate-400 font-mono uppercase">Escalation Trajectory</span>
                  <span className={`px-2 py-0.5 text-[10px] font-bold font-mono rounded border ${
                    forecast.escalation_status === 'ESCALATING' 
                      ? 'bg-red-950 text-red-400 border-red-800 animate-pulse' 
                      : forecast.escalation_status === 'STABLE'
                      ? 'bg-orange-950 text-orange-400 border-orange-800'
                      : 'bg-emerald-950 text-emerald-400 border-emerald-800'
                  }`}>
                    {forecast.escalation_status === 'ESCALATING' ? '🔥 ESCALATING' : '🟢 STABLE'}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 font-mono text-center pt-1 border-t border-dark-750">
                  <div className="bg-dark-950 p-2 rounded border border-dark-750">
                    <span className="text-[9px] text-slate-400 block">d(FRP)/dt</span>
                    <span className={`font-bold text-xs ${forecast.frp_velocity > 0 ? 'text-red-400' : 'text-emerald-400'}`}>
                      {forecast.frp_velocity > 0 ? `+${forecast.frp_velocity}` : forecast.frp_velocity} MW/h
                    </span>
                  </div>
                  <div className="bg-dark-950 p-2 rounded border border-dark-750">
                    <span className="text-[9px] text-slate-400 block">+2h Forecast</span>
                    <span className="font-bold text-xs text-orange-400">{forecast.predicted_frp_2h} MW</span>
                  </div>
                  <div className="bg-dark-950 p-2 rounded border border-dark-750">
                    <span className="text-[9px] text-slate-400 block">+4h Forecast</span>
                    <span className="font-bold text-xs text-red-400">{forecast.predicted_frp_4h} MW</span>
                  </div>
                </div>

                {forecast.time_to_critical_threshold_mins !== null && forecast.time_to_critical_threshold_mins !== undefined && (
                  <div className="bg-red-950/60 border border-red-800/80 rounded p-2 flex items-center justify-between text-[11px] font-mono">
                    <span className="text-red-300">Time to Critical Danger (&gt;120 MW):</span>
                    <span className="font-bold text-red-400">{forecast.time_to_critical_threshold_mins} mins</span>
                  </div>
                )}

                <p className="text-[10px] text-slate-400 font-sans italic border-l-2 border-orange-500 pl-2">
                  {forecast.recommendation}
                </p>
              </>
            ) : (
              <div className="text-slate-400 text-center font-mono py-2">Calculating satellite trend...</div>
            )}
          </div>
        </div>

        {/* 🌟 NEW FEATURE 2: CAPACITY-AWARE EMERGENCY ROUTING (OSRM) */}
        <div>
          <h4 className="text-[11px] font-bold font-mono uppercase tracking-wider text-cyan-400 mb-2 flex items-center gap-1.5">
            <Navigation className="w-3.5 h-3.5" /> Capacity-Aware OSRM Emergency Response
          </h4>
          <div className="bg-dark-850 border border-cyan-950/80 border-dark-750 rounded-lg p-3 space-y-2.5">
            {routeInfo ? (
              <>
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] text-slate-400 font-mono block">Designated Fire Station</span>
                    <h5 className="font-bold text-slate-100 text-xs">{routeInfo.assigned_station.name}</h5>
                    <span className="px-1.5 py-0.5 text-[9px] font-mono font-bold bg-cyan-950 text-cyan-400 border border-cyan-800/80 rounded inline-block mt-1">
                      🚒 {routeInfo.assigned_station.type}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 font-mono text-xs pt-1 border-t border-dark-750">
                  <div className="bg-dark-950 p-2 rounded border border-dark-750">
                    <span className="text-[9px] text-slate-400 block">OSRM Road Distance</span>
                    <span className="font-bold text-cyan-400 text-sm">{routeInfo.road_dist_km} km</span>
                    <span className="text-[9px] text-slate-500 block">vs {routeInfo.haversine_dist_km} km straight</span>
                  </div>
                  <div className="bg-dark-950 p-2 rounded border border-dark-750">
                    <span className="text-[9px] text-slate-400 block">Emergency Drive ETA</span>
                    <span className="font-bold text-emerald-400 text-sm">{routeInfo.duration_mins} mins</span>
                    <span className="text-[9px] text-slate-500 block">OSRM Network Speed</span>
                  </div>
                </div>

                <p className="text-[10px] text-slate-400 font-mono">
                  <span className="text-cyan-400 font-bold">Match Rationale:</span> {routeInfo.match_rationale}
                </p>

                <button
                  onClick={() => onToggleEmergencyRoute(isRouteActive ? null : routeInfo)}
                  className={`w-full py-1.5 font-mono text-[11px] font-bold rounded transition-colors flex items-center justify-center gap-1.5 ${
                    isRouteActive 
                      ? 'bg-cyan-950 text-cyan-300 border border-cyan-700' 
                      : 'bg-cyan-600 hover:bg-cyan-500 text-white'
                  }`}
                >
                  <Navigation className="w-3.5 h-3.5" />
                  <span>{isRouteActive ? 'Hide OSRM Route Polyline' : 'Show OSRM Response Route on GIS Map'}</span>
                </button>
              </>
            ) : (
              <div className="text-slate-400 text-center font-mono py-2">Querying OSRM road network...</div>
            )}
          </div>
        </div>

        {/* 🌟 NEW FEATURE 3: DOWNWIND TOXIC PLUME & COMMUNITY EXPOSURE MODELING */}
        <div>
          <h4 className="text-[11px] font-bold font-mono uppercase tracking-wider text-red-400 mb-2 flex items-center gap-1.5">
            <Wind className="w-3.5 h-3.5" /> Toxic Plume & Community Exposure
          </h4>
          <div className="bg-dark-850 border border-red-950/80 border-dark-750 rounded-lg p-3 space-y-2.5">
            {plumeInfo ? (
              <>
                <div className="grid grid-cols-2 gap-2 font-mono text-xs">
                  <div className="bg-dark-950 p-2 rounded border border-dark-750">
                    <span className="text-[9px] text-slate-400 block">Wind Vector (Open-Meteo)</span>
                    <span className="font-bold text-slate-100 text-xs">{plumeInfo.wind_speed_kmh} km/h</span>
                    <span className="text-[9px] text-orange-400 font-bold block">{plumeInfo.wind_cardinal} ({plumeInfo.wind_direction_deg}°)</span>
                  </div>
                  <div className="bg-dark-950 p-2 rounded border border-dark-750">
                    <span className="text-[9px] text-slate-400 block">Downwind Corridor</span>
                    <span className="font-bold text-red-400 text-xs">{plumeInfo.plume_reach_km} km</span>
                    <span className="text-[9px] text-slate-500 block">35° Dispersion Wedge</span>
                  </div>
                </div>

                <div className="bg-red-950/50 border border-red-900/80 rounded p-2.5 space-y-1">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-red-300 font-semibold flex items-center gap-1">
                      <Users className="w-3.5 h-3.5 text-red-400" /> Estimated Exposed Citizens:
                    </span>
                    <span className="font-bold text-red-400 text-sm">~{plumeInfo.estimated_exposed_population.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
                    <span>Impacted Residential Structures:</span>
                    <span className="font-bold text-slate-200">~{plumeInfo.estimated_exposed_structures.toLocaleString()}</span>
                  </div>
                </div>

                {plumeInfo.impacted_facilities && plumeInfo.impacted_facilities.length > 0 && (
                  <div className="space-y-1 pt-1 font-mono text-[10px]">
                    <span className="text-slate-400 block font-bold">Sensors & Critical Facilities in Corridor:</span>
                    {plumeInfo.impacted_facilities.map((fac, idx) => (
                      <div key={idx} className="flex items-center justify-between bg-dark-950 px-2 py-1 rounded border border-dark-750 text-slate-300">
                        <span>{fac.type === 'Hospital' ? '🏥' : fac.type === 'School' ? '🏫' : '🏘️'} {fac.name}</span>
                        <span className="text-red-400 font-bold">{fac.distance_km} km ({fac.impact_level})</span>
                      </div>
                    ))}
                  </div>
                )}

                <button
                  onClick={() => onTogglePlume(isPlumeActive ? null : plumeInfo)}
                  className={`w-full py-1.5 font-mono text-[11px] font-bold rounded transition-colors flex items-center justify-center gap-1.5 ${
                    isPlumeActive 
                      ? 'bg-red-950 text-red-300 border border-red-700' 
                      : 'bg-red-600 hover:bg-red-500 text-white'
                  }`}
                >
                  <Wind className="w-3.5 h-3.5" />
                  <span>{isPlumeActive ? 'Hide Toxic Smoke Plume' : 'Show Downwind Smoke Plume on Map'}</span>
                </button>
              </>
            ) : (
              <div className="text-slate-400 text-center font-mono py-2">Fetching live wind dispersion model...</div>
            )}
          </div>
        </div>

        {/* 2. LOCATION METRICS */}
        <div>
          <h4 className="text-[11px] font-bold font-mono uppercase tracking-wider text-orange-400 mb-2 flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5" /> Geographic Location
          </h4>
          <div className="bg-dark-850 border border-dark-750 rounded-lg p-3 grid grid-cols-2 gap-2.5 font-mono">
            <div>
              <span className="text-[10px] text-slate-400 block">Latitude</span>
              <span className="text-slate-100 font-bold text-xs">{hotspot.latitude.toFixed(4)} N</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block">Longitude</span>
              <span className="text-slate-100 font-bold text-xs">{hotspot.longitude.toFixed(4)} E</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block">Nearest City</span>
              <span className="text-slate-200 font-semibold">{hotspot.city}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block">Region / State</span>
              <span className="text-slate-200 font-semibold">{hotspot.state}, {hotspot.country}</span>
            </div>
            <div className="col-span-2 pt-1 border-t border-dark-750/60 flex items-center justify-between">
              <span className="text-[10px] text-slate-400">Quick Copy Coordinates:</span>
              <button
                onClick={handleCopyCoords}
                className="flex items-center space-x-1 text-[10px] text-orange-400 hover:text-orange-300 font-semibold"
              >
                {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copied ? 'Copied!' : 'Copy Coords'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* 3. NASA FIRMS DATA */}
        <div>
          <h4 className="text-[11px] font-bold font-mono uppercase tracking-wider text-orange-400 mb-2 flex items-center gap-1.5">
            <Satellite className="w-3.5 h-3.5" /> NASA FIRMS Telemetry
          </h4>
          <div className="bg-dark-850 border border-dark-750 rounded-lg p-3 grid grid-cols-2 gap-3 font-mono">
            <div>
              <span className="text-[10px] text-slate-400 block">Detection Date</span>
              <span className="text-slate-100 font-semibold">{hotspot.acq_date}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block">Detection Time</span>
              <span className="text-slate-100 font-semibold">{hotspot.acq_time} UTC</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block">Satellite / Sensor</span>
              <span className="text-slate-100 font-semibold">{hotspot.satellite} ({hotspot.instrument})</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block">NASA Confidence</span>
              <span className="text-emerald-400 font-bold">{hotspot.confidence}%</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block">Brightness Temp</span>
              <span className="text-yellow-400 font-bold">{hotspot.brightness} K</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block">Fire Power (FRP)</span>
              <span className="text-red-400 font-bold text-xs">{hotspot.frp} MW</span>
            </div>
          </div>
        </div>

        {/* 4. HISTORICAL ACTIVITY */}
        <div>
          <h4 className="text-[11px] font-bold font-mono uppercase tracking-wider text-orange-400 mb-2 flex items-center gap-1.5">
            <History className="w-3.5 h-3.5" /> Historical Telemetry & Persistence
          </h4>
          <div className="bg-dark-850 border border-dark-750 rounded-lg p-3 space-y-3">
            <div className="grid grid-cols-3 gap-2 text-center font-mono border-b border-dark-750 pb-2">
              <div className="bg-dark-950 p-1.5 rounded border border-dark-750">
                <span className="text-[10px] text-slate-400 block">Total Passes</span>
                <span className="text-sm font-bold text-white">{hotspot.total_detections}</span>
              </div>
              <div className="bg-dark-950 p-1.5 rounded border border-dark-750">
                <span className="text-[10px] text-slate-400 block">Active Days</span>
                <span className="text-sm font-bold text-white">{hotspot.active_days}</span>
              </div>
              <div className="bg-dark-950 p-1.5 rounded border border-dark-750">
                <span className="text-[10px] text-slate-400 block">Persistence</span>
                <span className="text-sm font-bold text-orange-400">{Math.round(hotspot.persistence * 100)}%</span>
              </div>
            </div>

            {hotspot.historical_trend && (
              <div>
                <span className="text-[10px] font-mono text-slate-400 block mb-1">FRP Intensity Trend (MW)</span>
                <div className="h-20 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={hotspot.historical_trend}>
                      <XAxis dataKey="date" stroke="#64748b" fontSize={9} />
                      <YAxis stroke="#64748b" fontSize={9} />
                      <Tooltip
                        contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', fontSize: '10px' }}
                      />
                      <Bar dataKey="frp" fill="#f97316" radius={[2, 2, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 5. AI ANALYSIS & EXPLANATION */}
        <div>
          <h4 className="text-[11px] font-bold font-mono uppercase tracking-wider text-orange-400 mb-2 flex items-center gap-1.5">
            <Brain className="w-3.5 h-3.5 text-orange-400" /> AI Classification Rationale
          </h4>
          <div className="bg-dark-850 border border-dark-750 rounded-lg p-3 space-y-2 font-sans">
            <p className="text-[11px] font-semibold text-slate-300 mb-1 font-mono">
              Why was this classified as <span className="text-orange-400">{hotspot.classification}</span>?
            </p>
            <ul className="space-y-1.5 text-[11px]">
              {hotspot.ai_rationale.map((reason, idx) => (
                <li key={idx} className="flex items-start space-x-2 text-slate-300">
                  <Sparkles className="w-3.5 h-3.5 text-orange-400 shrink-0 mt-0.5" />
                  <span>{reason}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

      </div>

      {/* Drawer Footer Actions */}
      <div className="p-3 border-t border-dark-750 bg-dark-950 flex items-center justify-between font-mono text-xs">
        <span className="text-slate-400 text-[10px]">Status: Active Intelligence Monitoring</span>
        <button
          onClick={onClose}
          className="px-3 py-1.5 bg-dark-800 hover:bg-dark-750 text-slate-200 border border-dark-700 rounded transition-colors"
        >
          Close Panel
        </button>
      </div>
    </div>
  );
}

