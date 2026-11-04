import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, SafeAreaView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Path, Rect, Circle, Polygon, G } from 'react-native-svg';
import { Feather, Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { COLORS } from '../constants/theme';
import { useApp } from '../context/AppContext';

const { width, height } = Dimensions.get('window');

export default function WelcomeScreen() {
  const { navigate } = useApp();

  return (
    <LinearGradient
      colors={['#064E3B', '#043A2C', '#02241B']}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea}>
        
        {/* Top Header / Logo Section */}
        <View style={styles.headerSection}>
          {/* House Logo Icon */}
          <View style={styles.logoIcon}>
            <Ionicons name="home" size={28} color="#FFFFFF" />
            <View style={styles.roofBadge}>
              <Feather name="users" size={14} color="#064E3B" />
            </View>
          </View>

          <Text style={styles.brandTitle}>GrouSave</Text>
          <Text style={styles.brandTagline}>Local Services{'\n'}Better Together</Text>
        </View>

        {/* Center Community Illustration matching screenshot */}
        <View style={styles.illustrationContainer}>
          <Svg height="190" width="300" viewBox="0 0 300 190">
            {/* Background green hills */}
            <Path d="M 0 160 Q 60 100 140 130 T 300 150 L 300 190 L 0 190 Z" fill="#0B5D46" />
            <Path d="M 30 180 Q 120 120 220 140 T 300 170 L 300 190 L 0 190 Z" fill="#13755A" />
            <Path d="M 0 170 Q 90 140 180 160 T 300 180 L 300 190 L 0 190 Z" fill="#198E6E" />

            {/* Trees in background */}
            <Circle cx="45" cy="120" r="18" fill="#166534" />
            <Circle cx="260" cy="130" r="22" fill="#15803D" />
            <Circle cx="230" cy="115" r="16" fill="#166534" />

            {/* House 1 (Left - Peach) */}
            <Rect x="50" y="125" width="45" height="40" rx="3" fill="#FDBA74" />
            <Polygon points="45,125 72,100 100,125" fill="#C2410C" />
            <Rect x="68" y="145" width="12" height="20" rx="2" fill="#7C2D12" />
            <Rect x="55" y="132" width="10" height="10" rx="2" fill="#FEF08A" />

            {/* House 2 (Center - White/Beige with terracotta roof) */}
            <Rect x="105" y="115" width="60" height="50" rx="3" fill="#FFF7ED" />
            <Polygon points="100,115 135,85 170,115" fill="#EA580C" />
            <Rect x="130" y="138" width="14" height="27" rx="2" fill="#9A3412" />
            <Rect x="112" y="124" width="12" height="12" rx="2" fill="#38BDF8" />
            <Rect x="148" y="124" width="12" height="12" rx="2" fill="#38BDF8" />

            {/* Apartment Building (Center Right - Mint/Teal) */}
            <Rect x="175" y="100" width="45" height="65" rx="3" fill="#CCFBF1" />
            <Polygon points="170,100 197,80 225,100" fill="#0F766E" />
            <Rect x="183" y="110" width="8" height="10" rx="1" fill="#FEF08A" />
            <Rect x="200" y="110" width="8" height="10" rx="1" fill="#FEF08A" />
            <Rect x="183" y="128" width="8" height="10" rx="1" fill="#FEF08A" />
            <Rect x="200" y="128" width="8" height="10" rx="1" fill="#FEF08A" />
            <Rect x="190" y="146" width="12" height="19" rx="1" fill="#115E59" />

            {/* House 3 (Far Right - Yellow) */}
            <Rect x="225" y="130" width="40" height="35" rx="3" fill="#FEF08A" />
            <Polygon points="220,130 245,110 270,130" fill="#B45309" />
            <Rect x="238" y="145" width="10" height="20" rx="1" fill="#78350F" />

            {/* Foreground Lush Grass/Foliage */}
            <Circle cx="20" cy="180" r="16" fill="#15803D" />
            <Circle cx="60" cy="185" r="14" fill="#16A34A" />
            <Circle cx="120" cy="185" r="12" fill="#22C55E" />
            <Circle cx="190" cy="185" r="15" fill="#15803D" />
            <Circle cx="280" cy="180" r="16" fill="#16A34A" />
          </Svg>
        </View>

        {/* Buttons Section */}
        <View style={styles.actionsSection}>
          <TouchableOpacity
            style={styles.getStartedBtn}
            onPress={() => navigate('HOME')}
            activeOpacity={0.85}
          >
            <Text style={styles.getStartedText}>Get Started</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.signInBtn}
            onPress={() => navigate('HOME')}
            activeOpacity={0.8}
          >
            <Text style={styles.signInText}>Sign In</Text>
          </TouchableOpacity>
        </View>

        {/* Bottom 3 Pillars (Save Money, Trusted Providers, Local Communities) */}
        <View style={styles.pillarsContainer}>
          <View style={styles.pillarItem}>
            <View style={styles.pillarIconCircle}>
              <Feather name="dollar-sign" size={16} color={COLORS.white} />
            </View>
            <Text style={styles.pillarLabel}>Save Money</Text>
          </View>

          <View style={styles.pillarItem}>
            <View style={styles.pillarIconCircle}>
              <Feather name="shield" size={16} color={COLORS.white} />
            </View>
            <Text style={styles.pillarLabel}>Trusted Providers</Text>
          </View>

          <View style={styles.pillarItem}>
            <View style={styles.pillarIconCircle}>
              <Feather name="compass" size={16} color={COLORS.white} />
            </View>
            <Text style={styles.pillarLabel}>Local Communities</Text>
          </View>
        </View>

      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'space-between',
    paddingVertical: 20,
  },
  headerSection: {
    alignItems: 'center',
    marginTop: 20,
  },
  logoIcon: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.4)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    position: 'relative',
  },
  roofBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    backgroundColor: '#A7F3D0',
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandTitle: {
    fontSize: 34,
    fontWeight: '900',
    color: COLORS.white,
    letterSpacing: -0.5,
  },
  brandTagline: {
    fontSize: 15,
    fontWeight: '500',
    color: '#D1FAE5',
    textAlign: 'center',
    marginTop: 6,
    lineHeight: 22,
  },
  illustrationContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
  },
  actionsSection: {
    width: '100%',
    gap: 12,
  },
  getStartedBtn: {
    backgroundColor: COLORS.white,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 3,
  },
  getStartedText: {
    color: '#064E3B',
    fontSize: 16,
    fontWeight: '800',
  },
  signInBtn: {
    backgroundColor: 'transparent',
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.6)',
  },
  signInText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '700',
  },
  pillarsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
    marginTop: 10,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.15)',
    paddingTop: 16,
  },
  pillarItem: {
    alignItems: 'center',
    flex: 1,
  },
  pillarIconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  pillarLabel: {
    color: '#D1FAE5',
    fontSize: 10,
    fontWeight: '600',
    textAlign: 'center',
  },
});

