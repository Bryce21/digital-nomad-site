import * as mongoDB from 'mongodb';
import * as ConfigService from './configService';

export const collections: {
  latLong?: mongoDB.Collection;
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

  collections.latLong = latLongCollection;

  console.log(
    `Successfully connected to database: ${db.databaseName} and collections`,
  );
}
