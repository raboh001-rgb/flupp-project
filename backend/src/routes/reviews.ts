import { Router } from "express";
import { prisma } from "../services/prisma.js";
import { createReviewSchema, idSchema } from "../services/validate.js";
import { asyncHandler, NotFoundError, ValidationError } from "../services/errors.js";

const r = Router();

r.post("/", asyncHandler(async (req, res) => {
  const data = createReviewSchema.parse(req.body);
  
  const booking = await prisma.booking.findUnique({ 
    where: { id: data.bookingId },
    select: { id: true, status: true, customerEmail: true }
  });
  
  if (!booking) {
    throw new NotFoundError("Booking");
  }

  // Only allow reviews for completed (paid) bookings
  if (booking.status !== "paid") {
    throw new ValidationError("Reviews can only be created for completed bookings");
  }

  // Check if review already exists for this booking
  const existingReview = await prisma.review.findFirst({
    where: { bookingId: data.bookingId }
  });

  if (existingReview) {
    throw new ValidationError("A review already exists for this booking");
  }

  const review = await prisma.review.create({ 
    data: {
      ...data,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
  });
  
  res.status(201).json(review);
}));

r.get("/for-booking/:bookingId", asyncHandler(async (req, res) => {
  const bookingId = idSchema.parse(req.params.bookingId);
  
  const reviews = await prisma.review.findMany({
    where: { bookingId },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      rating: true,
      comment: true,
      createdAt: true,
      updatedAt: true,
    }
  });
  
  res.json(reviews);
}));

export default r;

