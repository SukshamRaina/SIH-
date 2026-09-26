import React from 'react';
import { useMap } from 'react-leaflet';
import { Layers, Maximize2, Locate, Plus, Minus, Factory, Globe, Flame } from 'lucide-react';

export default function MapControls({
  currentTileLayer,
  onTileLayerChange,
  showFacilities,
  onToggleFacilities,
  showHotspots,
  onToggleHotspots
}) {
  const map = useMap();

  const handleZoomIn = () => map.zoomIn();
  const handleZoomOut = () => map.zoomOut();
  const handleResetView = () => map.setView([22.5937, 78.9629], 5);

  const handleLocateUser = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          map.flyTo([pos.coords.latitude, pos.coords.longitude], 9);
        },
        () => {
          alert('Unable to access location');
        }
      );
    }
  };

  return (
    <div className="absolute top-3 right-3 z-[1000] flex flex-col space-y-1.5 select-none font-sans text-xs">
      {/* Tile Layer Switcher */}
      <div className="bg-dark-900/90 backdrop-blur-md border border-dark-750 rounded-lg p-1 shadow-lg flex flex-col space-y-0.5">
        <button
          onClick={() => onTileLayerChange('satellite')}
          className={`px-2 py-1 rounded text-[11px] font-medium flex items-center space-x-1.5 transition-all ${
            currentTileLayer === 'satellite'
              ? 'bg-orange-600 text-white font-bold shadow-sm'
              : 'text-slate-300 hover:bg-dark-800'
          }`}
          title="Satellite Imagery"
        >
          <Layers className="w-3 h-3" />
          <span>Satellite</span>
        </button>

        <button
          onClick={() => onTileLayerChange('osm')}
          className={`px-2 py-1 rounded text-[11px] font-medium flex items-center space-x-1.5 transition-all ${
            currentTileLayer === 'osm'
              ? 'bg-orange-600 text-white font-bold shadow-sm'
              : 'text-slate-300 hover:bg-dark-800'
          }`}
          title="Street Map"
        >
          <Globe className="w-3 h-3" />
          <span>Street Map</span>
        </button>
      </div>

      {/* Layer Toggles: Hotspots & Industrial Facilities */}
      <div className="bg-dark-900/90 backdrop-blur-md border border-dark-750 rounded-lg p-1 shadow-lg flex flex-col space-y-0.5">
        <button
          onClick={onToggleHotspots}
          className={`w-full px-2 py-1 rounded text-[11px] font-medium flex items-center justify-between transition-all ${
            showHotspots
              ? 'bg-orange-950/80 text-orange-300 border border-orange-700/60 font-semibold'
              : 'text-slate-400 hover:bg-dark-800'
          }`}
          title="Toggle Thermal Hotspots Layer"
        >
          <span className="flex items-center gap-1.5">
            <Flame className="w-3 h-3 text-orange-400" />
            <span>Hotspots</span>
          </span>
          <span className="text-[9px] font-mono px-1 rounded bg-dark-950 text-slate-300">
            {showHotspots ? 'ON' : 'OFF'}
          </span>
        </button>

        <button
          onClick={onToggleFacilities}
          className={`w-full px-2 py-1 rounded text-[11px] font-medium flex items-center justify-between transition-all ${
            showFacilities
              ? 'bg-cyan-950/80 text-cyan-300 border border-cyan-700/60 font-semibold'
              : 'text-slate-400 hover:bg-dark-800'
          }`}
          title="Toggle Facilities Layer"
        >
          <span className="flex items-center gap-1.5">
            <Factory className="w-3 h-3 text-cyan-400" />
            <span>Facilities</span>
          </span>
          <span className="text-[9px] font-mono px-1 rounded bg-dark-950 text-slate-300">
            {showFacilities ? 'ON' : 'OFF'}
          </span>
        </button>
      </div>

      {/* Compact Navigation Controls */}
      <div className="bg-dark-900/90 backdrop-blur-md border border-dark-750 rounded-lg p-0.5 shadow-lg flex flex-col items-center space-y-0.5">
        <button
          onClick={handleZoomIn}
          className="p-1 text-slate-300 hover:bg-dark-800 rounded transition-all hover:text-white"
          title="Zoom In"
        >
          <Plus className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={handleZoomOut}
          className="p-1 text-slate-300 hover:bg-dark-800 rounded transition-all hover:text-white"
          title="Zoom Out"
        >
          <Minus className="w-3.5 h-3.5" />
        </button>
        <hr className="w-4 border-dark-750 my-0.5" />
        <button
          onClick={handleResetView}
          className="p-1 text-slate-300 hover:bg-dark-800 rounded transition-all hover:text-orange-400"
          title="Reset Map View"
        >
          <Maximize2 className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={handleLocateUser}
          className="p-1 text-slate-300 hover:bg-dark-800 rounded transition-all hover:text-white"
          title="Find My Location"
        >
          <Locate className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
