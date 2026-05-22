# SPACE 404 - Exclusive Streetwear Vault

A high-end, luxury streetwear e-commerce platform built with Next.js 15, Prisma, and Tailwind CSS.

## 🚀 Quick Start

### 1. Environment Setup
Copy the example environment file and fill in your credentials:
```bash
cp .env.example .env
```
Required variables:
- `DATABASE_URL`: Your PostgreSQL connection string.
- `JWT_SECRET`: Secret key for admin authentication.
- `PAYSTACK_SECRET_KEY`: Your Paystack secret key for payments.
- `NEXT_PUBLIC_BASE_URL`: The URL where your app is hosted.

### 2. Installation
```bash
npm install
```

### 3. Database Initialization
```bash
npx prisma migrate dev
npm run prisma:seed
```

### 4. Run Development Server
```bash
npm run dev
```

---

## 🛠 Features

- **Luxury Aesthetic**: Custom-designed UI with a "dark luxury" theme.
- **Dynamic Collection**: Real-time filtering by category and collection.
- **Admin Vault**: Polished dashboard for managing inventory, collections, and tracking revenue.
- **Secure Checkout**: Integrated with Paystack for seamless global payments.
- **Order Manifest**: Unique order IDs and identity verification for tracking acquisitions.

---

## 📦 Deployment & Hosting

This project is optimized for modern cloud hosting.

### Recommended: Vercel
1. Push your code to a GitHub repository.
2. Connect the repository to [Vercel](https://vercel.com).
3. Add your environment variables in the Vercel dashboard.
4. **Build Settings**: Next.js defaults are correct.
5. **Database**: Use Vercel Postgres or a managed provider like Supabase/Neon.

### Production Build
To test the production build locally:
```bash
npm run build
npm run start
```

---

## 💳 Payment Flow (Paystack)

1. **Initiation**: Checkout creates an order and redirects the user to the Paystack payment gateway.
2. **Verification**: After payment, the user is redirected to `/payments/return`, which calls our API to verify the transaction.
3. **Webhook**: Paystack sends a server-to-server event to `/api/payments/webhook` to ensure the order is marked as paid even if the user closes their browser.

**Local Webhook Testing**:
Use `ngrok` to expose your local environment:
```bash
npx ngrok http 3000
```
Set the Paystack Webhook URL to: `https://<your-ngrok-url>/api/payments/webhook`

---

## 🔐 Security

- **Admin Routes**: Protected via JWT verification and server-side middleware.
- **Environment Safety**: Critical secrets are stored in `.env` and never exposed to the client.
- **Input Validation**: API routes perform server-side checks for order integrity and price tampering.
