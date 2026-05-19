const fs = require('fs');
const path = require('path');
const keys = require('../config/keys');

// Create uploads directory if it doesn't exist
// Save to root uploads/products/ (two levels up from server/utils/ to get to project root)
// This matches the static file serving path in server/index.js
const uploadsDir = path.join(__dirname, '../../uploads/products');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Max dimension (longest side) for product images - prevents huge uploads from breaking layout
const PRODUCT_IMAGE_MAX_DIMENSION = 1200;

const JPEG_QUALITY = 80;
const PNG_COMPRESSION = 8;
const WEBP_QUALITY = 80;

// Resize and compress image buffer; returns optimized buffer or original on failure
async function optimizeImage(buffer, mimeType) {
  if (!buffer || buffer.length === 0) return buffer;
  const isImage = /^image\/(jpeg|jpg|png|webp|gif)$/i.test(mimeType || '');
  if (!isImage) return buffer;
  try {
    const sharp = require('sharp');
    let pipeline = sharp(buffer)
      .resize({
        width: PRODUCT_IMAGE_MAX_DIMENSION,
        height: PRODUCT_IMAGE_MAX_DIMENSION,
        fit: 'inside',
        withoutEnlargement: true
      });

    if (/jpeg|jpg/i.test(mimeType)) {
      pipeline = pipeline.jpeg({ quality: JPEG_QUALITY, mozjpeg: true });
    } else if (/png/i.test(mimeType)) {
      pipeline = pipeline.png({ compressionLevel: PNG_COMPRESSION });
    } else if (/webp/i.test(mimeType)) {
      pipeline = pipeline.webp({ quality: WEBP_QUALITY });
    }

    return await pipeline.toBuffer();
  } catch (err) {
    console.warn('Image optimization skipped (using original):', err.message);
    return buffer;
  }
}

// Helper function to generate unique filename
const generateFileName = (originalName) => {
  const timestamp = Date.now();
  const randomString = Math.random().toString(36).substring(2, 15);
  const ext = path.extname(originalName);
  const baseName = path.basename(originalName, ext);
  return `${timestamp}-${randomString}-${baseName}${ext}`;
};

// Store relative paths only - let frontend construct full URLs
// This ensures images work regardless of frontend port or domain

exports.s3Upload = async image => {
  try {
    let imageUrl = '';
    let imageKey = '';

    if (image) {
      const fileName = generateFileName(image.originalname);
      const filePath = path.join(uploadsDir, fileName);
      const bufferToWrite = await optimizeImage(image.buffer, image.mimetype);

      fs.writeFileSync(filePath, bufferToWrite);
      const relativePath = `/uploads/products/${fileName}`;
      imageUrl = relativePath;
      imageKey = fileName;
    }

    return { imageUrl, imageKey };
  } catch (error) {
    console.error('Error saving image locally:', error);
    return { imageUrl: '', imageKey: '' };
  }
};

exports.s3UploadMultiple = async images => {
  try {
    if (!images || images.length === 0) {
      console.log('s3UploadMultiple: No images provided');
      return [];
    }

    const uploadPromises = images.map(async (image, index) => {
      try {
        if (!image || !image.buffer) return null;

        const fileName = generateFileName(image.originalname);
        const filePath = path.join(uploadsDir, fileName);
        const bufferToWrite = await optimizeImage(image.buffer, image.mimetype);

        if (!fs.existsSync(uploadsDir)) {
          fs.mkdirSync(uploadsDir, { recursive: true });
        }

        fs.writeFileSync(filePath, bufferToWrite);

        const relativePath = `/uploads/products/${fileName}`;
        return { imageUrl: relativePath, imageKey: fileName };
      } catch (error) {
        console.error(`Error saving image ${index}:`, error.message);
        return null;
      }
    });

    return (await Promise.all(uploadPromises)).filter(Boolean);
  } catch (error) {
    console.error('Error in s3UploadMultiple:', error);
    console.error('Error stack:', error.stack);
    return [];
  }
};
