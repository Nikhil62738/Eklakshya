import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  SafeAreaView,
  ActivityIndicator,
  Modal
} from 'react-native';
import { Feather, Ionicons } from '@expo/vector-icons';
import { COLORS } from '../constants/theme';
import { useApp } from '../context/AppContext';
import Header from '../components/Header';

export default function PaymentScreen() {
  const { navigate, totalAmount, confirmCurrentBooking } = useApp();
  const [selectedMethod, setSelectedMethod] = useState('UPI');
  const [isProcessing, setIsProcessing] = useState(false);
  const [processStatus, setProcessStatus] = useState('');

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

  const handlePay = async () => {
    setIsProcessing(true);
    setProcessStatus('Connecting to Razorpay gateway...');
    try {
      await confirmCurrentBooking(selectedMethod, (status) => {
        setProcessStatus(status);
      });
    } catch (err) {
      console.error('Payment error:', err);
    } finally {
      setIsProcessing(false);
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
            <Text style={styles.amountValue}>₹{totalAmount || 1197}</Text>
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
                  disabled={isProcessing}
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
            <Text style={styles.securityText}>Razorpay 256-bit encrypted checkout</Text>
          </View>

        </View>

        {/* Bottom Button matching screenshot */}
        <View style={styles.bottomBar}>
          <TouchableOpacity 
            style={[styles.payBtn, isProcessing && styles.payBtnDisabled]}
            onPress={handlePay}
            activeOpacity={0.85}
            disabled={isProcessing}
          >
            {isProcessing ? (
              <View style={styles.loadingRow}>
                <ActivityIndicator size="small" color="#FFFFFF" style={{ marginRight: 8 }} />
                <Text style={styles.payBtnText}>Verifying Payment...</Text>
              </View>
            ) : (
              <Text style={styles.payBtnText}>Pay ₹{totalAmount || 1197}</Text>
            )}
          </TouchableOpacity>
        </View>

        {/* Processing Modal Overlay */}
        <Modal
          visible={isProcessing}
          transparent={true}
          animationType="fade"
        >
          <View style={styles.modalOverlay}>
            <View style={styles.processingCard}>
              <View style={styles.shieldCircle}>
                <Ionicons name="shield-checkmark" size={32} color="#075B46" />
              </View>

              <Text style={styles.processingTitle}>Razorpay Secure Payment</Text>
              <Text style={styles.processingStatus}>
                {processStatus || 'Verifying transaction with server...'}
              </Text>

              <ActivityIndicator size="large" color="#075B46" style={{ marginTop: 16 }} />

              <Text style={styles.processingSub}>
                Please do not close the app or press back
              </Text>
            </View>
          </View>
        </Modal>

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
  payBtnDisabled: {
    opacity: 0.7,
  },
  payBtnText: {
    color: COLORS.white,
    fontSize: 15,
    fontWeight: '800',
  },
  loadingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  processingCard: {
    width: '100%',
    maxWidth: 320,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 8,
  },
  shieldCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#DDF5EA',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  processingTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.textDark,
    marginBottom: 4,
  },
  processingStatus: {
    fontSize: 12,
    color: '#059669',
    fontWeight: '600',
    textAlign: 'center',
    marginTop: 4,
  },
  processingSub: {
    fontSize: 10,
    color: COLORS.textMuted,
    textAlign: 'center',
    marginTop: 14,
  },
});
