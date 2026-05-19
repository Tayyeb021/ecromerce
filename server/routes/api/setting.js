const router = require('express').Router();
const auth = require('../../middleware/auth');
const role = require('../../middleware/role');
const { ROLES } = require('../../constants');
const Setting = require('../../models/setting');

// GET /api/setting — public, returns all settings as { key: value }
router.get('/', async (req, res) => {
  try {
    const settings = await Setting.find({});
    const map = {};
    settings.forEach(s => { map[s.key] = s.value; });
    res.status(200).json({ settings: map });
  } catch (error) {
    res.status(400).json({ error: 'Could not fetch settings.' });
  }
});

// PUT /api/setting — admin only, upserts a key-value pair
router.put('/', auth, role.check(ROLES.Admin), async (req, res) => {
  try {
    const { key, value } = req.body;
    if (!key) return res.status(400).json({ error: 'Key is required.' });

    const setting = await Setting.findOneAndUpdate(
      { key },
      { key, value: value || '', updated: Date.now() },
      { upsert: true, new: true }
    );

    res.status(200).json({ success: true, message: 'Setting saved.', setting });
  } catch (error) {
    res.status(400).json({ error: 'Could not save setting.' });
  }
});

module.exports = router;
