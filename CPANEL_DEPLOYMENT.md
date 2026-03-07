# cPanel Deployment Guide

## 📦 Files Ready for Upload

Your client build is ready in:
- **Zip file**: `client-build-for-cpanel.zip`
- **Source folder**: `client/dist/`

## 🚀 Step-by-Step Upload Instructions

### Step 1: Update API URL (IMPORTANT!)

Before uploading, you need to rebuild with your production API URL:

1. Edit `client/.env` and set your production API URL:
   ```
   API_URL=https://your-api-domain.com/api
   ```
   Or if your API is on the same domain:
   ```
   API_URL=https://yourdomain.com/api
   ```

2. Rebuild the client:
   ```bash
   cd client
   npm run build
   ```

3. The new build will be in `client/dist/`

### Step 2: Upload to cPanel

#### Option A: Using cPanel File Manager

1. **Login to cPanel**
   - Go to your hosting provider's cPanel
   - Login with your credentials

2. **Navigate to File Manager**
   - Click on "File Manager" in cPanel
   - Navigate to `public_html` (for main domain) or your subdomain folder

3. **Upload the files**
   - Click "Upload" button
   - Upload `client-build-for-cpanel.zip`
   - Wait for upload to complete

4. **Extract the files**
   - Right-click on `client-build-for-cpanel.zip`
   - Select "Extract"
   - Extract to current directory
   - Delete the zip file after extraction

5. **Verify files are in place**
   - You should see: `index.html`, `js/`, `css/`, `images/`, `fonts/`, `.htaccess`

#### Option B: Using FTP

1. **Connect via FTP**
   - Use FileZilla or any FTP client
   - Host: your-domain.com or server IP
   - Username: your cPanel username
   - Password: your cPanel password
   - Port: 21

2. **Navigate to public_html**
   - Go to `/public_html/` directory

3. **Upload all files from `client/dist/`**
   - Upload all files and folders
   - Make sure `.htaccess` is uploaded

### Step 3: Verify .htaccess is Working

The `.htaccess` file is already included in the dist folder. It handles:
- React Router URL rewriting
- GZIP compression
- Browser caching
- Security headers

If your site shows 404 errors on routes, check:
- `.htaccess` file exists in root
- `mod_rewrite` is enabled on your server
- File permissions are correct (644 for files, 755 for folders)

### Step 4: Test Your Site

1. Visit your domain: `https://yourdomain.com`
2. Check browser console for any errors
3. Test navigation (React Router should work)
4. Verify API calls are going to correct endpoint

## 🔧 Important Configuration

### API URL Configuration

The API_URL is baked into the build during compilation. If you need to change it:

1. Update `client/.env`:
   ```
   API_URL=https://your-production-api.com/api
   ```

2. Rebuild:
   ```bash
   cd client
   npm run build
   ```

3. Re-upload the new `client/dist/` files

### Server Deployment (Backend)

Your Node.js server needs to be deployed separately:

**Option 1: Same cPanel (if Node.js is supported)**
- Some cPanel hosts support Node.js apps
- Check with your hosting provider
- You may need to use a subdomain for the API

**Option 2: Separate Server**
- Deploy server to AWS, Azure, or another Node.js hosting
- Update API_URL in client to point to server URL
- Rebuild and upload client

**Option 3: cPanel with Node.js Selector**
- Some hosts have "Node.js Selector" in cPanel
- Create Node.js app
- Upload server files
- Set environment variables

## 📁 File Structure After Upload

```
public_html/
├── index.html
├── .htaccess
├── js/
│   ├── main.[hash].js
│   ├── vendors.[hash].js
│   └── runtime.[hash].js
├── css/
│   ├── main.[hash].css
│   └── vendors.[hash].css
├── images/
│   ├── banners/
│   ├── social-icons/
│   └── ...
├── fonts/
│   └── ...
└── manifest.[hash].json
```

## ✅ Checklist

- [ ] Updated API_URL in `client/.env` for production
- [ ] Rebuilt client with `npm run build`
- [ ] Uploaded all files from `client/dist/` to `public_html/`
- [ ] Verified `.htaccess` file is uploaded
- [ ] Tested website loads correctly
- [ ] Tested React Router navigation works
- [ ] Verified API calls are working
- [ ] Checked browser console for errors

## 🐛 Troubleshooting

### 404 Errors on Routes
- Ensure `.htaccess` is in root directory
- Check `mod_rewrite` is enabled
- Verify file permissions

### API Calls Failing
- Check API_URL is correct in build
- Verify CORS is configured on server
- Check browser console for errors

### Assets Not Loading
- Verify all folders (js, css, images, fonts) are uploaded
- Check file permissions (should be 644)
- Clear browser cache

### White Screen
- Check browser console for JavaScript errors
- Verify `index.html` is in root
- Check that all JS files are uploaded

## 📞 Need Help?

If you encounter issues:
1. Check browser console (F12) for errors
2. Check cPanel error logs
3. Verify all files uploaded correctly
4. Ensure API server is running and accessible
