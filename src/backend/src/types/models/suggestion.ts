import Model from './model';
import { Collection, Document, ObjectId } from 'mongodb';
import { collections } from '../../services/database';

export default class Suggestion implements Model {
  constructor(
    public suggestion: string,
    public contact: string,
    public _id?: ObjectId,
  ) {}

  getCollection: () => Collection<Document> = () => {
    return collections.suggestions as Collection;
  };
}
