const express = require('express');
const router = express.Router();
const { requireAuth } = require('../middlewares/authMiddleware');
const { getAnalytics } = require('../controllers/analyticsController');

router.use(requireAuth);

router.get('/', getAnalytics);

module.exports = router;
