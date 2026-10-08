import { ArrowRight, ArrowUpRight, Clock3 } from 'lucide-react';
import heroPhoto from '../assets/transfer-hero-wide.jpg';
import { business } from './business-content';

export function Hero() {
  return (
    <section className="hero" aria-labelledby="hero-title">
      <img className="hero-photo" src={heroPhoto} alt="Business traveller with luggage beside a black executive car outside a modern airport" fetchPriority="high" />
      <div className="hero-shade" aria-hidden="true" />
      <div className="hero-gridline" aria-hidden="true" />
      <div className="hero-inner">
        <div className="hero-copy">
          <div className="eyebrow"><span className="eyebrow-mark" />{business.hero.eyebrow}</div>
          <h1 id="hero-title">{business.hero.headlineLead}<br /><span>{business.hero.headlineAccent}</span></h1>
          <p className="hero-intro">{business.hero.description}</p>
          <div className="hero-ctas">
            <a className="button button-gold button-large" href="#quick-book" data-testid="link-book-hero">{business.hero.primaryAction} <ArrowRight size={17} /></a>
            <a className="button button-outline button-large" href="#quick-book" data-testid="link-quote-hero">{business.hero.secondaryAction} <ArrowUpRight size={16} /></a>
          </div>
          <div className="hero-assurance"><Clock3 size={15} /><span>{business.hero.assurance}</span></div>
        </div>
        <div className="hero-caption"><span>01 / 03</span><span className="caption-rule" /><span>Amsterdam · Schiphol</span></div>
      </div>
    </section>
  );
}
