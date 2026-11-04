const Provider = require('../models/Provider');

// Haversine formula
function calculateDistanceKm(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return Math.round((R * c) * 10) / 10;
}

// @desc    Get Nearby Approved Providers for Map & Discovery
// @route   GET /api/providers/nearby
exports.getNearbyProviders = async (req, res) => {
  try {
    const { lat, lng, radius = 15, category } = req.query;

    const customerLat = lat ? parseFloat(lat) : 12.8912;
    const customerLng = lng ? parseFloat(lng) : 77.5683;

    const query = {
      approvalStatus: 'approved',
      activeStatus: true
    };

    if (category && category !== 'All') {
      query.serviceCategories = category;
    }

    const providers = await Provider.find(query);

    const enriched = providers.map(p => {
      const pLat = p.location?.coordinates?.lat || 12.9352;
      const pLng = p.location?.coordinates?.lng || 77.6245;
      const dist = calculateDistanceKm(customerLat, customerLng, pLat, pLng);
      const travelTimeMin = Math.max(8, Math.round(dist * 3.2 + 5));

      return {
        ...p.toObject(),
        distanceKm: dist,
        estimatedTravelTime: `${travelTimeMin} - ${travelTimeMin + 8} mins`
      };
    })
    .filter(p => p.distanceKm <= Number(radius))
    .sort((a, b) => a.distanceKm - b.distanceKm);

    res.json({
      success: true,
      count: enriched.length,
      customerLocation: { lat: customerLat, lng: customerLng },
      providers: enriched
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get Provider by ID
// @route   GET /api/providers/:id
exports.getProviderById = async (req, res) => {
  try {
    const provider = await Provider.findById(req.params.id);
    if (!provider || provider.approvalStatus !== 'approved') {
      return res.status(404).json({ success: false, message: 'Provider not found or not approved' });
    }
    res.json({ success: true, provider });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

