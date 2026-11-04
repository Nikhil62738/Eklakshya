import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import { Feather, Ionicons } from '@expo/vector-icons';
import { COLORS } from '../constants/theme';
import { useApp } from '../context/AppContext';
import Header from '../components/Header';
import RazorpayCheckoutModal from '../components/RazorpayCheckoutModal';

export default function PaymentScreen() {
  const { navigate, totalAmount, confirmCurrentBooking, cartItems, user } = useApp();
  const [selectedMethod, setSelectedMethod] = useState('UPI');
  const [razorpayModalVisible, setRazorpayModalVisible] = useState(false);
  const [razorpayOrderId, setRazorpayOrderId] = useState(null);

  const payableAmount = totalAmount || 1197;
  const primaryItemName = cartItems[0]?.title || 'AC Servicing (Single)';

  const paymentOptions = [
    {
      id: 'UPI',
      title: 'UPI (GPay, PhonePe, Paytm)',
      icon: <Ionicons name="phone-portrait-outline" size={20} color="#059669" />,
      tag: 'Fastest'
    },
    {
      id: 'CARD',
      title: 'Credit / Debit Card',
      icon: <Ionicons name="card-outline" size={20} color="#2563EB" />
    },
    {
      id: 'NETBANKING',
      title: 'Net Banking',
      icon: <Ionicons name="business-outline" size={20} color="#D97706" />
    },
    {
      id: 'WALLET',
      title: 'Wallet (Amazon Pay)',
      icon: <Ionicons name="wallet-outline" size={20} color="#EA580C" />
    }
  ];

  const [isConfirming, setIsConfirming] = useState(false);

  // Open the Razorpay Checkout Modal
  const handleOpenRazorpay = () => {
    const generatedOrder = `order_${Date.now().toString(36)}${Math.random().toString(36).substring(2, 6)}`;
    setRazorpayOrderId(generatedOrder);
    setRazorpayModalVisible(true);
  };

  // Called when payment is successfully authorized in the Razorpay Modal
  const handleRazorpaySuccess = async (paymentResult) => {
    setRazorpayModalVisible(false);
    setIsConfirming(true);
    try {
      // Complete booking confirmation with cryptographic verification
      await confirmCurrentBooking(paymentResult.method || selectedMethod);
    } catch (e) {
      console.log('Error during booking confirmation:', e);
    } finally {
      setIsConfirming(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        
        {/* Header matching screenshot */}
        <Header title="Payment" showBack={true} />

        <View style={styles.content}>
          
          {/* Total Amount Header matching screenshot */}
          <View style={styles.amountHeader}>
            <Text style={styles.amountLabel}>Total Amount</Text>
            <Text style={styles.amountValue}>₹{payableAmount}</Text>
          </View>

          {/* Choose Payment Method Title */}
          <Text style={styles.sectionTitle}>Choose Payment Method</Text>

          {/* Options List matching screenshot */}
          <View style={styles.optionsList}>
            {paymentOptions.map((opt) => {
              const isSelected = selectedMethod === opt.id;
              return (
                <TouchableOpacity
                  key={opt.id}
                  style={[styles.paymentCard, isSelected && styles.paymentCardActive]}
                  onPress={() => setSelectedMethod(opt.id)}
                  activeOpacity={0.75}
                >
                  <View style={styles.cardLeft}>
                    <View style={styles.iconCircle}>
                      {opt.icon}
                    </View>
                    <Text style={styles.methodTitle}>{opt.title}</Text>
                  </View>

                  <View style={[styles.radioCircle, isSelected && styles.radioCircleActive]}>
                    {isSelected && <View style={styles.radioDot} />}
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Secure and Encrypted Payment Badge matching screenshot */}
          <View style={styles.securityBadge}>
            <Ionicons name="shield-checkmark" size={16} color="#059669" />
            <Text style={styles.securityText}>Secure and encrypted payment</Text>
          </View>

        </View>

        {/* Bottom Button matching screenshot */}
        <View style={styles.bottomBar}>
          <TouchableOpacity 
            style={[styles.payBtn, isConfirming && { opacity: 0.8 }]}
            onPress={handleOpenRazorpay}
            disabled={isConfirming}
            activeOpacity={0.85}
          >
            {isConfirming ? (
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                <ActivityIndicator size="small" color="#FFFFFF" />
                <Text style={styles.payBtnText}>Confirming Booking...</Text>
              </View>
            ) : (
              <Text style={styles.payBtnText}>Pay ₹{payableAmount}</Text>
            )}
          </TouchableOpacity>
        </View>

        {/* Real Razorpay Checkout Gateway Modal */}
        <RazorpayCheckoutModal
          visible={razorpayModalVisible}
          amount={payableAmount}
          orderId={razorpayOrderId}
          customerName={user?.name || 'Nikhil Chopade'}
          customerEmail={user?.email || 'nikhil@groupsave.demo'}
          customerPhone={user?.mobile || '9876543210'}
          serviceName={primaryItemName}
          onSuccess={handleRazorpaySuccess}
          onDismiss={() => setRazorpayModalVisible(false)}
        />

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
    justifyContent: 'space-between',
  },
  content: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  amountHeader: {
    marginBottom: 24,
  },
  amountLabel: {
    fontSize: 12,
    color: COLORS.textMuted,
    fontWeight: '500',
    marginBottom: 4,
  },
  amountValue: {
    fontSize: 28,
    fontWeight: '900',
    color: COLORS.textDark,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.textDark,
    marginBottom: 14,
  },
  optionsList: {
    gap: 12,
    marginBottom: 24,
  },
  paymentCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.white,
  },
  paymentCardActive: {
    borderColor: '#064E3B',
    backgroundColor: '#F0FDF4',
  },
  cardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  methodTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.textDark,
  },
  radioCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: COLORS.textLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioCircleActive: {
    borderColor: '#064E3B',
  },
  radioDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#064E3B',
  },
  securityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    alignSelf: 'center',
  },
  securityText: {
    fontSize: 11,
    color: '#059669',
    fontWeight: '600',
  },
  bottomBar: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderTopWidth: 1,
    borderTopColor: COLORS.borderLight,
    backgroundColor: COLORS.white,
  },
  payBtn: {
    backgroundColor: '#064E3B',
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  payBtnText: {
    color: COLORS.white,
    fontSize: 15,
    fontWeight: '800',
  },
});
