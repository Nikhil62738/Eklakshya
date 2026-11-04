const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const connectDB = require('../config/db');
const User = require('../models/User');
const Provider = require('../models/Provider');
const Service = require('../models/Service');
const GroupDeal = require('../models/GroupDeal');
const Booking = require('../models/Booking');
const Payment = require('../models/Payment');
const Review = require('../models/Review');

const seedData = async () => {
  try {
    await connectDB();
    console.log('[Seed] Clearing existing collections...');
    await User.deleteMany({});
    await Provider.deleteMany({});
    await Service.deleteMany({});
    await GroupDeal.deleteMany({});
    await Booking.deleteMany({});
    await Payment.deleteMany({});
    await Review.deleteMany({});

    console.log('[Seed] Creating demo users...');
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash('Password@123', salt);

    const rahul = await User.create({
      name: 'Rahul Sharma',
      email: 'rahul@groupsave.in',
      phone: '9876543210',
      passwordHash,
      role: 'customer',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=250&q=80',
      referralCode: 'GSRAHUL10',
      loyaltyPoints: 320,
      walletBalance: 250,
      addresses: [
        {
          title: 'Home (Prestige Falcon City)',
          flatNo: 'Tower 4 - Flat 1202',
          society: 'Prestige Falcon City',
          locality: 'Kanakapura Road',
          city: 'Bengaluru',
          pincode: '560062',
          coordinates: { lat: 12.8912, lng: 77.5683 },
          isDefault: true
        },
        {
          title: 'Work / Office',
          flatNo: 'Block 2, Level 5',
          society: 'Embassy TechVillage',
          locality: 'Outer Ring Road, Bellandur',
          city: 'Bengaluru',
          pincode: '560103',
          coordinates: { lat: 12.9352, lng: 77.6945 },
          isDefault: false
        }
      ]
    });

    const priya = await User.create({
      name: 'Priya Nair',
      email: 'priya@groupsave.in',
      phone: '9876543211',
      passwordHash,
      role: 'customer',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=250&q=80',
      referralCode: 'GSPRIYA22',
      loyaltyPoints: 180,
      addresses: [
        {
          title: 'Home (Sobha Dream Acres)',
          flatNo: 'Wing C - 804',
          society: 'Sobha Dream Acres',
          locality: 'Panathur Main Road',
          city: 'Bengaluru',
          pincode: '560087',
          coordinates: { lat: 12.9431, lng: 77.7123 },
          isDefault: true
        }
      ]
    });

    console.log('[Seed] Creating approved service providers...');
    const providers = await Provider.create([
      {
        businessName: 'Cool Air Experts',
        ownerName: 'Sunil Verma',
        email: 'sunil@coolair.com',
        phone: '9845012345',
        avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=250&q=80',
        approvalStatus: 'approved',
        activeStatus: true,
        verifiedBadge: true,
        rating: 4.8,
        ratingCount: 194,
        completedBookingsCount: 420,
        serviceCategories: ['AC Servicing', 'Appliance Repair'],
        location: {
          address: '14th Main, Sector 4',
          locality: 'HSR Layout',
          city: 'Bengaluru',
          coordinates: { lat: 12.9121, lng: 77.6445 }
        },
        operatingRadiusKm: 18,
        experienceYears: 7
      },
      {
        businessName: 'CleanNest Pro Facility Services',
        ownerName: 'Anita Krishnan',
        email: 'anita@cleannest.com',
        phone: '9845023456',
        avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=250&q=80',
        approvalStatus: 'approved',
        activeStatus: true,
        verifiedBadge: true,
        rating: 4.9,
        ratingCount: 312,
        completedBookingsCount: 850,
        serviceCategories: ['Home Cleaning', 'Pest Control'],
        location: {
          address: '80 Feet Road, 4th Block',
          locality: 'Koramangala',
          city: 'Bengaluru',
          coordinates: { lat: 12.9345, lng: 77.6255 }
        },
        operatingRadiusKm: 20,
        experienceYears: 9
      },
      {
        businessName: 'VoltFix Master Electricians',
        ownerName: 'Ramesh Gowda',
        email: 'ramesh@voltfix.com',
        phone: '9845034567',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80',
        approvalStatus: 'approved',
        activeStatus: true,
        verifiedBadge: true,
        rating: 4.8,
        ratingCount: 156,
        completedBookingsCount: 380,
        serviceCategories: ['Electrician', 'Appliance Repair'],
        location: {
          address: 'Outer Ring Road, Near EcoSpace',
          locality: 'Bellandur',
          city: 'Bengaluru',
          coordinates: { lat: 12.9260, lng: 77.6762 }
        },
        operatingRadiusKm: 15,
        experienceYears: 6
      },
      {
        businessName: 'FlowRight Modern Plumbing',
        ownerName: 'Deepak Patil',
        email: 'deepak@flowright.com',
        phone: '9845045678',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=250&q=80',
        approvalStatus: 'approved',
        activeStatus: true,
        verifiedBadge: true,
        rating: 4.7,
        ratingCount: 110,
        completedBookingsCount: 290,
        serviceCategories: ['Plumbing'],
        location: {
          address: '2nd Stage, Bannerghatta Main Rd',
          locality: 'BTM Layout',
          city: 'Bengaluru',
          coordinates: { lat: 12.9165, lng: 77.6101 }
        },
        operatingRadiusKm: 16,
        experienceYears: 5
      },
      {
        businessName: 'GlamourAtHome Salon Studio',
        ownerName: 'Pooja Hegde',
        email: 'pooja@glamourathome.com',
        phone: '9845056789',
        avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=250&q=80',
        approvalStatus: 'approved',
        activeStatus: true,
        verifiedBadge: true,
        rating: 4.9,
        ratingCount: 260,
        completedBookingsCount: 620,
        serviceCategories: ['Salon & Beauty'],
        location: {
          address: '100 Feet Road',
          locality: 'Indiranagar',
          city: 'Bengaluru',
          coordinates: { lat: 12.9719, lng: 77.6412 }
        },
        operatingRadiusKm: 18,
        experienceYears: 8
      },
      {
        businessName: 'AutoShine Doorstep Wash & Detailing',
        ownerName: 'Karthik Rao',
        email: 'karthik@autoshine.com',
        phone: '9845067890',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=250&q=80',
        approvalStatus: 'approved',
        activeStatus: true,
        verifiedBadge: true,
        rating: 4.8,
        ratingCount: 178,
        completedBookingsCount: 490,
        serviceCategories: ['Car Wash'],
        location: {
          address: 'ITPL Main Road',
          locality: 'Whitefield',
          city: 'Bengaluru',
          coordinates: { lat: 12.9698, lng: 77.7499 }
        },
        operatingRadiusKm: 20,
        experienceYears: 5
      }
    ]);

    const [coolAir, cleanNest, voltFix, flowRight, glamourSalon, autoShine] = providers;

    console.log('[Seed] Creating services across all categories...');
    const services = await Service.create([
      // 1. AC Servicing
      {
        providerId: coolAir._id,
        title: 'Master Jet Split AC Deep Servicing',
        category: 'AC Servicing',
        description: 'Comprehensive high-pressure jet pump cleaning of cooling coils, blower wheel, drain tray & outdoor unit. Boosts cooling by up to 40% and reduces electricity bills.',
        individualPrice: 799,
        estimatedDuration: '60 mins',
        groupPricingTiers: [
          { minGroupSize: 5, maxGroupSize: 9, discountedPrice: 699, discountPercent: 12 },
          { minGroupSize: 10, maxGroupSize: 19, discountedPrice: 649, discountPercent: 19 },
          { minGroupSize: 20, maxGroupSize: 50, discountedPrice: 599, discountPercent: 25 }
        ],
        images: [
          'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80'
        ],
        thumbnail: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=800&q=80',
        included: [
          'High pressure jet pump wash of indoor coil and filters',
          'Outdoor unit condenser coil cleaning & dust purge',
          'Drain pipe clearing to eliminate water leakage',
          'Gas pressure and amp check with digital multimeter',
          'Cooling performance test (before vs after)'
        ],
        excluded: [
          'Spare parts replacement or copper piping fixes',
          'Gas top-up or refrigerant filling (charged extra if needed)'
        ],
        warranty: '30-Day No Questions Asked Cooling Guarantee',
        rating: 4.8,
        reviewCount: 142,
        popular: true
      },
      // 2. Home Cleaning
      {
        providerId: cleanNest._id,
        title: 'Full Home Deep Cleaning & Sanitization',
        category: 'Home Cleaning',
        description: 'Deep mechanized cleaning covering kitchen degreasing, bathroom descaling, balcony wash, dry vacuuming of upholstery and motorized floor scrubbing.',
        individualPrice: 2499,
        estimatedDuration: '4 - 5 hours',
        groupPricingTiers: [
          { minGroupSize: 4, maxGroupSize: 7, discountedPrice: 2199, discountPercent: 12 },
          { minGroupSize: 8, maxGroupSize: 14, discountedPrice: 1899, discountPercent: 24 },
          { minGroupSize: 15, maxGroupSize: 30, discountedPrice: 1699, discountPercent: 32 }
        ],
        images: [
          'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?auto=format&fit=crop&w=800&q=80'
        ],
        thumbnail: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=800&q=80',
        included: [
          'Single disc machine floor scrubbing with Diversey chemicals',
          'Chimney exterior, cabinets and slab degreasing',
          'Tile grout stain removal and toilet bowl descaling',
          'Window panes and balcony grill high pressure cleaning',
          'Dusting of fans, lights, baseboards and switches'
        ],
        excluded: [
          'Interior appliance cleaning (refrigerator inside / oven inside)',
          'Heavy furniture lifting beyond safe limits'
        ],
        warranty: '100% Satisfaction Re-clean Guarantee within 24 hours',
        rating: 4.9,
        reviewCount: 220,
        popular: true
      },
      // 3. Electrician
      {
        providerId: voltFix._id,
        title: 'Electrical Safety Inspection & Appliance Wiring',
        category: 'Electrician',
        description: 'Certified electrical inspection, circuit breaker safety check, socket earthing check, and fixing up to 3 fixtures or switches.',
        individualPrice: 499,
        estimatedDuration: '45 mins',
        groupPricingTiers: [
          { minGroupSize: 5, maxGroupSize: 9, discountedPrice: 419, discountPercent: 16 },
          { minGroupSize: 10, maxGroupSize: 20, discountedPrice: 349, discountPercent: 30 }
        ],
        images: [
          'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?auto=format&fit=crop&w=800&q=80'
        ],
        thumbnail: 'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?auto=format&fit=crop&w=800&q=80',
        included: [
          'Full DB box & MCB load testing',
          'Earthing leakage check across all bedroom & kitchen sockets',
          'Installation/repair of 2 switchboards or ceiling fans'
        ],
        excluded: [
          'Cost of new switches, wires, or replacement MCBs'
        ],
        warranty: '60-Day Workmanship Warranty',
        rating: 4.8,
        reviewCount: 88,
        popular: false
      },
      // 4. Plumbing
      {
        providerId: flowRight._id,
        title: 'Complete Plumbing Leakage & Pressure Care',
        category: 'Plumbing',
        description: 'Inspection and repair of kitchen sink traps, washbasin faucets, concealed toilet flush tanks, and booster pump pressure check.',
        individualPrice: 599,
        estimatedDuration: '60 mins',
        groupPricingTiers: [
          { minGroupSize: 5, maxGroupSize: 9, discountedPrice: 499, discountPercent: 17 },
          { minGroupSize: 10, maxGroupSize: 25, discountedPrice: 399, discountPercent: 33 }
        ],
        images: [
          'https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?auto=format&fit=crop&w=800&q=80'
        ],
        thumbnail: 'https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?auto=format&fit=crop&w=800&q=80',
        included: [
          'Tap washer and spindle replacement',
          'Waste pipe replacement and silicon sealing',
          'Pressure test of hot and cold water mixer lines'
        ],
        excluded: [
          'Cost of brand new faucets or sanitary ware'
        ],
        warranty: '30-Day Leak-Free Guarantee',
        rating: 4.7,
        reviewCount: 95,
        popular: true
      },
      // 5. Salon & Beauty
      {
        providerId: glamourSalon._id,
        title: 'Hydra-Glow Facial & Relaxing Head Massage',
        category: 'Salon & Beauty',
        description: 'Premium salon at home experience using organic botanical products. Includes steam, extraction, gentle massage, and hydro jelly peel-off mask.',
        individualPrice: 1299,
        estimatedDuration: '75 mins',
        groupPricingTiers: [
          { minGroupSize: 4, maxGroupSize: 8, discountedPrice: 1099, discountPercent: 15 },
          { minGroupSize: 9, maxGroupSize: 15, discountedPrice: 899, discountPercent: 31 }
        ],
        images: [
          'https://images.unsplash.com/photo-1560750588-73207b1ef5b8?auto=format&fit=crop&w=800&q=80'
        ],
        thumbnail: 'https://images.unsplash.com/photo-1560750588-73207b1ef5b8?auto=format&fit=crop&w=800&q=80',
        included: [
          'Deep pore cleansing and oxygen mist spray',
          'Aroma lymphatic facial massage (20 mins)',
          'Cooling alginate peel-off mask',
          'Shoulder and neck tension relief massage'
        ],
        excluded: [
          'Hair coloring or chemical treatments'
        ],
        warranty: 'Single-use sanitized kits and sterilized tools',
        rating: 4.9,
        reviewCount: 167,
        popular: true
      },
      // 6. Car Wash
      {
        providerId: autoShine._id,
        title: 'Doorstep Waterless Eco Foam Wash & Interior Detailing',
        category: 'Car Wash',
        description: 'Professional society doorstep car detailing with pH neutral snow foam, rim iron decontamination, dashboard UV dressing, and 3-stage interior vacuuming.',
        individualPrice: 650,
        estimatedDuration: '50 mins',
        groupPricingTiers: [
          { minGroupSize: 6, maxGroupSize: 11, discountedPrice: 520, discountPercent: 20 },
          { minGroupSize: 12, maxGroupSize: 25, discountedPrice: 420, discountPercent: 35 }
        ],
        images: [
          'https://images.unsplash.com/photo-1520340356584-f9917d1eea6f?auto=format&fit=crop&w=800&q=80'
        ],
        thumbnail: 'https://images.unsplash.com/photo-1520340356584-f9917d1eea6f?auto=format&fit=crop&w=800&q=80',
        included: [
          'High gloss snow foam body wash',
          'Deep vacuum of seats, carpets, footmats and trunk',
          'Windshield hydrophobic coating',
          'Tire gloss and trim conditioning'
        ],
        excluded: [
          'Engine bay wash or paint scratch correction'
        ],
        warranty: 'Water-spot free guarantee',
        rating: 4.8,
        reviewCount: 182,
        popular: true
      },
      // 7. Pest Control
      {
        providerId: cleanNest._id,
        title: 'Society Shield Herbal Pest Control (Cockroach & Ant)',
        category: 'Pest Control',
        description: '100% odorless Bayer gel paste treatment safe for children and pets. Zero need to empty kitchen cabinets or vacate home.',
        individualPrice: 899,
        estimatedDuration: '45 mins',
        groupPricingTiers: [
          { minGroupSize: 5, maxGroupSize: 9, discountedPrice: 749, discountPercent: 17 },
          { minGroupSize: 10, maxGroupSize: 20, discountedPrice: 599, discountPercent: 33 }
        ],
        images: [
          'https://images.unsplash.com/photo-1628177142898-93e36e4e3a50?auto=format&fit=crop&w=800&q=80'
        ],
        thumbnail: 'https://images.unsplash.com/photo-1628177142898-93e36e4e3a50?auto=format&fit=crop&w=800&q=80',
        included: [
          'Odorless Bayer micro-gel dots applied across hinges and corners',
          'Anti-cockroach drain powder treatment',
          'Residual spray for balconies and utility areas'
        ],
        excluded: [
          'Bed bug or termite wood treatment'
        ],
        warranty: '90-Day Free Retreatment Warranty',
        rating: 4.8,
        reviewCount: 120,
        popular: false
      },
      // 8. Laundry
      {
        providerId: cleanNest._id,
        title: 'Bulk Steam Ironing & Wash-Fold Basket (10kg)',
        category: 'Laundry',
        description: 'Society doorstep pickup and return. Soft water wash with eco-friendly detergent and boiler steam press on hanger/fold.',
        individualPrice: 550,
        estimatedDuration: '24 hour turnaround',
        groupPricingTiers: [
          { minGroupSize: 5, maxGroupSize: 10, discountedPrice: 450, discountPercent: 18 },
          { minGroupSize: 11, maxGroupSize: 30, discountedPrice: 380, discountPercent: 31 }
        ],
        images: [
          'https://images.unsplash.com/photo-1545173168-9f1947eebb7f?auto=format&fit=crop&w=800&q=80'
        ],
        thumbnail: 'https://images.unsplash.com/photo-1545173168-9f1947eebb7f?auto=format&fit=crop&w=800&q=80',
        included: [
          'Free society lobby doorstep pickup and drop',
          'Color segregation and fabric softener wash',
          'Industrial high-temperature boiler steam ironing'
        ],
        excluded: [
          'Heavy winter quilts or expensive silk saree dry cleaning'
        ],
        warranty: 'Zero Fabric Shrinkage or Color Bleed Promise',
        rating: 4.7,
        reviewCount: 75,
        popular: false
      },
      // 9. Carpenter
      {
        providerId: voltFix._id,
        title: 'Door Locks, Hinges & Furniture Repair Consultation',
        category: 'Carpenter',
        description: 'Expert carpenter visit to repair sagging wardrobe doors, loose bed frames, install hydraulic hinges, or hang heavy wall art.',
        individualPrice: 450,
        estimatedDuration: '60 mins',
        groupPricingTiers: [
          { minGroupSize: 5, maxGroupSize: 9, discountedPrice: 380, discountPercent: 16 },
          { minGroupSize: 10, maxGroupSize: 20, discountedPrice: 299, discountPercent: 34 }
        ],
        images: [
          'https://images.unsplash.com/photo-1581783342308-f792dbdd27c5?auto=format&fit=crop&w=800&q=80'
        ],
        thumbnail: 'https://images.unsplash.com/photo-1581783342308-f792dbdd27c5?auto=format&fit=crop&w=800&q=80',
        included: [
          'Up to 3 minor wood/fitting repairs',
          'Alignment of wardrobe sliding tracks and magnetic catchers',
          'Precision drilling with laser level'
        ],
        excluded: [
          'Cost of raw timber, ply, or designer hardware'
        ],
        warranty: '30-Day Alignment Guarantee',
        rating: 4.6,
        reviewCount: 64,
        popular: false
      },
      // 10. Home Painting
      {
        providerId: cleanNest._id,
        title: 'Accent Feature Wall Texture & Royale Luxury Paint',
        category: 'Home Painting',
        description: 'Revamp your living room or master bedroom wall with metallic/stucco texture or anti-bacterial Asian Paints Royale finish.',
        individualPrice: 3200,
        estimatedDuration: '4 - 6 hours',
        groupPricingTiers: [
          { minGroupSize: 3, maxGroupSize: 6, discountedPrice: 2700, discountPercent: 16 },
          { minGroupSize: 7, maxGroupSize: 15, discountedPrice: 2300, discountPercent: 28 }
        ],
        images: [
          'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&w=800&q=80'
        ],
        thumbnail: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&w=800&q=80',
        included: [
          'Complete floor and furniture masking with plastic sheets',
          'Wall sanding, putty touchup and acrylic primer coat',
          '2 coats of premium washable paint'
        ],
        excluded: [
          'Severe wall seepage rectification or civil plaster repair'
        ],
        warranty: '1-Year Paint Peeling Warranty',
        rating: 4.8,
        reviewCount: 52,
        popular: false
      },
      // 11. Appliance Repair
      {
        providerId: coolAir._id,
        title: 'Washing Machine / Refrigerator Diagnostic & Tune-up',
        category: 'Appliance Repair',
        description: 'Complete inspection for front load / top load washing machines (drain issues, spin noise) and refrigerators (cooling failure, sensor issues).',
        individualPrice: 399,
        estimatedDuration: '45 mins',
        groupPricingTiers: [
          { minGroupSize: 5, maxGroupSize: 9, discountedPrice: 320, discountPercent: 20 },
          { minGroupSize: 10, maxGroupSize: 20, discountedPrice: 249, discountPercent: 38 }
        ],
        images: [
          'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80'
        ],
        thumbnail: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80',
        included: [
          'Full electronic PCB error code readout',
          'Drum suspension and motor belt check',
          'Descaling cycle guidance'
        ],
        excluded: [
          'Cost of new motor, PCB or compressor'
        ],
        warranty: '90-Day Spare Parts Warranty',
        rating: 4.8,
        reviewCount: 115,
        popular: true
      },
      // 12. Other Services
      {
        providerId: cleanNest._id,
        title: 'Living Room 5-Seater Sofa & Rug Deep Shampoo Clean',
        category: 'Other Services',
        description: 'High-suction extraction injection cleaning using German Karcher equipment. Removes tough tea/coffee stains, dust mites and pet hair.',
        individualPrice: 1199,
        estimatedDuration: '90 mins',
        groupPricingTiers: [
          { minGroupSize: 4, maxGroupSize: 8, discountedPrice: 999, discountPercent: 17 },
          { minGroupSize: 9, maxGroupSize: 18, discountedPrice: 849, discountPercent: 29 }
        ],
        images: [
          'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=800&q=80'
        ],
        thumbnail: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=800&q=80',
        included: [
          'Dry vacuuming to dislodge trapped dirt and allergen particles',
          'Enzyme foam shampoo agitation for stubborn stains',
          'High vacuum extraction leaving sofa 90% dry'
        ],
        excluded: [
          'Torn fabric or leather re-upholstery'
        ],
        warranty: '100% Stain Reduction Guarantee',
        rating: 4.7,
        reviewCount: 93,
        popular: false
      }
    ]);

    const acService = services[0];
    const cleaningService = services[1];
    const carWashService = services[5];
    const pestService = services[6];

    console.log('[Seed] Creating active Group Deals...');
    // Deal 1: Prestige Falcon City AC Servicing (Active - 7/10 joined, 3 needed for min target)
    const deadline1 = new Date();
    deadline1.setHours(deadline1.getHours() + 14);

    const deal1 = await GroupDeal.create({
      serviceId: acService._id,
      providerId: coolAir._id,
      title: 'Prestige Falcon City – Society AC Servicing Drive',
      category: 'AC Servicing',
      minimumGroupSize: 10,
      maximumGroupSize: 25,
      pricingTiers: acService.groupPricingTiers,
      regularPrice: acService.individualPrice,
      currentGroupPrice: 699,
      deadline: deadline1,
      serviceDate: 'Tomorrow, 10:00 AM – 04:00 PM',
      serviceLocation: {
        society: 'Prestige Falcon City',
        locality: 'Kanakapura Road',
        city: 'Bengaluru',
        pincode: '560062',
        coordinates: { lat: 12.8912, lng: 77.5683 }
      },
      status: 'ACTIVE',
      fallbackStatus: 'NOT_TRIGGERED',
      currentParticipants: [
        {
          userId: priya._id,
          name: 'Priya Nair',
          society: 'Prestige Falcon City',
          flatNo: 'Tower 2 - 401',
          quantity: 1,
          bookingId: 'GS-GRP-2026-9101',
          status: 'JOINED'
        },
        {
          userId: rahul._id,
          name: 'Rahul Sharma',
          society: 'Prestige Falcon City',
          flatNo: 'Tower 4 - 1202',
          quantity: 1,
          bookingId: 'GS-GRP-2026-9102',
          status: 'JOINED'
        },
        {
          userId: new mongoose.Types.ObjectId(),
          name: 'Vikram Seth',
          society: 'Prestige Falcon City',
          flatNo: 'Tower 1 - 703',
          quantity: 2,
          bookingId: 'GS-GRP-2026-9103',
          status: 'JOINED'
        },
        {
          userId: new mongoose.Types.ObjectId(),
          name: 'Ananya Roy',
          society: 'Prestige Falcon City',
          flatNo: 'Tower 3 - 1104',
          quantity: 1,
          bookingId: 'GS-GRP-2026-9104',
          status: 'JOINED'
        },
        {
          userId: new mongoose.Types.ObjectId(),
          name: 'Gaurav Kulkarni',
          society: 'Prestige Falcon City',
          flatNo: 'Tower 5 - 302',
          quantity: 1,
          bookingId: 'GS-GRP-2026-9105',
          status: 'JOINED'
        },
        {
          userId: new mongoose.Types.ObjectId(),
          name: 'Suresh Patel',
          society: 'Prestige Falcon City',
          flatNo: 'Tower 2 - 1502',
          quantity: 1,
          bookingId: 'GS-GRP-2026-9106',
          status: 'JOINED'
        },
        {
          userId: new mongoose.Types.ObjectId(),
          name: 'Meera Iyer',
          society: 'Prestige Falcon City',
          flatNo: 'Tower 4 - 904',
          quantity: 1,
          bookingId: 'GS-GRP-2026-9107',
          status: 'JOINED'
        }
      ]
    });

    // Deal 2: Sobha Dream Acres Cleaning (Target Achieved! 8/8 joined)
    const deadline2 = new Date();
    deadline2.setHours(deadline2.getHours() + 28);
    const deal2 = await GroupDeal.create({
      serviceId: cleaningService._id,
      providerId: cleanNest._id,
      title: 'Sobha Dream Acres – Weekend Deep Cleaning Festival',
      category: 'Home Cleaning',
      minimumGroupSize: 8,
      maximumGroupSize: 20,
      pricingTiers: cleaningService.groupPricingTiers,
      regularPrice: cleaningService.individualPrice,
      currentGroupPrice: 1899,
      deadline: deadline2,
      serviceDate: 'Saturday, 09:00 AM – 02:00 PM',
      serviceLocation: {
        society: 'Sobha Dream Acres',
        locality: 'Panathur Main Road',
        city: 'Bengaluru',
        pincode: '560087',
        coordinates: { lat: 12.9431, lng: 77.7123 }
      },
      status: 'TARGET_ACHIEVED',
      fallbackStatus: 'NOT_TRIGGERED',
      currentParticipants: [
        { userId: priya._id, name: 'Priya Nair', society: 'Sobha Dream Acres', flatNo: 'Wing C - 804', quantity: 1, bookingId: 'GS-GRP-2026-9201', status: 'JOINED' },
        { userId: new mongoose.Types.ObjectId(), name: 'Arjun Das', society: 'Sobha Dream Acres', flatNo: 'Wing A - 102', quantity: 1, bookingId: 'GS-GRP-2026-9202', status: 'JOINED' },
        { userId: new mongoose.Types.ObjectId(), name: 'Sneha Rao', society: 'Sobha Dream Acres', flatNo: 'Wing D - 501', quantity: 1, bookingId: 'GS-GRP-2026-9203', status: 'JOINED' },
        { userId: new mongoose.Types.ObjectId(), name: 'Manoj Singh', society: 'Sobha Dream Acres', flatNo: 'Wing B - 1201', quantity: 1, bookingId: 'GS-GRP-2026-9204', status: 'JOINED' },
        { userId: new mongoose.Types.ObjectId(), name: 'Divya Shenoy', society: 'Sobha Dream Acres', flatNo: 'Wing E - 703', quantity: 1, bookingId: 'GS-GRP-2026-9205', status: 'JOINED' },
        { userId: new mongoose.Types.ObjectId(), name: 'Kiran Reddy', society: 'Sobha Dream Acres', flatNo: 'Wing C - 302', quantity: 1, bookingId: 'GS-GRP-2026-9206', status: 'JOINED' },
        { userId: new mongoose.Types.ObjectId(), name: 'Rohan Gupta', society: 'Sobha Dream Acres', flatNo: 'Wing A - 904', quantity: 1, bookingId: 'GS-GRP-2026-9207', status: 'JOINED' },
        { userId: new mongoose.Types.ObjectId(), name: 'Pallavi Joshi', society: 'Sobha Dream Acres', flatNo: 'Wing D - 1102', quantity: 1, bookingId: 'GS-GRP-2026-9208', status: 'JOINED' }
      ]
    });

    // Deal 3: Detailing at Whitefield
    const deadline3 = new Date();
    deadline3.setHours(deadline3.getHours() + 36);
    const deal3 = await GroupDeal.create({
      serviceId: carWashService._id,
      providerId: autoShine._id,
      title: 'Whitefield Prestige Boulevard – Doorstep Detailing Sunday',
      category: 'Car Wash',
      minimumGroupSize: 12,
      maximumGroupSize: 25,
      pricingTiers: carWashService.groupPricingTiers,
      regularPrice: carWashService.individualPrice,
      currentGroupPrice: 520,
      deadline: deadline3,
      serviceDate: 'Sunday, 08:00 AM – 01:00 PM',
      serviceLocation: {
        society: 'Prestige Boulevard',
        locality: 'Whitefield',
        city: 'Bengaluru',
        pincode: '560066',
        coordinates: { lat: 12.9698, lng: 77.7499 }
      },
      status: 'ACTIVE',
      fallbackStatus: 'NOT_TRIGGERED',
      currentParticipants: [
        { userId: new mongoose.Types.ObjectId(), name: 'Aditya Menon', society: 'Prestige Boulevard', flatNo: 'B-302', quantity: 1, bookingId: 'GS-GRP-2026-9301', status: 'JOINED' },
        { userId: new mongoose.Types.ObjectId(), name: 'Siddharth V.', society: 'Prestige Boulevard', flatNo: 'C-701', quantity: 1, bookingId: 'GS-GRP-2026-9302', status: 'JOINED' },
        { userId: new mongoose.Types.ObjectId(), name: 'Neha Batra', society: 'Prestige Boulevard', flatNo: 'A-104', quantity: 1, bookingId: 'GS-GRP-2026-9303', status: 'JOINED' }
      ]
    });

    // Deal 4: Special Deal for REQUIREMENT 10 Demo:
    // "TARGET_MISSED" status deal where deadline has passed and fallback choice is pending!
    const expiredDeadline = new Date();
    expiredDeadline.setHours(expiredDeadline.getHours() - 2); // expired 2 hours ago

    const fallbackDeal = await GroupDeal.create({
      serviceId: pestService._id,
      providerId: cleanNest._id,
      title: 'HSR Sector 4 – Society Eco Pest Shield Drive',
      category: 'Pest Control',
      minimumGroupSize: 15,
      maximumGroupSize: 30,
      pricingTiers: pestService.groupPricingTiers,
      regularPrice: pestService.individualPrice,
      currentGroupPrice: 749,
      deadline: expiredDeadline,
      serviceDate: 'Tomorrow, 11:00 AM',
      serviceLocation: {
        society: 'Purva Fairmont',
        locality: 'HSR Layout Sector 4',
        city: 'Bengaluru',
        pincode: '560102',
        coordinates: { lat: 12.9121, lng: 77.6445 }
      },
      status: 'TARGET_MISSED', // Target missed!
      fallbackStatus: 'FALLBACK_OFFERED',
      currentParticipants: [
        {
          userId: rahul._id,
          name: 'Rahul Sharma',
          society: 'Purva Fairmont',
          flatNo: 'Tower B - 601',
          quantity: 1,
          bookingId: 'GS-GRP-2026-7788',
          status: 'JOINED'
        },
        {
          userId: priya._id,
          name: 'Priya Nair',
          society: 'Purva Fairmont',
          flatNo: 'Tower A - 302',
          quantity: 1,
          bookingId: 'GS-GRP-2026-7789',
          status: 'JOINED'
        }
      ]
    });

    console.log('[Seed] Creating demo customer bookings for Rahul...');
    // 1. Confirmed individual booking
    await Booking.create({
      bookingId: 'GS-IND-2026-1042',
      customerId: rahul._id,
      providerId: coolAir._id,
      serviceId: acService._id,
      bookingType: 'INDIVIDUAL',
      quantity: 1,
      scheduledDate: 'Tomorrow',
      scheduledTime: '02:00 PM - 03:30 PM',
      address: rahul.addresses[0],
      unitPrice: 799,
      originalPrice: 799,
      discountAmount: 150, // GROUPSAVE150 coupon
      platformFee: 29,
      taxAmount: 32,
      totalPrice: 710,
      couponApplied: 'GROUPSAVE150',
      paymentStatus: 'PAID',
      bookingStatus: 'CONFIRMED',
      serviceOTP: '3819',
      paymentDetails: {
        razorpayOrderId: 'order_demo_1042',
        razorpayPaymentId: 'pay_demo_1042',
        paymentMethod: 'UPI'
      }
    });

    // 2. Confirmed group booking in Deal 1
    await Booking.create({
      bookingId: 'GS-GRP-2026-9102',
      customerId: rahul._id,
      providerId: coolAir._id,
      serviceId: acService._id,
      bookingType: 'GROUP',
      groupDealId: deal1._id,
      quantity: 1,
      scheduledDate: 'Tomorrow',
      scheduledTime: '10:00 AM - 04:00 PM',
      address: rahul.addresses[0],
      unitPrice: 699,
      originalPrice: 799,
      discountAmount: 100,
      platformFee: 29,
      taxAmount: 35,
      totalPrice: 763,
      paymentStatus: 'PAID',
      bookingStatus: 'CONFIRMED',
      serviceOTP: '7412',
      paymentDetails: {
        razorpayOrderId: 'order_demo_9102',
        razorpayPaymentId: 'pay_demo_9102',
        paymentMethod: 'UPI'
      }
    });

    // 3. Pending Fallback Booking in fallbackDeal (CRITICAL REQUIREMENT 10 DEMO)
    await Booking.create({
      bookingId: 'GS-GRP-2026-7788',
      customerId: rahul._id,
      providerId: cleanNest._id,
      serviceId: pestService._id,
      bookingType: 'GROUP',
      groupDealId: fallbackDeal._id,
      quantity: 1,
      scheduledDate: 'Tomorrow',
      scheduledTime: '11:00 AM - 01:00 PM',
      address: {
        title: 'Home (Purva Fairmont)',
        flatNo: 'Tower B - 601',
        society: 'Purva Fairmont',
        locality: 'HSR Layout Sector 4',
        city: 'Bengaluru',
        pincode: '560102'
      },
      unitPrice: 749,
      originalPrice: 899,
      discountAmount: 150,
      platformFee: 29,
      taxAmount: 37,
      totalPrice: 815,
      paymentStatus: 'PAID',
      bookingStatus: 'FALLBACK_PENDING', // Pending fallback choice!
      fallbackChoice: null,
      serviceOTP: '6521',
      paymentDetails: {
        razorpayOrderId: 'order_demo_7788',
        razorpayPaymentId: 'pay_demo_7788',
        paymentMethod: 'UPI'
      }
    });

    // 4. Completed booking with review
    const completedBooking = await Booking.create({
      bookingId: 'GS-IND-2026-0811',
      customerId: rahul._id,
      providerId: autoShine._id,
      serviceId: carWashService._id,
      bookingType: 'INDIVIDUAL',
      quantity: 1,
      scheduledDate: 'Last Week, Sunday',
      scheduledTime: '09:00 AM - 10:00 AM',
      address: rahul.addresses[0],
      unitPrice: 650,
      originalPrice: 650,
      discountAmount: 50,
      platformFee: 29,
      taxAmount: 30,
      totalPrice: 659,
      paymentStatus: 'PAID',
      bookingStatus: 'COMPLETED',
      serviceOTP: '9921',
      paymentDetails: {
        razorpayOrderId: 'order_demo_0811',
        razorpayPaymentId: 'pay_demo_0811',
        paymentMethod: 'Cards'
      }
    });

    console.log('[Seed] Creating demo customer reviews...');
    await Review.create([
      {
        customerId: rahul._id,
        customerName: 'Rahul Sharma',
        providerId: autoShine._id,
        serviceId: carWashService._id,
        bookingId: completedBooking.bookingId,
        rating: 5,
        reviewText: 'Outstanding doorstep detailing at Prestige Falcon City! Car looks brand new from the showroom. Very polite professional.',
        serviceType: 'INDIVIDUAL',
        society: 'Prestige Falcon City'
      },
      {
        customerId: priya._id,
        customerName: 'Priya Nair',
        providerId: coolAir._id,
        serviceId: acService._id,
        bookingId: 'GS-GRP-2026-0042',
        rating: 5,
        reviewText: 'Our entire floor in Sobha Dream Acres booked AC servicing together. Saved ₹300 per AC and technician cleaned up without leaving any mess.',
        serviceType: 'GROUP',
        society: 'Sobha Dream Acres'
      },
      {
        customerId: new mongoose.Types.ObjectId(),
        customerName: 'Dr. Sandeep K.',
        providerId: cleanNest._id,
        serviceId: cleaningService._id,
        bookingId: 'GS-GRP-2026-0099',
        rating: 5,
        reviewText: 'Deep cleaning blitz in our society was seamless. The mechanized floor scrub made marble tiles look pristine. Highly recommended!',
        serviceType: 'GROUP',
        society: 'Prestige Falcon City'
      }
    ]);

    console.log('[Seed] Seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('[Seed Error]', error);
    process.exit(1);
  }
};

seedData();

