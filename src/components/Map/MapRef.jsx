/* eslint-disable */
import * as React from 'react';
import { latLng, latLngBounds } from 'leaflet';
import { useMap } from 'react-leaflet';
import isEqual from 'lodash.isequal';

import MarkerClusterContainer from './MarkerClusterContainer';

const DEF_BOUNDS = latLng([51.505, -0.09]).toBounds(5000);

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
    </>
  );
};

export default MapRef;
