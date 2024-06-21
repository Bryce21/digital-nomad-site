import OpenAI from 'openai';
import {
  AiResponseFormat,
  CleanedAiResponse,
  ExpectedAIResponseFormat,
  FoodResponse,
  InvalidSchema,
  ValidSchema,
} from '../types/models/AiResponse';
import { Chat } from 'openai/resources';
import { getRequiredValue } from './configService';
import ChatCompletion = Chat.ChatCompletion;

import * as CacheService from './cacheService';
import { collections } from './database';
import { Collection, ObjectId } from 'mongodb';
import { CachedData } from '../types/common';

type ValidBaseStructure =
  | 'What are the popular foods of '
  | 'What are popular things to do in ';

const openai = new OpenAI({
  apiKey: getRequiredValue<string>('OPENAI_API_KEY'),
});

const questionBases: { [index: string]: ValidBaseStructure } = {
  food: 'What are the popular foods of ',
  thingsToDo: 'What are popular things to do in ',
};

function getMessageFromBaseAndPlace(base: ValidBaseStructure, place: string) {
  return (
    base +
    place +
    '?' +
    'Json response format: {"data": [{"name": "", "description": ""}]}. 5 items'
  );
}

function cleanResponse(
  aiRes: ChatCompletion,
  questionType: 'food' | 'toDo',
): CleanedAiResponse {
  // if no message at all want to throw error
  const message = <string>aiRes.choices[0].message.content;
  try {
    const res = JSON.parse(message);
    if (!res.data) {
      throw new Error('Invalid response format: Missing .data');
    }
    const data = res.data as ExpectedAIResponseFormat[];
    const dataCleaned: ExpectedAIResponseFormat[] = data.map((v) => {
      return {
        name: v.name,
        description: v.description,
      };
    });
    return new ValidSchema(dataCleaned, questionType, new ObjectId());
  } catch (e) {
    console.error('Error cleaning ai response', e);
    return new InvalidSchema(message, questionType, new ObjectId());
  }
}

async function sendQuery(
  base: ValidBaseStructure,
  place: string,
): Promise<CachedData<String | ExpectedAIResponseFormat[]>> {
  const message = getMessageFromBaseAndPlace(base, place);
  console.log('message', message);

  const questionType = base === questionBases.food ? 'food' : 'toDo';
  console.log('questionType', questionType);
  const cacheRes: CleanedAiResponse | undefined =
    await CacheService.get<CleanedAiResponse>(
      place,
      base === questionBases.food
        ? (collections.openAiFood as Collection)
        : (collections.openAiToDo as Collection),
    );
  console.log('cacheRes', cacheRes);

  if (cacheRes) {
    return {
      isCached: true,
      data: cacheRes.data,
    };
  }

  const aiRes = await openai.chat.completions.create({
    messages: [{ role: 'user', content: message }],
    model: getRequiredValue<string>('OPENAPI_MODEL'),
    response_format: {
      type: 'json_object',
    },
  });
  console.log('aiRes', JSON.stringify(aiRes, null, 2));

  const cleanedResponse: CleanedAiResponse = cleanResponse(aiRes, questionType);

  // let caching promise spin off
  CacheService.set<CleanedAiResponse>(place, cleanedResponse);

  return {
    isCached: false,
    data: cleanedResponse.data,
  };
}

export { sendQuery, questionBases, ValidBaseStructure };
