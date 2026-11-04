import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  View 
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { AppProvider, useApp } from './src/context/AppContext';

// Core Screens
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
import ProfileScreen from './src/screens/ProfileScreen';

// Auth Screens
import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import OtpVerifyScreen from './src/screens/OtpVerifyScreen';
import ForgotPasswordScreen from './src/screens/ForgotPasswordScreen';

// Remote Update via GitHub Releases
import UpdateModal from './src/components/UpdateModal';
import { checkForAppUpdate } from './src/services/updateService';

function MainNavigator() {
  const { currentScreen } = useApp();

  // Remote Update State
  const [updateVisible, setUpdateVisible] = useState(false);
  const [updateInfo, setUpdateInfo] = useState(null);

  // Check for remote updates on startup (non-blocking)
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
        // Silently ignore network issues on launch
      }
    })();
    return () => { isMounted = false; };
  }, []);

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
      case 'PROFILE':
        return <ProfileScreen />;
      default:
        return <WelcomeScreen />;
    }
  };

  return (
    <View style={styles.container}>
      {renderScreen()}

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
});
