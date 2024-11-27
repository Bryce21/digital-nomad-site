import { GeocodeResult } from '@googlemaps/google-maps-services-js';
import * as CacheService from './cacheService';
import { client } from './googleClient';
import LatLong from '../types/models/latLong';
import * as DatabaseService from './database';
import { Collection, ObjectId } from 'mongodb';
import { AxiosRequestConfig } from 'axios';
import axios from 'axios';
import { getValue, getRequiredValue } from './configService';
import ViatorDestination from '../types/models/ViatorDestination';
import {
  ViatorDestinationResponse,
  AttractionFilters,
  AttractionPagination,
  AttractionSearchResult,
} from '../types/viator';

async function lookupDestination(
  lat: number,
  lng: number,
): Promise<ViatorDestination | null> {
  await ensureDestinationsPopulated();
  //   todo shouldn't be accessing collection here, should go through cache service

  const foundDestination =
    await DatabaseService.collections.viatorDestinations!.findOne<ViatorDestination>(
      {
        center: {
          $near: {
            $geometry: {
              type: 'Point',
              coordinates: [lng, lat],
            },
            $maxDistance: parseInt(getValue('VIATOR_MAX_DISTANCE', '20000')),
          },
        },
      },
    );

  return foundDestination;
}

async function ensureDestinationsPopulated() {
  const destinationCount: number =
    await DatabaseService.collections.viatorDestinations!.countDocuments();

  if (!destinationCount) {
    const allDestinations = await callForDestinations();
    console.log('destination example', allDestinations[0]);
    await DatabaseService.collections.viatorDestinations!.insertMany(
      allDestinations,
    );
  }
}

async function callForDestinations(): Promise<ViatorDestination[]> {
  const res = await axios({
    url: `https://${getValue('VIATOR_API_HOST', 'api.sandbox.viator.com')}/partner/destinations`,
    headers: {
      [getRequiredValue<string>('VIATOR_API_HEADER')]:
        getRequiredValue('VIATOR_API_KEY'),
      Accept: 'application/json;version=2.0',
      'Accept-Language': 'en-us',
    },
  });

  return res.data.destinations.map((d: ViatorDestinationResponse) => {
    return {
      ...d,
      center: {
        type: 'Point',
        coordinates: [d.center.longitude, d.center.latitude],
      },
    };
  });
}

async function callSearchForAttractions(
  filtering: AttractionFilters,
  pagination?: AttractionPagination,
): Promise<AttractionSearchResult> {
  const res = await axios.post(
    `https://${getValue('VIATOR_API_HOST', 'api.sandbox.viator.com')}/partner/products/search`,
    {
      filtering,
      sorting: {
        sort: 'TRAVELER_RATING',
        order: 'DESCENDING',
      },
      pagination,
      currency: 'USD',
    },
    {
      headers: {
        [getRequiredValue<string>('VIATOR_API_HEADER')]:
          getRequiredValue('VIATOR_API_KEY'),
        Accept: 'application/json;version=2.0',
        'Accept-Language': 'en-us',
      },
    },
  );

  console.log(res.headers);

  return res.data as AttractionSearchResult;
}

async function searchForAttractions(
  filtering: AttractionFilters,
  pagination?: AttractionPagination,
): Promise<AttractionSearchResult> {
  // todo do cache lookup based on destination id here
  // have to search by pagination though otherwise won't get correct info

  return callSearchForAttractions(filtering, pagination);
}

export { lookupDestination, searchForAttractions };
