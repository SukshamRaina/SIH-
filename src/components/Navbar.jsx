import React, { useState, useEffect } from 'react';
import { Flame, Clock, ShieldCheck, Bell, Info, BarChart2, RefreshCw } from 'lucide-react';

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
      setFormattedTime(now.toLocaleTimeString('en-US', { hour12: true, hour: '2-digit', minute: '2-digit' }));
    };
    updateTimeString();
  }, [lastUpdated]);

  return (
    <header className="h-16 bg-dark-900/90 backdrop-blur-md border-b border-dark-750 px-4 flex items-center justify-between z-30 shrink-0 select-none">
      {/* Left Branding */}
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 via-red-600 to-amber-600 flex items-center justify-center shadow-lg shadow-orange-950/50 border border-orange-400/30 transition-transform hover:scale-105">
          <Flame className="w-5 h-5 text-white" />
        </div>
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-lg font-bold tracking-tight text-white font-sans flex items-center gap-1">
              Agni<span className="text-orange-500 font-extrabold">Drishti</span>
            </h1>
            <span className="px-2 py-0.5 text-[10px] font-semibold bg-orange-950/80 text-orange-300 border border-orange-800/60 rounded-full font-mono">
              SIH 162
            </span>
          </div>
          <p className="text-xs text-slate-400 font-medium hidden sm:block">
            Industrial Thermal Intelligence Dashboard
          </p>
        </div>
      </div>

      {/* Center / Right Control Panel */}
      <div className="flex items-center space-x-2.5 sm:space-x-3.5">
        {/* Live Stream Mode Switch */}
        <button
          onClick={() => setLiveMode(!liveMode)}
          className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
            liveMode
              ? 'bg-emerald-950/70 text-emerald-300 border-emerald-700/60 shadow-[0_0_12px_rgba(16,185,129,0.2)]'
              : 'bg-dark-800 text-slate-400 border-dark-700 hover:text-slate-200'
          }`}
          title={liveMode ? "Live satellite feed active" : "Live stream paused"}
        >
          <span className="relative flex h-2 w-2">
            {liveMode && (
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            )}
            <span className={`relative inline-flex rounded-full h-2 w-2 ${liveMode ? 'bg-emerald-500' : 'bg-slate-500'}`}></span>
          </span>
          <span>{liveMode ? 'Live Feed' : 'Paused'}</span>
        </button>

        {/* Refresh Timestamp */}
        <div className="hidden lg:flex items-center space-x-2 text-xs text-slate-400 bg-dark-950/80 px-3 py-1.5 rounded-lg border border-dark-750">
          <Clock className="w-3.5 h-3.5 text-slate-400" />
          <span>Sync:</span>
          <span className="text-slate-200 font-semibold">{formattedTime}</span>
          <button 
            onClick={onRefresh} 
            className="ml-1 p-0.5 text-slate-400 hover:text-orange-400 transition-colors rounded"
            title="Refresh satellite data feed"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Data Source Badge */}
        <div className="hidden md:flex items-center space-x-1.5 text-xs bg-dark-850 border border-dark-750 px-3 py-1.5 rounded-lg text-slate-300">
          <ShieldCheck className="w-3.5 h-3.5 text-orange-400" />
          <span>Dataset:</span>
          <span className="font-semibold text-orange-300">NASA FIRMS + OSM</span>
        </div>

        {/* Analytics Action Button */}
        <button
          onClick={onOpenAnalytics}
          className="flex items-center space-x-1.5 px-3 py-1.5 bg-dark-800 hover:bg-dark-750 text-slate-200 border border-dark-700 rounded-lg text-xs font-medium transition-all hover:border-slate-600"
        >
          <BarChart2 className="w-4 h-4 text-orange-400" />
          <span className="hidden sm:inline">Analytics</span>
        </button>

        {/* Project Info Button */}
        <button
          onClick={onOpenSihInfo}
          className="p-2 bg-dark-800 hover:bg-dark-750 text-slate-300 border border-dark-700 rounded-lg transition-all hover:text-white"
          title="Project Architecture & Solution Guide"
        >
          <Info className="w-4 h-4 text-cyan-400" />
        </button>

        {/* Notifications Icon */}
        <button
          onClick={onOpenNotifications}
          className="relative p-2 bg-dark-800 hover:bg-dark-750 text-slate-300 border border-dark-700 rounded-lg transition-all hover:text-white"
          title="Real-time Alerts & Warnings"
        >
          <Bell className="w-4 h-4" />
          {unreadAlertCount > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-600 text-white rounded-full text-[10px] font-bold flex items-center justify-center shadow-md animate-pulse">
              {unreadAlertCount}
            </span>
          )}
        </button>
      </div>
    </header>
  );
}
