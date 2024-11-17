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

// todo read up on typescript class inheritance more, don't really know what I'm doing here but got it working

export abstract class CleanedAiResponse implements Model {
  constructor(
    public data: String | ExpectedAIResponseFormat[],
    public questionType: 'food' | 'toDo',
    public _id?: ObjectId,
  ) {}
  getCollection: () => Collection<Document> = () => {
    if (this.questionType === 'food') {
      return collections.openAiFood as Collection;
    }
    return collections.openAiToDo as Collection;
  };
}

export class InvalidSchema implements CleanedAiResponse {
  constructor(
    public data: string,
    public questionType: 'food' | 'toDo',
    public _id?: ObjectId,
  ) {}
  getCollection: () => Collection<Document> = () => {
    if (this.questionType === 'food') {
      return collections.openAiFood as Collection;
    }
    return collections.openAiToDo as Collection;
  };
}

export class ValidSchema implements CleanedAiResponse {
  constructor(
    public data: ExpectedAIResponseFormat[],
    public questionType: 'food' | 'toDo',
    public _id?: ObjectId,
  ) {}
  getCollection: () => Collection<Document> = () => {
    if (this.questionType === 'food') {
      return collections.openAiFood as Collection;
    }
    return collections.openAiToDo as Collection;
  };
}
