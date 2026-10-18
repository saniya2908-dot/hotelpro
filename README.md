# HotelPro

> **Live demo:** https://hotelpro-21bl.onrender.com

HotelPro is an image-led hotel booking and management web application for browsing rooms, registering as a guest, making reservations, and managing room inventory through a separate administrator console.

## Project links

- **Live website:** https://hotelpro-21bl.onrender.com
- **Admin sign-in:** https://hotelpro-21bl.onrender.com/admin-login
- **GitHub repository:** https://github.com/saniya2908-dot/hotelpro

## Features

- Hotel homepage with room photography and descriptive content
- Guest registration and sign-in
- Room browsing and reservation workflows
- Separate administrator sign-in and role-protected management routes
- Admin tools for adding and removing room listings
- MongoDB-backed room and booking data

## Run locally

1. Install Node.js 20.19+ or 22.12+.
2. Copy `.env.example` to `server/.env` and set `MONGO_URI` to a MongoDB replica-set connection string and `JWT_SECRET` to a random secret with at least 32 characters. MongoDB Atlas supports the transaction used to prevent simultaneous overbooking. Never commit `.env`.
3. Set `CLIENT_ORIGIN` to the frontend origin (default `http://localhost:5173`).
4. In `server`, run `npm ci` then `npm start`.
5. In `client`, run `npm ci`, set `VITE_API_URL=http://localhost:8001/api` in a local `.env`, then run `npm run dev`.

The server adds the starter inventory only when those room numbers are missing. Public registration always creates a customer account. Administrator credentials must be configured using server-side environment variables; never commit secrets to the repository.

## Payments

Online payment processing is not configured. The app does not request or store card numbers, expiry dates, or CVV values. Confirming a booking records it with `paymentStatus: "not_configured"`; it does not charge the guest. Add a payment provider and verify its signed server-side callbacks before representing any booking as paid.

## Checks

- Backend tests: `cd server && npm test`
- Frontend lint: `cd client && npm run lint`
- Frontend production build: `cd client && npm run build`

Live login, booking, and cancellation flows require a reachable MongoDB replica set. Payment flows require a payment provider, which is currently not implemented.
