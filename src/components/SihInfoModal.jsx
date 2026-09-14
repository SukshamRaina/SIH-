import React from 'react';
import { X, ShieldCheck, Cpu, Database, Flame, Layers, CheckCircle } from 'lucide-react';

export default function SihInfoModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  const requirements = [
    { title: "1. Thermal Anomaly Detection", desc: "Real-time parsing of NASA FIRMS MODIS (1km) & VIIRS (375m) satellite telemetry." },
    { title: "2. Industrial Fire Classification", desc: "AI model discriminates industrial blaze events based on FRP, brightness, and infrastructure buffer." },
    { title: "3. Natural / Wildfire Separation", desc: "Sentinel-2 & OSM land cover layers isolate forest canopy and crop stubble fires." },
    { title: "4. Persistent Thermal Source ID", desc: "Temporal persistence scoring identifies refinery flare stacks and thermal power plant cooling units." },
    { title: "5. Interactive GIS Map", desc: "Command-center Leaflet interface centered on India with custom FRP-scaled circular markers." },
    { title: "6. OSM Infrastructure Overlays", desc: "Toggleable industrial facility layer (Refineries, Power Plants, Chemical Plants, Steel Mills)." },
    { title: "7. Historical Monitoring & Trends", desc: "Multi-month persistence ratio and historical FRP sparkline graphs per thermal anomaly." },
    { title: "8. AI Risk Scoring (0-100)", desc: "Automated risk prioritization based on hazard proximity, chemical land-use, and thermal intensity." },
    { title: "9. FastAPI REST Integration Ready", desc: "Data service layer (src/services/api.js) formatted for drop-in REST endpoint integration." }
  ];

  return (
    <div className="fixed inset-0 z-[2000] bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200 select-none">
      <div className="bg-dark-900 border border-dark-750 rounded-xl w-full max-w-3xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="p-4 border-b border-dark-750 bg-dark-950 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-red-950 border border-red-700/60 flex items-center justify-center text-red-400">
              <Flame className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white font-mono flex items-center gap-2">
                AgniDrishti &mdash; Smart India Hackathon PS 162
              </h2>
              <p className="text-xs text-slate-400 font-mono">
                AI-Based Detection and Classification of Industrial Fires & Persistent Thermal Sources
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

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4 text-xs">
          
          <div className="bg-gradient-to-r from-red-950/40 via-dark-850 to-orange-950/40 border border-red-800/40 rounded-lg p-3.5 space-y-2">
            <h3 className="font-mono font-bold text-slate-100 text-xs uppercase tracking-wider flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-orange-400" /> Pipeline Architecture
            </h3>
            <p className="text-slate-300 leading-relaxed text-[11px] font-sans">
              <strong>AgniDrishti</strong> fuses satellite remote sensing data with spatial infrastructure GIS layers to automatically flag high-risk thermal anomalies in industrial zones. The pipeline ingests <strong>NASA FIRMS</strong> thermal pixels, computes spatial proximity buffers to <strong>OpenStreetMap (OSM)</strong> industrial assets, and evaluates historical persistence to classify events into actionable hazard tiers.
            </p>

            <div className="pt-2 font-mono text-[10px] text-orange-300 flex items-center justify-between bg-dark-950/80 p-2 rounded border border-dark-750">
              <span>NASA FIRMS Telemetry</span>
              <span>&rarr;</span>
              <span>OSM Spatial Indexing</span>
              <span>&rarr;</span>
              <span>ML XGBoost Classifier</span>
              <span>&rarr;</span>
              <span>GIS Command Dashboard</span>
            </div>
          </div>

          {/* Grid of PS 162 Compliance Features */}
          <div className="space-y-2">
            <h4 className="font-mono font-bold text-slate-200 uppercase tracking-wider text-xs flex items-center gap-1.5">
              <CheckCircle className="w-4 h-4 text-emerald-400" /> PS 162 Specification Compliance
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
              {requirements.map((req, idx) => (
                <div key={idx} className="bg-dark-850 border border-dark-750 rounded p-2.5 flex items-start space-x-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-orange-400 shrink-0 mt-1.5"></span>
                  <div>
                    <h5 className="font-bold text-slate-200 font-mono text-[11px]">{req.title}</h5>
                    <p className="text-slate-400 text-[10px] font-sans mt-0.5">{req.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Backend Readiness Note */}
          <div className="bg-dark-950 border border-dark-750 rounded-lg p-3 space-y-1 font-mono text-[11px]">
            <span className="text-cyan-400 font-bold block flex items-center gap-1">
              <Database className="w-3.5 h-3.5" /> Python FastAPI Integration Layer
            </span>
            <p className="text-slate-400 text-[10px]">
              Current prototype data is clearly labeled <strong className="text-yellow-400">DEMO DATA</strong>. All UI components pull through <code className="text-slate-200">src/services/api.js</code> which contains ready-to-use hooks for <code className="text-slate-200">GET /hotspots</code>, <code className="text-slate-200">GET /statistics</code>, and <code className="text-slate-200">GET /analytics</code>.
            </p>
          </div>

        </div>

        {/* Footer */}
        <div className="p-3 border-t border-dark-750 bg-dark-950 flex items-center justify-between font-mono text-xs">
          <span className="text-slate-400 text-[10px]">Smart India Hackathon Prototype &copy; 2026</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-orange-600 hover:bg-orange-500 text-white font-bold rounded transition-colors"
          >
            Acknowledge & Close
          </button>
        </div>
      </div>
    </div>
  );
}
