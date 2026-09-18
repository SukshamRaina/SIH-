import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, CircleMarker, Popup, Polyline, Polygon, Tooltip } from 'react-leaflet';
import L from 'leaflet';
import MapControls from './MapControls';
import MapLegend from './MapLegend';
import IndustrialFacilityLayer from './IndustrialFacilityLayer';

const getHotspotColor = (classification) => {
  switch (classification) {
    case 'Industrial Fire': return '#ef4444';
    case 'Persistent Thermal Source': return '#f97316';
    case 'Forest / Wildfire': return '#eab308';
    case 'Agricultural Burning': return '#84cc16';
    default: return '#94a3b8';
  }
};

// Helper to construct custom SVG Leaflet Marker Icon
const createHotspotMarkerIcon = (hotspot, isSelected) => {
  let color = getHotspotColor(hotspot.classification);
  let ringClass = '';

  if (hotspot.classification === 'Industrial Fire' && hotspot.risk_score >= 75) ringClass = 'pulse-ring-high';
  else if (hotspot.classification === 'Persistent Thermal Source' && hotspot.persistence >= 0.70) ringClass = 'pulse-ring-persistent';

  // Calculate size based on FRP
  let size = 18;
  if (hotspot.frp > 80) size = 28;
  else if (hotspot.frp > 40) size = 23;
  else if (hotspot.frp > 25) size = 19;

  const borderWidth = isSelected ? '3px' : '2px';
  const borderColor = isSelected ? '#ffffff' : '#0f172a';

  const html = `
    <div className="relative flex items-center justify-center">
      ${ringClass ? `<div class="${ringClass}" style="position: absolute; width: ${size + 14}px; height: ${size + 14}px; border-radius: 50%; top: -7px; left: -7px;"></div>` : ''}
      <div style="
        background-color: ${color};
        width: ${size}px;
        height: ${size}px;
        border-radius: 50%;
        border: ${borderWidth} solid ${borderColor};
        box-shadow: 0 0 12px ${color};
        cursor: pointer;
        transition: transform 0.2s ease;
        ${isSelected ? 'transform: scale(1.3); z-index: 1000;' : ''}
      "></div>
    </div>
  `;

  return L.divIcon({
    html,
    className: 'custom-hotspot-div-icon',
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  });
};

