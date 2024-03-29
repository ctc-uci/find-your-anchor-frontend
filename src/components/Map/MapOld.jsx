import React, { useEffect, useState, memo, useMemo } from 'react';
import { MapContainer, TileLayer, useMap, ZoomControl, Tooltip, Marker } from 'react-leaflet';
import { GeoSearchControl, OpenStreetMapProvider } from 'leaflet-geosearch';
import Leaflet from 'leaflet';
import MarkerClusterGroup from 'react-leaflet-markercluster';
import PropTypes from 'prop-types';

import MarkerIcon from '../../assets/MarkerIcon.svg';
import './Map.css';
import { FYABackend } from '../../common/utils';
import LoadingPage from '../../common/LoadingPage/LoadingPage';

class BoxProvider extends OpenStreetMapProvider {
  constructor(options) {
    super({
      ...options,
      searchUrl: `${process.env.REACT_APP_PROD_API_URL}/anchorBox/search`,
      reverseUrl: `${process.env.REACT_APP_PROD_API_URL}/anchorBox/search`,
      // searchUrl: 'http://localhost:3001/anchorBox/search',
      // reverseUrl: 'http://localhost:3001/anchorBox/search',
    });
  }
}

const Map = memo(
  ({
    setSelectedCountry,
    setSelectedZipCode,
    setSelectedBox,
    setSelectedBoxTransaction,
    zipCodeData,
    setZipCodeData,
    closeBoxApproval,
    closeMarkerInfo,
    openMarkerInfo,
    setBoxListPageIndex,
  }) => {
    const [isLoading, setIsLoading] = useState(true);
    const [mapState, setMapState] = useState(null);

    // Handles when a marker is clicked
    // 1. Updates the box list with the boxes located in the zip code (in PinInformation)
    // 2. Switches PinInformation to box list view
    const handleMarkerClicked = markerObject => {
      // Close the left sidebar if open
      closeBoxApproval();
      // Change the box list in right sidebar
      setSelectedCountry(markerObject.country);
      setSelectedZipCode(markerObject.zip_code);
      // Open the right sidebar
      openMarkerInfo();
      setSelectedBox(null);
      setSelectedBoxTransaction(null);
      // Set box list page index to 1
      setBoxListPageIndex(1);
      // IMPORTANT: mapState.flyTo(xxx) must be called LAST in order to avoid a moving pin bug
      // mapState.flyTo(
      //   [markerObject.latitude, markerObject.longitude],
      //   Math.max(mapState.getZoom(), 10),
      // );
    };

    // This function makes it so that when a marker cluser is clicked, the right side bar closes.
    const handleMarkerClusterClicked = () => {
      closeMarkerInfo();
      setSelectedCountry(null);
      setSelectedZipCode(null);
      setSelectedBox(null);
    };

    // Sets zipcodeData to be an object
    // {country : { zipcode, country, latitude, longitude, box_count}}
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
        searchLabel: 'Search city or zipcode',
        showMarker: false,
        showPopup: false,
        autoClose: true,
        keepResult: true,
      });
      useEffect(() => {
        map.addControl(searchControl);
        return () => map.removeControl(searchControl);
      });

      return null;
    };

    // This is a marker icon.
    const BoxSearchField = () => {
      const map = useMap();
      const searchControl = new GeoSearchControl({
        provider: new BoxProvider(),
        searchLabel: 'Search box number',
        showMarker: false,
        showPopup: false,
        updateMap: false,
        autoClose: true,
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
          custom,
        } = marker.location.raw;
        // Only show the right sidebar if the user searched for box number (not location)
        if (custom) {
          // Close left sidebar
          closeBoxApproval();
          // Open right sidebar
          setSelectedZipCode(zipCode);
          setSelectedCountry(country);
          openMarkerInfo();
          // Change right sidebar into BoxInfo view
          setSelectedBoxTransaction(null);
          setSelectedBox(boxID);
          // Fly to marker with box
          if (mapState) {
            mapState.flyTo([latitude, longitude], 10);
          }
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

    const markerComponents = useMemo(() => {
      console.log('recomputing');
      return zipCodeData.map(markerObject => (
        /* eslint-disable react/no-array-index-key */
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
      ));
    }, [zipCodeData, handleMarkerClicked]);

    if (isLoading) {
      return <LoadingPage />;
    }
    return (
      <MapContainer
        whenCreated={setMapState}
        center={[40.770142, -100.424654]}
        zoom={5}
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
          url={`https://tiles.stadiamaps.com/tiles/outdoors/{z}/{x}/{y}{r}.png?api_key=${process.env.REACT_APP_MAP_APIKEY}`}
          attribution='&copy; <&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors'
          noWrap
        />
        <ZoomControl position="bottomright" />
        {/* Map the marker data into <Marker /> components. These markers are grouped into MarkerClusterGroups by country */}
        <MarkerClusterGroup
          iconCreateFunction={clusterIcon}
          key={1}
          onClick={() => {
            handleMarkerClusterClicked();
          }}
          removeOutsideVisibleBounds={false}
        >
          {zipCodeData && markerComponents}
        </MarkerClusterGroup>
        <LocationSearchField />
        <BoxSearchField />
      </MapContainer>
    );
  },
  (currMap, nextMap) => currMap.zipCodeData === nextMap.zipCodeData,
);

Map.displayName = 'Map';

Map.propTypes = {
  setSelectedCountry: PropTypes.func.isRequired,
  setSelectedZipCode: PropTypes.func.isRequired,
  setSelectedBox: PropTypes.func.isRequired,
  setSelectedBoxTransaction: PropTypes.func.isRequired,
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
  closeBoxApproval: PropTypes.func.isRequired,
  openMarkerInfo: PropTypes.func.isRequired,
  closeMarkerInfo: PropTypes.func.isRequired,
  setBoxListPageIndex: PropTypes.func.isRequired,
};

export default Map;
