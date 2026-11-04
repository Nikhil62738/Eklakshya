import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Feather, Ionicons } from '@expo/vector-icons';
import { COLORS } from '../constants/theme';
import { useApp } from '../context/AppContext';

export default function ForgotPasswordScreen() {
  const { navigate } = useApp();
  const [mobile, setMobile] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSend = () => {
    if (!mobile.trim()) {
      setError('Please enter your mobile number or email');
      return;
    }
    if (!mobile.includes('@') && !/^[6-9]\d{9}$/.test(mobile)) {
      setError('Enter a valid 10-digit mobile number');
      return;
    }
    if (mobile.includes('@') && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(mobile)) {
      setError('Enter a valid email address');
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSent(true);
    }, 900);
  };

  if (sent) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.sentContainer}>
          <View style={styles.sentIcon}>
            <Ionicons name="checkmark-circle" size={64} color={COLORS.primary} />
          </View>
          <Text style={styles.sentTitle}>OTP Sent!</Text>
          <Text style={styles.sentSubtitle}>
            We've sent a password reset OTP to{'\n'}
            <Text style={{ fontWeight: '700', color: COLORS.textDark }}>{mobile}</Text>
          </Text>
          <TouchableOpacity
            style={styles.continueBtn}
            onPress={() => navigate('OTP_VERIFY')}
            activeOpacity={0.85}
          >
            <Text style={styles.continueBtnText}>Enter OTP</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setSent(false)}>
            <Text style={styles.changeLink}>Use a different number/email</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        <View style={styles.container}>
          {/* Header */}
          <View style={styles.headerRow}>
            <TouchableOpacity onPress={() => navigate('LOGIN')} style={styles.backBtn}>
              <Feather name="arrow-left" size={22} color={COLORS.textDark} />
            </TouchableOpacity>
          </View>

          {/* Icon */}
          <View style={styles.iconWrapper}>
            <View style={styles.iconCircle}>
              <Feather name="lock" size={32} color={COLORS.white} />
            </View>
          </View>

          <Text style={styles.title}>Forgot Password?</Text>
          <Text style={styles.subtitle}>
            Enter your mobile number or email and{'\n'}we'll send you a reset OTP
          </Text>

          {/* Input */}
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Mobile Number or Email</Text>
            <View style={[styles.inputRow, error && styles.inputRowError]}>
              <Feather name="phone" size={16} color={COLORS.textMuted} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="9876543210 or email@example.com"
                placeholderTextColor={COLORS.textLight}
                value={mobile}
                onChangeText={v => { setMobile(v); setError(''); }}
                keyboardType="default"
                autoCapitalize="none"
              />
            </View>
            {error ? <Text style={styles.errorText}>{error}</Text> : null}
          </View>

          {/* Send OTP Button */}
          <TouchableOpacity
            style={[styles.sendBtn, loading && { opacity: 0.75 }]}
            onPress={handleSend}
            activeOpacity={0.85}
            disabled={loading}
          >
            <Text style={styles.sendBtnText}>
              {loading ? 'Sending...' : 'Send Reset OTP'}
            </Text>
          </TouchableOpacity>

          {/* Back to Login */}
          <View style={styles.backRow}>
            <Feather name="arrow-left" size={14} color={COLORS.textMuted} />
            <TouchableOpacity onPress={() => navigate('LOGIN')}>
              <Text style={styles.backToLoginText}> Back to Sign In</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.white },
  container: { flex: 1, paddingHorizontal: 24 },
  headerRow: { paddingTop: 12, marginBottom: 20 },
  backBtn: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  iconWrapper: { alignItems: 'center', marginBottom: 20 },
  iconCircle: {
    width: 72, height: 72, borderRadius: 36,
    backgroundColor: COLORS.primary,
    alignItems: 'center', justifyContent: 'center',
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3, shadowRadius: 10, elevation: 6,
  },
  title: { fontSize: 24, fontWeight: '900', color: COLORS.textDark, textAlign: 'center', marginBottom: 8 },
  subtitle: { fontSize: 14, color: COLORS.textMuted, textAlign: 'center', lineHeight: 21, marginBottom: 28 },
  fieldGroup: { marginBottom: 20 },
  label: { fontSize: 13, fontWeight: '700', color: COLORS.textDark, marginBottom: 8 },
  inputRow: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#F7F9F8', borderRadius: 12,
    borderWidth: 1.5, borderColor: '#E5E7EB',
    paddingHorizontal: 14, height: 50,
  },
  inputRowError: { borderColor: '#DC4545' },
  inputIcon: { marginRight: 10 },
  input: { flex: 1, fontSize: 14, color: COLORS.textDark },
  errorText: { fontSize: 11, color: '#DC4545', marginTop: 5, marginLeft: 2 },
  sendBtn: {
    backgroundColor: COLORS.primary, height: 52,
    borderRadius: 26, alignItems: 'center', justifyContent: 'center',
    marginBottom: 16,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3, shadowRadius: 6, elevation: 4,
  },
  sendBtnText: { color: COLORS.white, fontSize: 16, fontWeight: '800' },
  backRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
  backToLoginText: { fontSize: 13, fontWeight: '700', color: COLORS.primary },
  // Sent state
  sentContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 24 },
  sentIcon: { marginBottom: 20 },
  sentTitle: { fontSize: 26, fontWeight: '900', color: COLORS.textDark, marginBottom: 10 },
  sentSubtitle: { fontSize: 14, color: COLORS.textMuted, textAlign: 'center', lineHeight: 21, marginBottom: 28 },
  continueBtn: {
    backgroundColor: COLORS.primary, height: 52, width: '100%',
    borderRadius: 26, alignItems: 'center', justifyContent: 'center',
    marginBottom: 14,
  },
  continueBtnText: { color: COLORS.white, fontSize: 16, fontWeight: '800' },
  changeLink: { fontSize: 13, fontWeight: '700', color: COLORS.primary },
});

