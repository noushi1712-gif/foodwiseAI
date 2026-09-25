const express = require('express');
const router = express.Router();
const { requireAuth } = require('../middlewares/authMiddleware');
const { validate } = require('../middlewares/validate');
const {
  recordConsumption,
  getConsumptionHistory,
  ConsumptionLogSchema
} = require('../controllers/consumptionController');

router.use(requireAuth);

router.post('/', validate(ConsumptionLogSchema), recordConsumption);
router.get('/', getConsumptionHistory);

module.exports = router;
