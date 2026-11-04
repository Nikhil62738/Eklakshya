const Booking = require('../models/Booking');
const Service = require('../models/Service');
const Provider = require('../models/Provider');
const GroupDeal = require('../models/GroupDeal');
const Payment = require('../models/Payment');
const Review = require('../models/Review');
const {
  sendBookingConfirmationEmail,
  sendServiceCompletedFeedbackEmail,
  sendFeedbackReceivedEmail,
  sendGroupDealTargetAchievedEmail
} = require('../services/brevoEmailService');

const generateBookingId = (type) => {
  const prefix = type === 'GROUP' ? 'GS-GRP' : 'GS-IND';
  const year = new Date().getFullYear();
  const randomNum = Math.floor(1000 + Math.random() * 9000);
  return `${prefix}-${year}-${randomNum}`;
};

// @desc    Create Individual Booking
// @route   POST /api/bookings/individual
exports.createIndividualBooking = async (req, res) => {
  try {
    const {
      serviceId,
      providerId,
      quantity = 1,
      scheduledDate,
      scheduledTime,
      address,
      couponCode,
      paymentMethod = 'UPI',
      notes
    } = req.body;

    const service = await Service.findById(serviceId);
    if (!service) {
      return res.status(404).json({ success: false, message: 'Service not found' });
    }

    const provider = await Provider.findById(providerId || service.providerId);
    if (!provider || provider.approvalStatus !== 'approved' || !provider.activeStatus) {
      return res.status(400).json({ success: false, message: 'Provider is not available or unapproved' });
    }

    const unitPrice = service.individualPrice;
    const subtotal = unitPrice * Number(quantity);
    let discount = 0;

    // Coupon calculation
    if (couponCode === 'GROUPSAVE150') {
      discount = 150;
    } else if (couponCode === 'WELCOME50') {
      discount = 50;
    } else if (couponCode === 'NEIGHBOR20') {
      discount = Math.round(subtotal * 0.2);
    }

    const platformFee = 29;
    const taxAmount = Math.round((subtotal - discount) * 0.05); // 5% GST
    const totalPrice = Math.max(0, subtotal - discount + platformFee + taxAmount);

    const bookingId = generateBookingId('INDIVIDUAL');

    // Create Booking
    const booking = await Booking.create({
      bookingId,
      customerId: req.user._id,
      providerId: provider._id,
      serviceId: service._id,
      bookingType: 'INDIVIDUAL',
      quantity: Number(quantity),
      scheduledDate,
      scheduledTime,
      address,
      unitPrice,
      originalPrice: subtotal,
      discountAmount: discount,
      platformFee,
      taxAmount,
      totalPrice,
      couponApplied: couponCode || null,
      paymentStatus: 'PAID',
      bookingStatus: 'CONFIRMED',
      serviceOTP: Math.floor(1000 + Math.random() * 9000).toString(),
      paymentDetails: {
        razorpayOrderId: `order_${Math.random().toString(36).substring(2, 12)}`,
        razorpayPaymentId: `pay_${Math.random().toString(36).substring(2, 14)}`,
        paymentMethod
      },
      notes: notes || ''
    });

    // Create Payment Record
    await Payment.create({
      bookingId: booking.bookingId,
      customerId: req.user._id,
      razorpayOrderId: booking.paymentDetails.razorpayOrderId,
      razorpayPaymentId: booking.paymentDetails.razorpayPaymentId,
      amount: totalPrice,
      paymentMethod,
      paymentStatus: 'CAPTURED'
    });

    // Dispatch Brevo Booking Confirmation Email
    if (req.user?.email) {
      sendBookingConfirmationEmail({
        to: req.user.email,
        name: req.user.name,
        bookingId: booking.bookingId,
        serviceName: service.title,
        bookingType: 'INDIVIDUAL',
        providerName: provider.businessName,
        scheduledDate,
        scheduledTime,
        address,
        totalPrice,
        discountAmount: discount,
        serviceOTP: booking.serviceOTP
      }).catch(err => console.error('[Brevo Booking Email Error]:', err.message));
    }

    res.status(201).json({
      success: true,
      message: 'Individual booking confirmed successfully!',
      booking
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Join or Create a Group Booking
// @route   POST /api/bookings/group
exports.createGroupBooking = async (req, res) => {
  try {
    const {
      groupDealId,
      quantity = 1,
      address,
      paymentMethod = 'UPI',
      notes
    } = req.body;

    const deal = await GroupDeal.findById(groupDealId).populate('serviceId').populate('providerId');
    if (!deal) {
      return res.status(404).json({ success: false, message: 'Group deal not found' });
    }

    if (deal.status === 'COMPLETED' || deal.status === 'CANCELLED') {
      return res.status(400).json({ success: false, message: 'This group deal is no longer active' });
    }

    if (deal.currentParticipants.length >= deal.maximumGroupSize) {
      return res.status(400).json({ success: false, message: 'Group is already at maximum capacity' });
    }

    // Check if user already joined this group deal
    const alreadyJoined = deal.currentParticipants.some(p => p.userId.toString() === req.user._id.toString());
    if (alreadyJoined) {
      return res.status(400).json({ success: false, message: 'You have already joined this group deal!' });
    }

    const bookingId = generateBookingId('GROUP');
    const unitPrice = deal.currentGroupPrice;
    const subtotal = unitPrice * Number(quantity);
    const platformFee = 29;
    const taxAmount = Math.round(subtotal * 0.05);
    const totalPrice = subtotal + platformFee + taxAmount;
    const regularSubtotal = deal.regularPrice * Number(quantity);
    const discount = Math.max(0, regularSubtotal - subtotal);

    // Create group booking
    const booking = await Booking.create({
      bookingId,
      customerId: req.user._id,
      providerId: deal.providerId._id,
      serviceId: deal.serviceId._id,
      bookingType: 'GROUP',
      groupDealId: deal._id,
      quantity: Number(quantity),
      scheduledDate: deal.serviceDate.split(',')[0] || deal.serviceDate,
      scheduledTime: deal.serviceDate.split(',')[1] || '10:00 AM - 01:00 PM',
      address,
      unitPrice,
      originalPrice: regularSubtotal,
      discountAmount: discount,
      platformFee,
      taxAmount,
      totalPrice,
      paymentStatus: 'PAID',
      bookingStatus: 'CONFIRMED',
      serviceOTP: Math.floor(1000 + Math.random() * 9000).toString(),
      paymentDetails: {
        razorpayOrderId: `order_grp_${Math.random().toString(36).substring(2, 10)}`,
        razorpayPaymentId: `pay_grp_${Math.random().toString(36).substring(2, 12)}`,
        paymentMethod
      },
      notes: notes || ''
    });

    // Add customer to group deal participants
    deal.currentParticipants.push({
      userId: req.user._id,
      name: req.user.name,
      society: address.society || 'Local Society',
      flatNo: address.flatNo || '',
      quantity: Number(quantity),
      bookingId: booking.bookingId,
      joinedAt: new Date(),
      status: 'JOINED'
    });

    // Check if minimum target achieved
    if (deal.currentParticipants.length >= deal.minimumGroupSize && deal.status === 'ACTIVE') {
      deal.status = 'TARGET_ACHIEVED';
    }

    await deal.save();

    // Create payment entry
    await Payment.create({
      bookingId: booking.bookingId,
      customerId: req.user._id,
      razorpayOrderId: booking.paymentDetails.razorpayOrderId,
      razorpayPaymentId: booking.paymentDetails.razorpayPaymentId,
      amount: totalPrice,
      paymentMethod,
      paymentStatus: 'CAPTURED'
    });

    // Dispatch Brevo Group Booking Confirmation Email
    if (req.user?.email) {
      sendBookingConfirmationEmail({
        to: req.user.email,
        name: req.user.name,
        bookingId: booking.bookingId,
        serviceName: deal.serviceId?.title || 'Group Home Service',
        bookingType: 'GROUP',
        providerName: deal.providerId?.businessName || 'Verified Provider',
        scheduledDate: booking.scheduledDate,
        scheduledTime: booking.scheduledTime,
        address,
        totalPrice,
        discountAmount: discount,
        serviceOTP: booking.serviceOTP
      }).catch(err => console.error('[Brevo Group Booking Email Error]:', err.message));

      if (deal.status === 'TARGET_ACHIEVED') {
        sendGroupDealTargetAchievedEmail({
          to: req.user.email,
          name: req.user.name,
          serviceName: deal.serviceId?.title || 'Group Service',
          unlockedPrice: deal.currentGroupPrice,
          participantCount: deal.currentParticipants.length
        }).catch(err => console.error('[Brevo Target Achieved Email Error]:', err.message));
      }
    }

    res.status(201).json({
      success: true,
      message: 'Joined group deal successfully! Your discounted slot is reserved.',
      booking,
      groupDeal: deal
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get user's bookings with filter tabs
// @route   GET /api/bookings/my
exports.getMyBookings = async (req, res) => {
  try {
    const { tab } = req.query; // 'ALL', 'INDIVIDUAL', 'GROUP', 'UPCOMING', 'COMPLETED', 'CANCELLED'
    const filter = { customerId: req.user._id };

    if (tab === 'INDIVIDUAL') {
      filter.bookingType = 'INDIVIDUAL';
    } else if (tab === 'GROUP') {
      filter.bookingType = 'GROUP';
    } else if (tab === 'UPCOMING') {
      filter.bookingStatus = { $in: ['CONFIRMED', 'FALLBACK_PENDING', 'CONVERTED_INDIVIDUAL', 'IN_PROGRESS'] };
    } else if (tab === 'COMPLETED') {
      filter.bookingStatus = 'COMPLETED';
    } else if (tab === 'CANCELLED') {
      filter.bookingStatus = 'CANCELLED';
    }

    const bookings = await Booking.find(filter)
      .populate('serviceId')
      .populate('providerId')
      .populate('groupDealId')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: bookings.length,
      bookings
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single booking details
// @route   GET /api/bookings/:id
exports.getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findOne({
      $or: [{ _id: req.params.id }, { bookingId: req.params.id }],
      customerId: req.user._id
    })
      .populate('serviceId')
      .populate('providerId')
      .populate('groupDealId');

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    res.json({ success: true, booking });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Resolve Bulk Booking Fallback (Requirement 10)
// @route   POST /api/bookings/:id/resolve-fallback
exports.resolveFallback = async (req, res) => {
  try {
    const { choice } = req.body; // 'CONVERT_INDIVIDUAL' | 'CANCEL_REFUND'
    const booking = await Booking.findOne({
      $or: [{ _id: req.params.id }, { bookingId: req.params.id }],
      customerId: req.user._id
    }).populate('serviceId').populate('providerId');

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    if (booking.bookingStatus !== 'FALLBACK_PENDING') {
      return res.status(400).json({ 
        success: false, 
        message: `Booking is currently in status '${booking.bookingStatus}', not pending fallback.` 
      });
    }

    if (choice === 'CONVERT_INDIVIDUAL') {
      // User explicitly consented to convert to individual booking at normal price
      const individualPrice = booking.serviceId.individualPrice * booking.quantity;
      const differenceToPay = Math.max(0, individualPrice - (booking.unitPrice * booking.quantity));

      booking.bookingStatus = 'CONVERTED_INDIVIDUAL';
      booking.fallbackChoice = 'CONVERT_INDIVIDUAL';
      booking.fallbackResolvedAt = new Date();
      // Update unit price to individual price
      booking.unitPrice = booking.serviceId.individualPrice;
      booking.totalPrice = booking.totalPrice + differenceToPay;
      await booking.save();

      // Update participant status in group deal
      if (booking.groupDealId) {
        await GroupDeal.updateOne(
          { _id: booking.groupDealId, 'currentParticipants.bookingId': booking.bookingId },
          { $set: { 'currentParticipants.$.status': 'CONVERTED_INDIVIDUAL' } }
        );
      }

      return res.json({
        success: true,
        message: 'Booking successfully converted to Individual Booking! Provider will arrive at your scheduled time.',
        differencePaid: differenceToPay,
        booking
      });
    } else if (choice === 'CANCEL_REFUND') {
      // User opted to cancel and receive 100% full refund
      const refundRef = `GS-REF-${Math.floor(100000 + Math.random() * 900000)}`;

      booking.bookingStatus = 'CANCELLED';
      booking.paymentStatus = 'REFUNDED';
      booking.fallbackChoice = 'CANCEL_REFUND';
      booking.fallbackResolvedAt = new Date();
      booking.refundAmount = booking.totalPrice;
      booking.refundTransactionId = refundRef;
      await booking.save();

      // Update payment record
      await Payment.updateOne(
        { bookingId: booking.bookingId },
        { 
          paymentStatus: 'REFUNDED',
          refundStatus: 'COMPLETED',
          refundId: refundRef,
          refundAmount: booking.totalPrice
        }
      );

      // Update participant in group deal
      if (booking.groupDealId) {
        await GroupDeal.updateOne(
          { _id: booking.groupDealId, 'currentParticipants.bookingId': booking.bookingId },
          { $set: { 'currentParticipants.$.status': 'REFUNDED' } }
        );
      }

      return res.json({
        success: true,
        message: `Group booking cancelled. Full refund of ₹${booking.totalPrice} has been processed back to your original payment method.`,
        refundReference: refundRef,
        booking
      });
    } else {
      return res.status(400).json({ success: false, message: 'Invalid fallback choice. Must be CONVERT_INDIVIDUAL or CANCEL_REFUND.' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Cancel Booking
// @route   PUT /api/bookings/:id/cancel
exports.cancelBooking = async (req, res) => {
  try {
    const { reason } = req.body;
    const booking = await Booking.findOne({
      $or: [{ _id: req.params.id }, { bookingId: req.params.id }],
      customerId: req.user._id
    });

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    if (['COMPLETED', 'CANCELLED'].includes(booking.bookingStatus)) {
      return res.status(400).json({ success: false, message: `Cannot cancel a booking that is already ${booking.bookingStatus}` });
    }

    const refundRef = `GS-REF-${Math.floor(100000 + Math.random() * 900000)}`;
    booking.bookingStatus = 'CANCELLED';
    booking.paymentStatus = 'REFUNDED';
    booking.refundAmount = booking.totalPrice;
    booking.refundTransactionId = refundRef;
    booking.notes = reason ? `Cancellation reason: ${reason}` : booking.notes;
    await booking.save();

    res.json({
      success: true,
      message: 'Booking cancelled successfully. Refund initiated.',
      refundReference: refundRef,
      booking
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Rate and Review Service
// @route   POST /api/bookings/:id/review
exports.rateBooking = async (req, res) => {
  try {
    const { rating, reviewText } = req.body;
    const booking = await Booking.findOne({
      $or: [{ _id: req.params.id }, { bookingId: req.params.id }],
      customerId: req.user._id
    });

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    const review = await Review.create({
      customerId: req.user._id,
      customerName: req.user.name,
      providerId: booking.providerId,
      serviceId: booking.serviceId,
      bookingId: booking.bookingId,
      rating: Number(rating),
      reviewText,
      serviceType: booking.bookingType,
      society: booking.address?.society || 'Locality'
    });

    // Update service rating average
    const reviews = await Review.find({ serviceId: booking.serviceId });
    const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
    await Service.updateOne(
      { _id: booking.serviceId },
      { rating: Math.round(avgRating * 10) / 10, reviewCount: reviews.length }
    );

    // Dispatch Brevo Feedback Acknowledgment Email
    if (req.user?.email) {
      sendFeedbackReceivedEmail({
        to: req.user.email,
        name: req.user.name,
        bookingId: booking.bookingId,
        serviceName: booking.serviceId?.title || 'Service',
        providerName: booking.providerId?.businessName || 'Service Provider',
        rating,
        reviewText
      }).catch(err => console.error('[Brevo Review Ack Email Error]:', err.message));
    }

    res.status(201).json({
      success: true,
      message: 'Thank you for your review! +50 Loyalty points credited.',
      review
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Mark Booking as Completed & Dispatch Brevo Feedback Email
// @route   PUT /api/bookings/:id/complete
exports.completeBooking = async (req, res) => {
  try {
    const booking = await Booking.findOne({
      $or: [{ _id: req.params.id }, { bookingId: req.params.id }]
    })
      .populate('customerId')
      .populate('serviceId')
      .populate('providerId');

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    if (booking.bookingStatus === 'COMPLETED') {
      return res.status(400).json({ success: false, message: 'Booking is already marked as completed.' });
    }

    booking.bookingStatus = 'COMPLETED';
    await booking.save();

    // Dispatch Brevo Service Completed & Feedback Email
    const customer = booking.customerId;
    if (customer?.email) {
      sendServiceCompletedFeedbackEmail({
        to: customer.email,
        name: customer.name,
        bookingId: booking.bookingId,
        serviceName: booking.serviceId?.title || 'AC Servicing',
        providerName: booking.providerId?.businessName || 'Cool Air Experts'
      }).catch(err => console.error('[Brevo Feedback Request Email Error]:', err.message));
    }

    res.json({
      success: true,
      message: 'Booking completed successfully! Feedback request email sent via Brevo.',
      booking
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

