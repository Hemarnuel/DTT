import { useEffect } from 'react';
import { ArrowRight, ArrowUpRight, BriefcaseBusiness, CarFront, Check, Clock3, Landmark, MapPin, Phone, Plane, ShieldCheck } from 'lucide-react';
import { Link } from 'wouter';
import { business } from '@/components/business-content';
import { BookingWidget } from '@/components/BookingWidget';
import { Hero } from '@/components/Hero';
import { ServiceCategories } from '@/components/ServiceCategories';
import { TrustSection } from '@/components/TrustSection';
import vehiclePhoto from '@/assets/transfer-hero-wide.jpg';
import destinationPhoto from '@/assets/netherlands-transfer.jpg';

function usePageMeta(title: string, description: string) {
  useEffect(() => {
    document.title = title;
    const desc = document.querySelector('meta[name="description"]');
    if (desc) desc.setAttribute('content', description);
    const og = document.querySelector('meta[property="og:description"]');
    if (og) og.setAttribute('content', description);
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) ogTitle.setAttribute('content', title);
    const twitterTitle = document.querySelector('meta[name="twitter:title"]');
    if (twitterTitle) twitterTitle.setAttribute('content', title);
    const twitterDescription = document.querySelector('meta[name="twitter:description"]');
    if (twitterDescription) twitterDescription.setAttribute('content', description);
  }, [title, description]);
}

function Intro({ eyebrow, title, accent, children }: { eyebrow: string; title: string; accent?: string; children: string }) {
  return <div className="page-intro"><span className="section-kicker">{eyebrow}</span><h1>{title}{accent && <> <span>{accent}</span></>}</h1><p>{children}</p></div>;
}
function Callout({ title, copy = 'Tell us where you are travelling and speak directly with our team.' }: { title: string; copy?: string }) {
  return <aside className="callout"><div><strong>{title}</strong><p>{copy}</p></div><a className="button button-gold button-large" href={business.phoneLink} data-testid="link-callout-phone">Call {business.phoneDisplay} <ArrowUpRight size={16} /></a></aside>;
}

const serviceDetails = [
  { title: 'Airport transfers', text: 'Plan a direct journey to or from Schiphol Airport. Share your flight and pickup details with the team when you call.', Icon: Plane },
  { title: 'Amsterdam taxi', text: 'Arrange a city journey between your address, hotel, station or another stop in Amsterdam.', Icon: CarFront },
  { title: 'Private transfers', text: 'A private transfer shaped around your itinerary, whether the journey is local or across the Netherlands.', Icon: MapPin },
  { title: 'Business transportation', text: 'Professional transport for business travel, meetings and guest movements.', Icon: BriefcaseBusiness },
  { title: 'Day trips', text: 'Travel beyond the city for destinations such as Zaanse Schans, Giethoorn or Keukenhof.', Icon: Landmark },
];
const destinations = ['Schiphol Airport', 'Amsterdam', 'Zaanse Schans', 'Giethoorn', 'Keukenhof', 'Across the Netherlands'];

