/* eslint-disable */
import * as React from 'react';
import { Marker, Tooltip } from 'react-leaflet';
import Leaflet from 'leaflet';

import MarkerIcon from '../../assets/MarkerIcon.svg';

const markerIcon = new Leaflet.Icon({
  iconUrl: MarkerIcon,
  iconRetinaUrl: MarkerIcon,
  iconSize: [30, 30],
});

export function MarkerContainer({ position, zipCode, country, boxCount, onMarkerClick }) {
  const eventHandlers = React.useMemo(
    () => ({
      click(e) {
        onMarkerClick(zipCode, country, position);
      },
    }),
    [onMarkerClick, zipCode, country, position],
  );

  return (
    <>
      <Marker position={position} eventHandlers={eventHandlers} icon={markerIcon}>
        <Tooltip interactive className="tooltip" direction="top" permanent>
          {boxCount}
        </Tooltip>
      </Marker>
    </>
  );
}
