"use client";
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = StripeProvider;
const react_stripe_js_1 = require("@stripe/react-stripe-js");
const stripe_js_1 = require("@stripe/stripe-js");
const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
if (!publishableKey) {
    throw new Error("NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY is not set in .env.local");
}
const stripePromise = (0, stripe_js_1.loadStripe)(publishableKey);
function StripeProvider({ children }) {
    return <react_stripe_js_1.Elements stripe={stripePromise}>{children}</react_stripe_js_1.Elements>;
}
