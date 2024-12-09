import React, { useState } from 'react';
import { InfoWindow, Marker, useMarkerRef } from '@vis.gl/react-google-maps';

interface GoogleMapMarkerProps<T> {
  lat: number;
  long: number;
  iconColor: string;
  data: T;
  popupData: (x: T) => JSX.Element;
  onClick: () => void;
}

export default function GoogleMapMarker<T>(props: GoogleMapMarkerProps<T>) {
  const [infoWindowOpen, setInfoWindowOpen] = useState(false);
  const [markerRef, marker] = useMarkerRef();

  const { lat, long, popupData, data, onClick } = props;
  return (
    <>
      <Marker
        position={{ lat, lng: long }}
        onMouseOver={() => setInfoWindowOpen(true)}
        onMouseOut={() => setTimeout(() => setInfoWindowOpen(false), 200)}
        ref={markerRef}
        onClick={() => onClick()}
        icon={{
          url: `http://maps.google.com/mapfiles/ms/icons/${props.iconColor}-dot.png`,
        }}
      />
      {infoWindowOpen && (
        <InfoWindow
          anchor={marker}
          position={{ lat, lng: long }}
          maxWidth={500}
          onCloseClick={() => setInfoWindowOpen(false)}
        >
          {popupData(data)}
        </InfoWindow>
      )}
    </>
  );
}
