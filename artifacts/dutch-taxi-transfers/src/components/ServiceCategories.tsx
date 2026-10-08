import { ArrowUpRight } from 'lucide-react';
import { Link } from 'wouter';
import type { CSSProperties } from 'react';
import { business } from './business-content';
import airportImage from '@/assets/transfer-hero-wide.jpg';
import cityImage from '@/assets/netherlands-transfer.jpg';
import sedanImage from '@/assets/fleet-sedan.jpg';
import airportCarImage from '@/assets/fleet-airport.jpg';
import vanImage from '@/assets/fleet-van.jpg';

const serviceImages = [airportImage, cityImage, sedanImage, airportCarImage, vanImage];

export function ServiceCategories() {
  return (
    <section className="services-section" id="services" aria-labelledby="services-title">
      <div className="section-head">
          <div><span className="section-kicker">{business.servicesIntroduction.eyebrow}</span><h2 id="services-title">{business.servicesIntroduction.headlineLead}<br /><span>{business.servicesIntroduction.headlineAccent}</span></h2></div>
          <p>{business.servicesIntroduction.description}</p>
      </div>
      <div className="services-list">
        {business.services.map(({ title, description, Icon }, index) => (
          <Link className="service-row" href="/services" key={title} data-testid={`link-service-${index}`}>
            <img
              className="service-photo"
              src={serviceImages[index % serviceImages.length]}
              alt=""
              aria-hidden="true"
              loading="lazy"
              width={1024}
              height={1024}
            />
            <span className="service-index">0{index + 1}</span>
            <span className="service-icon"><Icon size={21} strokeWidth={1.6} /></span>
            <span className="service-copy"><strong>{title}</strong><small>{description}</small></span>
            <span className="service-explore">Explore service <ArrowUpRight size={16} /></span>
            <ArrowUpRight className="service-arrow" size={18} />
          </Link>
        ))}
      </div>
    </section>
  );
}
