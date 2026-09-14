import React from 'react';
import { Marker, Popup, Tooltip } from 'react-leaflet';
import L from 'leaflet';

// Create custom SVG divIcon for facility types
const createFacilityIcon = (type) => {
  let iconSvg = '';
  let color = '#3b82f6'; // default blue

  switch (type) {
    case 'Refinery':
      color = '#ec4899'; // pink/purple
      iconSvg = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 2v20M17 5H7M19 12H5M17 19H7"/></svg>`;
      break;
    case 'Power Plant':
      color = '#eab308'; // yellow
      iconSvg = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>`;
      break;
    case 'Chemical Plant':
      color = '#a855f7'; // purple
      iconSvg = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M10 2v7.31L4.75 18.2a2 2 0 0 0 1.6 3.8h11.3a2 2 0 0 0 1.6-3.8L14 9.31V2 font-bold"/></svg>`;
      break;
    case 'Steel Plant':
      color = '#06b6d4'; // cyan
      iconSvg = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 3 12 7 8 3"/></svg>`;
      break;
    default:
      color = '#64748b'; // slate
      iconSvg = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M2 20a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8l-7 5V8l-7 5V4a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z"/></svg>`;
  }

  const html = `
    <div style="
      background: #0f172a;
      border: 2px solid ${color};
      color: ${color};
      width: 28px;
      height: 28px;
      border-radius: 6px;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 4px 10px rgba(0,0,0,0.6);
    ">
      ${iconSvg}
    </div>
  `;

  return L.divIcon({
    html,
    className: 'facility-leaflet-icon',
    iconSize: [28, 28],
    iconAnchor: [14, 14],
  });
};

export default function IndustrialFacilityLayer({ facilities, visible }) {
  if (!visible || !facilities) return null;

  return (
    <>
      {facilities.map(facility => (
        <Marker
          key={facility.id}
          position={[facility.latitude, facility.longitude]}
          icon={createFacilityIcon(facility.type)}
        >
          <Tooltip direction="top" offset={[0, -14]} opacity={0.9} className="font-mono text-xs">
            <span className="font-bold text-slate-100">{facility.name}</span> ({facility.type})
          </Tooltip>
          <Popup className="font-sans">
            <div className="p-1 space-y-1 text-xs">
              <div className="font-bold text-slate-100 border-b border-slate-700 pb-1 flex items-center justify-between gap-2">
                <span>{facility.name}</span>
                <span className="px-1.5 py-0.5 text-[10px] bg-slate-800 text-cyan-400 rounded border border-slate-700 font-mono">
                  {facility.type}
                </span>
              </div>
              <p className="text-slate-300">
                <strong>Location:</strong> {facility.city}, {facility.state}
              </p>
              <p className="text-slate-300">
                <strong>Capacity:</strong> {facility.capacity}
              </p>
              <p className="text-slate-400 font-mono text-[10px]">
                {facility.latitude.toFixed(4)} N, {facility.longitude.toFixed(4)} E
              </p>
            </div>
          </Popup>
        </Marker>
      ))}
    </>
  );
}
