/**
 * GroupSave — Idempotent Seed Script
 * Creates (or upserts) 1 test customer, 1 test provider, and 2 test services
 * using realistic Lonere / DBATU data.
 *
 * Run:  node services/seedData.js
 */

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config({ path: __dirname + '/../.env' });

const connectDB = require('../config/db');
const User = require('../models/User');
const Provider = require('../models/Provider');
const Service = require('../models/Service');

// ─── Seed Data Constants ───────────────────────────────────────────────────────

const TEST_USER = {
  name: 'Nikhil Chopade',
  email: 'nikhil@groupsave.demo',
  phone: '9876543210',
  plainPassword: 'Test@123',
  role: 'customer',
  referralCode: 'GSNIKHIL01',
  loyaltyPoints: 150,
  walletBalance: 100,
  addresses: [
    {
      title: 'Hostel',
      flatNo: 'Room 101',
      society: 'DBATU Hostel',
      locality: 'Lonere, Raigad',
      city: 'Lonere',
      pincode: '402103',
      coordinates: { lat: 18.4507, lng: 73.4387 },
      isDefault: true
    }
  ]
};

const TEST_PROVIDER = {
  businessName: 'Cool Air Experts',
  ownerName: 'Rajesh Patil',
  email: 'coolair@groupsave.demo',
  phone: '9988776655',
  approvalStatus: 'approved',
  activeStatus: true,
  verifiedBadge: true,
  rating: 4.8,
  ratingCount: 142,
  completedBookingsCount: 350,
  serviceCategories: ['AC Servicing', 'Home Cleaning'],
  location: {
    address: 'Near DBATU Main Gate, Lonere',
    locality: 'Lonere',
    city: 'Raigad',
    coordinates: { lat: 18.4507, lng: 73.4387 }
  },
  operatingRadiusKm: 20,
  experienceYears: 6
};

// ─── Main ──────────────────────────────────────────────────────────────────────

