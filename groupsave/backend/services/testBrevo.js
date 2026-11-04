require('dotenv').config({ path: __dirname + '/../.env' });
const {
  sendOtpEmail,
  sendBookingConfirmationEmail,
  sendServiceCompletedFeedbackEmail,
  sendFeedbackReceivedEmail
} = require('./brevoEmailService');

async function testAllEmails() {
  const targetEmail = process.argv[2] || process.env.TEST_EMAIL || 'test@groupsave.demo';
  const name = 'Nikhil Chopade';

  console.log(`\n======================================================`);
  console.log(`Testing GrouSave Brevo Email Service for: ${targetEmail}`);
  console.log(`Brevo API Key: ${process.env.BREVO_API_KEY ? 'Configured (' + process.env.BREVO_API_KEY.slice(0, 8) + '...)' : 'Not set (Demo mode)'}`);
  console.log(`======================================================\n`);

  // 1. Test OTP Email
  console.log('1. Sending OTP Verification Email...');
  const otpRes = await sendOtpEmail({
    to: targetEmail,
    name,
    otp: '482910',
    purpose: 'Sign Up Verification'
  });
  console.log('   Result:', otpRes);

  // 2. Test Booking Confirmation Email
  console.log('\n2. Sending Service Booking Confirmation Email...');
  const bookingRes = await sendBookingConfirmationEmail({
    to: targetEmail,
    name,
    bookingId: 'GS20250921001',
    serviceName: 'AC Servicing & Jet Cleaning',
    bookingType: 'GROUP',
    providerName: 'Cool Air Experts (4.8 ★)',
    scheduledDate: '21 Sep 2026',
    scheduledTime: '10:00 AM - 12:00 PM',
    address: {
      flatNo: 'Room 101',
      society: 'DBATU Hostel',
      locality: 'Lonere, Raigad'
    },
    totalPrice: 599,
    discountAmount: 200,
    serviceOTP: '4829'
  });
  console.log('   Result:', bookingRes);

  // 3. Test Service Completed & Feedback Email
  console.log('\n3. Sending Service Completed & Feedback Request Email...');
  const feedbackReqRes = await sendServiceCompletedFeedbackEmail({
    to: targetEmail,
    name,
    bookingId: 'GS20250921001',
    serviceName: 'AC Servicing & Jet Cleaning',
    providerName: 'Cool Air Experts'
  });
  console.log('   Result:', feedbackReqRes);

  // 4. Test Feedback Received Acknowledgment Email
  console.log('\n4. Sending Feedback Received Acknowledgment Email...');
  const feedbackAckRes = await sendFeedbackReceivedEmail({
    to: targetEmail,
    name,
    bookingId: 'GS20250921001',
    serviceName: 'AC Servicing & Jet Cleaning',
    providerName: 'Cool Air Experts',
    rating: 5,
    reviewText: 'The technician arrived right on time and cleaned the AC blower filters very thoroughly!'
  });
  console.log('   Result:', feedbackAckRes);

  console.log('\n======================================================');
  console.log('All 4 GrouSave email templates executed successfully!');
  console.log('======================================================\n');
}

testAllEmails().catch(err => {
  console.error('Test script error:', err);
});

