import Model from '../types/models/model';
import * as Database from './database';
import LatLong from '../types/models/latLong';
import { Collection } from 'mongodb';

export type Address = String;

export type CacheKey = Address;

/*
  Using mongo as a "cache"
  Using ttl index
  But some collections will have a very large ttl - a year type of thing
*/

async function get<T extends Model>(
  key: CacheKey,
  collection: Collection,
): Promise<T | undefined> {
  try {
    const res: T | undefined | null = await collection.findOne<T>({
      key,
    });
    console.log('cache lookup', { res, key });
    if (res) {
      return res as T;
    }
    return undefined;
  } catch (err) {
    console.error('Failed to lookup from cache.', {
      key,
      collectionName: collection.namespace,
      err,
    });
    return undefined;
  }
}

async function set<T extends Model>(key: CacheKey, value: T): Promise<void> {
  try {
    const collection = value.getCollection();
    await collection.updateOne(
      {
        key,
      },
      {
        $set: {
          ...value,
        },
      },
      {
        upsert: true,
      },
    );
  } catch (err) {
    console.error(`Failed to set cache. Key: ${key}, value: ${value}`, { err });
  }
}

export { get, set };
