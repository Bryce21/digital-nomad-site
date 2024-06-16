import * as mongoDB from 'mongodb';
import * as ConfigService from './configService';

export const collections: {
  latLong?: mongoDB.Collection;
  openAiFood?: mongoDB.Collection;
} = {};

export async function connectToDatabase() {
  const client: mongoDB.MongoClient = new mongoDB.MongoClient(
    ConfigService.getRequiredValue('DB_CONN_STRING'),
  );

  await client.connect();

  const db: mongoDB.Db = client.db(ConfigService.getRequiredValue('DB_NAME'));

  const latLongCollection: mongoDB.Collection = db.collection(
    ConfigService.getRequiredValue('LAT_LONG_COLLECTION'),
  );

  //   todo make env variable for collection name
  const openAiFood: mongoDB.Collection = db.collection('openAiFood');

  collections.latLong = latLongCollection;
  collections.openAiFood = openAiFood;

  console.log(
    `Successfully connected to database: ${db.databaseName} and collections`,
  );
}
