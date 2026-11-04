const mongoose = require('mongoose');

const pricingTierSchema = new mongoose.Schema({
  minGroupSize: { type: Number, required: true },
  maxGroupSize: { type: Number, required: true },
  discountedPrice: { type: Number, required: true },
  discountPercent: { type: Number, required: true }
});

const serviceSchema = new mongoose.Schema({
  providerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Provider', required: true },
  title: { type: String, required: true },
  category: { 
    type: String, 
    required: true,
    enum: [
      'AC Servicing',
      'Home Cleaning',
      'Electrician',
      'Plumbing',
      'Salon & Beauty',
      'Car Wash',
      'Pest Control',
      'Laundry',
      'Carpenter',
      'Home Painting',
      'Appliance Repair',
      'Other Services'
    ]
  },
  description: { type: String, required: true },
  individualPrice: { type: Number, required: true },
  estimatedDuration: { type: String, default: '60-90 mins' },
  groupPricingTiers: [pricingTierSchema],
  images: [{ type: String }],
  thumbnail: { type: String, required: true },
  included: [{ type: String }],
  excluded: [{ type: String }],
  warranty: { type: String, default: '30-Day Service Guarantee' },
  cancellationPolicy: { type: String, default: 'Free cancellation up to 4 hours before service appointment.' },
  rating: { type: Number, default: 4.8 },
  reviewCount: { type: Number, default: 86 },
  availability: {
    days: { type: [String], default: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] },
    timeSlots: { type: [String], default: ['09:00 AM', '11:00 AM', '02:00 PM', '04:00 PM', '06:00 PM'] }
  },
  status: { type: String, enum: ['active', 'inactive', 'draft'], default: 'active' },
  popular: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Service', serviceSchema);

