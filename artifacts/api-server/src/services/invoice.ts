import type { Booking } from "@workspace/db/schema";

const company = {
  name: "DUTCH TAXI TRANSFERS",
  address: "Keizersgracht 123, 1015 CJ Amsterdam",
  vat: "NL888888888B01",
};

export function calculateVat(totalAmount: string | number, vatRate = 9) {
  const grossAmount = Number(totalAmount);
  const netAmount = Number((grossAmount / (1 + vatRate / 100)).toFixed(2));
  const vatAmount = Number((grossAmount - netAmount).toFixed(2));
  return { netAmount, vatAmount, grossAmount, vatRate };
}

export function createInvoiceText(booking: Booking, invoiceNumber: string, issuedAt = new Date()) {
  const amounts = calculateVat(booking.totalAmount);
  const date = issuedAt.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
  const description = `${label(booking.serviceType)} (${booking.pickupLocation} to ${booking.dropoffLocation})`;

  return `====================================================================
                       ${company.name}
              ${company.address}
                   VAT / BTW: ${company.vat}
====================================================================
INVOICE NUMBER: ${invoiceNumber.padEnd(32)} DATE: ${date}
BOOKING REF:    ${booking.bookingReference.padEnd(32)} PAYMENT STATUS: PAID

Billed To:
${booking.customerFirstName} ${booking.customerLastName}
${booking.customerEmail}

--------------------------------------------------------------------
DESCRIPTION                                           AMOUNT (€)
--------------------------------------------------------------------
${description.slice(0, 48).padEnd(53)} €${amounts.netAmount.toFixed(2)}
Vehicle: ${label(booking.vehicleClass)}
VAT (${amounts.vatRate}%):${" ".repeat(47)} €${amounts.vatAmount.toFixed(2)}
--------------------------------------------------------------------
TOTAL PAID:${" ".repeat(46)} €${amounts.grossAmount.toFixed(2)}
====================================================================`;
}

function label(value: string) {
  return value.replaceAll("_", " ").replace(/\b\w/g, (char) => char.toUpperCase());
}
