# 🔧 Fix: API Redirecting to Page Instead of Loading Data

## Problem
API requests to `https://a-z-on-buz.com/api/*` are redirecting to the React app page instead of returning JSON data from the backend.

## Root Cause
The `.htaccess` file is rewriting ALL requests (including `/api/*`) to `index.html`. We need to proxy API requests to the Node.js backend running on port 3000.

## ✅ Solution: Update `.htaccess` with Reverse Proxy

### Updated `.htaccess` Content

The `.htaccess` file needs to proxy API requests to your Node.js backend:

```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  
  # Proxy API requests to Node.js backend (LiteSpeed compatible)
  RewriteCond %{REQUEST_URI} ^/api/ [NC]
  RewriteRule ^api/(.*)$ http://127.0.0.1:3000/api/$1 [P,L]
  
  # Don't rewrite existing files
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteCond %{REQUEST_FILENAME} !-l
  
  # Rewrite everything else to index.html (for React Router)
  RewriteRule . /index.html [L]
</IfModule>

# Enable GZIP compression
<IfModule mod_deflate.c>
  AddOutputFilterByType DEFLATE text/html text/plain text/xml text/css text/javascript application/javascript application/json
</IfModule>

# Cache static assets
<IfModule mod_expires.c>
  ExpiresActive On
  ExpiresByType image/jpg "access plus 1 year"
  ExpiresByType image/jpeg "access plus 1 year"
  ExpiresByType image/gif "access plus 1 year"
  ExpiresByType image/png "access plus 1 year"
  ExpiresByType image/svg+xml "access plus 1 year"
  ExpiresByType text/css "access plus 1 month"
  ExpiresByType application/javascript "access plus 1 month"
  ExpiresByType application/pdf "access plus 1 month"
  ExpiresByType text/x-javascript "access plus 1 month"
  ExpiresByType application/x-shockwave-flash "access plus 1 month"
  ExpiresByType image/x-icon "access plus 1 year"
  ExpiresDefault "access plus 2 days"
</IfModule>

# Security headers
<IfModule mod_headers.c>
  Header set X-Content-Type-Options "nosniff"
  Header set X-Frame-Options "SAMEORIGIN"
  Header set X-XSS-Protection "1; mode=block"
</IfModule>
```

## 📋 Steps to Fix on Your Server

### Option 1: Edit via SSH/Terminal

1. **SSH into your server** or use cPanel Terminal
2. **Navigate to public_html:**
   ```bash
   cd ~/public_html
   ```
3. **Edit .htaccess:**
   ```bash
   nano .htaccess
   ```
4. **Replace the content** with the updated `.htaccess` above
5. **Save:** `Ctrl+X`, then `Y`, then `Enter`
6. **Test:**
   ```bash
   curl https://a-z-on-buz.com/api/category/list
   ```

### Option 2: Edit via cPanel File Manager

1. **Go to cPanel → File Manager**
2. **Enable "Show Hidden Files"** (Settings → Show Hidden Files)
3. **Navigate to `public_html/`**
4. **Right-click `.htaccess` → Edit**
5. **Replace content** with the updated `.htaccess` above
6. **Save Changes**

### Option 3: Upload Updated File

1. **I've created the updated `.htaccess`** in `client/dist/.htaccess`
2. **Upload it** to your server's `public_html/` folder
3. **Replace the existing `.htaccess`**

## 🔍 Key Changes

**Before (just exclusion - doesn't work):**
```apache
RewriteCond %{REQUEST_URI} ^/api/ [NC]
RewriteRule ^ - [L]
```

**After (proxy to backend - works!):**
```apache
RewriteCond %{REQUEST_URI} ^/api/ [NC]
RewriteRule ^api/(.*)$ http://127.0.0.1:3000/api/$1 [P,L]
```

The `[P,L]` flags mean:
- `P` = Proxy (forward request to backend)
- `L` = Last rule (stop processing)

## ✅ Verify It Works

After updating `.htaccess`:

1. **Test API endpoint:**
   ```bash
   curl https://a-z-on-buz.com/api/category/list
   ```
   Should return JSON, not HTML!

2. **Check in browser:**
   - Open DevTools (F12)
   - Go to Network tab
   - Make an API request
   - Check Response - should be JSON, not HTML

3. **Clear browser cache:**
   - Press `Ctrl + Shift + Delete`
   - Or `Ctrl + F5` to hard refresh

## ⚠️ Important Notes

1. **Backend must be running** on port 3000
2. **LiteSpeed must support mod_proxy** (most do)
3. **Use `127.0.0.1`** instead of `localhost` (more reliable)
4. **Clear browser cache** after updating `.htaccess`

## 🐛 If It Still Doesn't Work

### Check 1: Backend is Running
```bash
curl http://localhost:3000/api/category/list
```
Should return JSON.

### Check 2: LiteSpeed Supports Proxy
Some hosts disable mod_proxy. Contact your hosting provider if proxy doesn't work.

### Check 3: Alternative - Use Subdomain
If proxy doesn't work, use a subdomain:
- Create `api.a-z-on-buz.com` subdomain
- Point it to Node.js backend
- Update frontend API_URL to `https://api.a-z-on-buz.com/api`

## 📝 Summary

**Problem:** `.htaccess` rewriting API requests to `index.html`  
**Solution:** Add reverse proxy rule to forward `/api/*` to `http://127.0.0.1:3000/api/*`  
**File:** Update `public_html/.htaccess` on your server

Update the `.htaccess` file on your server and the API should work! 🚀
