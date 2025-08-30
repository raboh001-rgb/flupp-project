# Flupp MCP Server - Claude Code Integration

## MCP Server Configuration

To connect Claude Code to your Flupp MCP server, add this configuration to your Claude Code settings:

### MCP Server Entry
```json
{
  "mcpServers": {
    "flupp-orchestrator": {
      "command": "node",
      "args": ["C:\\Users\\hrabo\\servers\\src\\everything\\mcp-server\\dist\\stdio.js"],
      "cwd": "C:\\Users\\hrabo\\servers\\src\\everything\\mcp-server",
      "env": {
        "FLUPP_BASE_URL": "http://localhost:8787",
        "MCP_SERVER_NAME": "flupp-mcp-server"
      }
    }
  }
}
```

## Available Tools

Once connected, Claude will have access to these tools:

- **ping** - Liveness check for the MCP server
- **flupp_health** - Check Flupp backend health status
- **booking_create** - Create a new Flupp booking
- **payments_createIntent** - Create a Stripe PaymentIntent for a booking
- **webhook_validate** - Validate webhook payloads in dry-run mode (safe testing)
- **orchestrate_bookingFlow** - Full booking workflow orchestration

## Usage Example

Ask Claude to:
1. "Discover and list all available tools"
2. "Perform a dry-run booking orchestration for a cat grooming appointment"
3. "Create a payment intent and validate the webhook flow"

## Troubleshooting

- Ensure the MCP server is built: `npm run build` in the mcp-server directory
- Check that Node.js version is 18+ 
- Verify the Flupp backend is running on http://localhost:8787
- Tool names use underscores (booking_create) not dots to match MCP naming requirements

## Security Notes

- Default dry-run mode prevents actual card processing
- Webhook validation is simulation-only for safety
- Set `dryRun: false` only when ready for real transactions