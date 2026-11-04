const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../middleware/auth');
const { sendOtpEmail } = require('../services/brevoEmailService');

const generateToken = (id) => {
  return jwt.sign({ id }, JWT_SECRET, { expiresIn: '30d' });
};

// @desc    Register a new customer
// @route   POST /api/auth/register
exports.register = async (req, res) => {
  try {
    const { name, email, phone, password, society, locality, flatNo } = req.body;

    if (!name || !email || !phone || !password) {
      return res.status(400).json({ success: false, message: 'Please provide all required fields' });
    }

    const existingUser = await User.findOne({ $or: [{ email: email.toLowerCase() }, { phone }] });
    if (existingUser) {
      return res.status(400).json({ 
        success: false, 
        message: existingUser.email === email.toLowerCase() ? 'Email is already registered' : 'Phone number is already registered' 
      });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Generate referral code e.g. GS-NIKHIL-82
    const baseCode = name.replace(/[^a-zA-Z]/g, '').slice(0, 5).toUpperCase() || 'USER';
    const referralCode = `GS${baseCode}${Math.floor(100 + Math.random() * 900)}`;

    const defaultAddress = {
      title: 'Home',
      flatNo: flatNo || 'Flat 402, Tower 3',
      society: society || 'Prestige Falcon City',
      locality: locality || 'Kanakapura Road',
      city: 'Bengaluru',
      pincode: '560062',
      isDefault: true
    };

    const user = await User.create({
      name,
      email: email.toLowerCase(),
      phone,
      passwordHash,
      referralCode,
      addresses: [defaultAddress]
    });

    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        avatar: user.avatar,
        addresses: user.addresses,
        referralCode: user.referralCode,
        loyaltyPoints: user.loyaltyPoints,
        walletBalance: user.walletBalance
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Login customer with email or phone
// @route   POST /api/auth/login
exports.login = async (req, res) => {
  try {
    const { identifier, password } = req.body; // identifier can be email or phone

    if (!identifier || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email/phone and password' });
    }

    const user = await User.findOne({
      $or: [
        { email: identifier.toLowerCase().trim() },
        { phone: identifier.trim() }
      ]
    });

    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials. User not found.' });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials. Incorrect password.' });
    }

    const token = generateToken(user._id);

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        avatar: user.avatar,
        addresses: user.addresses,
        referralCode: user.referralCode,
        loyaltyPoints: user.loyaltyPoints,
        walletBalance: user.walletBalance
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Send OTP to phone or email via Brevo
// @route   POST /api/auth/send-otp
exports.sendOtp = async (req, res) => {
  try {
    const { phone, email, purpose = 'Verification' } = req.body;
    if (!phone && !email) {
      return res.status(400).json({ success: false, message: 'Phone number or email is required' });
    }

    // Generate secure 6-digit OTP
    const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    let targetEmail = email;
    let targetName = 'Valued Customer';

    // Find user to associate OTP
    const query = [];
    if (phone) query.push({ phone: phone.trim() });
    if (email) query.push({ email: email.toLowerCase().trim() });

    const user = await User.findOne({ $or: query });
    if (user) {
      user.otp = generatedOtp;
      user.otpExpires = expiry;
      await user.save();
      targetEmail = user.email || targetEmail;
      targetName = user.name || targetName;
    }

    // Send via Brevo if email address is available
    let emailResult = null;
    if (targetEmail) {
      emailResult = await sendOtpEmail({
        to: targetEmail,
        name: targetName,
        otp: generatedOtp,
        purpose
      });
    }

    res.json({
      success: true,
      message: `OTP sent successfully${targetEmail ? ` to ${targetEmail}` : ''}. (Demo OTP: ${generatedOtp})`,
      demoOtp: generatedOtp,
      emailSent: emailResult?.success || false
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Verify OTP
// @route   POST /api/auth/verify-otp
exports.verifyOtp = async (req, res) => {
  try {
    const { phone, email, otp } = req.body;
    if ((!phone && !email) || !otp) {
      return res.status(400).json({ success: false, message: 'Phone/Email and OTP are required' });
    }

    const query = [];
    if (phone) query.push({ phone: phone.trim() });
    if (email) query.push({ email: email.toLowerCase().trim() });

    let user = await User.findOne({ $or: query });

    // Validate OTP: accept dynamic Brevo OTP, or standard demo bypasses (123456, 4829)
    const isDynamicMatch = user && user.otp === otp && user.otpExpires && new Date(user.otpExpires) > new Date();
    const isDemoBypass = otp === '123456' || otp === '4829';

    if (!isDynamicMatch && !isDemoBypass) {
      return res.status(400).json({ success: false, message: 'Invalid or expired OTP. Please enter the latest OTP sent.' });
    }

    // Clear OTP after successful verification
    if (user && isDynamicMatch) {
      user.otp = null;
      user.otpExpires = null;
      await user.save();
    }

    if (!user) {
      // Create user if logging in via phone/email OTP first time
      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash('GroupSave@123', salt);
      const userPhone = phone || `98${Math.floor(10000000 + Math.random() * 90000000)}`;
      const userEmail = email ? email.toLowerCase().trim() : `${userPhone}@groupsave.demo`;

      user = await User.create({
        name: `Customer ${userPhone.slice(-4)}`,
        phone: userPhone,
        email: userEmail,
        passwordHash,
        referralCode: `GS${Math.floor(10000 + Math.random() * 90000)}`,
        addresses: [{
          title: 'Home',
          flatNo: 'Tower B - 1204',
          society: 'Sobha Dream Acres',
          locality: 'Panathur Main Rd',
          city: 'Bengaluru',
          pincode: '560087',
          isDefault: true
        }]
      });
    }

    const token = generateToken(user._id);

    res.json({
      success: true,
      message: 'OTP verified successfully',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        avatar: user.avatar,
        addresses: user.addresses,
        referralCode: user.referralCode,
        loyaltyPoints: user.loyaltyPoints,
        walletBalance: user.walletBalance
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get Current Logged in User Profile
// @route   GET /api/auth/me
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-passwordHash');
    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update Profile Details
// @route   PUT /api/auth/profile
exports.updateProfile = async (req, res) => {
  try {
    const { name, email, phone, avatar } = req.body;
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    if (name) user.name = name;
    if (email) user.email = email.toLowerCase().trim();
    if (phone) user.phone = phone.trim();
    if (avatar) user.avatar = avatar;

    await user.save();
    res.json({ success: true, message: 'Profile updated successfully', user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Add / Update Address
// @route   POST /api/auth/addresses
exports.addAddress = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    const newAddress = {
      title: req.body.title || 'Home',
      flatNo: req.body.flatNo,
      society: req.body.society,
      locality: req.body.locality,
      city: req.body.city || 'Bengaluru',
      pincode: req.body.pincode || '560062',
      coordinates: req.body.coordinates || { lat: 12.8912, lng: 77.5683 },
      isDefault: req.body.isDefault || user.addresses.length === 0
    };

    if (newAddress.isDefault) {
      user.addresses.forEach(a => a.isDefault = false);
    }

    user.addresses.push(newAddress);
    await user.save();

    res.json({ success: true, message: 'Address saved successfully', addresses: user.addresses });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete Address
// @route   DELETE /api/auth/addresses/:addressId
exports.deleteAddress = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    user.addresses = user.addresses.filter(a => a._id.toString() !== req.params.addressId);
    await user.save();
    res.json({ success: true, message: 'Address deleted', addresses: user.addresses });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

