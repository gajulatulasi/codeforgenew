const { Sequelize } = require('sequelize');
const dotenv = require('dotenv');

dotenv.config();

const sequelize = new Sequelize(
  process.env.DB_NAME || 'codeforge',
  process.env.DB_USER || 'root',
  process.env.DB_PASSWORD || '',
  {
    host: process.env.DB_HOST || 'localhost',
    dialect: 'mysql',
    logging: false, // Set to true to see SQL queries in console
    pool: {
      max: 150,      // Maximum number of connection in pool
      min: 20,       // Minimum number of connection in pool
      acquire: 60000, // Maximum time (ms) to wait for connection before throwing error
      idle: 10000    // Maximum time (ms) that a connection can be idle before being released
    }
  }
);

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('Connected to MySQL via Sequelize');
  } catch (error) {
    console.error('MySQL connection error:', error);
  }
};

module.exports = { sequelize, connectDB };
