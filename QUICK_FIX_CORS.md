# ⚡ Quick Fix for CORS Error

## The Problem
Your frontend at `http://localhost:8084` is trying to connect to `https://a-z-on-buz.com/api` (production), but the production server blocks localhost requests due to CORS policy.

**Error:** `No 'Access-Control-Allow-Origin' header is present`

---

## ✅ Quick Solution (2 Minutes)

### 1. Create `client/.env` file

**Windows PowerShell:**
```powershell
cd client
"API_URL=http://localhost:3000/api" | Out-File -FilePath .env -Encoding utf8
```

**Windows CMD:**
```cmd
cd client
echo API_URL=http://localhost:3000/api > .env
```

**Mac/Linux:**
```bash
cd client
echo "API_URL=http://localhost:3000/api" > .env
```

### 2. Start your local backend

```bash
cd server
npm run dev
```

Wait for: `✓ Server is running on port 3000`

### 3. Restart your frontend

Stop the current frontend (Ctrl+C), then:

```bash
npm run dev
```

Or from root:
```bash
cd client
npm run dev
```

---

## ✅ Done!

Your frontend will now connect to `http://localhost:3000/api` instead of production.

**Verify:**
- Open `http://localhost:8084`
- Open DevTools (F12) → Network tab
- Check API requests go to `localhost:3000` ✅
- No CORS errors ✅

---

## Why This Works

- **Before:** Frontend → Production API (`https://a-z-on-buz.com`) → CORS blocked ❌
- **After:** Frontend → Local API (`http://localhost:3000`) → Same origin, no CORS ✅

---

## Need More Details?

- See `CORS_ERROR_EXPLAINED.md` for complete explanation
- See `SETUP_ENV_FILES.md` for detailed setup instructions
- See `FIX_CORS_ERROR.md` for alternative solutions