async function seed() {
  console.log('\n══════════════════════════════════════════════════');
  console.log('  🌱  GroupSave Idempotent Seed Script');
  console.log('══════════════════════════════════════════════════\n');

  await connectDB();

  // ── 1. User ──────────────────────────────────────────────────────────────────
  console.log('[Seed] Upserting test customer …');
  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash(TEST_USER.plainPassword, salt);

  const user = await User.findOneAndUpdate(
    { email: TEST_USER.email },
    {
      $set: {
        name: TEST_USER.name,
        phone: TEST_USER.phone,
        passwordHash,
        role: TEST_USER.role,
        referralCode: TEST_USER.referralCode,
        loyaltyPoints: TEST_USER.loyaltyPoints,
        walletBalance: TEST_USER.walletBalance,
        addresses: TEST_USER.addresses
      }
    },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );
  console.log(`  ✓ User  : ${user.name} (${user.email})  →  _id = ${user._id}`);

  // ── 2. Provider ──────────────────────────────────────────────────────────────
  console.log('[Seed] Upserting test provider …');
  const provider = await Provider.findOneAndUpdate(
    { email: TEST_PROVIDER.email },
    { $set: TEST_PROVIDER },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );
  console.log(`  ✓ Provider: ${provider.businessName} (${provider.ownerName})  →  _id = ${provider._id}`);

  // ── 3. Service 1 — AC Deep Cleaning & Service ────────────────────────────────
  console.log('[Seed] Upserting Service 1 …');
  const service1 = await Service.findOneAndUpdate(
    { title: 'AC Deep Cleaning & Service', providerId: provider._id },
    {
      $set: {
        providerId: provider._id,
        title: 'AC Deep Cleaning & Service',
        category: 'AC Servicing',
        description:
          'Complete high-pressure jet wash of indoor evaporator coils, blower wheel, drain tray, and outdoor condenser unit. Includes gas pressure check with digital multimeter. Boosts cooling by up to 40% and reduces electricity bills.',
        individualPrice: 599,
        estimatedDuration: '60-90 mins',
        groupPricingTiers: [
          { minGroupSize: 5, maxGroupSize: 9, discountedPrice: 549, discountPercent: 8 },
          { minGroupSize: 10, maxGroupSize: 19, discountedPrice: 499, discountPercent: 17 },
          { minGroupSize: 20, maxGroupSize: 50, discountedPrice: 449, discountPercent: 25 }
        ],
        images: [
          'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=800&q=80'
        ],
        thumbnail:
          'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=800&q=80',
        included: [
          'High-pressure jet wash of indoor coils and filters',
          'Outdoor condenser unit dust purge',
          'Drain pipe clearing to prevent water leakage',
          'Gas pressure & amp check with digital multimeter',
          'Cooling performance test (before vs after)'
        ],
        excluded: [
          'Spare parts replacement or copper piping fixes',
          'Gas top-up / refrigerant refill (charged extra if needed)'
        ],
        warranty: '30-Day Service Guarantee',
        rating: 4.8,
        reviewCount: 86,
        status: 'active',
        popular: true
      }
    },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );
  console.log(`  ✓ Service 1: "${service1.title}" (₹${service1.individualPrice})  →  _id = ${service1._id}`);

  // ── 4. Service 2 — Home Deep Cleaning ────────────────────────────────────────
  console.log('[Seed] Upserting Service 2 …');
  const service2 = await Service.findOneAndUpdate(
    { title: 'Home Deep Cleaning', providerId: provider._id },
    {
      $set: {
        providerId: provider._id,
        title: 'Home Deep Cleaning',
        category: 'Home Cleaning',
        description:
          'Comprehensive mechanized deep cleaning of your entire home — kitchen degreasing, bathroom descaling, balcony wash, dry vacuuming of upholstery, and motorized floor scrubbing using Diversey-grade chemicals.',
        individualPrice: 799,
        estimatedDuration: '3-4 hours',
        groupPricingTiers: [
          { minGroupSize: 5, maxGroupSize: 9, discountedPrice: 699, discountPercent: 13 },
          { minGroupSize: 10, maxGroupSize: 19, discountedPrice: 649, discountPercent: 19 },
          { minGroupSize: 20, maxGroupSize: 50, discountedPrice: 599, discountPercent: 25 }
        ],
        images: [
          'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=800&q=80'
        ],
        thumbnail:
          'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=800&q=80',
        included: [
          'Single-disc machine floor scrubbing',
          'Kitchen slab & chimney exterior degreasing',
          'Bathroom tile grout & toilet bowl descaling',
          'Window pane & balcony grill cleaning',
          'Fan, light & switchboard dusting'
        ],
        excluded: [
          'Interior appliance cleaning (fridge inside, oven inside)',
          'Heavy furniture lifting beyond safe limits'
        ],
        warranty: '24-Hour Satisfaction Re-clean Guarantee',
        rating: 4.7,
        reviewCount: 64,
        status: 'active',
        popular: false
      }
    },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );
  console.log(`  ✓ Service 2: "${service2.title}" (₹${service2.individualPrice})  →  _id = ${service2._id}`);

  // ── Summary ──────────────────────────────────────────────────────────────────
  console.log('\n══════════════════════════════════════════════════');
  console.log('  🎉  Seed Complete — Created IDs');
  console.log('══════════════════════════════════════════════════');
  console.log(`  User      : ${user._id}`);
  console.log(`  Provider  : ${provider._id}`);
  console.log(`  Service 1 : ${service1._id}  (AC Deep Cleaning & Service)`);
  console.log(`  Service 2 : ${service2._id}  (Home Deep Cleaning)`);
  console.log('══════════════════════════════════════════════════\n');

  await mongoose.disconnect();
  console.log('[Seed] Disconnected from MongoDB. Done.\n');
}

seed().catch(err => {
  console.error('[Seed Error]', err);
  process.exit(1);
});
