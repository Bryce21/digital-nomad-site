import { LatLng } from '../../../../../types/types';
import GoogleMapMarker from './GoogleMapMarker';

interface CenterMarkerProps {
    latLong: LatLng,
    centerAddress: string
}

export function CenterMarker(props: CenterMarkerProps) {
  return (
    <GoogleMapMarker<CenterMarkerProps>
      lat={props.latLong.lat}
      long={props.latLong.lng}
      iconColor="red"
      data={props}
      popupData={
            (t: CenterMarkerProps) => (
              <div>
                Name -
                {' '}
                {t.centerAddress}
              </div>
            )
        }
    />
  );
}
