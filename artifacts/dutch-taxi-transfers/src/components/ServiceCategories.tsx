import { ArrowUpRight } from 'lucide-react';
import { business } from './business-content';

export function ServiceCategories() {
  return (
    <section className="services-section" id="services" aria-labelledby="services-title">
      <div className="section-head" id="destinations">
          <div><span className="section-kicker">{business.servicesIntroduction.eyebrow}</span><h2 id="services-title">{business.servicesIntroduction.headlineLead}<br /><span>{business.servicesIntroduction.headlineAccent}</span></h2></div>
          <p>{business.servicesIntroduction.description}</p>
      </div>
      <div className="services-list">
        {business.services.map(({ title, description, Icon }, index) => (
          <a className="service-row" href="#quick-book" key={title} data-testid={`link-service-${index}`}>
            <span className="service-index">0{index + 1}</span>
            <span className="service-icon"><Icon size={21} strokeWidth={1.6} /></span>
            <span className="service-copy"><strong>{title}</strong><small>{description}</small></span>
            <ArrowUpRight className="service-arrow" size={18} />
          </a>
        ))}
      </div>
    </section>
  );
}
