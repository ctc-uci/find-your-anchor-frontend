/* eslint-disable */
import * as React from 'react';
import MarkerClusterGroup from 'react-leaflet-markercluster';
import Leaflet from 'leaflet';
import { MarkerContainer } from './MarkerContainer';
import 'react-leaflet-markercluster/dist/styles.min.css';

function MarkerClusterContainer({ mapRef, width, height, markers, onMarkerClick }) {
  React.useEffect(() => {
    if (mapRef) {
      mapRef.invalidateSize();
    }
  }, [mapRef, width, height]);
  // This is a cluster icon. It sums up the box_count of all boxes of a single country.
  const clusterIcon = cluster => {
    let clusterCount = 0;
    cluster.getAllChildMarkers().forEach(marker => {
      clusterCount += parseInt(marker.options.children.props.children, 10);
    });

    const size = Math.max(30, clusterCount.toString().length * 10 + 5);
    return Leaflet.divIcon({
      html: `<span style="line-height: ${size}px;">${clusterCount}</span>`,
      className: 'marker-cluster',
      iconSize: Leaflet.point(size, size),
    });
  };

  const markerComponents = React.useMemo(() => {
    console.log('recomputing whole thing');
    return markers.map(marker => {
      return (
        <MarkerContainer
          position={[marker.latitude, marker.longitude]}
          key={marker.id}
          zipCode={marker.zip_code}
          country={marker.country}
          boxCount={marker.box_count}
          onMarkerClick={onMarkerClick}
        />
      );
    });
  }, [markers, onMarkerClick]);

  return (
    <MarkerClusterGroup iconCreateFunction={clusterIcon}>{markerComponents}</MarkerClusterGroup>
  );
}

export default MarkerClusterContainer;
