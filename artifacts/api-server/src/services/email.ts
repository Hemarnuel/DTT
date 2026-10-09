import type { Booking } from "@workspace/db/schema";

export type EmailMessage = {
  to: string;
  subject: string;
  text: string;
  attachments?: Array<{ filename: string; content: string }>;
};

const adminRecipient = process.env["BOOKING_ADMIN_EMAIL"] || "orders@dutchtaxitransfers.nl";
const phone = "+31 020 3086885";

export async function sendEmail(message: EmailMessage) {
  console.info({ to: message.to, subject: message.subject }, "Email queued");
}

export async function sendBookingEmails(booking: Booking, invoiceNumber: string, invoiceText: string) {
  await sendEmail(createOwnerNotificationEmail(booking));
  await sendEmail(createCustomerConfirmationEmail(booking, invoiceNumber, invoiceText));
}

export function createOwnerNotificationEmail(booking: Booking): EmailMessage {
  const amount = `${Number(booking.totalAmount).toFixed(2)} ${booking.currency}`;
  return {
    to: adminRecipient,
    subject: `[NEW BOOKING #${booking.bookingReference}] Paid - ${label(booking.serviceType)}`,
    text: `New Confirmed Transfer Request

Booking Reference: #${booking.bookingReference}
Status: Paid (€${amount} via payment gateway)

Trip Overview:

Service Type: ${label(booking.serviceType)}
Date & Time: ${formatDateTime(booking.pickupDatetime)}
Pickup: ${booking.pickupLocation}
Drop-off: ${booking.dropoffLocation}
Vehicle: ${label(booking.vehicleClass)}
Passengers: ${booking.passengers} | Luggage: ${booking.luggageCount}
Flight Number: ${booking.flightNumber || "N/A"}

Customer Info:

Name: ${booking.customerFirstName} ${booking.customerLastName}
Phone: ${booking.customerPhone}
Email: ${booking.customerEmail}`,
  };
}

export function createCustomerConfirmationEmail(booking: Booking, invoiceNumber: string, invoiceText: string): EmailMessage {
  return {
    to: booking.customerEmail,
    subject: `Your Transfer is Confirmed! Booking Reference #${booking.bookingReference}`,
    text: `Dear ${booking.customerFirstName} ${booking.customerLastName},

Thank you for booking with Dutch Taxi Transfers. Your payment has been received, and your transfer is fully confirmed.

Your Booking Summary:

Booking ID: #${booking.bookingReference}
Date & Pickup Time: ${formatDateTime(booking.pickupDatetime)}
Pickup Location: ${booking.pickupLocation}
Destination: ${booking.dropoffLocation}
Vehicle: ${label(booking.vehicleClass)}
Driver Details: Will be dispatched via SMS 2 hours prior to pickup.

Invoice Attached:

Your official tax invoice (${invoiceNumber}.pdf) is attached to this email for your accounting records.

If your flight is delayed, don't worry—we monitor flight status in real time.

Safe travels,

Dutch Taxi Transfers Team
Phone: ${phone}`,
    attachments: [{ filename: `${invoiceNumber}.txt`, content: invoiceText }],
  };
}

function label(value: string) {
  return value.replaceAll("_", " ").replace(/\b\w/g, (char) => char.toUpperCase());
}

function formatDateTime(date: Date) {
  return new Intl.DateTimeFormat("en-GB", {
    dateStyle: "long",
    timeStyle: "short",
    timeZone: "Europe/Amsterdam",
  }).format(date);
}
