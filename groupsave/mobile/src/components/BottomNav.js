import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { COLORS } from '../constants/theme';
import { useApp } from '../context/AppContext';

export default function BottomNav() {
  const { activeTab, setActiveTab, navigate, isLoggedIn } = useApp();

  const handleTabPress = (tabName, screenName) => {
    setActiveTab(tabName);
    navigate(screenName);
  };

  const handleProfilePress = () => {
    setActiveTab('profile');
    if (isLoggedIn) {
      navigate('PROFILE');
    } else {
      // Redirect to login page as requested
      navigate('LOGIN');
    }
  };

  return (
    <View style={styles.container}>
      {/* Home Tab */}
      <TouchableOpacity 
        style={styles.tabItem} 
        onPress={() => handleTabPress('home', 'HOME')}
        activeOpacity={0.7}
      >
        <Feather 
          name="home" 
          size={22} 
          color={activeTab === 'home' ? COLORS.primary : COLORS.textMuted} 
        />
        <Text style={[styles.tabLabel, activeTab === 'home' && styles.activeTabLabel]}>
          Home
        </Text>
      </TouchableOpacity>

      {/* Bookings Tab */}
      <TouchableOpacity 
        style={styles.tabItem} 
        onPress={() => handleTabPress('bookings', 'MY_BOOKINGS')}
        activeOpacity={0.7}
      >
        <Feather 
          name="calendar" 
          size={22} 
          color={activeTab === 'bookings' ? COLORS.primary : COLORS.textMuted} 
        />
        <Text style={[styles.tabLabel, activeTab === 'bookings' && styles.activeTabLabel]}>
          Bookings
        </Text>
      </TouchableOpacity>

      {/* Offers Tab */}
      <TouchableOpacity 
        style={styles.tabItem} 
        onPress={() => handleTabPress('offers', 'SERVICE_DETAIL_GROUP')}
        activeOpacity={0.7}
      >
        <Feather 
          name="percent" 
          size={22} 
          color={activeTab === 'offers' ? COLORS.primary : COLORS.textMuted} 
        />
        <Text style={[styles.tabLabel, activeTab === 'offers' && styles.activeTabLabel]}>
          Offers
        </Text>
      </TouchableOpacity>

      {/* Profile Tab -> Redirects to Login page */}
      <TouchableOpacity 
        style={styles.tabItem} 
        onPress={handleProfilePress}
        activeOpacity={0.7}
      >
        <Feather 
          name="user" 
          size={22} 
          color={activeTab === 'profile' ? COLORS.primary : COLORS.textMuted} 
        />
        <Text style={[styles.tabLabel, activeTab === 'profile' && styles.activeTabLabel]}>
          Profile
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    height: 62,
    backgroundColor: COLORS.white,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingHorizontal: 16,
    paddingBottom: 6,
    paddingTop: 8,
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  tabLabel: {
    fontSize: 11,
    fontWeight: '500',
    color: COLORS.textMuted,
    marginTop: 3,
  },
  activeTabLabel: {
    color: COLORS.primary,
    fontWeight: '700',
  },
});
