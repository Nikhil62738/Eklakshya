const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  bookingId: { type: String, required: true },
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  razorpayOrderId: { type: String, required: true },
  razorpayPaymentId: { type: String, default: null },
  razorpaySignature: { type: String, default: null },
  amount: { type: Number, required: true },
  currency: { type: String, default: 'INR' },
  paymentMethod: { type: String, default: 'UPI' },
  paymentStatus: {
    type: String,
    enum: ['CREATED', 'CAPTURED', 'FAILED', 'REFUNDED'],
    default: 'CREATED'
  },
  refundStatus: {
    type: String,
    enum: ['NONE', 'INITIATED', 'COMPLETED', 'FAILED'],
    default: 'NONE'
  },
  refundId: { type: String, default: null },
  refundAmount: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Payment', paymentSchema);

