const mongoose = require('mongoose');

const providerSchema = new mongoose.Schema({
  businessName: { type: String, required: true },
  ownerName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  avatar: { type: String, default: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=250&q=80' },
  approvalStatus: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'approved' },
  activeStatus: { type: Boolean, default: true },
  verifiedBadge: { type: Boolean, default: true },
  rating: { type: Number, default: 4.8 },
  ratingCount: { type: Number, default: 142 },
  completedBookingsCount: { type: Number, default: 350 },
  serviceCategories: [{ type: String }], // e.g. ['AC Servicing', 'Appliance Repair']
  location: {
    address: { type: String, default: '14th Main, HSR Layout Sector 4' },
    locality: { type: String, default: 'HSR Layout' },
    city: { type: String, default: 'Bengaluru' },
    coordinates: {
      lat: { type: Number, required: true },
      lng: { type: Number, required: true }
    }
  },
  operatingRadiusKm: { type: Number, default: 15 },
  experienceYears: { type: Number, default: 6 },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Provider', providerSchema);

