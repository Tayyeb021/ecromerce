# ⚡ Quick Start: Deploy to cPanel

## 🎯 What You Need to Do

### 1️⃣ Frontend (React) - 5 Minutes

```bash
# Step 1: Update API URL
# Edit client/.env and set:
API_URL=https://yourdomain.com/api

# Step 2: Build
cd client
npm run build

# Step 3: Upload to cPanel
# Upload everything from client/dist/ to public_html/
```

**Upload these files to `public_html/`:**
- ✅ `index.html`
- ✅ `.htaccess` (important!)
- ✅ `js/` folder
- ✅ `css/` folder
- ✅ `images/` folder
- ✅ `fonts/` folder

---

### 2️⃣ Backend (Node.js) - Choose One:

#### Option A: cPanel Node.js Selector (If Available)
1. Find "Node.js Selector" in cPanel
2. Create new Node.js app
3. Upload `server/` folder files
4. Set environment variables (see below)
5. Run `npm install --production`
6. Restart app

#### Option B: Deploy to Separate Server
- Use AWS, Azure, Heroku, Railway, Render, etc.
- Update frontend API_URL to point to new server
- Rebuild and re-upload frontend

---

### 3️⃣ Database (MongoDB)

**Use MongoDB Atlas (Free):**
1. Sign up: https://www.mongodb.com/cloud/atlas
2. Create free cluster
3. Get connection string
4. Add to backend `.env`:
   ```
   MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/dbname
   ```

---

## 📝 Backend Environment Variables

Create `server/.env` with:

```env
NODE_ENV=production
PORT=3000
BASE_API_URL=https://api.yourdomain.com/api
CLIENT_URL=https://yourdomain.com
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key_here
AWS_ACCESS_KEY_ID=your_key
AWS_SECRET_ACCESS_KEY=your_secret
AWS_REGION=us-east-1
AWS_BUCKET_NAME=your_bucket
```

---

## ✅ Quick Checklist

- [ ] Frontend built and uploaded to `public_html/`
- [ ] `.htaccess` file uploaded
- [ ] Backend deployed (cPanel Node.js OR separate server)
- [ ] MongoDB Atlas cluster created
- [ ] Environment variables set
- [ ] Test website loads
- [ ] Test API works

---

## 🆘 Common Issues

**404 on routes?** → Check `.htaccess` is uploaded

**API not working?** → Check API_URL in frontend build

**Can't find Node.js in cPanel?** → Use Option B (separate server)

**Database connection failed?** → Check MongoDB Atlas IP whitelist

---

📖 **Full Guide:** See `DEPLOY_TO_CPANEL.md` for detailed instructions
