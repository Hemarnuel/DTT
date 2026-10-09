import { useEffect, useRef, useState, type FormEvent, type RefObject } from 'react';
import { ArrowRight, CalendarDays, CarFront, CreditCard, Luggage, Mail, MapPin, Plane, UserRound, UsersRound } from 'lucide-react';
import { business } from './business-content';

type ServiceType = 'airport_transfer' | 'point_to_point' | 'hourly' | 'day_trip';
type VehicleClass = 'economy' | 'business' | 'vip_chauffeur' | 'van';

type BookingResponse = {
  booking_reference: string;
  payment_url: string | null;
  status: string;
};

type DemoPaymentResponse = {
  booking_reference: string;
  payment_id: string;
  status: string;
};

const serviceTypes: Array<{ value: ServiceType; label: string }> = [
  { value: 'airport_transfer', label: 'Airport Transfer' },
  { value: 'point_to_point', label: 'Point-to-Point' },
  { value: 'hourly', label: 'Hourly' },
  { value: 'day_trip', label: 'Day Trip' },
];

const vehicles: Array<{ value: VehicleClass; label: string; description: string; base: number }> = [
  { value: 'economy', label: 'Economy', description: 'Comfortable sedan', base: 65 },
  { value: 'business', label: 'Business Sedan', description: 'Mercedes E-Class/S-Class', base: 85 },
  { value: 'vip_chauffeur', label: 'VIP Chauffeur', description: 'Premium executive service', base: 135 },
  { value: 'van', label: 'Van (V-Class)', description: 'Families and groups', base: 115 },
];

const locationSuggestions = [
  'Amsterdam Airport Schiphol (AMS)',
  'Amsterdam Central Station',
  'Grand Hotel Krasnapolsky, Amsterdam',
  'Keizersgracht, Amsterdam',
  'RAI Amsterdam',
  'Zaanse Schans',
  'Giethoorn',
  'Keukenhof',
];

declare global {
  interface Window {
    google?: {
      maps?: {
        places?: {
          Autocomplete: new (input: HTMLInputElement, options?: Record<string, unknown>) => { addListener: (event: string, callback: () => void) => void; getPlace: () => { formatted_address?: string; name?: string } };
        };
      };
    };
  }
}

export function BookingWidget() {
  const [step, setStep] = useState(1);
  const [serviceType, setServiceType] = useState<ServiceType>('airport_transfer');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [pickupAt, setPickupAt] = useState('');
  const [passengers, setPassengers] = useState('2');
  const [luggage, setLuggage] = useState('2');
  const [vehicleClass, setVehicleClass] = useState<VehicleClass>('business');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [flightNumber, setFlightNumber] = useState('');
  const [specialRequests, setSpecialRequests] = useState('');
  const [booking, setBooking] = useState<BookingResponse | null>(null);
  const [payment, setPayment] = useState<DemoPaymentResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const pickupRef = useRef<HTMLInputElement>(null);
  const dropoffRef = useRef<HTMLInputElement>(null);

  useGoogleAutocomplete(pickupRef, setFrom);
  useGoogleAutocomplete(dropoffRef, setTo);

  const total = calculatePrice(vehicleClass, serviceType, Number(passengers), Number(luggage));

  function next() {
    setError('');
    setStep((value) => Math.min(value + 1, 4));
  }

  function back() {
    setError('');
    setStep((value) => Math.max(value - 1, 1));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (step < 4) return next();
    setLoading(true);
    setError('');
    try {
      const apiBase = import.meta.env.VITE_API_URL || '';
      const response = await fetch(new URL('/api/v1/bookings', apiBase).toString(), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          service_type: serviceType,
          pickup_location: from,
          dropoff_location: to,
          pickup_datetime: new Date(pickupAt).toISOString(),
          passengers: Number(passengers),
          luggage_count: Number(luggage),
          vehicle_class: vehicleClass,
          flight_number: flightNumber || undefined,
          special_requests: specialRequests || undefined,
          customer: { first_name: firstName, last_name: lastName, email, phone },
          total_amount: total,
          currency: 'EUR',
        }),
      });
      if (!response.ok) throw new Error('Booking could not be created');
      const created = await response.json() as BookingResponse;
      setBooking(created);
      const paymentResponse = await fetch(new URL('/api/v1/payments/demo-confirm', apiBase).toString(), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ booking_reference: created.booking_reference }),
      });
      if (!paymentResponse.ok) throw new Error('Demo payment could not be confirmed');
      setPayment(await paymentResponse.json() as DemoPaymentResponse);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="booking-wrap" id="quick-book" aria-labelledby="booking-title">
      <div className="booking-card">
        <div className="booking-heading">
          <div><span className="section-kicker">{business.booking.eyebrow}</span><h2 id="booking-title">{booking && payment ? 'Transfer confirmed' : business.booking.title}</h2></div>
          <span className="booking-step"><b>{String(step).padStart(2, '0')}</b><span> / 04</span></span>
        </div>
        {booking && payment ? (
          <div className="handoff-note" role="status" data-testid="status-booking-confirmed">
            <div className="handoff-note-copy">
              <p><strong>Booking #{booking.booking_reference}</strong> is paid and confirmed.</p>
              <p>Demo payment ID: {payment.payment_id}</p>
              <p>Confirmation and invoice emails have been queued by the backend.</p>
            </div>
            <a href={business.phoneLink} data-testid="link-confirmed-phone">Call support <ArrowRight size={14} /></a>
          </div>
        ) : (
          <form className="booking-form" onSubmit={handleSubmit}>
            {step === 1 && <RideDetails serviceType={serviceType} setServiceType={setServiceType} from={from} setFrom={setFrom} to={to} setTo={setTo} pickupAt={pickupAt} setPickupAt={setPickupAt} passengers={passengers} setPassengers={setPassengers} luggage={luggage} setLuggage={setLuggage} pickupRef={pickupRef} dropoffRef={dropoffRef} />}
            {step === 2 && <VehicleSelection vehicleClass={vehicleClass} setVehicleClass={setVehicleClass} serviceType={serviceType} passengers={Number(passengers)} luggage={Number(luggage)} />}
            {step === 3 && <PassengerDetails firstName={firstName} setFirstName={setFirstName} lastName={lastName} setLastName={setLastName} email={email} setEmail={setEmail} phone={phone} setPhone={setPhone} flightNumber={flightNumber} setFlightNumber={setFlightNumber} specialRequests={specialRequests} setSpecialRequests={setSpecialRequests} serviceType={serviceType} />}
            {step === 4 && <PaymentStep from={from} to={to} pickupAt={pickupAt} passengers={passengers} luggage={luggage} vehicleClass={vehicleClass} total={total} />}
            {error && <p className="quote-disclaimer" style={{ gridColumn: '1 / -1', color: '#9b1c1c' }}>{error}</p>}
            <div style={{ gridColumn: '1 / -1', display: 'flex', gap: 10, justifyContent: 'space-between' }}>
              {step > 1 ? <button className="button button-navy booking-submit" type="button" onClick={back}>Back</button> : <span />}
              <button className="button button-navy booking-submit" type="submit" disabled={loading} data-testid="button-booking-next">{step === 4 ? (loading ? 'Processing demo payment...' : `Pay Demo €${total.toFixed(2)}`) : 'Continue'} <ArrowRight size={16} /></button>
            </div>
          </form>
        )}
        <p className="booking-footnote">Demo payment mode. No real card is charged. Confirmation emails and invoice data are generated after demo payment confirmation.</p>
      </div>
    </section>
  );
}

