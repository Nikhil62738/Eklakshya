const Service = require('../models/Service');
const Provider = require('../models/Provider');
const GroupDeal = require('../models/GroupDeal');
const Review = require('../models/Review');

// Haversine distance calculator in KM
function calculateDistanceKm(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return Math.round((R * c) * 10) / 10;
}

// @desc    Get all services with filters & sorting
// @route   GET /api/services
exports.getAllServices = async (req, res) => {
  try {
    const { 
      category, 
      search, 
      minRating, 
      maxPrice, 
      verifiedOnly, 
      groupOnly, 
      sortBy,
      customerLat,
      customerLng 
    } = req.query;

    const filter = { status: 'active' };

    if (category && category !== 'All') {
      filter.category = category;
    }

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { category: { $regex: search, $options: 'i' } }
      ];
    }

    if (minRating) {
      filter.rating = { $gte: Number(minRating) };
    }

    if (maxPrice) {
      filter.individualPrice = { $lte: Number(maxPrice) };
    }

    let services = await Service.find(filter).populate({
      path: 'providerId',
      match: { approvalStatus: 'approved', activeStatus: true }
    });

    // Filter out services where provider is null (not approved/active)
    services = services.filter(s => s.providerId !== null);

    if (verifiedOnly === 'true') {
      services = services.filter(s => s.providerId && s.providerId.verifiedBadge);
    }

    if (groupOnly === 'true') {
      services = services.filter(s => s.groupPricingTiers && s.groupPricingTiers.length > 0);
    }

    // Attach distance if coordinates provided (default Bengaluru coordinates)
    const cLat = customerLat ? parseFloat(customerLat) : 12.9716;
    const cLng = customerLng ? parseFloat(customerLng) : 77.5946;

    let enriched = services.map(s => {
      const p = s.providerId;
      const pLat = p?.location?.coordinates?.lat || 12.9352;
      const pLng = p?.location?.coordinates?.lng || 77.6245;
      const dist = calculateDistanceKm(cLat, cLng, pLat, pLng);
      // Rough travel time estimate: 3 mins per km + 5 mins prep
      const travelTimeMin = Math.max(8, Math.round(dist * 3.2 + 5));

      const lowestGroupTier = s.groupPricingTiers && s.groupPricingTiers.length > 0
        ? s.groupPricingTiers.reduce((min, tier) => tier.discountedPrice < min ? tier.discountedPrice : min, s.individualPrice)
        : null;

      const maxDiscount = lowestGroupTier 
        ? Math.round(((s.individualPrice - lowestGroupTier) / s.individualPrice) * 100) 
        : 0;

      return {
        ...s.toObject(),
        distanceKm: dist,
        estimatedTravelTime: `${travelTimeMin} - ${travelTimeMin + 10} mins`,
        lowestGroupPrice: lowestGroupTier,
        maxDiscountPercent: maxDiscount
      };
    });

    // Sorting
    if (sortBy === 'lowest-price') {
      enriched.sort((a, b) => a.individualPrice - b.individualPrice);
    } else if (sortBy === 'highest-rating') {
      enriched.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === 'nearest') {
      enriched.sort((a, b) => a.distanceKm - b.distanceKm);
    } else {
      // most-popular default
      enriched.sort((a, b) => (b.popular ? 1 : 0) - (a.popular ? 1 : 0) || b.reviewCount - a.reviewCount);
    }

    res.json({
      success: true,
      count: enriched.length,
      services: enriched
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single service by ID
// @route   GET /api/services/:id
exports.getServiceById = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id).populate('providerId');
    if (!service) {
      return res.status(404).json({ success: false, message: 'Service not found' });
    }

    // Check if there are active group deals for this service
    const activeDeals = await GroupDeal.find({
      serviceId: service._id,
      status: { $in: ['ACTIVE', 'TARGET_ACHIEVED'] }
    });

    // Get reviews
    const reviews = await Review.find({ serviceId: service._id }).sort({ createdAt: -1 }).limit(10);

    const cLat = req.query.customerLat ? parseFloat(req.query.customerLat) : 12.9716;
    const cLng = req.query.customerLng ? parseFloat(req.query.customerLng) : 77.5946;
    const pLat = service.providerId?.location?.coordinates?.lat || 12.9352;
    const pLng = service.providerId?.location?.coordinates?.lng || 77.6245;
    const dist = calculateDistanceKm(cLat, cLng, pLat, pLng);

    res.json({
      success: true,
      service: {
        ...service.toObject(),
        distanceKm: dist,
        estimatedTravelTime: `${Math.round(dist * 3 + 6)} mins`
      },
      activeDeals,
      reviews
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get popular / most booked services
// @route   GET /api/services/featured/popular
exports.getPopularServices = async (req, res) => {
  try {
    const services = await Service.find({ status: 'active', popular: true })
      .populate('providerId')
      .limit(6);
    res.json({ success: true, services });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

