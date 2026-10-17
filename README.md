# HotelPro

HotelPro is a rich, image-led hotel booking demo with guest registration, room browsing, reservations, and an admin console. The selected version is the `main` branch. The former `classic` branch has been deleted.

## Run locally

1. Install Node.js 20.19+ or 22.12+.
2. Copy `.env.example` to `server/.env` and set `MONGO_URI` to a MongoDB replica-set connection string and `JWT_SECRET` to a random secret with at least 32 characters. MongoDB Atlas supports the transaction used to prevent simultaneous overbooking. Never commit `.env`.
3. Set `CLIENT_ORIGIN` to the frontend origin (default `http://localhost:5173`).
4. In `server`, run `npm ci` then `npm start`.
5. In `client`, run `npm ci`, set `VITE_API_URL=http://localhost:8001/api` in a local `.env`, then run `npm run dev`.

The server adds the starter inventory only when those room numbers are missing. Public registration always creates a customer account. To designate an administrator, first register that account, then change its `type` field to `admin` directly in the trusted MongoDB database; there is intentionally no public role-selection or admin-creation endpoint.

## Payments

Online payment processing is not configured. The app does not request or store card numbers, expiry dates, or CVV values. Confirming a booking records it with `paymentStatus: "not_configured"`; it does not charge the guest. Add a payment provider and verify its signed server-side callbacks before representing any booking as paid.

## Checks

- Backend tests: `cd server && npm test`
- Frontend lint: `cd client && npm run lint`
- Frontend production build: `cd client && npm run build`

Live login, booking, and cancellation flows require a reachable MongoDB replica set. Payment flows require a payment provider, which is currently not implemented.
