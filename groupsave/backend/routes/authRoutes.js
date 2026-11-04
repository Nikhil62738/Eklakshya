const express = require('express');
const router = express.Router();
const { 
  register, 
  login, 
  sendOtp, 
  verifyOtp, 
  getMe, 
  updateProfile, 
  addAddress, 
  deleteAddress 
} = require('../controllers/authController');
const { protect } = require('../middleware/auth');

router.post('/register', register);
router.post('/login', login);
router.post('/send-otp', sendOtp);
router.post('/verify-otp', verifyOtp);
router.get('/me', protect, getMe);
router.put('/profile', protect, updateProfile);
router.post('/addresses', protect, addAddress);
router.delete('/addresses/:addressId', protect, deleteAddress);

module.exports = router;

