import { z } from "zod";

// Base validation schemas
export const idSchema = z.string().min(1, "ID is required").max(50);

export const paginationSchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(20),
});

export const sortSchema = z.object({
  sortBy: z.enum(["createdAt", "updatedAt", "name", "price"]).default("createdAt"),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
});

export const createBookingSchema = z
  .object({
    petName: z.string().min(1, "Pet name is required").max(50, "Pet name too long"),
    species: z.enum(["dog", "cat", "rabbit", "bird", "other"], {
      errorMap: () => ({ message: "Invalid species" })
    }),
    serviceType: z.enum(["boarding", "grooming", "daycare", "training", "walking"], {
      errorMap: () => ({ message: "Invalid service type" })
    }),
    startAt: z.coerce.date().min(new Date(), "Start date must be in the future"),
    endAt: z.coerce.date(),
    priceCents: z.coerce.number().int().min(50, "Minimum price is 50 pence").max(100000000, "Price too high"),
    customerEmail: z.string().email("Invalid email format").max(100, "Email too long"),
    currency: z
      .string()
      .length(3, "Currency must be 3 characters")
      .transform((s) => s.toUpperCase())
      .default("GBP")
      .refine((val) => ["GBP", "USD", "EUR"].includes(val), "Unsupported currency")
  })
  .refine((d) => d.endAt > d.startAt, {
    message: "End date must be after start date",
    path: ["endAt"]
  })
  .refine((d) => {
    const maxBookingDays = 365; // 1 year maximum
    const diffTime = d.endAt.getTime() - d.startAt.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= maxBookingDays;
  }, {
    message: "Booking duration cannot exceed 1 year",
    path: ["endAt"]
  });

export const updateStatusSchema = z.object({
  status: z.enum(["pending", "paid", "cancelled"])
});

export const createReviewSchema = z.object({
  bookingId: idSchema,
  rating: z.coerce.number().int().min(1, "Rating must be at least 1").max(5, "Rating cannot exceed 5"),
  comment: z.string().min(5, "Comment must be at least 5 characters").max(1000, "Comment too long")
});

// Payment validation
export const createPaymentIntentSchema = z.object({
  bookingId: idSchema,
});

