import { useState, type FormEvent } from 'react';
import { ArrowRight, CalendarDays, Luggage, MapPin, UsersRound } from 'lucide-react';
import { business } from './business-content';

export function BookingWidget() {
  const [handoffReady, setHandoffReady] = useState(false);
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [pickupAt, setPickupAt] = useState('');
  const [passengers, setPassengers] = useState('1');
  const [luggage, setLuggage] = useState('1');

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setHandoffReady(true);
  }

  return (
    <section className="booking-wrap" id="quick-book" aria-labelledby="booking-title">
      <div className="booking-card">
        <div className="booking-heading">
          <div><span className="section-kicker">{business.booking.eyebrow}</span><h2 id="booking-title">{business.booking.title}</h2></div>
          <span className="booking-step"><b>01</b><span> / 02</span></span>
        </div>
        <form className="booking-form" onSubmit={handleSubmit}>
          <label className="booking-field">
            <span className="field-label">{business.booking.fromLabel}</span>
            <span className="field-control"><MapPin size={17} aria-hidden="true" /><input required value={from} onChange={(e) => { setFrom(e.target.value); setHandoffReady(false); }} placeholder={business.booking.fromPlaceholder} aria-label={business.booking.fromPlaceholder} data-testid="input-pickup" /></span>
          </label>
          <label className="booking-field">
            <span className="field-label">{business.booking.toLabel}</span>
            <span className="field-control"><MapPin size={17} aria-hidden="true" /><input required value={to} onChange={(e) => { setTo(e.target.value); setHandoffReady(false); }} placeholder={business.booking.toPlaceholder} aria-label={business.booking.toPlaceholder} data-testid="input-destination" /></span>
          </label>
          <label className="booking-field">
            <span className="field-label">{business.booking.dateLabel}</span>
            <span className="field-control"><CalendarDays size={17} aria-hidden="true" /><input required type="datetime-local" value={pickupAt} onChange={(e) => { setPickupAt(e.target.value); setHandoffReady(false); }} aria-label="Pickup date and time" data-testid="input-date-time" /></span>
          </label>
          <label className="booking-field compact-field">
            <span className="field-label">{business.booking.passengersLabel}</span>
            <span className="field-control"><UsersRound size={17} aria-hidden="true" /><select value={passengers} onChange={(e) => { setPassengers(e.target.value); setHandoffReady(false); }} aria-label="Number of passengers" data-testid="select-passengers">{[1,2,3,4,5,6,7,8].map((n) => <option key={n} value={n}>{n} passenger{n > 1 ? 's' : ''}</option>)}</select></span>
          </label>
          <label className="booking-field compact-field">
            <span className="field-label">{business.booking.luggageLabel}</span>
            <span className="field-control"><Luggage size={17} aria-hidden="true" /><select value={luggage} onChange={(e) => { setLuggage(e.target.value); setHandoffReady(false); }} aria-label="Number of suitcases" data-testid="select-luggage">{[0,1,2,3,4,5,6].map((n) => <option key={n} value={n}>{n} suitcase{n === 1 ? '' : 's'}</option>)}</select></span>
          </label>
          <button className="button button-navy booking-submit" type="submit" data-testid="button-check-price">{business.booking.submitLabel} <ArrowRight size={16} /></button>
        </form>
        {handoffReady && (
          <div className="handoff-note" role="status" data-testid="status-booking-handoff">
            <div className="handoff-note-copy">
              <p><strong>{from}</strong> to <strong>{to}</strong></p>
              <p>{new Intl.DateTimeFormat(undefined, { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(pickupAt))} · {passengers} passenger{passengers === '1' ? '' : 's'} · {luggage} suitcase{luggage === '1' ? '' : 's'}</p>
              <p>{business.booking.handoffMessage}</p>
            </div>
            <a href={business.phoneLink}>{business.booking.handoffAction} <ArrowRight size={14} /></a>
          </div>
        )}
        <p className="booking-footnote">{business.booking.footnote}</p>
      </div>
    </section>
  );
}
