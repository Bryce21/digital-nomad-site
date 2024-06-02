import {
  AddressType,
  Language,
  LatLngLiteral,
  PlacesNearbyRequest,
  PlacesNearbyResponse,
  PlacesNearbyResponseData,
} from '@googlemaps/google-maps-services-js';
import { client } from '../services/googleClient';
import { CachedData } from '../types/common';

interface PlacesNearbySubRequest {
  type: string | undefined;
  latLong: LatLngLiteral | undefined;
}

async function getPlacesNearby(
  subRequest: PlacesNearbySubRequest,
): Promise<CachedData<PlacesNearbyResponseData>> {
  try {
    console.log('Getting places for: ', subRequest);
    // todo handle cached data here

    const googleRes: PlacesNearbyResponse = await client.placesNearby(<
      PlacesNearbyRequest
    >{
      params: {
        // todo probably make radius a request variable
        radius: 40000,
        location: subRequest.latLong,
        keyword: subRequest.type,
        language: Language.en,
        key: process.env.GOOGLE_API_KEY,
        // name: 'indian'
      },
    });
    console.log(JSON.stringify(googleRes.data.results, null, 2));
    return {
      isCached: false,
      data: googleRes.data,
    };
  } catch (e) {
    console.error(e);
    throw e;
  }
}

export { getPlacesNearby, PlacesNearbySubRequest };
