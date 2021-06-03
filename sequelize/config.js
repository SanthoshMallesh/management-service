require('dotenv').config();

const {POSTGRES_CONNECTION_STRING, DISABLE_DB_SSL, DB_NAME} = process.env;

module.exports = {
  url: `${POSTGRES_CONNECTION_STRING}${DB_NAME}`,
  dialectOptions: DISABLE_DB_SSL !== 'true' ? {ssl: {require: true}} : null,
};
