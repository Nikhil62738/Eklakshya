import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Feather, Ionicons } from '@expo/vector-icons';
import { COLORS } from '../constants/theme';
import { useApp } from '../context/AppContext';

export default function LoginScreen() {
  const { navigate } = useApp();
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const errs = {};
    if (!mobile.trim()) errs.mobile = 'Mobile number or email is required';
    else if (mobile.includes('@') && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(mobile))
      errs.mobile = 'Enter a valid email';
    else if (!mobile.includes('@') && !/^[6-9]\d{9}$/.test(mobile))
      errs.mobile = 'Enter a valid 10-digit mobile number';
    if (!password) errs.password = 'Password is required';
    else if (password.length < 6) errs.password = 'Password must be at least 6 characters';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleLogin = () => {
    if (!validate()) return;
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      navigate('HOME');
    }, 800);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View style={styles.headerRow}>
            <TouchableOpacity onPress={() => navigate('WELCOME')} style={styles.backBtn}>
              <Feather name="arrow-left" size={22} color={COLORS.textDark} />
            </TouchableOpacity>
          </View>

          {/* Logo & Title */}
          <View style={styles.logoSection}>
            <View style={styles.logoCircle}>
              <Ionicons name="home" size={28} color={COLORS.white} />
            </View>
            <Text style={styles.title}>Welcome back!</Text>
            <Text style={styles.subtitle}>Sign in to your GroupSave account</Text>
          </View>

          {/* Form */}
          <View style={styles.form}>
            {/* Mobile / Email */}
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Mobile Number or Email</Text>
              <View style={[styles.inputRow, errors.mobile && styles.inputRowError]}>
                <Feather name="phone" size={16} color={COLORS.textMuted} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="9876543210 or email@example.com"
                  placeholderTextColor={COLORS.textLight}
                  value={mobile}
                  onChangeText={v => { setMobile(v); setErrors(e => ({ ...e, mobile: '' })); }}
                  keyboardType="default"
                  autoCapitalize="none"
                />
              </View>
              {errors.mobile ? <Text style={styles.errorText}>{errors.mobile}</Text> : null}
            </View>

            {/* Password */}
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Password</Text>
              <View style={[styles.inputRow, errors.password && styles.inputRowError]}>
                <Feather name="lock" size={16} color={COLORS.textMuted} style={styles.inputIcon} />
                <TextInput
                  style={[styles.input, { flex: 1 }]}
                  placeholder="Enter your password"
                  placeholderTextColor={COLORS.textLight}
                  value={password}
                  onChangeText={v => { setPassword(v); setErrors(e => ({ ...e, password: '' })); }}
                  secureTextEntry={!showPassword}
                />
                <TouchableOpacity onPress={() => setShowPassword(s => !s)} style={styles.eyeBtn}>
                  <Feather name={showPassword ? 'eye-off' : 'eye'} size={16} color={COLORS.textMuted} />
                </TouchableOpacity>
              </View>
              {errors.password ? <Text style={styles.errorText}>{errors.password}</Text> : null}
            </View>

            {/* Forgot Password */}
            <TouchableOpacity
              style={styles.forgotRow}
              onPress={() => navigate('FORGOT_PASSWORD')}
            >
              <Text style={styles.forgotText}>Forgot Password?</Text>
            </TouchableOpacity>

            {/* Login Button */}
            <TouchableOpacity
              style={[styles.loginBtn, loading && { opacity: 0.75 }]}
              onPress={handleLogin}
              activeOpacity={0.85}
              disabled={loading}
            >
              {loading ? (
                <Text style={styles.loginBtnText}>Signing in...</Text>
              ) : (
                <Text style={styles.loginBtnText}>Sign In</Text>
              )}
            </TouchableOpacity>

            {/* Divider */}
            <View style={styles.dividerRow}>
              <View style={styles.divider} />
              <Text style={styles.dividerText}>or continue with</Text>
              <View style={styles.divider} />
            </View>

            {/* OTP Login */}
            <TouchableOpacity
              style={styles.otpLoginBtn}
              onPress={() => navigate('OTP_VERIFY')}
              activeOpacity={0.8}
            >
              <Ionicons name="phone-portrait-outline" size={18} color={COLORS.primary} />
              <Text style={styles.otpLoginText}>Login with OTP</Text>
            </TouchableOpacity>
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>Don't have an account? </Text>
            <TouchableOpacity onPress={() => navigate('REGISTER')}>
              <Text style={styles.footerLink}>Sign Up</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.white },
  scroll: { paddingHorizontal: 24, paddingBottom: 36 },
  headerRow: { paddingTop: 12, marginBottom: 8 },
  backBtn: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  logoSection: { alignItems: 'center', marginBottom: 32 },
  logoCircle: {
    width: 60, height: 60, borderRadius: 30,
    backgroundColor: COLORS.primary,
    alignItems: 'center', justifyContent: 'center',
    marginBottom: 14,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3, shadowRadius: 8, elevation: 5,
  },
  title: { fontSize: 24, fontWeight: '900', color: COLORS.textDark, marginBottom: 6 },
  subtitle: { fontSize: 14, color: COLORS.textMuted, textAlign: 'center' },
  form: { gap: 0 },
  fieldGroup: { marginBottom: 18 },
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
  eyeBtn: { padding: 4 },
  errorText: { fontSize: 11, color: '#DC4545', marginTop: 5, marginLeft: 2 },
  forgotRow: { alignItems: 'flex-end', marginBottom: 20, marginTop: -6 },
  forgotText: { fontSize: 12, fontWeight: '700', color: COLORS.primary },
  loginBtn: {
    backgroundColor: COLORS.primary, height: 50,
    borderRadius: 25, alignItems: 'center', justifyContent: 'center',
    marginBottom: 20,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3, shadowRadius: 6, elevation: 4,
  },
  loginBtnText: { color: COLORS.white, fontSize: 16, fontWeight: '800' },
  dividerRow: {
    flexDirection: 'row', alignItems: 'center',
    marginBottom: 16, gap: 10,
  },
  divider: { flex: 1, height: 1, backgroundColor: '#E5E7EB' },
  dividerText: { fontSize: 12, color: COLORS.textMuted, fontWeight: '500' },
  otpLoginBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 8, height: 50, borderRadius: 25,
    borderWidth: 1.5, borderColor: COLORS.primary,
    backgroundColor: '#F0FDF4',
  },
  otpLoginText: { fontSize: 15, fontWeight: '700', color: COLORS.primary },
  footer: { flexDirection: 'row', justifyContent: 'center', marginTop: 28 },
  footerText: { fontSize: 14, color: COLORS.textMuted },
  footerLink: { fontSize: 14, fontWeight: '800', color: COLORS.primary },
});
