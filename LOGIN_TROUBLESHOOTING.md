# 🔍 Login Troubleshooting Guide

## Problem: Getting 200 OK but Can't Login

If you're seeing **200 OK** responses but login isn't working, here's how to debug:

---

## Step 1: Check Browser Console

1. Open Developer Tools (F12)
2. Go to **Console** tab
3. Try to login
4. Look for any errors or warnings

**Common issues:**
- `response.data.user is undefined` - Response structure mismatch
- `Cannot read property 'token'` - Token not in response
- Network errors

---

## Step 2: Check Network Tab

1. Open Developer Tools (F12)
2. Go to **Network** tab
3. Try to login
4. Click on the `/auth/login` request
5. Check:
   - **Status:** Should be 200
   - **Response:** Click "Response" tab to see what server returned

**Expected Response:**
```json
{
  "success": true,
  "token": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "...",
    "firstName": "John",
    "lastName": "Doe",
    "email": "user@example.com",
    "role": "ROLE MEMBER"
  }
}
```

**If response is different:**
- Check server logs
- Verify database has users
- Check if backend is running correctly

---

## Step 3: Check Local Storage

1. Open Developer Tools (F12)
2. Go to **Application** tab (Chrome) or **Storage** tab (Firefox)
3. Click **Local Storage** → `http://localhost:8084`
4. Look for `token` key

**Should see:**
```
token: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

**If token is missing or wrong:**
- Token wasn't stored properly
- Check browser console for errors

---

## Step 4: Verify Backend is Running

1. Check if backend is running:
   ```bash
   cd server
   npm run dev
   ```

2. Should see:
   ```
   ✓ Server is running on port 3000
   ✓ API available at http://localhost:3000/api
   ```

3. Test API directly:
   ```bash
   curl http://localhost:3000/api/auth/login -X POST -H "Content-Type: application/json" -d "{\"email\":\"admin@az-on-buz.com\",\"password\":\"admin123\"}"
   ```

---

## Step 5: Check Database

Make sure you have users in the database:

1. **Seed the database:**
   ```bash
   cd server
   npm run seed:db
   ```

2. **Default users:**
   - **Admin:** `admin@az-on-buz.com` / `admin123`
   - **User:** `user@az-on-buz.com` / `user123`

3. **Verify users exist:**
   ```bash
   cd server
   npm run verify:users
   ```

---

## Step 6: Check API URL Configuration

1. Verify `client/.env` file exists:
   ```env
   API_URL=http://localhost:3000/api
   ```

2. **Restart frontend** after changing `.env`:
   - Stop frontend (Ctrl+C)
   - Run `npm run dev` again

3. Check browser console for actual API calls:
   - Should go to `http://localhost:3000/api/auth/login`
   - NOT `https://a-z-on-buz.com/api/auth/login`

---

## Step 7: Check Authentication State

1. After login attempt, check Redux DevTools (if installed)
2. Or check browser console:
   ```javascript
   // In browser console:
   localStorage.getItem('token')
   // Should return token string
   ```

3. Check if authenticated state updates:
   - Login component should redirect to `/dashboard`
   - If stuck on login page, authentication state isn't updating

---

## Common Issues & Solutions

### Issue 1: Response Structure Mismatch

**Error:** `Cannot read property 'user' of undefined`

**Solution:**
- Check server response structure
- Verify backend is returning correct format
- Check server logs for errors

### Issue 2: Token Not Stored

**Error:** Token exists in response but not in localStorage

**Solution:**
- Check browser console for errors
- Verify `localStorage.setItem` is being called
- Check if browser blocks localStorage (private/incognito mode)

### Issue 3: Authentication State Not Updating

**Error:** Login succeeds but stays on login page

**Solution:**
- Check Redux store state
- Verify `SET_AUTH` action is dispatched
- Check authentication reducer

### Issue 4: Redirect Not Working

**Error:** Login succeeds but doesn't redirect to dashboard

**Solution:**
- Check if `/dashboard` route exists
- Verify router is configured correctly
- Check browser console for navigation errors

---

## Quick Debug Checklist

- [ ] Backend is running on port 3000
- [ ] Frontend is running on port 8084
- [ ] `client/.env` has `API_URL=http://localhost:3000/api`
- [ ] Database has users (run `npm run seed:db`)
- [ ] Network request shows 200 OK
- [ ] Response has `token` and `user` fields
- [ ] Token is stored in localStorage
- [ ] No errors in browser console
- [ ] Authentication state updates after login

---

## Still Not Working?

1. **Check server logs:**
   - Look at terminal where backend is running
   - Check for errors or warnings

2. **Check browser console:**
   - Look for JavaScript errors
   - Check network requests

3. **Try these test credentials:**
   - Email: `admin@az-on-buz.com`
   - Password: `admin123`

4. **Clear browser cache:**
   - Hard refresh: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)
   - Or clear browser cache completely

5. **Check if MongoDB is running:**
   ```bash
   # Windows
   mongod
   
   # Or check if MongoDB service is running
   ```

---

## Need More Help?

- Check server logs for detailed error messages
- Verify all environment variables are set correctly
- Make sure all dependencies are installed (`npm install`)
- Check `QUICK_START.md` for setup instructions
