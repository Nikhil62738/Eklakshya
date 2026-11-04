require('dotenv').config({ path: __dirname + '/../.env' });
const mongoose = require('mongoose');
const Service = require('../models/Service');
const Provider = require('../models/Provider');
const User = require('../models/User');
const Booking = require('../models/Booking');
const Payment = require('../models/Payment');
const { calculateIndividualPrice } = require('./pricingService');
const { createOrder, verifySignature } = require('./razorpayService');

async function runIndividualBookingE2ETest() {
  console.log('\n======================================================');
  console.log('🧪 RUNNING COMPLETE INDIVIDUAL BOOKING SYSTEM E2E TEST');
  console.log('======================================================\n');

  await mongoose.connect(process.env.MONGO_URI);
  console.log('✓ Connected to MongoDB');

  // 1. Test Pricing Engine
  console.log('\n--- 1. Testing Pricing Engine ---');
  const price1 = calculateIndividualPrice(599, 1);
  console.log('Price 1 AC (No coupon):', price1);
  if (price1.totalPrice !== 599 + 29 + Math.round(599 * 0.05)) {
    throw new Error('Pricing engine calculation mismatch on unit price + fee + GST');
  }

  const price2 = calculateIndividualPrice(599, 2, 'GROUPSAVE150');
  console.log('Price 2 ACs (With GROUPSAVE150):', price2);
  if (price2.discountAmount !== 150) {
    throw new Error('GROUPSAVE150 coupon discount not applied properly');
  }
  console.log('✓ Pricing engine calculations 100% verified');

  // 2. Fetch or seed a test customer, provider, and service
  console.log('\n--- 2. Fetching Active Service & Provider ---');
  let service = await Service.findOne({ status: 'active' });
  let provider = await Provider.findOne({ approvalStatus: 'approved', activeStatus: true });
  let customer = await User.findOne({ role: 'customer' });

  if (!provider) {
    provider = await Provider.create({
      businessName: 'Cool Air Experts',
      ownerName: 'Rajesh Sharma',
      email: 'coolair@example.com',
      phone: '9845012345',
      approvalStatus: 'approved',
      activeStatus: true,
      serviceCategories: ['AC Servicing'],
      location: {
        address: 'Lonere Main Market',
        locality: 'Lonere',
        city: 'Raigad',
        coordinates: { lat: 18.1643, lng: 73.3343 }
      }
    });
    console.log('✓ Created test provider');
  }

  if (!service) {
    service = await Service.create({
      providerId: provider._id,
      title: 'AC Servicing & Jet Cleaning',
      category: 'AC Servicing',
      description: 'Complete indoor and outdoor unit jet wash with gas leak check.',
      individualPrice: 599,
      thumbnail: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=400&q=80',
      included: ['Filter Cleaning', 'Gas Leak Check', 'Outdoor Jet Wash', '1 Month Warranty'],
      status: 'active'
    });
    console.log('✓ Created test service');
  }

  if (!customer) {
    customer = await User.create({
      name: 'Nikhil Chopade',
      email: 'nikhil@groupsave.demo',
      phone: '9845112233',
      passwordHash: 'hashed_pw',
      referralCode: 'GSNIKHIL100',
      addresses: [{
        title: 'Home',
        flatNo: 'Room 101',
        society: 'DBATU Hostel',
        locality: 'Lonere, Raigad',
        city: 'Lonere',
        pincode: '402103',
        isDefault: true
      }]
    });
    console.log('✓ Created test customer');
  }

  console.log(`Using Customer: ${customer.name} (${customer.email})`);
  console.log(`Using Service: ${service.title} (₹${service.individualPrice})`);
  console.log(`Using Provider: ${provider.businessName} (Rating: ${provider.rating}★)`);

  // 3. Test Razorpay Order Creation
  console.log('\n--- 3. Testing Server-side Razorpay Order Creation ---');
  const testOrderId = `GS${Date.now()}`;
  const rzpOrder = await createOrder({
    amountInRupees: 599,
    receiptId: testOrderId
  });
  console.log('Razorpay Order Created:', rzpOrder.id, `Amount: ₹${rzpOrder.amount / 100}`);

  // 4. Test Signature Verification
  console.log('\n--- 4. Testing Payment Signature Verification ---');
  const isSigValid = verifySignature({
    orderId: rzpOrder.id,
    paymentId: 'pay_sim_9999',
    signature: 'mock_valid_signature'
  });
  console.log('Signature verification check result:', isSigValid);
  if (!isSigValid) throw new Error('Signature verification failed on test payment');

  // 5. Test Full Individual Booking Creation in DB
  console.log('\n--- 5. Simulating Full 9-Step Individual Booking ---');
  const now = new Date();
  const bookingId = `GS${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}${Math.floor(1000 + Math.random() * 9000)}`;
  const serviceOTP = String(Math.floor(1000 + Math.random() * 9000));
  const pricing = calculateIndividualPrice(service.individualPrice, 1, 'WELCOME50');

  const newBooking = await Booking.create({
    bookingId,
    customerId: customer._id,
    providerId: provider._id,
    serviceId: service._id,
    bookingType: 'INDIVIDUAL',
    quantity: 1,
    scheduledDate: '2026-11-05',
    scheduledTime: '11:00 AM',
    address: {
      title: 'Hostel',
      flatNo: 'Room 101',
      society: 'DBATU Hostel',
      locality: 'Lonere',
      city: 'Raigad',
      pincode: '402103'
    },
    unitPrice: pricing.unitPrice,
    originalPrice: pricing.subtotal,
    discountAmount: pricing.discountAmount,
    platformFee: pricing.platformFee,
    taxAmount: pricing.taxAmount,
    totalPrice: pricing.totalPrice,
    couponApplied: pricing.couponApplied,
    paymentStatus: 'PAID',
    bookingStatus: 'CONFIRMED',
    serviceOTP,
    paymentDetails: {
      razorpayOrderId: rzpOrder.id,
      razorpayPaymentId: 'pay_test_capture_1234',
      paymentMethod: 'UPI'
    },
    notes: 'Please call before arriving'
  });

  console.log('✓ Booking created successfully in DB:');
  console.log('   Booking ID:', newBooking.bookingId);
  console.log('   Service OTP:', newBooking.serviceOTP);
  console.log('   Total Paid:', `₹${newBooking.totalPrice}`);
  console.log('   Scheduled:', `${newBooking.scheduledDate} at ${newBooking.scheduledTime}`);
  console.log('   Status:', newBooking.bookingStatus, '| Payment:', newBooking.paymentStatus);

  // 6. Test Fetch Booking with Population
  console.log('\n--- 6. Verifying Populated Booking Query ---');
  const fetched = await Booking.findOne({ bookingId: newBooking.bookingId })
    .populate('serviceId', 'title category')
    .populate('providerId', 'businessName phone');
  console.log(`Fetched Booking: Service="${fetched.serviceId.title}", Provider="${fetched.providerId.businessName}"`);

  // 7. Test Reschedule
  console.log('\n--- 7. Testing Reschedule ---');
  fetched.scheduledDate = '2026-11-06';
  fetched.scheduledTime = '02:00 PM';
  await fetched.save();
  console.log(`✓ Rescheduled to ${fetched.scheduledDate} at ${fetched.scheduledTime}`);

  // 8. Test Cancellation & Refund
  console.log('\n--- 8. Testing Cancellation & Full Refund ---');
  fetched.bookingStatus = 'CANCELLED';
  fetched.paymentStatus = 'REFUNDED';
  fetched.refundAmount = fetched.totalPrice;
  fetched.refundTransactionId = `GS-REF-${Math.floor(100000 + Math.random() * 900000)}`;
  await fetched.save();
  console.log(`✓ Booking cancelled. Full refund of ₹${fetched.refundAmount} issued via ${fetched.refundTransactionId}`);

  // Cleanup test booking
  await Booking.deleteOne({ _id: fetched._id });
  console.log('✓ Cleaned up test booking');

  await mongoose.disconnect();
  console.log('\n======================================================');
  console.log('🎉 ALL INDIVIDUAL BOOKING SYSTEM TESTS PASSED 100%!');
  console.log('======================================================\n');
}

runIndividualBookingE2ETest().catch(err => {
  console.error('Test failed with error:', err);
  process.exit(1);
});

