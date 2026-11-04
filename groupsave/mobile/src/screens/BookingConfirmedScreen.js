import React from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  Image, 
  StyleSheet, 
  SafeAreaView 
} from 'react-native';
import Svg, { Circle, Rect } from 'react-native-svg';
import { Feather, Ionicons } from '@expo/vector-icons';
import { COLORS } from '../constants/theme';
import { useApp } from '../context/AppContext';

export default function BookingConfirmedScreen() {
  const { navigate, cartItems, selectedBooking } = useApp();
  const bookingId = selectedBooking?.id || 'GS20250921001';

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        
        {/* Top Checkmark and Confetti Animation Header */}
        <View style={styles.headerSection}>
          
          {/* Confetti particles */}
          <View style={styles.confettiWrapper}>
            <Svg height="100" width="160" viewBox="0 0 160 100" style={styles.confettiSvg}>
              <Circle cx="20" cy="30" r="4" fill="#F59E0B" />
              <Circle cx="40" cy="15" r="3" fill="#EC4899" />
              <Rect x="25" y="60" width="5" height="10" rx="2" fill="#3B82F6" transform="rotate(25, 25, 60)" />
              <Rect x="120" y="25" width="5" height="10" rx="2" fill="#10B981" transform="rotate(-30, 120, 25)" />
              <Circle cx="140" cy="50" r="4" fill="#F59E0B" />
              <Circle cx="130" cy="80" r="3" fill="#EC4899" />
              <Rect x="105" y="10" width="4" height="8" rx="2" fill="#8B5CF6" transform="rotate(45, 105, 10)" />
              <Circle cx="15" cy="85" r="3" fill="#10B981" />
            </Svg>

            {/* Green Circle Checkmark */}
            <View style={styles.checkCircle}>
              <Ionicons name="checkmark" size={38} color={COLORS.white} />
            </View>
          </View>

          <Text style={styles.title}>Booking Confirmed!</Text>
          <Text style={styles.subtitle}>Your booking has been confirmed.</Text>

          <View style={styles.bookingIdBox}>
            <Text style={styles.bookingIdLabel}>Booking ID</Text>
            <Text style={styles.bookingIdValue}>{bookingId}</Text>
          </View>
        </View>

        {/* Booked Items Cards matching screenshot */}
        <View style={styles.itemsSection}>
          
          {/* Card 1: AC Servicing (Single) */}
          <View style={styles.itemCard}>
            <Image 
              source={{ uri: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=200&q=80' }} 
              style={styles.itemImage} 
            />
            <View style={styles.itemInfo}>
              <Text style={styles.itemTitle}>AC Servicing (Single)</Text>
              <Text style={styles.providerName}>Cool Air Experts</Text>
              <Text style={styles.metaText}>{selectedBooking?.price || '₹599'} • {selectedBooking?.date || '21 Sep, 10:00 AM'}</Text>
            </View>
          </View>

          {/* Card 2: AC Servicing (Group) */}
          <View style={styles.itemCard}>
            <Image 
              source={{ uri: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=200&q=80' }} 
              style={styles.itemImage} 
            />
            <View style={styles.itemInfo}>
              <Text style={styles.itemTitle}>AC Servicing (Group)</Text>
              <Text style={styles.providerName}>Cool Air Experts</Text>
              <Text style={styles.metaText}>₹599 • Group Deal</Text>
              <Text style={styles.joinText}>Join: 12/20</Text>
            </View>
          </View>

        </View>

        {/* Action Buttons matching screenshot */}
        <View style={styles.actionsSection}>
          <TouchableOpacity 
            style={styles.trackBtn}
            onPress={() => navigate('BOOKING_DETAILS')}
            activeOpacity={0.85}
          >
            <Text style={styles.trackBtnText}>Track Booking</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.homeBtn}
            onPress={() => navigate('HOME')}
            activeOpacity={0.7}
          >
            <Text style={styles.homeBtnText}>Back to Home</Text>
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
    paddingHorizontal: 20,
    justifyContent: 'space-between',
    paddingVertical: 16,
  },
  headerSection: {
    alignItems: 'center',
    marginTop: 10,
  },
  confettiWrapper: {
    width: 160,
    height: 100,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    marginBottom: 8,
  },
  confettiSvg: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
  checkCircle: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: '#059669',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#059669',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 4,
  },
  title: {
    fontSize: 22,
    fontWeight: '900',
    color: COLORS.textDark,
    marginTop: 10,
  },
  subtitle: {
    fontSize: 12,
    color: COLORS.textMuted,
    marginTop: 4,
  },
  bookingIdBox: {
    alignItems: 'center',
    marginTop: 14,
  },
  bookingIdLabel: {
    fontSize: 11,
    color: COLORS.textMuted,
    fontWeight: '500',
  },
  bookingIdValue: {
    fontSize: 13,
    fontWeight: '800',
    color: COLORS.textDark,
    marginTop: 2,
  },
  itemsSection: {
    gap: 12,
    marginVertical: 16,
  },
  itemCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  itemImage: {
    width: 58,
    height: 58,
    borderRadius: 10,
    backgroundColor: '#E5E7EB',
  },
  itemInfo: {
    flex: 1,
    marginLeft: 12,
  },
  itemTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.textDark,
  },
  providerName: {
    fontSize: 11,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  metaText: {
    fontSize: 11,
    color: COLORS.textDark,
    fontWeight: '600',
    marginTop: 2,
  },
  joinText: {
    fontSize: 10,
    color: COLORS.textMuted,
    fontWeight: '500',
  },
  actionsSection: {
    gap: 10,
    marginBottom: 6,
  },
  trackBtn: {
    backgroundColor: '#064E3B',
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  trackBtnText: {
    color: COLORS.white,
    fontSize: 15,
    fontWeight: '800',
  },
  homeBtn: {
    backgroundColor: COLORS.white,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  homeBtnText: {
    color: COLORS.textDark,
    fontSize: 14,
    fontWeight: '700',
  },
});

