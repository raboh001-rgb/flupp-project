# 🐾 Flupp Pet Services Platform

> **The comprehensive pet services marketplace connecting pet owners with trusted service providers across the UK**

[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org)
[![Next.js](https://img.shields.io/badge/Next.js-15+-blue.svg)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5+-blue.svg)](https://typescriptlang.org)
[![Production Ready](https://img.shields.io/badge/Production-Ready-success.svg)](https://flupp-project.raboh001.repl.co)

## 🌟 Live Deployments

- **🚀 Backend API**: [https://flupp-project.raboh001.repl.co](https://flupp-project.raboh001.repl.co)
- **🖥️ Frontend Web App**: [Coming Soon - Add your frontend Repl URL]
- **📋 Repository**: [https://github.com/raboh001-rgb/flupp-project](https://github.com/raboh001-rgb/flupp-project)

---

## 📋 Table of Contents

1. [Project Overview](#-project-overview)
2. [Business Model](#-business-model)
3. [System Architecture](#-system-architecture)
4. [API Documentation](#-api-documentation)
5. [Frontend Architecture](#-frontend-architecture)
6. [Payment Flows](#-payment-flows)
7. [Development Setup](#-development-setup)
8. [Deployment Guide](#-deployment-guide)
9. [Environment Variables](#-environment-variables)
10. [Testing Guide](#-testing-guide)
11. [Security Features](#-security-features)
12. [Troubleshooting](#-troubleshooting)

---

## 🎯 Project Overview

Flupp is a comprehensive pet services marketplace that connects pet owners with trusted service providers across the UK. Our platform offers three distinct business models:

### **🏠 Service Bookings** (B2C Marketplace)
Direct booking platform for pet care services with integrated payments

### **📋 Directory Listings** (B2B Lead Generation)
Professional directory for veterinary practices and service providers

### **🛍️ Marketplace** (C2C E-commerce)
Second-hand pet items marketplace with secure transactions

---

## 💼 Business Model

### **Revenue Streams**

| Service Type | Model | Revenue |
|-------------|--------|---------|
| **Pet Boarding** | Commission (15% per booking) | High-value transactions |
| **Pet Grooming** | Commission (12% per booking) | Regular repeat customers |
| **Pet Daycare** | Commission (10% per booking) | Subscription potential |
| **Pet Training** | Commission (20% per booking) | Premium service rates |
| **Veterinary Directory** | Monthly subscription (£49/month) | Recurring B2B revenue |
| **Marketplace** | Transaction fee (5% + £0.30) | Volume-based scaling |

### **Target Markets**

- **🏠 Pet Owners**: Convenient service booking with trusted providers
- **🏢 Service Providers**: Business growth through verified bookings
- **🏥 Veterinary Practices**: Professional visibility and lead generation
- **🛍️ Pet Community**: Sustainable second-hand pet items trading

---

## 🏗️ System Architecture

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Next.js Web   │◄──►│   Express API    │◄──►│   Prisma DB     │
│   (Frontend)    │    │   (Backend)      │    │   (Database)    │
└─────────────────┘    └──────────────────┘    └─────────────────┘
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│  Stripe Payment │    │  Security Layer  │    │  File Storage   │
│   Integration   │    │  (Auth/CORS)     │    │    (Images)     │
└─────────────────┘    └──────────────────┘    └─────────────────┘
```

### **Technology Stack**

#### **Frontend (Next.js)**
- **Framework**: Next.js 15 with App Router
- **Styling**: Tailwind CSS with custom Flupp design system
- **State Management**: React hooks and context
- **Payment UI**: Stripe Elements for secure card processing
- **Validation**: Zod schemas with TypeScript integration
- **Error Handling**: React Error Boundaries with graceful recovery

#### **Backend (Express.js)**
- **Runtime**: Node.js 18+ with ES modules
- **Framework**: Express.js with TypeScript
- **Database**: Prisma ORM with SQLite (development) / PostgreSQL (production)
- **Authentication**: JWT with role-based access control
- **Security**: Helmet.js, CORS, rate limiting, input sanitization
- **Payments**: Stripe API with webhook validation
- **Validation**: Zod schemas with comprehensive error handling

#### **Infrastructure**
- **Development**: Local development with hot reload
- **Deployment**: Replit for staging, cloud platforms for production
- **Database**: SQLite (development) / PostgreSQL (production)
- **File Storage**: Local filesystem (development) / Cloud storage (production)
- **Monitoring**: Comprehensive logging and error tracking

---

## 🔌 API Documentation

### **Base URL**
```
Development: http://localhost:8787
Production: https://flupp-project.raboh001.repl.co
```

### **Authentication**
```bash
# All requests include standard headers
Headers:
  Content-Type: application/json
  Authorization: Bearer <jwt_token>  # For protected routes
  X-API-Key: <api_key>              # For internal services
```

### **Core Endpoints**

#### **🏥 Health & Status**

```http
GET /health
```

**Response Example:**
```json
{
  "ok": true,
  "timestamp": "2024-01-15T10:30:00Z",
  "uptime": 3600,
  "environment": "production",
  "version": "1.0.0"
}
```

---

#### **📋 Booking Management**

##### **Create Booking**
```http
POST /api/bookings
```

**Request Body:**
```json
{
  "petName": "Max",
  "species": "dog",
  "serviceType": "grooming",
  "startAt": "2024-02-01T10:00:00Z",
  "endAt": "2024-02-01T12:00:00Z",
  "priceCents": 5000,
  "customerEmail": "owner@example.com",
  "currency": "GBP"
}
```

**Response (201 Created):**
```json
{
  "id": "booking_1704445800000_1",
  "petName": "Max",
  "species": "dog",
  "serviceType": "grooming",
  "startAt": "2024-02-01T10:00:00Z",
  "endAt": "2024-02-01T12:00:00Z",
  "priceCents": 5000,
  "customerEmail": "owner@example.com",
  "currency": "GBP",
  "status": "pending",
  "createdAt": "2024-01-15T10:30:00Z",
  "updatedAt": "2024-01-15T10:30:00Z"
}
```

##### **Get Booking**
```http
GET /api/bookings/:id
```

**Response (200 OK):**
```json
{
  "id": "booking_1704445800000_1",
  "petName": "Max",
  "species": "dog",
  "serviceType": "grooming",
  "startAt": "2024-02-01T10:00:00Z",
  "endAt": "2024-02-01T12:00:00Z",
  "priceCents": 5000,
  "customerEmail": "owner@example.com",
  "currency": "GBP",
  "status": "paid",
  "paymentIntentId": "pi_1234567890",
  "createdAt": "2024-01-15T10:30:00Z",
  "updatedAt": "2024-01-15T10:35:00Z"
}
```

##### **Update Booking Status**
```http
PATCH /api/bookings/:id/status
```

**Request Body:**
```json
{
  "status": "paid"
}
```

**Valid Status Values:**
- `pending` - Initial booking state
- `paid` - Payment completed
- `cancelled` - Booking cancelled

---

#### **💳 Payment Processing**

##### **Create Payment Intent**
```http
POST /api/payments/create-intent
```

**Request Body:**
```json
{
  "bookingId": "booking_1704445800000_1"
}
```

**Response (200 OK):**
```json
{
  "clientSecret": "pi_1234567890_secret_abcd1234",
  "amount": 5000,
  "currency": "gbp"
}
```

##### **Stripe Webhook Handler**
```http
POST /api/payments/webhook
```

**Headers:**
```
Stripe-Signature: t=1704445800,v1=signature_hash
```

**Request Body (Stripe Event):**
```json
{
  "type": "payment_intent.succeeded",
  "data": {
    "object": {
      "id": "pi_1234567890",
      "metadata": {
        "bookingId": "booking_1704445800000_1"
      }
    }
  }
}
```

---

#### **⭐ Review System**

##### **Create Review**
```http
POST /api/reviews
```

**Request Body:**
```json
{
  "bookingId": "booking_1704445800000_1",
  "rating": 5,
  "comment": "Excellent grooming service!"
}
```

**Response (201 Created):**
```json
{
  "id": "review_1704445900000",
  "bookingId": "booking_1704445800000_1",
  "rating": 5,
  "comment": "Excellent grooming service!",
  "createdAt": "2024-01-15T10:45:00Z"
}
```

##### **Get Reviews for Booking**
```http
GET /api/reviews/for-booking/:bookingId
```

**Response (200 OK):**
```json
{
  "reviews": [
    {
      "id": "review_1704445900000",
      "rating": 5,
      "comment": "Excellent grooming service!",
      "createdAt": "2024-01-15T10:45:00Z"
    }
  ]
}
```

---

#### **🚨 Error Handling**

All endpoints return structured error responses:

**Client Errors (4xx):**
```json
{
  "error": "Pet name is required",
  "code": "VALIDATION_ERROR",
  "statusCode": 400
}
```

**Server Errors (5xx):**
```json
{
  "error": "An internal server error occurred",
  "code": "INTERNAL_ERROR",
  "statusCode": 500
}
```

**Common Error Codes:**
- `VALIDATION_ERROR` (400) - Invalid request data
- `NOT_FOUND` (404) - Resource not found
- `BOOKING_CONFLICT` (409) - Conflicting booking times
- `UNAUTHORIZED` (401) - Authentication required
- `FORBIDDEN` (403) - Insufficient permissions
- `RATE_LIMITED` (429) - Too many requests
- `INTERNAL_ERROR` (500) - Server error

---

## 🎨 Frontend Architecture

### **Project Structure**
```
web/
├── app/                          # Next.js 13+ App Directory
│   ├── layout.tsx               # Root layout with error boundaries
│   ├── page.tsx                 # Homepage with service categories
│   ├── book/
│   │   └── new/page.tsx         # Booking form with validation
│   ├── pay/[id]/page.tsx        # Secure payment processing
│   ├── thanks/[id]/page.tsx     # Confirmation page
│   ├── services/                # Service category pages
│   ├── marketplace/             # C2C marketplace
│   └── veterinary/              # Veterinary directory
├── components/
│   ├── ui/                      # Reusable UI components
│   ├── payment/                 # Stripe payment components
│   ├── ErrorBoundary.tsx        # Error boundary implementations
│   └── forms/                   # Form components with validation
├── lib/
│   ├── config.ts               # Environment configuration
│   ├── api.ts                  # API client functions
│   ├── schemas.ts              # Zod validation schemas
│   ├── stripe.ts               # Stripe integration
│   └── utils.ts                # Utility functions
└── styles/
    └── globals.css             # Tailwind CSS with custom design system
```

### **Component Architecture**

#### **Reusable Components**
- **Button**: Consistent styling with loading states
- **Input**: Form inputs with validation display
- **ErrorBoundary**: Graceful error handling with recovery options
- **StripeProvider**: Secure payment component wrapper

#### **Page Components**
- **Booking Form**: Multi-step form with client-side validation
- **Payment Form**: PCI-compliant payment processing
- **Service Listings**: Dynamic service category displays
- **Marketplace**: Product listings with search and filters

#### **State Management**
- **React Hooks**: useState, useEffect for component state
- **Context API**: Global state for authentication and cart
- **React Query**: Server state management and caching (future enhancement)

### **Security Features**
- **Input Sanitization**: All user inputs sanitized before processing
- **XSS Prevention**: Content Security Policy and input validation
- **CSRF Protection**: Token-based request validation
- **Error Boundaries**: Prevent application crashes with graceful fallbacks

---

## 💰 Payment Flows

### **Service Booking Payment Flow**

```mermaid
sequenceDiagram
    participant Customer
    participant Frontend
    participant Backend
    participant Stripe
    
    Customer->>Frontend: Fill booking form
    Frontend->>Frontend: Validate form data
    Frontend->>Backend: POST /api/bookings
    Backend->>Backend: Create booking (status: pending)
    Backend->>Frontend: Return booking ID
    
    Frontend->>Backend: POST /api/payments/create-intent
    Backend->>Stripe: Create PaymentIntent
    Stripe->>Backend: Return client_secret
    Backend->>Frontend: Return client_secret
    
    Frontend->>Stripe: Process payment with card details
    Stripe->>Backend: Webhook: payment_intent.succeeded
    Backend->>Backend: Update booking status to 'paid'
    Backend->>Stripe: Acknowledge webhook
    
    Stripe->>Frontend: Payment confirmation
    Frontend->>Customer: Redirect to success page
```

### **Marketplace Transaction Flow**

```mermaid
sequenceDiagram
    participant Buyer
    participant Seller
    participant Platform
    participant Stripe
    
    Buyer->>Platform: Purchase item
    Platform->>Stripe: Create PaymentIntent
    Stripe->>Platform: Return payment details
    
    Buyer->>Stripe: Complete payment
    Stripe->>Platform: Webhook: payment successful
    
    Platform->>Platform: Calculate fees (5% + £0.30)
    Platform->>Seller: Transfer funds (minus fees)
    Platform->>Buyer: Send purchase confirmation
    Platform->>Seller: Send sale notification
```

### **Payment Security**

#### **PCI Compliance**
- **Stripe Elements**: No card details touch your servers
- **Webhook Verification**: All webhooks cryptographically verified
- **Secure Tokenization**: Card details tokenized by Stripe

#### **Fraud Prevention**
- **3D Secure**: Automatic 3D Secure 2.0 support
- **Risk Assessment**: Stripe's machine learning fraud detection
- **Dispute Handling**: Automated dispute management

#### **Financial Controls**
- **Idempotency**: Prevent duplicate payments
- **Amount Validation**: Server-side price verification
- **Status Tracking**: Comprehensive payment state management

---

## 🚀 Development Setup

### **Prerequisites**
```bash
# Required Software
Node.js 18+ (LTS recommended)
npm 8+ or yarn 1.22+
Git 2.40+

# Optional but Recommended
VS Code with extensions:
  - TypeScript and JavaScript Language Features
  - Tailwind CSS IntelliSense
  - Prisma
  - ESLint
```

### **1. Repository Setup**

```bash
# Clone the repository
git clone https://github.com/raboh001-rgb/flupp-project.git
cd flupp-project

# Verify project structure
ls -la
# Should show: backend/ web/ mcp-server/ README.md
```

### **2. Backend Setup**

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local

# Edit .env.local with your values:
# NODE_ENV=development
# PORT=8787
# DATABASE_URL="file:./dev.db"
# STRIPE_SECRET_KEY=sk_test_your_key
# STRIPE_WEBHOOK_SECRET=whsec_your_secret
# JWT_SECRET=your_jwt_secret
# FRONTEND_URL=http://localhost:3000

# Set up database
npm run prisma:dev

# Start development server
npm run dev

# Server running at http://localhost:8787
# Test health endpoint: curl http://localhost:8787/health
```

### **3. Frontend Setup**

```bash
# Navigate to frontend directory (new terminal)
cd web

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local

# Edit .env.local with your values:
# NEXT_PUBLIC_API_BASE_URL=http://localhost:8787
# NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_key
# NEXTAUTH_URL=http://localhost:3000
# NEXTAUTH_SECRET=your_nextauth_secret

# Start development server
npm run dev

# Frontend running at http://localhost:3000
```

### **4. Development Workflow**

```bash
# Run tests (backend)
cd backend
npm test                    # Run all tests
npm run test:watch         # Watch mode
npm run test:coverage      # With coverage

# Run tests (frontend)
cd web
npm test                   # Jest tests
npm run test:e2e          # End-to-end tests (if configured)

# Code quality
npm run lint              # ESLint
npm run lint:fix          # Fix auto-fixable issues
npm run type-check        # TypeScript validation

# Build for production
npm run build             # Both backend and frontend
```

### **5. Database Management**

```bash
# Backend directory
cd backend

# Database migrations
npm run prisma:dev        # Create and apply migration
npm run prisma:reset      # Reset database (development only)
npm run prisma:studio     # Open Prisma Studio (GUI)

# Seed development data (if configured)
npm run db:seed
```

---

## 🌐 Deployment Guide

### **Replit Deployment (Current)**

#### **Backend Deployment**
1. **Create Replit Project**
   ```bash
   # In Replit
   git clone https://github.com/raboh001-rgb/flupp-project.git
   cd backend
   ```

2. **Configure Environment**
   ```bash
   # In Replit Secrets (Environment Variables)
   NODE_ENV=production
   PORT=3000
   DATABASE_URL=file:./prod.db
   STRIPE_SECRET_KEY=sk_live_your_key
   STRIPE_WEBHOOK_SECRET=whsec_your_secret
   JWT_SECRET=your_production_jwt_secret
   ```

3. **Deploy**
   ```bash
   npm install
   npm run build
   npm start
   ```

#### **Frontend Deployment**
1. **Create Frontend Repl**
   ```bash
   cd web
   npm install
   npm run build
   npm start
   ```

2. **Configure Environment**
   ```bash
   NEXT_PUBLIC_API_BASE_URL=https://flupp-project.raboh001.repl.co
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_your_key
   NEXTAUTH_URL=https://your-frontend-repl.repl.co
   NEXTAUTH_SECRET=your_production_secret
   ```

### **Production Deployment Options**

#### **Vercel (Frontend)**
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy frontend
cd web
vercel --prod

# Configure environment variables in Vercel dashboard
```

#### **Railway/Heroku (Backend)**
```bash
# Railway deployment
npm i -g @railway/cli
railway login
railway init
railway up

# Configure environment variables in Railway dashboard
```

#### **Docker Deployment**
```dockerfile
# Dockerfile (backend)
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 8787
CMD ["npm", "start"]
```

#### **Database Migration**
```bash
# Production database setup
DATABASE_URL="postgresql://user:password@host:port/database"
npm run prisma:migrate deploy
npm run db:seed:prod
```

### **SSL/HTTPS Setup**
```nginx
# Nginx configuration
server {
    listen 443 ssl;
    server_name api.flupp.com;
    
    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;
    
    location / {
        proxy_pass http://localhost:8787;
        proxy_set_header Host $host;
        proxy_set_header X-Forwarded-Proto https;
    }
}
```

---

## 🔐 Environment Variables

### **Backend Environment Variables**

#### **Required for Development**
```bash
# .env.local
NODE_ENV=development
PORT=8787
DATABASE_URL="file:./dev.db"

# Stripe Configuration
STRIPE_SECRET_KEY=sk_test_51...
STRIPE_WEBHOOK_SECRET=whsec_...

# Security
JWT_SECRET=your-super-secret-jwt-key-min-32-chars
API_KEY=your-internal-api-key

# Application URLs
FRONTEND_URL=http://localhost:3000
```

#### **Required for Production**
```bash
# Additional production variables
NODE_ENV=production
DATABASE_URL="postgresql://user:password@host:port/database"
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_live_...

# Monitoring
LOG_LEVEL=info
SENTRY_DSN=https://your-sentry-dsn

# Security
ALLOWED_ORIGINS=https://yourdomain.com
TRUST_PROXY=true
```

### **Frontend Environment Variables**

#### **Required for Development**
```bash
# .env.local
NEXT_PUBLIC_API_BASE_URL=http://localhost:8787
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
NEXT_PUBLIC_APP_NAME=Flupp
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-nextauth-secret
```

#### **Required for Production**
```bash
# Production overrides
NODE_ENV=production
NEXT_PUBLIC_API_BASE_URL=https://api.yourdomain.com
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
NEXTAUTH_URL=https://yourdomain.com

# Analytics (optional)
NEXT_PUBLIC_GA_TRACKING_ID=G-...
NEXT_PUBLIC_SENTRY_DSN=https://...
```

### **Security Best Practices**

```bash
# Generate secure secrets
openssl rand -base64 32  # For JWT_SECRET
openssl rand -hex 32     # For API keys

# Environment validation
# Backend validates critical env vars on startup
# Frontend validates in config.ts

# Never commit secrets to version control
echo ".env.local" >> .gitignore
echo "*.env" >> .gitignore
```

---

## 🧪 Testing Guide

### **Backend Testing (18 Test Suites)**

The backend includes comprehensive test coverage with **18 test endpoints** covering all API functionality:

#### **Test Categories**

1. **Booking Management Tests** (6 tests)
   - Create booking with valid data
   - Validate required fields
   - Prevent duplicate bookings
   - Update booking status
   - Handle invalid booking IDs
   - Business logic validation

2. **Payment Processing Tests** (4 tests)
   - Create payment intent
   - Handle Stripe webhooks
   - Validate payment amounts
   - Error handling for failed payments

3. **Review System Tests** (3 tests)
   - Create review for completed booking
   - Prevent reviews for incomplete bookings
   - Rating validation (1-5 scale)

4. **Error Handling Tests** (3 tests)
   - 404 for undefined routes
   - Malformed JSON handling
   - Global error middleware

5. **Security Tests** (2 tests)
   - Rate limiting validation
   - Input sanitization

#### **Running Backend Tests**

```bash
# Navigate to backend directory
cd backend

# Run all tests
npm test

# Watch mode for development
npm run test:watch

# Coverage report
npm run test:coverage

# Run specific test suites
npm test bookings.test.js
npm test additional-endpoints.test.js

# Verbose output
npm test -- --verbose
```

#### **Test Configuration**

```javascript
// vitest.config.js
export default {
  test: {
    environment: 'node',
    setupFiles: ['./tests/setup.js'],
    coverage: {
      reporter: ['text', 'html'],
      exclude: ['node_modules/', 'tests/']
    }
  }
}
```

### **Frontend Testing**

#### **Component Testing**
```bash
cd web

# Jest unit tests
npm test

# Component testing with React Testing Library
npm run test:components

# Integration tests
npm run test:integration
```

#### **End-to-End Testing**
```bash
# Playwright E2E tests (if configured)
npm run test:e2e

# Specific test suites
npm run test:e2e:booking
npm run test:e2e:payment
```

### **API Testing with curl**

#### **Health Check**
```bash
curl -X GET http://localhost:8787/health
```

#### **Create Booking**
```bash
curl -X POST http://localhost:8787/api/bookings \
  -H "Content-Type: application/json" \
  -d '{
    "petName": "Buddy",
    "species": "dog",
    "serviceType": "grooming",
    "startAt": "2024-02-01T10:00:00Z",
    "endAt": "2024-02-01T12:00:00Z",
    "priceCents": 5000,
    "customerEmail": "test@example.com"
  }'
```

#### **Create Payment Intent**
```bash
curl -X POST http://localhost:8787/api/payments/create-intent \
  -H "Content-Type: application/json" \
  -d '{"bookingId": "booking_1704445800000_1"}'
```

### **Load Testing**

#### **Basic Load Test**
```bash
# Install artillery
npm install -g artillery

# Create artillery config
cat > load-test.yml << EOF
config:
  target: http://localhost:8787
  phases:
    - duration: 60
      arrivalRate: 10
scenarios:
  - name: API Load Test
    flow:
      - get:
          url: "/health"
      - post:
          url: "/api/bookings"
          json:
            petName: "LoadTest"
            species: "dog"
            serviceType: "grooming"
            startAt: "2024-02-01T10:00:00Z"
            endAt: "2024-02-01T12:00:00Z"
            priceCents: 5000
            customerEmail: "load@test.com"
EOF

# Run load test
artillery run load-test.yml
```

---

## 🔒 Security Features

### **Implemented Security Controls**

#### **Backend Security**
- **Helmet.js**: Comprehensive security headers
- **CORS**: Environment-specific origin restrictions
- **Rate Limiting**: Multi-tier limits (100/15min general, 10/15min payments)
- **Input Sanitization**: XSS prevention and data validation
- **JWT Authentication**: Secure token-based authentication
- **Error Sanitization**: No sensitive data in error responses
- **Business Logic Validation**: Prevent invalid operations

#### **Frontend Security**
- **Content Security Policy**: XSS and injection prevention
- **Input Validation**: Client-side and server-side validation
- **Safe Redirects**: No open redirect vulnerabilities
- **Error Boundaries**: Graceful error handling
- **Secure Storage**: Proper handling of sensitive data

#### **Payment Security**
- **PCI Compliance**: Stripe handles all card data
- **Webhook Verification**: Cryptographic signature validation
- **Amount Validation**: Server-side price verification
- **Idempotency**: Prevent duplicate payments

### **Security Headers**

```http
# Helmet.js automatically sets these headers:
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
X-XSS-Protection: 1; mode=block
Strict-Transport-Security: max-age=31536000; includeSubDomains
Content-Security-Policy: default-src 'self'; script-src 'self' js.stripe.com
X-DNS-Prefetch-Control: off
X-Download-Options: noopen
X-Permitted-Cross-Domain-Policies: none
Referrer-Policy: no-referrer
```

### **Authentication Flow**

```javascript
// JWT Token Structure
{
  "header": {
    "alg": "HS256",
    "typ": "JWT"
  },
  "payload": {
    "id": "user_123",
    "email": "user@example.com",
    "role": "customer",
    "iat": 1704445800,
    "exp": 1705050600,
    "iss": "flupp-api",
    "aud": "flupp-web"
  }
}
```

### **Security Checklist**

- ✅ **HTTPS Enforced**: All production traffic encrypted
- ✅ **Input Validation**: Comprehensive Zod schema validation
- ✅ **SQL Injection Prevention**: Prisma ORM with parameterized queries
- ✅ **XSS Prevention**: Input sanitization and CSP headers
- ✅ **CSRF Protection**: Same-site cookies and token validation
- ✅ **Rate Limiting**: DDoS protection and abuse prevention
- ✅ **Error Handling**: No sensitive data leakage
- ✅ **Authentication**: Secure JWT implementation
- ✅ **Authorization**: Role-based access control
- ✅ **Payment Security**: PCI-compliant Stripe integration

---

## 🔧 Troubleshooting

### **Common Development Issues**

#### **Backend Won't Start**

**Issue**: `Error: Cannot find module` or `Port already in use`
```bash
# Check if port is in use
lsof -i :8787

# Kill process using port
kill -9 <PID>

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# Check Node.js version
node --version  # Should be 18+
```

**Issue**: Database connection errors
```bash
# Reset database
npm run prisma:reset

# Regenerate Prisma client
npx prisma generate

# Check database file permissions
ls -la dev.db
```

#### **Frontend Build Issues**

**Issue**: `Module not found` or TypeScript errors
```bash
# Clear Next.js cache
rm -rf .next

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# Check TypeScript configuration
npx tsc --noEmit
```

**Issue**: Environment variable not defined
```bash
# Verify .env.local exists and is not committed to git
ls -la .env*

# Check environment variable loading in config.ts
console.log(process.env.NEXT_PUBLIC_API_BASE_URL)
```

#### **Payment Integration Issues**

**Issue**: Stripe payment fails
```bash
# Check Stripe keys are correct and not mixed (test/live)
# Verify webhook endpoint is accessible
# Check browser console for Stripe errors

# Test webhook locally with Stripe CLI
stripe listen --forward-to localhost:8787/api/payments/webhook
stripe trigger payment_intent.succeeded
```

**Issue**: CORS errors in browser
```bash
# Backend CORS configuration
# Ensure FRONTEND_URL matches exactly (no trailing slash)
FRONTEND_URL=http://localhost:3000

# Clear browser cache and cookies
# Check browser network tab for preflight requests
```

### **Production Deployment Issues**

#### **Replit Deployment**

**Issue**: Environment variables not loading
```bash
# Use Replit Secrets, not .env files
# Check casing and spelling exactly
# Verify no trailing spaces in values
```

**Issue**: Database not persisting
```bash
# Use absolute path for SQLite
DATABASE_URL="file:/home/runner/project/database.db"

# For PostgreSQL, ensure connection string includes SSL
DATABASE_URL="postgresql://user:pass@host:5432/db?sslmode=require"
```

**Issue**: External API calls failing
```bash
# Check Replit network restrictions
# Verify webhook URLs are accessible from external services
# Use Replit's public URLs, not internal ones
```

#### **Performance Issues**

**Issue**: Slow API responses
```bash
# Check database query performance
# Enable Prisma query logging
# Monitor memory usage: process.memoryUsage()
# Check for memory leaks with heap dumps
```

**Issue**: High memory usage
```bash
# Enable garbage collection logging
node --expose-gc --max-old-space-size=1024 index.js

# Monitor with built-in profiler
node --inspect index.js
```

### **Debugging Tools**

#### **Backend Debugging**
```bash
# Enable debug logging
DEBUG=* npm run dev

# Database query logging
DATABASE_LOGGING=true npm run dev

# Memory monitoring
NODE_OPTIONS="--max-old-space-size=1024" npm start
```

#### **Frontend Debugging**
```bash
# Next.js debug mode
DEBUG=* npm run dev

# TypeScript strict mode
NEXT_PUBLIC_TYPE_CHECK=strict npm run dev

# Bundle analyzer
npm run analyze
```

#### **Network Debugging**
```bash
# Test API endpoints
curl -v http://localhost:8787/health

# Check webhook delivery
stripe events list --limit 10

# Monitor request logs
tail -f access.log
```

### **Error Code Reference**

| Error Code | Cause | Solution |
|------------|--------|-----------|
| **ECONNREFUSED** | API server not running | Start backend server |
| **VALIDATION_ERROR** | Invalid request data | Check request schema |
| **UNAUTHORIZED** | Missing/invalid auth token | Check authentication |
| **RATE_LIMITED** | Too many requests | Implement backoff/retry |
| **PAYMENT_FAILED** | Stripe payment issue | Check Stripe dashboard |
| **DATABASE_ERROR** | DB connection/query issue | Check database status |

### **Support Resources**

- **📚 Documentation**: [Project Wiki](https://github.com/raboh001-rgb/flupp-project/wiki)
- **🐛 Bug Reports**: [GitHub Issues](https://github.com/raboh001-rgb/flupp-project/issues)
- **💬 Community**: [Discussions](https://github.com/raboh001-rgb/flupp-project/discussions)
- **🔔 Updates**: Watch repository for releases and updates

### **Getting Help**

1. **Check this troubleshooting section first**
2. **Search existing GitHub issues**
3. **Include relevant logs and error messages**
4. **Provide steps to reproduce the issue**
5. **Specify environment details (Node.js version, OS, etc.)**

---

## 📚 Additional Resources

### **API Testing Collection**
Import this Postman collection for comprehensive API testing:

```json
{
  "info": {
    "name": "Flupp API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "Health Check",
      "request": {
        "method": "GET",
        "header": [],
        "url": "{{baseUrl}}/health"
      }
    }
  ],
  "variable": [
    {
      "key": "baseUrl",
      "value": "https://flupp-project.raboh001.repl.co",
      "type": "string"
    }
  ]
}
```

### **Development Checklist**

#### **Before Starting Development**
- [ ] Node.js 18+ installed
- [ ] Environment variables configured
- [ ] Database connection working
- [ ] Stripe test keys configured
- [ ] All dependencies installed

#### **Before Deployment**
- [ ] All tests passing
- [ ] Environment variables set for production
- [ ] Database migrations applied
- [ ] SSL certificates configured
- [ ] Webhook endpoints accessible
- [ ] Error monitoring configured

#### **Production Monitoring**
- [ ] Health endpoint monitoring
- [ ] Error rate tracking
- [ ] Payment success rate monitoring
- [ ] Database performance metrics
- [ ] User experience analytics

---

## 🎉 Contributing

We welcome contributions to the Flupp platform! Please see our [Contributing Guide](CONTRIBUTING.md) for details on:

- **Code Standards**: TypeScript, ESLint, Prettier
- **Testing Requirements**: All new features need tests
- **Security Review**: Security implications reviewed
- **Performance Impact**: Performance testing for major changes

### **Development Workflow**
1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes with tests
4. Run the full test suite: `npm test`
5. Submit a pull request with detailed description

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **Stripe** for secure payment processing
- **Next.js** team for the excellent React framework
- **Prisma** for the developer-friendly database toolkit
- **Replit** for providing accessible cloud development environment

---

**Built with ❤️ for the pet-loving community**

*Last updated: January 2024*

