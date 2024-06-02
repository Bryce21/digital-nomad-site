import OpenAI from 'openai';
import { lookup, set } from './cacheService';
import {
  AiResponseFormat,
  CleanedAiResponse,
  ExpectedAIResponseFormat,
  FoodResponse,
  InvalidSchema,
  ValidSchema,
} from '../types/openai';
import { Chat } from 'openai/resources';
import { getRequiredValue } from './configService';
import ChatCompletion = Chat.ChatCompletion;

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
    'Json response format: {"foods": [{"name": "", "description": ""}]}. 5 items'
  );
}

function cleanResponse(aiRes: ChatCompletion): CleanedAiResponse {
  // if no message at all want to throw error
  const message = <string>aiRes.choices[0].message.content;
  try {
    const json = JSON.parse(message);
    if (!json.foods) {
      throw new Error('Invalid response format: Missing .foods');
    }
    const foods = json.foods as ExpectedAIResponseFormat[];
    const foodsCleaned: ExpectedAIResponseFormat[] = foods.map((v) => {
      return {
        name: v.name,
        description: v.description,
      };
    });
    return {
      data: foodsCleaned,
    } as ValidSchema;
  } catch (e) {
    console.error('Error cleaning ai response', e);
    return {
      // todo this unsafe array access isn't great
      data: message,
    } as InvalidSchema;
  }
}

async function sendQuery(base: ValidBaseStructure, place: string) {
  // todo assert that place is not really long
  const message = getMessageFromBaseAndPlace(base, place);
  console.log('message', message);
  const cacheLookup = await lookup<any>(message);
  if (cacheLookup) {
    return cacheLookup;
  }

  const aiRes = await openai.chat.completions.create({
    messages: [{ role: 'user', content: message }],
    model: getRequiredValue<string>('OPENAPI_MODEL'),
    response_format: {
      type: 'json_object',
    },
  });
  console.log('aiRes', JSON.stringify(aiRes, null, 2));

  const cleanedResponse: CleanedAiResponse = cleanResponse(aiRes);
  // let caching promise spin off
  set<CleanedAiResponse>(message, cleanedResponse);
  return cleanedResponse.data;
}

export { sendQuery, questionBases, ValidBaseStructure };
