# 🔧 Server Fix: cross-env Error

## Problem
You're getting: `sh: cross-env: command not found`

This happens because `cross-env` was in `devDependencies` and isn't installed in production.

## ✅ Solution Applied

I've moved `cross-env` from `devDependencies` to `dependencies` in `server/package.json`.

## 📋 What to Do Now

### On Your cPanel/Server:

1. **Upload the updated `server/package.json`** to your server

2. **Reinstall dependencies:**
   ```bash
   cd /path/to/your/server
   npm install --production
   ```
   
   Or if you need all dependencies:
   ```bash
   npm install
   ```

3. **Restart your application:**
   - If using cPanel Node.js Selector: Click "Restart"
   - If using PM2: `pm2 restart your-app`
   - If using systemd: `systemctl restart your-app`

### Alternative Solution (If cross-env still doesn't work)

If you still have issues, you can modify the start script to not use `cross-env`:

**Option 1: Set NODE_ENV in environment variables**
- In cPanel Node.js Selector, add environment variable:
  - Name: `NODE_ENV`
  - Value: `production`

**Option 2: Modify start script** (if you have access to edit package.json on server)
```json
"start": "NODE_ENV=production node index.js"
```

But since you're on Linux, the updated package.json with cross-env in dependencies should work after reinstalling.

## ✅ Verification

After reinstalling, test:
```bash
npm start
```

You should see your server start without the cross-env error.
