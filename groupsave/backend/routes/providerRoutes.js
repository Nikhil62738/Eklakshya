const express = require('express');
const router = express.Router();
const { 
  getNearbyProviders, 
  getProviderById 
} = require('../controllers/providerController');

router.get('/nearby', getNearbyProviders);
router.get('/:id', getProviderById);

module.exports = router;

