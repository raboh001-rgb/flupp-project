import { Router } from "express";
import { prisma } from "../services/prisma.js";
import { createBookingSchema, updateStatusSchema } from "../services/validate.js";
const r = Router();
r.post("/", async (req, res) => {
    try {
        const data = createBookingSchema.parse(req.body);
        const created = await prisma.booking.create({ data });
        res.json(created);
    }
    catch (e) {
        res.status(400).json({ error: e.message });
    }
});
r.get("/:id", async (req, res) => {
    const b = await prisma.booking.findUnique({ where: { id: req.params.id } });
    if (!b)
        return res.status(404).json({ error: "Not found" });
    res.json(b);
});
r.patch("/:id/status", async (req, res) => {
    try {
        const { status } = updateStatusSchema.parse(req.body);
        const b = await prisma.booking.update({
            where: { id: req.params.id },
            data: { status }
        });
        res.json(b);
    }
    catch (e) {
        res.status(400).json({ error: e.message });
    }
});
export default r;
