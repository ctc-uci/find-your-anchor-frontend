import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, useMap, ZoomControl } from 'react-leaflet';
import { GeoSearchControl, OpenStreetMapProvider } from 'leaflet-geosearch';
import PropTypes from 'prop-types';
import icons from 'leaflet-color-number-markers';

import './Map.css';

const Map = ({ setSelectedCountry, setSelectedZipCode }) => {
  // This mapState variable stores the current instance of the map.
  // This is used to fly to markers when they're clicked
  const [mapState, setMapState] = useState(null);

  // This is sample data for Markers
  // The only required pieces of data for Markers to show up are the long/lat coordinates
  // Could use Nominatim to convert from city/state/etc name to coordinates (https://nominatim.org/release-docs/develop/api/Overview/)
  const markerData = [
    {
      id: 1,
      boxID: 1,
      date: '09/22/2022',
      longitude: 32.715736,
      latitude: -117.161087,
      generalLocation: 'UCSD',
      image: 'https://pngimg.com/uploads/box/box_PNG49.png',
      zipCode: '92130',
      country: 'USA',
    },
    {
      id: 2,
      boxID: 2,
      date: '09/22/2022',
      longitude: 33.6846,
      latitude: -117.8265,
      generalLocation: 'UCI',
      image: 'https://pngimg.com/uploads/box/box_PNG49.png',
      zipCode: '92617',
      country: 'USA',
    },
    {
      id: 3,
      boxID: 3,
      date: '09/22/2022',
      longitude: 33.6846,
      latitude: -117.8265,
      generalLocation: 'VDCN',
      image: 'https://pngimg.com/uploads/box/box_PNG49.png',
      zipCode: '92617',
      country: 'USA',
    },
    {
      id: 4,
      boxID: 4,
      date: '09/22/2022',
      longitude: 34.052235,
      latitude: -118.243683,
      generalLocation: 'UCLA',
      image: 'https://pngimg.com/uploads/box/box_PNG49.png',
      zipCode: '90095',
      country: 'USA',
    },
  ];

  // This is the SearchField component used for searching locations
  const SearchField = () => {
    const map = useMap();

    const searchControl = new GeoSearchControl({
      provider: new OpenStreetMapProvider(),
      searchLabel: 'Search city, zipcode, or box number',
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
      <ZoomControl position="bottomright" />
      {/* Map the marker data into <Marker /> components */}
      {markerData.map(markerObject => (
        <Marker
          icon={
            icons.blue.numbers[
              markerData.filter(marker => marker.zipCode === markerObject.zipCode).length
            ]
          }
          key={markerObject.boxID}
          position={[markerObject.longitude, markerObject.latitude]}
          eventHandlers={{
            // Marker click effect
            click: () => {
              mapState.flyTo([markerObject.longitude, markerObject.latitude], 10);
              setSelectedCountry(markerObject.country);
              setSelectedZipCode(markerObject.zipCode);
            },
          }}
        />
      ))}
      <SearchField />
      {/* If a marker is selected, then show the popup for that marker */}
      {/* {activeMarker && (
        <Popup
          className="popup"
          position={[activeMarker.latitude, activeMarker.longitude]}
          onClose={() => setActiveMarker(null)}
          offset={[0, 280]}
          closeButton={false}
        >
          <div className="marker-popup">
            <p className="popup-header">Zip Code: 92627</p>
            <PopUpBox number="Box #1234" date="01/22/2022" />
            <PopUpBox number="Box #1234" date="01/22/2022" />
            <PopUpBox number="Box #1234" date="01/22/2022" />
          </div>
        </Popup>
      )} */}
    </MapContainer>
  );
};

Map.propTypes = {
  setSelectedCountry: PropTypes.func.isRequired,
  setSelectedZipCode: PropTypes.func.isRequired,
};

export default Map;
