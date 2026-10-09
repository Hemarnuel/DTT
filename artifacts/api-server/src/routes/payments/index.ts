import { Router, type IRouter, type Request, type Response, type NextFunction } from "express";
import { db } from "@workspace/db";
import { bookingsTable } from "@workspace/db/schema";
import { eq } from "drizzle-orm";

const router: IRouter = Router();

router.post("/v1/payments/demo-confirm", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const booking_reference = req.body.booking_reference as string | undefined;

    if (!booking_reference) {
      return res.status(400).json({ error: "ValidationError", message: "booking_reference is required" });
    }

    const [booking] = await db
      .select()
      .from(bookingsTable)
      .where(eq(bookingsTable.bookingReference, booking_reference))
      .limit(1);

    if (!booking) {
      return res.status(404).json({ error: "NotFound", message: "Booking not found" });
    }

    const paymentId = `demo_${booking_reference}_${Date.now()}`;
    const webhookUrl = `${req.protocol}://${req.get("host")}/api/v1/webhooks/payment-confirm`;

    const httpResponse = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        provider: "demo",
        event_type: "payment.succeeded",
        payment_id: paymentId,
        booking_reference,
        amount: Number(booking.totalAmount),
        currency: booking.currency,
        status: "paid",
        metadata: { mode: "demo" },
      }),
    });

    if (!httpResponse.ok) {
      return res.status(500).json({ error: "PaymentError", message: "Failed to confirm demo payment" });
    }

    return res.json({ booking_reference, payment_id: paymentId, status: "paid" });
  } catch (err) {
    retrun next(err);
  }
});

export default router;
