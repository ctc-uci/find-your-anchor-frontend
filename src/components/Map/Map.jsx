import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, useMap, ZoomControl, Tooltip, Marker } from 'react-leaflet';
import { GeoSearchControl, OpenStreetMapProvider } from 'leaflet-geosearch';
import Leaflet from 'leaflet';
import PropTypes from 'prop-types';

import MarkerIcon from '../../assets/MarkerIcon.svg';
import './Map.css';
import { FYABackend } from '../../common/utils';

const Map = ({
  setSelectedCountry,
  setSelectedZipCode,
  setSelectedBox,
  setUpdateBoxListSwitch,
  updateBoxListSwitch,
  zipCodeData,
  setZipCodeData,
}) => {
  const [mapState, setMapState] = useState(null);

  // Handles when a marker is clicked
  // 1. Updates the box list with the boxes located in the zip code (in PinInformation)
  // 2. Switches PinInformation to box list view
  const handleMarkerClicked = markerObject => {
    setSelectedCountry(markerObject.country);
    setSelectedZipCode(markerObject.zip_code);
    // Toggle updateBoxListSwitch, which will update update the box list in the right side bar
    setUpdateBoxListSwitch(!updateBoxListSwitch);
    setSelectedBox(null);
    // IMPORTANT: mapState.flyTo(xxx) must be called LAST in order to avoid a moving pin bug
    mapState.flyTo([markerObject.latitude, markerObject.longitude], 10);
  };

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

  const markerIcon = new Leaflet.Icon({
    iconUrl: MarkerIcon,
    iconRetinaUrl: MarkerIcon,
    iconSize: [30, 30],
  });

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
      {zipCodeData &&
        zipCodeData.map(markerObject => (
          <Marker
            icon={markerIcon}
            key={markerObject.box_id}
            position={[markerObject.latitude, markerObject.longitude]}
            eventHandlers={{
              // Marker click effect
              click: () => {
                handleMarkerClicked(markerObject);
              },
            }}
          >
            <Tooltip interactive className="tooltip" direction="top" permanent>
              {markerObject.box_count}
            </Tooltip>
          </Marker>
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
  zipCodeData: PropTypes.arrayOf(
    PropTypes.shape({
      zip_code: PropTypes.string,
      country: PropTypes.string,
      longitude: PropTypes.number,
      latitude: PropTypes.number,
      box_count: PropTypes.number,
    }),
  ).isRequired,
  setZipCodeData: PropTypes.func.isRequired,
};

export default Map;
