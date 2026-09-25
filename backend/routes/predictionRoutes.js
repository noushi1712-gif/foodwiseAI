const express = require('express');
const router = express.Router();
const { requireAuth } = require('../middlewares/authMiddleware');
const { validate } = require('../middlewares/validate');
const { createPrediction, getHistory, PredictionRequestSchema } = require('../controllers/predictionController');

// All prediction endpoints require authentication and user_id isolation
router.use(requireAuth);

router.post('/', validate(PredictionRequestSchema), createPrediction);
router.get('/history', getHistory);

module.exports = router;
