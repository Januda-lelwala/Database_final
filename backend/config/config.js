require('dotenv').config();

module.exports = {
  development: {
    username: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || null,
    database: process.env.DB_NAME || 'kandypack',
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    dialect: 'mysql',
    logging: console.log,
    timezone: '+00:00',
    define: {
      underscored: true,
      timestamps: false, // KandyPack schema uses custom timestamp fields
      charset: 'utf8mb4',
      collate: 'utf8mb4_unicode_ci'
    }
  },
  test: {
    username: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'password',
    database: process.env.DB_NAME_TEST || 'kandypack_test',
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    dialect: 'mysql',
    logging: false,
    timezone: '+00:00',
    define: {
      underscored: true,
      timestamps: false,
      charset: 'utf8mb4',
      collate: 'utf8mb4_unicode_ci'
    }
  },
  production: {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 3306,
    dialect: 'mysql',
    logging: false,
    timezone: '+00:00',
    define: {
      underscored: true,
      timestamps: false,
      charset: 'utf8mb4',
      collate: 'utf8mb4_unicode_ci'
    },
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    }
  }
};
