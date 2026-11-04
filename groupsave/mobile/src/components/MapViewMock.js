import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Rect, Path, Circle, Line } from 'react-native-svg';
import { Feather, Ionicons } from '@expo/vector-icons';
import { COLORS } from '../constants/theme';

export default function MapViewMock() {
  return (
    <View style={styles.mapContainer}>
      {/* Stylized Vector Map Background */}
      <Svg height="100%" width="100%" viewBox="0 0 400 240" style={styles.svg}>
        {/* Soft Map background */}
        <Rect x="0" y="0" width="400" height="240" fill="#EBF4F0" />
        
        {/* Park / Greenery patches */}
        <Path d="M 20 20 Q 80 10 100 60 T 40 100 Z" fill="#D2EADB" />
        <Path d="M 280 40 Q 360 20 380 90 T 300 130 Z" fill="#D2EADB" />
        <Path d="M 120 180 Q 200 160 240 220 T 150 240 Z" fill="#D2EADB" />

        {/* Secondary roads */}
        <Line x1="0" y1="60" x2="400" y2="70" stroke="#FFFFFF" strokeWidth="6" />
        <Line x1="0" y1="180" x2="400" y2="160" stroke="#FFFFFF" strokeWidth="6" />
        <Line x1="120" y1="0" x2="140" y2="240" stroke="#FFFFFF" strokeWidth="6" />
        <Line x1="300" y1="0" x2="280" y2="240" stroke="#FFFFFF" strokeWidth="6" />

        {/* Primary Avenue */}
        <Line x1="40" y1="0" x2="360" y2="240" stroke="#FFFFFF" strokeWidth="10" />

        {/* Active Route Path (Blue line) matching screenshot */}
        <Path 
          d="M 100 180 L 140 140 L 220 120 L 270 50" 
          stroke="#0284C7" 
          strokeWidth="4" 
          strokeLinecap="round" 
          strokeLinejoin="round" 
        />

        {/* Route dots */}
        <Circle cx="140" cy="140" r="3" fill="#0284C7" />
        <Circle cx="220" cy="120" r="3" fill="#0284C7" />
      </Svg>

      {/* Pin 1: Provider Pin 1 (Top right) */}
      <View style={[styles.pinWrapper, { top: 38, left: 260 }]}>
        <View style={styles.providerPin}>
          <Ionicons name="location" size={24} color="#DC2626" />
        </View>
      </View>

      {/* Pin 2: Provider Pin 2 (Left) */}
      <View style={[styles.pinWrapper, { top: 120, left: 70 }]}>
        <View style={styles.providerPin}>
          <Ionicons name="location" size={22} color="#DC2626" />
        </View>
      </View>

      {/* Pin 3: Customer Location Pin (Green circle with person/center) */}
      <View style={[styles.pinWrapper, { top: 168, left: 90 }]}>
        <View style={styles.customerPinOuter}>
          <View style={styles.customerPinInner} />
        </View>
      </View>

      {/* Pin 4: Intermediate Point (Blue node) */}
      <View style={[styles.pinWrapper, { top: 130, left: 132 }]}>
        <View style={styles.routeNode} />
      </View>

      {/* Pin 5: Another Route Point */}
      <View style={[styles.pinWrapper, { top: 110, left: 212 }]}>
        <View style={styles.routeNode} />
      </View>

      {/* Floating Travel Time Pill Badge matching screenshot: "1.2 km (4 mins)" */}
      <View style={styles.travelBadge}>
        <Feather name="arrow-up-right" size={14} color={COLORS.white} />
        <Text style={styles.travelBadgeText}>1.2 km</Text>
        <Text style={styles.travelBadgeSubText}>(4 mins)</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  mapContainer: {
    height: 180,
    width: '100%',
    position: 'relative',
    backgroundColor: '#EBF4F0',
    overflow: 'hidden',
  },
  svg: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
  pinWrapper: {
    position: 'absolute',
  },
  providerPin: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3,
    elevation: 3,
  },
  customerPinOuter: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#059669',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 3,
  },
  customerPinInner: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#FFFFFF',
  },
  routeNode: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#0284C7',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  travelBadge: {
    position: 'absolute',
    top: 70,
    right: 18,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#064E3B',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 16,
    gap: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  travelBadgeText: {
    color: COLORS.white,
    fontWeight: '800',
    fontSize: 12,
  },
  travelBadgeSubText: {
    color: '#A7F3D0',
    fontSize: 10,
    fontWeight: '600',
  },
});

