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
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../constants/theme';
import { PROVIDERS } from '../data/mockData';
import { useApp } from '../context/AppContext';
import Header from '../components/Header';
import MapViewMock from '../components/MapViewMock';

export default function ProvidersNearYouScreen() {
  const { navigate } = useApp();
  const [selectedFilter, setSelectedFilter] = useState('List');

  const filterChips = ['List', 'Distance', 'Rating', 'Price'];

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        
        {/* Header matching screenshot */}
        <Header title="Providers Near You" showBack={true} />

        {/* Filter Chips Bar matching screenshot */}
        <View style={styles.filterBar}>
          {filterChips.map((chip) => {
            const isActive = selectedFilter === chip;
            return (
              <TouchableOpacity
                key={chip}
                style={[styles.filterChip, isActive && styles.filterChipActive]}
                onPress={() => setSelectedFilter(chip)}
                activeOpacity={0.7}
              >
                <Text style={[styles.filterChipText, isActive && styles.filterChipTextActive]}>
                  {chip}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Map View matching screenshot */}
        <MapViewMock />

        {/* Providers List under the Map */}
        <ScrollView 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
        >
          {PROVIDERS.slice(0, 3).map((provider) => (
            <View key={provider.id} style={styles.providerCard}>
              <Image 
                source={{ uri: provider.image }} 
                style={styles.cardImage} 
              />

              <View style={styles.cardInfo}>
                <Text style={styles.providerName} numberOfLines={1}>{provider.name}</Text>
                
                <View style={styles.ratingRow}>
                  <Ionicons name="star" size={13} color={COLORS.yellowStar} />
                  <Text style={styles.ratingText}>{provider.rating} ({provider.reviewsCount})</Text>
                </View>

                <View style={styles.metaRow}>
                  <Text style={styles.priceText}>₹{provider.price}</Text>
                  <Text style={styles.distanceText}>{provider.distance}</Text>
                </View>
              </View>

              <TouchableOpacity
                style={styles.viewBtn}
                onPress={() => navigate('SERVICE_DETAIL_SINGLE', { provider })}
                activeOpacity={0.8}
              >
                <Text style={styles.viewBtnText}>View</Text>
              </TouchableOpacity>
            </View>
          ))}
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
  filterBar: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 8,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
  },
  filterChip: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#F3F4F6',
  },
  filterChipActive: {
    backgroundColor: '#064E3B',
  },
  filterChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.textDark,
  },
  filterChipTextActive: {
    color: COLORS.white,
    fontWeight: '700',
  },
  listContent: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 12,
  },
  providerCard: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    borderRadius: 14,
    padding: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
  },
  cardImage: {
    width: 60,
    height: 60,
    borderRadius: 10,
    backgroundColor: '#E5E7EB',
  },
  cardInfo: {
    flex: 1,
    marginLeft: 12,
  },
  providerName: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.textDark,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    marginTop: 2,
  },
  ratingText: {
    fontSize: 11,
    color: COLORS.textMuted,
    fontWeight: '600',
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 3,
  },
  priceText: {
    fontSize: 13,
    fontWeight: '800',
    color: COLORS.textDark,
  },
  distanceText: {
    fontSize: 11,
    color: COLORS.textMuted,
  },
  viewBtn: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: '#F9FAFB',
  },
  viewBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.textDark,
  },
});