function RideDetails(props: { serviceType: ServiceType; setServiceType: (value: ServiceType) => void; from: string; setFrom: (value: string) => void; to: string; setTo: (value: string) => void; pickupAt: string; setPickupAt: (value: string) => void; passengers: string; setPassengers: (value: string) => void; luggage: string; setLuggage: (value: string) => void; pickupRef: RefObject<HTMLInputElement | null>; dropoffRef: RefObject<HTMLInputElement | null> }) {
  return <>
    <label className="booking-field"><span className="field-label">Service Type</span><span className="field-control"><CarFront size={17} /><select value={props.serviceType} onChange={(e) => props.setServiceType(e.target.value as ServiceType)}>{serviceTypes.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}</select></span></label>
    <label className="booking-field"><span className="field-label">{business.booking.fromLabel}</span><span className="field-control"><MapPin size={17} /><input ref={props.pickupRef} list="dtt-location-suggestions" required value={props.from} onChange={(e) => props.setFrom(e.target.value)} placeholder={business.booking.fromPlaceholder} data-testid="input-pickup" /></span></label>
    <label className="booking-field"><span className="field-label">{business.booking.toLabel}</span><span className="field-control"><MapPin size={17} /><input ref={props.dropoffRef} list="dtt-location-suggestions" required value={props.to} onChange={(e) => props.setTo(e.target.value)} placeholder={business.booking.toPlaceholder} data-testid="input-destination" /></span></label>
    <datalist id="dtt-location-suggestions">{locationSuggestions.map((item) => <option key={item} value={item} />)}</datalist>
    <label className="booking-field"><span className="field-label">{business.booking.dateLabel}</span><span className="field-control"><CalendarDays size={17} /><input required type="datetime-local" value={props.pickupAt} onChange={(e) => props.setPickupAt(e.target.value)} data-testid="input-date-time" /></span></label>
    <label className="booking-field compact-field"><span className="field-label">{business.booking.passengersLabel}</span><span className="field-control"><UsersRound size={17} /><select value={props.passengers} onChange={(e) => props.setPassengers(e.target.value)}>{[1,2,3,4,5,6,7,8].map((n) => <option key={n} value={n}>{n} passenger{n > 1 ? 's' : ''}</option>)}</select></span></label>
    <label className="booking-field compact-field"><span className="field-label">{business.booking.luggageLabel}</span><span className="field-control"><Luggage size={17} /><select value={props.luggage} onChange={(e) => props.setLuggage(e.target.value)}>{[0,1,2,3,4,5,6,7,8,9,10].map((n) => <option key={n} value={n}>{n} suitcase{n === 1 ? '' : 's'}</option>)}</select></span></label>
  </>;
}

