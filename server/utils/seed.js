/**
 * Database Seeding Script
 * 
 * This script populates the database with initial data for development and testing.
 * 
 * What Gets Seeded:
 * - 2 Users (Admin + Regular user)
 * - 10 Categories (Product categories)
 * - 10 Brands (Brand names)
 * - 100 Products (Sample products with descriptions, prices, and associations)
 * 
 * Usage:
 *   npm run seed:db                                    # Uses default credentials
 *   npm run seed:db email1 pass1 email2 pass2        # Custom credentials
 * 
 * Default Credentials:
 *   Admin: admin@az-on-buz.com / admin123
 *   User:  user@az-on-buz.com / user123
 * 
 * Note: The script will skip creating items if they already exist in the database.
 */

const chalk = require('chalk');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const { faker } = require('@faker-js/faker');

const setupDB = require('./db');
const { ROLES } = require('../constants');
const User = require('../models/user');
const Brand = require('../models/brand');
const Product = require('../models/product');
const Category = require('../models/category');
const Banner = require('../models/banner');

const args = process.argv.slice(2);
const adminEmail = args[0] || 'admin@az-on-buz.com';
const adminPassword = args[1] || 'admin123';
const userEmail = args[2] || 'user@az-on-buz.com';
const userPassword = args[3] || 'user123';

// Seed quantities
const NUM_PRODUCTS = 100;
const NUM_BRANDS = 10;
const NUM_CATEGORIES = 10;

