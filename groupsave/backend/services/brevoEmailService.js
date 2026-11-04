/**
 * Brevo (formerly Sendinblue) Transactional Email Service for GrouSave
 * Supports:
 * - OTP Verification Emails
 * - Service Booking Confirmation Emails ("service book")
 * - Service Completed & Feedback Request Emails
 * - Feedback Acknowledgment & Thank You Emails
 * - Bulk Group Deal Milestone & Fallback Emails
 */

const BREVO_API_URL = 'https://api.brevo.com/v3/smtp/email';

const getBrevoConfig = () => {
  return {
    apiKey: process.env.BREVO_API_KEY || '',
    senderName: process.env.BREVO_SENDER_NAME || 'GrouSave',
    senderEmail: process.env.BREVO_SENDER_EMAIL || 'support@groupsave.com'
  };
};

/**
 * Low-level Brevo REST API dispatcher
 */
const sendBrevoEmail = async ({ to, toName, subject, htmlContent }) => {
  const { apiKey, senderName, senderEmail } = getBrevoConfig();

  // If no API key configured or is placeholder, log gracefully without failing
  if (!apiKey || apiKey.includes('YOUR_BREVO_API_KEY') || apiKey === 'your_brevo_api_key_here') {
    console.log('\n================== [BREVO EMAIL - DEMO / LOG MODE] ==================');
    console.log(`To: ${toName || 'Customer'} <${to}>`);
    console.log(`From: ${senderName} <${senderEmail}>`);
    console.log(`Subject: ${subject}`);
    console.log('Notice: Set a valid BREVO_API_KEY in backend/.env to dispatch live emails.');
    console.log('=====================================================================\n');
    return {
      success: true,
      mode: 'mock',
      message: 'Email logged in console. Set BREVO_API_KEY in .env for live delivery.'
    };
  }

  try {
    const response = await fetch(BREVO_API_URL, {
      method: 'POST',
      headers: {
        'api-key': apiKey,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        sender: {
          name: senderName,
          email: senderEmail
        },
        to: [
          {
            email: to,
            name: toName || 'Valued Customer'
          }
        ],
        subject: subject,
        htmlContent: htmlContent
      })
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('[Brevo Error Response]:', data);
      return {
        success: false,
        error: data.message || 'Failed to dispatch email via Brevo'
      };
    }

    console.log(`[Brevo Email Sent] MessageId: ${data.messageId} to ${to}`);
    return {
      success: true,
      messageId: data.messageId
    };
  } catch (error) {
    console.error('[Brevo Network Error]:', error.message);
    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * Standard Email Shell with GrouSave Branding
 */
const renderEmailLayout = ({ title, preheader, content }) => {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      background-color: #F7F9F8;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      color: #172B26;
      -webkit-font-smoothing: antialiased;
    }
    .wrapper {
      width: 100%;
      background-color: #F7F9F8;
      padding: 30px 10px;
    }
    .container {
      max-width: 580px;
      margin: 0 auto;
      background-color: #FFFFFF;
      border-radius: 16px;
      overflow: hidden;
      border: 1px solid #E5E7EB;
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.04);
    }
    .header {
      background: linear-gradient(135deg, #075B46 0%, #064E3B 100%);
      padding: 28px 24px;
      text-align: center;
      color: #FFFFFF;
    }
    .logo-badge {
      display: inline-block;
      font-size: 26px;
      font-weight: 800;
      letter-spacing: -0.5px;
      color: #FFFFFF;
      margin: 0;
    }
    .tagline {
      font-size: 13px;
      color: #DDF5EA;
      margin-top: 4px;
      letter-spacing: 0.5px;
    }
    .body-content {
      padding: 32px 28px;
    }
    .footer {
      background-color: #F9FAFB;
      padding: 24px;
      text-align: center;
      font-size: 12px;
      color: #718078;
      border-top: 1px solid #F0F2F1;
    }
    .btn {
      display: inline-block;
      background-color: #075B46;
      color: #FFFFFF !important;
      font-weight: 700;
      font-size: 15px;
      text-decoration: none;
      padding: 13px 28px;
      border-radius: 8px;
      margin-top: 20px;
    }
    .otp-code {
      font-size: 34px;
      font-weight: 800;
      letter-spacing: 6px;
      color: #075B46;
      background-color: #DDF5EA;
      padding: 14px 24px;
      border-radius: 10px;
      display: inline-block;
      margin: 16px 0;
    }
    .card {
      background-color: #F8FAF9;
      border: 1px solid #E6ECE9;
      border-radius: 12px;
      padding: 18px;
      margin: 18px 0;
    }
    .row {
      display: flex;
      justify-content: space-between;
      margin-bottom: 8px;
      font-size: 14px;
    }
    .label {
      color: #718078;
    }
    .value {
      font-weight: 600;
      color: #172B26;
    }
    .star-btn {
      display: inline-block;
      background-color: #FEF3C7;
      color: #D97706 !important;
      font-size: 18px;
      padding: 8px 14px;
      border-radius: 6px;
      text-decoration: none;
      margin: 0 4px;
      font-weight: bold;
    }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="container">
      <!-- Header -->
      <div class="header">
        <div class="logo-badge">GrouSave</div>
        <div class="tagline">Local Services Better Together • Book Together. Save More.</div>
      </div>

      <!-- Main Body -->
      <div class="body-content">
        ${content}
      </div>

      <!-- Footer -->
      <div class="footer">
        <p style="margin: 0 0 6px 0;"><strong>GrouSave Marketplace</strong></p>
        <p style="margin: 0 0 10px 0;">Hyperlocal Group-Buying & Verified Local Home Services</p>
        <p style="margin: 0; font-size: 11px; color: #9CA3AF;">
          You received this email because of your account activity on GrouSave. Need help? Contact us at support@groupsave.com
        </p>
      </div>
    </div>
  </div>
</body>
</html>
`;
};

// ============================================================================
// 1. OTP EMAIL
// ============================================================================
const sendOtpEmail = async ({ to, name, otp, purpose = 'Verification' }) => {
  const content = `
    <h2 style="color: #172B26; margin-top: 0;">Hello ${name || 'Neighbor'}!</h2>
    <p style="font-size: 15px; line-height: 1.5; color: #4B5563;">
      Use the one-time verification code below for your GrouSave account ${purpose.toLowerCase()}:
    </p>

    <div style="text-align: center; margin: 24px 0;">
      <div class="otp-code">${otp}</div>
      <p style="font-size: 13px; color: #718078; margin-top: 8px;">
        ⏱️ This code is valid for <strong>10 minutes</strong>.
      </p>
    </div>

    <p style="font-size: 13px; color: #9CA3AF; line-height: 1.5; border-top: 1px solid #F0F2F1; padding-top: 16px;">
      🔒 Security note: GrouSave staff will never ask you for this OTP over call, SMS, or WhatsApp. If you did not request this code, please ignore this email.
    </p>
  `;

  return sendBrevoEmail({
    to,
    toName: name,
    subject: `${otp} is your GrouSave ${purpose} Code`,
    htmlContent: renderEmailLayout({
      title: `Your GrouSave ${purpose} Code`,
      content
    })
  });
};

// ============================================================================
// 2. BOOKING CONFIRMATION EMAIL ("Service Book")
// ============================================================================
const sendBookingConfirmationEmail = async ({
  to,
  name,
  bookingId,
  serviceName,
  bookingType,
  providerName,
  scheduledDate,
  scheduledTime,
  address,
  totalPrice,
  discountAmount,
  serviceOTP
}) => {
  const isGroup = bookingType === 'GROUP';

  const content = `
    <div style="text-align: center; margin-bottom: 24px;">
      <div style="display: inline-block; background-color: #DDF5EA; color: #075B46; padding: 6px 14px; border-radius: 20px; font-weight: 700; font-size: 13px; margin-bottom: 12px;">
        ✓ BOOKING CONFIRMED
      </div>
      <h2 style="color: #172B26; margin: 0 0 6px 0;">Your Service is Booked!</h2>
      <p style="font-size: 14px; color: #718078; margin: 0;">Booking ID: <strong style="color: #075B46;">${bookingId}</strong></p>
    </div>

    <div class="card">
      <div style="border-bottom: 1px solid #E5E7EB; padding-bottom: 12px; margin-bottom: 12px;">
        <h3 style="margin: 0 0 4px 0; color: #172B26; font-size: 17px;">${serviceName}</h3>
        <p style="margin: 0; font-size: 13px; color: #718078;">
          Type: <span style="font-weight: 600; color: #075B46;">${isGroup ? 'Bulk / Group Deal' : 'Individual Booking'}</span>
        </p>
      </div>

      <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
        <tr>
          <td style="padding: 6px 0; color: #718078;">Service Provider:</td>
          <td style="padding: 6px 0; font-weight: 600; text-align: right; color: #172B26;">${providerName}</td>
        </tr>
        <tr>
          <td style="padding: 6px 0; color: #718078;">Date & Time:</td>
          <td style="padding: 6px 0; font-weight: 600; text-align: right; color: #172B26;">${scheduledDate}, ${scheduledTime}</td>
        </tr>
        <tr>
          <td style="padding: 6px 0; color: #718078;">Service Address:</td>
          <td style="padding: 6px 0; font-weight: 600; text-align: right; color: #172B26;">
            ${typeof address === 'object' ? `${address.flatNo || ''}, ${address.society || ''}, ${address.locality || ''}` : address}
          </td>
        </tr>
        ${discountAmount ? `
        <tr>
          <td style="padding: 6px 0; color: #059669;">Discount / Savings:</td>
          <td style="padding: 6px 0; font-weight: 600; text-align: right; color: #059669;">-₹${discountAmount}</td>
        </tr>
        ` : ''}
        <tr style="border-top: 1px dashed #D1D5DB;">
          <td style="padding: 10px 0; font-weight: 700; color: #172B26; font-size: 16px;">Total Amount Paid:</td>
          <td style="padding: 10px 0; font-weight: 800; text-align: right; color: #075B46; font-size: 18px;">₹${totalPrice}</td>
        </tr>
      </table>
    </div>

    <!-- Service Verification OTP for technician -->
    ${serviceOTP ? `
    <div style="background-color: #FEF3C7; border: 1px solid #FCD34D; border-radius: 10px; padding: 14px 18px; margin: 20px 0; text-align: center;">
      <p style="margin: 0 0 6px 0; font-size: 13px; color: #92400E; font-weight: 600;">
        🔑 SERVICE START CODE
      </p>
      <div style="font-size: 24px; font-weight: 800; color: #92400E; letter-spacing: 4px;">${serviceOTP}</div>
      <p style="margin: 6px 0 0 0; font-size: 12px; color: #B45309;">
        Share this code with the technician only when they arrive at your location.
      </p>
    </div>
    ` : ''}

    <div style="text-align: center; margin-top: 24px;">
      <p style="font-size: 14px; color: #4B5563; margin-bottom: 8px;">
        Need to contact your service provider or track arrival?
      </p>
      <a href="https://groupsave.app/bookings/${bookingId}" class="btn">View Booking Details</a>
    </div>
  `;

  return sendBrevoEmail({
    to,
    toName: name,
    subject: `Booking Confirmed: ${serviceName} (#${bookingId})`,
    htmlContent: renderEmailLayout({
      title: `Booking Confirmed - ${serviceName}`,
      content
    })
  });
};

