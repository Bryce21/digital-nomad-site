import React, { useState } from 'react';
import {
    AdvancedMarker,
    InfoWindow, Marker, Pin,
    useAdvancedMarkerRef, useMarkerRef
} from '@vis.gl/react-google-maps';




interface GoogleMapMarkerProps<T> {
    lat: number,
    long: number,
    iconColor: string
    data: T
    popupData: (x: T) => any
}

export default function GoogleMapMarker<T>(props: GoogleMapMarkerProps<T>) {
    const [infoWindowOpen, setInfoWindowOpen] = useState(false);
    const [markerRef, marker] = useMarkerRef();

    const { lat, long, popupData, data } = props
    return (
        <>
            <Marker
                position={{ lat, lng: long }}
                onMouseOver={() => setInfoWindowOpen(true)}
                onMouseOut={() => setTimeout(() => setInfoWindowOpen(false), 200)}
                ref={markerRef}

                icon={{
                    url: `http://maps.google.com/mapfiles/ms/icons/${props.iconColor}-dot.png`,
                }}
            />
            {infoWindowOpen && (
                <InfoWindow
                    anchor={marker}
                    maxWidth={200}
                    onCloseClick={() => setInfoWindowOpen(false)}
                >
                    {popupData(data)}
                </InfoWindow>
            )}
        </>
    );
};
