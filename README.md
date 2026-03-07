# A-Z On-Buz

## Description

A-Z On-Buz is an ecommerce store built with MERN stack, and utilizes third party API's. This ecommerce store enable three main different flows or implementations:

1. Buyers browse the store categories, products and brands
2. Sellers or Merchants manage their own brand component
3. Admins manage and control the entire store components 

### Features:

  * Node provides the backend environment for this application
  * Express middleware is used to handle requests, routes
  * Mongoose schemas to model the application data
  * React for displaying UI components
  * Redux to manage application's state
  * Redux Thunk middleware to handle asynchronous redux actions

## Demo

This application is deployed on Vercel Please check it out :smile: [here](https://mern-store-gold.vercel.app).

See admin dashboard [demo](https://mernstore-bucket.s3.us-east-2.amazonaws.com/admin.mp4)

## Quick Start

**For detailed step-by-step instructions without Docker, see [QUICK_START.md](QUICK_START.md)**

### Quick Setup (Without Docker):
1. Install dependencies: `npm install`
2. Create `.env` files (see [QUICK_START.md](QUICK_START.md) for details)
3. Start MongoDB
4. Seed database: `cd server && npm run seed:db`
5. Start app: `npm run dev`

## Docker Guide (Optional)

To run this project locally using Docker Compose:

```bash
docker-compose build
docker-compose up
```

Edit `docker-compose.yml` and update the values for `MONGO_URI` and `JWT_SECRET` if needed.

## Database Seed

The seed command populates your database with initial data for development and testing.

### What Gets Seeded:

* **2 Users:**
  - Admin user (ROLE ADMIN)
  - Regular user (ROLE MEMBER)
* **10 Categories** - Random product categories
* **10 Brands** - Random brand names
* **100 Products** - Random products with descriptions, prices, and associations

### Default Credentials:

The seed command accepts 4 arguments: admin email, admin password, user email, user password. If no arguments are provided, it uses default values:
  - **Admin:** `admin@az-on-buz.com` / `admin123`
  - **User:** `user@az-on-buz.com` / `user123`

### Usage:

**Default usage (uses default credentials):**
```bash
cd server
npm run seed:db
```

**Custom credentials:**
```bash
cd server
npm run seed:db admin@example.com adminpass user@example.com userpass
```

**Verify users in database:**
```bash
cd server
npm run verify:users
```

> **Note:** The seed script will skip creating items if they already exist in the database, so it's safe to run multiple times.

For more information, see code [here](server/utils/seed.js)

## Install

`npm install` in the project root will install dependencies in both `client` and `server`. [See package.json](package.json)

Some basic Git commands are:

```
git clone https://github.com/mohamedsamara/mern-ecommerce.git
cd project
npm install
```

## ENV

Create `.env` file for both client and server. See examples:

[Frontend ENV](client/.env.example)

[Backend ENV](server/.env.example)


## Vercel Deployment

Both frontend and backend are deployed on Vercel from the same repository. When deploying on Vercel, make sure to specifiy the root directory as `client` and `server` when importing the repository. See [client vercel.json](client/vercel.json) and [server vercel.json](server/vercel.json).

## Start development (Without Docker)

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local installation or MongoDB Atlas)

### Step-by-Step Setup

#### 1. Install Dependencies
```bash
npm install
```
This will install dependencies for both client and server.

#### 2. Set Up Environment Variables

**Server Environment (`server/.env`):**
Create a `.env` file in the `server` directory with the following variables:
```env
PORT=3000
BASE_API_URL=http://localhost:3000/api
CLIENT_URL=http://localhost:8084
MONGO_URI=mongodb://localhost:27017/az_on_buz
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production

# Optional: Email services (can be left empty for development)
MAILCHIMP_KEY=
MAILCHIMP_LIST_KEY=
MAILGUN_KEY=
MAILGUN_DOMAIN=
MAILGUN_EMAIL_SENDER=

# Optional: Social auth (can be left empty for development)
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GOOGLE_CALLBACK_URL=
FACEBOOK_CLIENT_ID=
FACEBOOK_CLIENT_SECRET=
FACEBOOK_CALLBACK_URL=

# Optional: AWS S3 (can be left empty for development)
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_REGION=
AWS_BUCKET_NAME=
```

**Client Environment (`client/.env`):**
Create a `.env` file in the `client` directory:
```env
API_URL=http://localhost:3000/api
```

#### 3. Start MongoDB
Make sure MongoDB is running on your system:
```bash
# If MongoDB is installed locally, start it:
mongod

# Or use MongoDB Atlas connection string in server/.env
```

#### 4. Seed the Database
This will create both admin and simple user:
```bash
cd server
npm run seed:db
```

**Default users created:**
- **Admin:** `admin@az-on-buz.com` / `admin123`
- **User:** `user@az-on-buz.com` / `user123`

#### 5. Start Both Applications
From the root directory, run:
```bash
npm run dev
```

This will start:
- **Server:** http://localhost:3000
- **Client:** http://localhost:8084

### Running Separately

**Terminal 1 - Start Server:**
```bash
cd server
npm run dev
```

**Terminal 2 - Start Client:**
```bash
cd client
npm run dev
```

### Quick Start (All in One)
```bash
# 1. Install dependencies
npm install

# 2. Create .env files (see above for content)

# 3. Start MongoDB

# 4. Seed database
cd server && npm run seed:db && cd ..

# 5. Start both apps
npm run dev
```

## Languages & tools

- [Node](https://nodejs.org/en/)

- [Express](https://expressjs.com/)

- [Mongoose](https://mongoosejs.com/)

- [React](https://reactjs.org/)

- [Webpack](https://webpack.js.org/)


### Code Formatter

- Add a `.vscode` directory
- Create a file `settings.json` inside `.vscode`
- Install Prettier - Code formatter in VSCode
- Add the following snippet:  

```json

    {
      "editor.formatOnSave": true,
      "prettier.singleQuote": true,
      "prettier.arrowParens": "avoid",
      "prettier.jsxSingleQuote": true,
      "prettier.trailingComma": "none",
      "javascript.preferences.quoteStyle": "single",
    }

```

"# ecromerce" 
