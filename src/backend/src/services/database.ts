import * as mongoDB from 'mongodb';
import * as ConfigService from './configService';

export const collections: {
  latLong?: mongoDB.Collection;
  openAiFood?: mongoDB.Collection;
  openAiToDo?: mongoDB.Collection;
  suggestions?: mongoDB.Collection;
} = {};

export async function initializeDB() {
  // todo do better way to ensure collections are all ready initialized
  if (collections.openAiFood) {
    await collections.openAiFood.createIndex(
      { createdAt: 1 },
      {
        expireAfterSeconds: process.env.aiFoodTTl
          ? parseInt(process.env.aiFoodTTl)
          : 3600,
      },
    );

    await collections.openAiFood.createIndex({ key: 1 });
  }

  if (collections.openAiToDo) {
    await collections.openAiToDo.createIndex(
      { createdAt: 1 },
      {
        expireAfterSeconds: process.env.aiToDoTTL
          ? parseInt(process.env.aiToDoTTL)
          : 3600,
      },
    );
    await collections.openAiToDo.createIndex({ key: 1 });
  }

  if (collections.suggestions) {
    await collections.suggestions.createIndex(
      { createdAt: 1 },
      {
        expireAfterSeconds: process.env.suggestionsTTL
          ? parseInt(process.env.suggestionsTTL)
          : 36000,
      },
    );
  }
}

export async function connectToDatabase() {
  const client: mongoDB.MongoClient = new mongoDB.MongoClient(
    ConfigService.getRequiredValue('DB_CONN_STRING'),
    {
      connectTimeoutMS: 10000,
    },
  );
  console.log(
    `Connecting to mongo: ${ConfigService.getRequiredValue('DB_CONN_STRING')}`,
  );

  await client.connect();

  const db: mongoDB.Db = client.db(ConfigService.getRequiredValue('DB_NAME'));

  const latLongCollection: mongoDB.Collection = db.collection(
    ConfigService.getRequiredValue('LAT_LONG_COLLECTION'),
  );

  //   todo make env variable for collection name
  const openAiFood: mongoDB.Collection = db.collection('openAiFood');
  const openAiToDo: mongoDB.Collection = db.collection('openAiToDo');

  const suggestions: mongoDB.Collection = db.collection('suggestions');

  collections.latLong = latLongCollection;
  collections.openAiFood = openAiFood;
  collections.openAiToDo = openAiToDo;
  collections.suggestions = suggestions;

  console.log(
    `Successfully connected to database: ${db.databaseName} and collections`,
  );
}
