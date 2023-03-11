/* eslint-disable */
import * as React from 'react';
import { latLng, latLngBounds } from 'leaflet';
import { useMap } from 'react-leaflet';
import { GeoSearchControl, OpenStreetMapProvider } from 'leaflet-geosearch';
import isEqual from 'lodash.isequal';

import MarkerClusterContainer from './MarkerClusterContainer';

const DEF_BOUNDS = latLng([51.505, -0.09]).toBounds(5000);

class BoxProvider extends OpenStreetMapProvider {
  constructor(options) {
    super({
      ...options,
      // searchUrl: `${process.env.REACT_APP_PROD_API_URL}/anchorBox/search`,
      // reverseUrl: `${process.env.REACT_APP_PROD_API_URL}/anchorBox/search`,
      searchUrl: 'http://localhost:3001/anchorBox/search',
      reverseUrl: 'http://localhost:3001/anchorBox/search',
    });
  }
}

const MapRef = ({
  markers,
  width,
  height,
  setSelectedZipCode,
  setSelectedCountry,
  openMarkerInfo,
  closeBoxApproval,
  setSelectedBox,
  setSelectedBoxTransaction,
  setBoxListPageIndex,
}) => {
  const mapRef = useMap();
  const bounds = React.useRef(DEF_BOUNDS);

  // This is the SearchField component used for searching locations
  const LocationSearchField = () => {
    const searchControl = new GeoSearchControl({
      provider: new OpenStreetMapProvider(),
      searchLabel: 'Search city or zipcode',
      showMarker: false,
      showPopup: false,
      autoClose: true,
      keepResult: true,
    });
    React.useEffect(() => {
      mapRef.addControl(searchControl);
      return () => mapRef.removeControl(searchControl);
    });

    return null;
  };

  // This is a marker icon.
  const BoxSearchField = () => {
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
    mapRef.on('geosearch/showlocation', async marker => {
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
        if (mapRef) {
          let newBounds = DEF_BOUNDS;
          newBounds = latLng([latitude, longitude]).toBounds(1500);
          if (!isEqual(newBounds, bounds?.current)) {
            bounds.current = newBounds;
            mapRef.fitBounds(newBounds);
          }
        }
      }
    });

    React.useEffect(() => {
      mapRef.addControl(searchControl);
      return () => mapRef.removeControl(searchControl);
    });

    return null;
  };

  const onMarkerClick = React.useCallback(
    (zipCode, country, pos) => {
      setSelectedZipCode(zipCode);
      setSelectedCountry(country);
      setSelectedBox(null);
      setSelectedBoxTransaction(null);
      setBoxListPageIndex(1);
      closeBoxApproval();
      openMarkerInfo();
      if (mapRef) {
        let newBounds = DEF_BOUNDS;
        newBounds = latLng(pos).toBounds(1500);
        if (!isEqual(newBounds, bounds?.current)) {
          bounds.current = newBounds;
          mapRef.fitBounds(newBounds);
        }
      }
    },
    [
      mapRef,
      setSelectedZipCode,
      setSelectedCountry,
      openMarkerInfo,
      closeBoxApproval,
      setSelectedBox,
      setSelectedBoxTransaction,
      setBoxListPageIndex,
    ],
  );

  return (
    <>
      <MarkerClusterContainer
        mapRef={mapRef}
        width={width}
        height={height}
        markers={markers}
        onMarkerClick={onMarkerClick}
        openMarkerInfo={openMarkerInfo}
      />
      <LocationSearchField />
      <BoxSearchField />
    </>
  );
};

export default MapRef;
