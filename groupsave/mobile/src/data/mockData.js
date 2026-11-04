export const CATEGORIES = [
  { id: '1', name: 'AC Service', icon: 'wind', bg: '#E0F7FA', color: '#0288D1' },
  { id: '2', name: 'Cleaning', icon: 'sparkles', bg: '#FFF9C4', color: '#F57F17' },
  { id: '3', name: 'Car Wash', icon: 'car', bg: '#E1F5FE', color: '#0288D1' },
  { id: '4', name: 'Electrician', icon: 'zap', bg: '#FFE0B2', color: '#F57C00' },
  { id: '5', name: 'Plumber', icon: 'tool', bg: '#E0F2F1', color: '#00897B' },
  { id: '6', name: 'Pest Control', icon: 'shield', bg: '#E8F5E9', color: '#43A047' },
  { id: '7', name: 'Salon', icon: 'scissors', bg: '#FCE4EC', color: '#D81B60' },
  { id: '8', name: 'Laundry', icon: 'inbox', bg: '#EDE7F6', color: '#5E35B1' },
];

export const PROVIDERS = [
  {
    id: 'p1',
    name: 'Cool Air Experts',
    rating: '4.8',
    reviewsCount: '1.2k',
    distance: '2.3 km',
    category: 'AC Service',
    price: 599,
    originalPrice: 799,
    discount: '25% OFF',
    experience: '4+ yrs exp',
    minBookings: 10,
    image: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=400&q=80',
    avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=200&q=80',
    checklist: [
      'AC Cleaning & Service',
      'Gas Leak Check',
      'Filter Cleaning',
      '1 Month Service Warranty'
    ]
  },
  {
    id: 'p2',
    name: 'FreshCool Service',
    rating: '4.6',
    reviewsCount: '987',
    distance: '1.9 km',
    category: 'AC Service',
    price: 549,
    originalPrice: 699,
    discount: '20% OFF',
    experience: '3+ yrs exp',
    minBookings: 10,
    image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=400&q=80',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
    checklist: [
      'AC Deep Jet Wash',
      'Gas Leak Inspection',
      'Blower & Coil Sanitization'
    ]
  },
  {
    id: 'p3',
    name: 'ACCare Solutions',
    rating: '4.7',
    reviewsCount: '730',
    distance: '4.9 km',
    category: 'AC Service',
    price: 499,
    originalPrice: 650,
    discount: '23% OFF',
    experience: '5+ yrs exp',
    minBookings: 15,
    image: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=400&q=80',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    checklist: [
      'Foam & Jet Cleaning',
      'Outdoor Unit Clean',
      'Gas Pressure Check'
    ]
  },
  {
    id: 'p4',
    name: 'HomeFix Pro',
    rating: '4.5',
    reviewsCount: '824',
    distance: '3.8 km',
    category: 'AC Service',
    price: 599,
    originalPrice: 750,
    discount: '20% OFF',
    experience: '2+ yrs exp',
    minBookings: 10,
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    checklist: [
      'Filter and tray deep wash',
      'Air flow enhancement',
      'Performance report'
    ]
  }
];

export const INITIAL_CART = [
  {
    id: 'c1',
    type: 'SINGLE',
    title: 'AC Servicing',
    providerName: 'Cool Air Experts',
    price: 599,
    quantity: 1,
    image: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=300&q=80'
  },
  {
    id: 'c2',
    type: 'GROUP',
    title: 'AC Servicing (Group)',
    providerName: 'Cool Air Experts',
    price: 599,
    quantity: 1,
    joinStatus: 'Join: 12/20',
    image: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=300&q=80'
  }
];

export const INITIAL_BOOKINGS = [
  {
    id: 'GS20250921001',
    title: 'AC Servicing (Single)',
    providerName: 'Cool Air Experts',
    date: '21 Sep, 10:00 AM',
    price: '₹599',
    status: 'Upcoming',
    address: 'Room 101, DBATU Hostel, Lonere',
    providerRating: '4.8 (1.2k reviews)',
    step: 2, // 1: Booked, 2: Upcoming, 3: In Progress, 4: Completed
    image: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=300&q=80'
  },
  {
    id: 'GS20250921002',
    title: 'AC Servicing (Group)',
    providerName: 'Cool Air Experts',
    date: '21 Sep',
    joinInfo: 'Join: 12/20 • 21 Sep',
    price: '₹599',
    status: 'Upcoming',
    address: 'Room 101, DBATU Hostel, Lonere',
    providerRating: '4.8 (1.2k reviews)',
    step: 2,
    image: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=300&q=80'
  },
  {
    id: 'GS20250915003',
    title: 'AC Servicing',
    providerName: 'HomeFix Pro',
    date: '15 Sep, 2:00 PM',
    price: '₹499',
    status: 'Completed',
    address: 'Room 101, DBATU Hostel, Lonere',
    providerRating: '4.5 (824 reviews)',
    step: 4,
    image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=300&q=80'
  }
];

