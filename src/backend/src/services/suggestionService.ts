import { collections } from './database';
import { Collection, ObjectId } from 'mongodb';
import * as CacheService from './cacheService';
import Suggestion from '../types/models/suggestion';

async function createSuggestion(suggestion: string, contact: string) {
  const id = new ObjectId();
  const data = new Suggestion(suggestion, contact, id);
  await CacheService.set(id.toString(), data);
}

export { createSuggestion };
