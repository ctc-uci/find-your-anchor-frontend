/* eslint-disable */
import * as React from 'react';
import { Marker, Tooltip } from 'react-leaflet';
import { icon } from 'leaflet';

const markerIcon = selected =>
  icon({
    iconSize: [25, 41],
    iconAnchor: [10, 41],
    popupAnchor: [2, -40],
    iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-${
      selected ? 'red' : 'green'
    }.png`,
    shadowUrl: 'https://unpkg.com/leaflet@1.5.1/dist/images/marker-shadow.png',
  });

export function MarkerContainer({ position, id, onMarkerClick, selected }) {
  const eventHandlers = React.useMemo(
    () => ({
      click(e) {
        onMarkerClick(id, position);
      },
    }),
    [onMarkerClick, id, position],
  );

  return (
    <>
      <Marker position={position} eventHandlers={eventHandlers} icon={markerIcon(selected)}>
        {selected && (
          <Tooltip direction="right" offset={[0, -10]} opacity={1} permanent>
            {id}
          </Tooltip>
        )}
      </Marker>
    </>
  );
}
