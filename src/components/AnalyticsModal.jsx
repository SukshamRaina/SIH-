import React from 'react';
import { X, BarChart2, PieChart as PieIcon, TrendingUp, Activity, MapPin, ShieldAlert } from 'lucide-react';
import {
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend,
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  BarChart, Bar
} from 'recharts';

export default function AnalyticsModal({ isOpen, onClose, analyticsData, totalCount }) {
  if (!isOpen || !analyticsData) return null;

  const COLORS = ['#ef4444', '#f97316', '#eab308', '#84cc16', '#94a3b8'];
  const RISK_COLORS = { High: '#ef4444', Medium: '#f97316', Low: '#10b981' };

  return (
    <div className="fixed inset-0 z-[2000] bg-black/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 overflow-y-auto animate-in fade-in duration-200 select-none">
      <div className="bg-dark-900 border border-dark-750 rounded-xl w-full max-w-6xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        
        {/* Modal Header */}
        <div className="p-4 border-b border-dark-750 bg-dark-950 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-orange-950 border border-orange-700/60 flex items-center justify-center text-orange-400">
              <BarChart2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white font-mono flex items-center gap-2">
                Geospatial Thermal Intelligence Analytics
              </h2>
              <p className="text-xs text-slate-400 font-mono">
                Real-time spatial distribution & ML classification trends ({totalCount} active dataset records)
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white bg-dark-850 hover:bg-dark-750 rounded border border-dark-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Analytics Body Grid (6 Charts) */}
        <div className="flex-1 overflow-y-auto p-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 text-xs">
          
          {/* Chart 1: Hotspots by Classification */}
          <div className="bg-dark-850 border border-dark-750 rounded-lg p-4 flex flex-col justify-between">
            <h3 className="font-mono font-bold text-slate-200 text-xs uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <PieIcon className="w-3.5 h-3.5 text-orange-400" /> 1. Hotspots by Classification
            </h3>
            <div className="h-56 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={analyticsData.classificationChartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={45}
                    outerRadius={75}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {analyticsData.classificationChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '6px', fontSize: '11px' }}
                  />
                  <Legend verticalAlign="bottom" height={36} iconSize={8} wrapperStyle={{ fontSize: '10px' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Chart 2: Detections Over Time */}
          <div className="bg-dark-850 border border-dark-750 rounded-lg p-4 flex flex-col justify-between">
            <h3 className="font-mono font-bold text-slate-200 text-xs uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5 text-orange-400" /> 2. Detection Trend Over Time
            </h3>
            <div className="h-56 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={analyticsData.trendChartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="date" stroke="#64748b" fontSize={10} />
                  <YAxis stroke="#64748b" fontSize={10} />
                  <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', fontSize: '11px' }} />
                  <Legend verticalAlign="bottom" height={36} iconSize={8} wrapperStyle={{ fontSize: '10px' }} />
                  <Line type="monotone" dataKey="MODIS" stroke="#f97316" strokeWidth={2} dot={{ r: 3 }} />
                  <Line type="monotone" dataKey="VIIRS" stroke="#06b6d4" strokeWidth={2} dot={{ r: 3 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Chart 3: FRP Distribution */}
          <div className="bg-dark-850 border border-dark-750 rounded-lg p-4 flex flex-col justify-between">
            <h3 className="font-mono font-bold text-slate-200 text-xs uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-orange-400" /> 3. FRP Intensity Distribution (MW)
            </h3>
            <div className="h-56 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={analyticsData.frpChartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="range" stroke="#64748b" fontSize={9} />
                  <YAxis stroke="#64748b" fontSize={10} />
                  <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', fontSize: '11px' }} />
                  <Bar dataKey="count" fill="#ef4444" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Chart 4: Risk Distribution */}
          <div className="bg-dark-850 border border-dark-750 rounded-lg p-4 flex flex-col justify-between">
            <h3 className="font-mono font-bold text-slate-200 text-xs uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <ShieldAlert className="w-3.5 h-3.5 text-orange-400" /> 4. Risk Level Breakdown
            </h3>
            <div className="h-56 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={analyticsData.riskChartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="level" stroke="#64748b" fontSize={10} />
                  <YAxis stroke="#64748b" fontSize={10} />
                  <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', fontSize: '11px' }} />
                  <Bar dataKey="count" fill="#f97316" radius={[4, 4, 0, 0]}>
                    {analyticsData.riskChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={RISK_COLORS[entry.level] || '#f97316'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Chart 5: Top Regions / States */}
          <div className="bg-dark-850 border border-dark-750 rounded-lg p-4 flex flex-col justify-between col-span-1 md:col-span-2 lg:col-span-2">
            <h3 className="font-mono font-bold text-slate-200 text-xs uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-orange-400" /> 5. Top Indian States / Regions by Hotspot Counts
            </h3>
            <div className="h-56 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={analyticsData.topRegionsData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis type="number" stroke="#64748b" fontSize={10} />
                  <YAxis dataKey="state" type="category" stroke="#64748b" fontSize={10} width={100} />
                  <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', fontSize: '11px' }} />
                  <Bar dataKey="count" fill="#06b6d4" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="p-3 border-t border-dark-750 bg-dark-950 flex items-center justify-between font-mono text-xs">
          <span className="text-slate-400 text-[11px]">Source: NASA FIRMS + Sentinel-2 Spatial Analytics Engine</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-orange-600 hover:bg-orange-500 text-white font-bold rounded transition-colors"
          >
            Close Report
          </button>
        </div>
      </div>
    </div>
  );
}
