# Quick Start Guide - A-Z On-Buz

## Running Without Docker

### Prerequisites
- ✅ Node.js (v14 or higher)
- ✅ MongoDB (local installation or MongoDB Atlas account)

---

## Step 1: Install Dependencies

```bash
npm install
```

This installs all dependencies for both client and server.

---

## Step 2: Set Up Environment Variables

### Server Environment (`server/.env`)

Create a file named `.env` in the `server` folder:

```env
PORT=3000
BASE_API_URL=http://localhost:3000/api
CLIENT_URL=http://localhost:8084
MONGO_URI=mongodb://localhost:27017/az_on_buz
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
```

**For MongoDB Atlas**, use:
```env
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/az_on_buz
```

### Client Environment (`client/.env`)

Create a file named `.env` in the `client` folder:

```env
API_URL=http://localhost:3000/api
```

---

## Step 3: Start MongoDB

**Option A: Local MongoDB**
```bash
mongod
```

**Option B: MongoDB Atlas**
- Sign up at https://www.mongodb.com/cloud/atlas
- Create a free cluster
- Get your connection string
- Update `MONGO_URI` in `server/.env`

---

## Step 4: Seed the Database

This populates your database with initial data:

```bash
cd server
npm run seed:db
```

**What Gets Created:**
- 👤 **2 Users** (Admin + Regular user)
- 📁 **10 Categories** (Product categories)
- 🏷️ **10 Brands** (Brand names)
- 📦 **100 Products** (Sample products)

**Default Users:**
- 👤 **Admin:** `admin@az-on-buz.com` / `admin123`
- 👤 **User:** `user@az-on-buz.com` / `user123`

**Verify users were created:**
```bash
npm run verify:users
```

---

## Step 5: Start the Application

### Option A: Run Both Together (Recommended)

From the root directory:
```bash
npm run dev
```

This starts:
- 🖥️ **Server:** http://localhost:3000
- 🌐 **Client:** http://localhost:8084

### Option B: Run Separately

**Terminal 1 - Server:**
```bash
cd server
npm run dev
```

**Terminal 2 - Client:**
```bash
cd client
npm run dev
```

---

## 🎉 You're All Set!

Open your browser and visit: **http://localhost:8084**

### Login Credentials:
- **Admin Panel:** Use admin credentials to access dashboard
- **Regular Shopping:** Use user credentials for shopping

---

## Troubleshooting

### MongoDB Connection Error
- Make sure MongoDB is running (`mongod`)
- Check `MONGO_URI` in `server/.env`
- For MongoDB Atlas, ensure your IP is whitelisted

### Port Already in Use
- Change `PORT` in `server/.env` (default: 3000)
- Change client port in `client/webpack/webpack.dev.js` (default: 8084)

### Module Not Found Errors
- Run `npm install` again
- Delete `node_modules` folders and reinstall:
  ```bash
  rm -rf node_modules client/node_modules server/node_modules
  npm install
  ```

---

## Need Help?

Check the main [README.md](README.md) for more details.
