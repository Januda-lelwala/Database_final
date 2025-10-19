const { Sequelize } = require('sequelize');
const config = require('./config');

const env = process.env.NODE_ENV || 'development';
const dbConfig = config[env];

const sequelize = new Sequelize(
  dbConfig.database,
  dbConfig.username,
  dbConfig.password || null,
  {
    host: dbConfig.host,
    port: dbConfig.port,
    dialect: dbConfig.dialect,
    logging: dbConfig.logging,
    define: dbConfig.define,
    dialectOptions: dbConfig.dialectOptions
  }
);

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('MySQL database connection established successfully.');
    console.log('Connected to KandyPack database');
  } catch (error) {
    console.error('Unable to connect to the database:', error.message);
    process.exit(1);
  }
};

module.exports = {
  sequelize,
  connectDB
};
