import React from 'react';
import { LatLng } from '../../../../../types/types';
import GoogleMapMarker from './GoogleMapMarker';

interface CenterMarkerProps {
  latLong: LatLng;
  // eslint-disable-next-line
  centerAddress: string;
}

function renderPopup(t: CenterMarkerProps) {
  return (
    <div>
      Name -
      {t.centerAddress}
    </div>
  );
}

export function CenterMarker(props: CenterMarkerProps) {
  return (
    <GoogleMapMarker<CenterMarkerProps>
      lat={props.latLong.lat}
      long={props.latLong.lng}
      iconColor="red"
      data={props}
      popupData={() => renderPopup(props)}
    />
  );
}

export default CenterMarker;
