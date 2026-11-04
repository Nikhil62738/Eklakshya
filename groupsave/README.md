# GrouSave – Hyperlocal Group-Buying & Service-Booking Mobile Application (React Native / Expo)

> **Tagline:** *Local Services Better Together* • *Book Together. Save More.*

**GrouSave** is a mobile-first, hyperlocal group-buying and service-booking marketplace built in **React Native (Expo)**. It matches the 11 mobile screens of the reference UI design.

---

## 📱 The 11 Screens Overview

| # | Screen Name | Description & Visual Features |
|---|---|---|
| **1** | **Welcome & Onboarding** | Dark green brand aesthetic, "GrouSave" roof logo, "Local Services Better Together" illustration, "Get Started", "Sign In", and bottom value pillars (*Save Money*, *Trusted Providers*, *Local Communities*). |
| **2** | **Home & Discovery** | Location header (`Lonere, Raigad`), search bar, 8 circular pastel category icons (*AC Service*, *Cleaning*, *Car Wash*, *Electrician*, *Plumber*, *Pest Control*, *Salon*, *Laundry*), "Book Together Save More" promo banner, "Trending Near You" card, and persistent bottom navigation bar. |
| **3** | **Service Listing (AC Servicing)** | Filter pills (*All*, *Single Booking*, *Group Deals*), cards for verified providers (*Cool Air Experts*, *FreshCool Service*, *ACCare Solutions*, *HomeFix Pro*) with ratings, distance (`2.3 km`), price (`₹599`), and discount tags (`25% OFF`). |
| **4** | **Service Details (Single Booking)** | Hero technician image, provider profile, checklist of inclusions (*AC Cleaning & Service*, *Gas Leak Check*, *Filter Cleaning*, *1 Month Warranty*), pricing (`₹599` vs `₹799`), date/time selector chips, and "Book Now" CTA. |
| **5** | **Service Details (Group Deal)** | Badges (*Group Deal*, *20–50% OFF*), 3-tier bulk pricing table (`10-19: ₹699`, `20-29: ₹649`, `30+: ₹599`), live progress tracker (`12/20 joined`, `8 slots left`), service date, fallback guarantee warning banner, "Join Group Deal", and "Choose Single Booking Instead". |
| **6** | **Providers Near You (Hyperlocal Map)** | Filter chips (*List*, *Distance*, *Rating*, *Price*), vector map visualization with pins and travel badge (`1.2 km (4 mins)`), and provider cards with instant "View" navigation. |
| **7** | **Your Cart (2 items)** | Segregated tabs (*Single (1)*, *Group (1)*), item cards with quantity increment/decrement (`- / +`), remove actions, price breakdown (`Total: ₹1,197`), and savings badge (`% You are saving ₹403`). |
| **8** | **Payment** | Total amount (`₹1,197`), selectable payment methods (*UPI*, *Credit / Debit Card*, *Net Banking*, *Wallet*), secure encrypted badge, and sticky "Pay ₹1,197" button. |
| **9** | **Booking Confirmed** | Celebration confetti graphics, green checkmark icon, Booking ID (`GS20250921001`), summary cards for booked single and group services, "Track Booking", and "Back to Home". |
| **10** | **Booking Details & Live Tracking** | Booking ID (`GS20250921001`), `Scheduled` badge, service address (`Room 101, DBATU Hostel, Lonere`), provider contact buttons (*Call* and *WhatsApp Chat*), and 4-step progress tracker (*Booked* → *Upcoming* → *In Progress* → *Completed*). |
| **11** | **My Bookings** | Filter pills (*All*, *Upcoming*, *Completed*, *Cancelled*), booking list with service details, provider names, dates, prices, status tags (`Upcoming` / `Completed`), and chevron navigation. |

---

## 🎨 Color Palette & Typography

- **Primary Dark Green**: `#075B46` (Brand header, buttons, active tabs)
- **Secondary Green**: `#0F8B68` (Highlights, positive badges)
- **Accent Mint**: `#DDF5EA` (Tag backgrounds, discount badges)
- **Dark Forest**: `#02241B` (Welcome splash screen gradient)
- **Background**: `#F7F9F8` (App body)
- **Card Background**: `#FFFFFF`
- **Text Main**: `#172B26` / `#1F2937`
- **Text Secondary / Muted**: `#718078` / `#6B7280`
- **Warning / Orange**: `#F59E0B`
- **Red / Alert**: `#DC4545`

---

## 🚀 How to Run the App

### Prerequisites
- Node.js (v18+)
- Expo Go app on your physical iOS/Android device **or** an emulator/simulator

### 1. Start the React Native App
```bash
cd "groupsave/mobile"
npm start
# or
npx expo start
```

### 2. Open on Device / Simulator
- **Physical Phone**: Scan the QR code in the terminal using the Expo Go camera (Android) or default Camera app (iOS).
- **Web Preview**: Press `w` in the terminal to view in your web browser.
- **Android Emulator**: Press `a`.
- **iOS Simulator**: Press `i`.

---

## 📂 Project Structure

```
groupsave/
├── mobile/
│   ├── App.js                     # Root navigator & screen switcher
│   ├── app.json                   # Expo configuration (GrouSave)
│   ├── package.json               # Expo SDK 58 & dependencies
│   └── src/
│       ├── components/
│       │   ├── BottomNav.js       # Persistent 4-tab bottom navigation
│       │   ├── Header.js          # Reusable header with back & heart buttons
│       │   └── MapViewMock.js     # Vector map with route & provider markers
│       ├── constants/
│       │   └── theme.js           # Exact hex color tokens & metrics
│       ├── context/
│       │   └── AppContext.js      # Global state (cart, bookings, active screen)
│       ├── data/
│       │   └── mockData.js        # Mock data (Lonere, DBATU, Cool Air Experts)
│       └── screens/
│           ├── WelcomeScreen.js               # Screen 1
│           ├── HomeScreen.js                  # Screen 2
│           ├── ServiceListScreen.js           # Screen 3
│           ├── ServiceDetailSingleScreen.js   # Screen 4
│           ├── ServiceDetailGroupScreen.js    # Screen 5
│           ├── ProvidersNearYouScreen.js      # Screen 6
│           ├── CartScreen.js                  # Screen 7
│           ├── PaymentScreen.js               # Screen 8
│           ├── BookingConfirmedScreen.js      # Screen 9
│           ├── BookingDetailsScreen.js        # Screen 10
│           └── MyBookingsScreen.js            # Screen 11
└── backend/                       # Node.js / Express REST API
```
