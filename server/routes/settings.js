const express = require('express');
const { getSettings, updateSettings } = require('../controllers/settingsController');
const auth = require('../middleware/auth');

const router = express.Router();

router.get('/', auth, getSettings);
router.post('/', auth, updateSettings);

module.exports = router;
