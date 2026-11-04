const express = require('express');
const router = express.Router();
const { 
  getAllGroupDeals, 
  getGroupDealById, 
  createGroupDeal, 
  simulateDeadline 
} = require('../controllers/groupDealController');
const { protect } = require('../middleware/auth');

router.get('/', getAllGroupDeals);
router.get('/:id', getGroupDealById);
router.post('/create', protect, createGroupDeal);
router.post('/:id/simulate-deadline', simulateDeadline); // public or auth for easy testing of Requirement 10

module.exports = router;

