const mongoose = require('mongoose');

/**
 * Validation Middleware for Individual Booking
 */
function validateIndividualBooking(req, res, next) {
  const {
    serviceId,
    providerId,
    quantity,
    scheduledDate,
    scheduledTime,
    address,
    paymentMethod
  } = req.body;

  const errors = [];

  // 1. Validate serviceId
  if (!serviceId) {
    errors.push('serviceId is required');
  } else if (!mongoose.Types.ObjectId.isValid(serviceId)) {
    errors.push('Invalid serviceId format');
  }

  // 2. Validate providerId (if supplied)
  if (providerId && !mongoose.Types.ObjectId.isValid(providerId)) {
    errors.push('Invalid providerId format');
  }

  // 3. Validate quantity
  if (quantity !== undefined) {
    const parsedQty = parseInt(quantity, 10);
    if (isNaN(parsedQty) || parsedQty < 1 || parsedQty > 10) {
      errors.push('Quantity must be an integer between 1 and 10');
    }
  }

  // 4. Validate scheduledDate
  if (!scheduledDate || typeof scheduledDate !== 'string' || !scheduledDate.trim()) {
    errors.push('scheduledDate is required (e.g. "2026-11-05" or "Tomorrow, 21 Sep")');
  }

  // 5. Validate scheduledTime
  if (!scheduledTime || typeof scheduledTime !== 'string' || !scheduledTime.trim()) {
    errors.push('scheduledTime is required (e.g. "11:00 AM" or "02:00 PM")');
  }

  // 6. Validate address
  if (!address || typeof address !== 'object') {
    errors.push('address object is required');
  } else {
    if (!address.flatNo || typeof address.flatNo !== 'string' || !address.flatNo.trim()) {
      errors.push('address.flatNo is required (e.g. "Room 101" or "Flat 402")');
    }
    if (!address.society || typeof address.society !== 'string' || !address.society.trim()) {
      errors.push('address.society is required (e.g. "DBATU Hostel" or "Prestige Falcon City")');
    }
    if (!address.locality || typeof address.locality !== 'string' || !address.locality.trim()) {
      errors.push('address.locality is required (e.g. "Lonere, Raigad")');
    }
    if (address.pincode) {
      const pinStr = address.pincode.toString().trim();
      if (!/^[1-9][0-9]{5}$/.test(pinStr)) {
        errors.push('address.pincode must be a valid 6-digit Indian PIN code');
      }
    }
  }

  // 7. Validate paymentMethod
  const validMethods = ['UPI', 'CARD', 'NETBANKING', 'WALLET'];
  if (paymentMethod && !validMethods.includes(paymentMethod.toUpperCase())) {
    errors.push(`paymentMethod must be one of: ${validMethods.join(', ')}`);
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors
    });
  }

  next();
}

/**
 * Validation for Price Calculation
 */
function validateCalculatePrice(req, res, next) {
  const { serviceId, quantity } = req.body;
  const errors = [];

  if (!serviceId) {
    errors.push('serviceId is required');
  } else if (!mongoose.Types.ObjectId.isValid(serviceId)) {
    errors.push('Invalid serviceId format');
  }

  if (quantity !== undefined) {
    const parsedQty = parseInt(quantity, 10);
    if (isNaN(parsedQty) || parsedQty < 1 || parsedQty > 10) {
      errors.push('Quantity must be an integer between 1 and 10');
    }
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors
    });
  }

  next();
}

module.exports = {
  validateIndividualBooking,
  validateCalculatePrice
};

