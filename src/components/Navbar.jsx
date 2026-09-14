import React, { useState, useEffect } from 'react';
import { Flame, Radio, Clock, ShieldCheck, Bell, Settings, Info, BarChart2, RefreshCw } from 'lucide-react';

export default function Navbar({
  liveMode,
  setLiveMode,
  lastUpdated,
  onRefresh,
  onOpenAnalytics,
  onOpenSihInfo,
  onOpenNotifications,
  unreadAlertCount
}) {
  const [formattedTime, setFormattedTime] = useState('');

  useEffect(() => {
    const updateTimeString = () => {
      const now = new Date(lastUpdated);
      setFormattedTime(now.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' }) + ' UTC');
    };
    updateTimeString();
  }, [lastUpdated]);

  return (
    <header className="h-16 bg-dark-900 border-b border-dark-750 px-4 flex items-center justify-between z-30 shrink-0 select-none">
      {/* Left Branding */}
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-red-600 to-orange-600 flex items-center justify-center shadow-lg shadow-red-900/40 border border-red-500/30">
          <Flame className="w-6 h-6 text-white animate-pulse" />
        </div>
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-xl font-bold tracking-tight text-white font-mono flex items-center gap-1.5">
              Agni<span className="text-orange-500">Drishti</span>
            </h1>
            <span className="px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider bg-red-950/80 text-red-400 border border-red-800/60 rounded">
              SIH PS 162
            </span>
          </div>
          <p className="text-xs text-slate-400 font-medium hidden sm:block">
            Industrial Fire & Persistent Thermal Source Intelligence
          </p>
        </div>
      </div>

      {/* Center / Right Metadata Indicators */}
      <div className="flex items-center space-x-3 sm:space-x-4">
        {/* Live Indicator Switch */}
        <button
          onClick={() => setLiveMode(!liveMode)}
          className={`flex items-center space-x-2 px-3 py-1.5 rounded-md text-xs font-mono border transition-all ${
            liveMode
              ? 'bg-emerald-950/70 text-emerald-400 border-emerald-700/60 shadow-[0_0_12px_rgba(16,185,129,0.25)]'
              : 'bg-dark-800 text-slate-400 border-dark-700 hover:text-slate-200'
          }`}
          title="Toggle simulated real-time NASA FIRMS stream"
        >
          <span className="relative flex h-2 w-2">
            {liveMode && (
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            )}
            <span className={`relative inline-flex rounded-full h-2 w-2 ${liveMode ? 'bg-emerald-500' : 'bg-slate-500'}`}></span>
          </span>
          <span className="font-semibold">{liveMode ? 'LIVE FEED' : 'STANDBY'}</span>
        </button>

        {/* Timestamp */}
        <div className="hidden lg:flex items-center space-x-1.5 text-xs text-slate-400 font-mono bg-dark-950 px-2.5 py-1.5 rounded border border-dark-800">
          <Clock className="w-3.5 h-3.5 text-slate-500" />
          <span>Updated:</span>
          <span className="text-slate-200">{formattedTime}</span>
          <button 
            onClick={onRefresh} 
            className="ml-1 text-slate-400 hover:text-orange-400 transition-colors"
            title="Refresh thermal feed"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Data Source Badge */}
        <div className="hidden md:flex items-center space-x-1.5 text-xs bg-dark-850 border border-dark-750 px-2.5 py-1.5 rounded text-slate-300">
          <ShieldCheck className="w-3.5 h-3.5 text-orange-400" />
          <span>Source:</span>
          <span className="font-mono text-orange-300 font-semibold">NASA FIRMS + OSM</span>
        </div>

        {/* Analytics Action Button */}
        <button
          onClick={onOpenAnalytics}
          className="flex items-center space-x-1.5 px-3 py-1.5 bg-dark-800 hover:bg-dark-750 text-slate-200 border border-dark-700 rounded text-xs font-medium transition-colors"
        >
          <BarChart2 className="w-4 h-4 text-orange-400" />
          <span className="hidden sm:inline">Analytics</span>
        </button>

        {/* SIH Info Button */}
        <button
          onClick={onOpenSihInfo}
          className="p-2 bg-dark-800 hover:bg-dark-750 text-slate-300 border border-dark-700 rounded transition-colors"
          title="SIH Problem Statement Details & Architecture"
        >
          <Info className="w-4 h-4 text-blue-400" />
        </button>

        {/* Notifications Icon */}
        <button
          onClick={onOpenNotifications}
          className="relative p-2 bg-dark-800 hover:bg-dark-750 text-slate-300 border border-dark-700 rounded transition-colors"
          title="Telemetry Alert Feed"
        >
          <Bell className="w-4 h-4" />
          {unreadAlertCount > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-600 text-white rounded-full text-[10px] font-bold flex items-center justify-center animate-pulse">
              {unreadAlertCount}
            </span>
          )}
        </button>
      </div>
    </header>
  );
}