// ============================================================================
// 3. SERVICE COMPLETED & FEEDBACK REQUEST EMAIL
// ============================================================================
const sendServiceCompletedFeedbackEmail = async ({
  to,
  name,
  bookingId,
  serviceName,
  providerName
}) => {
  const content = `
    <div style="text-align: center; margin-bottom: 24px;">
      <div style="display: inline-block; background-color: #DDF5EA; color: #075B46; padding: 6px 14px; border-radius: 20px; font-weight: 700; font-size: 13px; margin-bottom: 12px;">
        ✓ SERVICE COMPLETED
      </div>
      <h2 style="color: #172B26; margin: 0 0 8px 0;">How was your service experience?</h2>
      <p style="font-size: 14px; color: #718078; margin: 0;">
        Your service for <strong>${serviceName}</strong> with <strong>${providerName}</strong> has been completed.
      </p>
    </div>

    <div class="card" style="text-align: center;">
      <p style="font-size: 15px; font-weight: 600; color: #172B26; margin-top: 4px;">
        Tap a star to rate your technician:
      </p>

      <div style="margin: 18px 0;">
        <a href="https://groupsave.app/review/${bookingId}?rating=1" class="star-btn">★ 1</a>
        <a href="https://groupsave.app/review/${bookingId}?rating=2" class="star-btn">★ 2</a>
        <a href="https://groupsave.app/review/${bookingId}?rating=3" class="star-btn">★ 3</a>
        <a href="https://groupsave.app/review/${bookingId}?rating=4" class="star-btn">★ 4</a>
        <a href="https://groupsave.app/review/${bookingId}?rating=5" class="star-btn">★ 5</a>
      </div>

      <p style="font-size: 13px; color: #6B7280; margin-bottom: 4px;">
        ⭐⭐⭐⭐⭐ 5 Stars = Excellent & Professional
      </p>
    </div>

    <div style="text-align: center; margin-top: 24px;">
      <p style="font-size: 14px; color: #4B5563;">
        Your honest feedback helps neighbors in your society choose verified providers and ensures top service quality.
      </p>
      <a href="https://groupsave.app/review/${bookingId}" class="btn">Write Detailed Review</a>
    </div>
  `;

  return sendBrevoEmail({
    to,
    toName: name,
    subject: `How was your ${serviceName}? Rate your technician`,
    htmlContent: renderEmailLayout({
      title: `Service Feedback - ${serviceName}`,
      content
    })
  });
};

