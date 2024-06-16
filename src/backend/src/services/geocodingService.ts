import { GeocodeResult } from '@googlemaps/google-maps-services-js';
import * as CacheService from './cacheService';
import { client } from './googleClient';
import LatLong from '../types/models/latLong';
import * as DatabaseService from './database';
import { Collection, ObjectId } from 'mongodb';

async function getLatLngFromAddress(
  address: string,
): Promise<{ lng: number; lat: number; isCached: boolean }> {
  const cacheLookup: LatLong | undefined = await CacheService.get<LatLong>(
    address as CacheService.Address,
    DatabaseService.collections.latLong as Collection,
  );
  if (cacheLookup) {
    return {
      lat: cacheLookup.lat,
      lng: cacheLookup.lng,
      isCached: true,
    };
  }

  const lngLatResponse = await client.geocode({
    params: {
      address: address,
      key: process.env.GOOGLE_API_KEY || '',
    },
  });

  if (lngLatResponse.data.error_message) {
    throw new Error(lngLatResponse.data.error_message);
  }
  const geoCodeData: GeocodeResult | undefined =
    lngLatResponse.data.results.pop();

  if (!geoCodeData) {
    throw new Error('Could not geocode - no data returned');
  }

  const data = new LatLong(
    geoCodeData.geometry.location.lat,
    geoCodeData.geometry.location.lng,
    address,
    new ObjectId(),
  );

  CacheService.set<LatLong>(address, data);

  return {
    ...data,
    isCached: false,
  };
}

export { getLatLngFromAddress };
