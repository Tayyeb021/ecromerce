require('dotenv').config();
const chalk = require('chalk');
const mongoose = require('mongoose');

const keys = require('../config/keys');
const { database } = keys;

const setupDB = async () => {
  try {
    if (!database.url) {
      throw new Error('MongoDB URI is not defined. Please check your .env file.');
    }

    // Connect to MongoDB
    mongoose.set('useCreateIndex', true);
    
    await mongoose.connect(database.url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false
    });

    console.log(`${chalk.green('✓')} ${chalk.blue('MongoDB Connected Successfully!')}`);
    console.log(`${chalk.blue('   Database:')} ${database.url.split('@')[1] || database.url}`);
    
    // Handle connection events
    mongoose.connection.on('error', (err) => {
      console.error(chalk.red('✗ MongoDB connection error:'), err);
    });

    mongoose.connection.on('disconnected', () => {
      console.log(chalk.yellow('⚠ MongoDB disconnected'));
    });

    return mongoose.connection;
  } catch (error) {
    console.error(chalk.red('✗ MongoDB connection failed:'), error.message);
    throw error;
  }
};

module.exports = setupDB;
