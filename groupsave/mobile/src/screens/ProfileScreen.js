import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  Image,
  Alert,
} from 'react-native';
import { Feather, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS } from '../constants/theme';
import { useApp } from '../context/AppContext';
import BottomNav from '../components/BottomNav';

export default function ProfileScreen() {
  const { user, setUser, authToken, setAuthToken, navigate } = useApp();

  const handleLogout = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out from your GroupSave account?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: () => {
            setAuthToken(null);
            navigate('LOGIN');
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigate('HOME')} style={styles.backBtn}>
            <Feather name="arrow-left" size={22} color={COLORS.textDark} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>My Profile</Text>
          <View style={{ width: 40 }} />
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
          
          {/* User Card */}
          <View style={styles.userCard}>
            <View style={styles.avatarWrapper}>
              <Image
                source={{ uri: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80' }}
                style={styles.avatar}
              />
              <View style={styles.editAvatarBadge}>
                <Feather name="camera" size={12} color="#FFFFFF" />
              </View>
            </View>

            <Text style={styles.userName}>{user.name || 'Nikhil Chopade'}</Text>
            <Text style={styles.userPhone}>+91 {user.mobile || '9876543210'}</Text>
            <Text style={styles.userEmail}>{user.email || 'nikhil@groupsave.demo'}</Text>

            <View style={styles.verifiedBadge}>
              <Ionicons name="shield-checkmark" size={13} color="#059669" />
              <Text style={styles.verifiedText}>Verified Customer • DBATU Lonere</Text>
            </View>
          </View>

          {/* Quick Metrics */}
          <View style={styles.metricsRow}>
            <View style={styles.metricItem}>
              <Text style={styles.metricValue}>150</Text>
              <Text style={styles.metricLabel}>Loyalty Pts</Text>
            </View>
            <View style={styles.metricDivider} />
            <View style={styles.metricItem}>
              <Text style={styles.metricValue}>₹1,240</Text>
              <Text style={styles.metricLabel}>Saved in Groups</Text>
            </View>
            <View style={styles.metricDivider} />
            <View style={styles.metricItem}>
              <Text style={styles.metricValue}>3</Text>
              <Text style={styles.metricLabel}>Bookings</Text>
            </View>
          </View>

          {/* Saved Address Card */}
          <View style={styles.sectionBox}>
            <View style={styles.sectionHeaderRow}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <Feather name="map-pin" size={16} color={COLORS.primary} />
                <Text style={styles.sectionTitle}>Default Service Address</Text>
              </View>
              <TouchableOpacity onPress={() => Alert.alert('Address', 'Edit address coming in next update')}>
                <Text style={styles.changeLink}>Change</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.addressCard}>
              <Text style={styles.addressTitle}>DBATU Hostel (Room 101)</Text>
              <Text style={styles.addressLine}>
                {user.address || 'Room 101, DBATU Hostel, Lonere, Raigad 402103'}
              </Text>
              <View style={styles.addressTag}>
                <Text style={styles.addressTagText}>Hostel / Primary</Text>
              </View>
            </View>
          </View>

          {/* Account Options */}
          <View style={styles.optionsSection}>
            <TouchableOpacity 
              style={styles.optionRow}
              onPress={() => navigate('MY_BOOKINGS')}
              activeOpacity={0.7}
            >
              <View style={styles.optionLeft}>
                <View style={styles.optionIconBox}>
                  <Feather name="calendar" size={16} color={COLORS.primary} />
                </View>
                <Text style={styles.optionTitle}>My Bookings & History</Text>
              </View>
              <Feather name="chevron-right" size={18} color={COLORS.textLight} />
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.optionRow}
              onPress={() => Alert.alert('Offers', 'Explore Society Group Deals on AC, Cleaning & Plumbing!')}
              activeOpacity={0.7}
            >
              <View style={styles.optionLeft}>
                <View style={styles.optionIconBox}>
                  <Feather name="percent" size={16} color="#D97706" />
                </View>
                <Text style={styles.optionTitle}>Coupons & Group Rewards</Text>
              </View>
              <Feather name="chevron-right" size={18} color={COLORS.textLight} />
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.optionRow}
              onPress={() => Alert.alert('Help Desk', 'Email: support@groupsave.com\nHelpline: +91 98450 12345')}
              activeOpacity={0.7}
            >
              <View style={styles.optionLeft}>
                <View style={styles.optionIconBox}>
                  <Feather name="help-circle" size={16} color="#0284C7" />
                </View>
                <Text style={styles.optionTitle}>Customer Support & FAQ</Text>
              </View>
              <Feather name="chevron-right" size={18} color={COLORS.textLight} />
            </TouchableOpacity>
          </View>

          {/* Sign Out / Switch Account Button */}
          <TouchableOpacity 
            style={styles.signOutBtn}
            onPress={handleLogout}
            activeOpacity={0.8}
          >
            <Feather name="log-out" size={16} color="#DC2626" style={{ marginRight: 8 }} />
            <Text style={styles.signOutText}>Sign Out to Login Page</Text>
          </TouchableOpacity>

        </ScrollView>

        <BottomNav />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: COLORS.white },
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F2F1',
  },
  backBtn: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: 18, fontWeight: '700', color: COLORS.textDark },
  scroll: { paddingHorizontal: 18, paddingVertical: 18, paddingBottom: 36 },
  userCard: {
    alignItems: 'center',
    backgroundColor: '#F8FAF9',
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: '#E6ECE9',
    marginBottom: 16,
  },
  avatarWrapper: {
    position: 'relative',
    marginBottom: 12,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#E5E7EB',
  },
  editAvatarBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  userName: { fontSize: 18, fontWeight: '900', color: COLORS.textDark },
  userPhone: { fontSize: 13, color: COLORS.textMuted, marginTop: 2 },
  userEmail: { fontSize: 12, color: COLORS.textMuted, marginTop: 2 },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#D1FAE5',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginTop: 10,
  },
  verifiedText: { fontSize: 11, fontWeight: '700', color: '#065F46' },
  metricsRow: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: 18,
    alignItems: 'center',
  },
  metricItem: { flex: 1, alignItems: 'center' },
  metricValue: { fontSize: 17, fontWeight: '900', color: COLORS.primary },
  metricLabel: { fontSize: 11, color: COLORS.textMuted, marginTop: 2 },
  metricDivider: { width: 1, height: 26, backgroundColor: '#E5E7EB' },
  sectionBox: { marginBottom: 18 },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  sectionTitle: { fontSize: 13, fontWeight: '700', color: COLORS.textDark },
  changeLink: { fontSize: 12, fontWeight: '700', color: COLORS.primary },
  addressCard: {
    backgroundColor: '#F9FAFB',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  addressTitle: { fontSize: 13, fontWeight: '700', color: COLORS.textDark },
  addressLine: { fontSize: 12, color: COLORS.textMuted, marginTop: 4, lineHeight: 17 },
  addressTag: {
    backgroundColor: '#DDF5EA',
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    marginTop: 8,
  },
  addressTagText: { fontSize: 10, fontWeight: '800', color: '#075B46' },
  optionsSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: 20,
    overflow: 'hidden',
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  optionLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  optionIconBox: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionTitle: { fontSize: 13, fontWeight: '600', color: COLORS.textDark },
  signOutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FCA5A5',
    borderRadius: 14,
    paddingVertical: 13,
  },
  signOutText: { fontSize: 14, fontWeight: '800', color: '#DC2626' },
});