const seedDB = async () => {
  try {
    let categories = [];

    console.log(`${chalk.blue('✓')} ${chalk.blue('Seed database started')}`);
    console.log(`${chalk.blue('   Database:')} ${mongoose.connection.name || 'Connecting...'}`);

    // Wait for database connection
    if (mongoose.connection.readyState !== 1) {
      console.log(`${chalk.yellow('!')} ${chalk.yellow('Waiting for database connection...')}`);
      await new Promise((resolve) => {
        mongoose.connection.once('connected', resolve);
      });
    }

    // Create Admin User
    console.log(`${chalk.yellow('!')} ${chalk.yellow('Checking admin user...')}`);
    const existingAdmin = await User.findOne({ email: adminEmail });
    if (!existingAdmin) {
      console.log(`${chalk.yellow('!')} ${chalk.yellow('Creating admin user...')}`);
      const admin = new User({
        email: adminEmail,
        password: adminPassword,
        firstName: 'Admin',
        lastName: 'User',
        role: ROLES.Admin,
        provider: 'Email'
      });

      const adminSalt = await bcrypt.genSalt(10);
      const adminHash = await bcrypt.hash(admin.password, adminSalt);
      admin.password = adminHash;
      const savedAdmin = await admin.save();
      console.log(`${chalk.green('✓')} ${chalk.green(`Admin user created successfully!`)}`);
      console.log(`${chalk.green('   Email:')} ${adminEmail}`);
      console.log(`${chalk.green('   Password:')} ${adminPassword}`);
      console.log(`${chalk.green('   ID:')} ${savedAdmin._id}`);
    } else {
      console.log(`${chalk.yellow('!')} ${chalk.yellow('Admin user already exists.')}`);
      console.log(`${chalk.blue('   Email:')} ${existingAdmin.email}`);
    }

    // Create Simple User (Member)
    console.log(`${chalk.yellow('!')} ${chalk.yellow('Checking simple user...')}`);
    const existingUser = await User.findOne({ email: userEmail });
    if (!existingUser) {
      console.log(`${chalk.yellow('!')} ${chalk.yellow('Creating simple user...')}`);
      const user = new User({
        email: userEmail,
        password: userPassword,
        firstName: 'John',
        lastName: 'Doe',
        role: ROLES.Member,
        provider: 'Email'
      });

      const userSalt = await bcrypt.genSalt(10);
      const userHash = await bcrypt.hash(user.password, userSalt);
      user.password = userHash;
      const savedUser = await user.save();
      console.log(`${chalk.green('✓')} ${chalk.green(`Simple user created successfully!`)}`);
      console.log(`${chalk.green('   Email:')} ${userEmail}`);
      console.log(`${chalk.green('   Password:')} ${userPassword}`);
      console.log(`${chalk.green('   ID:')} ${savedUser._id}`);
    } else {
      console.log(`${chalk.yellow('!')} ${chalk.yellow('Simple user already exists.')}`);
      console.log(`${chalk.blue('   Email:')} ${existingUser.email}`);
    }

    // Verify users were created
    const userCount = await User.countDocuments();
    console.log(`${chalk.blue('✓')} ${chalk.blue(`Total users in database: ${userCount}`)}`);
    
    const allUsers = await User.find({}, { email: 1, role: 1, firstName: 1, lastName: 1 });
    console.log(`${chalk.blue('   Users:')}`);
    allUsers.forEach(u => {
      console.log(`${chalk.blue('     -')} ${u.email} (${u.role})`);
    });

    const categoriesCount = await Category.countDocuments();
    if (categoriesCount >= NUM_CATEGORIES) {
      console.log(`${chalk.yellow('!')} ${chalk.yellow('Sufficient number of categories already exist, skipping seeding for categories.')}`);
      categories = await Category.find().select('_id');
    } else {
      for (let i = 0; i < NUM_CATEGORIES; i++) {
        const category = new Category({
          name: faker.commerce.department(),
          description: faker.lorem.sentence(),
          isActive: true
        });
        await category.save();
        categories.push(category);
      }
      console.log(`${chalk.green('✓')} ${chalk.green('Categories seeded.')}`);
    }

    const brandsCount = await Brand.countDocuments();
    if (brandsCount >= NUM_BRANDS) {
      console.log(`${chalk.yellow('!')} ${chalk.yellow('Sufficient number of brands already exist, skipping seeding for brands.')}`);
    } else {
      for (let i = 0; i < NUM_BRANDS; i++) {
        const brand = new Brand({
          name: faker.company.name(),
          description: faker.lorem.sentence(),
          isActive: true
        });
        await brand.save();
      }
      console.log(`${chalk.green('✓')} ${chalk.green('Brands seeded.')}`);
    }

    const productsCount = await Product.countDocuments();
    if (productsCount >= NUM_PRODUCTS) {
      console.log(`${chalk.yellow('!')} ${chalk.yellow('Sufficient number of products already exist, skipping seeding for products.')}`);
    } else {
      const brands = await Brand.find().select('_id');
      for (let i = 0; i < NUM_PRODUCTS; i++) {
        const randomCategoryIndex = faker.number.int(categories.length - 1);
        const product = new Product({
          sku: faker.string.alphanumeric(10),
          name: faker.commerce.productName(),
          description: faker.lorem.sentence(),
          quantity: faker.number.int({ min: 1, max: 100 }),
          price: faker.commerce.price(),
          taxable: faker.datatype.boolean(),
          isActive: true,
          brand: brands[faker.number.int(brands.length - 1)]._id,
          category: categories[randomCategoryIndex]._id
        });
        await product.save();
        await Category.updateOne({ _id: categories[randomCategoryIndex]._id }, { $push: { products: product._id } });
      }
      console.log(`${chalk.green('✓')} ${chalk.green('Products seeded and associated with categories.')}`);
    }

    // Seed Banners
    console.log(`${chalk.blue('→')} ${chalk.blue('Seeding banners...')}`);
    const existingBanners = await Banner.countDocuments();
    if (existingBanners === 0) {
      const banners = [
        {
          title: 'Summer Sale',
          imageUrl: '/images/banners/banner-3.jpg',
          link: '/shop',
          content: '<p>Get up to 50% off on summer collection</p>',
          isActive: true,
          order: 1
        },
        {
          title: 'New Arrivals',
          imageUrl: '/images/banners/banner-4.jpg',
          link: '/shop',
          content: '<p>Check out our latest products</p>',
          isActive: true,
          order: 2
        }
      ];
      
      await Banner.insertMany(banners);
      console.log(`${chalk.green('✓')} ${chalk.green(`Created ${banners.length} banners`)}`);
    } else {
      console.log(`${chalk.yellow('→')} ${chalk.yellow(`Skipping banners (${existingBanners} already exist)`)}`);
    }
  } catch (error) {
    console.log(`${chalk.red('✗')} ${chalk.red('Error while seeding database:')}`);
    console.error(error);
    throw error;
  } finally {
    // Don't close connection if it's being used by the server
    if (process.argv[2] === '--close') {
      await mongoose.connection.close();
      console.log(`${chalk.blue('✓')} ${chalk.blue('Database connection closed!')}`);
    } else {
      console.log(`${chalk.blue('✓')} ${chalk.blue('Seeding completed! Database connection remains open.')}`);
    }
  }
};

(async () => {
  try {
    await setupDB();
    
    // Wait a bit for connection to be established
    if (mongoose.connection.readyState === 0) {
      await new Promise((resolve) => {
        mongoose.connection.once('connected', resolve);
        // Timeout after 10 seconds
        setTimeout(() => {
          if (mongoose.connection.readyState !== 1) {
            console.error(chalk.red('✗ Database connection timeout. Please check your MONGO_URI.'));
            process.exit(1);
          }
        }, 10000);
      });
    }
    
    await seedDB();
    
    console.log(`${chalk.green('✓')} ${chalk.green('All seeding operations completed successfully!')}`);
  } catch (error) {
    console.error(chalk.red('✗ Error initializing database:'), error.message);
    console.error(error);
    process.exit(1);
  }
})();