import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  View, 
  Modal, 
  Text, 
  TouchableOpacity, 
  ScrollView,
  Alert 
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Ionicons, Feather } from '@expo/vector-icons';

import { AppProvider, useApp } from './src/context/AppContext';

// 11 Original Screens matching reference image
import WelcomeScreen from './src/screens/WelcomeScreen';
import HomeScreen from './src/screens/HomeScreen';
import ServiceListScreen from './src/screens/ServiceListScreen';
import ServiceDetailSingleScreen from './src/screens/ServiceDetailSingleScreen';
import ServiceDetailGroupScreen from './src/screens/ServiceDetailGroupScreen';
import ProvidersNearYouScreen from './src/screens/ProvidersNearYouScreen';
import CartScreen from './src/screens/CartScreen';
import PaymentScreen from './src/screens/PaymentScreen';
import BookingConfirmedScreen from './src/screens/BookingConfirmedScreen';
import BookingDetailsScreen from './src/screens/BookingDetailsScreen';
import MyBookingsScreen from './src/screens/MyBookingsScreen';

// Auth Screens
import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import OtpVerifyScreen from './src/screens/OtpVerifyScreen';
import ForgotPasswordScreen from './src/screens/ForgotPasswordScreen';

// Remote Update via GitHub Releases
import UpdateModal from './src/components/UpdateModal';
import { checkForAppUpdate, CURRENT_VERSION } from './src/services/updateService';

const SCREENS = [
  { key: 'WELCOME', name: '1. Welcome & Onboarding' },
  { key: 'LOGIN', name: '   ↳ Sign In' },
  { key: 'REGISTER', name: '   ↳ Sign Up' },
  { key: 'OTP_VERIFY', name: '   ↳ OTP Verification' },
  { key: 'FORGOT_PASSWORD', name: '   ↳ Forgot Password' },
  { key: 'HOME', name: '2. Home & Discovery' },
  { key: 'SERVICE_LIST', name: '3. AC Servicing Listing' },
  { key: 'SERVICE_DETAIL_SINGLE', name: '4. Service Details (Single)' },
  { key: 'SERVICE_DETAIL_GROUP', name: '5. Service Details (Group Deal)' },
  { key: 'PROVIDERS_MAP', name: '6. Providers Near You (Map)' },
  { key: 'CART', name: '7. Your Cart (2 Items)' },
  { key: 'PAYMENT', name: '8. Payment (UPI & Cards)' },
  { key: 'BOOKING_CONFIRMED', name: '9. Booking Confirmed' },
  { key: 'BOOKING_DETAILS', name: '10. Booking Details & Tracking' },
  { key: 'MY_BOOKINGS', name: '11. My Bookings List' },
];

