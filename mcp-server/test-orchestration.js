#!/usr/bin/env node

// Test script for Flupp MCP server orchestration workflow
import { createServer } from "./dist/everything.js";

async function testOrchestration() {
  console.log("🧪 Testing Flupp MCP Server Orchestration...\n");
  
  const { server, cleanup } = createServer();
  
  try {
    // Test tool discovery
    const toolsResponse = await server.call_tool({
      name: "ping",
      arguments: {}
    });
    console.log("✅ Ping test:", JSON.stringify(toolsResponse, null, 2));

    // Test orchestration workflow (dry run)
    const orchestrationResponse = await server.call_tool({
      name: "orchestrate.bookingFlow", 
      arguments: {
        petName: "Fluffy",
        species: "cat",
        serviceType: "grooming",
        startAt: "2024-12-01T10:00:00Z",
        endAt: "2024-12-01T11:00:00Z", 
        priceCents: 5000,
        customerEmail: "test@example.com",
        dryRun: true
      }
    });
    console.log("\n✅ Orchestration test:", JSON.stringify(orchestrationResponse, null, 2));

    // Test webhook validation
    const webhookResponse = await server.call_tool({
      name: "webhook.validate",
      arguments: {
        webhookType: "stripe",
        payload: { type: "payment_intent.succeeded", data: { object: { id: "pi_test" } } },
        signature: "t=123456789,v1=test_signature",
        dryRun: true
      }
    });
    console.log("\n✅ Webhook validation test:", JSON.stringify(webhookResponse, null, 2));

    console.log("\n🎉 All tests completed successfully!");
    console.log("\n📋 Available tools for Claude to use:");
    console.log("• ping - Liveness check");
    console.log("• flupp_health - Check Flupp backend health");  
    console.log("• booking.create - Create a Flupp booking");
    console.log("• payments.createIntent - Create a Stripe PaymentIntent");
    console.log("• webhook.validate - Validate webhook payloads (dry-run)");
    console.log("• orchestrate.bookingFlow - Complete booking orchestration workflow");

  } catch (error) {
    console.error("❌ Test failed:", error);
  } finally {
    await cleanup();
  }
}

// Run if this script is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  testOrchestration();
}