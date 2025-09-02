import { Router } from "express";
import { prisma } from "../services/prisma.js";
import { createBookingSchema, updateStatusSchema, idSchema } from "../services/validate.js";
import { asyncHandler, NotFoundError } from "../services/errors.js";

const r = Router();

r.post("/", asyncHandler(async (req, res) => {
  const data = createBookingSchema.parse(req.body);
  
  // Additional business logic validation
  const existingBooking = await prisma.booking.findFirst({
    where: {
      customerEmail: data.customerEmail,
      startAt: { lte: data.endAt },
      endAt: { gte: data.startAt },
      status: { not: "cancelled" }
    }
  });
  
  if (existingBooking) {
    return res.status(409).json({ 
      error: "You already have a booking during this time period",
      code: "BOOKING_CONFLICT"
    });
  }
  
  const created = await prisma.booking.create({ 
    data: {
      ...data,
      status: "pending",
      createdAt: new Date(),
      updatedAt: new Date(),
    }
  });
  
  res.status(201).json(created);
}));

r.get("/:id", asyncHandler(async (req, res) => {
  const id = idSchema.parse(req.params.id);
  const booking = await prisma.booking.findUnique({ 
    where: { id },
    select: {
      id: true,
      petName: true,
      species: true,
      serviceType: true,
      startAt: true,
      endAt: true,
      priceCents: true,
      currency: true,
      status: true,
      customerEmail: true,
      createdAt: true,
      updatedAt: true,
    }
  });
  
  if (!booking) {
    throw new NotFoundError("Booking");
  }
  
  res.json(booking);
}));

r.patch("/:id/status", asyncHandler(async (req, res) => {
  const id = idSchema.parse(req.params.id);
  const { status } = updateStatusSchema.parse(req.body);
  
  // Check if booking exists first
  const existing = await prisma.booking.findUnique({ where: { id } });
  if (!existing) {
    throw new NotFoundError("Booking");
  }
  
  // Business logic: prevent certain status transitions
  if (existing.status === "paid" && status === "pending") {
    return res.status(400).json({ 
      error: "Cannot change paid booking back to pending",
      code: "INVALID_STATUS_TRANSITION"
    });
  }
  
  const updated = await prisma.booking.update({
    where: { id },
    data: { 
      status, 
      updatedAt: new Date() 
    }
  });
  
  res.json(updated);
}));

export default r;

