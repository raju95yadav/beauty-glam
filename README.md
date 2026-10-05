# Glam Beauty — Customer Storefront
> Modern, high-performance beauty and cosmetics e-commerce storefront providing responsive product discovery, real-time cart synchronization, and Razorpay checkout workflows.

---

## 📋 Table of Contents
1. [Project Overview](#-project-overview)
2. [Multi-Repo Architecture & Component Roles](#-multi-repo-architecture--component-roles)
3. [Environment Setup & Configuration](#-environment-setup--configuration)
4. [Installation & Local Run Guide](#-installation--local-run-guide)
5. [Key Workflows & Data Flows](#-key-workflows--data-flows)
6. [API / Route Reference](#-api--route-reference)
7. [Testing & Verification](#-testing--verification)
8. [Live Demonstration Guide](#-live-demonstration-guide)
9. [Project Information](#-project-information)

---

## 🌟 Project Overview

**Glam Beauty Customer Storefront** (`beauty-glam`) is a production-grade single-page e-commerce application engineered for beauty, skincare, haircare, and cosmetics retail using React 19, Vite, and Tailwind CSS v4. It connects to the headless `beauty-back` REST API to deliver instant product discovery, dynamic inventory alerts, server-synchronized cart operations, and streamlined order fulfillment tracking.

### Key Active Features
- **Dynamic Catalog Discovery & Faceted Search**: Multi-attribute filtering across categories, price tiers, and brands with debounced search queries and live stock badge indicators.
- **Hybrid Cart & Instant Wishlist**: Client-server synchronized shopping bag with quantity steppers, optimistic UI updates, and real-time free-shipping progress indicators.
- **Integrated Razorpay & COD Checkout**: Native Razorpay payment modal integration with pre-flight stock reservation, SHA-256 signature verification, and Cash on Delivery support.
- **Automated PDF Invoicing & Live Tracking**: Instant post-purchase PDF invoice generation and download, alongside a 5-stage interactive visual delivery timeline.

---

## 🏗️ Multi-Repo Architecture & Component Roles

The Glam Beauty platform is split into three decoupled repositories:

| Repository | Role | Technology Stack | Source Repository |
| :--- | :--- | :--- | :--- |
| **Frontend Storefront** (`beauty-glam`) | **Customer UI & Storefront**: Catalog browsing, cart/wishlist management, checkout wizard, auth state, and order tracking. *(This Repository)* | React 19, Vite, Tailwind CSS v4, Framer Motion, Axios | [raju95yadav/beauty-glam](https://github.com/raju95yadav/beauty-glam) |
| **Admin Portal** (`beauty-admin`) | **Management Dashboard**: Inventory control, product creation studio, Cloudinary asset uploads, order fulfillment dispatch, and revenue analytics. | React 18, Vite, Tailwind CSS, Recharts | [raju95yadav/beauty-admin](https://github.com/raju95yadav/beauty-admin) |
| **Backend API** (`beauty-back`) | **Core RESTful API Server**: MongoDB persistence, JWT/OTP authentication, Razorpay gateway handlers, Nodemailer invoice delivery, and Cloudinary pipelines. | Node.js, Express 5, MongoDB, Mongoose 9, Razorpay SDK | [raju95yadav/beauty-back](https://github.com/raju95yadav/beauty-back) |

---

## ⚙️ Environment Setup & Configuration

Create a `.env` file in the root directory of this repository:

### Required Environment Variables

| Variable Name | Required | Default / Sample Value | Description |
| :--- | :---: | :--- | :--- |
| `VITE_API_URL` | **Yes** | `http://localhost:5000/api` | Base REST endpoint for the `beauty-back` API server. |
| `VITE_GOOGLE_CLIENT_ID` | Optional | `your-google-client-id.apps.googleusercontent.com` | Google Cloud OAuth 2.0 Web Client ID for One-Tap and Pop-up login. |

### Sample `.env.example`
```env
# Backend REST API Base URL
VITE_API_URL=http://localhost:5000/api

# Google Identity Services Client ID (Optional)
VITE_GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
```

---

## 🚀 Installation & Local Run Guide

Ensure **Node.js (>= 18.18.0)** and **npm** are installed.

```bash
# 1. Clone the repository
git clone https://github.com/raju95yadav/beauty-glam.git
cd beauty-glam

# 2. Install dependencies
npm install

# 3. Configure environment variables
cp .env.example .env

# 4. Start local development server
npm run dev
```

The storefront will be available locally at `http://localhost:5173`.

---

## 🔄 Key Workflows & Data Flows

The following ASCII diagram illustrates request execution and data exchange across the Glam Beauty ecosystem:

```
[ Customer Browser ]
        │
        ├─ 1. Browse Catalog / Debounced Search
        ├─ 2. Modify Cart / Wishlist (Optimistic UI)
        ├─ 3. Submit Checkout & Delivery Address
        │
        ▼
[ Frontend Storefront (React 19 / Axios Interceptors) ]
        │  • Injects Bearer JWT in Authorization header
        │  • Validates stock availability & address schema
        │
        ▼ (HTTP REST / JSON)
[ Backend Core API (beauty-back :5000) ]
        │
        ├── Auth Guard (JWT Verify / Rate Limit / Helmet)
        ├── Mongoose Models ──────► [ MongoDB Database ] (Products, Carts, Orders, Users)
        │
        ├── Razorpay Order Init ──► [ Razorpay Gateway ]
        │                                  │
        │   ◄── Payment Response Signature ┘
        │
        ├── PDF Generation Engine ─► [ Nodemailer SMTP ] (Dispatches PDF invoice to customer)
        │
        └── Updates Fulfillment ──► [ Admin Portal (beauty-admin) ] (Status: Processing -> Delivered)
```

---

## 🛣️ API / Route Reference

### Key Client Pages & Routes

| Path | Access Level | Description & Core Components |
| :--- | :--- | :--- |
| `/` | Public | Hero banner carousel, featured cosmetic collections, flash sales, customer testimonials. |
| `/products` | Public | Search catalog with multi-facet filters (Category, Skin Type, Price range, Brand), sort options. |
| `/product/:id` | Public | High-resolution image gallery, stock level warning, ingredients, verified reviews, "Add to Cart". |
| `/cart` | Protected | Itemized cart summary, quantity adjustments, coupon validation, free shipping progress bar. |
| `/checkout` | Protected | Multi-step shipping address selector, Razorpay online gateway modal, and Cash on Delivery toggle. |
| `/orders` | Protected | Customer order history, total spent, order item summaries, and quick reorder shortcuts. |
| `/orders/:id` | Protected | Live 5-stage dispatch tracking timeline (`Pending` ➔ `Confirmed` ➔ `Shipped` ➔ `Out for Delivery` ➔ `Delivered`). |
| `/order-success/:orderId` | Protected | Post-purchase celebration page with automated PDF invoice download button. |
| `/login` / `/verify-otp` | Public | Passwordless OTP login request via Nodemailer email service or Google One-Tap OAuth. |

### Client Service Payloads & Backend Interactions

#### 1. Initiate Razorpay Checkout Order
```javascript
// POST ${VITE_API_URL}/payment/create-order
const payload = {
  items: [{ product: "65f1a2b3c4d5e6f7a8b9c0d1", quantity: 2, price: 1299 }],
  shippingAddress: {
    street: "123 Marine Drive",
    city: "Mumbai",
    state: "Maharashtra",
    postalCode: "400001",
    country: "India"
  },
  paymentMethod: "razorpay"
};
```

#### 2. Verify Razorpay Payment Signature
```javascript
// POST ${VITE_API_URL}/payment/verify-payment
const payload = {
  razorpay_order_id: "order_NU9X7Yd2JpA123",
  razorpay_payment_id: "pay_NU9Z8Ae4KqB456",
  razorpay_signature: "a1b2c3d4e5f6...7890abcdef"
};
```

#### 3. Download Generated PDF Tax Invoice
```javascript
// GET ${VITE_API_URL}/orders/:orderId/invoice
// Returns: Content-Type: application/pdf (rendered via PDFKit in backend)
```

---

## 🧪 Testing & Verification

Execute the following commands to validate code quality and production readiness:

```bash
# 1. Run ESLint static code analysis
npm run lint

# 2. Build production distribution bundle
npm run build

# 3. Preview production build locally
npm run preview

# 4. Verify API connectivity to backend
curl -I http://localhost:5000/api/products
```

---

## 🎬 Live Demonstration Guide

Follow this 4-step sequence to verify the complete customer shopping journey:

1. **Catalog Exploration & Item Selection**:
   - Navigate to `/products`, apply category filter (`Skincare`), and select a product to open `/product/:id`.
   - Click **Add to Bag** and confirm the cart badge updates in the top navigation bar.
2. **Authentication via Passwordless OTP**:
   - Navigate to `/login`, enter an email address, and retrieve the 6-digit OTP code sent via Nodemailer.
   - Enter the OTP on `/verify-otp` to receive a signed JWT and access protected routes.
3. **Checkout & Razorpay Payment Simulation**:
   - Proceed to `/checkout`, select or input a valid delivery address, and choose **Razorpay Online**.
   - Click **Pay Now** to launch the Razorpay sandbox modal. Use standard test credentials to complete the transaction.
4. **Order Confirmation & Invoicing**:
   - Upon payment verification, observe redirection to `/order-success`.
   - Click **Download Invoice** to retrieve the server-generated PDF.
   - Visit `/orders/:id` to inspect the real-time fulfillment status timeline.

---

## ℹ️ Project Information

- **Project Name**: Glam Beauty — Customer Storefront
- **Repository**: [`beauty-glam`](https://github.com/raju95yadav/beauty-glam)
- **Author & Maintainer**: Raju Yadav ([@raju95yadav](https://github.com/raju95yadav))
- **Status**: Production / Active Maintenance
- **License**: MIT
