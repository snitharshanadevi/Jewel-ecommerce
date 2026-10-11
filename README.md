# AUREVYA — Tradition, Refined for Today
> Premium Indian Jewellery E-commerce Website

AUREVYA is an elegant, minimal, light-theme-only luxury e-commerce platform blending traditional Indian royal jewellery (Kundan, Polki, Temple, Jhumkas, Meenakari) with contemporary minimalist design aesthetics.

---

## 💎 Brand Identity & Visual Language
- **Tagline:** Tradition, Refined for Today.
- **Palette:**
  - Background: `#F8F6F1`
  - Cards & Panels: `#FFFFFF`
  - Soft Beige / Muted Gold Nuances: `#EDE4D8` / `#A88955`
  - Deep Charcoal Typography: `#292722`
  - Secondary Text: `#77736B`
  - Subtle Borders: `#E8E2D9`
  - Muted Success Green: `#3D6847`
  - Muted Red / Error: `#A63D40`
- **Typography:**
  - Headings & Editorial Wordmark: `Cormorant Garamond` (Google Fonts)
  - Controls, Body & Metadata: `Plus Jakarta Sans`

---

## 🚀 Quick Start & Installation

### Prerequisites
- Node.js `v18.0.0` or higher (tested on Node.js `v24.x`)
- npm `v9.0.0` or higher

### Installation
```bash
# Clone or navigate to the project directory
cd work

# Install dependencies
npm install

# Start development server
npm run dev
```

The application will be running locally at `http://localhost:5173/`.

### Production Build & Preview
```bash
# Build production bundle with TypeScript check
npm run build

# Preview production build locally
npm run preview
```

---

## 🗺️ Website Routes & Pages

| Route | Page | Purpose |
|---|---|---|
| `/` | `HomePage` | Hero editorial, announcement bar, category discovery, curated edit tabs, bestsellers, brand story |
| `/collections` | `CollectionsPage` | Full jewellery catalogue with multi-attribute filtering, sorting, and live count |
| `/collections/:category` | `CollectionsPage` | Dedicated category collection view (e.g., `/collections/Chokers`) |
| `/products/:slug` | `ProductDetailPage` | High-res gallery, pincode delivery checker, variants, tabs, related jewels |
| `/search` | `SearchPage` | Dynamic keyword search, category pills, popular keyword shortcuts |
| `/wishlist` | `WishlistPage` | Persistent saved jewels with 1-click move to shopping bag |
| `/cart` | `CartPage` | Line items, quantity controls, promo coupon discount, free shipping indicator |
| `/checkout` | `CheckoutPage` | 4-step wizard: contact, delivery address, order summary, payment selection |
| `/payment` | `PaymentPage` | Sandbox payment gateway simulator (UPI QR, Card, NetBanking, COD) |
| `/order-success` | `OrderSuccessPage` | Order confirmation with unique reference code (`AUR-2026-XXXXX`) |
| `/track-order` | `TrackOrderPage` | 6-stage order fulfillment timeline with simulated cancellation option |
| `/account` | `AccountPage` | Customer profile overview, order history, saved addresses |
| `*` | `NotFoundPage` | Custom 404 page with navigation fallbacks |

---

## 🛍️ Demo Shopping Journey

1. **Browse & Discover:**
   - Explore the homepage hero and curated categories.
   - Use the category tabs or navigate to `/collections`.
2. **Filter & Sort:**
   - Filter by Style (*Traditional, Contemporary, Fusion, Bridal, Everyday, Festive*).
   - Filter by Material/Finish (*gold-tone, silver-tone, oxidised, pearl, gemstone*).
   - Filter by Occasion (*Wedding, Festive, Party, Daily Wear, Cocktail, Gifting*).
   - Toggle *In-Stock Only* or sort by price / newest.
3. **Inspect Product Details:**
   - View high-resolution multi-angle photography.
   - Enter your PIN code (e.g. `110001` or `400001`) to estimate transit time.
   - Select variant and quantity.
4. **Wishlist & Cart:**
   - Save favorites to `/wishlist`.
   - Add items to `/cart` and apply demo coupon `AUREVYA10` (10% off) or `TRADITION` (₹2,500 off).
5. **Checkout & Demo Payment:**
   - Complete contact and delivery details.
   - In `/payment`, select UPI or Card and click **Simulate Success** or **Simulate Failure** to test outcomes safely.
6. **Confirmation & Live Tracking:**
   - Receive deterministic order reference (e.g. `AUR-2026-88142`).
   - Track progress through the 6-stage status timeline in `/track-order`.

---

## 🔒 Demo Payment Limitations & Safety Policy

