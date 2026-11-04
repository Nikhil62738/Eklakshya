import React, { useState } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity, 
  TextInput, 
  Image, 
  StyleSheet, 
  SafeAreaView 
} from 'react-native';
import { Feather, Ionicons, FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS } from '../constants/theme';
import { CATEGORIES, PROVIDERS } from '../data/mockData';
import { useApp } from '../context/AppContext';
import BottomNav from '../components/BottomNav';

export default function HomeScreen() {
  const { navigate, setActiveCategory } = useApp();
  const [searchQuery, setSearchQuery] = useState('');

  const renderCategoryIcon = (item) => {
    switch (item.name) {
      case 'AC Service':
        return <Feather name="wind" size={20} color={item.color} />;
      case 'Cleaning':
        return <MaterialCommunityIcons name="spray-bottle" size={20} color={item.color} />;
      case 'Car Wash':
        return <Ionicons name="car-sport" size={20} color={item.color} />;
      case 'Electrician':
        return <Ionicons name="flash" size={20} color={item.color} />;
      case 'Plumber':
        return <MaterialCommunityIcons name="pipe-wrench" size={20} color={item.color} />;
      case 'Pest Control':
        return <MaterialCommunityIcons name="shield-bug" size={20} color={item.color} />;
      case 'Salon':
        return <Ionicons name="cut" size={20} color={item.color} />;
      case 'Laundry':
        return <MaterialCommunityIcons name="washing-machine" size={20} color={item.color} />;
      default:
        return <Feather name="grid" size={20} color={item.color} />;
    }
  };

  const handleCategoryPress = (category) => {
    setActiveCategory(category.name);
    navigate('SERVICE_LIST', { category: category.name });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        
        {/* Top Header Bar */}
        <View style={styles.topBar}>
          <TouchableOpacity 
            style={styles.locationSelector} 
            activeOpacity={0.7}
            onPress={() => navigate('PROVIDERS_MAP')}
          >
            <Ionicons name="location" size={18} color={COLORS.textDark} />
            <Text style={styles.locationText}>Lonere, Raigad</Text>
            <Feather name="chevron-down" size={16} color={COLORS.textDark} />
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.notificationBtn} 
            activeOpacity={0.7}
            onPress={() => navigate('MY_BOOKINGS')}
          >
            <Feather name="bell" size={20} color={COLORS.textDark} />
            <View style={styles.notifBadge} />
          </TouchableOpacity>
        </View>

        <ScrollView 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Search Bar */}
          <View style={styles.searchBar}>
            <Feather name="search" size={18} color={COLORS.textLight} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search for services..."
              placeholderTextColor={COLORS.textLight}
              value={searchQuery}
              onChangeText={setSearchQuery}
              onSubmitEditing={() => navigate('SERVICE_LIST')}
            />
          </View>

          {/* Categories Grid (2 rows of 4 circular icons matching screenshot) */}
          <View style={styles.categoriesGrid}>
            {CATEGORIES.map((cat) => (
              <TouchableOpacity
                key={cat.id}
                style={styles.categoryItem}
                onPress={() => handleCategoryPress(cat)}
                activeOpacity={0.75}
              >
                <View style={[styles.categoryCircle, { backgroundColor: cat.bg }]}>
                  {renderCategoryIcon(cat)}
                </View>
                <Text style={styles.categoryName} numberOfLines={1}>{cat.name}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Promotional Banner matching screenshot */}
          <View style={styles.promoBanner}>
            <View style={styles.promoLeft}>
              <Text style={styles.promoTitle}>Book Together{'\n'}Save More</Text>
              <Text style={styles.promoSubtitle}>Group deals for your society</Text>
              
              <TouchableOpacity 
                style={styles.exploreDealsBtn}
                onPress={() => navigate('SERVICE_DETAIL_GROUP')}
                activeOpacity={0.85}
              >
                <Text style={styles.exploreDealsText}>Explore Deals →</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.promoRight}>
              <Image 
                source={{ uri: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=300&q=80' }}
                style={styles.promoImage}
                resizeMode="cover"
              />
            </View>
          </View>

          {/* Trending Near You Section */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Trending Near You</Text>
            <TouchableOpacity onPress={() => navigate('SERVICE_LIST')}>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>

          {/* Trending Card matching screenshot */}
          <TouchableOpacity
            style={styles.trendingCard}
            onPress={() => navigate('SERVICE_DETAIL_SINGLE', { provider: PROVIDERS[0] })}
            activeOpacity={0.85}
          >
            <Image
              source={{ uri: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=300&q=80' }}
              style={styles.trendingImage}
            />

            <View style={styles.trendingInfo}>
              <Text style={styles.trendingTitle}>AC Servicing</Text>
              <Text style={styles.trendingPrice}>From ₹599</Text>

              <View style={styles.trendingMeta}>
                <View style={styles.ratingRow}>
                  <Ionicons name="star" size={13} color={COLORS.yellowStar} />
                  <Text style={styles.ratingText}>4.6 (320)</Text>
                </View>
                <Text style={styles.dotSeparator}>•</Text>
                <View style={styles.distanceRow}>
                  <Ionicons name="location-outline" size={13} color={COLORS.textMuted} />
                  <Text style={styles.distanceText}>2.1 km</Text>
                </View>
              </View>
            </View>

            <TouchableOpacity style={styles.heartBtn} activeOpacity={0.7}>
              <Feather name="heart" size={18} color={COLORS.textLight} />
            </TouchableOpacity>
          </TouchableOpacity>

          {/* Additional Quick Shortcut to Map Screen (Screen 6) */}
          <TouchableOpacity
            style={styles.mapShortcutCard}
            onPress={() => navigate('PROVIDERS_MAP')}
            activeOpacity={0.85}
          >
            <View style={styles.mapShortcutLeft}>
              <View style={styles.mapIconCircle}>
                <Ionicons name="map" size={18} color={COLORS.primary} />
              </View>
              <View>
                <Text style={styles.mapShortcutTitle}>View Providers on Map</Text>
                <Text style={styles.mapShortcutSub}>Find approved technicians within 2 km</Text>
              </View>
            </View>
            <Feather name="chevron-right" size={20} color={COLORS.textMuted} />
          </TouchableOpacity>

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
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  locationSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  locationText: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.textDark,
  },
  notificationBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  notifBadge: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#EF4444',
    position: 'absolute',
    top: 8,
    right: 8,
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    paddingHorizontal: 14,
    height: 44,
    marginBottom: 20,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: COLORS.textDark,
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: 16,
    marginBottom: 24,
  },
  categoryItem: {
    width: '23%',
    alignItems: 'center',
  },
  categoryCircle: {
    width: 54,
    height: 54,
    borderRadius: 27,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  categoryName: {
    fontSize: 11,
    fontWeight: '600',
    color: COLORS.textDark,
    textAlign: 'center',
  },
  promoBanner: {
    backgroundColor: '#FDF6ED',
    borderRadius: 18,
    padding: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#FEEBC8',
    overflow: 'hidden',
  },
  promoLeft: {
    flex: 1,
    paddingRight: 10,
  },
  promoTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.textDark,
    lineHeight: 23,
    marginBottom: 4,
  },
  promoSubtitle: {
    fontSize: 11,
    color: COLORS.textMuted,
    marginBottom: 12,
  },
  exploreDealsBtn: {
    backgroundColor: '#064E3B',
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  exploreDealsText: {
    color: COLORS.white,
    fontSize: 11,
    fontWeight: '700',
  },
  promoRight: {
    width: 90,
    height: 90,
    borderRadius: 45,
    overflow: 'hidden',
  },
  promoImage: {
    width: '100%',
    height: '100%',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.textDark,
  },
  seeAllText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.primary,
  },
  trendingCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 14,
  },
  trendingImage: {
    width: 72,
    height: 72,
    borderRadius: 12,
    backgroundColor: '#E5E7EB',
  },
  trendingInfo: {
    flex: 1,
    marginLeft: 14,
  },
  trendingTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.textDark,
  },
  trendingPrice: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.textDark,
    marginTop: 2,
  },
  trendingMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
    gap: 6,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  ratingText: {
    fontSize: 11,
    fontWeight: '600',
    color: COLORS.textMuted,
  },
  dotSeparator: {
    color: COLORS.textLight,
  },
  distanceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  distanceText: {
    fontSize: 11,
    color: COLORS.textMuted,
  },
  heartBtn: {
    padding: 8,
  },
  mapShortcutCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#E6F4EA',
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: '#CEEAD6',
    marginTop: 6,
  },
  mapShortcutLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  mapIconCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mapShortcutTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#064E3B',
  },
  mapShortcutSub: {
    fontSize: 11,
    color: '#2D6A4F',
  },
});

