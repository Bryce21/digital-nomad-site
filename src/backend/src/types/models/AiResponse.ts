import { Collection, Document, ObjectId } from 'mongodb';
import Model from './model';
import { collections } from '../../services/database';

export interface AiResponseFormat {
  [index: number]: ExpectedAIResponseFormat;
}

export interface ExpectedAIResponseFormat {
  name: string;
  description: string;
}

export interface FoodResponse {
  foods: ExpectedAIResponseFormat[];
}

export abstract class CleanedAiResponse implements Model {
  constructor(
    public data: String | ExpectedAIResponseFormat[],
    public _id?: ObjectId,
  ) {}
  getCollection: () => Collection<Document> = () =>
    collections.openAiFood as Collection;
}

export class InvalidSchema implements CleanedAiResponse {
  constructor(
    public data: string,
    public _id?: ObjectId,
  ) {}
  getCollection: () => Collection<Document> = () =>
    collections.openAiFood as Collection;
}

export class ValidSchema implements CleanedAiResponse {
  constructor(
    public data: ExpectedAIResponseFormat[],
    public _id?: ObjectId,
  ) {}
  getCollection: () => Collection<Document> = () =>
    collections.openAiFood as Collection;
}
