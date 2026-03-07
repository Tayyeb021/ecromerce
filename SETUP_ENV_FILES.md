# 🔧 Setting Up Environment Files

## Problem
Your frontend is trying to connect to `https://a-z-on-buz.com/api` (production) instead of your local backend, causing CORS errors.

## Solution: Create Environment Files

### Step 1: Create `client/.env` File

Create a file named `.env` in the `client` folder with the following content:

```env
API_URL=http://localhost:3000/api
```

**How to create it:**

**Windows (PowerShell):**
```powershell
cd client
echo "API_URL=http://localhost:3000/api" > .env
```

**Windows (Command Prompt):**
```cmd
cd client
echo API_URL=http://localhost:3000/api > .env
```

**Mac/Linux:**
```bash
cd client
echo "API_URL=http://localhost:3000/api" > .env
```

**Or manually:**
1. Navigate to the `client` folder
2. Create a new file named `.env` (make sure it starts with a dot)
3. Add the line: `API_URL=http://localhost:3000/api`
4. Save the file

---

### Step 2: Create `server/.env` File (if not exists)

Create a file named `.env` in the `server` folder with the following content:

```env
PORT=3000
BASE_API_URL=/api
CLIENT_URL=http://localhost:8084
MONGO_URI=mongodb://localhost:27017/az_on_buz
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
```

**For MongoDB Atlas:**
```env
PORT=3000
BASE_API_URL=/api
CLIENT_URL=http://localhost:8084
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/az_on_buz
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
```

---

### Step 3: Restart Your Servers

After creating the `.env` files:

1. **Stop all running servers** (Ctrl+C in each terminal)

2. **Start the backend:**
   ```bash
   cd server
   npm run dev
   ```
   Should show: `Server is running on port 3000`

3. **Start the frontend** (in a new terminal):
   ```bash
   npm run dev
   ```
   Or from root:
   ```bash
   cd client
   npm run dev
   ```
   Should show: `webpack compiled successfully` and open on `http://localhost:8084`

---

## Verify It's Working

1. Open `http://localhost:8084` in your browser
2. Open Developer Tools (F12)
3. Go to the Network tab
4. Refresh the page
5. Check API requests - they should go to `http://localhost:3000/api/...` ✅
6. No CORS errors should appear ✅

---

## Troubleshooting

### Still seeing CORS errors?

1. **Make sure the backend is running:**
   - Check terminal for: `Server is running on port 3000`
   - Visit `http://localhost:3000/api` in browser (should show API info or 404, not connection error)

2. **Verify `.env` file exists:**
   - Check `client/.env` exists
   - Check it contains: `API_URL=http://localhost:3000/api`
   - Make sure there are no extra spaces or quotes

3. **Restart the frontend dev server:**
   - Environment variables are loaded when webpack starts
   - You MUST restart after creating/modifying `.env` files

4. **Clear browser cache:**
   - Hard refresh: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)
   - Or clear browser cache completely

### API_URL is still undefined?

Check your webpack configuration. The `dotenv-webpack` plugin should be loading `.env` files automatically.

If it's not working, you can also set it directly in your terminal:

**Windows (PowerShell):**
```powershell
$env:API_URL="http://localhost:3000/api"
npm run dev
```

**Mac/Linux:**
```bash
export API_URL=http://localhost:3000/api
npm run dev
```

---

## File Structure

After setup, your project should look like:

```
mern-ecommerce-master/
├── client/
│   ├── .env          ← CREATE THIS FILE
│   ├── app/
│   └── ...
├── server/
│   ├── .env          ← CREATE THIS FILE (if not exists)
│   ├── index.js
│   └── ...
└── ...
```

---

## Next Steps

Once your `.env` files are set up:

1. ✅ Backend runs on `http://localhost:3000`
2. ✅ Frontend runs on `http://localhost:8084`
3. ✅ Frontend connects to local backend
4. ✅ No CORS errors!

Continue with your development! 🎉
