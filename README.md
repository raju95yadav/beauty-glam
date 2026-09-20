# 💄 Glam Beauty - Customer Storefront

> Modern, High-Performance Beauty & Cosmetics E-Commerce Web Client built with React and Vite.  
> Part of the **Glam Beauty E-Commerce Ecosystem** alongside the companion repositories:
> - 🌐 **Backend REST API**: [beauty-back](https://github.com/raju95yadav/beauty-back)
> - ⚙️ **Admin Management Portal**: [beauty-admin](https://github.com/raju95yadav/beauty-admin)

---

## 📋 Table of Contents

1. [🌟 Project Overview](#-project-overview)
2. [🏗️ Core Architecture & Technology Roles](#️-core-architecture--technology-roles)
3. [🛠️ Environment Setup Documentation](#️-environment-setup-documentation)
4. [🚀 Installation & Deployment Guide](#-installation--deployment-guide)
5. [🔐 User Authentication & Client Flow](#-user-authentication--client-flow)
6. [📡 API Integration Reference](#-api-integration-reference)
7. [🧪 Testing & Verification](#-testing--verification)
8. [💻 Live Demonstration Guide](#-live-demonstration-guide)
9. [🎓 Academic & Project Information](#-academic--project-information)

---

## 🌟 Project Overview

**Glam Beauty** is an ultra-modern, customer-facing e-commerce web application engineered specifically for beauty, skincare, haircare, and cosmetics retail. Designed to deliver an intuitive, luxurious, and friction-free shopping experience, the client leverages React 19, Vite, and Tailwind CSS v4 to achieve sub-second page loads, responsive layouts, and buttery-smooth micro-interactions powered by Framer Motion.

The storefront interfaces directly with the headless Node.js/Express `beauty-back` microservices backend, providing real-time catalog discovery, dynamic server-synced cart operations, robust client-side validation, secure OAuth2 / OTP passwordless authentication, and comprehensive order lifecycle tracking.

### Core Objectives

- **⚡ Lightning-Fast Performance & UX**: Sub-second page loads, asset optimization, code-splitting with `React.lazy` and `Suspense`, and instant client-side transitions.
- **🔍 Intelligent Product Discovery**: Multi-faceted filtering across categories, brands, price tiers, and skin compatibility, augmented with debounced search queries.
- **🛒 Resilient Cart Synchronization**: Hybrid client-server cart system that preserves guest cart intent while maintaining live stock verification and optimistic UI state.
- **💳 Frictionless Checkout Pipeline**: Step-by-step checkout wizard with saved delivery address management, live shipping calculations, and mock/Razorpay payment gateway integration.
- **📦 End-to-End Order Observability**: Real-time order progress timeline tracking order placement, processing, dispatch, in-transit telemetry, and delivery confirmation.
- **🔒 Enterprise-Grade Client Security**: Protected routes, automated Axios interceptors with automatic Bearer token injection, and graceful 401 session expiration handling.

---

## 🏗️ Core Architecture & Technology Roles

The client architecture follows a modular, feature-oriented structure with decoupled presentation layers, unified state contexts, and isolated REST service adapters:

```
src/
├── assets/          # Static branding, banners, and vector assets
├── components/      # Atomic UI components, checkout modals, product cards
│   ├── checkout/    # Address modals, payment tabs (Card, UPI, COD)
│   ├── common/      # Navbar, Footer, ScrollToTop, Breadcrumbs
│   ├── product/     # ProductCard, FilterSidebar, ProductSkeleton
│   └── ui/          # Buttons, Badges, Loaders, Form inputs
├── context/         # React Context state providers (Auth, Cart, Wishlist, UI)
├── hooks/           # Custom React hooks (useAuth, useCart, useDebounce)
├── layouts/         # Base layout wrappers (MainLayout with dynamic navigation)
├── pages/           # Route views (Home, Products, Cart, Checkout, Tracking, Orders)
├── routes/          # Declarative React Router v7 definitions and ProtectedRoute guards
├── services/        # Centralized Axios HTTP client layer and domain service wrappers
└── styles/          # Global styles, Tailwind CSS v4 theme directives
```

### Technology Matrix & Core Roles

| Technology / Library | Version | Core Architectural Role |
| :--- | :--- | :--- |
| **React** | `^19.2.4` | Modern component-based declarative UI library utilizing concurrent features, hooks, and suspense boundaries. |
| **Vite** | `^7.3.1` | Next-generation frontend build tool and lightning-fast HMR (Hot Module Replacement) development server. |
| **Tailwind CSS** | `^4.2.1` | Utility-first styling engine with `@tailwindcss/vite` compiler for rapid, responsive design and custom aesthetic tokens. |
| **React Router DOM** | `^7.13.1` | Client-side declarative routing, deep-linking, dynamic URL parameter parsing, and route guards. |
| **Axios** | `^1.13.6` | Promise-based HTTP client equipped with centralized request/response interceptors for JWT injection and error handling. |
| **Framer Motion** | `^12.36.0` | Production-ready motion engine for fluid transitions, enter/exit animations, and interactive drawer physics. |
| **Lucide React** | `^0.577.0` | High-performance, clean icon library providing consistent visual glyphs across the storefront. |
| **React Hot Toast** | `^2.6.0` | Lightweight, accessible notification toast system for non-blocking feedback during shopping events. |
| **@react-oauth/google** | `^0.13.5` | Google Identity Services wrapper for one-tap and pop-up OAuth2 client sign-in integration. |
| **React Hook Form** | `^7.71.2` | High-performance form state manager for address and customer detail inputs with minimal re-renders. |

---

## 🛠️ Environment Setup Documentation

### Prerequisites

Ensure the host machine satisfies the following runtime specifications:

- **Operating System**: Windows 10/11, macOS Monterey+, or Linux (Ubuntu 20.04+ LTS recommended)
- **Node.js**: `v18.18.0` or higher (`v20.x` or `v22.x` LTS recommended)
- **Package Manager**: `npm` (`v9.x` or higher) or `yarn` / `pnpm`
- **Companion Services**: A running instance of `beauty-back` (Local: `http://localhost:5000` or Cloud: Vercel/Railway)

### Environment Variables

The application relies on Vite environment variables prefixed with `VITE_`. Create a `.env` file in the root of `beauty-glam`:

| Variable Name | Required | Default / Sample Value | Description |
| :--- | :---: | :--- | :--- |
| `VITE_API_URL` | **Yes** | `http://localhost:5000/api` | Base REST endpoint for the backend services (`beauty-back`). |
| `VITE_GOOGLE_CLIENT_ID` | **Optional** | `your-google-client-id.apps.googleusercontent.com` | Google Cloud Console OAuth 2.0 Client ID for Google Login. |
| `VITE_RAZORPAY_KEY_ID` | **Optional** | `rzp_test_YourKeyHere` | Test/Live Razorpay public API key for online payment gateway checkout. |

### Environment Verification Commands

Verify your development environment before proceeding:

```bash
# Verify Node.js runtime version
node --version
# Expected output: v18.18.0+ or v20.x+

# Verify NPM version
npm --version
# Expected output: 9.x.x or higher

# Verify backend connectivity
curl http://localhost:5000/api/products
```

---

## 🚀 Installation & Deployment Guide

Follow these steps to set up, build, and deploy the customer storefront:

### Step 1: Clone the Repository

```bash
# Clone the repository
git clone https://github.com/raju95yadav/beauty-glam.git

# Navigate into the project root
cd beauty-glam
```

### Step 2: Install Node Dependencies

```bash
# Clean install exact dependencies from package-lock.json
npm install
```

### Step 3: Configure Environment Variables

```bash
# Create or edit .env file
cp .env.example .env 2>/dev/null || touch .env
```

Populate `.env` with your active configuration:

```env
VITE_API_URL="http://localhost:5000/api"
VITE_GOOGLE_CLIENT_ID="991075599579-auhtca9mlcib859tnb5bq1lk4rcjklpd.apps.googleusercontent.com"
```

### Step 4: Run the Development Server

```bash
# Start Vite development server
npm run dev
```

The application will launch on `http://localhost:5173` (or the next available port). Open this URL in any modern browser.

### Step 5: Production Build & Preview

```bash
# Type-check and build optimized static assets
npm run build

# Preview production build locally
npm run preview
```

### Deployment Configuration (Vercel / Netlify)

For Single-Page Application (SPA) routing support, route rewrites are pre-configured in `vercel.json`:

```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

---

## 🔐 User Authentication & Client Flow

`beauty-glam` implements a multi-channel authentication model supporting **Passwordless Email OTP**, **Google OAuth 2.0**, and **Traditional Password Credentials**.

### Client Sequence Architecture

```
 +-------------+        +-------------+        +-----------------+        +-----------------+
 |   Browser   |        | AuthContext |        | Axios / Storage |        |   beauty-back   |
 |  (Customer) |        |   (React)   |        | (LocalStorage)  |        |   (REST API)    |
 +------+------+        +------+------+        +--------+--------+        +--------+--------+
        |                      |                        |                          |
        | 1. Request OTP       |                        |                          |
        |--------------------->|-- POST /auth/send-otp --------------------------->|
        |                      |                                                   |-- [Send Email OTP]
        |                      |<-- 200 OK (OTP Sent) -----------------------------|
        |                      |                        |                          |
        | 2. Submit 6-digit OTP|                        |                          |
        |--------------------->|-- POST /auth/verify-otp -------------------------->|
        |                      |                                                   |-- [Verify & Sign JWT]
        |                      |<-- 200 OK { token, user } ------------------------|
        |                      |                        |                          |
        |                      |-- Save Token & User -->|                          |
        |                      |   localStorage.setItem |                          |
        |                      |                        |                          |
        |                      |-- Synchronize Cart ------------------------------>|
        |                      |   GET /cart (with Bearer Token)                   |
        |                      |<-- 200 OK (Server Cart Data) ---------------------|
        |                      |                        |                          |
        | 3. Access /checkout  |                        |                          |
        |--------------------->|                        |                          |
        |                      |-- Validate User Session                           |
        |                      |   (ProtectedRoute)                                |
        |                      |                        |                          |
        |                      |-- Place Order ----------------------------------->|
        |                      |   POST /orders (Attached Bearer Token)            |
        |                      |<-- 201 Created { orderId } -----------------------|
        |                      |                        |                          |
        |<-- Route /orders/:id |                        |                          |
        +                      +                        +                          +
```

### Client Security & Authentication Breakdown

1. **Request Interceptor Authorization**: All outgoing Axios requests via `src/services/api.js` inspect `localStorage.getItem('token')`. If present, the `Authorization: Bearer <token>` header is automatically appended.
2. **Session Guard (`ProtectedRoute.jsx`)**: Sensitive routes (`/cart`, `/checkout`, `/wishlist`, `/profile`, `/orders`) check `isAuthenticated` from `AuthContext`. Unauthenticated visits are intercepted and redirected to `/login` while preserving location state.
3. **Cart & Session Synchronization**: When a user successfully authenticates, `CartContext` triggers an immediate call to `/cart`, synchronizing the server-side persistent shopping bag with local UI state.
4. **Automated Session Invalidation**: The response interceptor detects `401 Unauthorized` responses from non-auth endpoints, clearing expired JWT tokens and user objects from `localStorage` to protect against stale token exploits.

---

## 📡 API Integration Reference

The storefront consumes the following backend REST API endpoints defined across `src/services/`:

### 1. Authentication (`authApi.js`)

| Endpoint | Method | Purpose | Payload |
| :--- | :---: | :--- | :--- |
| `/auth/send-otp` | `POST` | Request a 6-digit login verification code | `{ email }` |
| `/auth/verify-otp` | `POST` | Validate OTP code and receive JWT session | `{ email, otp }` |
| `/auth/google` | `POST` | Exchange Google OAuth ID token for app session | `{ token }` |
| `/auth/login` | `POST` | Standard user credential login | `{ email, password }` |
| `/auth/register` | `POST` | Register a new customer account | `{ name, email, password, phone }` |
| `/auth/logout` | `POST` | Terminate active session | None |

### 2. Product Catalog (`productService.js`)

| Endpoint | Method | Purpose | Query Parameters |
| :--- | :---: | :--- | :--- |
| `/products` | `GET` | Paginated product listing with filters | `page, limit, category, brand, minPrice, maxPrice, sort` |
| `/products/filters` | `GET` | Dynamic metadata counts for category & brand filter chips | None |
| `/products/featured`| `GET` | Highlighted showcase products for homepage carousel | None |
| `/products/:id` | `GET` | Comprehensive details, image gallery, and inventory status | Route param `:id` |
| `/products/category/:category` | `GET` | Targeted product query scoped to specific taxonomy | Route param `:category` |
| `/search` | `GET` | Full-text keyword search across name and description | `q=<search_query>` |

### 3. Shopping Cart (`cartService.js`)

| Endpoint | Method | Purpose | Payload / Parameters |
| :--- | :---: | :--- | :--- |
| `/cart` | `GET` | Retrieve the authenticated user's current bag | Header: `Bearer <token>` |
| `/cart/add` | `POST` | Add item with stock limit validation | `{ productId, qty, price }` |
| `/cart/update` | `PUT` | Increment or decrement quantity | `{ productId, qty }` |
| `/cart/remove/:id` | `DELETE`| Remove a specific line item from cart | Route param `:id` |
| `/cart` | `DELETE`| Flush and clear all items from bag | None |

### 4. Orders & Checkout (`orderService.js` & `paymentService.js`)

| Endpoint | Method | Purpose | Payload / Parameters |
| :--- | :---: | :--- | :--- |
| `/orders` | `POST` | Create a verified order with address & line items | `{ orderItems, shippingAddress, paymentMethod, totalPrice, ... }` |
| `/orders/myorders` | `GET` | Fetch all historical orders belonging to customer | Header: `Bearer <token>` |
| `/orders/:id` | `GET` | Fetch specific order details and status | Route param `:id` |
| `/orders/:id/tracking` | `GET` | Retrieve tracking stages, carrier info, and updates | Route param `:id` |
| `/orders/:id/cancel` | `PUT` | Request cancellation of pending/processing order | Route param `:id` |
| `/payment/razorpay` | `POST` | Initialize Razorpay payment intent | `{ amount }` |
| `/payment/verify` | `POST` | Cryptographically verify Razorpay signature | `{ razorpay_order_id, razorpay_payment_id, razorpay_signature }` |

---

## 🧪 Testing & Verification

### Code Quality & Linting Commands

```bash
# Execute ESLint to audit syntax and React Hooks compliance
npm run lint

# Preview build compilation locally to detect bundle errors
npm run build
```

### Functional UI Verification Test Checklist

| Category | Test Case Scenario | Expected Result | Status |
| :--- | :--- | :--- | :---: |
| **Catalog** | Apply Category & Price Filter | Product grid re-renders matching subset without full page reload. | ✅ |
| **Search** | Type in Search Bar (debounced) | Instant dropdown results display matching cosmetics; Enter navigates to `/search`. | ✅ |
| **Cart** | Add Out-of-Stock Product | Toast triggers: `"Product is OUT OF STOCK"`, item blocked from cart state. | ✅ |
| **Cart** | Update Quantity > In Stock | Toast triggers: `"Only X units available"`, quantity clamps to maximum. | ✅ |
| **Auth** | Route Guard Interception | Direct URL access to `/checkout` redirects user to `/login` with return destination. | ✅ |
| **Checkout**| Shipping Address Selection | Saved addresses load from user profile; new address modal persists updates. | ✅ |
| **Checkout**| Place COD / Card Order | Order is created via POST `/orders`, cart flushes, redirect to `/order-success`. | ✅ |
| **Tracking**| Track Order via `/orders/:id`| Stepper reflects live status (`Placed` ➔ `Confirmed` ➔ `Shipped` ➔ `Delivered`). | ✅ |

---

## 💻 Live Demonstration Guide

Step-by-step walkthrough of the customer shopping journey:

```
[ 1. Hero Showcase ] ──> [ 2. Filter & Search ] ──> [ 3. Product Details ]
                                                             │
[ 6. Order Tracking ] <── [ 5. Checkout & Pay ] <── [ 4. Shopping Bag ]
```

### 1. Landing Experience (`/`)
- Dynamic hero banner highlighting seasonal beauty campaigns and trending offers.
- Quick taxonomy navigation chips (Skincare, Haircare, Makeup, Fragrance).
- Featured products carousel with quick "Add to Bag" triggers and real-time star ratings.

### 2. Product Discovery & Filtering (`/products`)
- Left sidebar enables granular multi-attribute filtering (Brand, Skin Type, Ingredients, Price Slider).
- Active filter pill badges with single-click dismiss and "Reset All Filters" capability.
- Grid / List view mode toggling with smooth responsive layout adjustments.

### 3. Product Deep Dive (`/product/:id`)
- High-resolution interactive image gallery with thumbnail selectors.
- Live inventory indicator ("In Stock", "Only X Left", or "Out of Stock").
- Expandable ingredient listings, application tips, and customer verified reviews.

### 4. Shopping Bag Management (`/cart`)
- Interactive quantity steppers with real-time recalculation of subtotal and free shipping thresholds.
- Dynamic free-shipping progress meter (e.g., "Add ₹50 more for FREE delivery").
- Seamless transition to checkout via prominent primary action button.

### 5. Multi-Step Checkout Wizard (`/checkout`)
- **Step 1 - Shipping Details**: Select from previously saved user addresses or trigger modal to create a new delivery destination.
- **Step 2 - Payment Gateway**: Choose between Credit/Debit Card, UPI / QR, or Cash on Delivery (COD).
- Pre-flight stock validation ensures no items have sold out before payment commit.

### 6. Post-Purchase & Tracking (`/order-success` & `/orders/:id`)
- Immediate celebratory order receipt displaying the assigned MongoDB Order ID.
- Dedicated tracking dashboard displaying carrier name, tracking code with one-click copy, and live four-stage fulfillment timeline.

---

## 🎓 Academic & Project Information

| Parameter | Specification |
| :--- | :--- |
| **Project Name** | Glam Beauty - Customer Storefront |
| **Repository Name** | `beauty-glam` |
| **Lead Developer** | Raju Yadav ([@raju95yadav](https://github.com/raju95yadav)) |
| **Architecture Pattern** | Decoupled Client-Server (Headless Frontend SPA + Node.js Microservices) |
| **Target Platform** | Responsive Web (Mobile, Tablet, Desktop) |
| **License** | MIT License |

### Associated Ecosystem Repositories

| Repository | Role | Technology Stack | Repository Link |
| :--- | :--- | :--- | :--- |
| **beauty-glam** | Customer E-Commerce Storefront | React 19, Vite, Tailwind CSS, Lucide React | [GitHub Repo](https://github.com/raju95yadav/beauty-glam) |
| **beauty-back** | Core REST API, Auth & Business Logic | Node.js, Express, MongoDB, Mongoose, JWT | [GitHub Repo](https://github.com/raju95yadav/beauty-back) |
| **beauty-admin** | Administrative Portal & Inventory Ops | React, Vite, Tailwind CSS, Recharts | [GitHub Repo](https://github.com/raju95yadav/beauty-admin) |

---

<div align="center">
  <sub>Built with ❤️ by the Glam Beauty Engineering Team. Designed for elegance, performance, and scale.</sub>
</div>
