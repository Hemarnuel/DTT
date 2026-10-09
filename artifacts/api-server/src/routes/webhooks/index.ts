import { Router, type IRouter, type Request, type Response, type NextFunction } from "express";
import { db } from "@workspace/db";
import { bookingsTable, paymentsTable, invoicesTable } from "@workspace/db/schema";
import { eq } from "drizzle-orm";
import { calculateVat, createInvoiceText } from "../../services/invoice";
import { sendBookingEmails } from "../../services/email";

const router: IRouter = Router();

function generateInvoiceNumber(): string {
  const year = new Date().getFullYear();
  const timestamp = Date.now().toString().slice(-8);
  return `INV-${year}-${timestamp}`;
}

router.post("/v1/webhooks/payment-confirm", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {
      provider,
      event_type,
      payment_id,
      booking_reference,
      amount,
      currency,
      status,
      metadata,
    } = req.body;

    const reference = typeof booking_reference === "string" ? booking_reference : "";
    const paymentId = typeof payment_id === "string" ? payment_id : "";
    const providerName = typeof provider === "string" ? provider : "";

    if (!reference || !paymentId || !providerName) {
      return res.status(400).json({
        error: "ValidationError",
        message: "Missing required fields",
      });
    }

    const [booking] = await db
      .select()
      .from(bookingsTable)
      .where(eq(bookingsTable.bookingReference, reference))
      .limit(1);

    if (!booking) {
      return res.status(404).json({
        error: "NotFound",
        message: "Booking not found",
      });
    }

    if (status === "paid" || status === "succeeded" || status === "paid_out") {
      await db
        .update(bookingsTable)
        .set({
          status: "paid",
          paymentStatus: "paid",
          confirmedAt: new Date(),
          stripePaymentIntentId: provider === "stripe" ? payment_id : booking.stripePaymentIntentId,
          molliePaymentId: provider === "mollie" ? payment_id : booking.molliePaymentId,
          updatedAt: new Date(),
        })
        .where(eq(bookingsTable.id, booking.id));

      await db.insert(paymentsTable).values({
        bookingId: booking.id,
        provider,
        providerPaymentId: payment_id,
        amount: String(amount || booking.totalAmount),
        currency: currency || booking.currency,
        status: "paid",
        metadata: JSON.stringify(metadata || {}),
        paidAt: new Date(),
      });

      const { grossAmount, netAmount, vatAmount, vatRate } = calculateVat(booking.totalAmount);
      const invoiceNumber = generateInvoiceNumber();
      const invoiceText = createInvoiceText({ ...booking, status: "paid", paymentStatus: "paid", confirmedAt: new Date() }, invoiceNumber);
      const existingInvoice = await db
        .select()
        .from(invoicesTable)
        .where(eq(invoicesTable.bookingId, booking.id))
        .limit(1);

      if (existingInvoice.length === 0) {
        await db.insert(invoicesTable).values({
          bookingId: booking.id,
          invoiceNumber,
          netAmount: String(netAmount),
          vatAmount: String(vatAmount),
          grossAmount: String(grossAmount),
          currency: booking.currency,
          vatRate: String(vatRate),
          vatNumber: "NL888888888B01",
          pdfData: invoiceText,
        });
      }

      await sendBookingEmails({ ...booking, status: "paid", paymentStatus: "paid", confirmedAt: new Date() }, invoiceNumber, invoiceText);
    }

    return res.json({
      received: true,
      booking_reference: reference,
    });
  } catch (error) {
    retrun next(error);
  }
});

export default router;
