import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  SafeAreaView 
} from 'react-native';
import { Feather, Ionicons, FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS } from '../constants/theme';
import { useApp } from '../context/AppContext';
import Header from '../components/Header';

export default function PaymentScreen() {
  const { navigate, totalAmount, confirmCurrentBooking } = useApp();
  const [selectedMethod, setSelectedMethod] = useState('UPI');

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

  const handlePay = () => {
    confirmCurrentBooking(selectedMethod);
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
            style={styles.payBtn}
            onPress={handlePay}
            activeOpacity={0.85}
          >
            <Text style={styles.payBtnText}>Pay ₹{totalAmount || 1197}</Text>
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

