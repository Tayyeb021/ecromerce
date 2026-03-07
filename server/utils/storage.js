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
      
      // Write file to local directory
      fs.writeFileSync(filePath, image.buffer);
      
      // Store relative path - frontend will construct full URL
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

    console.log(`s3UploadMultiple: Processing ${images.length} image(s)`);
    console.log(`s3UploadMultiple: Upload directory: ${uploadsDir}`);
    console.log(`s3UploadMultiple: Directory exists: ${fs.existsSync(uploadsDir)}`);

    const uploadPromises = images.map(async (image, index) => {
      try {
        if (!image || !image.buffer) {
          console.error(`Image ${index}: Missing buffer`);
          return null;
        }

        const fileName = generateFileName(image.originalname);
        const filePath = path.join(uploadsDir, fileName);
        
        console.log(`Saving image ${index}: ${fileName} to ${filePath}`);
        
        // Ensure directory exists
        if (!fs.existsSync(uploadsDir)) {
          fs.mkdirSync(uploadsDir, { recursive: true });
          console.log(`Created upload directory: ${uploadsDir}`);
        }
        
        // Write file to local directory
        fs.writeFileSync(filePath, image.buffer);
        
        // Verify file was written
        if (!fs.existsSync(filePath)) {
          console.error(`Failed to verify file write: ${filePath}`);
          return null;
        }
        
        const stats = fs.statSync(filePath);
        console.log(`Image ${index} saved successfully: ${fileName} (${stats.size} bytes)`);
        
        // Store relative path - frontend will construct full URL
        const relativePath = `/uploads/products/${fileName}`;
        return {
          imageUrl: relativePath,
          imageKey: fileName
        };
      } catch (error) {
        console.error(`Error saving image ${index} locally:`, error);
        console.error('Error stack:', error.stack);
        return null;
      }
    });

    const results = await Promise.all(uploadPromises);
    const successful = results.filter(result => result !== null);
    console.log(`s3UploadMultiple: Successfully uploaded ${successful.length} of ${images.length} images`);
    return successful;
  } catch (error) {
    console.error('Error in s3UploadMultiple:', error);
    console.error('Error stack:', error.stack);
    return [];
  }
};
