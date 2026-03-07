# 🚀 Complete cPanel Deployment Guide

## Overview

Your MERN e-commerce app has **2 parts**:
1. **Frontend (React)** - Can deploy directly to cPanel ✅
2. **Backend (Node.js)** - Needs special setup (see options below) ⚠️

---

## 📋 PART 1: Deploy Frontend (React) to cPanel

### Step 1: Update API URL for Production

**IMPORTANT:** Update the API URL before building!

1. Edit `client/.env`:
   ```env
   API_URL=https://yourdomain.com/api
   ```
   Or if your API is on a subdomain:
   ```env
   API_URL=https://api.yourdomain.com/api
   ```

2. Rebuild the client:
   ```bash
   cd client
   npm run build
   ```

### Step 2: Upload Frontend Files

#### Method A: Using cPanel File Manager

1. **Login to cPanel**
   - Go to your hosting provider's website
   - Login to cPanel

2. **Open File Manager**
   - Find and click "File Manager" icon
   - Navigate to `public_html` folder (for main domain)
   - Or navigate to your subdomain folder if using one

3. **Upload Files**
   - Click "Upload" button at the top
   - Upload `client-build-for-cpanel.zip` (or all files from `client/dist/`)
   - Wait for upload to complete

4. **Extract (if using zip)**
   - Right-click on the zip file
   - Select "Extract"
   - Choose "Extract to current directory"
   - Delete the zip file after extraction

5. **Verify Files**
   - You should see: `index.html`, `.htaccess`, `js/`, `css/`, `images/`, `fonts/`

#### Method B: Using FTP (FileZilla)

1. **Connect to FTP**
   - Host: `ftp.yourdomain.com` or your server IP
   - Username: Your cPanel username
   - Password: Your cPanel password
   - Port: 21

2. **Navigate to public_html**
   - Go to `/public_html/` directory