// ============================================================================
// 4. FEEDBACK RECEIVED & THANK YOU EMAIL
// ============================================================================
const sendFeedbackReceivedEmail = async ({
  to,
  name,
  bookingId,
  serviceName,
  providerName,
  rating,
  reviewText
}) => {
  const content = `
    <div style="text-align: center; margin-bottom: 24px;">
      <div style="display: inline-block; background-color: #FEF3C7; color: #D97706; padding: 6px 14px; border-radius: 20px; font-weight: 700; font-size: 13px; margin-bottom: 12px;">
        ⭐ REVIEW SUBMITTED
      </div>
      <h2 style="color: #172B26; margin: 0 0 8px 0;">Thank You for Your Feedback!</h2>
      <p style="font-size: 14px; color: #718078; margin: 0;">
        We appreciate you taking the time to review your service.
      </p>
    </div>

    <div class="card">
      <div class="row">
        <span class="label">Service:</span>
        <span class="value">${serviceName}</span>
      </div>
      <div class="row">
        <span class="label">Provider:</span>
        <span class="value">${providerName}</span>
      </div>
      <div class="row">
        <span class="label">Your Rating:</span>
        <span class="value" style="color: #D97706; font-size: 16px;">
          ${'★'.repeat(Number(rating) || 5)}${'☆'.repeat(Math.max(0, 5 - (Number(rating) || 5)))} (${rating}/5)
        </span>
      </div>
      ${reviewText ? `
      <div style="margin-top: 12px; padding-top: 12px; border-top: 1px dashed #E5E7EB;">
        <span class="label">Your Comment:</span>
        <p style="margin: 6px 0 0 0; font-size: 14px; color: #374151; font-style: italic;">
          "${reviewText}"
        </p>
      </div>
      ` : ''}
    </div>

    <div style="background-color: #DDF5EA; border-radius: 10px; padding: 16px; margin: 20px 0; text-align: center;">
      <p style="margin: 0; font-weight: 700; color: #075B46; font-size: 15px;">
        🎁 You've earned +50 GrouSave Loyalty Points!
      </p>
      <p style="margin: 4px 0 0 0; font-size: 13px; color: #0F8B68;">
        Use them for extra discounts on your next community booking.
      </p>
    </div>

    <div style="text-align: center; margin-top: 20px;">
      <a href="https://groupsave.app" class="btn">Explore More Deals</a>
    </div>
  `;

  return sendBrevoEmail({
    to,
    toName: name,
    subject: `Thank you for reviewing ${serviceName}! ⭐`,
    htmlContent: renderEmailLayout({
      title: `Feedback Acknowledgment`,
      content
    })
  });
};