function MainNavigator() {
  const { currentScreen, setCurrentScreen } = useApp();
  const [menuVisible, setMenuVisible] = useState(false);

  // Remote Update State
  const [updateVisible, setUpdateVisible] = useState(false);
  const [updateInfo, setUpdateInfo] = useState(null);
  const [checkingUpdate, setCheckingUpdate] = useState(false);

  // Check for updates on startup (non-blocking)
  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        const info = await checkForAppUpdate();
        if (isMounted && info.updateAvailable) {
          setUpdateInfo(info);
          setUpdateVisible(true);
        }
      } catch (err) {
        // Silently ignore startup network issues
      }
    })();
    return () => { isMounted = false; };
  }, []);

  // Manual Check Trigger
  const handleManualCheck = async () => {
    setCheckingUpdate(true);
    try {
      const info = await checkForAppUpdate();
      setCheckingUpdate(false);
      if (info.updateAvailable) {
        setUpdateInfo(info);
        setUpdateVisible(true);
        setMenuVisible(false);
      } else {
        Alert.alert(
          'Up to Date! 🎉',
          `You are running the latest version of GroupSave (v${CURRENT_VERSION}).\n\nGitHub repo: Nikhil62738/Eklakshya`
        );
      }
    } catch (e) {
      setCheckingUpdate(false);
      Alert.alert('Update Check Failed', e.message);
    }
  };

  // Demo Update Dialog Preview
  const handlePreviewUpdate = () => {
    setUpdateInfo({
      updateAvailable: true,
      currentVersion: CURRENT_VERSION,
      latestVersion: '1.1.0',
      releaseName: 'v1.1.0 — Hyperlocal Group Discounts',
      releaseNotes: '• Live backend connected to https://eklakshya.onrender.com\n• Direct APK updates from GitHub Releases\n• Performance optimizations and smooth animations\n• 100% full refund guarantee for individual bookings',
      downloadUrl: 'https://github.com/Nikhil62738/Eklakshya/releases',
      apkSize: '24 MB',
      isMandatory: false,
    });
    setMenuVisible(false);
    setUpdateVisible(true);
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case 'WELCOME':
        return <WelcomeScreen />;
      case 'LOGIN':
        return <LoginScreen />;
      case 'REGISTER':
        return <RegisterScreen />;
      case 'OTP_VERIFY':
        return <OtpVerifyScreen />;
      case 'FORGOT_PASSWORD':
        return <ForgotPasswordScreen />;
      case 'HOME':
        return <HomeScreen />;
      case 'SERVICE_LIST':
        return <ServiceListScreen />;
      case 'SERVICE_DETAIL_SINGLE':
        return <ServiceDetailSingleScreen />;
      case 'SERVICE_DETAIL_GROUP':
        return <ServiceDetailGroupScreen />;
      case 'PROVIDERS_MAP':
        return <ProvidersNearYouScreen />;
      case 'CART':
        return <CartScreen />;
      case 'PAYMENT':
        return <PaymentScreen />;
      case 'BOOKING_CONFIRMED':
        return <BookingConfirmedScreen />;
      case 'BOOKING_DETAILS':
        return <BookingDetailsScreen />;
      case 'MY_BOOKINGS':
        return <MyBookingsScreen />;
      default:
        return <WelcomeScreen />;
    }
  };

  return (
    <View style={styles.container}>
      {renderScreen()}

      {/* Floating Demo Screen Switcher Pill */}
      <TouchableOpacity 
        style={styles.floatingSwitcher}
        onPress={() => setMenuVisible(true)}
        activeOpacity={0.8}
      >
        <Ionicons name="apps" size={14} color="#FFFFFF" style={{ marginRight: 4 }} />
        <Text style={styles.floatingSwitcherText}>Screens</Text>
      </TouchableOpacity>

      {/* Screen Selection Modal */}
      <Modal
        visible={menuVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setMenuVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Jump to Any Screen</Text>
              <TouchableOpacity onPress={() => setMenuVisible(false)} style={styles.closeBtn}>
                <Ionicons name="close" size={20} color="#111827" />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} style={styles.screenList}>
              {SCREENS.map((s, index) => {
                const isSelected = currentScreen === s.key;
                const isAuthScreen = ['LOGIN', 'REGISTER', 'OTP_VERIFY', 'FORGOT_PASSWORD'].includes(s.key);
                return (
                  <TouchableOpacity
                    key={s.key}
                    style={[styles.screenItem, isSelected && styles.screenItemActive]}
                    onPress={() => {
                      setCurrentScreen(s.key);
                      setMenuVisible(false);
                    }}
                  >
                    <View style={[
                      styles.badgeNumber, 
                      isSelected && styles.badgeNumberActive,
                      isAuthScreen && !isSelected && styles.badgeNumberAuth,
                    ]}>
                      <Text style={[
                        styles.badgeNumberText, 
                        isSelected && styles.badgeNumberTextActive,
                        isAuthScreen && !isSelected && styles.badgeNumberTextAuth,
                      ]}>
                        {isAuthScreen ? '→' : index + 1 - (index > 0 ? Math.min(index, 4) : 0)}
                      </Text>
                    </View>
                    <Text style={[styles.screenItemText, isSelected && styles.screenItemTextActive]}>
                      {s.name}
                    </Text>
                    {isSelected && (
                      <Ionicons name="checkmark-circle" size={18} color="#075B46" />
                    )}
                  </TouchableOpacity>
                );
              })}

              {/* Remote Update Actions Footer */}
              <View style={styles.updateSection}>
                <Text style={styles.updateSectionTitle}>Remote Updates (GitHub Releases)</Text>
                
                <View style={styles.updateBtnRow}>
                  <TouchableOpacity
                    style={styles.checkUpdateBtn}
                    onPress={handleManualCheck}
                    disabled={checkingUpdate}
                  >
                    <Feather name="refresh-cw" size={12} color="#075B46" style={{ marginRight: 6 }} />
                    <Text style={styles.checkUpdateText}>
                      {checkingUpdate ? 'Checking GitHub...' : 'Check for Updates'}
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.previewUpdateBtn}
                    onPress={handlePreviewUpdate}
                  >
                    <Ionicons name="cloud-download-outline" size={13} color="#075B46" style={{ marginRight: 6 }} />
                    <Text style={styles.previewUpdateText}>Preview Dialog</Text>
                  </TouchableOpacity>
                </View>
              </View>

            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Remote Update Modal */}
      <UpdateModal
        visible={updateVisible}
        updateInfo={updateInfo}
        onDismiss={() => setUpdateVisible(false)}
      />
    </View>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <AppProvider>
        <StatusBar style="auto" />
        <MainNavigator />
      </AppProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  floatingSwitcher: {
    position: 'absolute',
    top: 52,
    right: 14,
    backgroundColor: 'rgba(7, 91, 70, 0.92)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 6,
    zIndex: 9999,
  },
  floatingSwitcherText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 18,
    paddingBottom: 36,
    paddingHorizontal: 16,
    maxHeight: '82%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
    paddingHorizontal: 4,
  },
  modalTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#111827',
  },
  closeBtn: {
    padding: 6,
  },
  screenList: {
    marginTop: 4,
  },
  screenItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 11,
    paddingHorizontal: 12,
    borderRadius: 12,
    marginBottom: 4,
    backgroundColor: '#F9FAFB',
  },
  screenItemActive: {
    backgroundColor: '#DDF5EA',
  },
  badgeNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#E5E7EB',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  badgeNumberActive: {
    backgroundColor: '#075B46',
  },
  badgeNumberAuth: {
    backgroundColor: '#FEF3C7',
  },
  badgeNumberText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#374151',
  },
  badgeNumberTextActive: {
    color: '#FFFFFF',
  },
  badgeNumberTextAuth: {
    color: '#D97706',
  },
  screenItemText: {
    flex: 1,
    fontSize: 13,
    fontWeight: '600',
    color: '#374151',
  },
  screenItemTextActive: {
    color: '#075B46',
    fontWeight: '700',
  },
  updateSection: {
    marginTop: 14,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  updateSectionTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: '#6B7280',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  updateBtnRow: {
    flexDirection: 'row',
    gap: 8,
  },
  checkUpdateBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 9,
    borderRadius: 10,
    backgroundColor: '#F0FDF4',
    borderWidth: 1,
    borderColor: '#A7F3D0',
  },
  checkUpdateText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#075B46',
  },
  previewUpdateBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 9,
    borderRadius: 10,
    backgroundColor: '#DDF5EA',
    borderWidth: 1,
    borderColor: '#A7F3D0',
  },
  previewUpdateText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#075B46',
  },
});
