<div align="center">
  <h1>🚀 PromptVerse</h1>
  <p><strong>A modern marketplace for discovering, sharing, and managing AI prompts</strong></p>
  <p>
    <img src="https://img.shields.io/badge/Next.js-16-black?style=flat&logo=next.js" alt="Next.js 16" />
    <img src="https://img.shields.io/badge/React-19-blue?style=flat&logo=react" alt="React 19" />
    <img src="https://img.shields.io/badge/Express-5-green?style=flat&logo=express" alt="Express 5" />
    <img src="https://img.shields.io/badge/MongoDB-7-green?style=flat&logo=mongodb" alt="MongoDB 7" />
    <img src="https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?style=flat&logo=tailwindcss" alt="Tailwind CSS 4" />
    <img src="https://img.shields.io/badge/Stripe-payments-blueviolet?style=flat&logo=stripe" alt="Stripe" />
  </p>
</div>

---

## 📋 Overview

**PromptVerse** is a full-stack web application that serves as a marketplace for AI prompts. Users can browse, search, and copy prompts shared by a community of creators. The platform features role-based access control (User, Creator, Admin), secure authentication, premium subscriptions via Stripe, and comprehensive analytics dashboards.

---

## ✨ Features

### 👥 User Features
- **Browse Prompts** — Explore a curated collection of AI prompts with search and filtering
- **Copy Prompts** — One-click copy with automatic usage tracking
- **Bookmark Prompts** — Save your favorite prompts for later
- **Reviews & Ratings** — Rate and review prompts to help the community
- **User Dashboard** — Manage your saved prompts, reviews, and profile

### 🎨 Creator Features
- **Create & Publish Prompts** — Submit prompts with categories, tags, difficulty levels, and AI tool targeting
- **Prompt Management** — View, edit, and manage your published prompts
- **Creator Analytics** — Track copies, bookmarks, and monthly growth with visual charts
- **Content Visibility** — Control which prompts are public or private

### 🛡️ Admin Features
- **User Management** — View, promote, and manage users with role assignments
- **Prompt Moderation** — Approve, reject, or feature prompts with feedback
- **Report Handling** — Review and resolve content reports from the community
- **Payment Tracking** — Monitor subscription payments and revenue
- **Platform Analytics** — View platform-wide stats including users, prompts, copies, and growth trends

### 💳 Premium Subscriptions
- Stripe-powered one-time payment for Premium access
- Premium badge and extended features for subscribers
- Automatic user role upgrade upon successful payment

### 🔐 Authentication
- Email/password registration and login with bcrypt hashing
- Google OAuth single sign-on
- JWT-based session management with 7-day expiry
- Role-based access control middleware

---

## 🏗️ Architecture

