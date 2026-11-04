import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Keyboard,
} from 'react-native';
import { Feather, Ionicons } from '@expo/vector-icons';
import { COLORS } from '../constants/theme';
import { useApp } from '../context/AppContext';

const OTP_LENGTH = 6;

export default function OtpVerifyScreen() {
  const { navigate } = useApp();
  const [otp, setOtp] = useState(Array(OTP_LENGTH).fill(''));
  const [timer, setTimer] = useState(30);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const inputs = useRef([]);

  useEffect(() => {
    if (timer <= 0) return;
    const id = setInterval(() => setTimer(t => t - 1), 1000);
    return () => clearInterval(id);
  }, [timer]);

  const handleChange = (val, idx) => {
    if (val.length > 1) {
      // Handle paste
      const digits = val.replace(/\D/g, '').slice(0, OTP_LENGTH).split('');
      const newOtp = [...otp];
      digits.forEach((d, i) => { if (idx + i < OTP_LENGTH) newOtp[idx + i] = d; });
      setOtp(newOtp);
      const nextIdx = Math.min(idx + digits.length, OTP_LENGTH - 1);
      inputs.current[nextIdx]?.focus();
      return;
    }
    if (!/^\d*$/.test(val)) return;
    const newOtp = [...otp];
    newOtp[idx] = val;
    setOtp(newOtp);
    setError('');
    if (val && idx < OTP_LENGTH - 1) inputs.current[idx + 1]?.focus();
  };

  const handleKeyPress = (e, idx) => {
    if (e.nativeEvent.key === 'Backspace' && !otp[idx] && idx > 0) {
      inputs.current[idx - 1]?.focus();
    }
  };

  const handleVerify = () => {
    const code = otp.join('');
    if (code.length < OTP_LENGTH) {
      setError('Please enter the complete 6-digit OTP');
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      navigate('HOME');
    }, 800);
  };

  const handleResend = () => {
    if (timer > 0) return;
    setTimer(30);
    setOtp(Array(OTP_LENGTH).fill(''));
    setError('');
    inputs.current[0]?.focus();
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => navigate('REGISTER')} style={styles.backBtn}>
            <Feather name="arrow-left" size={22} color={COLORS.textDark} />
          </TouchableOpacity>
        </View>

        {/* Icon */}
        <View style={styles.iconWrapper}>
          <View style={styles.iconCircle}>
            <Ionicons name="phone-portrait" size={34} color={COLORS.white} />
          </View>
        </View>

        <Text style={styles.title}>Verify Mobile Number</Text>
        <Text style={styles.subtitle}>
          We've sent a 6-digit OTP to your{'\n'}registered mobile number
        </Text>

        {/* Hint for demo */}
        <View style={styles.demoHint}>
          <Feather name="info" size={13} color="#075B46" />
          <Text style={styles.demoHintText}>Demo OTP: 123456</Text>
        </View>

        {/* OTP Boxes */}
        <View style={styles.otpRow}>
          {otp.map((digit, idx) => (
            <TextInput
              key={idx}
              ref={el => (inputs.current[idx] = el)}
              style={[
                styles.otpBox,
                digit ? styles.otpBoxFilled : null,
                error ? styles.otpBoxError : null,
              ]}
              value={digit}
              onChangeText={val => handleChange(val, idx)}
              onKeyPress={e => handleKeyPress(e, idx)}
              keyboardType="number-pad"
              maxLength={OTP_LENGTH}
              selectTextOnFocus
              textAlign="center"
              returnKeyType="next"
            />
          ))}
        </View>

        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        {/* Timer & Resend */}
        <View style={styles.resendRow}>
          <Text style={styles.resendLabel}>Didn't receive OTP? </Text>
          <TouchableOpacity onPress={handleResend} disabled={timer > 0}>
            <Text style={[styles.resendBtn, timer > 0 && styles.resendBtnDisabled]}>
              {timer > 0 ? `Resend in ${timer}s` : 'Resend OTP'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Verify Button */}
        <TouchableOpacity
          style={[styles.verifyBtn, loading && { opacity: 0.75 }]}
          onPress={handleVerify}
          activeOpacity={0.85}
          disabled={loading}
        >
          <Text style={styles.verifyBtnText}>
            {loading ? 'Verifying...' : 'Verify & Continue'}
          </Text>
        </TouchableOpacity>

        {/* Change Number */}
        <TouchableOpacity
          style={styles.changeNumBtn}
          onPress={() => navigate('REGISTER')}
          activeOpacity={0.7}
        >
          <Feather name="edit-2" size={13} color={COLORS.primary} />
          <Text style={styles.changeNumText}>Change Mobile Number</Text>
        </TouchableOpacity>
      </View>
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
  title: {
    fontSize: 24, fontWeight: '900', color: COLORS.textDark,
    textAlign: 'center', marginBottom: 8,
  },
  subtitle: {
    fontSize: 14, color: COLORS.textMuted,
    textAlign: 'center', lineHeight: 21, marginBottom: 16,
  },
  demoHint: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: '#DDF5EA', borderRadius: 8,
    paddingHorizontal: 12, paddingVertical: 8,
    alignSelf: 'center', marginBottom: 24,
  },
  demoHintText: { fontSize: 12, fontWeight: '700', color: '#075B46' },
  otpRow: {
    flexDirection: 'row', justifyContent: 'center', gap: 10, marginBottom: 12,
  },
  otpBox: {
    width: 46, height: 56, borderRadius: 12,
    borderWidth: 2, borderColor: '#E5E7EB',
    backgroundColor: '#F7F9F8',
    fontSize: 22, fontWeight: '800', color: COLORS.textDark,
  },
  otpBoxFilled: { borderColor: COLORS.primary, backgroundColor: '#F0FDF4' },
  otpBoxError: { borderColor: '#DC4545' },
  errorText: { fontSize: 12, color: '#DC4545', textAlign: 'center', marginBottom: 8 },
  resendRow: {
    flexDirection: 'row', justifyContent: 'center',
    alignItems: 'center', marginBottom: 28,
  },
  resendLabel: { fontSize: 13, color: COLORS.textMuted },
  resendBtn: { fontSize: 13, fontWeight: '800', color: COLORS.primary },
  resendBtnDisabled: { color: COLORS.textLight },
  verifyBtn: {
    backgroundColor: COLORS.primary, height: 52,
    borderRadius: 26, alignItems: 'center', justifyContent: 'center',
    marginBottom: 14,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3, shadowRadius: 6, elevation: 4,
  },
  verifyBtnText: { color: COLORS.white, fontSize: 16, fontWeight: '800' },
  changeNumBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6,
  },
  changeNumText: { fontSize: 13, fontWeight: '700', color: COLORS.primary },
});

