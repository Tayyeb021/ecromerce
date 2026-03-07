# 🔧 Fix: cross-env command not found

## Problem
You're getting: `sh: cross-env: command not found`

This happens because `cross-env` needs to be installed on your server.

## ✅ Solution

I've already updated `server/package.json` to include `cross-env` in `dependencies`. Now you need to apply this on your server.

---

## 📋 Steps to Fix on Your Server

### Option 1: Reinstall Dependencies (Recommended)

1. **Upload the updated `server/package.json`** to your server
   - Replace the existing `package.json` in your server directory

2. **SSH into your server** or use cPanel Terminal:
   ```bash
   cd /path/to/your/server
   ```

3. **Reinstall dependencies:**
   ```bash
   npm install --production
   ```
   
   Or if you need all dependencies:
   ```bash
   npm install
   ```

4. **Restart your application:**
   - **cPanel Node.js Selector**: Click "Restart" button
   - **PM2**: `pm2 restart your-app-name`
   - **systemd**: `systemctl restart your-app`

---

### Option 2: Install cross-env Manually

If you can't reinstall all dependencies, install just `cross-env`:

```bash
cd /path/to/your/server
npm install cross-env --save
```

Then restart your application.

---

### Option 3: Remove cross-env from Start Script (Alternative)

If you can't install packages, you can modify the start script:

1. **Edit `server/package.json` on your server**
2. **Change the start script from:**
   ```json
   "start": "cross-env NODE_ENV=production node index.js"
   ```
   
   **To:**
   ```json
   "start": "NODE_ENV=production node index.js"
   ```

3. **Set NODE_ENV in environment variables:**
   - In cPanel Node.js Selector → Edit your app
   - Add environment variable:
     - Name: `NODE_ENV`
     - Value: `production`

4. **Then change start script to:**
   ```json
   "start": "node index.js"
   ```

---

## ✅ Verify It Works

After applying the fix, test:

```bash
npm start
```

You should see your server start without the `cross-env: command not found` error.

---

## 📝 Current package.json Status

The `server/package.json` file on your local machine has been updated with `cross-env` in `dependencies`. You need to:

1. ✅ Upload this updated file to your server
2. ✅ Run `npm install` on the server
3. ✅ Restart your application

---

## 🚀 Quick Fix Command

If you have SSH access, run these commands:

```bash
cd /path/to/your/server
npm install cross-env --save
# Then restart your app
```

---

## 💡 Why This Happened

- `cross-env` was originally in `devDependencies`
- When you run `npm install --production`, devDependencies are not installed
- The start script needs `cross-env` to set `NODE_ENV=production`
- Solution: Move `cross-env` to `dependencies` (already done) and reinstall on server

---

Need help? Make sure you've uploaded the updated `package.json` and run `npm install` on your server!
