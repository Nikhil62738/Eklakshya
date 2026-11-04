import React, { createContext, useContext, useState } from 'react';
import { INITIAL_CART, INITIAL_BOOKINGS, PROVIDERS } from '../data/mockData';

const AppContext = createContext();

// Generate a GroupSave booking ID: GS + YYYYMMDD + 6-digit random
const generateBookingId = () => {
  const now = new Date();
  const date = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}`;
  const rand = Math.floor(100000 + Math.random() * 900000);
  return `GS${date}${rand}`;
};

export const AppProvider = ({ children }) => {
  const [currentScreen, setCurrentScreen] = useState('WELCOME');
  const [navStack, setNavStack] = useState(['WELCOME']);
  const [activeTab, setActiveTab] = useState('home');
  
  const [cartItems, setCartItems] = useState(INITIAL_CART);
  const [bookings, setBookings] = useState(INITIAL_BOOKINGS);
  const [selectedProvider, setSelectedProvider] = useState(PROVIDERS[0]);
  const [selectedBooking, setSelectedBooking] = useState(INITIAL_BOOKINGS[0]);
  const [activeCategory, setActiveCategory] = useState('AC Service');

  // Coupon state
  const [appliedCoupon, setAppliedCoupon] = useState(null);

  // User profile state
  const [user, setUser] = useState({
    name: 'Nikhil Chopade',
    mobile: '9876543210',
    email: 'nikhil@example.com',
    address: 'Room 101, DBATU Hostel, Lonere',
  });

  // ─── Navigation ──────────────────────────────────────────────────────────────

  const navigate = (screenName, params = {}) => {
    if (params.provider) setSelectedProvider(params.provider);
    if (params.booking) setSelectedBooking(params.booking);
    if (params.category) setActiveCategory(params.category);
    
    setNavStack(prev => [...prev, screenName]);
    setCurrentScreen(screenName);

    if (screenName === 'HOME') setActiveTab('home');
    if (screenName === 'MY_BOOKINGS') setActiveTab('bookings');
  };

  const goBack = () => {
    if (navStack.length > 1) {
      const newStack = [...navStack];
      newStack.pop();
      const prevScreen = newStack[newStack.length - 1];
      setNavStack(newStack);
      setCurrentScreen(prevScreen);
    } else {
      setCurrentScreen('HOME');
    }
  };

  // ─── Cart Operations ─────────────────────────────────────────────────────────

  const updateQuantity = (id, delta) => {
    setCartItems(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  };

  const removeFromCart = (id) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
  };

  const addToCart = (newItem) => {
    setCartItems(prev => {
      const exists = prev.find(i => i.id === newItem.id);
      if (exists) {
        return prev.map(i => i.id === newItem.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, newItem];
    });
  };

  const clearCart = () => {
    setCartItems([]);
  };

  // ─── Coupon / Pricing ─────────────────────────────────────────────────────────

  const COUPON_DISCOUNTS = {
    WELCOME50: 50,
    GROUPSAVE150: 150,
    NEIGHBOR20: 20,
    DIWALI100: 100,
  };

  const couponDiscount = appliedCoupon ? (COUPON_DISCOUNTS[appliedCoupon] || 0) : 0;

  // Computed totals — always derived from cartItems
  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const totalAmount = Math.max(0, subtotal - couponDiscount);
  const totalSavings = 403 + couponDiscount; // 403 = mock group discount from reference image

  // ─── Booking Confirmation (Mock Flow) ────────────────────────────────────────

  const confirmCurrentBooking = (paymentMethod = 'UPI') => {
    const bookingId = generateBookingId();
    const primaryItem = cartItems[0] || {
      title: 'AC Servicing (Single)',
      providerName: 'Cool Air Experts',
      price: 599,
    };

    const now = new Date();
    const dateStr = now.toLocaleDateString('en-IN', {
      day: 'numeric', month: 'short', year: undefined,
    });
    const timeStr = '10:00 AM'; // matches screenshot

    const serviceOTP = String(Math.floor(1000 + Math.random() * 9000));

    const newBooking = {
      id: bookingId,
      title: primaryItem.title.includes('(') ? primaryItem.title : `${primaryItem.title} (Single)`,
      providerName: primaryItem.providerName || 'Cool Air Experts',
      date: `${dateStr}, ${timeStr}`,
      price: `₹${totalAmount || 599}`,
      status: 'Upcoming',
      address: user.address || 'Room 101, DBATU Hostel, Lonere',
      providerRating: '4.8 (1.2k reviews)',
      serviceOTP,
      paymentMethod,
      step: 2,
      image: primaryItem.image || 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=300&q=80',
    };

    setSelectedBooking(newBooking);
    setBookings(prev => [newBooking, ...prev.filter(b => b.id !== bookingId)]);
    clearCart();
    setAppliedCoupon(null);
    navigate('BOOKING_CONFIRMED', { booking: newBooking });
  };

  return (
    <AppContext.Provider value={{
      // Screen navigation
      currentScreen,
      setCurrentScreen,
      navigate,
      goBack,
      activeTab,
      setActiveTab,
      // Cart
      cartItems,
      updateQuantity,
      removeFromCart,
      addToCart,
      clearCart,
      // Coupon
      appliedCoupon,
      setAppliedCoupon,
      couponDiscount,
      // Totals
      totalAmount,
      totalSavings,
      subtotal,
      // Booking
      confirmCurrentBooking,
      bookings,
      setBookings,
      // Provider/Booking selection
      selectedProvider,
      setSelectedProvider,
      selectedBooking,
      setSelectedBooking,
      // Category
      activeCategory,
      setActiveCategory,
      // User
      user,
      setUser,
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
