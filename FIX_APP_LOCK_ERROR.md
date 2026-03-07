# 🔧 Fix: Can't acquire lock for app

## Problem
You're getting: `Can't acquire lock for app: public_html/backe`

This happens when cPanel Node.js app thinks another process is using it, or there's a stale lock file.

---

## ✅ Solutions (Try in Order)

### Solution 1: Wait and Retry

Sometimes the app is just starting/stopping:

1. **Wait 30-60 seconds**
2. **Try restarting again** in cPanel Node.js Selector

---

### Solution 2: Stop the App First

1. **Go to cPanel → Node.js Selector**
2. **Click "Stop"** on your app
3. **Wait 10 seconds**
4. **Click "Start"** again

---

### Solution 3: Delete Lock Files (SSH/Terminal)

If you have SSH access:

```bash
cd /home/azonumcs/public_html/backend
rm -f .npm-lock
rm -f package-lock.json.lock
rm -f .nodejs-lock
```

Then try restarting in cPanel.

---

### Solution 4: Restart via cPanel Terminal

1. **Go to cPanel → Terminal**
2. **Find and kill the Node.js process:**
   ```bash
   ps aux | grep node
   # Find your process ID (PID)
   kill -9 [PID]
   ```
3. **Go back to Node.js Selector and restart**

---

### Solution 5: Delete and Recreate App

**Last resort** - if nothing else works:

1. **Note down your environment variables** (copy them)
2. **Delete the Node.js app** in cPanel Node.js Selector
3. **Create a new app** with same settings
4. **Re-add environment variables**
5. **Start the app**

---

## 🚀 Quick Fix Steps

**Try these in order:**

1. ✅ **Wait 1 minute** → Try restart again
2. ✅ **Stop app** → Wait 10 sec → **Start app**
3. ✅ **SSH:** Delete lock files → Restart
4. ✅ **SSH:** Kill Node process → Restart
5. ✅ **Recreate app** (last resort)

---

## 💡 Common Causes

- App is already starting/stopping
- Previous process didn't exit cleanly
- Stale lock files from crashed app
- Another user/process using the app

---

## ✅ Most Likely Fix

**Try Solution 2 first:**
1. Stop the app in cPanel
2. Wait 10 seconds
3. Start it again

This usually resolves the lock issue!

---

## 📝 If Still Not Working

Check cPanel error logs:
- Go to cPanel → **Error Log**
- Look for Node.js related errors
- Check if there are permission issues

---

**Try stopping and starting the app first - that usually fixes it!** 🔄
