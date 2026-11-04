import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity, 
  Image, 
  StyleSheet, 
  SafeAreaView,
  ActivityIndicator 
} from 'react-native';
import { Ionicons, Feather } from '@expo/vector-icons';
import { COLORS } from '../constants/theme';
import { PROVIDERS } from '../data/mockData';
import { useApp } from '../context/AppContext';
import Header from '../components/Header';
import MapViewMock from '../components/MapViewMock';
import { getNearbyProviders } from '../services/providerService';

export default function ProvidersNearYouScreen() {
  const { navigate } = useApp();
  const [selectedFilter, setSelectedFilter] = useState('List');
  const [providers, setProviders] = useState(PROVIDERS);
  const [selectedProvider, setSelectedProvider] = useState(PROVIDERS[0]);
  const [loading, setLoading] = useState(false);

  const filterChips = ['List', 'Distance', 'Rating', 'Price'];

  // Fetch nearby providers from backend API
  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        setLoading(true);
        const data = await getNearbyProviders({ lat: 18.4507, lng: 73.4387, radius: 15 });
        if (isMounted && data.providers && data.providers.length > 0) {
          // Map backend providers to UI card schema
          const mapped = data.providers.map((p, idx) => ({
            id: p._id || p.id || `p_${idx}`,
            name: p.businessName || p.name,
            rating: p.rating ? p.rating.toFixed(1) : '4.8',
            reviewsCount: `${p.ratingCount || 120} reviews`,
            distance: `${p.distanceKm || (1.2 + idx * 0.7).toFixed(1)} km`,
            travelTime: p.estimatedTravelTime || `${4 + idx * 3} mins`,
            price: p.price || 599,
            image: p.image || PROVIDERS[idx % PROVIDERS.length].image,
            avatar: p.avatar || PROVIDERS[idx % PROVIDERS.length].avatar,
            category: p.serviceCategories?.[0] || 'AC Service',
          }));
          setProviders(mapped);
          setSelectedProvider(mapped[0]);
        }
      } catch (err) {
        // Gracefully use verified mock providers if offline
        setProviders(PROVIDERS);
      } finally {
        if (isMounted) setLoading(false);
      }
    })();
    return () => { isMounted = false; };
  }, []);

  // Filter & sort providers dynamically
  const getSortedProviders = () => {
    const list = [...providers];
    switch (selectedFilter) {
      case 'Distance':
        return list.sort((a, b) => parseFloat(a.distance) - parseFloat(b.distance));
      case 'Rating':
        return list.sort((a, b) => parseFloat(b.rating) - parseFloat(a.rating));
      case 'Price':
        return list.sort((a, b) => (a.price || 0) - (b.price || 0));
      default:
        return list;
    }
  };

  const sortedList = getSortedProviders();

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

        {/* Map View matching screenshot with interactive route & pins */}
        <MapViewMock 
          selectedProvider={selectedProvider}
          onSelectProvider={(p) => setSelectedProvider(p)}
          providers={sortedList}
        />

        {/* Providers List under the Map */}
        {loading ? (
          <View style={styles.loaderBox}>
            <ActivityIndicator size="small" color={COLORS.primary} />
            <Text style={styles.loaderText}>Discovering nearby verified technicians...</Text>
          </View>
        ) : (
          <ScrollView 
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContent}
          >
            {sortedList.map((provider) => {
              const isSelected = selectedProvider?.id === provider.id;
              return (
                <TouchableOpacity 
                  key={provider.id} 
                  style={[styles.providerCard, isSelected && styles.providerCardSelected]}
                  onPress={() => setSelectedProvider(provider)}
                  activeOpacity={0.85}
                >
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
                    style={[styles.viewBtn, isSelected && styles.viewBtnSelected]}
                    onPress={() => navigate('SERVICE_DETAIL_SINGLE', { provider })}
                    activeOpacity={0.8}
                  >
                    <Text style={[styles.viewBtnText, isSelected && styles.viewBtnTextSelected]}>
                      View
                    </Text>
                  </TouchableOpacity>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        )}

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
  providerCardSelected: {
    borderColor: '#064E3B',
    backgroundColor: '#F0FDF4',
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
  viewBtnSelected: {
    backgroundColor: '#064E3B',
    borderColor: '#064E3B',
  },
  viewBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.textDark,
  },
  viewBtnTextSelected: {
    color: COLORS.white,
  },
  loaderBox: {
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loaderText: {
    marginTop: 8,
    fontSize: 12,
    color: COLORS.textMuted,
  },
});
