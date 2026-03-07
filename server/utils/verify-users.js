const chalk = require('chalk');
const mongoose = require('mongoose');
const setupDB = require('./db');
const User = require('../models/user');

(async () => {
  try {
    console.log(`${chalk.blue('✓')} ${chalk.blue('Verifying users in database...')}`);
    
    await setupDB();
    
    // Wait for connection
    if (mongoose.connection.readyState !== 1) {
      await new Promise((resolve) => {
        mongoose.connection.once('connected', resolve);
      });
    }
    
    const userCount = await User.countDocuments();
    console.log(`${chalk.blue('✓')} ${chalk.blue(`Total users found: ${userCount}`)}`);
    
    if (userCount === 0) {
      console.log(`${chalk.red('✗')} ${chalk.red('No users found in database!')}`);
      console.log(`${chalk.yellow('!')} ${chalk.yellow('Please run: npm run seed:db')}`);
      process.exit(1);
    }
    
    const users = await User.find({}, { email: 1, role: 1, firstName: 1, lastName: 1, _id: 1 });
    
    console.log(`\n${chalk.green('Users in database:')}`);
    users.forEach((user, index) => {
      console.log(`${chalk.green(`${index + 1}.`)} ${user.email}`);
      console.log(`   Name: ${user.firstName} ${user.lastName}`);
      console.log(`   Role: ${user.role}`);
      console.log(`   ID: ${user._id}`);
      console.log('');
    });
    
    // Check for default users
    const adminUser = await User.findOne({ email: 'admin@az-on-buz.com' });
    const regularUser = await User.findOne({ email: 'user@az-on-buz.com' });
    
    if (adminUser) {
      console.log(`${chalk.green('✓')} ${chalk.green('Admin user found:')} admin@az-on-buz.com`);
    } else {
      console.log(`${chalk.yellow('!')} ${chalk.yellow('Admin user not found')}`);
    }
    
    if (regularUser) {
      console.log(`${chalk.green('✓')} ${chalk.green('Regular user found:')} user@az-on-buz.com`);
    } else {
      console.log(`${chalk.yellow('!')} ${chalk.yellow('Regular user not found')}`);
    }
    
    await mongoose.connection.close();
    console.log(`${chalk.blue('✓')} ${chalk.blue('Verification complete!')}`);
  } catch (error) {
    console.error(chalk.red('✗ Error verifying users:'), error.message);
    process.exit(1);
  }
})();
