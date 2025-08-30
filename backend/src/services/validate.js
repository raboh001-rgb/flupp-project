import { z } from "zod";
export const createBookingSchema = z
    .object({
    petName: z.string().min(1),
    species: z.string().min(1),
    serviceType: z.string().min(1),
    startAt: z.coerce.date(),
    endAt: z.coerce.date(),
    priceCents: z.coerce.number().int().positive(),
    customerEmail: z.string().email(),
    currency: z
        .string()
        .length(3)
        .transform((s) => s.toUpperCase())
        .default("GBP")
})
    .refine((d) => d.endAt > d.startAt, {
    message: "endAt must be after startAt",
    path: ["endAt"]
});
export const updateStatusSchema = z.object({
    status: z.enum(["pending", "paid", "cancelled"])
});
export const createReviewSchema = z.object({
    bookingId: z.string().min(1),
    rating: z.coerce.number().int().min(1).max(5),
    comment: z.string().min(1)
});
