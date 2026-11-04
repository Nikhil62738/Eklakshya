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
import { Feather, Ionicons } from '@expo/vector-icons';
import { COLORS } from '../constants/theme';
import { useApp } from '../context/AppContext';
import Header from '../components/Header';

export default function ServiceDetailSingleScreen() {
  const { navigate, selectedProvider, addToCart } = useApp();
  const provider = selectedProvider || {
    name: 'Cool Air Experts',
    rating: '4.8',
    reviewsCount: '1.2k',
    distance: '2.3 km away',
    experience: '4+ yrs exp',
    price: 599,
    originalPrice: 799,
    discount: '25% OFF'
  };

  const [selectedDate, setSelectedDate] = useState('Today\n20 Sep');
  const [selectedTime, setSelectedTime] = useState('11:00 AM');
  const [isLiked, setIsLiked] = useState(false);

  const dates = [
    'Today\n20 Sep',
    'Tomorrow\n21 Sep',
    'Sun\n22 Sep'
  ];

  const timeSlots = [
    '9:00 AM',
    '11:00 AM',
    '2:00 PM'
  ];

  const handleBookNow = () => {
    addToCart({
      id: `single_${provider.name}_${Date.now()}`,
      type: 'SINGLE',
      title: 'AC Servicing',
      providerName: provider.name,
      price: provider.price || 599,
      quantity: 1,
      image: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=300&q=80'
    });
    navigate('CART');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        
        {/* Header matching screenshot */}
        <Header 
          title="AC Servicing - Single" 
          showBack={true} 
          showHeart={true}
          isLiked={isLiked}
          onHeartPress={() => setIsLiked(!isLiked)}
        />

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          
          {/* Hero Banner Image */}
          <View style={styles.heroImageContainer}>
            <Image
              source={{ uri: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80' }}
              style={styles.heroImage}
              resizeMode="cover"
            />
          </View>

          {/* Provider Card */}
          <View style={styles.providerCard}>
            <Image
              source={{ uri: provider.avatar || 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=200&q=80' }}
              style={styles.providerAvatar}
            />
            <View style={styles.providerInfo}>
              <Text style={styles.providerName}>{provider.name}</Text>
              <View style={styles.providerMeta}>
                <Ionicons name="star" size={13} color={COLORS.yellowStar} />
                <Text style={styles.ratingText}>{provider.rating} ({provider.reviewsCount} reviews)</Text>
              </View>
              <Text style={styles.expText}>{provider.distance} • {provider.experience}</Text>
            </View>

            <TouchableOpacity onPress={() => setIsLiked(!isLiked)}>
              <Feather name={isLiked ? "heart" : "heart"} size={18} color={isLiked ? COLORS.badgeRed : COLORS.textMuted} />
            </TouchableOpacity>
          </View>

          {/* Checklist of Included Services */}
          <View style={styles.checklistSection}>
            {[
              { icon: 'settings', text: 'AC Cleaning & Service' },
              { icon: 'search', text: 'Gas Leak Check' },
              { icon: 'filter', text: 'Filter Cleaning' },
              { icon: 'shield', text: '1 Month Service Warranty' },
            ].map((item, index) => (
              <View key={index} style={styles.checkItem}>
                <Feather name={item.icon} size={15} color={COLORS.textDark} style={styles.checkIcon} />
                <Text style={styles.checkText}>{item.text}</Text>
              </View>
            ))}
          </View>

          {/* Pricing Row */}
          <View style={styles.priceRow}>
            <View style={styles.priceLeft}>
              <Text style={styles.currentPrice}>₹{provider.price || 599}</Text>
              <Text style={styles.oldPrice}>₹{provider.originalPrice || 799}</Text>
            </View>
            <View style={styles.discountBadge}>
              <Text style={styles.discountText}>{provider.discount || '25% OFF'}</Text>
            </View>
          </View>

          {/* Select Date & Time */}
          <View style={styles.scheduleSection}>
            <Text style={styles.scheduleTitle}>Select Date & Time</Text>

            {/* Date Pills */}
            <View style={styles.datesRow}>
              {dates.map((d, index) => {
                const isSelected = selectedDate === d;
                return (
                  <TouchableOpacity
                    key={index}
                    style={[styles.datePill, isSelected && styles.datePillActive]}
                    onPress={() => setSelectedDate(d)}
                    activeOpacity={0.75}
                  >
                    <Text style={[styles.datePillText, isSelected && styles.datePillTextActive]}>
                      {d}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Time Slot Pills */}
            <View style={styles.timesRow}>
              {timeSlots.map((t, index) => {
                const isSelected = selectedTime === t;
                return (
                  <TouchableOpacity
                    key={index}
                    style={[styles.timePill, isSelected && styles.timePillActive]}
                    onPress={() => setSelectedTime(t)}
                    activeOpacity={0.75}
                  >
                    <Text style={[styles.timePillText, isSelected && styles.timePillTextActive]}>
                      {t}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* Switch to Group Deal Option */}
          <TouchableOpacity 
            style={styles.groupDealBanner}
            onPress={() => navigate('SERVICE_DETAIL_GROUP', { provider })}
            activeOpacity={0.8}
          >
            <View style={styles.groupDealBannerLeft}>
              <Feather name="users" size={16} color="#064E3B" />
              <Text style={styles.groupDealBannerText}>Want to save more? Join Group Deal (From ₹599)</Text>
            </View>
            <Feather name="chevron-right" size={16} color="#064E3B" />
          </TouchableOpacity>

        </ScrollView>

        {/* Bottom Sticky Button: Book Now */}
        <View style={styles.bottomBar}>
          <TouchableOpacity 
            style={styles.bookNowBtn}
            onPress={handleBookNow}
            activeOpacity={0.85}
          >
            <Text style={styles.bookNowText}>Book Now</Text>
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
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 24,
  },
  heroImageContainer: {
    height: 180,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#E5E7EB',
    marginBottom: 16,
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  providerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
    marginBottom: 16,
  },
  providerAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#E5E7EB',
  },
  providerInfo: {
    flex: 1,
    marginLeft: 12,
  },
  providerName: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.textDark,
  },
  providerMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
  },
  ratingText: {
    fontSize: 11,
    fontWeight: '600',
    color: COLORS.textMuted,
  },
  expText: {
    fontSize: 11,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  checklistSection: {
    gap: 10,
    marginBottom: 18,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
  },
  checkItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  checkIcon: {
    width: 18,
  },
  checkText: {
    fontSize: 13,
    color: COLORS.textDark,
    fontWeight: '500',
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  priceLeft: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 8,
  },
  currentPrice: {
    fontSize: 24,
    fontWeight: '900',
    color: COLORS.textDark,
  },
  oldPrice: {
    fontSize: 16,
    color: COLORS.textMuted,
    textDecorationLine: 'line-through',
  },
  discountBadge: {
    backgroundColor: '#D1FAE5',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  discountText: {
    color: '#059669',
    fontSize: 11,
    fontWeight: '800',
  },
  scheduleSection: {
    marginBottom: 20,
  },
  scheduleTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.textDark,
    marginBottom: 12,
  },
  datesRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 12,
  },
  datePill: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderRadius: 12,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  datePillActive: {
    borderColor: '#064E3B',
    backgroundColor: '#F0FDF4',
    borderWidth: 1.5,
  },
  datePillText: {
    fontSize: 11,
    fontWeight: '600',
    color: COLORS.textDark,
    textAlign: 'center',
    lineHeight: 16,
  },
  datePillTextActive: {
    color: '#064E3B',
    fontWeight: '700',
  },
  timesRow: {
    flexDirection: 'row',
    gap: 10,
  },
  timePill: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  timePillActive: {
    borderColor: '#064E3B',
    backgroundColor: '#F0FDF4',
    borderWidth: 1.5,
  },
  timePillText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.textDark,
  },
  timePillTextActive: {
    color: '#064E3B',
    fontWeight: '700',
  },
  groupDealBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#D1FAE5',
    padding: 12,
    borderRadius: 12,
    marginTop: 6,
  },
  groupDealBannerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  groupDealBannerText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#064E3B',
  },
  bottomBar: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: COLORS.borderLight,
    backgroundColor: COLORS.white,
  },
  bookNowBtn: {
    backgroundColor: '#064E3B',
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bookNowText: {
    color: COLORS.white,
    fontSize: 15,
    fontWeight: '800',
  },
});

