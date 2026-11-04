const GroupDeal = require('../models/GroupDeal');
const Service = require('../models/Service');
const Provider = require('../models/Provider');
const Booking = require('../models/Booking');

// @desc    Get all active group deals near locality/all
// @route   GET /api/group-deals
exports.getAllGroupDeals = async (req, res) => {
  try {
    const { locality, category, status } = req.query;
    const filter = {};

    if (status) {
      filter.status = status;
    } else {
      filter.status = { $in: ['ACTIVE', 'TARGET_ACHIEVED', 'TARGET_MISSED'] };
    }

    if (category && category !== 'All') {
      filter.category = category;
    }

    if (locality) {
      filter.$or = [
        { 'serviceLocation.locality': { $regex: locality, $options: 'i' } },
        { 'serviceLocation.society': { $regex: locality, $options: 'i' } }
      ];
    }

    const deals = await GroupDeal.find(filter)
      .populate('serviceId')
      .populate('providerId')
      .sort({ createdAt: -1 });

    const enrichedDeals = deals.map(deal => {
      const joined = deal.currentParticipants.length;
      const minRequired = deal.minimumGroupSize;
      const maxSlots = deal.maximumGroupSize;
      const remainingForMin = Math.max(0, minRequired - joined);
      const remainingSlots = Math.max(0, maxSlots - joined);

      // Find current active tier
      let currentTier = null;
      let nextTier = null;

      const sortedTiers = [...deal.pricingTiers].sort((a, b) => a.minGroupSize - b.minGroupSize);
      for (let i = 0; i < sortedTiers.length; i++) {
        if (joined >= sortedTiers[i].minGroupSize) {
          currentTier = sortedTiers[i];
        } else if (!nextTier && joined < sortedTiers[i].minGroupSize) {
          nextTier = sortedTiers[i];
        }
      }

      // Next tier unlock text
      let nextTierMessage = '';
      if (nextTier) {
        const needed = nextTier.minGroupSize - joined;
        nextTierMessage = `${needed} more customer${needed > 1 ? 's' : ''} needed to unlock ₹${nextTier.discountedPrice} tier!`;
      } else if (joined >= minRequired) {
        nextTierMessage = 'Max group discount unlocked! 🎉';
      } else {
        nextTierMessage = `${remainingForMin} more needed to reach minimum group target.`;
      }

      const activePrice = currentTier ? currentTier.discountedPrice : deal.currentGroupPrice;
      const discountPercent = Math.round(((deal.regularPrice - activePrice) / deal.regularPrice) * 100);

      // Privacy-safe participant summary
      const safeParticipants = deal.currentParticipants.map(p => ({
        _id: p._id,
        name: p.name.split(' ')[0] + ' ' + (p.name.split(' ')[1] ? p.name.split(' ')[1][0] + '.' : ''),
        society: p.society,
        flatNo: p.flatNo ? `Flat ${p.flatNo}` : '',
        joinedAt: p.joinedAt,
        quantity: p.quantity
      }));

      return {
        ...deal.toObject(),
        joinedCount: joined,
        remainingForMin,
        remainingSlots,
        currentTier,
        nextTier,
        nextTierMessage,
        activePrice,
        discountPercent,
        safeParticipants,
        progressPercent: Math.min(100, Math.round((joined / maxSlots) * 100)),
        minProgressPercent: Math.min(100, Math.round((joined / minRequired) * 100))
      };
    });

    res.json({
      success: true,
      count: enrichedDeals.length,
      deals: enrichedDeals
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single group deal by ID
// @route   GET /api/group-deals/:id
exports.getGroupDealById = async (req, res) => {
  try {
    const deal = await GroupDeal.findById(req.params.id)
      .populate('serviceId')
      .populate('providerId');

    if (!deal) {
      return res.status(404).json({ success: false, message: 'Group deal not found' });
    }

    const joined = deal.currentParticipants.length;
    const minRequired = deal.minimumGroupSize;
    const maxSlots = deal.maximumGroupSize;
    const remainingForMin = Math.max(0, minRequired - joined);
    const remainingSlots = Math.max(0, maxSlots - joined);

    let currentTier = null;
    let nextTier = null;
    const sortedTiers = [...deal.pricingTiers].sort((a, b) => a.minGroupSize - b.minGroupSize);
    for (let i = 0; i < sortedTiers.length; i++) {
      if (joined >= sortedTiers[i].minGroupSize) {
        currentTier = sortedTiers[i];
      } else if (!nextTier && joined < sortedTiers[i].minGroupSize) {
        nextTier = sortedTiers[i];
      }
    }

    let nextTierMessage = '';
    if (nextTier) {
      const needed = nextTier.minGroupSize - joined;
      nextTierMessage = `${needed} more customer${needed > 1 ? 's' : ''} needed to unlock ₹${nextTier.discountedPrice} (${nextTier.discountPercent}% OFF) tier!`;
    } else if (joined >= minRequired) {
      nextTierMessage = 'Maximum group savings unlocked! 🎉';
    } else {
      nextTierMessage = `${remainingForMin} more needed to confirm bulk booking.`;
    }

    const activePrice = currentTier ? currentTier.discountedPrice : deal.currentGroupPrice;

    const safeParticipants = deal.currentParticipants.map(p => ({
      _id: p._id,
      name: p.name.split(' ')[0] + ' ' + (p.name.split(' ')[1] ? p.name.split(' ')[1][0] + '.' : ''),
      society: p.society,
      flatNo: p.flatNo ? `Flat ${p.flatNo}` : '',
      joinedAt: p.joinedAt,
      quantity: p.quantity
    }));

    res.json({
      success: true,
      deal: {
        ...deal.toObject(),
        joinedCount: joined,
        remainingForMin,
        remainingSlots,
        currentTier,
        nextTier,
        nextTierMessage,
        activePrice,
        safeParticipants,
        progressPercent: Math.min(100, Math.round((joined / maxSlots) * 100)),
        minProgressPercent: Math.min(100, Math.round((joined / minRequired) * 100))
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create a new Group Deal by Customer for their society/campus
// @route   POST /api/group-deals/create
exports.createGroupDeal = async (req, res) => {
  try {
    const { 
      serviceId, 
      society, 
      locality, 
      city, 
      pincode, 
      serviceDate, 
      deadlineHours,
      targetGroupSize 
    } = req.body;

    const service = await Service.findById(serviceId).populate('providerId');
    if (!service) {
      return res.status(404).json({ success: false, message: 'Service not found' });
    }

    const deadline = new Date();
    deadline.setHours(deadline.getHours() + (deadlineHours ? Number(deadlineHours) : 24));

    const minSize = targetGroupSize ? Number(targetGroupSize) : 10;
    const maxSize = minSize * 2;

    const groupDeal = await GroupDeal.create({
      serviceId: service._id,
      providerId: service.providerId._id,
      title: `${service.title} - ${society || locality} Group Deal`,
      category: service.category,
      minimumGroupSize: minSize,
      maximumGroupSize: maxSize,
      currentParticipants: [],
      pricingTiers: service.groupPricingTiers && service.groupPricingTiers.length > 0 
        ? service.groupPricingTiers 
        : [
            { minGroupSize: 5, maxGroupSize: 9, discountedPrice: Math.round(service.individualPrice * 0.85), discountPercent: 15 },
            { minGroupSize: 10, maxGroupSize: 19, discountedPrice: Math.round(service.individualPrice * 0.75), discountPercent: 25 },
            { minGroupSize: 20, maxGroupSize: 50, discountedPrice: Math.round(service.individualPrice * 0.65), discountPercent: 35 }
          ],
      regularPrice: service.individualPrice,
      currentGroupPrice: Math.round(service.individualPrice * 0.75),
      deadline,
      serviceDate: serviceDate || 'Tomorrow, 10:00 AM - 02:00 PM',
      serviceLocation: {
        society: society || 'Sobha Dream Acres',
        locality: locality || 'Panathur',
        city: city || 'Bengaluru',
        pincode: pincode || '560087',
        coordinates: service.providerId?.location?.coordinates || { lat: 12.9352, lng: 77.6945 }
      },
      status: 'ACTIVE',
      fallbackStatus: 'NOT_TRIGGERED'
    });

    res.status(201).json({
      success: true,
      message: 'Group deal initiated successfully! Invite your neighbors to join.',
      groupDeal
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Simulate Deadline Expiration & Fallback Evaluation (Requirement 10)
// @route   POST /api/group-deals/:id/simulate-deadline
exports.simulateDeadline = async (req, res) => {
  try {
    const { forceOutcome } = req.body; // 'SUCCESS' | 'FAILURE'
    const deal = await GroupDeal.findById(req.params.id);
    if (!deal) {
      return res.status(404).json({ success: false, message: 'Group deal not found' });
    }

    const participantCount = deal.currentParticipants.length;
    const isTargetAchieved = forceOutcome === 'SUCCESS' || (forceOutcome !== 'FAILURE' && participantCount >= deal.minimumGroupSize);

    if (isTargetAchieved) {
      deal.status = 'TARGET_ACHIEVED';
      deal.fallbackStatus = 'NOT_TRIGGERED';
      await deal.save();

      // Update associated bookings to CONFIRMED
      await Booking.updateMany(
        { groupDealId: deal._id, bookingStatus: { $ne: 'CANCELLED' } },
        { bookingStatus: 'CONFIRMED' }
      );

      return res.json({
        success: true,
        outcome: 'TARGET_ACHIEVED',
        message: `Group deal reached the target (${participantCount}/${deal.minimumGroupSize}). All bookings confirmed at bulk discount!`,
        deal
      });
    } else {
      // TARGET NOT REACHED -> TRIGGER REQUIREMENT 10 FALLBACK PROCESS!
      deal.status = 'TARGET_MISSED';
      deal.fallbackStatus = 'FALLBACK_OFFERED';
      await deal.save();

      // Update all associated bookings to FALLBACK_PENDING
      const updatedBookings = await Booking.updateMany(
        { groupDealId: deal._id, bookingStatus: { $ne: 'CANCELLED' } },
        { bookingStatus: 'FALLBACK_PENDING' }
      );

      return res.json({
        success: true,
        outcome: 'TARGET_MISSED',
        message: `Deadline expired. Group target not reached (${participantCount}/${deal.minimumGroupSize}). Fallback options offered to all customers.`,
        deal,
        affectedBookingsCount: updatedBookings.modifiedCount
      });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

