# Flupp - Pet Services Booking Platform

A comprehensive pet services booking platform with integrated payment processing and MCP (Model Context Protocol) server for AI orchestration.

## 🐾 Features

### Backend API
- **Express.js** API with TypeScript support
- **Stripe** payment processing integration
- **Prisma ORM** with SQLite database  
- **Zod** validation and comprehensive error handling
- RESTful endpoints for bookings, payments, and reviews
- Comprehensive test suite with Vitest

### MCP Server Integration
- **6 orchestration tools** for AI integration:
  - `ping` - Server liveness check
  - `flupp_health` - Backend health status
  - `booking_create` - Create new bookings
  - `payments_createIntent` - Create payment intents
  - `webhook_validate` - Validate webhooks (dry-run safe)
  - `orchestrate_bookingFlow` - Full booking workflow automation
- **Claude Code** integration ready
- TypeScript implementation with comprehensive validation

### Frontend (Next.js)
- Modern React components with TypeScript
- Integrated Stripe payment forms
- Responsive booking interface
- Server-side rendering support

## 🛡️ Security Features

- ✅ Comprehensive `.gitignore` excluding all sensitive files
- ✅ Environment variables for all secrets and configurations
- ✅ Template `.env.example` files for easy setup
- ✅ No hardcoded secrets in source code
- ✅ Security documentation and guidelines
- ✅ Safe development defaults (test keys, dry-run modes)

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn

### 1. Clone and Install
```bash
git clone <your-repo-url>
cd flupp
npm install
```

### 2. Environment Setup

**Backend:**
```bash
cp backend/.env.example backend/.env.local
# Edit backend/.env.local with your actual values
```

**Frontend:**
```bash  
cp web/.env.example web/.env.local
# Edit web/.env.local with your actual values
```

**MCP Server:**
```bash
cp backend/mcp-server/.env.example backend/mcp-server/.env
# Edit backend/mcp-server/.env if needed
```

### 3. Start Development

**Backend API:**
```bash
cd backend/flupp
npm install
npm start
# API running on http://localhost:8787
```

**Frontend:**
```bash
cd web
npm install
npm run dev
# Frontend running on http://localhost:3000
```

**MCP Server:**
```bash
cd backend/mcp-server
npm install
npm run build
npm start
# MCP server ready for Claude Code integration
```

## 🔌 Claude Code Integration

Add this to your Claude Code settings:

```json
{
  "mcpServers": {
    "flupp-orchestrator": {
      "command": "node",
      "args": ["path/to/backend/mcp-server/dist/stdio.js"],
      "cwd": "path/to/backend/mcp-server",
      "env": {
        "FLUPP_BASE_URL": "http://localhost:8787",
        "MCP_SERVER_NAME": "flupp-mcp-server"
      }
    }
  }
}
```

## 📚 API Documentation

### Core Endpoints

- `GET /health` - Health check
- `POST /api/bookings` - Create booking
- `GET /api/bookings/:id` - Get booking details  
- `PATCH /api/bookings/:id/status` - Update booking status
- `POST /api/payments/create-intent` - Create payment intent
- `POST /api/payments/webhook` - Stripe webhook handler
- `POST /api/reviews` - Create review

### MCP Tools

All tools support both development and production modes with proper error handling and validation.

## 🧪 Testing

```bash
# Backend tests
cd backend/flupp
npm test

# MCP Server integration test
cd backend/mcp-server  
npm run build
node test-tools.js
```

## 📁 Project Structure

```
flupp/
├── backend/
│   ├── flupp/           # Express API server
│   ├── mcp-server/      # MCP orchestration server  
│   ├── src/             # Alternative TypeScript backend
│   └── prisma/          # Database schema
├── web/                 # Next.js frontend
├── ops/                 # Operations and deployment
├── .gitignore          # Comprehensive security exclusions
├── SECURITY.md         # Security guidelines
└── README.md           # This file
```

## 🔒 Security Guidelines

- **Never commit secrets** - Use environment variables
- **Rotate keys regularly** - Especially for production
- **Use test keys** in development
- **Review SECURITY.md** for complete guidelines
- **Enable dry-run mode** for payment testing

## 🚀 Deployment

### Production Checklist

- [ ] Replace all test keys with production keys
- [ ] Set up proper secret management
- [ ] Enable HTTPS for all services  
- [ ] Configure proper CORS policies
- [ ] Implement rate limiting
- [ ] Add security headers
- [ ] Set up monitoring and alerts

### Environment Variables

Required for production:
- `STRIPE_SECRET_KEY` (production key)
- `STRIPE_WEBHOOK_SECRET` (production webhook)
- `DATABASE_URL` (production database)
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` (production publishable key)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Follow security guidelines
4. Add tests for new features
5. Ensure all tests pass
6. Submit a pull request

## 📄 License

[Add your license here]

## 🆘 Support

For issues and questions:
- Check the SECURITY.md file for security-related questions
- Review API documentation for integration help
- Check test files for usage examples

---

🤖 *This project includes AI orchestration capabilities via MCP server integration with Claude Code*

