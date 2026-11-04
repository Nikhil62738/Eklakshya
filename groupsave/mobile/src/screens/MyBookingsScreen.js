import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  SafeAreaView,
  StatusBar
} from 'react-native';
import { Ionicons, Feather } from '@expo/vector-icons';
import { COLORS } from '../constants/theme';
import { useApp } from '../context/AppContext';
import BottomNav from '../components/BottomNav';

export default function MyBookingsScreen() {
  const { bookings, navigate, goBack } = useApp();
  const [selectedFilter, setSelectedFilter] = useState('All');

  const filterTabs = ['All', 'Upcoming', 'Completed', 'Cancelled'];

  const filteredBookings = bookings.filter(b => {
    if (selectedFilter === 'All') return true;
    return b.status.toLowerCase() === selectedFilter.toLowerCase();
  });

  const handleBookingPress = (booking) => {
    navigate('BOOKING_DETAILS', { booking });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      
      {/* Top Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={goBack}>
          <Feather name="arrow-left" size={22} color="#1F2937" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Bookings</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* Filter Tabs */}
      <View style={styles.tabsContainer}>
        {filterTabs.map((tab) => {
          const isActive = selectedFilter === tab;
          return (
            <TouchableOpacity
              key={tab}
              style={[styles.tabButton, isActive && styles.activeTabButton]}
              onPress={() => setSelectedFilter(tab)}
              activeOpacity={0.7}
            >
              <Text style={[styles.tabText, isActive && styles.activeTabText]}>
                {tab}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Bookings List */}
      <ScrollView
        style={styles.scrollContainer}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {filteredBookings.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="calendar-outline" size={54} color="#9CA3AF" />
            <Text style={styles.emptyTitle}>No bookings found</Text>
            <Text style={styles.emptySubtitle}>You don't have any {selectedFilter.toLowerCase()} bookings</Text>
          </View>
        ) : (
          filteredBookings.map((item) => {
            const isCompleted = item.status === 'Completed';
            return (
              <TouchableOpacity
                key={item.id}
                style={styles.card}
                activeOpacity={0.85}
                onPress={() => handleBookingPress(item)}
              >
                <Image source={{ uri: item.image }} style={styles.thumbnail} />

                <View style={styles.infoCol}>
                  <Text style={styles.serviceTitle} numberOfLines={1}>
                    {item.title}
                  </Text>
                  <Text style={styles.providerName}>{item.providerName}</Text>
                  
                  <View style={styles.dateRow}>
                    <Feather name="clock" size={13} color="#9CA3AF" style={{ marginRight: 4 }} />
                    <Text style={styles.dateText}>
                      {item.joinInfo || item.date}
                    </Text>
                  </View>

                  <Text style={styles.priceText}>{item.price}</Text>
                </View>

                <View style={styles.rightCol}>
                  <View
                    style={[
                      styles.statusBadge,
                      isCompleted ? styles.completedBadge : styles.upcomingBadge
                    ]}
                  >
                    <Text
                      style={[
                        styles.statusText,
                        isCompleted ? styles.completedStatusText : styles.upcomingStatusText
                      ]}
                    >
                      {item.status}
                    </Text>
                  </View>

                  <View style={styles.chevronWrapper}>
                    <Feather name="chevron-right" size={20} color="#9CA3AF" />
                  </View>
                </View>
              </TouchableOpacity>
            );
          })
        )}
      </ScrollView>

      {/* Persistent Bottom Nav */}
      <BottomNav />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F7F9F8',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F2F1',
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
  },
  tabsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    gap: 8,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeTabButton: {
    backgroundColor: '#075B46',
  },
  tabText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#6B7280',
  },
  activeTabText: {
    color: '#FFFFFF',
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 24,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 12,
    marginBottom: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  thumbnail: {
    width: 72,
    height: 72,
    borderRadius: 10,
    backgroundColor: '#E5E7EB',
  },
  infoCol: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'center',
  },
  serviceTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 2,
  },
  providerName: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 4,
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  dateText: {
    fontSize: 11,
    color: '#6B7280',
  },
  priceText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#075B46',
  },
  rightCol: {
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    height: 72,
    paddingVertical: 2,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  upcomingBadge: {
    backgroundColor: '#DDF5EA',
  },
  completedBadge: {
    backgroundColor: '#E1EFEA',
  },
  statusText: {
    fontSize: 11,
    fontWeight: '600',
  },
  upcomingStatusText: {
    color: '#075B46',
  },
  completedStatusText: {
    color: '#0F8B68',
  },
  chevronWrapper: {
    paddingRight: 2,
  },
  emptyState: {
    paddingVertical: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#374151',
    marginTop: 12,
  },
  emptySubtitle: {
    fontSize: 13,
    color: '#9CA3AF',
    marginTop: 4,
  },
});

