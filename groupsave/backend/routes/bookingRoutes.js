const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { 
  validateIndividualBooking, 
  validateCalculatePrice 
} = require('../middleware/bookingValidation');

// Individual Booking Controller
const {
  calculatePrice,
  getAvailableSlots,
  createIndividualBooking,
  verifyPayment,
  getIndividualBooking,
  rescheduleBooking,
  cancelIndividualBooking
} = require('../controllers/individualBookingController');

// General / Group Booking Controller
const { 
  createGroupBooking, 
  getMyBookings, 
  getBookingById, 
  resolveFallback, 
  cancelBooking, 
  rateBooking,
  completeBooking
} = require('../controllers/bookingController');

// All booking routes require authentication
router.use(protect);

// ==========================================
// 1. INDIVIDUAL BOOKING ENDPOINTS (Step 1-9)
// ==========================================
router.post('/individual/calculate-price', validateCalculatePrice, calculatePrice);
router.get('/individual/slots', getAvailableSlots);
router.post('/individual', validateIndividualBooking, createIndividualBooking);
router.post('/individual/verify-payment', verifyPayment);
router.get('/individual/:id', getIndividualBooking);
router.put('/individual/:id/reschedule', rescheduleBooking);
router.put('/individual/:id/cancel', cancelIndividualBooking);

// ==========================================
// 2. GROUP BOOKING & GENERAL BOOKINGS
// ==========================================
router.post('/group', createGroupBooking);
router.get('/my', getMyBookings);
router.get('/:id', getBookingById);
router.post('/:id/resolve-fallback', resolveFallback); // Requirement 10 Fallback
router.put('/:id/cancel', cancelBooking);
router.put('/:id/complete', completeBooking); // Mark service completed & dispatch feedback email
router.post('/:id/review', rateBooking);

module.exports = router;
