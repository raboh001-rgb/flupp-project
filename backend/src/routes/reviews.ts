import { Router } from "express";
import { prisma } from "../services/prisma.js";
import { createReviewSchema } from "../services/validate.js";

const r = Router();

r.post("/", async (req, res) => {
  try {
    const data = createReviewSchema.parse(req.body);
    const exists = await prisma.booking.findUnique({ where: { id: data.bookingId } });
    if (!exists) return res.status(404).json({ error: "Booking not found" });
    const rv = await prisma.review.create({ data });
    res.json(rv);
  } catch (e: any) {
    res.status(400).json({ error: e.message });
  }
});

r.get("/for-booking/:bookingId", async (req, res) => {
  const list = await prisma.review.findMany({
    where: { bookingId: req.params.bookingId },
    orderBy: { createdAt: "desc" }
  });
  res.json(list);
});

export default r;

