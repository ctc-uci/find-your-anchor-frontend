import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, ZoomControl } from 'react-leaflet';
import { GeoSearchControl, OpenStreetMapProvider } from 'leaflet-geosearch';
import icons from 'leaflet-color-number-markers';

import './Map.css';
import BoxApproval from '../BoxApproval/BoxApproval';

const Map = () => {
  // The activeMarker represents the current marker that is selected (i.e. which popup is shown)
  const [activeMarker, setActiveMarker] = useState(null);
  // This mapState variable stores the current instance of the map.
  // This is used to fly to markers when they're clicked
  const [mapState, setMapState] = useState(null);

  // This is sample data for Markers
  // The only required pieces of data for Markers to show up are the long/lat coordinates
  // Could use Nominatim to convert from city/state/etc name to coordinates (https://nominatim.org/release-docs/develop/api/Overview/)
  const markerData = [
    {
      id: 'San Diego',
      coordinates: [32.715736, -117.161087],
      description: 'Sample marker at San Diego',
      image: 'https://pngimg.com/uploads/box/box_PNG49.png',
      number: '1',
    },
    {
      id: 'Irvine',
      coordinates: [33.6846, -117.8265],
      description: 'Sample marker at Irvine',
      image: 'https://pngimg.com/uploads/box/box_PNG49.png',
      number: '2',
    },
    {
      id: 'Los Angeles',
      coordinates: [34.052235, -118.243683],
      description: 'Sample marker at Los Angeles',
      image: 'https://pngimg.com/uploads/box/box_PNG49.png',
      number: '3',
    },
  ];

  // This is the SearchField component used for searching locations
  const SearchField = () => {
    const map = useMap();

    const searchControl = new GeoSearchControl({
      provider: new OpenStreetMapProvider(),
      style: 'button',
      showMarker: true,
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
      zoom={8}
      scrollWheelZoom
      zoomControl={false}
    >
      <TileLayer
        // Can change this url to display different tilelayers (samples: https://leaflet-extras.github.io/leaflet-providers/preview/)
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
      />
      <ZoomControl position="topright" />
      {/* Map the marker data into <Marker /> components */}
      {markerData.map(markerObject => (
        <Marker
          icon={icons.blue.numbers[markerObject.number]}
          key={markerObject.id}
          position={markerObject.coordinates}
          eventHandlers={{
            // Marker click effect
            click: () => {
              setActiveMarker(markerObject);
              mapState.flyTo(markerObject.coordinates, 12);
            },
          }}
        />
      ))}
      <SearchField />
      {/* If a marker is selected, then show the popup for that marker */}
      {activeMarker && (
        <Popup
          className="popup"
          position={[activeMarker.coordinates[0], activeMarker.coordinates[1]]}
          onClose={() => setActiveMarker(null)}
        >
          <div className="popup-location">
            <img src={activeMarker.image} alt="Sample" height={50} width={50} />
            <p>
              Location: {activeMarker.id}&emsp;&emsp;&emsp;Box Number: {activeMarker.number}
            </p>
          </div>
          <div className="popup-message">
            <span> Message: </span>
            <div className="popup-message-box">
              <span>
                You have a purpose to be on this planet. Here is a gift to encourage you to go out
                there and be yourself. Remember, life has meaning to itself. Don’t let other
                people’s thoughts ruin your capability.
              </span>
            </div>
          </div>
          <div className="popup-message">
            <br />
            <span> Additional Comments: </span>
            <div className="popup-message-box">
              <span> Put this anonymous box outside, in front of a flower porch. </span>
            </div>
          </div>
        </Popup>
      )}
      {/* If a marker is selected, then show the popup for that marker */}
      {activeMarker && (
        <div id="box-approval-overlay-container">
          <BoxApproval />
        </div>
      )}
    </MapContainer>
  );
};

export default Map;
