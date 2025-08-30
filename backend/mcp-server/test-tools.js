#!/usr/bin/env node

/**
 * Simple test script for Flupp MCP Server tools
 * This demonstrates how the tools work via direct API calls
 */

import { FluppClient } from './dist/flupp-client.js';

const client = new FluppClient('http://localhost:8787');

async function testTools() {
  console.log('🧪 Testing Flupp MCP Server Integration\n');
  
  try {
    // Test 1: Health check
    console.log('1. Testing Flupp backend health...');
    const health = await client.healthCheck();
    console.log('✅ Health check:', health);
    
    // Test 2: Create booking
    console.log('\n2. Creating test booking...');
    const booking = await client.createBooking({
      petName: 'Whiskers',
      species: 'cat',
      serviceType: 'grooming',
      startAt: '2025-09-15T14:00:00Z',
      endAt: '2025-09-15T15:00:00Z',
      priceCents: 7500,
      customerEmail: 'pet.owner@example.com',
      currency: 'usd'
    });
    console.log('✅ Booking created:', booking);
    
    // Test 3: Create payment intent
    console.log('\n3. Creating payment intent...');
    const paymentIntent = await client.createPaymentIntent(booking.id);
    console.log('✅ Payment intent:', paymentIntent);
    
    // Test 4: Validate webhook (dry run)
    console.log('\n4. Validating webhook (dry run)...');
    const webhookValidation = await client.validateWebhook({
      type: 'payment_intent.succeeded',
      data: {
        object: { id: paymentIntent.id }
      }
    }, true);
    console.log('✅ Webhook validation:', webhookValidation);
    
    console.log('\n🎉 All tests passed! MCP server is ready for Claude Code integration.');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    process.exit(1);
  }
}

testTools();