export function HomePage() {
  usePageMeta('Amsterdam Taxi & Schiphol Airport Transfers | Dutch Taxi Transfers', 'Professional Amsterdam taxi and private transfer services for Schiphol Airport, Amsterdam and destinations across the Netherlands. Available 24/7.');
  return <>
    <Hero />
    <BookingWidget />
    <section className="page-body home-about" aria-labelledby="home-about-title">
      <div className="feature-band">
        <div>
          <span className="section-kicker">Local knowledge, thoughtful service</span>
          <h2 id="home-about-title">A smoother way to move around the Netherlands.</h2>
          <p>Whether your journey begins at Schiphol or in the heart of Amsterdam, Dutch Taxi Transfers brings airport, business and private travel together with one clear point of contact.</p>
          <p>Tell us what your trip needs. We will help you arrange the right transfer and explain the next step before you travel.</p>
          <Link className="text-link" href="/about" data-testid="link-home-about">More about our approach <ArrowRight size={15} /></Link>
        </div>
        <figure className="feature-visual"><img src={vehiclePhoto} alt="Private transfer vehicle waiting at an airport terminal" /><figcaption>Amsterdam · Schiphol · The Netherlands</figcaption></figure>
      </div>
      <div className="benefit-grid">
        {[
          ['Clear arrangements', 'Discuss your route and travel details directly with the team.'],
          ['Professional drivers', 'Professional transport for business, airport and private travel.'],
          ['Flight monitoring', 'Flight monitoring is part of the airport transfer service.'],
          ['Support when you need it', 'Customer support is available 24 hours a day, 7 days a week.'],
        ].map(([title, text], i) => <article className="benefit" key={title} data-testid={`benefit-home-${i}`}><b>{title}</b><p>{text}</p></article>)}
      </div>
    </section>
    <section className="fleet-section" aria-labelledby="fleet-title">
      <div className="fleet-heading"><div><span className="section-kicker">Travel, your way</span><h2 id="fleet-title">Choose the journey.<br />We’ll discuss the vehicle.</h2></div><p>Vehicle availability depends on your route and requirements. Call with your passenger and luggage details so the team can advise what is suitable.</p></div>
      <div className="fleet-strip">
        {[['Private transfer', 'For a direct, pre-arranged journey.'], ['Airport travel', 'Space for your people and travel bags.'], ['Business travel', 'A considered option for work trips and guests.']].map(([title, text], i) => <article className="fleet-card" key={title} data-testid={`vehicle-option-${i}`}><div><h3>{title}</h3><p>{text}</p></div></article>)}
      </div>
    </section>
    <ServiceCategories />
    <TrustSection />
    <section className="home-destinations" aria-labelledby="home-destinations-title">
      <div className="destination-layout">
        <div><span className="section-kicker">From airport to elsewhere</span><h2 id="home-destinations-title">Amsterdam is a beginning, not a boundary.</h2><p>Arrange a Schiphol pickup, a city ride or a private journey to places around the Netherlands.</p><Link className="text-link" href="/destinations" data-testid="link-home-destinations">Explore destinations <ArrowRight size={15} /></Link></div>
        <div className="destination-list">{destinations.map((name, i) => <Link className="destination-item" href="/destinations" key={name} data-testid={`link-home-destination-${i}`}><span>{name}</span><span>Explore <ArrowUpRight size={13} /></span></Link>)}</div>
      </div>
      <figure className="destination-image-banner">
        <img src={destinationPhoto} alt="Private transfer car beside an Amsterdam canal at dusk" loading="lazy" width={1024} height={1024} />
        <figcaption>Amsterdam · Schiphol · The Netherlands</figcaption>
      </figure>
    </section>
    <div className="page-body" style={{ paddingTop: 0 }}><Callout title="Have a journey in mind?" copy="Call to discuss your route, travel details and a quote." /></div>
  </>;
}

export function ServicesPage() {
  usePageMeta('Taxi & Transfer Services in Amsterdam | Dutch Taxi Transfers', 'Explore airport transfers, Amsterdam taxi journeys, private transfers, business transportation and day trips in the Netherlands.');
  return <>
    <Intro eyebrow="Services · Amsterdam & beyond" title="The right ride for" accent="the reason you travel.">From an airport arrival to a day out across the Netherlands, arrange professional transport around your journey.</Intro>
    <main className="page-body">
      <div className="page-lede"><span className="section-kicker">How we can help</span><h2>One conversation. A journey planned around you.</h2><p>Choose the kind of trip you have in mind, then call to discuss timing, pickup points, passengers and luggage.</p></div>
      <div className="service-detail-grid">{serviceDetails.map(({ title, text, Icon }, i) => <article className="service-detail" key={title} data-testid={`service-detail-${i}`}><span className="service-icon"><Icon size={21} /></span><div><h3>{title}</h3><p>{text}</p></div><ArrowUpRight size={17} /></article>)}</div>
      <div className="feature-band"><div><span className="section-kicker">Good to know</span><h2>Share the details that make your trip yours.</h2><p>When you call, it helps to have your pickup and destination, travel date and time, passenger count and luggage needs ready. For airport journeys, include your flight details.</p></div><div className="quote-panel"><h2>Planning an airport pickup?</h2><p>Flight monitoring is part of our airport transfer service. Confirm pickup arrangements with the team when you book by phone.</p><a className="text-link" href={business.phoneLink} data-testid="link-services-phone">Call our team <ArrowRight size={15} /></a></div></div>
      <Callout title="Let’s plan your transfer." />
    </main>
  </>;
}