3. **Upload All Files**
   - Upload everything from `client/dist/` folder
   - Make sure to upload `.htaccess` file (it's hidden by default)
   - Upload folders: `js/`, `css/`, `images/`, `fonts/`

### Step 3: Set File Permissions

In cPanel File Manager:
- **Files**: Set to `644`
- **Folders**: Set to `755`
- **`.htaccess`**: Set to `644`

### Step 4: Test Frontend

1. Visit: `https://yourdomain.com`
2. Check if the site loads
3. Open browser console (F12) to check for errors
4. Test navigation (React Router should work)

---

## 🔧 PART 2: Deploy Backend (Node.js) - Choose Your Option

cPanel typically **doesn't support Node.js directly**. You have 3 options:

### Option 1: cPanel with Node.js Selector (Recommended if Available)

**Check if your host has "Node.js Selector" in cPanel:**

1. **Create Node.js App**
   - In cPanel, find "Node.js Selector" or "Setup Node.js App"
   - Click "Create Application"
   - Choose Node.js version (14.x or higher)
   - Set Application Root: `/home/username/api` (or your preferred path)
   - Set Application URL: `api.yourdomain.com` (or subdomain)
   - Set Application Startup File: `index.js`
   - Click "Create"

2. **Upload Server Files**
   - Upload all files from `server/` folder to the application root
   - Upload via File Manager or FTP

3. **Set Environment Variables**
   - In Node.js Selector, click "Edit" on your app
   - Add environment variables:
     ```
     NODE_ENV=production
     PORT=3000
     BASE_API_URL=https://api.yourdomain.com/api
     CLIENT_URL=https://yourdomain.com
     MONGO_URI=your_mongodb_connection_string
     JWT_SECRET=your_secret_key_here
     AWS_ACCESS_KEY_ID=your_aws_key
     AWS_SECRET_ACCESS_KEY=your_aws_secret
     AWS_REGION=your_region
     AWS_BUCKET_NAME=your_bucket_name
     ```

4. **Install Dependencies**
   - In Node.js Selector, click "Run NPM Install"
   - Or SSH into server and run: `cd /path/to/app && npm install --production`

5. **Start Application**
   - Click "Restart" in Node.js Selector

### Option 2: Deploy Backend to Separate Server (AWS/Azure/DigitalOcean)

**If cPanel doesn't support Node.js, deploy backend elsewhere:**

1. **Deploy to AWS/Azure/DigitalOcean**
   - Use services like:
     - AWS Elastic Beanstalk
     - AWS EC2
     - Azure App Service
     - DigitalOcean App Platform
     - Heroku
     - Railway
     - Render

2. **Update Frontend API URL**
   - Edit `client/.env`:
     ```env
     API_URL=https://your-backend-server.com/api
     ```
   - Rebuild and re-upload frontend

3. **Configure CORS on Backend**
   - Make sure your backend allows requests from your frontend domain

### Option 3: Use cPanel Subdomain with Reverse Proxy

**Advanced option - requires server access:**

1. Deploy Node.js on a different server/port
2. Use cPanel's reverse proxy feature
3. Point `api.yourdomain.com` to your Node.js server

---

## 📝 Required Environment Variables for Backend

Create a `.env` file in your `server/` folder with:

```env
# Server Configuration
NODE_ENV=production
PORT=3000
BASE_API_URL=https://api.yourdomain.com/api
CLIENT_URL=https://yourdomain.com

# Database (MongoDB)
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/dbname
# OR for MongoDB Atlas:
# MONGO_URI=mongodb+srv://user:pass@cluster0.xxxxx.mongodb.net/mern_ecommerce?retryWrites=true&w=majority

# JWT Secret
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production

# AWS S3 (for file uploads)
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
AWS_REGION=us-east-1
AWS_BUCKET_NAME=your_bucket_name

# Email Services (Optional)
MAILCHIMP_KEY=
MAILCHIMP_LIST_KEY=
MAILGUN_KEY=
MAILGUN_DOMAIN=
MAILGUN_EMAIL_SENDER=

# Social Auth (Optional)
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GOOGLE_CALLBACK_URL=https://api.yourdomain.com/api/auth/google/callback
FACEBOOK_CLIENT_ID=
FACEBOOK_CLIENT_SECRET=
FACEBOOK_CALLBACK_URL=https://api.yourdomain.com/api/auth/facebook/callback
```

---

## 🗄️ Database Setup (MongoDB)

### Option 1: MongoDB Atlas (Recommended - Free)

1. **Sign up**: https://www.mongodb.com/cloud/atlas
2. **Create Cluster**: Free tier available
3. **Get Connection String**:
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your database password
4. **Add to `.env`**:
   ```env
   MONGO_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/mern_ecommerce?retryWrites=true&w=majority
   ```

### Option 2: MongoDB on cPanel (if available)

- Some hosts offer MongoDB in cPanel
- Check with your hosting provider

---

## ✅ Complete Deployment Checklist

### Frontend (React)
- [ ] Updated `client/.env` with production API URL
- [ ] Rebuilt client: `cd client && npm run build`
- [ ] Uploaded all files from `client/dist/` to `public_html/`
- [ ] Verified `.htaccess` file is uploaded
- [ ] Set correct file permissions (644 for files, 755 for folders)
- [ ] Tested website loads at `https://yourdomain.com`
- [ ] Tested React Router navigation works
- [ ] Checked browser console for errors

### Backend (Node.js)
- [ ] Chosen deployment option (cPanel Node.js / Separate server)
- [ ] Created `.env` file with all required variables
- [ ] Set up MongoDB (Atlas or local)
- [ ] Uploaded all `server/` files
- [ ] Installed dependencies: `npm install --production`
- [ ] Started/restarted the application
- [ ] Tested API endpoints are accessible
- [ ] Verified CORS is configured correctly
- [ ] Tested API connection from frontend

### Database
- [ ] MongoDB cluster created (Atlas or local)
- [ ] Connection string added to `.env`
- [ ] Database connection tested
- [ ] Seeded database (optional): `npm run seed:db`

### Testing
- [ ] Frontend loads correctly
- [ ] API calls work from frontend
- [ ] User registration/login works
- [ ] Products load correctly
- [ ] Cart functionality works
- [ ] File uploads work (if using S3)

---

## 🐛 Troubleshooting

### Frontend Issues

**404 Errors on Routes:**
- Ensure `.htaccess` is in root directory
- Check `mod_rewrite` is enabled (contact host if needed)
- Verify file permissions

**White Screen:**
- Check browser console (F12) for JavaScript errors
- Verify all JS files uploaded correctly
- Check `index.html` exists in root

**API Calls Failing:**
- Verify API_URL is correct in build
- Check CORS configuration on backend
- Verify backend server is running

### Backend Issues

**Application Won't Start:**
- Check Node.js version (needs 14.x or higher)
- Verify all environment variables are set
- Check error logs in cPanel or server logs

**Database Connection Failed:**
- Verify MongoDB connection string is correct
- Check MongoDB Atlas IP whitelist (add 0.0.0.0/0 for testing)
- Verify database credentials

**Port Already in Use:**
- Change PORT in `.env` if 3000 is taken
- Update frontend API_URL if port changed

---

## 📞 Quick Reference

### File Locations After Deployment

**Frontend:**
```
public_html/
├── index.html
├── .htaccess
├── js/
├── css/
├── images/
└── fonts/
```

**Backend (if using cPanel Node.js):**
```
/home/username/api/
├── index.js
├── package.json
├── .env
├── routes/
├── models/
└── ...
```

### Important URLs

- **Frontend**: `https://yourdomain.com`
- **Backend API**: `https://api.yourdomain.com/api` (or your configured URL)
- **MongoDB Atlas**: https://cloud.mongodb.com

---

## 🎯 Next Steps After Deployment

1. **Test all functionality**
2. **Set up SSL certificate** (if not already done)
3. **Configure domain DNS** (if using subdomain for API)
4. **Set up backups** for database
5. **Monitor application logs**
6. **Set up error tracking** (optional)

---

## 💡 Tips

- **Always test locally first** before deploying
- **Keep backups** of your `.env` files (but don't commit them to git)
- **Use MongoDB Atlas** for easier database management
- **Enable SSL/HTTPS** for security
- **Monitor your application** for errors and performance

Good luck with your deployment! 🚀
