import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Info } from 'lucide-react';

export default function MapLegend({ activeClassification, onSelectClassification }) {
  const [collapsed, setCollapsed] = useState(false);

  const legendItems = [
    { label: 'Industrial Fire', color: 'bg-red-500', value: 'Industrial Fire' },
    { label: 'Persistent Thermal Source', color: 'bg-orange-500', value: 'Persistent Thermal Source' },
    { label: 'Forest / Wildfire', color: 'bg-yellow-500', value: 'Forest / Wildfire' },
    { label: 'Agricultural Burning', color: 'bg-lime-500', value: 'Agricultural Burning' },
    { label: 'Other / Unknown', color: 'bg-slate-400', value: 'Other / Unknown' },
  ];

  return (
    <div className="absolute bottom-6 left-6 z-[1000] bg-dark-900/90 backdrop-blur-md border border-dark-750 rounded-lg shadow-2xl p-3 text-xs w-64 select-none">
      <div className="flex items-center justify-between font-mono font-bold text-slate-200 border-b border-dark-750 pb-1.5 mb-2">
        <span className="flex items-center gap-1.5 text-[11px] uppercase tracking-wider">
          <Info className="w-3.5 h-3.5 text-orange-400" /> Map Legend
        </span>
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="text-slate-400 hover:text-white"
        >
          {collapsed ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      </div>

      {!collapsed && (
        <div className="space-y-2">
          {/* Legend Color Items */}
          <div className="space-y-1.5">
            {legendItems.map(item => {
              const isSelected = activeClassification === item.value;
              return (
                <div
                  key={item.value}
                  onClick={() => onSelectClassification(isSelected ? 'All' : item.value)}
                  className={`flex items-center justify-between px-2 py-1 rounded cursor-pointer transition-colors ${
                    isSelected ? 'bg-dark-750 text-white font-semibold' : 'hover:bg-dark-800 text-slate-300'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <span className={`w-3 h-3 rounded-full ${item.color} shadow-sm shrink-0`}></span>
                    <span className="text-[11px] font-sans">{item.label}</span>
                  </div>
                  {isSelected && <span className="text-[9px] font-mono text-orange-400 uppercase">Active</span>}
                </div>
              );
            })}
          </div>

          <hr className="border-dark-750 my-2" />

          {/* Size / Glow Indicators */}
          <div className="space-y-1.5 text-[10px] text-slate-400 font-mono">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="w-2 h-2 rounded-full bg-red-500"></span>
                <span>Small Marker</span>
              </div>
              <span className="text-slate-500">Low FRP (&lt;30 MW)</span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="w-4 h-4 rounded-full bg-red-500 border border-white"></span>
                <span>Large Marker</span>
              </div>
              <span className="text-slate-500">High FRP (&gt;70 MW)</span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="w-3.5 h-3.5 rounded-full bg-red-500 ring-2 ring-red-400 ring-offset-1 ring-offset-dark-900 animate-pulse"></span>
                <span>Glowing Pulse Ring</span>
              </div>
              <span className="text-red-400 font-bold">High Risk (&ge;75)</span>
            </div>

            <hr className="border-dark-750 my-1.5" />

            <div className="flex items-center justify-between text-slate-300">
              <div className="flex items-center space-x-2">
                <span className="w-3 h-2 rounded bg-red-500/40 border border-red-500 border-dashed"></span>
                <span>Downwind Smoke Plume</span>
              </div>
              <span className="text-red-400 font-bold">Exposure</span>
            </div>

            <div className="flex items-center justify-between text-slate-300">
              <div className="flex items-center space-x-2">
                <span className="w-3.5 h-1 rounded bg-cyan-400"></span>
                <span>OSRM Road Route</span>
              </div>
              <span className="text-cyan-400 font-bold">ETA</span>
            </div>

            <div className="flex items-center justify-between text-slate-300">
              <div className="flex items-center space-x-2">
                <span className="text-[12px]">🚒</span>
                <span>Fire Station Unit</span>
              </div>
              <span className="text-cyan-400 font-bold">Hazmat</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