export function DestinationsPage() {
  usePageMeta('Amsterdam, Schiphol & Netherlands Destinations | Dutch Taxi Transfers', 'Arrange private transfers to and from Schiphol Airport, Amsterdam and destinations throughout the Netherlands.');
  return <>
    <Intro eyebrow="Destinations · The Netherlands" title="From Schiphol to" accent="wherever is next.">Airport arrivals, Amsterdam addresses and journeys further afield. Tell us where you are going and we can discuss the transfer.</Intro>
    <main className="page-body">
      <div className="destination-layout"><div><span className="section-kicker">Your route, your plans</span><h2>Local starts. Longer journeys.</h2><p>We provide professional transport for Schiphol Airport, Amsterdam and destinations across the Netherlands. These are a few of the places and trip types already part of our service.</p><p>For a route not listed here, call and ask. We can discuss your destination, pickup point and timing together.</p><a className="text-link" href={business.phoneLink} data-testid="link-destinations-call">Discuss a route <ArrowRight size={15} /></a></div><div className="destination-list">{destinations.map((name, i) => <div className="destination-item" key={name} data-testid={`destination-${i}`}><span>{name}</span><span>{i < 2 ? 'Airport & city' : 'Netherlands'}</span></div>)}</div></div>
      <div className="feature-band"><figure className="feature-visual"><img src={vehiclePhoto} alt="Transfer car at a modern airport terminal" /><figcaption>Door-to-door private transfer service</figcaption></figure><div><span className="section-kicker">A useful start</span><h2>Make the pickup details clear.</h2><p>Share the exact pickup address, destination and preferred travel time. Travelling to or from Schiphol? Have your flight details available so the transfer can be discussed with the full picture.</p></div></div>
      <Callout title="Need a route-specific quote?" copy="Call with your pickup and destination details. We do not publish live fares on this site." />
    </main>
  </>;
}

export function PricingPage() {
  usePageMeta('Transfer Pricing & Quotes | Dutch Taxi Transfers Amsterdam', 'Dutch Taxi Transfers does not have a live fare or reservation provider on this website. Call to discuss your journey and request a quote.');
  return <>
    <Intro eyebrow="Pricing · Clear before you travel" title="A quote for your" accent="actual journey.">We do not show live fares or take reservations on this website. Call the team to discuss your trip and check the fare before you decide.</Intro>
    <main className="page-body">
      <div className="quote-panel"><h2>No live fare calculator here.</h2><p>This project does not connect to a live fare or reservation provider. The details form below does not calculate a price, reserve a vehicle or confirm a booking. It is a safe prompt to help you prepare a phone enquiry.</p><a className="button button-gold button-large" href={business.phoneLink} data-testid="link-pricing-phone">Call for a quote <ArrowRight size={16} /></a></div>
      <div className="price-steps">{[['01', 'Share the route', 'Tell the team your pickup, destination and travel date.'], ['02', 'Discuss the details', 'Mention passenger numbers, luggage and any airport flight details.'], ['03', 'Confirm directly', 'Ask the team to explain the fare and arrangements before proceeding.']].map(([n, title, copy]) => <article className="price-step" key={n}><span>{n}</span><h3>{title}</h3><p>{copy}</p></article>)}</div>
      <p className="quote-disclaimer"><strong>Important:</strong> Submitting the details below only displays them on this page and provides a phone handoff. No fare is calculated, no data is sent to a reservation service, and no booking is confirmed.</p>
    </main>
    <BookingWidget />
  </>;
}

export function AboutPage() {
  usePageMeta('About Dutch Taxi Transfers | Amsterdam & Schiphol', 'Learn about Dutch Taxi Transfers and our professional transport for business, airport and private travel in Amsterdam and across the Netherlands.');
  return <>
    <Intro eyebrow="About · Dutch Taxi Transfers" title="Thoughtful transport," accent="rooted in the Netherlands.">A transfer service for the real shape of travel: airport arrivals, busy workdays and time well spent beyond the city.</Intro>
    <main className="page-body">
      <div className="story-block"><span className="section-kicker">Our approach</span><h2>Professional service begins with listening.</h2><p>Dutch Taxi Transfers serves Amsterdam, Schiphol and destinations throughout the Netherlands. We bring airport, business and private journeys together through professional transport and direct customer support.</p><p>Every trip has its own details. We believe those are best discussed clearly: where you need to be picked up, where you are going, when you are travelling and what you need to bring along.</p><div className="editorial-note">“A good transfer is not only a ride. It is knowing who to speak to and what happens next.”</div></div>
      <div className="benefit-grid">{business.trustPoints.map((point, i) => <article className="benefit" key={point}><b><Check size={15} /> {point}</b><p>{i === 0 ? 'Discuss your journey and fare directly with the team.' : i === 1 ? 'Professional transport for your trip.' : i === 2 ? 'Flight monitoring is included in the airport service.' : 'Customer support is available 24 hours a day, 7 days a week.'}</p></article>)}</div>
      <div className="feature-band"><div><span className="section-kicker">Built around your trip</span><h2>For business, airport and private travel.</h2><p>From a Schiphol connection to a day trip to Giethoorn, Keukenhof or Zaanse Schans, tell us what you have planned. We will talk through the journey with you.</p><Link href="/services" className="text-link" data-testid="link-about-services">Explore our services <ArrowRight size={15} /></Link></div><div className="quote-panel"><ShieldCheck size={28} color="#9a741f" /><h2>People-first support</h2><p>Reach the team by phone to discuss travel arrangements and ask questions before you travel.</p><a href={business.phoneLink} className="text-link" data-testid="link-about-phone">{business.phoneDisplay} <ArrowUpRight size={14} /></a></div></div>
      <Callout title="We’d be glad to hear about your trip." />
    </main>
  </>;
}

