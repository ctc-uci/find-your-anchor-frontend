/* eslint-disable */
import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';
import LoadingPage from '../../common/LoadingPage/LoadingPage';

import MapRef from './MapRef';
import { FYABackend } from '../../common/utils';

import 'leaflet/dist/leaflet.css';

import './Map.css';

function Map({
  setSelectedZipCode,
  setSelectedCountry,
  openMarkerInfo,
  closeBoxApproval,
  setSelectedBox,
  setSelectedBoxTransaction,
  setBoxListPageIndex,
}) {
  const [isLoading, setIsLoading] = useState(true);
  const [markers, setMarkers] = useState([]);

  const style = {
    height: '100%',
    width: '100%',
  };

  const dimensions = {
    width: '100vw',
    height: '100vh',
  };

  useEffect(async () => {
    const zipCodes = await FYABackend.get('/anchorBox/locations');
    setMarkers(zipCodes.data);
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return <LoadingPage />;
  }
  return (
    <div style={style}>
      <MapContainer
        center={[40.770142, -100.424654]}
        zoom={5}
        zoomControl={false}
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
        <MapRef
          width={dimensions.width}
          height={dimensions.height}
          markers={markers}
          setMarkers={setMarkers}
          setSelectedZipCode={setSelectedZipCode}
          setSelectedCountry={setSelectedCountry}
          openMarkerInfo={openMarkerInfo}
          closeBoxApproval={closeBoxApproval}
          setSelectedBox={setSelectedBox}
          setSelectedBoxTransaction={setSelectedBoxTransaction}
          setBoxListPageIndex={setBoxListPageIndex}
        />
      </MapContainer>
    </div>
  );
}

export default Map;
