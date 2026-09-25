const express = require('express');
const router = express.Router();
const { requireAuth } = require('../middlewares/authMiddleware');
const { validate } = require('../middlewares/validate');
const {
  getOrganizations,
  createOffer,
  getMyOffers,
  OfferSchema
} = require('../controllers/surplusController');

router.use(requireAuth);

router.get('/organizations', getOrganizations);
router.post('/offer', validate(OfferSchema), createOffer);
router.get('/my-offers', getMyOffers);

module.exports = router;
