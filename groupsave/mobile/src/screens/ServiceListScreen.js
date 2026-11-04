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
import { PROVIDERS } from '../data/mockData';
import { useApp } from '../context/AppContext';
import Header from '../components/Header';
import BottomNav from '../components/BottomNav';

export default function ServiceListScreen() {
  const { navigate, activeCategory } = useApp();
  const [selectedFilter, setSelectedFilter] = useState('All');
  const [favorites, setFavorites] = useState({});

  const toggleFavorite = (id) => {
    setFavorites(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const filteredProviders = PROVIDERS.filter(p => {
    if (selectedFilter === 'Group Deals') {
      return p.minBookings >= 10;
    }
    return true;
  });

  const handleProviderPress = (provider) => {
    if (selectedFilter === 'Group Deals') {
      navigate('SERVICE_DETAIL_GROUP', { provider });
    } else {
      navigate('SERVICE_DETAIL_SINGLE', { provider });
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        
        {/* Header matching screenshot */}
        <Header title={activeCategory || "AC Servicing"} showBack={true} />

        {/* Filter Pills Row */}
        <View style={styles.filterRow}>
          {['All', 'Single Booking', 'Group Deals'].map((filter) => {
            const isActive = selectedFilter === filter;
            return (
              <TouchableOpacity
                key={filter}
                style={[styles.filterPill, isActive && styles.filterPillActive]}
                onPress={() => setSelectedFilter(filter)}
                activeOpacity={0.75}
              >
                <Text style={[styles.filterPillText, isActive && styles.filterPillTextActive]}>
                  {filter}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Provider Cards List */}
        <ScrollView 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
        >
          {filteredProviders.map((provider) => (
            <TouchableOpacity
              key={provider.id}
              style={styles.providerCard}
              onPress={() => handleProviderPress(provider)}
              activeOpacity={0.85}
            >
              {/* Thumbnail Image */}
              <Image 
                source={{ uri: provider.image }} 
                style={styles.cardImage} 
              />

              {/* Info Column */}
              <View style={styles.cardInfo}>
                <Text style={styles.providerName} numberOfLines={1}>
                  {provider.name}
                </Text>

                <View style={styles.ratingRow}>
                  <Ionicons name="star" size={13} color={COLORS.yellowStar} />
                  <Text style={styles.ratingText}>
                    {provider.rating} ({provider.reviewsCount} reviews)
                  </Text>
                </View>

                <Text style={styles.distanceText}>
                  {provider.distance} • {provider.category}
                </Text>

                <Text style={styles.priceText}>
                  ₹{provider.price}
                </Text>
              </View>

              {/* Right Side: Discount Tag and Heart */}
              <View style={styles.cardRight}>
                <TouchableOpacity 
                  onPress={() => toggleFavorite(provider.id)}
                  style={styles.heartBtn}
                >
                  <Feather 
                    name={favorites[provider.id] ? "heart" : "heart"} 
                    size={18} 
                    color={favorites[provider.id] ? COLORS.badgeRed : COLORS.textLight} 
                  />
                </TouchableOpacity>

                {provider.discount && (
                  <View style={styles.discountBadge}>
                    <Text style={styles.discountText}>{provider.discount}</Text>
                  </View>
                )}
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Bottom Tab Navigation */}
        <BottomNav />

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
  filterRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
  },
  filterPill: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 18,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  filterPillActive: {
    backgroundColor: '#064E3B',
    borderColor: '#064E3B',
  },
  filterPillText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.textDark,
  },
  filterPillTextActive: {
    color: COLORS.white,
    fontWeight: '700',
  },
  listContent: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    gap: 14,
  },
  providerCard: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
    position: 'relative',
  },
  cardImage: {
    width: 76,
    height: 76,
    borderRadius: 12,
    backgroundColor: '#E5E7EB',
  },
  cardInfo: {
    flex: 1,
    marginLeft: 14,
    justifyContent: 'center',
  },
  providerName: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.textDark,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 3,
  },
  ratingText: {
    fontSize: 11,
    fontWeight: '600',
    color: COLORS.textMuted,
  },
  distanceText: {
    fontSize: 11,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  priceText: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.textDark,
    marginTop: 4,
  },
  cardRight: {
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 74,
  },
  heartBtn: {
    padding: 2,
  },
  discountBadge: {
    backgroundColor: '#D1FAE5',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  discountText: {
    color: '#059669',
    fontSize: 10,
    fontWeight: '800',
  },
});

