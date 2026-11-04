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

export default function RegisterScreen() {
  const { navigate, registerUser } = useApp();
  const [form, setForm] = useState({
    fullName: '',
    mobile: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const setField = (key, val) => {
    setForm(f => ({ ...f, [key]: val }));
    setErrors(e => ({ ...e, [key]: '' }));
  };

  const validate = () => {
    const errs = {};
    if (!form.fullName.trim()) errs.fullName = 'Full name is required';
    else if (form.fullName.trim().length < 2) errs.fullName = 'Enter a valid full name';
    if (!form.mobile.trim()) errs.mobile = 'Mobile number is required';
    else if (!/^[6-9]\d{9}$/.test(form.mobile)) errs.mobile = 'Enter a valid 10-digit mobile number';
    if (!form.email.trim()) errs.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = 'Enter a valid email';
    if (!form.password) errs.password = 'Password is required';
    else if (form.password.length < 6) errs.password = 'Password must be at least 6 characters';
    if (!form.confirmPassword) errs.confirmPassword = 'Please confirm your password';
    else if (form.password !== form.confirmPassword) errs.confirmPassword = 'Passwords do not match';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleRegister = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      await registerUser(form.fullName, form.email, form.mobile, form.password);
      setLoading(false);
      navigate('OTP_VERIFY');
    } catch (err) {
      setLoading(false);
      navigate('OTP_VERIFY');
    }
  };

  const fields = [
    {
      key: 'fullName', label: 'Full Name', icon: 'user',
      placeholder: 'Nikhil Chopade', keyboardType: 'default',
    },
    {
      key: 'mobile', label: 'Mobile Number', icon: 'phone',
      placeholder: '9876543210', keyboardType: 'phone-pad',
    },
    {
      key: 'email', label: 'Email Address', icon: 'mail',
      placeholder: 'you@example.com', keyboardType: 'email-address',
    },
  ];

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
            <Text style={styles.title}>Create Account</Text>
            <Text style={styles.subtitle}>Join GroupSave — Book Together, Save More</Text>
          </View>

          {/* Form Fields */}
          <View style={styles.form}>
            {fields.map(f => (
              <View key={f.key} style={styles.fieldGroup}>
                <Text style={styles.label}>{f.label}</Text>
                <View style={[styles.inputRow, errors[f.key] && styles.inputRowError]}>
                  <Feather name={f.icon} size={16} color={COLORS.textMuted} style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder={f.placeholder}
                    placeholderTextColor={COLORS.textLight}
                    value={form[f.key]}
                    onChangeText={v => setField(f.key, v)}
                    keyboardType={f.keyboardType}
                    autoCapitalize={f.key === 'fullName' ? 'words' : 'none'}
                  />
                </View>
                {errors[f.key] ? <Text style={styles.errorText}>{errors[f.key]}</Text> : null}
              </View>
            ))}

            {/* Password */}
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Password</Text>
              <View style={[styles.inputRow, errors.password && styles.inputRowError]}>
                <Feather name="lock" size={16} color={COLORS.textMuted} style={styles.inputIcon} />
                <TextInput
                  style={[styles.input, { flex: 1 }]}
                  placeholder="Min. 6 characters"
                  placeholderTextColor={COLORS.textLight}
                  value={form.password}
                  onChangeText={v => setField('password', v)}
                  secureTextEntry={!showPassword}
                />
                <TouchableOpacity onPress={() => setShowPassword(s => !s)} style={styles.eyeBtn}>
                  <Feather name={showPassword ? 'eye-off' : 'eye'} size={16} color={COLORS.textMuted} />
                </TouchableOpacity>
              </View>
              {errors.password ? <Text style={styles.errorText}>{errors.password}</Text> : null}
            </View>

            {/* Confirm Password */}
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Confirm Password</Text>
              <View style={[styles.inputRow, errors.confirmPassword && styles.inputRowError]}>
                <Feather name="lock" size={16} color={COLORS.textMuted} style={styles.inputIcon} />
                <TextInput
                  style={[styles.input, { flex: 1 }]}
                  placeholder="Re-enter your password"
                  placeholderTextColor={COLORS.textLight}
                  value={form.confirmPassword}
                  onChangeText={v => setField('confirmPassword', v)}
                  secureTextEntry={!showConfirm}
                />
                <TouchableOpacity onPress={() => setShowConfirm(s => !s)} style={styles.eyeBtn}>
                  <Feather name={showConfirm ? 'eye-off' : 'eye'} size={16} color={COLORS.textMuted} />
                </TouchableOpacity>
              </View>
              {errors.confirmPassword ? <Text style={styles.errorText}>{errors.confirmPassword}</Text> : null}
            </View>

            {/* Terms note */}
            <Text style={styles.termsNote}>
              By signing up, you agree to GroupSave's{' '}
              <Text style={styles.termsLink}>Terms of Service</Text>
              {' '}and{' '}
              <Text style={styles.termsLink}>Privacy Policy</Text>
            </Text>

            {/* Register Button */}
            <TouchableOpacity
              style={[styles.registerBtn, loading && { opacity: 0.75 }]}
              onPress={handleRegister}
              activeOpacity={0.85}
              disabled={loading}
            >
              <Text style={styles.registerBtnText}>
                {loading ? 'Creating Account...' : 'Create Account'}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>Already have an account? </Text>
            <TouchableOpacity onPress={() => navigate('LOGIN')}>
              <Text style={styles.footerLink}>Sign In</Text>
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
  logoSection: { alignItems: 'center', marginBottom: 28 },
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
  subtitle: { fontSize: 13, color: COLORS.textMuted, textAlign: 'center' },
  form: {},
  fieldGroup: { marginBottom: 16 },
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
  termsNote: { fontSize: 11, color: COLORS.textMuted, lineHeight: 17, marginBottom: 20, marginTop: 4 },
  termsLink: { color: COLORS.primary, fontWeight: '700' },
  registerBtn: {
    backgroundColor: COLORS.primary, height: 50,
    borderRadius: 25, alignItems: 'center', justifyContent: 'center',
    marginBottom: 20,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3, shadowRadius: 6, elevation: 4,
  },
  registerBtnText: { color: COLORS.white, fontSize: 16, fontWeight: '800' },
  footer: { flexDirection: 'row', justifyContent: 'center', marginTop: 10 },
  footerText: { fontSize: 14, color: COLORS.textMuted },
  footerLink: { fontSize: 14, fontWeight: '800', color: COLORS.primary },
});

