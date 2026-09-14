import React from 'react';
import { useMap } from 'react-leaflet';
import { Layers, Maximize2, Locate, Plus, Minus, Factory, Globe } from 'lucide-react';

export default function MapControls({
  currentTileLayer,
  onTileLayerChange,
  showFacilities,
  onToggleFacilities,
  selectedHotspot
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
    <div className="absolute top-4 right-4 z-[1000] flex flex-col space-y-2 select-none">
      {/* Tile Layer Switcher */}
      <div className="bg-dark-900/90 backdrop-blur-md border border-dark-750 rounded-lg p-1 shadow-xl flex flex-col space-y-1">

        <button
          onClick={() => onTileLayerChange('satellite')}
          className={`px-2.5 py-1.5 rounded text-xs font-mono flex items-center space-x-1.5 transition-colors ${
            currentTileLayer === 'satellite'
              ? 'bg-orange-600 text-white font-bold shadow'
              : 'text-slate-300 hover:bg-dark-800'
          }`}
          title="High Resolution Satellite Imagery"
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Satellite</span>
        </button>

        <button
          onClick={() => onTileLayerChange('osm')}
          className={`px-2.5 py-1.5 rounded text-xs font-mono flex items-center space-x-1.5 transition-colors ${
            currentTileLayer === 'osm'
              ? 'bg-orange-600 text-white font-bold shadow'
              : 'text-slate-300 hover:bg-dark-800'
          }`}
          title="Standard OpenStreetMap"
        >
          <Globe className="w-3.5 h-3.5" />
          <span>OpenStreetMap</span>
        </button>
      </div>

      {/* Industrial Facilities Toggle */}
      <div className="bg-dark-900/90 backdrop-blur-md border border-dark-750 rounded-lg p-1 shadow-xl">
        <button
          onClick={onToggleFacilities}
          className={`w-full px-2.5 py-1.5 rounded text-xs font-mono flex items-center space-x-1.5 transition-colors ${
            showFacilities
              ? 'bg-cyan-950 text-cyan-300 border border-cyan-700 font-bold'
              : 'text-slate-400 hover:bg-dark-800'
          }`}
          title="Toggle OSM Industrial Facilities Layer"
        >
          <Factory className="w-3.5 h-3.5 text-cyan-400" />
          <span>Facilities Layer</span>
        </button>
      </div>

      {/* Navigation Controls */}
      <div className="bg-dark-900/90 backdrop-blur-md border border-dark-750 rounded-lg p-1 shadow-xl flex flex-col space-y-1">
        <button
          onClick={handleZoomIn}
          className="p-2 text-slate-300 hover:bg-dark-800 rounded transition-colors"
          title="Zoom In"
        >
          <Plus className="w-4 h-4" />
        </button>
        <button
          onClick={handleZoomOut}
          className="p-2 text-slate-300 hover:bg-dark-800 rounded transition-colors"
          title="Zoom Out"
        >
          <Minus className="w-4 h-4" />
        </button>
        <hr className="border-dark-750" />
        <button
          onClick={handleResetView}
          className="p-2 text-slate-300 hover:bg-dark-800 rounded transition-colors"
          title="Reset View to India"
        >
          <Maximize2 className="w-4 h-4 text-orange-400" />
        </button>
        <button
          onClick={handleLocateUser}
          className="p-2 text-slate-300 hover:bg-dark-800 rounded transition-colors"
          title="My Location"
        >
          <Locate className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
