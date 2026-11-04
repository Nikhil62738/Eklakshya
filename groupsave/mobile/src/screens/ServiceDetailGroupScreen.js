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
import { Feather, Ionicons, MaterialIcons } from '@expo/vector-icons';
import { COLORS } from '../constants/theme';
import { useApp } from '../context/AppContext';
import Header from '../components/Header';

export default function ServiceDetailGroupScreen() {
  const { navigate, selectedProvider, addToCart } = useApp();
  const provider = selectedProvider || {
    name: 'Cool Air Experts',
    rating: '4.8',
    reviewsCount: '1.2k',
    price: 599,
  };

  const [isLiked, setIsLiked] = useState(false);

  const handleJoinGroup = () => {
    addToCart({
      id: `group_${provider.name}_${Date.now()}`,
      type: 'GROUP',
      title: 'AC Servicing (Group)',
      providerName: provider.name,
      price: 599,
      quantity: 1,
      joinStatus: 'Join: 12/20',
      image: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=300&q=80'
    });
    navigate('CART');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        
        {/* Header matching screenshot */}
        <Header 
          title="AC Servicing - Group Deal" 
          showBack={true} 
          showHeart={true}
          isLiked={isLiked}
          onHeartPress={() => setIsLiked(!isLiked)}
        />

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          
          {/* Hero Image with Overlay Badges matching screenshot */}
          <View style={styles.heroImageContainer}>
            <Image
              source={{ uri: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=600&q=80' }}
              style={styles.heroImage}
              resizeMode="cover"
            />

            {/* Top-Left Red Badge: Group Deal */}
            <View style={styles.groupDealTag}>
              <Text style={styles.groupDealTagText}>Group Deal</Text>
            </View>

            {/* Top-Right Green Badge: 20-50% OFF */}
            <View style={styles.discountTag}>
              <Text style={styles.discountTagText}>20~50% OFF</Text>
            </View>
          </View>

          {/* Provider Card matching screenshot */}
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
              <Text style={styles.expText}>Min. 10 bookings • 4.2 km</Text>
            </View>
          </View>

          {/* Pricing Tiers Table (3 Columns matching screenshot) */}
          <View style={styles.tiersContainer}>
            <View style={styles.tierCol}>
              <Text style={styles.tierRange}>10 - 19</Text>
              <Text style={styles.tierPrice}>₹699</Text>
            </View>

            <View style={[styles.tierCol, styles.tierColActive]}>
              <Text style={[styles.tierRange, styles.tierRangeActive]}>20 - 29</Text>
              <Text style={[styles.tierPrice, styles.tierPriceActive]}>₹649</Text>
            </View>

            <View style={styles.tierCol}>
              <Text style={styles.tierRange}>30+</Text>
              <Text style={styles.tierPrice}>₹599</Text>
            </View>
          </View>

          {/* Live Progress Tracker matching screenshot */}
          <View style={styles.progressSection}>
            <View style={styles.progressHeader}>
              <Text style={styles.joinedCount}>12/20 joined</Text>
              <Text style={styles.slotsLeft}>8 slots left</Text>
            </View>

            <View style={styles.progressBarTrack}>
              <View style={[styles.progressBarFill, { width: '60%' }]} />
            </View>
          </View>

          {/* Service Date Card matching screenshot */}
          <TouchableOpacity style={styles.serviceDateCard} activeOpacity={0.7}>
            <Feather name="calendar" size={18} color="#059669" style={styles.calendarIcon} />
            <View style={styles.dateCardInfo}>
              <Text style={styles.dateCardLabel}>Service Date</Text>
              <Text style={styles.dateCardValue}>Tomorrow, 21 Sep</Text>
              <Text style={styles.dateCardTime}>10:00 AM - 5:00 PM</Text>
            </View>
            <Feather name="chevron-right" size={18} color={COLORS.textMuted} />
          </TouchableOpacity>

          {/* REQUIREMENT 10: Fallback Warning Notice Card matching screenshot */}
          <View style={styles.fallbackNoticeBox}>
            <MaterialIcons name="error-outline" size={16} color="#DC2626" style={styles.fallbackIcon} />
            <Text style={styles.fallbackText}>
              If 20 bookings are not reached by 21 Sep, all bookings automatically switch to single booking.
            </Text>
          </View>

        </ScrollView>

        {/* Bottom Actions matching screenshot */}
        <View style={styles.bottomBar}>
          <TouchableOpacity 
            style={styles.joinGroupBtn}
            onPress={handleJoinGroup}
            activeOpacity={0.85}
          >
            <Text style={styles.joinGroupText}>Join Group Deal</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.singleFallbackBtn}
            onPress={() => navigate('SERVICE_DETAIL_SINGLE', { provider })}
            activeOpacity={0.7}
          >
            <Text style={styles.singleFallbackText}>Choose Single Booking Instead</Text>
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
    position: 'relative',
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  groupDealTag: {
    position: 'absolute',
    top: 10,
    left: 10,
    backgroundColor: '#FEE2E2',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  groupDealTagText: {
    color: '#DC2626',
    fontSize: 11,
    fontWeight: '800',
  },
  discountTag: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: '#059669',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  discountTagText: {
    color: COLORS.white,
    fontSize: 11,
    fontWeight: '800',
  },
  providerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
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
  tiersContainer: {
    flexDirection: 'row',
    backgroundColor: '#F9FAFB',
    borderRadius: 14,
    padding: 6,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 16,
  },
  tierCol: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
    borderRadius: 10,
  },
  tierColActive: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: COLORS.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  tierRange: {
    fontSize: 11,
    color: COLORS.textMuted,
    fontWeight: '600',
    marginBottom: 4,
  },
  tierRangeActive: {
    color: COLORS.textDark,
    fontWeight: '700',
  },
  tierPrice: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.textDark,
  },
  tierPriceActive: {
    color: '#064E3B',
    fontWeight: '900',
  },
  progressSection: {
    marginBottom: 20,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  joinedCount: {
    fontSize: 13,
    fontWeight: '800',
    color: '#059669',
  },
  slotsLeft: {
    fontSize: 12,
    fontWeight: '700',
    color: '#DC2626',
  },
  progressBarTrack: {
    height: 7,
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#059669',
    borderRadius: 4,
  },
  serviceDateCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.white,
    marginBottom: 16,
  },
  calendarIcon: {
    marginRight: 12,
  },
  dateCardInfo: {
    flex: 1,
  },
  dateCardLabel: {
    fontSize: 11,
    color: COLORS.textMuted,
    fontWeight: '600',
    marginBottom: 2,
  },
  dateCardValue: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.textDark,
  },
  dateCardTime: {
    fontSize: 11,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  fallbackNoticeBox: {
    flexDirection: 'row',
    backgroundColor: '#FFF1F2',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FFE4E6',
    alignItems: 'flex-start',
    gap: 8,
  },
  fallbackIcon: {
    marginTop: 1,
  },
  fallbackText: {
    fontSize: 11,
    color: '#9F1239',
    flex: 1,
    lineHeight: 16,
    fontWeight: '500',
  },
  bottomBar: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: COLORS.borderLight,
    backgroundColor: COLORS.white,
    gap: 8,
  },
  joinGroupBtn: {
    backgroundColor: '#064E3B',
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  joinGroupText: {
    color: COLORS.white,
    fontSize: 15,
    fontWeight: '800',
  },
  singleFallbackBtn: {
    alignItems: 'center',
    paddingVertical: 4,
  },
  singleFallbackText: {
    color: '#064E3B',
    fontSize: 12,
    fontWeight: '700',
  },
});

