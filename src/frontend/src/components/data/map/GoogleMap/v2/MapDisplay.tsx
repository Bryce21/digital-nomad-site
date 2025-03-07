import React from 'react';
import { Map } from '@vis.gl/react-google-maps';
import { LatLng, Place } from '../../../../../types/types';
import GoogleMapMarker from './GoogleMapMarker';
import { CenterMarker } from './CenterMarker';
import { DataInPopup } from './DataInPopup';

interface GoogleMapProps {
  centerAddress: string;
  center: LatLng;
  markerData: Place[];
  initialZoom?: number;
  gestureHandling?: string;
  disableDefaultUI?: boolean;
  mapId?: string;
  colors: { [index: string]: string };
}

export function GoogleMap(props: GoogleMapProps) {
  function displayPlaceData(data: Place) {
    return <DataInPopup data={data} />;
  }

  return (
    <div style={{ height: '90vh' }}>
      <Map
        mapId={props.mapId || 'bf51a910020fa25a'}
        zoom={props.initialZoom || 14}
        center={props.center}
        gestureHandling={props.gestureHandling}
        disableDefaultUI={props.disableDefaultUI}
      >
        {[
          <CenterMarker
            key={-1}
            latLong={props.center}
            centerAddress={props.centerAddress}
          />,
          ...props.markerData.map((place: Place, index: number) => (
            <GoogleMapMarker<Place>
              key={index}
              lat={place.lat}
              long={place.long}
              // todo need to set different colors depending on the type
              // but needs to line up with antd multi select component
              iconColor={props.colors[place.fromType]}
              data={place}
              onClick={() => {
                if (place.place_id) {
                  window.open(
                    encodeURI(
                      `https://www.google.com/maps/place/?q=place_id:${place.place_id}`
                    ),
                    '_blank'
                  );
                }
              }}
              popupData={(d: Place) => displayPlaceData(d)}
            />
          )),
        ]}
      </Map>
    </div>
  );
}

export default GoogleMap;