export function BlogPage() {
  usePageMeta('Travel Notes & Transfer Guides | Dutch Taxi Transfers', 'Practical travel notes for Schiphol Airport transfers, Amsterdam journeys and private travel in the Netherlands.');
  const articles = [
    { category: 'AIRPORT TRANSFERS', title: 'Getting ready for a Schiphol pickup', copy: 'A simple checklist for sharing the details that help a pickup go smoothly: flight information, terminal meeting plan, contact by phone and your onward destination.' },
    { category: 'AMSTERDAM', title: 'Planning a city transfer around your day', copy: 'Keep your pickup address and next stop close at hand. If plans include multiple stops, discuss the full route when arranging your journey.' },
    { category: 'DAY TRIPS', title: 'Taking a day beyond the city', copy: 'Considering Zaanse Schans, Giethoorn or Keukenhof? Talk through your preferred departure, return plan and how long you expect to spend at each stop.' },
  ];
  return <>
    <Intro eyebrow="Travel notes · Useful, not noisy" title="A little local context" accent="for the road.">Practical pointers for arranging airport, city and private transfers around Amsterdam and the Netherlands.</Intro>
    <main className="page-body">
      <div className="page-lede"><span className="section-kicker">From the passenger seat</span><h2>Helpful things to know before you go.</h2><p>Our travel notes focus on useful trip planning. For journey-specific advice, call the team and talk through your plans.</p></div>
      <div className="service-detail-grid">{articles.map((article, i) => <article className="service-detail blog-article" key={article.title} data-testid={`article-card-${i}`}><span className="service-index">{article.category}</span><div><h3>{article.title}</h3><p>{article.copy}</p></div><ArrowUpRight size={17} /></article>)}</div>
      <div className="feature-band"><div><span className="section-kicker">Planning a trip soon?</span><h2>Start with the details you already know.</h2><p>Pickup, destination, date, time, passengers and luggage give the team a helpful starting point when you call.</p></div><div className="quote-panel"><Clock3 size={28} color="#9a741f" /><h2>Support, around the clock</h2><p>Customer support is available 24/7. Contact the team by phone to discuss a transfer.</p><a href={business.phoneLink} className="text-link" data-testid="link-blog-phone">Call the team <ArrowRight size={15} /></a></div></div>
    </main>
  </>;
}

export function ContactPage() {
  usePageMeta('Contact Dutch Taxi Transfers | Call Amsterdam Taxi Service', 'Contact Dutch Taxi Transfers by phone to discuss Amsterdam taxi journeys, Schiphol transfers and private travel across the Netherlands.');
  return <>
    <Intro eyebrow="Contact · We’re here to help" title="Let’s talk about" accent="your journey.">For a quote, booking discussion or a question about your transfer, call Dutch Taxi Transfers directly.</Intro>
    <main className="page-body">
      <div className="contact-grid">
        <section className="contact-card"><span className="section-kicker">Call our team</span><h2>One direct line.</h2><p>Discuss your route, date and time, passenger count and luggage needs with the team. For airport transfers, keep your flight details handy.</p><a className="contact-phone" href={business.phoneLink} data-testid="link-contact-phone"><PhoneGlyph />{business.phoneDisplay}</a><ul className="contact-list"><li>24/7 customer support</li><li>Amsterdam · Schiphol · The Netherlands</li><li>Professional transport for business, airport and private travel</li></ul></section>
        <section className="contact-card"><span className="section-kicker">Before you call</span><h2>Have these details ready.</h2><ul className="contact-list"><li>Pickup address and destination</li><li>Your preferred date and pickup time</li><li>Number of passengers and amount of luggage</li><li>Flight details, if your journey includes Schiphol</li></ul><p style={{ marginTop: 18 }}>The website does not take reservations or confirm live fares. The team can discuss these with you by phone.</p></section>
      </div>
      <Callout title="Ready when you are." copy="Call to speak directly with Dutch Taxi Transfers." />
    </main>
  </>;
}

function PhoneGlyph() {
  return <span aria-hidden="true" className="phone-icon"><Phone size={19} /></span>;
}
