# 🚀 Upload Frontend to cPanel - a-z-on-buz.com

## ✅ Ready to Upload!

Your frontend is built and configured for: **https://a-z-on-buz.com/**

**Files Ready:**
- ✅ `a-z-on-buz-frontend.zip` (12.4 MB) - Ready to upload
- ✅ `client/dist/` folder - All files ready

**API Configuration:**
- ✅ API URL set to: `https://a-z-on-buz.com/api`

---

## 📤 Step-by-Step Upload Instructions

### Method 1: Using cPanel File Manager (Easiest)

1. **Login to cPanel**
   - Go to your hosting provider's cPanel
   - Login with your credentials

2. **Open File Manager**
   - Find and click **"File Manager"** icon in cPanel
   - Navigate to **`public_html`** folder (this is your main domain folder)

3. **Clear Existing Files (Optional)**
   - If you have old files, you can backup/delete them first
   - Or upload to a new folder and move files later

4. **Upload the Zip File**
   - Click **"Upload"** button at the top
   - Select **`a-z-on-buz-frontend.zip`**
   - Wait for upload to complete (may take a few minutes for 12MB)

5. **Extract the Files**
   - Right-click on **`a-z-on-buz-frontend.zip`**
   - Select **"Extract"** or **"Extract All"**
   - Choose **"Extract to current directory"**
   - Wait for extraction to complete

6. **Delete the Zip File**
   - Right-click on the zip file
   - Select **"Delete"** (to save space)

7. **Verify Files Are in Place**
   You should see these in `public_html/`:
   - ✅ `index.html`
   - ✅ `.htaccess` (important for React Router!)
   - ✅ `js/` folder
   - ✅ `css/` folder
   - ✅ `images/` folder
   - ✅ `fonts/` folder
   - ✅ `manifest.json`

8. **Set File Permissions** (if needed)
   - Files: `644`
   - Folders: `755`
   - `.htaccess`: `644`

### Method 2: Using FTP (FileZilla)

1. **Connect via FTP**
   - Host: `ftp.a-z-on-buz.com` or your server IP
   - Username: Your cPanel username
   - Password: Your cPanel password
   - Port: `21`

2. **Navigate to public_html**
   - Go to `/public_html/` directory

3. **Upload All Files**
   - Upload everything from `client/dist/` folder
   - **IMPORTANT:** Make sure `.htaccess` is uploaded (it's a hidden file)
   - Upload all folders: `js/`, `css/`, `images/`, `fonts/`

---

## ✅ After Upload - Test Your Site

1. **Visit Your Website**
   - Go to: **https://a-z-on-buz.com/**
   - The site should load!

2. **Check Browser Console**
   - Press `F12` to open Developer Tools
   - Go to "Console" tab
   - Check for any errors (should be none)

3. **Test Navigation**
   - Click around the site
   - React Router should work (no 404 errors on routes)

4. **Test API Connection**
   - Try logging in or browsing products
   - Check Network tab in DevTools to see if API calls work
   - API calls should go to: `https://a-z-on-buz.com/api`

---

## 🐛 Troubleshooting

### If you see 404 errors on routes:
- ✅ Check `.htaccess` file exists in root
- ✅ Verify `mod_rewrite` is enabled (contact host if needed)
- ✅ Check file permissions (644 for files, 755 for folders)

### If API calls fail:
- ✅ Verify backend is running at `https://a-z-on-buz.com/api`
- ✅ Check CORS is configured on backend
- ✅ Check browser console for specific errors

### If site shows white screen:
- ✅ Check browser console (F12) for JavaScript errors
- ✅ Verify all JS files uploaded correctly
- ✅ Check `index.html` is in root directory

### If assets don't load:
- ✅ Verify all folders (js, css, images, fonts) are uploaded
- ✅ Check file permissions
- ✅ Clear browser cache (Ctrl+F5)

---

## 📋 Quick Checklist

- [ ] Uploaded `a-z-on-buz-frontend.zip` to `public_html/`
- [ ] Extracted all files
- [ ] Verified `.htaccess` is in root
- [ ] Deleted zip file
- [ ] Tested website loads at https://a-z-on-buz.com/
- [ ] Tested navigation works
- [ ] Verified API calls work
- [ ] Checked browser console for errors

---

## 🎉 You're Done!

Once uploaded, your e-commerce site will be live at:
**https://a-z-on-buz.com/**

The frontend will connect to your backend API at:
**https://a-z-on-buz.com/api**

---

## 📞 Need Help?

If something doesn't work:
1. Check browser console (F12) for errors
2. Check cPanel error logs
3. Verify all files uploaded correctly
4. Ensure backend is running and accessible

Good luck! 🚀
