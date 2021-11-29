import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { GeoSearchControl, OpenStreetMapProvider } from 'leaflet-geosearch';

import './Map.css';

const Map = () => {
  const [activeMarker, setActiveMarker] = useState(null);
  const [mapState, setMapState] = useState(null);

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
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
      />

      {markerCoords.map(obj => (
        <Marker
          key={obj.id}
          position={obj.coordinates}
          eventHandlers={{
            click: () => {
              setActiveMarker(obj);
              mapState.flyTo(obj.coordinates, 12);
            },
            mouseover: () => {
              console.log(`hovered over ${obj.id}`);
            },
          }}
        />
      ))}
      <SearchField />
      {activeMarker && (
        <Popup
          className="popup"
          position={activeMarker.coordinates}
          onClose={setActiveMarker(null)}
        >
          <p>{activeMarker.description}</p>
        </Popup>
      )}
    </MapContainer>
  );
};

export default Map;