// ============================================================================
// 5. BULK DEAL TARGET ACHIEVED OR FALLBACK NOTIFICATIONS
// ============================================================================
const sendGroupDealTargetAchievedEmail = async ({
  to,
  name,
  serviceName,
  unlockedPrice,
  participantCount
}) => {
  const content = `
    <div style="text-align: center; margin-bottom: 24px;">
      <div style="display: inline-block; background-color: #DDF5EA; color: #075B46; padding: 6px 14px; border-radius: 20px; font-weight: 700; font-size: 13px; margin-bottom: 12px;">
        🎉 GROUP GOAL ACHIEVED!
      </div>
      <h2 style="color: #172B26; margin: 0 0 8px 0;">Bulk Discount Unlocked!</h2>
      <p style="font-size: 14px; color: #718078;">
        Enough neighbors joined the group deal for <strong>${serviceName}</strong>.
      </p>
    </div>

    <div class="card" style="text-align: center;">
      <p style="font-size: 14px; color: #718078; margin: 0;">Locked-in Group Price</p>
      <div style="font-size: 32px; font-weight: 800; color: #075B46; margin: 6px 0;">₹${unlockedPrice}</div>
      <p style="font-size: 13px; color: #059669; font-weight: 600; margin: 0;">
        ${participantCount} neighbors booked together!
      </p>
    </div>

    <div style="text-align: center; margin-top: 20px;">
      <a href="https://groupsave.app" class="btn">View Deal Status</a>
    </div>
  `;

  return sendBrevoEmail({
    to,
    toName: name,
    subject: `Discount Unlocked! Group Deal for ${serviceName}`,
    htmlContent: renderEmailLayout({
      title: 'Group Deal Target Achieved',
      content
    })
  });
};

module.exports = {
  sendBrevoEmail,
  sendOtpEmail,
  sendBookingConfirmationEmail,
  sendServiceCompletedFeedbackEmail,
  sendFeedbackReceivedEmail,
  sendGroupDealTargetAchievedEmail
};

