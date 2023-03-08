/* eslint-disable */
import * as React from 'react';
import MarkerClusterGroup from 'react-leaflet-markercluster';
import 'react-leaflet-markercluster/dist/styles.min.css';
import { MarkerContainer } from './MarkerContainer';

function MarkerClusterContainer({ mapRef, width, height, markers, onMarkerClick }) {
  React.useEffect(() => {
    if (mapRef) {
      mapRef.invalidateSize();
    }
  }, [mapRef, width, height]);

  const markerComponents = React.useMemo(() => {
    console.log('recomputing whole thing');
    return markers.map(marker => {
      return (
        <MarkerContainer
          position={[marker.latitude, marker.longitude]}
          key={marker.id}
          zipCode={marker.zip_code}
          country={marker.country}
          onMarkerClick={onMarkerClick}
        />
      );
    });
  }, [markers, onMarkerClick]);

  return (
    <>
      <MarkerClusterGroup>{markerComponents}</MarkerClusterGroup>
    </>
  );
}

export default MarkerClusterContainer;

// export default React.memo(MarkerClusterContainer, (props, nextProps) => {
//   if (props.width !== nextProps.width || props.height !== nextProps.height) {
//     props.mapRef.invalidateSize();
//     return true;
//   }
// });
