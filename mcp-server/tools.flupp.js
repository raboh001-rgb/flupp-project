// ---- Tool definitions ----
export const tools = [
    {
        name: "booking.create",
        description: "Create a Flupp booking",
        inputSchema: {
            type: "object",
            properties: {
                petName: { type: "string" },
                species: { type: "string" },
                serviceType: { type: "string" },
                startAt: { type: "string" },
                endAt: { type: "string" },
                priceCents: { type: "number" },
                customerEmail: { type: "string" },
                currency: { type: "string" }
            },
            required: [
                "petName",
                "species",
                "serviceType",
                "startAt",
                "endAt",
                "priceCents",
                "customerEmail"
            ]
        },
        handler: async (input, { baseUrl }) => {
            const res = await fetch(`${baseUrl}/api/bookings`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(input)
            });
            if (!res.ok)
                throw new Error(`booking.create failed: ${res.status}`);
            return await res.json();
        }
    },
    {
        name: "payments.createIntent",
        description: "Create a Stripe PaymentIntent for a booking",
        inputSchema: {
            type: "object",
            properties: {
                bookingId: { type: "string" }
            },
            required: ["bookingId"]
        },
        handler: async (input, { baseUrl }) => {
            const res = await fetch(`${baseUrl}/api/payments/create-intent`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(input)
            });
            if (!res.ok)
                throw new Error(`payments.createIntent failed: ${res.status}`);
            return await res.json();
        }
    }
];
// ---- Optional helpers (not strictly needed for everything.ts, but handy if you call them directly) ----
export const listTools = () => tools.map((t) => ({
    name: t.name,
    description: t.description,
    inputSchema: t.inputSchema
}));
export const callTool = async (name, input) => {
    const t = tools.find((tt) => tt.name === name);
    if (!t)
        throw new Error(`Unknown tool: ${name}`);
    return t.handler(input);
};
// ---- New: direct handlers map for everything.ts to consume ----
export const handlers = Object.fromEntries(tools.map((t) => [t.name, t.handler]));
