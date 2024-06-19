import axios from 'axios';
import { PlacesNearbyResponse } from '../types/types.ts';

export default async function getPlacesNearby(
  inputAddress: string,
  types: string[],
) {
  const res = await axios.get<PlacesNearbyResponse>(
    'http://localhost:4000/places/nearby',
    {
      params: {
        address: inputAddress,
        lookForTypes: types.join(','),
      },
    },
  );
  return res.data;
}