export default function GISMap({
  hotspots,
  facilities,
  selectedHotspot,
  onSelectHotspot,
  activeClassificationFilter,
  onSelectClassificationFilter,
  activeEmergencyRoute,
  activePlumeData
}) {
  const [tileLayerType, setTileLayerType] = useState('satellite'); // 'satellite' | 'osm'
  const [showFacilities, setShowFacilities] = useState(true);

  const TILE_URLS = {
    satellite: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    osm: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
  };

  const ATTRIBUTIONS = {
    satellite: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community',
    osm: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  };

  let proximityVectorCoords = null;
  let nearestFacilityObj = null;

  if (selectedHotspot && selectedHotspot.nearest_facility && selectedHotspot.nearest_facility !== 'N/A') {
    nearestFacilityObj = facilities.find(f => f.name === selectedHotspot.nearest_facility);
    if (nearestFacilityObj) {
      proximityVectorCoords = [
        [selectedHotspot.latitude, selectedHotspot.longitude],
        [nearestFacilityObj.latitude, nearestFacilityObj.longitude]
      ];
    }
  }

  // Use CircleMarker canvas rendering when hotspots dataset is large (> 400)
  const useCanvasMode = hotspots.length > 400;

  return (
    <div className="relative w-full h-full bg-dark-950 overflow-hidden">
      <MapContainer
        center={[22.5937, 78.9629]} // Centered on India
        zoom={5}
        scrollWheelZoom={true}
        style={{ width: '100%', height: '100%' }}
        zoomControl={false}
        preferCanvas={true}
      >
        {/* Active Tile Layer */}
        <TileLayer
          url={TILE_URLS[tileLayerType]}
          attribution={ATTRIBUTIONS[tileLayerType]}
          maxZoom={18}
        />

        {/* Industrial Facilities Overlay Layer */}
        <IndustrialFacilityLayer facilities={facilities} visible={showFacilities} />

        {/* Downwind Smoke / Toxic Plume Cone Overlay */}
        {activePlumeData && activePlumeData.plume_polygon_geojson && (
          <Polygon
            positions={activePlumeData.plume_polygon_geojson.coordinates[0].map(c => [c[1], c[0]])}
            pathOptions={{
              color: '#dc2626',
              fillColor: '#ef4444',
              fillOpacity: 0.4,
              weight: 2,
              dashArray: '6, 6'
            }}
          >
            <Tooltip permanent direction="center" opacity={0.95} className="font-mono text-[11px] bg-red-950 text-red-200 border-red-800">
              💨 Plume Corridor ({activePlumeData.plume_reach_km} km {activePlumeData.wind_cardinal}) | Est. Exposed: {activePlumeData.estimated_exposed_population.toLocaleString()} people
            </Tooltip>
          </Polygon>
        )}

        {/* Capacity-Aware OSRM Emergency Response Route & Fire Station */}
        {activeEmergencyRoute && activeEmergencyRoute.route_geojson && (
          <>
            <Polyline
              positions={activeEmergencyRoute.route_geojson.coordinates.map(c => [c[1], c[0]])}
              pathOptions={{
                color: '#06b6d4',
                weight: 5,
                opacity: 0.95,
                lineCap: 'round'
              }}
            >
              <Tooltip permanent direction="top" opacity={0.95} className="font-mono text-xs bg-cyan-950 text-cyan-200 border-cyan-800">
                🚒 OSRM Road Route: {activeEmergencyRoute.road_dist_km} km ({activeEmergencyRoute.duration_mins} mins ETA)
              </Tooltip>
            </Polyline>

            {activeEmergencyRoute.assigned_station && (
              <Marker
                position={[activeEmergencyRoute.assigned_station.latitude, activeEmergencyRoute.assigned_station.longitude]}
                icon={L.divIcon({
                  html: `<div style="background-color: #06b6d4; border: 2px solid #ffffff; border-radius: 50%; width: 28px; height: 28px; display: flex; align-items: center; justify-content: center; font-size: 15px; box-shadow: 0 0 12px #06b6d4;">🚒</div>`,
                  className: 'custom-firestation-icon',
                  iconSize: [28, 28],
                  iconAnchor: [14, 14]
                })}
              >
                <Popup className="font-sans">
                  <div className="p-1 space-y-1 text-xs">
                    <p className="font-bold text-cyan-400">{activeEmergencyRoute.assigned_station.name}</p>
                    <p className="text-[11px] text-slate-300 font-mono">Type: {activeEmergencyRoute.assigned_station.type}</p>
                    <p className="text-[11px] text-slate-300 font-mono">Capacity: {activeEmergencyRoute.assigned_station.capacity}</p>
                  </div>
                </Popup>
              </Marker>
            )}
          </>
        )}

        {/* Proximity Vector Polyline Connection */}
        {proximityVectorCoords && (
          <Polyline
            positions={proximityVectorCoords}
            pathOptions={{
              color: '#ef4444',
              weight: 2,
              dashArray: '6, 6',
              opacity: 0.95
            }}
          >
            <Tooltip permanent direction="center" opacity={0.9} className="font-mono text-[10px]">
              Proximity: {selectedHotspot.distance_km} km
            </Tooltip>
          </Polyline>
        )}


        {/* Thermal Hotspot Markers */}
        {hotspots.map(hotspot => {
          const isSelected = selectedHotspot?.id === hotspot.id;
          const color = getHotspotColor(hotspot.classification);

          if (useCanvasMode) {
            let radius = 4;
            if (hotspot.frp > 80) radius = 8;
            else if (hotspot.frp > 40) radius = 6;

            return (
              <CircleMarker
                key={hotspot.id}
                center={[hotspot.latitude, hotspot.longitude]}
                radius={isSelected ? radius + 4 : radius}
                pathOptions={{
                  color: isSelected ? '#ffffff' : color,
                  fillColor: color,
                  fillOpacity: 0.85,
                  weight: isSelected ? 3 : 1
                }}
                eventHandlers={{
                  click: () => onSelectHotspot(hotspot)
                }}
              >
                <Tooltip direction="top" offset={[0, -5]} opacity={0.9} className="font-mono text-xs">
                  <span className="font-bold">{hotspot.classification}</span> ({hotspot.frp} MW)
                </Tooltip>

                <Popup className="font-sans">
                  <div className="p-1 space-y-1.5 min-w-[200px]">
                    <div className="flex items-center justify-between border-b border-dark-750 pb-1">
                      <span className="font-mono font-bold text-xs text-orange-400">{hotspot.id}</span>
                      <span className={`px-1.5 py-0.5 text-[10px] font-bold rounded ${
                        hotspot.risk_level === 'High' ? 'bg-red-950 text-red-400 border border-red-800' : 'bg-orange-950 text-orange-400'
                      }`}>
                        {hotspot.risk_level} Risk ({hotspot.risk_score})
                      </span>
                    </div>

                    <p className="text-xs font-bold text-slate-100">{hotspot.classification}</p>

                    <div className="text-[11px] text-slate-300 space-y-0.5 font-mono">
                      <p>FRP: <span className="text-orange-400 font-bold">{hotspot.frp} MW</span></p>
                      <p>Brightness: <span>{hotspot.brightness} K</span></p>
                      <p>Location: <span>{hotspot.city}, {hotspot.state}</span></p>
                      <p>Satellite: <span>{hotspot.satellite} ({hotspot.acq_time} UTC)</span></p>
                    </div>

                    <button
                      onClick={() => onSelectHotspot(hotspot)}
                      className="w-full mt-1.5 py-1 bg-orange-600 hover:bg-orange-500 text-white font-mono text-[11px] font-bold rounded transition-colors"
                    >
                      View Intelligence Details &rarr;
                    </button>
                  </div>
                </Popup>
              </CircleMarker>
            );
          }

          return (
            <Marker
              key={hotspot.id}
              position={[hotspot.latitude, hotspot.longitude]}
              icon={createHotspotMarkerIcon(hotspot, isSelected)}
              eventHandlers={{
                click: () => onSelectHotspot(hotspot)
              }}
            >
              <Tooltip direction="top" offset={[0, -10]} opacity={0.9} className="font-mono text-xs">
                <span className="font-bold">{hotspot.classification}</span> ({hotspot.frp} MW)
              </Tooltip>
              
              <Popup className="font-sans">
                <div className="p-1 space-y-1.5 min-w-[200px]">
                  <div className="flex items-center justify-between border-b border-dark-750 pb-1">
                    <span className="font-mono font-bold text-xs text-orange-400">{hotspot.id}</span>
                    <span className={`px-1.5 py-0.5 text-[10px] font-bold rounded ${
                      hotspot.risk_level === 'High' ? 'bg-red-950 text-red-400 border border-red-800' : 'bg-orange-950 text-orange-400'
                    }`}>
                      {hotspot.risk_level} Risk ({hotspot.risk_score})
                    </span>
                  </div>

                  <p className="text-xs font-bold text-slate-100">{hotspot.classification}</p>

                  <div className="text-[11px] text-slate-300 space-y-0.5 font-mono">
                    <p>FRP: <span className="text-orange-400 font-bold">{hotspot.frp} MW</span></p>
                    <p>Brightness: <span>{hotspot.brightness} K</span></p>
                    <p>Location: <span>{hotspot.city}, {hotspot.state}</span></p>
                    <p>Satellite: <span>{hotspot.satellite} ({hotspot.acq_time} UTC)</span></p>
                  </div>

                  <button
                    onClick={() => onSelectHotspot(hotspot)}
                    className="w-full mt-1.5 py-1 bg-orange-600 hover:bg-orange-500 text-white font-mono text-[11px] font-bold rounded transition-colors"
                  >
                    View Intelligence Details &rarr;
                  </button>
                </div>
              </Popup>
            </Marker>
          );
        })}

        {/* Floating Custom Map Controls */}
        <MapControls
          currentTileLayer={tileLayerType}
          onTileLayerChange={setTileLayerType}
          showFacilities={showFacilities}
          onToggleFacilities={() => setShowFacilities(!showFacilities)}
          selectedHotspot={selectedHotspot}
        />
      </MapContainer>

      {/* Floating Map Legend */}
      <MapLegend
        activeClassification={activeClassificationFilter}
        onSelectClassification={onSelectClassificationFilter}
      />
    </div>
  );
}
