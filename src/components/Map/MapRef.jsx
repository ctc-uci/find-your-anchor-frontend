/* eslint-disable */
import * as React from 'react';
import { latLng, latLngBounds } from 'leaflet';
import { useMap } from 'react-leaflet';
import isEqual from 'lodash.isequal';

import MarkerClusterContainer from './MarkerClusterContainer';

// const generateMarkers = count => {
//   const southWest = new latLng(30.0, -20.0);
//   const northEast = new latLng(60.0, 20.0);
//   const bounds = new latLngBounds(southWest, northEast);

//   const minLat = bounds.getSouthWest().lat,
//     rangeLng = bounds.getNorthEast().lat - minLat,
//     minLng = bounds.getSouthWest().lng,
//     rangeLat = bounds.getNorthEast().lng - minLng;

//   const result = Array.from({ length: count }, (v, k) => {
//     return {
//       id: k,
//       selected: false,
//       pos: new latLng(minLat + Math.random() * rangeLng, minLng + Math.random() * rangeLat),
//     };
//   });
//   return result;
// };

// const MARKERS = generateMarkers(10000);

const DEF_BOUNDS = latLng([51.505, -0.09]).toBounds(5000);

const MapRef = ({ markers, setMarkers, width, height, onMarkerClick: setSelected }) => {
  const mapRef = useMap();
  const bounds = React.useRef(DEF_BOUNDS);
  const onMarkerClick = React.useCallback(
    (id, pos) => {
      setSelected(id);
      if (mapRef) {
        let newBounds = DEF_BOUNDS;
        newBounds = latLng(pos).toBounds(1500);
        if (!isEqual(newBounds, bounds?.current)) {
          bounds.current = newBounds;
          mapRef.fitBounds(newBounds);
        }
      }
    },
    [mapRef, setSelected],
  );

  return (
    <>
      <MarkerClusterContainer
        mapRef={mapRef}
        width={width}
        height={height}
        markers={markers}
        onMarkerClick={onMarkerClick}
      />
    </>
  );
};

export default MapRef;
