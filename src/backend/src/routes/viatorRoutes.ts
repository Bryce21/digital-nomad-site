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
import {
  lookupDestination,
  searchForAttractions,
} from '../services/viatorService';

const viatorRouter = express.Router();

viatorRouter.get(
  '/attractions',
  query('address').notEmpty().isString().escape(),
  query('start').default(0).isInt(),
  query('count').default(10).isInt({ max: 100 }),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = validationResult(req);
      if (!result.isEmpty()) {
        throw new Error(`Validation error: ${JSON.stringify(result.array())}`);
      }
      const data = matchedData(req);

      const { lat, lng } = await getLatLngFromAddress(data.address);

      const destination = await lookupDestination(lat, lng);

      if (!destination) {
        throw new Error(`Could not find destination for: ${data.address}`);
      }

      console.log('destination found!!', destination);

      const attractions = await searchForAttractions(
        {
          destination: destination.destinationId,
        },
        { start: data.start, count: data.count },
      );
      console.log('attractions', attractions);

      return res.json(attractions);
    } catch (err) {
      console.error('Error getting attractions: ', err);
      next(err);
    }
  },
);

export { viatorRouter };
