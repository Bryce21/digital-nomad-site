import express, {
  NextFunction,
  Request,
  RequestHandler,
  Response,
} from 'express';
import { getPlacesAutoComplete } from '../services/places';
import { Promise as BPromise } from 'bluebird';
import {
  AddressType,
  Language,
  LatLngLiteral,
  PlacesNearbyRequest,
  PlacesNearbyResponse,
  PlacesNearbyResponseData,
} from '@googlemaps/google-maps-services-js';
import { Place } from '@googlemaps/google-maps-services-js/src/common';
import { getLatLngFromAddress } from '../services/geocodingService';
import { client } from '../services/googleClient';
import { ApiPlacesResponse } from '../types/places';
import { query, validationResult, matchedData } from 'express-validator';
import {
  getPlacesNearby,
  PlacesNearbySubRequest,
} from '../services/locationService';
import { CachedData } from '../types/common';
const placesRouter = express.Router();

placesRouter.get(
  '/address/autoComplete',
  query('autoCompleteInput').notEmpty().isString().escape(),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = validationResult(req);
      if (!result.isEmpty()) {
        throw new Error(`Validation error: ${JSON.stringify(result.array())}`);
      }
      const data = matchedData(req);
      const googleRes = await client.placeAutocomplete({
        params: {
          input: data.autoCompleteInput,
          key: process.env.GOOGLE_API_KEY || '',
        },
      });
      if (googleRes.data.error_message) {
        throw new Error(googleRes.data.error_message);
      }
      // todo clean this into my own types
      res.json(googleRes.data.predictions);
    } catch (e) {
      console.error(e);
      next(e);
    }
  },
);

placesRouter.get(
  '/nearby',
  query('address').notEmpty().isString().escape(),
  // todo this should be required but ui is using this api in a weird way
  query('lookForTypes').escape(),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = validationResult(req);
      if (!result.isEmpty()) {
        throw new Error(`Validation error: ${JSON.stringify(result.array())}`);
      }

      const data = matchedData(req);
      const lookForTypes = data.lookForTypes
        ? data.lookForTypes.split(',')
        : [];
      const {
        lat,
        lng,
        isCached: latLngCached,
      } = await getLatLngFromAddress(data.address);

      const subRequests: PlacesNearbySubRequest[] = lookForTypes.map(
        (type: string) => ({
          latLong: { lat, lng },
          type: type,
        }),
      );
      // todo how to handle incomplete results? Should successful values be used
      // could always promise resolve but with an error state then partition them here
      const allPlaces = await BPromise.map(
        subRequests ? subRequests : [],
        (req: PlacesNearbySubRequest) => getPlacesNearby(req),
      );

      const responseData: ApiPlacesResponse[] = allPlaces.flatMap(
        (p: CachedData<PlacesNearbyResponseData>, index: number) => {
          // shouldn't be possible to hit unknown, just type bs
          const fromType: string = subRequests[index].type || 'unknown';
          return p.data.results.map((value: Place) => ({
            name: value.name,
            lat: value.geometry?.location.lat,
            long: value.geometry?.location.lng,
            rating: value?.rating,
            totalRatings: value?.user_ratings_total,
            types: value.types?.map((a: AddressType) => a.toString()) || [],
            website: value?.website,
            hours: value?.opening_hours
              ? {
                  open_now: value.opening_hours.open_now,
                  weekday_text: value.opening_hours.weekday_text,
                }
              : undefined,
            address: value.formatted_address,
            fromType,
            place_id: value?.place_id,
          }));
        },
      );
      const finalResponse = {
        data: {
          places: responseData || [],
          center: {
            lat,
            lng,
          },
        },
        metadata: {
          cache: {
            longLatCached: latLngCached,
            dataCached: false,
          },
          response: {
            length: (responseData || []).length,
          },
        },
      };
      res.json(finalResponse);
    } catch (e) {
      console.error(e);
      next(e);
    }
  },
);

export { placesRouter };
