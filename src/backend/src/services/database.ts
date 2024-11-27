import * as mongoDB from 'mongodb';
import * as ConfigService from './configService';

export const collections: {
  latLong?: mongoDB.Collection;
  openAiFood?: mongoDB.Collection;
  openAiToDo?: mongoDB.Collection;
  suggestions?: mongoDB.Collection;
  viatorDestinations?: mongoDB.Collection;
} = {};

async function safeDropIndex(collection: mongoDB.Collection, name: string) {
  try {
    await collection.dropIndex(name);
  } catch (err) {}
}

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
    await safeDropIndex(collections.suggestions, 'createdAt_1');
    await safeDropIndex(collections.suggestions, 'ttlIndex');
    await collections.suggestions.createIndex(
      { createdAt: 1 },
      {
        expireAfterSeconds: process.env.suggestionsTTL
          ? parseInt(process.env.suggestionsTTL)
          : 36000,
        name: 'ttlIndex',
      },
    );
  }

  if (collections.viatorDestinations) {
    console.log('error here??');
    await safeDropIndex(collections.viatorDestinations, 'createdAt_1');
    await safeDropIndex(collections.viatorDestinations, 'ttlIndex');
    await collections.viatorDestinations.createIndex(
      { createdAt: 1 },
      {
        expireAfterSeconds: parseInt(
          ConfigService.getValue('DESTINATIONS_TTL', '604800000'),
        ),
        name: 'ttlIndex',
      },
    );
    await safeDropIndex(collections.viatorDestinations, 'geoLocateIndex');
    await collections.viatorDestinations.createIndex(
      { center: '2dsphere' },
      { name: 'geoLocateIndex' },
    );
  }
  console.log('after error');
}

export async function connectToDatabase() {
  console.log('process.env', process.env)

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

  const viatorDestinations: mongoDB.Collection =
    db.collection('viatorDestinations');

  collections.latLong = latLongCollection;
  collections.openAiFood = openAiFood;
  collections.openAiToDo = openAiToDo;
  collections.suggestions = suggestions;
  collections.viatorDestinations = viatorDestinations;

  console.log(
    `Successfully connected to database: ${db.databaseName} and collections`,
  );
}