function VehicleSelection({ vehicleClass, setVehicleClass, serviceType, passengers, luggage }: { vehicleClass: VehicleClass; setVehicleClass: (value: VehicleClass) => void; serviceType: ServiceType; passengers: number; luggage: number }) {
  return <>{vehicles.map((vehicle) => <label className="booking-field" key={vehicle.value} style={{ gridColumn: 'span 3' }}><span className="field-label">{vehicle.label}</span><span className="field-control"><input type="radio" name="vehicle" checked={vehicleClass === vehicle.value} onChange={() => setVehicleClass(vehicle.value)} /><span>{vehicle.description} · €{calculatePrice(vehicle.value, serviceType, passengers, luggage).toFixed(2)}</span></span></label>)}</>;
}

function PassengerDetails(props: { firstName: string; setFirstName: (value: string) => void; lastName: string; setLastName: (value: string) => void; email: string; setEmail: (value: string) => void; phone: string; setPhone: (value: string) => void; flightNumber: string; setFlightNumber: (value: string) => void; specialRequests: string; setSpecialRequests: (value: string) => void; serviceType: ServiceType }) {
  return <>
    <label className="booking-field"><span className="field-label">First Name</span><span className="field-control"><UserRound size={17} /><input required value={props.firstName} onChange={(e) => props.setFirstName(e.target.value)} /></span></label>
    <label className="booking-field"><span className="field-label">Last Name</span><span className="field-control"><UserRound size={17} /><input required value={props.lastName} onChange={(e) => props.setLastName(e.target.value)} /></span></label>
    <label className="booking-field"><span className="field-label">Email</span><span className="field-control"><Mail size={17} /><input required type="email" value={props.email} onChange={(e) => props.setEmail(e.target.value)} /></span></label>
    <label className="booking-field"><span className="field-label">Phone</span><span className="field-control"><CreditCard size={17} /><input required type="tel" value={props.phone} onChange={(e) => props.setPhone(e.target.value)} placeholder="+31612345678" /></span></label>
    <label className="booking-field"><span className="field-label">Flight Number</span><span className="field-control"><Plane size={17} /><input required={props.serviceType === 'airport_transfer'} value={props.flightNumber} onChange={(e) => props.setFlightNumber(e.target.value)} placeholder="KL1234" /></span></label>
    <label className="booking-field"><span className="field-label">Special Requests</span><span className="field-control"><input value={props.specialRequests} onChange={(e) => props.setSpecialRequests(e.target.value)} placeholder="Meet & greet notes" /></span></label>
  </>;
}

function PaymentStep({ from, to, pickupAt, passengers, luggage, vehicleClass, total }: { from: string; to: string; pickupAt: string; passengers: string; luggage: string; vehicleClass: VehicleClass; total: number }) {
  return <div className="handoff-note" style={{ gridColumn: '1 / -1' }}><div className="handoff-note-copy"><p><strong>{from}</strong> to <strong>{to}</strong></p><p>{new Intl.DateTimeFormat(undefined, { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(pickupAt))} · {passengers} passengers · {luggage} suitcase(s)</p><p>{label(vehicleClass)} · Demo total: €{total.toFixed(2)}</p></div><CreditCard size={22} /></div>;
}

function useGoogleAutocomplete(ref: RefObject<HTMLInputElement | null>, onPlace: (value: string) => void) {
  useEffect(() => {
    if (!ref.current || !window.google?.maps?.places?.Autocomplete) return;
    const autocomplete = new window.google.maps.places.Autocomplete(ref.current, { componentRestrictions: { country: 'nl' }, fields: ['formatted_address', 'name'] });
    autocomplete.addListener('place_changed', () => {
      const place = autocomplete.getPlace();
      onPlace(place.formatted_address || place.name || ref.current?.value || '');
    });
  }, [ref, onPlace]);
}

function calculatePrice(vehicleClass: VehicleClass, serviceType: ServiceType, passengers: number, luggage: number) {
  const vehicle = vehicles.find((item) => item.value === vehicleClass) || vehicles[1];
  const serviceMultiplier = serviceType === 'hourly' ? 1.8 : serviceType === 'day_trip' ? 2.4 : serviceType === 'airport_transfer' ? 1 : 1.15;
  const passengerFee = Math.max(0, passengers - 2) * 5;
  const luggageFee = Math.max(0, luggage - 2) * 3;
  return Math.round((vehicle.base * serviceMultiplier + passengerFee + luggageFee) * 100) / 100;
}

function label(value: string) {
  return value.replaceAll('_', ' ').replace(/\b\w/g, (char) => char.toUpperCase());
}
