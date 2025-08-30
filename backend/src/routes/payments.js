import { Router } from "express";
import Stripe from "stripe";
import { prisma } from "../services/prisma.js";
const r = Router();
const secret = process.env.STRIPE_SECRET_KEY;
if (!secret) {
    throw new Error("Missing STRIPE_SECRET_KEY in environment");
}
const stripe = new Stripe(secret, { apiVersion: "2024-06-20" });
r.post("/create-intent", async (req, res) => {
    const { bookingId } = req.body ?? {};
    if (!bookingId)
        return res.status(400).json({ error: "bookingId is required" });
    const booking = await prisma.booking.findUnique({ where: { id: bookingId } });
    if (!booking)
        return res.status(404).json({ error: "Booking not found" });
    const intent = await stripe.paymentIntents.create({
        amount: booking.priceCents,
        currency: booking.currency.toLowerCase(),
        metadata: { bookingId }
    });
    await prisma.booking.update({
        where: { id: bookingId },
        data: { paymentIntentId: intent.id }
    });
    res.json({ clientSecret: intent.client_secret });
});
export default r;
