import React, { useState, useEffect } from 'react';
import Leaflet from 'leaflet';
import { MapContainer, TileLayer } from 'react-leaflet';
import MapRef from './MapRef';
import { FYABackend } from '../../common/utils';

import 'leaflet/dist/leaflet.css';

import './Map.css';

Leaflet.Icon.Default.imagePath = '//cdnjs.cloudflare.com/ajax/libs/leaflet/1.0.0/images/';

function MapComponent() {
  const [markers, setMarkers] = useState([]);
  const [selected, setSelected] = useState(null);

  const handleMarkerClick = React.useCallback(id => {
    setSelected(id);
  }, []);
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
  }, []);

  return (
    <div style={style}>
      <MapContainer center={[51.505, -0.09]} zoom={5}>
        <TileLayer
          attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.osm.org/{z}/{x}/{y}.png"
        />
        <MapRef
          width={dimensions.width}
          height={dimensions.height}
          onMarkerClick={handleMarkerClick}
          selected={selected}
          markers={markers}
          setMarkers={setMarkers}
        />
      </MapContainer>
    </div>
  );
}

export default MapComponent;
