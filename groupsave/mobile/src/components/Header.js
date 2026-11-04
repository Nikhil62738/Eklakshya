import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { COLORS } from '../constants/theme';
import { useApp } from '../context/AppContext';

export default function Header({ title, showBack = true, showHeart = false, isLiked = false, onHeartPress }) {
  const { goBack } = useApp();

  return (
    <View style={styles.container}>
      {showBack ? (
        <TouchableOpacity style={styles.iconBtn} onPress={goBack} activeOpacity={0.7}>
          <Feather name="arrow-left" size={22} color={COLORS.textDark} />
        </TouchableOpacity>
      ) : (
        <View style={styles.iconPlaceholder} />
      )}

      <Text style={styles.title} numberOfLines={1}>{title}</Text>

      {showHeart ? (
        <TouchableOpacity style={styles.iconBtn} onPress={onHeartPress} activeOpacity={0.7}>
          <Feather 
            name={isLiked ? "heart" : "heart"} 
            size={20} 
            color={isLiked ? COLORS.badgeRed : COLORS.textDark} 
          />
        </TouchableOpacity>
      ) : (
        <View style={styles.iconPlaceholder} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 52,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
  },
  iconBtn: {
    width: 38,
    height: 38,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 19,
  },
  iconPlaceholder: {
    width: 38,
  },
  title: {
    fontSize: 17,
    fontWeight: '700',
    color: COLORS.textDark,
    textAlign: 'center',
    flex: 1,
  },
});

