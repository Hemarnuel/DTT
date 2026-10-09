import { pgTable, text, serial, integer, numeric, timestamp, boolean, pgEnum, uuid } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const serviceTypeEnum = pgEnum("service_type", [
  "airport_transfer",
  "point_to_point",
  "hourly",
  "day_trip",
]);

export const vehicleClassEnum = pgEnum("vehicle_class", [
  "economy",
  "business",
  "vip_chauffeur",
  "van",
]);

export const bookingStatusEnum = pgEnum("booking_status", [
  "pending",
  "confirmed",
  "paid",
  "cancelled",
  "completed",
]);

export const paymentStatusEnum = pgEnum("payment_status", [
  "pending",
  "paid",
  "failed",
  "refunded",
]);

export const bookingsTable = pgTable("bookings", {
  id: serial("id").primaryKey(),
  bookingReference: text("booking_reference").notNull().unique(),
  serviceType: serviceTypeEnum("service_type").notNull(),
  pickupLocation: text("pickup_location").notNull(),
  dropoffLocation: text("dropoff_location").notNull(),
  pickupDatetime: timestamp("pickup_datetime", { withTimezone: true }).notNull(),
  passengers: integer("passengers").notNull(),
  luggageCount: integer("luggage_count").notNull(),
  vehicleClass: vehicleClassEnum("vehicle_class").notNull(),
  flightNumber: text("flight_number"),
  customerFirstName: text("customer_first_name").notNull(),
  customerLastName: text("customer_last_name").notNull(),
  customerEmail: text("customer_email").notNull(),
  customerPhone: text("customer_phone").notNull(),
  specialRequests: text("special_requests"),
  totalAmount: numeric("total_amount", { precision: 10, scale: 2 }).notNull(),
  currency: text("currency").notNull().default("EUR"),
  status: bookingStatusEnum("status").notNull().default("pending"),
  paymentStatus: paymentStatusEnum("payment_status").notNull().default("pending"),
  stripePaymentIntentId: text("stripe_payment_intent_id"),
  molliePaymentId: text("mollie_payment_id"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  confirmedAt: timestamp("confirmed_at", { withTimezone: true }),
  completedAt: timestamp("completed_at", { withTimezone: true }),
});

export const vehiclesTable = pgTable("vehicles", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  vehicleClass: vehicleClassEnum("vehicle_class").notNull(),
  capacityPassengers: integer("capacity_passengers").notNull(),
  capacityLuggage: integer("capacity_luggage").notNull(),
  basePricePerKm: numeric("base_price_per_km", { precision: 10, scale: 2 }),
  fixedPriceAirport: numeric("fixed_price_airport", { precision: 10, scale: 2 }),
  fixedPriceCity: numeric("fixed_price_city", { precision: 10, scale: 2 }),
  description: text("description"),
  imageUrl: text("image_url"),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const paymentsTable = pgTable("payments", {
  id: serial("id").primaryKey(),
  bookingId: integer("booking_id").notNull().references(() => bookingsTable.id),
  provider: text("provider").notNull(),
  providerPaymentId: text("provider_payment_id").notNull(),
  amount: numeric("amount", { precision: 10, scale: 2 }).notNull(),
  currency: text("currency").notNull().default("EUR"),
  status: paymentStatusEnum("status").notNull().default("pending"),
  metadata: text("metadata"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  paidAt: timestamp("paid_at", { withTimezone: true }),
});

export const invoicesTable = pgTable("invoices", {
  id: serial("id").primaryKey(),
  bookingId: integer("booking_id").notNull().references(() => bookingsTable.id).unique(),
  invoiceNumber: text("invoice_number").notNull().unique(),
  pdfUrl: text("pdf_url"),
  pdfData: text("pdf_data"),
  vatNumber: text("vat_number").notNull().default("NL888888888B01"),
  vatRate: numeric("vat_rate", { precision: 5, scale: 2 }).notNull().default("9.00"),
  netAmount: numeric("net_amount", { precision: 10, scale: 2 }).notNull(),
  vatAmount: numeric("vat_amount", { precision: 10, scale: 2 }).notNull(),
  grossAmount: numeric("gross_amount", { precision: 10, scale: 2 }).notNull(),
  currency: text("currency").notNull().default("EUR"),
  issuedAt: timestamp("issued_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertBookingSchema = createInsertSchema(bookingsTable).omit({
  id: true,
  bookingReference: true,
  status: true,
  paymentStatus: true,
  stripePaymentIntentId: true,
  molliePaymentId: true,
  createdAt: true,
  updatedAt: true,
  confirmedAt: true,
  completedAt: true,
});

export const insertVehicleSchema = createInsertSchema(vehiclesTable).omit({
  id: true,
  createdAt: true,
});

export const insertPaymentSchema = createInsertSchema(paymentsTable).omit({
  id: true,
  createdAt: true,
  paidAt: true,
});

export const insertInvoiceSchema = createInsertSchema(invoicesTable).omit({
  id: true,
  issuedAt: true,
});

export type Booking = typeof bookingsTable.$inferSelect;
export type InsertBooking = z.infer<typeof insertBookingSchema>;
export type Vehicle = typeof vehiclesTable.$inferSelect;
export type InsertVehicle = z.infer<typeof insertVehicleSchema>;
export type Payment = typeof paymentsTable.$inferSelect;
export type InsertPayment = z.infer<typeof insertPaymentSchema>;
export type Invoice = typeof invoicesTable.$inferSelect;
export type InsertInvoice = z.infer<typeof insertInvoiceSchema>;