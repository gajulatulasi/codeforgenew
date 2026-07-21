const { Sequelize } = require('sequelize');
const dotenv = require('dotenv');

dotenv.config();

let sequelize;

if (process.env.DATABASE_URL) {
  // Connection string (e.g. Render production PostgreSQL)
  sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
    logging: false,
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false // Required for connecting to Render PostgreSQL from outside/internally
      }
    },
    pool: {
      max: 20,
      min: 0,
      acquire: 60000,
      idle: 10000
    }
  });
} else {
  // Individual config parameters (typically for local development)
  sequelize = new Sequelize(
    process.env.DB_NAME || 'codeforge',
    process.env.DB_USER || 'postgres',
    process.env.DB_PASSWORD || '',
    {
      host: process.env.DB_HOST || '127.0.0.1',
      dialect: 'postgres',
      logging: false,
      pool: {
        max: 20,
        min: 0,
        acquire: 60000,
        idle: 10000
      }
    }
  );
}

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('Connected to PostgreSQL via Sequelize');
  } catch (error) {
    console.error('PostgreSQL connection error:', error.message);
    throw error;
  }
};

module.exports = { sequelize, connectDB };
