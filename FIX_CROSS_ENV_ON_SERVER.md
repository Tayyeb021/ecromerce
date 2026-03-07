# 🔧 Fix: cross-env command not found on Server

## Problem
When running `npm start` on your production server, you get:
```
sh: cross-env: command not found
```

This happens because `cross-env` is not installed in `node_modules` on your server.

---

## ✅ Solution Options

### Option 1: Install cross-env on Server (Recommended)

**SSH into your server or use cPanel Terminal, then run:**

```bash
cd /path/to/your/server
npm install cross-env --save
```

Then restart your application.

---

### Option 2: Upload Updated package.json and Reinstall

1. **Upload the updated `server/package.json`** to your server
   - The file already has `cross-env` in dependencies (line 18)

2. **On your server, run:**
   ```bash
   cd /path/to/your/server
   npm install --production
   ```
   Or to install all dependencies:
   ```bash
   npm install
   ```

3. **Restart your application**

---

### Option 3: Remove cross-env from Start Script (Quick Fix)

If you can't install packages, modify the start script:

1. **Edit `server/package.json` on your server**

2. **Change line 7 from:**
   ```json
   "start": "cross-env NODE_ENV=production node index.js"
   ```
   
   **To:**
   ```json
   "start": "node index.js"
   ```

3. **Set NODE_ENV as environment variable:**
   - In **cPanel Node.js Selector** → Edit your app
   - Add environment variable:
     - **Name:** `NODE_ENV`
     - **Value:** `production`
   - Save

4. **Restart your application**

---

## 🚀 Quickest Fix (Choose One)

### If you have SSH/Terminal access:
```bash
cd /path/to/your/server
npm install cross-env --save
# Then restart your app
```

### If you only have cPanel:
1. Edit `server/package.json` on server
2. Change start script to: `"start": "node index.js"`
3. Add `NODE_ENV=production` in cPanel environment variables
4. Restart app

---

## 📝 Why This Happened

- `cross-env` was originally in `devDependencies`
- When you run `npm install --production`, devDependencies are NOT installed
- The start script needs `cross-env` but it's missing
- **Solution:** We moved it to `dependencies`, but you need to install it on the server

---

## ✅ After Fixing

Your server should start without errors:
```bash
npm start
# Should work now! ✅
```

---

## 💡 Recommendation

**Use Option 1** - Just run `npm install cross-env --save` on your server. It's the simplest and cleanest solution.
