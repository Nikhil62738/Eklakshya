const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  bookingId: { type: String, required: true, unique: true },
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  providerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Provider', required: true },
  serviceId: { type: mongoose.Schema.Types.ObjectId, ref: 'Service', required: true },
  bookingType: { 
    type: String, 
    enum: ['INDIVIDUAL', 'GROUP'], 
    required: true 
  },
  groupDealId: { type: mongoose.Schema.Types.ObjectId, ref: 'GroupDeal', default: null },
  quantity: { type: Number, default: 1 },
  scheduledDate: { type: String, required: true },
  scheduledTime: { type: String, required: true },
  address: {
    title: { type: String, default: 'Home' },
    flatNo: { type: String, required: true },
    society: { type: String, required: true },
    locality: { type: String, required: true },
    city: { type: String, default: 'Bengaluru' },
    pincode: { type: String, default: '560062' }
  },
  unitPrice: { type: Number, required: true },
  originalPrice: { type: Number, required: true },
  discountAmount: { type: Number, default: 0 },
  platformFee: { type: Number, default: 29 },
  taxAmount: { type: Number, default: 0 },
  totalPrice: { type: Number, required: true },
  couponApplied: { type: String, default: null },
  
  paymentStatus: {
    type: String,
    enum: ['PENDING', 'PAID', 'REFUNDED', 'FAILED'],
    default: 'PAID'
  },
  bookingStatus: {
    type: String,
    enum: ['CONFIRMED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED', 'FALLBACK_PENDING', 'CONVERTED_INDIVIDUAL'],
    default: 'CONFIRMED'
  },
  
  // Bulking Fallback fields (Requirement 10)
  fallbackChoice: {
    type: String,
    enum: ['CONVERT_INDIVIDUAL', 'CANCEL_REFUND', null],
    default: null
  },
  fallbackResolvedAt: { type: Date, default: null },
  refundAmount: { type: Number, default: 0 },
  refundTransactionId: { type: String, default: null },
  
  // Payment gateway trace
  paymentDetails: {
    razorpayOrderId: { type: String, default: null },
    razorpayPaymentId: { type: String, default: null },
    paymentMethod: { type: String, default: 'UPI' }
  },
  
  serviceOTP: { type: String, default: '4829' }, // OTP to provide to service technician upon arrival
  notes: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Booking', bookingSchema);

