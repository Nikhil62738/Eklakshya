import { api } from './api';

/**
 * Step 6 & 7: Calculate Price Breakdown & Validate Coupon
 */
export const calculatePrice = (serviceId, quantity = 1, couponCode = null) => {
  return api('/bookings/individual/calculate-price', {
    method: 'POST',
    body: JSON.stringify({ serviceId, quantity, couponCode })
  });
};

/**
 * Step 4: Check available time slots for provider on date
 */
export const getAvailableSlots = (date, providerId = null) => {
  const query = new URLSearchParams({ date });
  if (providerId) query.append('providerId', providerId);
  return api(`/bookings/individual/slots?${query.toString()}`);
};

/**
 * Step 8 & 9: Create Individual Booking & Razorpay Order
 */
export const createIndividualBooking = (bookingData) => {
  return api('/bookings/individual', {
    method: 'POST',
    body: JSON.stringify(bookingData)
  });
};

/**
 * Verify Razorpay payment signature
 */
export const verifyPayment = ({ bookingId, razorpayOrderId, razorpayPaymentId, razorpaySignature }) => {
  return api('/bookings/individual/verify-payment', {
    method: 'POST',
    body: JSON.stringify({
      bookingId,
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature
    })
  });
};

/**
 * Fetch detailed booking by ID
 */
export const getIndividualBooking = (id) => {
  return api(`/bookings/individual/${id}`);
};

/**
 * Reschedule booking
 */
export const rescheduleBooking = (id, scheduledDate, scheduledTime) => {
  return api(`/bookings/individual/${id}/reschedule`, {
    method: 'PUT',
    body: JSON.stringify({ scheduledDate, scheduledTime })
  });
};

/**
 * Cancel individual booking & request 100% refund
 */
export const cancelIndividualBooking = (id, reason = 'Customer requested cancellation') => {
  return api(`/bookings/individual/${id}/cancel`, {
    method: 'PUT',
    body: JSON.stringify({ reason })
  });
};

/**
 * Get customer's booking list with filter tabs
 */
export const getMyBookings = (tab = 'ALL') => {
  return api(`/bookings/my?tab=${tab}`);
};

