const express = require('express');
const router = express.Router();
const multer = require('multer');

// Bring in Models & Utils
const Banner = require('../../models/banner');
const Category = require('../../models/category');
const auth = require('../../middleware/auth');
const role = require('../../middleware/role');
const { ROLES } = require('../../constants');
const { s3Upload } = require('../../utils/storage');

const storage = multer.memoryStorage();
const upload = multer({ storage });

// fetch store banners api (public)
router.get('/list', async (req, res) => {
  try {
    const banners = await Banner.find({ isActive: true })
      .populate('category', 'name slug')
      .sort({ order: 1, created: -1 })
      .select('title imageUrl link content category');

    res.status(200).json({
      banners
    });
  } catch (error) {
    res.status(400).json({
      error: 'Your request could not be processed. Please try again.'
    });
  }
});

// fetch all banners api (admin)
router.get(
  '/',
  auth,
  role.check(ROLES.Admin),
  async (req, res) => {
    try {
      const banners = await Banner.find({})
        .populate('category', 'name slug')
        .sort({ order: 1, created: -1 });

      res.status(200).json({
        banners
      });
    } catch (error) {
      res.status(400).json({
        error: 'Your request could not be processed. Please try again.'
      });
    }
  }
);

// fetch single banner api
router.get('/:id', async (req, res) => {
  try {
    const bannerId = req.params.id;
    const banner = await Banner.findOne({ _id: bannerId })
      .populate('category', 'name slug');

    res.status(200).json({
      banner
    });
  } catch (error) {
    res.status(400).json({
      error: 'Your request could not be processed. Please try again.'
    });
  }
});

// add banner api
router.post(
  '/add',
  auth,
  role.check(ROLES.Admin),
  upload.single('image'),
  async (req, res) => {
    try {
      const { title, imageUrl, link, content, category, isActive, order } = req.body;
      const image = req.file;

      let finalImageUrl = imageUrl || '';

      // If file is uploaded, use it instead of URL
      if (image) {
        const { imageUrl: uploadedUrl } = await s3Upload(image);
        if (uploadedUrl) {
          finalImageUrl = uploadedUrl;
        }
      }

      if (!finalImageUrl) {
        return res.status(400).json({ error: 'You must upload an image or enter an image URL.' });
      }

      const banner = new Banner({
        title: title || '',
        imageUrl: finalImageUrl,
        link: link || '',
        content: content || '',
        category: category || null,
        isActive: isActive !== undefined ? isActive : true,
        order: order || 0
      });

      const bannerDoc = await banner.save();
      await bannerDoc.populate('category', 'name slug');

      res.status(200).json({
        success: true,
        message: `Banner has been added successfully!`,
        banner: bannerDoc
      });
    } catch (error) {
      res.status(400).json({
        error: 'Your request could not be processed. Please try again.'
      });
    }
  }
);

// update banner api
router.put(
  '/:id',
  auth,
  role.check(ROLES.Admin),
  upload.single('image'),
  async (req, res) => {
    try {
      const bannerId = req.params.id;
      const { title, imageUrl, link, content, category, isActive, order } = req.body;
      const image = req.file;

      let finalImageUrl = imageUrl || '';

      // If file is uploaded, use it instead of URL
      if (image) {
        const { imageUrl: uploadedUrl } = await s3Upload(image);
        if (uploadedUrl) {
          finalImageUrl = uploadedUrl;
        }
      }

      // If no new image uploaded and no URL provided, keep existing image
      if (!finalImageUrl) {
        const existingBanner = await Banner.findById(bannerId);
        if (existingBanner) {
          finalImageUrl = existingBanner.imageUrl;
        } else {
          return res.status(400).json({ error: 'You must upload an image or enter an image URL.' });
        }
      }

      const update = {
        title: title || '',
        imageUrl: finalImageUrl,
        link: link || '',
        content: content || '',
        category: category || null,
        isActive: isActive !== undefined ? isActive : true,
        order: order || 0,
        updated: Date.now()
      };

      const query = { _id: bannerId };
      const banner = await Banner.findOneAndUpdate(query, update, {
        new: true
      }).populate('category', 'name slug');

      res.status(200).json({
        success: true,
        message: 'Banner has been updated successfully!',
        banner
      });
    } catch (error) {
      res.status(400).json({
        error: 'Your request could not be processed. Please try again.'
      });
    }
  }
);

// delete banner api
router.delete(
  '/delete/:id',
  auth,
  role.check(ROLES.Admin),
  async (req, res) => {
    try {
      const bannerId = req.params.id;
      await Banner.deleteOne({ _id: bannerId });

      res.status(200).json({
        success: true,
        message: `Banner has been deleted successfully!`
      });
    } catch (error) {
      res.status(400).json({
        error: 'Your request could not be processed. Please try again.'
      });
    }
  }
);

module.exports = router;
