import React from 'react';
import { Bell, Flame, ShieldAlert, X, Radio, ExternalLink } from 'lucide-react';

export default function NotificationsPopover({ isOpen, onClose, alerts, onSelectAlert }) {
  if (!isOpen) return null;

  return (
    <div className="absolute top-16 right-4 w-80 sm:w-96 bg-dark-900/95 backdrop-blur-xl border border-dark-750 rounded-xl shadow-2xl z-[1800] overflow-hidden select-none animate-in fade-in slide-in-from-top-2 duration-200">
      <div className="p-3 border-b border-dark-750 bg-dark-950 flex items-center justify-between font-mono text-xs">
        <div className="flex items-center space-x-2">
          <Bell className="w-4 h-4 text-orange-400" />
          <span className="font-bold text-slate-100 uppercase tracking-wider">Telemetry Alerts</span>
          <span className="px-2 py-0.5 text-[10px] bg-red-950 text-red-400 rounded-full font-bold border border-red-800">
            {alerts.length} New
          </span>
        </div>
        <button onClick={onClose} className="text-slate-400 hover:text-white">
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="max-h-80 overflow-y-auto divide-y divide-dark-750 text-xs">
        {alerts.length === 0 ? (
          <div className="p-6 text-center text-slate-500 font-mono">
            No active unread alerts
          </div>
        ) : (
          alerts.map(alert => (
            <div
              key={alert.id}
              onClick={() => {
                onSelectAlert(alert);
                onClose();
              }}
              className="p-3 hover:bg-dark-850 cursor-pointer transition-colors space-y-1"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono font-bold text-red-400 text-[11px] flex items-center gap-1">
                  <Flame className="w-3 h-3 text-red-500 animate-pulse" /> {alert.id}
                </span>
                <span className="text-[10px] font-mono text-slate-400">{alert.time}</span>
              </div>
              <p className="font-bold text-slate-100">{alert.title}</p>
              <p className="text-[11px] text-slate-400 font-sans">{alert.message}</p>
              <div className="flex items-center justify-between pt-1 text-[10px] font-mono text-slate-500">
                <span>FRP: {alert.frp} MW</span>
                <span className="text-orange-400 flex items-center gap-0.5">Inspect on map &rarr;</span>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="p-2 border-t border-dark-750 bg-dark-950 text-center font-mono text-[10px] text-slate-500">
        Live NASA FIRMS Stream Active
      </div>
    </div>
  );
}
