import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity, 
  Image, 
  StyleSheet, 
  SafeAreaView, 
  Alert
} from 'react-native';
import { Feather, Ionicons } from '@expo/vector-icons';
import { COLORS } from '../constants/theme';
import { useApp } from '../context/AppContext';
import Header from '../components/Header';

export default function BookingDetailsScreen() {
  const { selectedBooking, setBookings } = useApp();
  const [bookingStatus, setBookingStatus] = useState(selectedBooking?.status || 'Scheduled');
  const [scheduledDate, setScheduledDate] = useState(selectedBooking?.date || '21 Sep, 10:00 AM');

  useEffect(() => {
    if (selectedBooking) {
      setBookingStatus(selectedBooking.status || 'Scheduled');
      setScheduledDate(selectedBooking.date || '21 Sep, 10:00 AM');
    }
  }, [selectedBooking]);

  const booking = selectedBooking || {
    id: 'GS20250921001',
    title: 'AC Servicing (Single)',
    providerName: 'Cool Air Experts',
    date: scheduledDate,
    address: 'Room 101, DBATU Hostel, Lonere',
    providerRating: '4.8 (1.2k reviews)',
    status: bookingStatus,
    serviceOTP: '4829',
    step: 2
  };

  const refundAmount = booking.price ? String(booking.price).replace(/[^0-9]/g, '') : '599';

  const handleCall = () => {
    Alert.alert('Calling Provider', `Dialing ${booking.providerName} at +91 9845012345...`);
  };

  const handleChat = () => {
    Alert.alert('Provider Chat', `Opening technician live chat for Booking #${booking.id}`);
  };

  const handleReschedule = () => {
    Alert.alert(
      'Reschedule Service',
      'Select a new slot for your service:',
      [
        { 
          text: 'Tomorrow, 11:00 AM', 
          onPress: () => {
            const newDate = 'Tomorrow, 11:00 AM';
            setScheduledDate(newDate);
            if (setBookings && booking.id) {
              setBookings(prev => prev.map(b => b.id === booking.id ? { ...b, date: newDate } : b));
            }
          } 
        },
        { 
          text: 'Sunday, 02:00 PM', 
          onPress: () => {
            const newDate = 'Sunday, 02:00 PM';
            setScheduledDate(newDate);
            if (setBookings && booking.id) {
              setBookings(prev => prev.map(b => b.id === booking.id ? { ...b, date: newDate } : b));
            }
          } 
        },
        { text: 'Cancel', style: 'cancel' }
      ]
    );
  };

  const handleCancel = () => {
    Alert.alert(
      'Cancel Booking',
      `Are you sure you want to cancel this booking? 100% full refund of ₹${refundAmount} will be returned to your original payment method.`,
      [
        { text: 'No, Keep Booking', style: 'cancel' },
        { 
          text: 'Yes, Cancel & Refund', 
          style: 'destructive',
          onPress: () => {
            setBookingStatus('Cancelled');
            if (setBookings && booking.id) {
              setBookings(prev => prev.map(b => b.id === booking.id ? { ...b, status: 'Cancelled' } : b));
            }
            Alert.alert('Refund Initiated', `Your booking is cancelled. 100% full refund of ₹${refundAmount} will be returned. Refund Ref: GS-REF-` + Math.floor(100000 + Math.random() * 900000));
          }
        }
      ]
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        
        {/* Header matching screenshot */}
        <Header title="Booking Details" showBack={true} />

        <ScrollView 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Main Booking Summary Card matching screenshot */}
          <View style={styles.bookingCard}>
            
            <View style={styles.bookingCardHeader}>
              <Text style={styles.bookingIdText}>Booking ID: {booking.id}</Text>
              <View style={[styles.statusBadge, bookingStatus === 'Cancelled' && styles.cancelledBadge]}>
                <Text style={[styles.statusBadgeText, bookingStatus === 'Cancelled' && styles.cancelledBadgeText]}>
                  {bookingStatus}
                </Text>
              </View>
            </View>

            <View style={styles.bookingCardBody}>
              <Image 
                source={{ uri: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=200&q=80' }} 
                style={styles.serviceImage}
              />
              <View style={styles.serviceInfo}>
                <Text style={styles.serviceTitle}>{booking.title}</Text>
                <Text style={styles.providerName}>{booking.providerName}</Text>
              </View>
            </View>

            {/* Date & Time Row matching screenshot */}
            <View style={styles.detailRow}>
              <View style={styles.iconBox}>
                <Feather name="calendar" size={16} color={COLORS.primary} />
              </View>
              <View style={styles.detailTextWrapper}>
                <Text style={styles.detailLabel}>Date & Time</Text>
                <Text style={styles.detailValue}>{scheduledDate}</Text>
              </View>
            </View>

            {/* Service Address Row matching screenshot */}
            <View style={styles.detailRow}>
              <View style={styles.iconBox}>
                <Feather name="map-pin" size={16} color={COLORS.primary} />
              </View>
              <View style={styles.detailTextWrapper}>
                <Text style={styles.detailLabel}>Service Address</Text>
                <Text style={styles.detailValue}>{booking.address}</Text>
              </View>
            </View>

            {/* Provider Contact Row matching screenshot with Call & Chat buttons */}
            <View style={styles.providerRow}>
              <View style={styles.providerAvatarBox}>
                <Feather name="user" size={18} color="#6B7280" />
              </View>
              
              <View style={styles.providerMeta}>
                <Text style={styles.providerLabel}>Provider</Text>
                <Text style={styles.providerBusinessName}>{booking.providerName}</Text>
                <View style={styles.ratingRow}>
                  <Ionicons name="star" size={12} color={COLORS.yellowStar} />
                  <Text style={styles.ratingText}>{booking.providerRating}</Text>
                </View>
              </View>

              {/* Action Buttons: Phone Call & WhatsApp/Chat */}
              <View style={styles.actionButtons}>
                <TouchableOpacity style={styles.circleBtn} onPress={handleCall} activeOpacity={0.7}>
                  <Ionicons name="call" size={16} color="#059669" />
                </TouchableOpacity>

                <TouchableOpacity style={styles.circleBtn} onPress={handleChat} activeOpacity={0.7}>
                  <Ionicons name="chatbubble-ellipses" size={16} color="#059669" />
                </TouchableOpacity>
              </View>
            </View>

            {/* 4-Step Horizontal Stepper matching screenshot */}
            <View style={styles.stepperContainer}>
              
              {/* Step 1: Booked */}
              <View style={styles.stepItem}>
                <View style={[styles.stepCircle, styles.stepCircleActive]}>
                  <Ionicons name="checkmark" size={14} color="#FFFFFF" />
                </View>
                <Text style={[styles.stepLabel, styles.stepLabelActive]}>Booked</Text>
              </View>

              {/* Connecting line 1 */}
              <View style={[styles.stepLine, styles.stepLineActive]} />

              {/* Step 2: Upcoming */}
              <View style={styles.stepItem}>
                <View style={[styles.stepCircle, styles.stepCircleActive]}>
                  <Ionicons name="checkmark" size={14} color="#FFFFFF" />
                </View>
                <Text style={[styles.stepLabel, styles.stepLabelActive]}>Upcoming</Text>
              </View>

              {/* Connecting line 2 */}
              <View style={styles.stepLine} />

              {/* Step 3: In Progress */}
              <View style={styles.stepItem}>
                <View style={styles.stepCircle} />
                <Text style={styles.stepLabel}>In Progress</Text>
              </View>

              {/* Connecting line 3 */}
              <View style={styles.stepLine} />

              {/* Step 4: Completed */}
              <View style={styles.stepItem}>
                <View style={styles.stepCircle} />
                <Text style={styles.stepLabel}>Completed</Text>
              </View>

            </View>

            {/* Service OTP Card */}
            <View style={styles.otpCard}>
              <View style={styles.otpLeft}>
                <Text style={styles.otpLabel}>Service Start OTP</Text>
                <Text style={styles.otpSubtitle}>Share with technician upon arrival</Text>
              </View>
              <View style={styles.otpBadge}>
                <Text style={styles.otpText}>{booking.serviceOTP || '4829'}</Text>
              </View>
            </View>

            {/* Reschedule & Cancel Controls */}
            {bookingStatus !== 'Cancelled' && (
              <View style={styles.actionRow}>
                <TouchableOpacity 
                  style={styles.outlineActionBtn} 
                  onPress={handleReschedule}
                  activeOpacity={0.7}
                >
                  <Feather name="calendar" size={14} color="#075B46" style={{ marginRight: 6 }} />
                  <Text style={styles.outlineActionText}>Reschedule</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                  style={styles.cancelActionBtn} 
                  onPress={handleCancel}
                  activeOpacity={0.7}
                >
                  <Feather name="x-circle" size={14} color="#DC2626" style={{ marginRight: 6 }} />
                  <Text style={styles.cancelActionText}>Cancel</Text>
                </TouchableOpacity>
              </View>
            )}

          </View>

        </ScrollView>

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
  scrollContent: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  bookingCard: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 20,
  },
  bookingCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  bookingIdText: {
    fontSize: 11,
    color: COLORS.textMuted,
    fontWeight: '600',
  },
  statusBadge: {
    backgroundColor: '#D1FAE5',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusBadgeText: {
    color: '#059669',
    fontSize: 11,
    fontWeight: '700',
  },
  cancelledBadge: {
    backgroundColor: '#FEE2E2',
  },
  cancelledBadgeText: {
    color: '#DC2626',
  },
  bookingCardBody: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  serviceImage: {
    width: 60,
    height: 60,
    borderRadius: 10,
    backgroundColor: '#E5E7EB',
  },
  serviceInfo: {
    marginLeft: 12,
    flex: 1,
  },
  serviceTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.textDark,
    marginBottom: 2,
  },
  providerName: {
    fontSize: 12,
    color: COLORS.textMuted,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 14,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  iconBox: {
    width: 28,
    alignItems: 'center',
    marginTop: 2,
  },
  detailTextWrapper: {
    flex: 1,
    marginLeft: 4,
  },
  detailLabel: {
    fontSize: 11,
    color: COLORS.textMuted,
    marginBottom: 2,
  },
  detailValue: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.textDark,
  },
  providerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 14,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  providerAvatarBox: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  providerMeta: {
    flex: 1,
    marginLeft: 10,
  },
  providerLabel: {
    fontSize: 10,
    color: COLORS.textMuted,
  },
  providerBusinessName: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.textDark,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  ratingText: {
    fontSize: 11,
    color: COLORS.textMuted,
    marginLeft: 3,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  circleBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#ECFDF5',
    borderWidth: 1,
    borderColor: '#A7F3D0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepperContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 22,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingHorizontal: 8,
  },
  stepItem: {
    alignItems: 'center',
    width: 58,
  },
  stepCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: '#D1D5DB',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  stepCircleActive: {
    borderColor: '#059669',
    backgroundColor: '#059669',
  },
  stepLine: {
    flex: 1,
    height: 2,
    backgroundColor: '#E5E7EB',
    marginBottom: 16,
  },
  stepLineActive: {
    backgroundColor: '#059669',
  },
  stepLabel: {
    fontSize: 10,
    color: '#9CA3AF',
    textAlign: 'center',
  },
  stepLabelActive: {
    color: '#059669',
    fontWeight: '700',
  },
  otpCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    borderWidth: 1,
    borderColor: '#FDE68A',
    borderRadius: 12,
    padding: 12,
    marginTop: 18,
  },
  otpLeft: {
    flex: 1,
  },
  otpLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#92400E',
  },
  otpSubtitle: {
    fontSize: 10,
    color: '#B45309',
    marginTop: 1,
  },
  otpBadge: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#FCD34D',
  },
  otpText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#92400E',
    letterSpacing: 2,
  },
  actionRow: {
    flexDirection: 'row',
    marginTop: 14,
    gap: 10,
  },
  outlineActionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#075B46',
    backgroundColor: '#F0F9F6',
  },
  outlineActionText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#075B46',
  },
  cancelActionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#FCA5A5',
    backgroundColor: '#FEF2F2',
  },
  cancelActionText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#DC2626',
  },
});
