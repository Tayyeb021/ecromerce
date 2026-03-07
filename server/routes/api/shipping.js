const express = require('express');
const router = express.Router();
const Mongoose = require('mongoose');

// Bring in Models & Utils
const ShippingOption = require('../../models/shipping');
const auth = require('../../middleware/auth');
const role = require('../../middleware/role');
const { ROLES } = require('../../constants');

// Get all active shipping options (public)
router.get('/list', async (req, res) => {
  try {
    const shippingOptions = await ShippingOption.find({ isActive: true })
      .sort({ sortOrder: 1, created: -1 });

    res.status(200).json({
      shippingOptions
    });
  } catch (error) {
    res.status(400).json({
      error: 'Your request could not be processed. Please try again.'
    });
  }
});

// Get all shipping options (admin only)
router.get(
  '/',
  auth,
  role.check(ROLES.Admin),
  async (req, res) => {
    try {
      const shippingOptions = await ShippingOption.find({})
        .sort({ sortOrder: 1, created: -1 });

      res.status(200).json({
        shippingOptions
      });
    } catch (error) {
      res.status(400).json({
        error: 'Your request could not be processed. Please try again.'
      });
    }
  }
);

// Get single shipping option
router.get(
  '/:id',
  auth,
  role.check(ROLES.Admin),
  async (req, res) => {
    try {
      const shippingOptionId = req.params.id;

      if (!Mongoose.Types.ObjectId.isValid(shippingOptionId)) {
        return res.status(400).json({ error: 'Invalid shipping option ID.' });
      }

      const shippingOption = await ShippingOption.findById(shippingOptionId);

      if (!shippingOption) {
        return res.status(404).json({
          error: 'Shipping option not found.'
        });
      }

      res.status(200).json({
        shippingOption
      });
    } catch (error) {
      res.status(400).json({
        error: 'Your request could not be processed. Please try again.'
      });
    }
  }
);

// Add shipping option
router.post(
  '/add',
  auth,
  role.check(ROLES.Admin),
  async (req, res) => {
    try {
      const { name, description, cost, deliveryTime, isActive, isDefault, freeShippingThreshold, sortOrder } = req.body;

      if (!name) {
        return res.status(400).json({ error: 'You must enter a shipping option name.' });
      }

      if (cost === undefined || cost === null) {
        return res.status(400).json({ error: 'You must enter a shipping cost.' });
      }

      // If this is set as default, unset other defaults
      if (isDefault) {
        await ShippingOption.updateMany({ isDefault: true }, { isDefault: false });
      }

      const shippingOption = new ShippingOption({
        name,
        description,
        cost: parseFloat(cost),
        deliveryTime,
        isActive: isActive !== undefined ? isActive : true,
        isDefault: isDefault || false,
        freeShippingThreshold: freeShippingThreshold ? parseFloat(freeShippingThreshold) : null,
        sortOrder: sortOrder || 0
      });

      const savedShippingOption = await shippingOption.save();

      res.status(200).json({
        success: true,
        message: `Shipping option has been added successfully!`,
        shippingOption: savedShippingOption
      });
    } catch (error) {
      console.error('Shipping option add error:', error);
      res.status(400).json({
        error: 'Your request could not be processed. Please try again.'
      });
    }
  }
);

// Update shipping option
router.put(
  '/:id',
  auth,
  role.check(ROLES.Admin),
  async (req, res) => {
    try {
      const shippingOptionId = req.params.id;
      const { name, description, cost, deliveryTime, isActive, isDefault, freeShippingThreshold, sortOrder } = req.body;

      if (!Mongoose.Types.ObjectId.isValid(shippingOptionId)) {
        return res.status(400).json({ error: 'Invalid shipping option ID.' });
      }

      const shippingOption = await ShippingOption.findById(shippingOptionId);

      if (!shippingOption) {
        return res.status(404).json({
          error: 'Shipping option not found.'
        });
      }

      if (!name) {
        return res.status(400).json({ error: 'You must enter a shipping option name.' });
      }

      if (cost === undefined || cost === null) {
        return res.status(400).json({ error: 'You must enter a shipping cost.' });
      }

      // If this is set as default, unset other defaults
      if (isDefault && !shippingOption.isDefault) {
        await ShippingOption.updateMany({ isDefault: true }, { isDefault: false });
      }

      shippingOption.name = name;
      shippingOption.description = description;
      shippingOption.cost = parseFloat(cost);
      shippingOption.deliveryTime = deliveryTime;
      shippingOption.isActive = isActive !== undefined ? isActive : shippingOption.isActive;
      shippingOption.isDefault = isDefault !== undefined ? isDefault : shippingOption.isDefault;
      shippingOption.freeShippingThreshold = freeShippingThreshold ? parseFloat(freeShippingThreshold) : null;
      shippingOption.sortOrder = sortOrder !== undefined ? sortOrder : shippingOption.sortOrder;
      shippingOption.updated = Date.now();

      const updatedShippingOption = await shippingOption.save();

      res.status(200).json({
        success: true,
        message: `Shipping option has been updated successfully!`,
        shippingOption: updatedShippingOption
      });
    } catch (error) {
      console.error('Shipping option update error:', error);
      res.status(400).json({
        error: 'Your request could not be processed. Please try again.'
      });
    }
  }
);

// Delete shipping option
router.delete(
  '/delete/:id',
  auth,
  role.check(ROLES.Admin),
  async (req, res) => {
    try {
      const shippingOptionId = req.params.id;

      if (!Mongoose.Types.ObjectId.isValid(shippingOptionId)) {
        return res.status(400).json({ error: 'Invalid shipping option ID.' });
      }

      const shippingOption = await ShippingOption.findById(shippingOptionId);

      if (!shippingOption) {
        return res.status(404).json({ error: 'Shipping option not found.' });
      }

      await ShippingOption.deleteOne({ _id: shippingOptionId });

      res.status(200).json({
        success: true,
        message: `Shipping option has been deleted successfully!`
      });
    } catch (error) {
      console.error('Shipping option delete error:', error);
      res.status(400).json({
        error: 'Your request could not be processed. Please try again.'
      });
    }
  }
);

module.exports = router;
