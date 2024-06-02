import React from "react";
import {
  AdvancedMarker,
  APIProvider,
  Map,
  useMap,
} from "@vis.gl/react-google-maps";
import { LatLng, Place } from "../../../../../types/types";
import GoogleMapMarker from "./GoogleMapMarker";
import { CenterMarker } from "./CenterMarker";

interface GoogleMapProps {
  centerAddress: string;
  center: LatLng;
  markerData: Place[];
  initialZoom?: number;
  gestureHandling?: string;
  disableDefaultUI?: boolean;
  mapId?: string;
}

export function GoogleMap(props: GoogleMapProps) {
  console.log("Google map rendering", props);

  function displayPlaceData(data: Place) {
    return (
      <div>
        Name - {data.name}
        Rating - {data.rating}
        Total rating - {data.rating}
      </div>
    );
  }

  return (
    <>
      <div style={{ height: "90vh" }}>
        <Map
          mapId={props.mapId || "bf51a910020fa25a"}
          zoom={props.initialZoom || 14}
          center={props.center}
          gestureHandling={props.gestureHandling}
          disableDefaultUI={props.disableDefaultUI}
        >
          {[
            <CenterMarker
              latLong={props.center}
              centerAddress={props.centerAddress}
            />,
            ...props.markerData.map((place: Place) => (
              <GoogleMapMarker<Place>
                lat={place.lat}
                long={place.long}
                // todo need to set different colors depending on the type
                // but needs to line up with antd multi select component
                iconColor={"yellow"}
                data={place}
                popupData={displayPlaceData}
              />
            )),
          ]}
        </Map>
      </div>
    </>
  );
}
