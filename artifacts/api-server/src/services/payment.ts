import type { Booking } from "@workspace/db/schema";

export async function createPaymentSession(booking: Booking) {
  const appUrl = process.env["PUBLIC_APP_URL"] || "http://localhost:5173";
  const provider = process.env["PAYMENT_PROVIDER"] || "demo";

  if (provider === "demo") {
    return {
      provider,
      clientSecret: `demo_${booking.bookingReference}`,
      paymentUrl: `${appUrl}/pricing?booking=${booking.bookingReference}&payment=demo`,
    };
  }

  if (provider === "stripe" && process.env["STRIPE_SECRET_KEY"]) {
    return {
      provider,
      clientSecret: null,
      paymentUrl: `${appUrl}/pricing?booking=${booking.bookingReference}&payment=stripe`,
    };
  }

  if (provider === "mollie" && process.env["MOLLIE_API_KEY"]) {
    return {
      provider,
      clientSecret: null,
      paymentUrl: `${appUrl}/pricing?booking=${booking.bookingReference}&payment=mollie`,
    };
  }

  return {
    provider: "manual",
    clientSecret: null,
    paymentUrl: `${appUrl}/pricing?booking=${booking.bookingReference}&payment=manual`,
  };
}
