const mongoose = require('mongoose');

const participantSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  society: { type: String, required: true },
  flatNo: { type: String, default: '' },
  quantity: { type: Number, default: 1 },
  bookingId: { type: String, required: true },
  joinedAt: { type: Date, default: Date.now },
  status: { type: String, enum: ['JOINED', 'CONVERTED_INDIVIDUAL', 'REFUNDED'], default: 'JOINED' }
});

const groupDealSchema = new mongoose.Schema({
  serviceId: { type: mongoose.Schema.Types.ObjectId, ref: 'Service', required: true },
  providerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Provider', required: true },
  title: { type: String, required: true },
  category: { type: String, required: true },
  minimumGroupSize: { type: Number, required: true, default: 10 },
  maximumGroupSize: { type: Number, required: true, default: 30 },
  currentParticipants: [participantSchema],
  pricingTiers: [{
    minGroupSize: { type: Number, required: true },
    maxGroupSize: { type: Number, required: true },
    discountedPrice: { type: Number, required: true },
    discountPercent: { type: Number, required: true }
  }],
  regularPrice: { type: Number, required: true },
  currentGroupPrice: { type: Number, required: true },
  deadline: { type: Date, required: true },
  serviceDate: { type: String, required: true },
  serviceLocation: {
    society: { type: String, required: true },
    locality: { type: String, required: true },
    city: { type: String, default: 'Bengaluru' },
    pincode: { type: String, default: '560062' },
    coordinates: {
      lat: { type: Number, default: 12.8912 },
      lng: { type: Number, default: 77.5683 }
    }
  },
  status: {
    type: String,
    enum: ['ACTIVE', 'TARGET_ACHIEVED', 'TARGET_MISSED', 'COMPLETED', 'CANCELLED'],
    default: 'ACTIVE'
  },
  fallbackStatus: {
    type: String,
    enum: ['NOT_TRIGGERED', 'FALLBACK_OFFERED', 'RESOLVED'],
    default: 'NOT_TRIGGERED'
  },
  createdAt: { type: Date, default: Date.now }
});

// Virtual for count
groupDealSchema.virtual('participantCount').get(function() {
  return this.currentParticipants ? this.currentParticipants.length : 0;
});

module.exports = mongoose.model('GroupDeal', groupDealSchema);

