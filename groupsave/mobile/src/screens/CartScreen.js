import React, { useState } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity, 
  Image, 
  StyleSheet, 
  SafeAreaView 
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { COLORS } from '../constants/theme';
import { useApp } from '../context/AppContext';
import Header from '../components/Header';

export default function CartScreen() {
  const { 
    navigate, 
    cartItems, 
    updateQuantity, 
    removeFromCart, 
    totalAmount, 
    totalSavings 
  } = useApp();

  const [activeTab, setActiveTab] = useState('ALL');

  const singleItems = cartItems.filter(i => i.type === 'SINGLE');
  const groupItems = cartItems.filter(i => i.type === 'GROUP');

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        
        {/* Header matching screenshot */}
        <Header title={`Your Cart (${cartItems.length} items)`} showBack={true} />

        {/* Segmented Filter Pills matching screenshot */}
        <View style={styles.tabRow}>
          <TouchableOpacity
            style={[styles.tabPill, activeTab === 'ALL' && styles.tabPillActive]}
            onPress={() => setActiveTab('ALL')}
            activeOpacity={0.75}
          >
            <Text style={[styles.tabText, activeTab === 'ALL' && styles.tabTextActive]}>
              Single ({singleItems.length})
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tabPill, activeTab === 'GROUP' && styles.tabPillActive]}
            onPress={() => setActiveTab('GROUP')}
            activeOpacity={0.75}
          >
            <Text style={[styles.tabText, activeTab === 'GROUP' && styles.tabTextActive]}>
              Group ({groupItems.length})
            </Text>
          </TouchableOpacity>
        </View>

        {/* Cart Items List matching screenshot */}
        <ScrollView 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
        >
          {cartItems.map((item) => {
            const isGroup = item.type === 'GROUP';
            return (
              <View key={item.id} style={styles.cartCard}>
                
                {/* Group Deal Tag if applicable */}
                {isGroup && (
                  <View style={styles.groupDealBadge}>
                    <Text style={styles.groupDealBadgeText}>Group Deal</Text>
                  </View>
                )}

                <View style={styles.cardMain}>
                  {/* Thumbnail Image */}
                  <Image source={{ uri: item.image }} style={styles.itemImage} />

                  {/* Info Column */}
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

                  {/* Right: Quantity and Remove Buttons */}
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
        </ScrollView>

        {/* Bottom Checkout Section matching screenshot */}
        <View style={styles.checkoutFooter}>
          
          {/* Total Amount Row */}
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total Amount</Text>
            <Text style={styles.totalValue}>₹{totalAmount || 1197}</Text>
          </View>

          {/* Savings Callout Box matching screenshot */}
          <View style={styles.savingsBox}>
            <View style={styles.percentCircle}>
              <Feather name="percent" size={12} color="#059669" />
            </View>
            <Text style={styles.savingsText}>You are saving ₹{totalSavings}</Text>
          </View>

          {/* Proceed to Payment Button matching screenshot */}
          <TouchableOpacity 
            style={styles.proceedBtn}
            onPress={() => navigate('PAYMENT')}
            activeOpacity={0.85}
          >
            <Text style={styles.proceedText}>Proceed to Payment</Text>
          </TouchableOpacity>

        </View>

      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  tabRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
  },
  tabPill: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 16,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
  },
  tabPillActive: {
    backgroundColor: '#064E3B',
    borderColor: '#064E3B',
  },
  tabText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.textDark,
  },
  tabTextActive: {
    color: COLORS.white,
    fontWeight: '700',
  },
  listContent: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 14,
  },
  cartCard: {
    backgroundColor: COLORS.white,
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  groupDealBadge: {
    backgroundColor: '#D1FAE5',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  groupDealBadgeText: {
    color: '#059669',
    fontSize: 10,
    fontWeight: '800',
  },
  cardMain: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemImage: {
    width: 64,
    height: 64,
    borderRadius: 10,
    backgroundColor: '#E5E7EB',
  },
  itemInfo: {
    flex: 1,
    marginLeft: 12,
  },
  itemTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.textDark,
  },
  providerName: {
    fontSize: 11,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  priceText: {
    fontSize: 13,
    fontWeight: '800',
    color: COLORS.textDark,
    marginTop: 4,
  },
  joinStatusText: {
    fontSize: 11,
    color: COLORS.textMuted,
    fontWeight: '500',
  },
  actionsRight: {
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    height: 64,
  },
  closeBtn: {
    padding: 2,
  },
  qtyContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 14,
    paddingHorizontal: 4,
    paddingVertical: 2,
    gap: 6,
  },
  qtyBtn: {
    padding: 4,
  },
  qtyText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.textDark,
    minWidth: 14,
    textAlign: 'center',
  },
  checkoutFooter: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: COLORS.borderLight,
    backgroundColor: COLORS.white,
    gap: 12,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textDark,
  },
  totalValue: {
    fontSize: 20,
    fontWeight: '900',
    color: COLORS.textDark,
  },
  savingsBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#D1FAE5',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 10,
    gap: 8,
  },
  percentCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#A7F3D0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  savingsText: {
    color: '#065F46',
    fontSize: 12,
    fontWeight: '700',
  },
  proceedBtn: {
    backgroundColor: '#064E3B',
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  proceedText: {
    color: COLORS.white,
    fontSize: 15,
    fontWeight: '800',
  },
});

