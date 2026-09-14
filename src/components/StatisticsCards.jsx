import React from 'react';
import { Flame, Factory, Activity, AlertTriangle, Zap, Gauge } from 'lucide-react';

export default function StatisticsCards({ statistics }) {
  const cards = [
    {
      id: 'total',
      label: 'Total Hotspots',
      value: statistics?.total?.toLocaleString() || '0',
      icon: Flame,
      iconColor: 'text-amber-400',
      borderColor: 'border-amber-500/30',
      bgGlow: 'from-amber-950/20 to-transparent',
      subtext: 'Monitored across region'
    },
    {
      id: 'industrial',
      label: 'Industrial Fires',
      value: statistics?.industrialFires?.toLocaleString() || '0',
      icon: Factory,
      iconColor: 'text-red-500',
      borderColor: 'border-red-500/40',
      bgGlow: 'from-red-950/30 to-transparent',
      subtext: 'Confirmed ML classification'
    },
    {
      id: 'persistent',
      label: 'Persistent Sources',
      value: statistics?.persistentSources?.toLocaleString() || '0',
      icon: Activity,
      iconColor: 'text-orange-400',
      borderColor: 'border-orange-500/30',
      bgGlow: 'from-orange-950/20 to-transparent',
      subtext: 'High repeat thermal ratio'
    },
    {
      id: 'high_risk',
      label: 'High Risk',
      value: statistics?.highRisk?.toLocaleString() || '0',
      icon: AlertTriangle,
      iconColor: 'text-rose-500',
      borderColor: 'border-rose-500/40',
      bgGlow: 'from-rose-950/30 to-transparent',
      subtext: 'Risk Score \u2265 75/100'
    },
    {
      id: 'active_today',
      label: 'Active Today',
      value: statistics?.activeToday?.toLocaleString() || '0',
      icon: Zap,
      iconColor: 'text-emerald-400',
      borderColor: 'border-emerald-500/30',
      bgGlow: 'from-emerald-950/20 to-transparent',
      subtext: 'Detected in last 24h'
    },
    {
      id: 'avg_frp',
      label: 'Average FRP',
      value: `${statistics?.avgFrp || '0.0'} MW`,
      icon: Gauge,
      iconColor: 'text-cyan-400',
      borderColor: 'border-cyan-500/30',
      bgGlow: 'from-cyan-950/20 to-transparent',
      subtext: 'Fire Radiative Power'
    }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2.5 p-3 bg-dark-950 border-b border-dark-750 shrink-0 z-10 select-none">
      {cards.map(card => {
        const IconComponent = card.icon;
        return (
          <div
            key={card.id}
            className={`relative bg-gradient-to-b ${card.bgGlow} bg-dark-900 border ${card.borderColor} rounded-lg p-2.5 flex flex-col justify-between shadow-md transition-all hover:border-slate-500/50`}
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold font-mono text-slate-400 uppercase tracking-wider truncate">
                {card.label}
              </span>
              <IconComponent className={`w-4 h-4 ${card.iconColor} shrink-0`} />
            </div>
            <div className="my-1">
              <span className="text-xl font-bold font-mono text-white tracking-tight">
                {card.value}
              </span>
            </div>
            <span className="text-[10px] text-slate-500 font-sans truncate">
              {card.subtext}
            </span>
          </div>
        );
      })}
    </div>
  );
}
