# Flupp Backend - Replit Deployment Guide

## Quick Start

1. **Import the GitHub repository** into Replit:
   - Use: `https://github.com/raboh001-rgb/flupp-project`

2. **Run the server**:
   ```bash
   chmod +x start.sh && ./start.sh
   ```

   Or manually:
   ```bash
   cd backend/flupp
   npm install
   npm start
   ```

## Key Changes Made for Replit Compatibility

### ✅ Server Configuration Fixed

**Problem**: Server was binding to `localhost` only, making it inaccessible externally.

**Solution**: Updated `backend/flupp/index.js` to:
- Bind to `'0.0.0.0'` instead of `localhost`
- Use environment variables for HOST and PORT
- Display Replit URL in console output

### ✅ CORS Configuration Updated

**Problem**: CORS was too restrictive for external access.

**Solution**: Updated `backend/flupp/app.js` with:
```javascript
app.use(cors({
  origin: true, // Allow all origins for development/Replit
  credentials: true,
  methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}))
```

### ✅ Replit Configuration Files Added

- `.replit` - Main Replit configuration
- `replit.nix` - Environment dependencies
- `start.sh` - Startup script

## Accessing Your API

Once running, your API will be accessible at:

### External URL
```
https://your-repl-name-username.repl.co
```

### API Endpoints
- **Health Check**: `https://your-repl-name-username.repl.co/health`
- **Create Booking**: `https://your-repl-name-username.repl.co/api/bookings`
- **Get Booking**: `https://your-repl-name-username.repl.co/api/bookings/:id`
- **Update Status**: `https://your-repl-name-username.repl.co/api/bookings/:id/status`
- **Payment Intent**: `https://your-repl-name-username.repl.co/api/payments/create-intent`
- **Webhook**: `https://your-repl-name-username.repl.co/api/payments/webhook`
- **Reviews**: `https://your-repl-name-username.repl.co/api/reviews`

## Testing the API

### 1. Health Check
```bash
curl https://your-repl-url.repl.co/health
```
Expected: `{"ok": true}`

### 2. Create a Booking
```bash
curl -X POST https://your-repl-url.repl.co/api/bookings \
  -H "Content-Type: application/json" \
  -d '{
    "petName": "Fluffy",
    "species": "cat",
    "serviceType": "grooming",
    "startAt": "2024-12-31T10:00:00.000Z",
    "endAt": "2024-12-31T11:00:00.000Z",
    "priceCents": 5000,
    "customerEmail": "owner@example.com",
    "currency": "usd"
  }'
```

### 3. Get a Booking
```bash
curl https://your-repl-url.repl.co/api/bookings/BOOKING_ID
```

## Environment Variables in Replit

Set these in Replit's "Secrets" tab:

- `PORT`: `8787` (default)
- `HOST`: `0.0.0.0` (for external access)
- `NODE_ENV`: `production`

## Troubleshooting

### Server Not Accessible Externally
1. ✅ Server now binds to `0.0.0.0` instead of `localhost`
2. ✅ CORS allows all origins
3. ✅ Port configuration is correct

### Console Output
When working correctly, you should see:
```
🚀 Flupp backend running on http://localhost:8787
🌐 External access: http://0.0.0.0:8787
📋 Health check: http://localhost:8787/health
🐾 API ready at http://localhost:8787/api/bookings
🔗 Replit URL: https://your-repl-slug-username.repl.co
```

### Port Issues
- Replit automatically maps port 8787 to external access
- The `.replit` config handles port forwarding
- Use the Replit-provided URL for external access

## Project Structure

```
flupp-project/
├── .replit              # Replit configuration
├── replit.nix          # Environment dependencies
├── start.sh            # Startup script
└── backend/flupp/      # Express server
    ├── app.js          # Express app (✅ CORS fixed)
    ├── index.js        # Server startup (✅ binding fixed)
    └── package.json    # Dependencies
```

## Next Steps

1. Import this repository into Replit
2. Run the startup script or use `npm start`
3. Test the health endpoint
4. Start making API calls to your endpoints
5. The server is ready for integration with frontend applications

Your Flupp backend is now fully configured for external access in Replit! 🚀