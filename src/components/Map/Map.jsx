import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, useMap, ZoomControl, Tooltip, Marker } from 'react-leaflet';
import { GeoSearchControl, OpenStreetMapProvider } from 'leaflet-geosearch';
import Leaflet from 'leaflet';
import MarkerClusterGroup from 'react-leaflet-markercluster';
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
}) => {
  const [mapState, setMapState] = useState(null);
  // A list containing all unique zip codes stored in Anchor_Box
  const [zipcodeData, setZipCodeData] = useState([]);

  const [zoomLevel, setZoomLevel] = useState(12);
  // Handles when a marker is clicked
  // 1. Updates the box list with the boxes located in the zip code (in PinInformation)
  // 2. Switches PinInformation to box list view
  const handleMarkerClicked = markerObject => {
    setSelectedCountry(markerObject.country);
    setSelectedZipCode(markerObject.zip_code);
    // Toggle updateBoxListSwitch, which will update update the box list in the right side bar
    setUpdateBoxListSwitch(!updateBoxListSwitch);
    setSelectedBox(null);
    setZoomLevel(Math.max(mapState.getZoom(), 10));
    // IMPORTANT: mapState.flyTo(xxx) must be called LAST in order to avoid a moving pin bug
    mapState.flyTo([markerObject.latitude, markerObject.longitude], zoomLevel);
  };

  // This function makes it so that when a marker cluser is clicked, the right side bar closes.
  const handleMarkerClusterClicked = () => {
    setSelectedCountry(null);
    setSelectedZipCode(null);
    setSelectedBox(null);
  };

  // Sets zipcodeData to be an object
  // {country : { zipcode, country, latitude, longitude, box_count}}
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

  // This is a marker icon.
  const markerIcon = new Leaflet.Icon({
    iconUrl: MarkerIcon,
    iconRetinaUrl: MarkerIcon,
    iconSize: [30, 30],
  });

  // This is a cluster icon. It sums up the box_count of all boxes of a single country.
  const clusterIcon = cluster => {
    let clusterCount = 0;
    cluster.getAllChildMarkers().forEach(marker => {
      clusterCount += parseInt(marker.options.children.props.children, 10);
    });

    return Leaflet.divIcon({
      html: `<span>${clusterCount}</span>`,
      className: 'marker-cluster',
      iconSize: Leaflet.point(30, 30),
    });
  };

  return (
    <MapContainer
      whenCreated={setMapState}
      center={[33.684566, -117.826508]}
      zoom={8}
      scrollWheelZoom
      zoomControl={false}
      minZoom={2.4}
      maxBounds={[
        [-90, -180],
        [90, 180],
      ]}
      maxBoundsViscosity={1.0}
    >
      <TileLayer
        // Can change this url to display different tilelayers (samples: https://leaflet-extras.github.io/leaflet-providers/preview/)
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        noWrap
      />
      <ZoomControl position="bottomright" />
      {/* Map the marker data into <Marker /> components. These markers are grouped into MarkerClusterGroups by country */}
      {zipcodeData &&
        Object.values(zipcodeData).map((locations, index) => {
          return (
            /* eslint-disable react/no-array-index-key */
            <MarkerClusterGroup
              iconCreateFunction={clusterIcon}
              key={index}
              onClick={() => {
                handleMarkerClusterClicked();
              }}
            >
              {locations.map(markerObject => (
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
            </MarkerClusterGroup>
          );
        })}
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
