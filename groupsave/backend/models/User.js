const mongoose = require('mongoose');

const addressSchema = new mongoose.Schema({
  title: { type: String, default: 'Home' }, // Home, Work, Society
  flatNo: { type: String, required: true },
  society: { type: String, required: true }, // e.g. Prestige Falcon City
  locality: { type: String, required: true }, // e.g. Kanakapura Road
  city: { type: String, default: 'Bengaluru' },
  pincode: { type: String, default: '560062' },
  coordinates: {
    lat: { type: Number, default: 12.8912 },
    lng: { type: Number, default: 77.5683 }
  },
  isDefault: { type: Boolean, default: false }
});

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  phone: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  role: { type: String, enum: ['customer', 'provider', 'admin'], default: 'customer' },
  addresses: [addressSchema],
  avatar: { type: String, default: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80' },
  referralCode: { type: String, unique: true },
  referredBy: { type: String, default: null },
  loyaltyPoints: { type: Number, default: 150 },
  walletBalance: { type: Number, default: 100 },
  
  // Brevo Email OTP Verification Fields
  otp: { type: String, default: null },
  otpExpires: { type: Date, default: null },

  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);
