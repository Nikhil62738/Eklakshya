/**
 * GroupSave Pricing Calculation Engine
 * Server-side source of truth for all booking calculations.
 */

const ACTIVE_COUPONS = {
  'WELCOME50': {
    code: 'WELCOME50',
    type: 'FLAT',
    discount: 50,
    minOrder: 299,
    description: 'Flat ₹50 OFF on your first booking'
  },
  'GROUPSAVE150': {
    code: 'GROUPSAVE150',
    type: 'FLAT',
    discount: 150,
    minOrder: 599,
    description: 'Flat ₹150 OFF for community members'
  },
  'NEIGHBOR20': {
    code: 'NEIGHBOR20',
    type: 'PERCENTAGE',
    percentage: 20,
    maxDiscount: 250,
    minOrder: 499,
    description: '20% OFF up to ₹250 for society residents'
  },
  'DIWALI100': {
    code: 'DIWALI100',
    type: 'FLAT',
    discount: 100,
    minOrder: 499,
    description: 'Festive savings: ₹100 OFF'
  }
};

const PLATFORM_FEE = 29; // Standard platform convenience fee
const GST_PERCENTAGE = 0.05; // 5% GST on home services

/**
 * Calculate accurate pricing breakdown
 * @param {number} unitPrice - base price of service
 * @param {number} quantity - number of units (e.g. 1 AC, 2 ACs)
 * @param {string} [couponCode] - optional coupon code
 */
function calculateIndividualPrice(unitPrice, quantity = 1, couponCode = null) {
  const qty = Math.max(1, parseInt(quantity, 10) || 1);
  const basePrice = Math.max(0, parseFloat(unitPrice) || 0);
  const subtotal = Math.round(basePrice * qty);

  let discountAmount = 0;
  let appliedCoupon = null;

  if (couponCode) {
    const cleanCode = couponCode.trim().toUpperCase();
    const coupon = ACTIVE_COUPONS[cleanCode];

    if (coupon) {
      if (subtotal >= coupon.minOrder) {
        if (coupon.type === 'FLAT') {
          discountAmount = coupon.discount;
        } else if (coupon.type === 'PERCENTAGE') {
          const calculated = Math.round(subtotal * (coupon.percentage / 100));
          discountAmount = Math.min(calculated, coupon.maxDiscount);
        }
        appliedCoupon = {
          code: coupon.code,
          description: coupon.description,
          discountAmount
        };
      } else {
        appliedCoupon = {
          code: coupon.code,
          invalidReason: `Minimum order amount of ₹${coupon.minOrder} required for ${coupon.code}`
        };
      }
    } else {
      appliedCoupon = {
        code: cleanCode,
        invalidReason: 'Invalid coupon code'
      };
    }
  }

  const taxableAmount = Math.max(0, subtotal - discountAmount);
  const taxAmount = Math.round(taxableAmount * GST_PERCENTAGE);
  const totalPrice = taxableAmount + PLATFORM_FEE + taxAmount;

  // Approximate retail market price comparison (avg 25% higher)
  const estimatedMarketPrice = Math.round(subtotal * 1.25);
  const totalSavings = Math.max(0, (estimatedMarketPrice - subtotal) + discountAmount);

  return {
    unitPrice: basePrice,
    quantity: qty,
    subtotal,
    discountAmount,
    platformFee: PLATFORM_FEE,
    taxAmount,
    taxPercentage: 5,
    totalPrice,
    totalSavings,
    couponApplied: appliedCoupon?.discountAmount ? appliedCoupon.code : null,
    couponDetails: appliedCoupon
  };
}

module.exports = {
  calculateIndividualPrice,
  ACTIVE_COUPONS,
  PLATFORM_FEE,
  GST_PERCENTAGE
};

