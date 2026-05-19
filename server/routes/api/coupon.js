const express = require('express');
const router = express.Router();
const Coupon = require('../../models/coupon');
const auth = require('../../middleware/auth');
const role = require('../../middleware/role');
const { ROLES } = require('../../constants');

// Public: validate a coupon code
router.post('/validate', async (req, res) => {
  try {
    const { code, cartTotal = 0 } = req.body;
    if (!code) return res.status(400).json({ error: 'Coupon code is required.' });

    const coupon = await Coupon.findOne({ code: code.toUpperCase().trim(), isActive: true });
    if (!coupon) return res.status(404).json({ error: 'Invalid coupon code.' });

    if (coupon.expiryDate && new Date() > new Date(coupon.expiryDate))
      return res.status(400).json({ error: 'This coupon has expired.' });

    if (coupon.usageLimit !== null && coupon.usedCount >= coupon.usageLimit)
      return res.status(400).json({ error: 'This coupon has reached its usage limit.' });

    if (cartTotal < coupon.minOrderAmount)
      return res.status(400).json({
        error: `Minimum order of PKR ${coupon.minOrderAmount} required for this coupon.`
      });

    let discount = 0;
    if (coupon.type === 'percentage') {
      discount = (cartTotal * coupon.value) / 100;
      if (coupon.maxDiscount) discount = Math.min(discount, coupon.maxDiscount);
    } else {
      discount = Math.min(coupon.value, cartTotal);
    }
    discount = Math.round(discount * 100) / 100;

    res.json({
      valid: true,
      discount,
      coupon: { _id: coupon._id, code: coupon.code, type: coupon.type, value: coupon.value },
      message: `Coupon applied! You save PKR ${discount.toFixed(2)}`
    });
  } catch (error) {
    res.status(400).json({ error: 'Could not validate coupon.' });
  }
});

// Admin: list all coupons
router.get('/', auth, role.check(ROLES.Admin), async (req, res) => {
  try {
    const coupons = await Coupon.find().sort('-created');
    res.json({ coupons });
  } catch (error) {
    res.status(400).json({ error: 'Could not fetch coupons.' });
  }
});

// Admin: create coupon
router.post('/add', auth, role.check(ROLES.Admin), async (req, res) => {
  try {
    const coupon = new Coupon(req.body);
    await coupon.save();
    res.json({ success: true, message: 'Coupon created!', coupon });
  } catch (error) {
    const msg = error.code === 11000 ? 'Coupon code already exists.' : 'Could not create coupon.';
    res.status(400).json({ error: msg });
  }
});

// Admin: toggle active
router.put('/:id/activate', auth, role.check(ROLES.Admin), async (req, res) => {
  try {
    const coupon = await Coupon.findByIdAndUpdate(
      req.params.id,
      { isActive: req.body.isActive },
      { new: true }
    );
    res.json({ success: true, message: 'Coupon updated.', coupon });
  } catch (error) {
    res.status(400).json({ error: 'Could not update coupon.' });
  }
});

// Admin: delete coupon
router.delete('/:id', auth, role.check(ROLES.Admin), async (req, res) => {
  try {
    await Coupon.deleteOne({ _id: req.params.id });
    res.json({ success: true, message: 'Coupon deleted.' });
  } catch (error) {
    res.status(400).json({ error: 'Could not delete coupon.' });
  }
});

module.exports = router;