> **Important Architecture & Safety Notice:**
> - This application runs in **Safe Demo / Sandbox Mode**.
> - It **never collects, stores, or transmits** real credit/debit card numbers, CVVs, UPI PINs, or net banking passwords.
> - No actual financial transactions take place.
> - The mock adapter is isolated in `src/services/paymentGatewaySimulator.ts`.

### Replacing Demo Payments with Real Providers (e.g. Razorpay / Stripe)
In production:
1. Initialize the payment order server-side via `POST /api/orders/create` using private API keys stored in server environment variables.
2. The server generates a signed order payload (`order_id`, `amount`, `currency`).
3. Frontend loads the official Razorpay SDK (`checkout.js`) and opens the payment popup using public `key_id`.
4. On payment completion, the frontend submits the `razorpay_payment_id` and `razorpay_signature` to the server for HMAC SHA-256 cryptographic signature verification.
5. Fulfill the order only upon verified server webhooks.

---

## 🛠️ Architecture & Folder Structure

```
src/
├── app/
├── components/
│   ├── common/
│   │   ├── AnnouncementBar.tsx    # Dismissible announcement banner
│   │   ├── Breadcrumbs.tsx        # Hierarchy navigation
│   │   ├── Footer.tsx             # Brand story, newsletter, policies
│   │   ├── ImageWithFallback.tsx  # Smooth image loader with fallback
│   │   ├── Navbar.tsx             # Wordmark, responsive menu, search, badges
│   │   ├── ProductCard.tsx        # Card with hover zoom, quick actions
│   │   └── QuickViewModal.tsx     # Light modal for instant details
│   └── layout/
│       └── Layout.tsx             # Global layout shell
├── context/
│   ├── CartContext.tsx            # Persistent cart, coupons, calculations
│   ├── OrderContext.tsx           # Order creation, history, timeline
│   ├── ToastContext.tsx           # Subtle luxury notifications
│   └── WishlistContext.tsx        # Persistent wishlist state
├── data/
│   ├── demoCategories.ts          # Category metadata & images
│   └── demoProducts.ts            # 26 distinct jewellery products
├── pages/
│   ├── AccountPage.tsx            # Account overview & order history
│   ├── CartPage.tsx               # Shopping bag & shipping progress
│   ├── CheckoutPage.tsx           # 4-step checkout flow
│   ├── CollectionsPage.tsx        # Multi-attribute filterable catalogue
│   ├── HomePage.tsx               # Editorial landing page
│   ├── NotFoundPage.tsx           # Custom 404 page
│   ├── OrderSuccessPage.tsx       # Order confirmation
│   ├── PaymentPage.tsx            # Sandbox payment simulator
│   ├── ProductDetailPage.tsx      # Comprehensive product page
│   ├── SearchPage.tsx             # Dedicated search page
│   └── TrackOrderPage.tsx         # 6-step timeline order tracker
│   └── WishlistPage.tsx           # Saved items collection
├── services/
│   └── paymentGatewaySimulator.ts # Isolated payment simulator adapter
├── types/
│   └── index.ts                   # Centralized TypeScript definitions
├── utils/
│   ├── couponCodes.ts             # Coupon validation engine
│   ├── formatters.ts              # INR currency & date formatting
│   └── pincodeChecker.ts          # Postal code delivery checker
├── App.tsx                        # Route definitions
├── index.css                      # Tailwind v4 theme & luxury tokens
└── main.tsx                       # Entry point
```

---

## 🧪 Testing the Application

### Automated Verification
```bash
# Type check and build validation
npm run build
```

### Manual Test Checklist
- [x] **Homepage Rendering:** Wordmark, editorial imagery, category cards, collection edit tabs, bestsellers.
- [x] **Catalogue Filtering:** Multi-select category, style, material, in-stock toggle, search query sync.
- [x] **URL Sync:** Direct link to `/collections/Chokers` or `/collections?style=traditional` works immediately.
- [x] **Product Details:** Gallery thumbnails, pincode estimator (`110001` or `400001`), tabs, related items.
- [x] **Wishlist State:** Add/remove items, persisted in `localStorage`.
- [x] **Cart Calculations:** Subtotal, discount code (`AUREVYA10`), free shipping threshold, total.
- [x] **Checkout Flow:** Form validation on missing fields, auto-populating city/state from PIN.
- [x] **Simulated Payment:** Success, failure, and cancel actions in sandbox mode.
- [x] **Order Timeline:** 6 status checkpoints (`Placed`, `Confirmed`, `Packed`, `Shipped`, `Out for Delivery`, `Delivered`).
- [x] **Customer History:** View past demo orders in `/account`.

---

© 2026 AUREVYA Fine Jewellery. All rights reserved. Handcrafted in India.
