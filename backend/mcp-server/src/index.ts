#!/usr/bin/env node

/**
 * Flupp MCP Server
 * Provides orchestration tools for the Flupp pet services booking system
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import { FluppClient, BookingRequest } from './flupp-client.js';
import { z } from 'zod';

const server = new Server(
  {
    name: 'flupp-mcp-server',
    version: '1.0.0',
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// Initialize Flupp client
const fluppBaseUrl = process.env.FLUPP_BASE_URL || 'http://localhost:8787';
const fluppClient = new FluppClient(fluppBaseUrl);

// Validation schemas
const BookingCreateSchema = z.object({
  petName: z.string().min(1),
  species: z.string().min(1),
  serviceType: z.string().min(1),
  startAt: z.string().datetime(),
  endAt: z.string().datetime(),
  priceCents: z.number().int().positive(),
  customerEmail: z.string().email(),
  currency: z.string().optional().default('usd')
});

const PaymentIntentSchema = z.object({
  bookingId: z.string().min(1)
});

const WebhookValidateSchema = z.object({
  type: z.string().optional().default('payment_intent.succeeded'),
  data: z.object({
    object: z.object({
      id: z.string().optional().default('pi_mock_payment_intent')
    })
  }).optional(),
  dryRun: z.boolean().optional().default(true)
});

const BookingFlowSchema = z.object({
  petName: z.string().min(1),
  species: z.string().min(1),
  serviceType: z.string().min(1),
  startAt: z.string().datetime(),
  endAt: z.string().datetime(),
  priceCents: z.number().int().positive(),
  customerEmail: z.string().email(),
  currency: z.string().optional().default('usd'),
  dryRun: z.boolean().optional().default(true)
});

// List available tools
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: 'ping',
        description: 'Liveness check for the MCP server',
        inputSchema: {
          type: 'object',
          properties: {},
        },
      },
      {
        name: 'flupp_health',
        description: 'Check Flupp backend health status',
        inputSchema: {
          type: 'object',
          properties: {},
        },
      },
      {
        name: 'booking_create',
        description: 'Create a new Flupp booking',
        inputSchema: {
          type: 'object',
          properties: {
            petName: { type: 'string', description: 'Name of the pet' },
            species: { type: 'string', description: 'Species of the pet (e.g., cat, dog)' },
            serviceType: { type: 'string', description: 'Type of service (e.g., grooming, walking)' },
            startAt: { type: 'string', format: 'date-time', description: 'Start time in ISO format' },
            endAt: { type: 'string', format: 'date-time', description: 'End time in ISO format' },
            priceCents: { type: 'integer', minimum: 1, description: 'Price in cents' },
            customerEmail: { type: 'string', format: 'email', description: 'Customer email address' },
            currency: { type: 'string', default: 'usd', description: 'Currency code' }
          },
          required: ['petName', 'species', 'serviceType', 'startAt', 'endAt', 'priceCents', 'customerEmail']
        },
      },
      {
        name: 'payments_createIntent',
        description: 'Create a Stripe PaymentIntent for a booking',
        inputSchema: {
          type: 'object',
          properties: {
            bookingId: { type: 'string', description: 'ID of the booking to create payment for' }
          },
          required: ['bookingId']
        },
      },
      {
        name: 'webhook_validate',
        description: 'Validate webhook payloads in dry-run mode (safe testing)',
        inputSchema: {
          type: 'object',
          properties: {
            type: { type: 'string', default: 'payment_intent.succeeded', description: 'Webhook event type' },
            data: {
              type: 'object',
              properties: {
                object: {
                  type: 'object',
                  properties: {
                    id: { type: 'string', default: 'pi_mock_payment_intent', description: 'Payment intent ID' }
                  }
                }
              }
            },
            dryRun: { type: 'boolean', default: true, description: 'Run in simulation mode (recommended)' }
          }
        },
      },
      {
        name: 'orchestrate_bookingFlow',
        description: 'Full booking workflow orchestration - creates booking, payment intent, and validates flow',
        inputSchema: {
          type: 'object',
          properties: {
            petName: { type: 'string', description: 'Name of the pet' },
            species: { type: 'string', description: 'Species of the pet (e.g., cat, dog)' },
            serviceType: { type: 'string', description: 'Type of service (e.g., grooming, walking)' },
            startAt: { type: 'string', format: 'date-time', description: 'Start time in ISO format' },
            endAt: { type: 'string', format: 'date-time', description: 'End time in ISO format' },
            priceCents: { type: 'integer', minimum: 1, description: 'Price in cents' },
            customerEmail: { type: 'string', format: 'email', description: 'Customer email address' },
            currency: { type: 'string', default: 'usd', description: 'Currency code' },
            dryRun: { type: 'boolean', default: true, description: 'Run in simulation mode (recommended)' }
          },
          required: ['petName', 'species', 'serviceType', 'startAt', 'endAt', 'priceCents', 'customerEmail']
        },
      },
    ],
  };
});

// Handle tool calls
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    switch (name) {
      case 'ping': {
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({
                status: 'alive',
                timestamp: new Date().toISOString(),
                server: 'flupp-mcp-server',
                version: '1.0.0'
              }, null, 2)
            }
          ]
        };
      }

      case 'flupp_health': {
        try {
          const healthCheck = await fluppClient.healthCheck();
          return {
            content: [
              {
                type: 'text',
                text: JSON.stringify({
                  flupp_backend: healthCheck,
                  backend_url: fluppBaseUrl,
                  status: 'healthy',
                  checked_at: new Date().toISOString()
                }, null, 2)
              }
            ]
          };
        } catch (error) {
          return {
            content: [
              {
                type: 'text',
                text: JSON.stringify({
                  flupp_backend: { ok: false },
                  backend_url: fluppBaseUrl,
                  status: 'unhealthy',
                  error: error instanceof Error ? error.message : 'Unknown error',
                  checked_at: new Date().toISOString()
                }, null, 2)
              }
            ]
          };
        }
      }

      case 'booking_create': {
        const validatedArgs = BookingCreateSchema.parse(args);
        const booking = await fluppClient.createBooking(validatedArgs as BookingRequest);
        
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({
                success: true,
                booking: booking,
                created_at: new Date().toISOString()
              }, null, 2)
            }
          ]
        };
      }

      case 'payments_createIntent': {
        const { bookingId } = PaymentIntentSchema.parse(args);
        const paymentIntent = await fluppClient.createPaymentIntent(bookingId);
        
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({
                success: true,
                payment_intent: paymentIntent,
                created_at: new Date().toISOString()
              }, null, 2)
            }
          ]
        };
      }

      case 'webhook_validate': {
        const validatedArgs = WebhookValidateSchema.parse(args);
        const webhookData = {
          type: validatedArgs.type,
          data: validatedArgs.data || {
            object: { id: 'pi_mock_payment_intent' }
          }
        };
        
        const result = await fluppClient.validateWebhook(webhookData, validatedArgs.dryRun);
        
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({
                success: true,
                webhook_validation: result,
                dry_run: validatedArgs.dryRun,
                validated_at: new Date().toISOString()
              }, null, 2)
            }
          ]
        };
      }

      case 'orchestrate_bookingFlow': {
        const validatedArgs = BookingFlowSchema.parse(args);
        const { dryRun, ...bookingData } = validatedArgs;
        
        // Step 1: Create booking
        const booking = await fluppClient.createBooking(bookingData as BookingRequest);
        
        // Step 2: Create payment intent
        const paymentIntent = await fluppClient.createPaymentIntent(booking.id);
        
        // Step 3: Validate webhook (dry run)
        const webhookData = {
          type: 'payment_intent.succeeded',
          data: {
            object: { id: paymentIntent.id }
          }
        };
        const webhookValidation = await fluppClient.validateWebhook(webhookData, dryRun);
        
        // Step 4: If not dry run, update booking status
        let statusUpdate = null;
        if (!dryRun) {
          statusUpdate = await fluppClient.updateBookingStatus(booking.id, 'confirmed');
        }
        
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({
                success: true,
                orchestration_complete: true,
                dry_run: dryRun,
                steps: {
                  booking_created: booking,
                  payment_intent_created: paymentIntent,
                  webhook_validated: webhookValidation,
                  status_updated: statusUpdate
                },
                orchestrated_at: new Date().toISOString()
              }, null, 2)
            }
          ]
        };
      }

      default:
        throw new Error(`Unknown tool: ${name}`);
    }
  } catch (error) {
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify({
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error',
            tool: name,
            timestamp: new Date().toISOString()
          }, null, 2)
        }
      ],
      isError: true
    };
  }
});

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('Flupp MCP Server running on stdio');
}

main().catch((error) => {
  console.error('Server error:', error);
  process.exit(1);
});