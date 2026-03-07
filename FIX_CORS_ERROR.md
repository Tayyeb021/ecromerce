# 🔧 Fix CORS Error

## Problem
Your frontend at `http://localhost:8084` is trying to access the backend at `https://a-z-on-buz.com/api`, but the backend is blocking the request due to CORS policy.

**Error:** `Access to XMLHttpRequest has been blocked by CORS policy: No 'Access-Control-Allow-Origin' header is present`

---

## ✅ Solution 1: Use Local Backend for Development (Recommended)

For local development, use your local backend instead of production:

1. **Make sure your local backend is running:**
   ```bash
   cd server
   npm run dev
   ```
   Backend should run on `http://localhost:3000`

2. **Update `client/.env` for local development:**
   ```env
   API_URL=http://localhost:3000/api
   ```

3. **Restart the frontend dev server:**
   - Stop the current dev server (Ctrl+C)
   - Run again: `npm run dev`

---

## ✅ Solution 2: Fix CORS on Production Server

If you want to test against production API, you need to update the backend CORS configuration on your server.

### Update `server/index.js` on your production server:

**Current code (line 24):**
```javascript
app.use(cors());
```

**Change to:**
```javascript
app.use(cors({
  origin: [
    'http://localhost:8084',
    'http://localhost:3000',
    'https://a-z-on-buz.com',
    'https://www.a-z-on-buz.com'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
```

Or allow all origins (less secure, but works for development):
```javascript
app.use(cors({
  origin: '*',
  credentials: true
}));
```

### Steps:
1. Upload the updated `server/index.js` to your server
2. Restart your Node.js application
3. Test again from `http://localhost:8084`

---

## 🎯 Quick Fix for Now

**For immediate local development:**

1. **Change `client/.env` to:**
   ```env
   API_URL=http://localhost:3000/api
   ```

2. **Start your local backend:**
   ```bash
   cd server
   npm run dev
   ```

3. **Restart frontend dev server** (if it's running)

This way you can develop locally without CORS issues!

---

## 📝 Summary

| Solution | When to Use | Pros | Cons |
|----------|-------------|------|------|
| **Local Backend** | Development | No CORS issues, faster, safer | Need backend running locally |
| **Fix Production CORS** | Testing production | Tests real API | Need to update server code |

**Recommendation:** Use Solution 1 (local backend) for development, and Solution 2 (fix CORS) when you need to test against production.
