import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  Platform,
} from 'react-native';
import { Feather, Ionicons, FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS } from '../constants/theme';

export default function RazorpayCheckoutModal({
  visible,
  amount,
  orderId,
  customerName = 'Nikhil Chopade',
  customerEmail = 'nikhil@groupsave.demo',
  customerPhone = '9876543210',
  serviceName = 'AC Servicing',
  onSuccess,
  onDismiss,
}) {
  const [selectedTab, setSelectedTab] = useState('UPI'); // UPI, CARD, NETBANKING
  const [selectedUpiApp, setSelectedUpiApp] = useState('GPAY');
  const [upiId, setUpiId] = useState('');
  const [cardNumber, setCardNumber] = useState('4532 8921 4452 4242');
  const [cardExpiry, setCardExpiry] = useState('12/28');
  const [cardCvv, setCardCvv] = useState('821');
  const [selectedBank, setSelectedBank] = useState('HDFC');
  const [status, setStatus] = useState('IDLE'); // IDLE, PROCESSING, SUCCESS, FAILED
  const [statusMessage, setStatusMessage] = useState('');

  // Retain Modal in component tree so native Android/iOS dialog transitions work reliably
  const displayOrderId = orderId || `order_${Math.random().toString(36).substring(2, 14)}`;

  const handleProcessPayment = () => {
    setStatus('PROCESSING');
    setStatusMessage('Contacting payment gateway...');

    setTimeout(() => {
      setStatusMessage('Authorizing with your bank...');
    }, 900);

    setTimeout(() => {
      setStatusMessage('Verifying cryptographic signature on server...');
    }, 1700);

    setTimeout(() => {
      setStatus('SUCCESS');
      setStatusMessage('Payment Successful!');

      const paymentResult = {
        razorpay_order_id: displayOrderId,
        razorpay_payment_id: `pay_${Math.random().toString(36).substring(2, 14)}`,
        razorpay_signature: 'mock_valid_signature',
        amount,
        method: selectedTab,
      };

      setTimeout(() => {
        setStatus('IDLE');
        onSuccess(paymentResult);
      }, 700);
    }, 2400);
  };

  const upiApps = [
    { id: 'GPAY', name: 'Google Pay', icon: 'google', color: '#4285F4' },
    { id: 'PHONEPE', name: 'PhonePe', icon: 'smartphone', color: '#5F259F' },
    { id: 'PAYTM', name: 'Paytm UPI', icon: 'shield', color: '#00BAF2' },
    { id: 'BHIM', name: 'BHIM UPI', icon: 'check-circle', color: '#F37021' },
  ];

  const banks = [
    { id: 'HDFC', name: 'HDFC Bank' },
    { id: 'SBI', name: 'State Bank of India' },
    { id: 'ICICI', name: 'ICICI Bank' },
    { id: 'AXIS', name: 'Axis Bank' },
    { id: 'KOTAK', name: 'Kotak Mahindra' },
  ];

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={status === 'PROCESSING' ? () => {} : onDismiss}
    >
      <View style={styles.overlay}>
        <View style={styles.modalSheet}>
          
          {/* Razorpay Brand Header */}
          <View style={styles.rzpHeader}>
            <View style={styles.rzpHeaderLeft}>
              <View style={styles.rzpLogoBadge}>
                <Ionicons name="flash" size={16} color="#FFFFFF" />
              </View>
              <View>
                <Text style={styles.merchantName}>GroupSave Technologies</Text>
                <Text style={styles.orderSubtitle}>Order ID: {displayOrderId}</Text>
              </View>
            </View>

            <TouchableOpacity 
              onPress={onDismiss} 
              disabled={status === 'PROCESSING'}
              style={styles.closeBtn}
            >
              <Feather name="x" size={20} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          {/* Amount Ribbon */}
          <View style={styles.amountRibbon}>
            <View>
              <Text style={styles.amountLabel}>Total Payable Amount</Text>
              <Text style={styles.serviceItemName}>{serviceName}</Text>
            </View>
            <Text style={styles.amountValue}>₹{amount}</Text>
          </View>

          {/* Processing State */}
          {status === 'PROCESSING' || status === 'SUCCESS' ? (
            <View style={styles.processingContainer}>
              {status === 'PROCESSING' ? (
                <ActivityIndicator size="large" color="#0284C7" style={{ marginBottom: 16 }} />
              ) : (
                <View style={styles.successIconCircle}>
                  <Ionicons name="checkmark" size={36} color="#FFFFFF" />
                </View>
              )}
              <Text style={styles.processingTitle}>
                {status === 'SUCCESS' ? 'Payment Verified!' : 'Processing Payment'}
              </Text>
              <Text style={styles.processingDesc}>{statusMessage}</Text>
              <View style={styles.secureFooter}>
                <Ionicons name="shield-checkmark" size={14} color="#059669" />
                <Text style={styles.secureFooterText}>Razorpay 256-Bit SSL Encryption</Text>
              </View>
            </View>
          ) : (
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.bodyScroll}>
              
              {/* Payment Tab Switcher */}
              <View style={styles.tabBar}>
                {['UPI', 'CARD', 'NETBANKING'].map((tab) => {
                  const isActive = selectedTab === tab;
                  return (
                    <TouchableOpacity
                      key={tab}
                      style={[styles.tabButton, isActive && styles.tabButtonActive]}
                      onPress={() => setSelectedTab(tab)}
                      activeOpacity={0.7}
                    >
                      <Text style={[styles.tabText, isActive && styles.tabTextActive]}>
                        {tab === 'CARD' ? 'Card' : tab === 'NETBANKING' ? 'NetBanking' : 'UPI'}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>

              {/* UPI Tab View */}
              {selectedTab === 'UPI' && (
                <View style={styles.tabContent}>
                  <Text style={styles.sectionHeader}>Instant UPI Apps</Text>
                  <View style={styles.upiGrid}>
                    {upiApps.map((app) => {
                      const isSel = selectedUpiApp === app.id;
                      return (
                        <TouchableOpacity
                          key={app.id}
                          style={[styles.upiCard, isSel && styles.upiCardActive]}
                          onPress={() => setSelectedUpiApp(app.id)}
                          activeOpacity={0.75}
                        >
                          <View style={[styles.upiIconBox, { backgroundColor: `${app.color}15` }]}>
                            <Feather name={app.icon} size={18} color={app.color} />
                          </View>
                          <Text style={styles.upiAppName}>{app.name}</Text>
                          {isSel && (
                            <View style={styles.upiCheck}>
                              <Ionicons name="checkmark-circle" size={16} color="#0284C7" />
                            </View>
                          )}
                        </TouchableOpacity>
                      );
                    })}
                  </View>

                  <View style={styles.orDivider}>
                    <View style={styles.line} />
                    <Text style={styles.orText}>OR ENTER UPI ID</Text>
                    <View style={styles.line} />
                  </View>

                  <View style={styles.upiInputRow}>
                    <TextInput
                      style={styles.upiInput}
                      placeholder="e.g. 9876543210@paytm or user@okhdfcbank"
                      placeholderTextColor="#9CA3AF"
                      value={upiId}
                      onChangeText={setUpiId}
                      autoCapitalize="none"
                    />
                  </View>
                </View>
              )}

              {/* Card Tab View */}
              {selectedTab === 'CARD' && (
                <View style={styles.tabContent}>
                  <Text style={styles.sectionHeader}>Debit or Credit Card</Text>

                  <View style={styles.fieldBlock}>
                    <Text style={styles.fieldLabel}>Card Number</Text>
                    <View style={styles.cardInputRow}>
                      <TextInput
                        style={styles.fieldInput}
                        value={cardNumber}
                        onChangeText={setCardNumber}
                        placeholder="•••• •••• •••• 4242"
                        keyboardType="number-pad"
                      />
                      <Ionicons name="card-outline" size={20} color="#0284C7" />
                    </View>
                  </View>

                  <View style={styles.twoColRow}>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.fieldLabel}>Expiry Date</Text>
                      <TextInput
                        style={styles.fieldInput}
                        value={cardExpiry}
                        onChangeText={setCardExpiry}
                        placeholder="MM/YY"
                        keyboardType="number-pad"
                      />
                    </View>
                    <View style={{ width: 14 }} />
                    <View style={{ flex: 1 }}>
                      <Text style={styles.fieldLabel}>CVV</Text>
                      <TextInput
                        style={styles.fieldInput}
                        value={cardCvv}
                        onChangeText={setCardCvv}
                        placeholder="•••"
                        secureTextEntry
                        keyboardType="number-pad"
                      />
                    </View>
                  </View>

                  <View style={styles.cardholderNote}>
                    <Feather name="shield" size={13} color="#059669" />
                    <Text style={styles.cardholderText}>Cards saved securely under RBI tokenization guidelines</Text>
                  </View>
                </View>
              )}

              {/* NetBanking Tab View */}
              {selectedTab === 'NETBANKING' && (
                <View style={styles.tabContent}>
                  <Text style={styles.sectionHeader}>Popular Indian Banks</Text>
                  <View style={styles.banksList}>
                    {banks.map((b) => {
                      const isSel = selectedBank === b.id;
                      return (
                        <TouchableOpacity
                          key={b.id}
                          style={[styles.bankRow, isSel && styles.bankRowActive]}
                          onPress={() => setSelectedBank(b.id)}
                          activeOpacity={0.7}
                        >
                          <Ionicons 
                            name="business-outline" 
                            size={18} 
                            color={isSel ? '#0284C7' : '#6B7280'} 
                          />
                          <Text style={[styles.bankName, isSel && styles.bankNameActive]}>
                            {b.name}
                          </Text>
                          {isSel && (
                            <Ionicons name="checkmark-circle" size={18} color="#0284C7" />
                          )}
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                </View>
              )}

              {/* Pay Now Button */}
              <TouchableOpacity
                style={styles.payButton}
                onPress={handleProcessPayment}
                activeOpacity={0.85}
              >
                <Ionicons name="lock-closed" size={16} color="#FFFFFF" style={{ marginRight: 6 }} />
                <Text style={styles.payButtonText}>Pay ₹{amount}</Text>
              </TouchableOpacity>

              {/* Razorpay Trust Badge */}
              <View style={styles.trustBadge}>
                <Text style={styles.trustText}>Secured by</Text>
                <View style={styles.rzpBrandChip}>
                  <Text style={styles.rzpBrandText}>Razorpay</Text>
                </View>
              </View>

            </ScrollView>
          )}

        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    justifyContent: 'flex-end',
  },
  modalSheet: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '85%',
    overflow: 'hidden',
  },
  rzpHeader: {
    backgroundColor: '#0C2340',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
    paddingVertical: 14,
  },
  rzpHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  rzpLogoBadge: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#0284C7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  merchantName: {
    fontSize: 14,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.3,
  },
  orderSubtitle: {
    fontSize: 10,
    color: '#94A3B8',
    marginTop: 1,
  },
  closeBtn: {
    padding: 6,
  },
  amountRibbon: {
    backgroundColor: '#F1F5F9',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  amountLabel: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '600',
  },
  serviceItemName: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A',
    marginTop: 2,
  },
  amountValue: {
    fontSize: 22,
    fontWeight: '900',
    color: '#0284C7',
  },
  bodyScroll: {
    paddingHorizontal: 18,
    paddingVertical: 16,
    paddingBottom: 32,
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#F1F5F9',
    borderRadius: 12,
    padding: 4,
    marginBottom: 16,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 10,
  },
  tabButtonActive: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  tabText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B',
  },
  tabTextActive: {
    color: '#0284C7',
    fontWeight: '800',
  },
  tabContent: {
    marginBottom: 16,
  },
  sectionHeader: {
    fontSize: 12,
    fontWeight: '700',
    color: '#334155',
    marginBottom: 10,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  upiGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  upiCard: {
    width: '48%',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    padding: 10,
    gap: 8,
    position: 'relative',
  },
  upiCardActive: {
    borderColor: '#0284C7',
    backgroundColor: '#F0F9FF',
  },
  upiIconBox: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  upiAppName: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1E293B',
    flex: 1,
  },
  upiCheck: {
    position: 'absolute',
    top: 6,
    right: 6,
  },
  orDivider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 14,
    gap: 8,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: '#E2E8F0',
  },
  orText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#94A3B8',
    letterSpacing: 0.5,
  },
  upiInputRow: {
    backgroundColor: '#F8FAFC',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    paddingHorizontal: 12,
    height: 44,
    justifyContent: 'center',
  },
  upiInput: {
    fontSize: 13,
    color: '#0F172A',
  },
  fieldBlock: {
    marginBottom: 12,
  },
  fieldLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#64748B',
    marginBottom: 4,
  },
  cardInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F8FAFC',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    paddingHorizontal: 12,
    height: 44,
  },
  fieldInput: {
    fontSize: 13,
    color: '#0F172A',
    backgroundColor: '#F8FAFC',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    paddingHorizontal: 12,
    height: 44,
  },
  twoColRow: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  cardholderNote: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 4,
  },
  cardholderText: {
    fontSize: 10,
    color: '#059669',
    fontWeight: '500',
    flex: 1,
  },
  banksList: {
    gap: 6,
  },
  bankRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 10,
  },
  bankRowActive: {
    borderColor: '#0284C7',
    backgroundColor: '#F0F9FF',
  },
  bankName: {
    fontSize: 13,
    fontWeight: '600',
    color: '#334155',
    flex: 1,
  },
  bankNameActive: {
    color: '#0284C7',
    fontWeight: '700',
  },
  payButton: {
    backgroundColor: '#0284C7',
    height: 50,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#0284C7',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
    marginTop: 8,
  },
  payButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
  },
  trustBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginTop: 16,
  },
  trustText: {
    fontSize: 11,
    color: '#94A3B8',
    fontWeight: '600',
  },
  rzpBrandChip: {
    backgroundColor: '#0C2340',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  rzpBrandText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  processingContainer: {
    paddingVertical: 48,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  successIconCircle: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: '#059669',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  processingTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#0F172A',
    marginBottom: 6,
  },
  processingDesc: {
    fontSize: 13,
    color: '#64748B',
    textAlign: 'center',
    marginBottom: 20,
  },
  secureFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  secureFooterText: {
    fontSize: 11,
    color: '#059669',
    fontWeight: '600',
  },
});

