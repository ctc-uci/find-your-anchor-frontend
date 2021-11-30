import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { GeoSearchControl, OpenStreetMapProvider } from 'leaflet-geosearch';

import './Map.css';

const Map = () => {
  // The activeMarker represents the current marker that is selected (i.e. which popup is shown)
  const [activeMarker, setActiveMarker] = useState(null);
  // This mapState variable stores the current instance of the map.
  // This is used to fly to markers when they're clicked
  const [mapState, setMapState] = useState(null);

  // This is sample data for Markers
  // The only required pieces of data for Markers to show up are the long/lat coordinates
  const markerCoords = [
    {
      id: 'San Diego',
      coordinates: [32.715736, -117.161087],
      description: 'Sample marker at San Diego',
    },
    {
      id: 'Los Angeles',
      coordinates: [34.052235, -118.243683],
      description: 'Sample marker at Los Angeles',
    },
  ];

  // This is the SearchField component used for searching locations
  const SearchField = () => {
    const map = useMap();

    const searchControl = new GeoSearchControl({
      provider: new OpenStreetMapProvider(),
      style: 'button',
      showMarker: false,
      // autoClose: true
    });
    useEffect(() => {
      map.addControl(searchControl);
      return () => map.removeControl(searchControl);
    });

    return null;
  };

  return (
    <MapContainer
      whenCreated={setMapState}
      center={[33.684566, -117.826508]}
      zoom={12}
      scrollWheelZoom
    >
      <TileLayer
        // Can change this url to display different tilelayers (samples: https://leaflet-extras.github.io/leaflet-providers/preview/)
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
      />
      {/* Map the marker data into <Marker /> components */}
      {markerCoords.map(obj => (
        <Marker
          key={obj.id}
          position={obj.coordinates}
          eventHandlers={{
            // Marker click effect
            click: () => {
              setActiveMarker(obj);
              mapState.flyTo(obj.coordinates, 12);
            },
            // Marker hover effect
            mouseover: () => {
              mapState.flyTo(obj.coordinates, 12);
            },
          }}
        />
      ))}
      <SearchField />
      {/* If a marker is selected, then show the popup for that marker */}
      {activeMarker && (
        <Popup
          className="popup"
          position={activeMarker.coordinates}
          onClose={() => setActiveMarker(null)}
        >
          <p>{activeMarker.description}</p>
        </Popup>
      )}
    </MapContainer>
  );
};

export default Map;
