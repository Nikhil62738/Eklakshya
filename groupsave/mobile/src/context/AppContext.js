import React, { createContext, useContext, useState } from 'react';
import { INITIAL_CART, INITIAL_BOOKINGS, PROVIDERS } from '../data/mockData';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [currentScreen, setCurrentScreen] = useState('WELCOME');
  const [navStack, setNavStack] = useState(['WELCOME']);
  const [activeTab, setActiveTab] = useState('home');
  
  const [cartItems, setCartItems] = useState(INITIAL_CART);
  const [bookings, setBookings] = useState(INITIAL_BOOKINGS);
  const [selectedProvider, setSelectedProvider] = useState(PROVIDERS[0]);
  const [selectedBooking, setSelectedBooking] = useState(INITIAL_BOOKINGS[0]);
  const [activeCategory, setActiveCategory] = useState('AC Service');

  // Push to screen with navigation history
  const navigate = (screenName, params = {}) => {
    if (params.provider) setSelectedProvider(params.provider);
    if (params.booking) setSelectedBooking(params.booking);
    if (params.category) setActiveCategory(params.category);
    
    setNavStack(prev => [...prev, screenName]);
    setCurrentScreen(screenName);

    // Sync bottom tab if screen is main tab
    if (screenName === 'HOME') setActiveTab('home');
    if (screenName === 'MY_BOOKINGS') setActiveTab('bookings');
  };

  // Back action
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

  // Cart operations
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

  const confirmCurrentBooking = (paymentMethod = 'UPI') => {
    const bookingId = 'GS20250921001'; // Matches screenshot
    const primaryItem = cartItems[0] || {
      title: 'AC Servicing (Single)',
      providerName: 'Cool Air Experts',
      price: 599
    };

    const newBooking = {
      id: bookingId,
      title: primaryItem.title.includes('(') ? primaryItem.title : `${primaryItem.title} (Single)`,
      providerName: primaryItem.providerName || 'Cool Air Experts',
      date: '21 Sep, 10:00 AM',
      price: `₹${totalAmount || 599}`,
      status: 'Upcoming',
      address: 'Room 101, DBATU Hostel, Lonere',
      providerRating: '4.8 (1.2k reviews)',
      serviceOTP: '4829',
      paymentMethod,
      step: 2, // Booked (1) -> Upcoming (2) -> In Progress (3) -> Completed (4)
      image: primaryItem.image || 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=300&q=80'
    };

    setSelectedBooking(newBooking);
    setBookings(prev => [newBooking, ...prev.filter(b => b.id !== bookingId)]);
    navigate('BOOKING_CONFIRMED', { booking: newBooking });
  };

  const totalAmount = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const totalSavings = 403; // matches the image "You are saving ₹403"

  return (
    <AppContext.Provider value={{
      currentScreen,
      setCurrentScreen,
      navigate,
      goBack,
      activeTab,
      setActiveTab,
      cartItems,
      updateQuantity,
      removeFromCart,
      addToCart,
      clearCart,
      confirmCurrentBooking,
      totalAmount,
      totalSavings,
      bookings,
      setBookings,
      selectedProvider,
      setSelectedProvider,
      selectedBooking,
      setSelectedBooking,
      activeCategory,
      setActiveCategory
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);

