import { Collection } from 'mongodb';

export default interface Model {
  getCollection: () => Collection;
}
