# GearNest Server

**Assignment 09 | Category 003**

Backend API for GearNest equipment rental platform.

- **Live Server:** https://gearnest-server.onrender.com
- **Live Client:** https://gearnest-client-one.vercel.app

### Tech Stack

Node.js, Express, TypeScript, Mongoose, MongoDB Atlas, JWT, Stripe, Nodemailer

### Main APIs

- `POST /api/auth/register` - Register
- `POST /api/auth/login` - Login
- `POST /api/auth/google` - Google login
- `GET /api/equipment` - All approved equipment with filters (search, category, location, rentalType, minPrice, maxPrice, availability, sort, page, limit)
- `GET /api/equipment/:id` - Single equipment
- `POST /api/equipment` - Add equipment (owner)
- `PUT /api/equipment/:id/approve` - Approve (admin)
- `POST /api/bookings/checkout` - Create booking + Stripe Checkout session
- `POST /api/bookings/confirm` - Confirm after payment -> Paid / Confirmed + email
- `GET /api/bookings/my` - My bookings (customer)
- `GET /api/bookings/owner` - Owner bookings

### Key Fixes in This Project

- Equipment price fallback: `rentalPrice > 0 ? rentalPrice : pricePerDay` - fixes `Equipment price not found` when `rentalPrice` is 0
- Booking total: Daily / Weekly / Monthly + quantity
- TypeScript fixes for Render build: `authController` photo via `any`, `Equipment` interface via `Omit<Document, 'model'>`
- Stripe client created inside checkout after `.env` load

### Run Locally - Server

```bash
cd server
npm install
npm run dev
```

Create `server/.env`:

```
PORT=5000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
STRIPE_SECRET_KEY=your_stripe_test_secret_key
STRIPE_PUBLISHABLE_KEY=your_stripe_test_publishable_key
EMAIL_USER=your_gmail
EMAIL_PASS=your_gmail_app_password
CLIENT_URL=http://localhost:3000
```

### Deploy

- **Render:** Web Service, Build `npm install`, Start `npm start`, add all env vars in Render dashboard
- After Vercel deploy, update `CLIENT_URL` in Render to Vercel URL

### Note

Do not commit `.env` - it contains secrets. Never push Stripe secret keys to GitHub.
