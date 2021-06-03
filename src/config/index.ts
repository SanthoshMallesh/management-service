import * as dotenv from 'dotenv';
dotenv.config();

const {POSTGRES_CONNECTION_STRING, DB_NAME, DISABLE_DB_SSL, DB_LOGGING} =
  process.env;

export const DB_CONFIG = {
  connectionString: POSTGRES_CONNECTION_STRING,
  database: DB_NAME,
  ssl: DISABLE_DB_SSL !== 'true',
  logging: DB_LOGGING === 'true',
};
