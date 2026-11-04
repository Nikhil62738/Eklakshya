import React from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { Feather, Ionicons } from '@expo/vector-icons';
import { COLORS } from '../constants/theme';
import { openUpdateLink } from '../services/updateService';

const { width } = Dimensions.get('window');

export default function UpdateModal({
  visible,
  updateInfo,
  onDismiss,
}) {
  if (!updateInfo) return null;

  const {
    latestVersion,
    currentVersion,
    releaseName,
    releaseNotes,
    downloadUrl,
    apkSize,
    isMandatory,
  } = updateInfo;

  const handleUpdate = () => {
    if (downloadUrl) {
      openUpdateLink(downloadUrl);
    }
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={isMandatory ? () => {} : onDismiss}
    >
      <View style={styles.overlay}>
        <View style={styles.card}>
          
          {/* Top Brand Banner */}
          <View style={styles.topIconWrapper}>
            <View style={styles.iconCircle}>
              <Ionicons name="cloud-download" size={32} color={COLORS.white} />
            </View>
            <View style={styles.badgePulse}>
              <Text style={styles.badgePulseText}>NEW</Text>
            </View>
          </View>

          {/* Title & Version Info */}
          <Text style={styles.title}>Update Available!</Text>
          <Text style={styles.subtitle}>
            A new version of GroupSave is available via GitHub Releases.
          </Text>

          {/* Version Chips */}
          <View style={styles.versionRow}>
            <View style={styles.versionBadgeCurrent}>
              <Text style={styles.versionLabel}>Current</Text>
              <Text style={styles.versionValue}>v{currentVersion}</Text>
            </View>

            <Feather name="arrow-right" size={16} color={COLORS.primary} style={{ marginHorizontal: 8 }} />

            <View style={styles.versionBadgeNew}>
              <Text style={styles.versionLabelNew}>Latest</Text>
              <Text style={styles.versionValueNew}>
                {latestVersion?.startsWith('v') ? latestVersion : `v${latestVersion}`}
              </Text>
            </View>
          </View>

          {apkSize ? (
            <View style={styles.metaRow}>
              <Feather name="hard-drive" size={12} color={COLORS.textMuted} />
              <Text style={styles.metaText}>Download size: {apkSize}</Text>
            </View>
          ) : null}

          {/* Release Notes */}
          <View style={styles.notesSection}>
            <View style={styles.notesHeader}>
              <Feather name="file-text" size={13} color={COLORS.textDark} />
              <Text style={styles.notesTitle}>
                {releaseName ? releaseName : "What's New in this Update"}
              </Text>
            </View>

            <ScrollView style={styles.notesScroll} showsVerticalScrollIndicator={false}>
              <Text style={styles.notesContent}>{releaseNotes}</Text>
            </ScrollView>
          </View>

          {/* Buttons */}
          <View style={styles.actions}>
            <TouchableOpacity
              style={styles.updateBtn}
              onPress={handleUpdate}
              activeOpacity={0.85}
            >
              <Ionicons name="download-outline" size={18} color={COLORS.white} style={{ marginRight: 6 }} />
              <Text style={styles.updateBtnText}>Download & Install</Text>
            </TouchableOpacity>

            {!isMandatory && (
              <TouchableOpacity
                style={styles.laterBtn}
                onPress={onDismiss}
                activeOpacity={0.7}
              >
                <Text style={styles.laterBtnText}>Later</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Source Attribution */}
          <Text style={styles.sourceText}>
            Delivered securely via GitHub Releases • Nikhil62738/Eklakshya
          </Text>

        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  card: {
    width: '100%',
    maxWidth: 380,
    backgroundColor: COLORS.white,
    borderRadius: 22,
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 18,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 10,
  },
  topIconWrapper: {
    position: 'relative',
    marginBottom: 14,
  },
  iconCircle: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 6,
  },
  badgePulse: {
    position: 'absolute',
    top: -2,
    right: -6,
    backgroundColor: '#DC2626',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: COLORS.white,
  },
  badgePulseText: {
    color: COLORS.white,
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  title: {
    fontSize: 20,
    fontWeight: '900',
    color: COLORS.textDark,
    textAlign: 'center',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 12,
    color: COLORS.textMuted,
    textAlign: 'center',
    lineHeight: 17,
    paddingHorizontal: 10,
    marginBottom: 16,
  },
  versionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  versionBadgeCurrent: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
    alignItems: 'center',
  },
  versionLabel: {
    fontSize: 9,
    color: COLORS.textMuted,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  versionValue: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.textDark,
    marginTop: 1,
  },
  versionBadgeNew: {
    backgroundColor: '#DDF5EA',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#A7F3D0',
  },
  versionLabelNew: {
    fontSize: 9,
    color: '#075B46',
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  versionValueNew: {
    fontSize: 13,
    fontWeight: '800',
    color: '#075B46',
    marginTop: 1,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 12,
  },
  metaText: {
    fontSize: 11,
    color: COLORS.textMuted,
    fontWeight: '500',
  },
  notesSection: {
    width: '100%',
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    padding: 12,
    marginBottom: 18,
    maxHeight: 140,
  },
  notesHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    paddingBottom: 6,
  },
  notesTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.textDark,
  },
  notesScroll: {
    maxHeight: 90,
  },
  notesContent: {
    fontSize: 11,
    color: '#4B5563',
    lineHeight: 16,
  },
  actions: {
    width: '100%',
    gap: 8,
  },
  updateBtn: {
    backgroundColor: COLORS.primary,
    height: 48,
    borderRadius: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 3,
  },
  updateBtnText: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: '800',
  },
  laterBtn: {
    paddingVertical: 8,
    alignItems: 'center',
  },
  laterBtnText: {
    color: COLORS.textMuted,
    fontSize: 13,
    fontWeight: '600',
  },
  sourceText: {
    fontSize: 9,
    color: '#9CA3AF',
    marginTop: 10,
    textAlign: 'center',
  },
});

