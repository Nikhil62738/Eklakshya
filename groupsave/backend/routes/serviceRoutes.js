const express = require('express');
const router = express.Router();
const { 
  getAllServices, 
  getServiceById, 
  getPopularServices 
} = require('../controllers/serviceController');

router.get('/', getAllServices);
router.get('/featured/popular', getPopularServices);
router.get('/:id', getServiceById);

module.exports = router;

