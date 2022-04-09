import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, useMap, ZoomControl, Tooltip, Marker } from 'react-leaflet';
import { GeoSearchControl, OpenStreetMapProvider } from 'leaflet-geosearch';
import Leaflet from 'leaflet';
import PropTypes from 'prop-types';

import MarkerIcon from '../../assets/MarkerIcon.svg';
import './Map.css';
import { FYABackend } from '../../common/utils';

class BoxProvider extends OpenStreetMapProvider {
  constructor(options) {
    super({
      ...options,
      searchUrl: 'http://localhost:3001/anchorBox/search',
      reverseUrl: 'http://localhost:3001/anchorBox/search',
    });
  }
}

const Map = ({
  setSelectedCountry,
  setSelectedZipCode,
  setSelectedBox,
  setUpdateBoxListSwitch,
  updateBoxListSwitch,
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [mapState, setMapState] = useState(null);
  // A list containing all unique zip codes stored in Anchor_Box
  const [zipcodeData, setZipCodeData] = useState([]);

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
    setIsLoading(false);
  }, []);

  // This is the SearchField component used for searching locations
  const LocationSearchField = () => {
    const map = useMap();
    const searchControl = new GeoSearchControl({
      provider: new OpenStreetMapProvider(),
      searchLabel: 'Search by location',
      showMarker: false,
      showPopup: false,
    });
    useEffect(() => {
      map.addControl(searchControl);
      return () => map.removeControl(searchControl);
    });

    return null;
  };

  const BoxSearchField = () => {
    const map = useMap();
    const searchControl = new GeoSearchControl({
      provider: new BoxProvider(),
      searchLabel: 'Search by box number',
      showMarker: false,
      showPopup: false,
      updateMap: false,
      keepResult: true,
    });

    // This event is triggered whenever the user selects a search result
    // The map should zoom to the marker/zip code that contains the box
    // and show the box's attributes on the right sidebar
    map.on('geosearch/showlocation', async marker => {
      const {
        zip_code: zipCode,
        display_name: boxID,
        country,
        lat: latitude,
        lon: longitude,
      } = marker.location.raw;
      // Open right sidebar
      setSelectedZipCode(zipCode);
      setSelectedCountry(country);
      // Change right sidebar into BoxList view
      setSelectedBox(boxID);
      // Fly to marker with box
      if (mapState) {
        mapState.flyTo([latitude, longitude], 10);
      }
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

  if (isLoading) {
    return <h1>LOADING...</h1>;
  }
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
      <LocationSearchField />
      <BoxSearchField />
    </MapContainer>
  );
};

Map.defaultProps = {
  selectedBox: null,
};

Map.propTypes = {
  setSelectedCountry: PropTypes.func.isRequired,
  setSelectedZipCode: PropTypes.func.isRequired,
  setUpdateBoxListSwitch: PropTypes.func.isRequired,
  setSelectedBox: PropTypes.func.isRequired,
  updateBoxListSwitch: PropTypes.bool.isRequired,
  selectedBox: PropTypes.shape({
    box_id: PropTypes.number,
    additional_comments: PropTypes.string,
    country: PropTypes.string,
    date: PropTypes.string,
    general_location: PropTypes.string,
    latitude: PropTypes.number,
    longitude: PropTypes.number,
    message: PropTypes.string,
    launched_organically: PropTypes.bool,
    picture: PropTypes.string,
    show_on_map: PropTypes.bool,
    zip_code: PropTypes.string,
  }),
};

export default Map;