```
prompt-verse-client/          # Next.js 16 frontend (React 19)
├── src/
│   ├── app/                  # App Router pages
│   │   ├── auth/             # Sign in / Sign up
│   │   ├── dashboard/        # User, Creator & Admin dashboards
│   │   ├── all-prompts/      # Browse all prompts
│   │   ├── prompts/[id]/     # Individual prompt detail
│   │   ├── pricing/          # Subscription plans
│   │   ├── payment/          # Stripe checkout
│   │   └── api/              # API routes (auth, checkout sessions)
│   ├── components/           # Reusable React components
│   │   ├── admin/            # Admin sidebar & admin-specific UI
│   │   ├── creator/          # Creator sidebar & creator-specific UI
│   │   ├── dashboard/        # Dashboard layout, profile card, form
│   │   ├── Navbar.jsx        # Navigation bar
│   │   ├── HeroSection.jsx   # Landing page hero
│   │   ├── Footer.jsx        # Site footer
│   │   ├── AllPromptsSection.jsx
│   │   ├── CustomerReviews.jsx
│   │   ├── FAQ.jsx
│   │   ├── Stats.jsx
│   │   ├── TopCreators.jsx
│   │   └── WhyChooseUS.jsx
│   └── lib/                  # Utility functions
│       ├── auth-client.js    # Client-side auth helpers
│       ├── auth.js           # Auth utilities
│       ├── express-auth.js   # Express auth adapter
│       ├── prompts.ts        # Prompt API helpers
│       └── stripe.js         # Stripe client setup
├── proxy.js                  # Development proxy configuration
├── next.config.mjs           # Next.js configuration
├── tailwind.config.js        # Tailwind CSS configuration
└── package.json

prompt-verse-server/           # Express.js 5 backend
├── index.js                   # Main server with all API routes
├── .env                       # Environment variables
└── package.json
```

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| [Next.js 16](https://nextjs.org/) | React framework with App Router |
| [React 19](https://react.dev/) | UI library |
| [Tailwind CSS 4](https://tailwindcss.com/) | Utility-first CSS framework |
| [daisyUI 5](https://daisyui.com/) | Tailwind CSS component library |
| [HeroUI 3](https://heroui.com/) | UI component library |
| [Lucide React](https://lucide.dev/) | Icon library |
| [Recharts](https://recharts.org/) | Analytics charts |
| [Framer Motion](https://motion.dev/) | Animation library |
| [react-hot-toast](https://react-hot-toast.com/) | Toast notifications |
| [Stripe.js](https://stripe.com/docs/stripe-js) | Payment processing |

### Backend
| Technology | Purpose |
|---|---|
| [Express.js 5](https://expressjs.com/) | Web server framework |
| [MongoDB 7](https://www.mongodb.com/) | NoSQL database |
| [JSON Web Tokens](https://jwt.io/) | Authentication |
| [bcryptjs](https://github.com/dcodeIO/bcrypt.js) | Password hashing |
| [Google Auth Library](https://github.com/googleapis/google-auth-library-nodejs) | Google OAuth |
| [Stripe Node.js](https://stripe.com/docs/api) | Payment processing |

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) >= 18
- [MongoDB](https://www.mongodb.com/) instance (local or Atlas)
- [Stripe](https://stripe.com/) account (for payments)
- [Google Cloud Console](https://console.cloud.google.com/) OAuth credentials (optional, for Google sign-in)

### Installation

**1. Clone the repository**

```bash
git clone <repository-url>
cd prompt-verse
```

**2. Set up the server**

```bash
cd prompt-verse-server
npm install
```

Create a `.env` file in `prompt-verse-server/`:

```env
MONGO_DB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
GOOGLE_CLIENT_ID=your_google_client_id    # Optional for Google OAuth
STRIPE_SECRET_KEY=your_stripe_secret_key  # Optional for payments
AUTH_DB_NAME=better-auth                   # Optional, defaults to "better-auth"
```

**3. Set up the client**

```bash
cd prompt-verse-client
npm install
```

**4. Start the development servers**

_Terminal 1 — Backend:_

```bash
cd prompt-verse-server
node index.js
```

_Terminal 2 — Frontend:_

```bash
cd prompt-verse-client
npm run dev
```

**5. Open the app**

Visit [http://localhost:3000](http://localhost:3000) in your browser.

---


Seed demo users by making a POST request to the seed endpoint:

```bash
curl -X POST http://localhost:5000/auth/seed-demo
```

| Role | Email | Password |
|---|---|---|
| **Admin** | admin@demo.com | Demo@123 |
| **Creator** | creator@demo.com | Demo@123 |
| **User** | user@demo.com | Demo@123 |

---

## 📡 API Reference

The Express server runs on `http://localhost:5000`. Key endpoints:

### Authentication
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/auth/register` | Register a new user |
| `POST` | `/auth/login` | Login with email & password |
| `POST` | `/auth/google` | Google OAuth sign-in |
| `GET` | `/auth/me` | Get current user (requires token) |
| `POST` | `/auth/seed-demo` | Seed demo users |

### Prompts
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/all-promts` | Get all prompts |
| `GET` | `/all-promts/:id` | Get a single prompt |
| `POST` | `/api/prompts` | Create a prompt |
| `GET` | `/api/my-prompts/:email` | Get prompts by creator |
| `DELETE` | `/api/prompts/:id` | Delete a prompt |
| `POST` | `/api/prompts/:id/copy` | Increment copy count |

### Reviews
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/prompts/:id/reviews` | Get reviews for a prompt |
| `POST` | `/api/reviews` | Submit a review |
| `GET` | `/api/my-reviews/:email` | Get user's reviews |

### Bookmarks
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/bookmarks/:email` | Get user bookmarks |
| `GET` | `/api/bookmarks/:email/:promptId` | Check bookmark status |
| `POST` | `/api/bookmarks/toggle` | Toggle bookmark |

### Payments
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/create-checkout-session` | Create Stripe checkout |
| `GET` | `/api/verify-payment/:sessionId` | Verify payment status |
| `GET` | `/api/payments` | List payments (admin) |

### Admin
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/admin/analytics` | Platform analytics |
| `GET` | `/api/admin/users` | List all users |
| `PUT` | `/api/admin/users/:id/role` | Update user role |
| `DELETE` | `/api/admin/users/:id` | Delete a user |
| `GET` | `/api/admin/prompts` | List all prompts |
| `PUT` | `/api/admin/prompts/:id/status` | Update prompt status |
| `DELETE` | `/api/admin/prompts/:id` | Delete a prompt |
| `GET` | `/api/reports` | List reports |
| `PUT` | `/api/admin/reports/:id` | Update report status |
| `DELETE` | `/api/admin/reports/:id` | Delete a report |

### Creator Analytics
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/creator/analytics` | Creator dashboard analytics |

---

## 📦 Project Scripts

### Client (`prompt-verse-client/`)

| Script | Description |
|---|---|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |

### Server (`prompt-verse-server/`)

| Script | Description |
|---|---|
| `node index.js` | Start the Express server |

---

## 🔒 Environment Variables

### Server (`prompt-verse-server/.env`)

| Variable | Required | Description |
|---|---|---|
| `MONGO_DB_URI` | ✅ | MongoDB connection string |
| `JWT_SECRET` | ✅ | Secret key for JWT signing |
| `GOOGLE_CLIENT_ID` | ❌ | Google OAuth client ID |
| `STRIPE_SECRET_KEY` | ❌ | Stripe secret key |
| `AUTH_DB_NAME` | ❌ | Name of auth database in MongoDB |

### Client (`prompt-verse-client/.env`)

| Variable | Required | Description |
|---|---|---|
| `NEXT_PUBLIC_STRIPE_KEY` | ❌ | Stripe publishable key |

---

## 🧑‍💻 Development

### Proxy Configuration

The frontend uses a proxy configuration in `proxy.js` to route API requests to the Express backend during development.

```javascript
// proxy.js
const { createProxyMiddleware } = require('http-proxy-middleware');
```

---

## 📄 License

This project is licensed under the ISC License — see the `prompt-verse-server/package.json` file for details.

---

<div align="center">
  <p>Built with ❤️ using Next.js, Express, and MongoDB</p>
</div>
