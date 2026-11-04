import React, { useState } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity, 
  TextInput,
  Image, 
  StyleSheet, 
  SafeAreaView 
} from 'react-native';
import { Feather, Ionicons } from '@expo/vector-icons';
import { COLORS } from '../constants/theme';
import { useApp } from '../context/AppContext';
import Header from '../components/Header';

// Demo coupons — mirrors backend pricingService.js
const COUPONS = {
  WELCOME50: { discount: 50, label: '₹50 off for new users' },
  GROUPSAVE150: { discount: 150, label: '₹150 off on orders above ₹1000' },
  NEIGHBOR20: { discount: 20, label: '₹20 off for returning customers' },
  DIWALI100: { discount: 100, label: '₹100 Diwali Special Offer' },
};

export default function CartScreen() {
  const { 
    navigate, 
    cartItems, 
    updateQuantity, 
    removeFromCart, 
    totalAmount, 
    appliedCoupon,
    setAppliedCoupon,
  } = useApp();

  const [activeTab, setActiveTab] = useState('ALL');
  const [couponInput, setCouponInput] = useState('');
  const [couponError, setCouponError] = useState('');
  const [couponApplied, setCouponApplied] = useState(null);

  const singleItems = cartItems.filter(i => i.type === 'SINGLE');
  const groupItems = cartItems.filter(i => i.type === 'GROUP');

  const displayItems = activeTab === 'ALL'
    ? cartItems
    : activeTab === 'Single (1)'
    ? singleItems
    : groupItems;

  const couponDiscount = couponApplied ? COUPONS[couponApplied]?.discount || 0 : 0;
  const finalTotal = Math.max(0, (totalAmount || 1197) - couponDiscount);
  const totalSavings = couponDiscount + Math.max(0, (totalAmount || 1197) - finalTotal);

  const handleApplyCoupon = () => {
    const code = couponInput.trim().toUpperCase();
    if (!code) { setCouponError('Please enter a coupon code'); return; }
    if (COUPONS[code]) {
      setCouponApplied(code);
      setAppliedCoupon && setAppliedCoupon(code);
      setCouponError('');
    } else {
      setCouponError('Invalid coupon code. Try WELCOME50 or DIWALI100');
      setCouponApplied(null);
    }
  };

  const handleRemoveCoupon = () => {
    setCouponApplied(null);
    setCouponInput('');
    setCouponError('');
    setAppliedCoupon && setAppliedCoupon(null);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        
        {/* Header */}
        <Header title={`Your Cart (${cartItems.length} items)`} showBack={true} />

        {/* Segmented Filter Pills */}
        {cartItems.length > 0 && (
          <View style={styles.tabRow}>
            {['ALL', 'Single (1)', 'Group (1)'].map((tab) => {
              const isActive = activeTab === tab;
              return (
                <TouchableOpacity
                  key={tab}
                  style={[styles.tabPill, isActive && styles.tabPillActive]}
                  onPress={() => setActiveTab(tab)}
                  activeOpacity={0.75}
                >
                  <Text style={[styles.tabText, isActive && styles.tabTextActive]}>
                    {tab}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        )}

        {cartItems.length === 0 ? (
          <View style={styles.emptyContainer}>
            <View style={styles.emptyIconCircle}>
              <Feather name="shopping-bag" size={44} color={COLORS.primary} />
            </View>
            <Text style={styles.emptyTitle}>Your cart is empty</Text>
            <Text style={styles.emptySubtitle}>
              Explore our wide range of home services and book together to unlock exclusive group savings!
            </Text>
            <TouchableOpacity 
              style={styles.exploreBtn} 
              onPress={() => navigate('HOME')}
              activeOpacity={0.8}
            >
              <Text style={styles.exploreBtnText}>Explore Services</Text>
              <Feather name="arrow-right" size={16} color={COLORS.white} />
            </TouchableOpacity>
          </View>
        ) : (
          <>
            <ScrollView 
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.listContent}
            >
          {/* Cart Items */}
          {cartItems.map((item) => {
            const isGroup = item.type === 'GROUP';
            return (
              <View key={item.id} style={styles.cartCard}>
                
                {isGroup && (
                  <View style={styles.groupDealBadge}>
                    <Feather name="users" size={10} color="#059669" style={{ marginRight: 4 }} />
                    <Text style={styles.groupDealBadgeText}>Group Deal</Text>
                  </View>
                )}

                <View style={styles.cardMain}>
                  <Image source={{ uri: item.image }} style={styles.itemImage} />

                  <View style={styles.itemInfo}>
                    <Text style={styles.itemTitle}>{item.title}</Text>
                    <Text style={styles.providerName}>{item.providerName}</Text>
                    <Text style={styles.priceText}>
                      ₹{item.price}
                      {item.joinStatus ? (
                        <Text style={styles.joinStatusText}> each ({item.joinStatus})</Text>
                      ) : ''}
                    </Text>
                  </View>

                  <View style={styles.actionsRight}>
                    <TouchableOpacity 
                      onPress={() => removeFromCart(item.id)}
                      style={styles.closeBtn}
                    >
                      <Feather name="x" size={16} color={COLORS.textLight} />
                    </TouchableOpacity>

                    <View style={styles.qtyContainer}>
                      <TouchableOpacity 
                        onPress={() => updateQuantity(item.id, -1)}
                        style={styles.qtyBtn}
                      >
                        <Feather name="minus" size={12} color={COLORS.textDark} />
                      </TouchableOpacity>
                      <Text style={styles.qtyText}>{item.quantity}</Text>
                      <TouchableOpacity 
                        onPress={() => updateQuantity(item.id, 1)}
                        style={styles.qtyBtn}
                      >
                        <Feather name="plus" size={12} color={COLORS.textDark} />
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>

              </View>
            );
          })}

          {/* Coupon Input Section */}
          <View style={styles.couponSection}>
            <View style={styles.couponHeader}>
              <Feather name="tag" size={15} color={COLORS.primary} />
              <Text style={styles.couponTitle}>Apply Coupon</Text>
            </View>

            {couponApplied ? (
              <View style={styles.appliedCouponRow}>
                <View style={styles.appliedCouponLeft}>
                  <Ionicons name="checkmark-circle" size={18} color="#059669" />
                  <View style={{ marginLeft: 8 }}>
                    <Text style={styles.appliedCouponCode}>{couponApplied}</Text>
                    <Text style={styles.appliedCouponSave}>
                      Saving ₹{COUPONS[couponApplied]?.discount}!
                    </Text>
                  </View>
                </View>
                <TouchableOpacity onPress={handleRemoveCoupon} style={styles.removeCouponBtn}>
                  <Text style={styles.removeCouponText}>Remove</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <>
                <View style={[styles.couponInputRow, couponError && styles.couponInputRowError]}>
                  <TextInput
                    style={styles.couponInput}
                    placeholder="Enter coupon code (e.g. WELCOME50)"
                    placeholderTextColor={COLORS.textLight}
                    value={couponInput}
                    onChangeText={v => { setCouponInput(v.toUpperCase()); setCouponError(''); }}
                    autoCapitalize="characters"
                    returnKeyType="done"
                    onSubmitEditing={handleApplyCoupon}
                  />
                  <TouchableOpacity
                    style={styles.applyBtn}
                    onPress={handleApplyCoupon}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.applyBtnText}>Apply</Text>
                  </TouchableOpacity>
                </View>
                {couponError ? <Text style={styles.couponErrorText}>{couponError}</Text> : null}
                <Text style={styles.couponHint}>Try: WELCOME50 • DIWALI100 • GROUPSAVE150</Text>
              </>
            )}
          </View>

          {/* Price Breakdown */}
          <View style={styles.priceBreakdown}>
            <Text style={styles.breakdownTitle}>Price Breakdown</Text>
            <View style={styles.breakdownRow}>
              <Text style={styles.breakdownLabel}>Subtotal</Text>
              <Text style={styles.breakdownValue}>₹{totalAmount || 1197}</Text>
            </View>
            {couponApplied && (
              <View style={styles.breakdownRow}>
                <Text style={[styles.breakdownLabel, { color: '#059669' }]}>
                  Coupon ({couponApplied})
                </Text>
                <Text style={[styles.breakdownValue, { color: '#059669' }]}>
                  -₹{couponDiscount}
                </Text>
              </View>
            )}
            <View style={styles.breakdownRow}>
              <Text style={styles.breakdownLabel}>Group Saving</Text>
              <Text style={[styles.breakdownValue, { color: '#059669' }]}>-₹{403 - couponDiscount > 0 ? 403 - couponDiscount : 0}</Text>
            </View>
            <View style={[styles.breakdownRow, styles.breakdownTotalRow]}>
              <Text style={styles.breakdownTotalLabel}>Total</Text>
              <Text style={styles.breakdownTotalValue}>₹{finalTotal}</Text>
            </View>
          </View>
        </ScrollView>

        {/* Bottom Checkout Section */}
        <View style={styles.checkoutFooter}>
          
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total Amount</Text>
            <Text style={styles.totalValue}>₹{finalTotal}</Text>
          </View>

          <View style={styles.savingsBox}>
            <View style={styles.percentCircle}>
              <Feather name="percent" size={12} color="#059669" />
            </View>
            <Text style={styles.savingsText}>
              You are saving ₹{403 + couponDiscount} on this order!
            </Text>
          </View>

          <TouchableOpacity 
            style={styles.proceedBtn}
            onPress={() => navigate('PAYMENT')}
            activeOpacity={0.85}
          >
            <Text style={styles.proceedText}>Proceed to Payment</Text>
            <Feather name="arrow-right" size={18} color={COLORS.white} />
          </TouchableOpacity>

        </View>
        </>
        )}

      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: COLORS.white },
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  tabRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
  },
  tabPill: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 16,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  tabPillActive: { backgroundColor: '#064E3B', borderColor: '#064E3B' },
  tabText: { fontSize: 12, fontWeight: '600', color: COLORS.textDark },
  tabTextActive: { color: COLORS.white, fontWeight: '700' },
  listContent: { paddingHorizontal: 16, paddingVertical: 14, gap: 14 },
  cartCard: {
    backgroundColor: COLORS.white,
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  groupDealBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#D1FAE5',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  groupDealBadgeText: { color: '#059669', fontSize: 10, fontWeight: '800' },
  cardMain: { flexDirection: 'row', alignItems: 'center' },
  itemImage: { width: 64, height: 64, borderRadius: 10, backgroundColor: '#E5E7EB' },
  itemInfo: { flex: 1, marginLeft: 12 },
  itemTitle: { fontSize: 14, fontWeight: '700', color: COLORS.textDark },
  providerName: { fontSize: 11, color: COLORS.textMuted, marginTop: 2 },
  priceText: { fontSize: 13, fontWeight: '800', color: COLORS.textDark, marginTop: 4 },
  joinStatusText: { fontSize: 11, color: COLORS.textMuted, fontWeight: '500' },
  actionsRight: { alignItems: 'flex-end', justifyContent: 'space-between', height: 64 },
  closeBtn: { padding: 2 },
  qtyContainer: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#F3F4F6', borderRadius: 14,
    paddingHorizontal: 4, paddingVertical: 2, gap: 6,
  },
  qtyBtn: { padding: 4 },
  qtyText: { fontSize: 12, fontWeight: '700', color: COLORS.textDark, minWidth: 14, textAlign: 'center' },
  // Coupon section
  couponSection: {
    backgroundColor: '#FAFAFA',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    gap: 10,
  },
  couponHeader: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  couponTitle: { fontSize: 13, fontWeight: '700', color: COLORS.textDark },
  couponInputRow: {
    flexDirection: 'row', alignItems: 'center',
    borderRadius: 10, borderWidth: 1.5, borderColor: '#E5E7EB',
    overflow: 'hidden',
  },
  couponInputRowError: { borderColor: '#DC4545' },
  couponInput: {
    flex: 1, height: 44,
    paddingHorizontal: 12, fontSize: 13,
    color: COLORS.textDark, fontWeight: '700',
    letterSpacing: 0.5,
  },
  applyBtn: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 16, height: 44,
    alignItems: 'center', justifyContent: 'center',
  },
  applyBtnText: { color: COLORS.white, fontSize: 13, fontWeight: '800' },
  couponErrorText: { fontSize: 11, color: '#DC4545' },
  couponHint: { fontSize: 11, color: COLORS.textMuted },
  appliedCouponRow: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: '#F0FDF4', borderRadius: 10,
    padding: 10, borderWidth: 1, borderColor: '#A7F3D0',
  },
  appliedCouponLeft: { flexDirection: 'row', alignItems: 'center' },
  appliedCouponCode: { fontSize: 13, fontWeight: '800', color: '#065F46' },
  appliedCouponSave: { fontSize: 11, color: '#059669', marginTop: 1 },
  removeCouponBtn: { paddingHorizontal: 10, paddingVertical: 4 },
  removeCouponText: { fontSize: 12, fontWeight: '700', color: '#DC2626' },
  // Price breakdown
  priceBreakdown: {
    backgroundColor: '#FAFAFA', borderRadius: 14, padding: 14,
    borderWidth: 1, borderColor: COLORS.borderLight, gap: 8,
  },
  breakdownTitle: { fontSize: 13, fontWeight: '800', color: COLORS.textDark, marginBottom: 4 },
  breakdownRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  breakdownLabel: { fontSize: 12, color: COLORS.textMuted },
  breakdownValue: { fontSize: 12, fontWeight: '700', color: COLORS.textDark },
  breakdownTotalRow: {
    borderTopWidth: 1, borderTopColor: COLORS.borderLight,
    paddingTop: 8, marginTop: 4,
  },
  breakdownTotalLabel: { fontSize: 14, fontWeight: '800', color: COLORS.textDark },
  breakdownTotalValue: { fontSize: 16, fontWeight: '900', color: COLORS.textDark },
  // Footer
  checkoutFooter: {
    paddingHorizontal: 16, paddingVertical: 14,
    borderTopWidth: 1, borderTopColor: COLORS.borderLight,
    backgroundColor: COLORS.white, gap: 10,
  },
  totalRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  totalLabel: { fontSize: 13, fontWeight: '600', color: COLORS.textMuted },
  totalValue: { fontSize: 22, fontWeight: '900', color: COLORS.textDark },
  savingsBox: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#D1FAE5', paddingVertical: 8,
    paddingHorizontal: 12, borderRadius: 10, gap: 8,
  },
  percentCircle: {
    width: 20, height: 20, borderRadius: 10,
    backgroundColor: '#A7F3D0', alignItems: 'center', justifyContent: 'center',
  },
  savingsText: { color: '#065F46', fontSize: 12, fontWeight: '700', flex: 1 },
  proceedBtn: {
    backgroundColor: '#064E3B', height: 50,
    borderRadius: 25, alignItems: 'center', justifyContent: 'center',
    flexDirection: 'row', gap: 8,
  },
  proceedText: { color: COLORS.white, fontSize: 15, fontWeight: '800' },
  // Empty State
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    paddingVertical: 60,
  },
  emptyIconCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: '#DDF5EA',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: COLORS.textDark,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: COLORS.textMuted,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
  },
  exploreBtn: {
    backgroundColor: COLORS.primary,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 24,
  },
  exploreBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
});
