import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, useMap, ZoomControl } from 'react-leaflet';
import { GeoSearchControl, OpenStreetMapProvider } from 'leaflet-geosearch';
import PropTypes from 'prop-types';
import icons from 'leaflet-color-number-markers';

import './Map.css';
import { FYABackend } from '../../common/utils';

const Map = ({
  setSelectedCountry,
  setSelectedZipCode,
  setSelectedBox,
  setUpdateBoxListSwitch,
  updateBoxListSwitch,
}) => {
  // This mapState variable stores the current instance of the map.
  // This is used to fly to markers when they're clicked
  const [mapState, setMapState] = useState(null);
  // A list containing all unique zip codes stored in Anchor_Box
  const [zipcodeData, setZipCodeData] = useState([]);

  useEffect(async () => {
    const zipCodes = await FYABackend.get('/anchorBox/locations');
    setZipCodeData(zipCodes.data);
  }, []);

  // This is the SearchField component used for searching locations
  const SearchField = () => {
    const map = useMap();

    const searchControl = new GeoSearchControl({
      provider: new OpenStreetMapProvider(),
      searchLabel: 'Search city, zipcode, or box number',
      showMarker: false,
      showPopup: false,
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
      {zipcodeData &&
        zipcodeData.map(markerObject => (
          <Marker
            icon={icons.blue.numbers[markerObject.box_count]}
            key={markerObject.box_id}
            position={[markerObject.latitude, markerObject.longitude]}
            eventHandlers={{
              // Marker click effect
              click: () => {
                mapState.flyTo([markerObject.latitude, markerObject.longitude], 10);
                setSelectedCountry(markerObject.country);
                setSelectedZipCode(markerObject.zip_code);
                // Toggle updateBoxListSwitch, which will update update the box list in the right side bar
                setUpdateBoxListSwitch(!updateBoxListSwitch);
                setSelectedBox(null);
              },
            }}
          />
        ))}
      <SearchField />
    </MapContainer>
  );
};

Map.propTypes = {
  setSelectedCountry: PropTypes.func.isRequired,
  setSelectedZipCode: PropTypes.func.isRequired,
  setUpdateBoxListSwitch: PropTypes.func.isRequired,
  setSelectedBox: PropTypes.func.isRequired,
  updateBoxListSwitch: PropTypes.bool.isRequired,
};

export default Map;
