# Flupp MCP Server - Setup Complete

## MCP Server Configuration

Your Flupp MCP server is now set up and ready to use. Add this configuration to your Claude Code settings:

### MCP Server Entry
```json
{
  "mcpServers": {
    "flupp-orchestrator": {
      "command": "node",
      "args": ["C:\\Users\\hrabo\\servers\\src\\everything\\backend\\mcp-server\\dist\\stdio.js"],
      "cwd": "C:\\Users\\hrabo\\servers\\src\\everything\\backend\\mcp-server",
      "env": {
        "FLUPP_BASE_URL": "http://localhost:8787",
        "MCP_SERVER_NAME": "flupp-mcp-server"
      }
    }
  }
}
```

## Available Tools

The MCP server exposes these 6 tools as requested:

1. **ping** - Liveness check for the MCP server
2. **flupp_health** - Check Flupp backend health status  
3. **booking_create** - Create a new Flupp booking
4. **payments_createIntent** - Create a Stripe PaymentIntent for a booking
5. **webhook_validate** - Validate webhook payloads in dry-run mode (safe testing)
6. **orchestrate_bookingFlow** - Full booking workflow orchestration

## Project Structure

```
backend/
├── flupp/                    # Existing Express API (running on port 8787)
│   ├── app.js               # Main Express application
│   ├── index.js             # Server entry point
│   └── package.json         # API dependencies
└── mcp-server/              # New MCP Server
    ├── src/
    │   ├── index.ts         # Main MCP server logic
    │   ├── stdio.ts         # STDIO entry point
    │   └── flupp-client.ts  # Client for Flupp API integration
    ├── dist/                # Built JavaScript files
    ├── package.json         # MCP server dependencies
    └── tsconfig.json        # TypeScript configuration
```

## Usage Commands

### Start Flupp Backend
```bash
cd backend/flupp && npm start
```

### Build MCP Server
```bash
cd backend/mcp-server && npm run build
```

### Test MCP Server
```bash
cd backend/mcp-server && npm start
```

## Integration Notes

- The MCP server integrates with your existing Flupp Express API
- All tools connect to `http://localhost:8787` (configurable via `FLUPP_BASE_URL`)
- Default operations run in `dryRun: true` mode for safety
- Set `dryRun: false` only when ready for real transactions

## Testing Example

Once connected to Claude Code, you can test with:
1. "Use the ping tool to check MCP server status"
2. "Check flupp_health to verify backend connectivity"  
3. "Create a test booking for a cat grooming appointment"
4. "Run orchestrate_bookingFlow for a complete booking simulation"