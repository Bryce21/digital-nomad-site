import Model from './model';
import { Collection, Document, ObjectId } from 'mongodb';
import { collections } from '../../services/database';
export default class ViatorDestination implements Model {
  constructor(
    public destinationId: string,
    name: string,
    type: string,
    parentDestinationId: string,
    lookupId: string,
    destinationUrl: string,
    defaultCurrencyCode: string,
    timeZone: string,
    countryCallingCode: string,
    languages: string[],
    center: {
      type: 'Point';
      coordinates: number[];
    },
    public _id?: ObjectId,
  ) {}

  getCollection: () => Collection<Document> = () => {
    return collections.viatorDestinations as Collection;
  };
}
