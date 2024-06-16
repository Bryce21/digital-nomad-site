import Model from './model';
import { Collection, Document, ObjectId } from 'mongodb';
import { collections } from '../../services/database';

export default class LatLong implements Model {
  constructor(
    public lat: number,
    public lng: number,
    public key: string,
    public _id?: ObjectId,
  ) {}

  getCollection: () => Collection<Document> = () => {
    return collections.latLong as Collection;
  };
}
