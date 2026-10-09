import { Router, type IRouter, type Request, type Response, type NextFunction } from "express";
import { randomUUID } from "node:crypto";
import { db } from "@workspace/db";
import { bookingsTable } from "@workspace/db/schema";
import { eq } from "drizzle-orm";
import { createPaymentSession } from "../../services/payment";
import { param } from "../../lib/params";

const router: IRouter = Router();

function generateBookingReference(): string {
  const timestamp = Date.now().toString().slice(-6);
  const random = randomUUID().slice(0, 6).toUpperCase();
  return `DTT-${timestamp}-${random}`;
}

async function createBooking(req: Request, res: Response, next: NextFunction) {
  try {
    const {
      service_type,
      pickup_location,
      dropoff_location,
      pickup_datetime,
      passengers,
      luggage_count,
      vehicle_class,
      flight_number,
      customer,
      special_requests,
      total_amount,
      currency = "EUR",
    } = req.body;

    if (!service_type || !pickup_location || !dropoff_location || !pickup_datetime || !vehicle_class || !customer?.email) {
      return res.status(400).json({
        error: "ValidationError",
        message: "Missing required fields",
      });
    }

    const bookingReference = generateBookingReference();

    const [booking] = await db
      .insert(bookingsTable)
      .values({
        bookingReference,
        serviceType: service_type,
        pickupLocation: pickup_location,
        dropoffLocation: dropoff_location,
        pickupDatetime: new Date(pickup_datetime),
        passengers: passengers || 1,
        luggageCount: luggage_count || 0,
        vehicleClass: param(vehicle_class),
        flightNumber: param(flight_number),
        customerFirstName: customer.first_name,
        customerLastName: customer.last_name,
        customerEmail: customer.email,
        customerPhone: customer.phone,
        specialRequests: special_requests,
        totalAmount: String(total_amount),
        currency,
        status: "pending",
        paymentStatus: "pending",
      })
      .returning();

    const paymentSession = await createPaymentSession(booking);

    return res.status(201).json({
      booking_reference: booking.bookingReference,
      client_secret: paymentSession.clientSecret,
      payment_url: paymentSession.paymentUrl,
      status: booking.status,
    });
  } catch (error) {
    return next(error);
  }
}

router.post("/v1/bookings", createBooking);
router.post("/v1/bookings/create", createBooking);

router.get("/v1/bookings/:bookingReference", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { bookingReference } = req.params;
    const reference = typeof bookingReference === "string" ? bookingReference : "";

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

    return res.json({
      id: booking.id,
      booking_reference: booking.bookingReference,
      service_type: booking.serviceType,
      pickup_location: booking.pickupLocation,
      dropoff_location: booking.dropoffLocation,
      pickup_datetime: booking.pickupDatetime?.toISOString(),
      passengers: booking.passengers,
      luggage_count: booking.luggageCount,
      vehicle_class: booking.vehicleClass,
      flight_number: booking.flightNumber,
      customer_first_name: booking.customerFirstName,
      customer_last_name: booking.customerLastName,
      customer_email: booking.customerEmail,
      customer_phone: booking.customerPhone,
      special_requests: booking.specialRequests,
      total_amount: parseFloat(booking.totalAmount),
      currency: booking.currency,
      status: booking.status,
      payment_status: booking.paymentStatus,
      created_at: booking.createdAt?.toISOString(),
      confirmed_at: booking.confirmedAt?.toISOString(),
    });
  } catch (error) {
    return next(error);
  }
});

export default router;