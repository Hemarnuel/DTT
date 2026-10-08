import { ArrowUpRight, Check, Clock3, ShieldCheck } from 'lucide-react';
import { business, reviewSummary } from './business-content';

export function TrustSection() {
  return (
    <section className="trust-section" id="about" aria-labelledby="trust-title">
      <div className="trust-left">
        <span className="section-kicker">{business.trust.eyebrow}</span>
        <h2 id="trust-title">{business.trust.titleLead}<br />{business.trust.titleAccent}</h2>
        <p>{business.trust.description}</p>
         <a className="text-link" href={business.phoneLink} data-testid="link-trust-phone">{business.trust.contactAction} <ArrowUpRight size={15} /></a>
      </div>
      <div className="trust-right">
        <div className="trust-quiet-card">
          <div className="trust-card-top"><span className="trust-symbol"><ShieldCheck size={19} /></span><span>{business.trust.serviceCardTitle}</span></div>
          <ul>{business.trustPoints.map((point) => <li key={point}><Check size={15} />{point}</li>)}</ul>
          <div className="support-seal"><Clock3 size={15} /><span>{business.trust.availabilityLabel}<br /><b>{business.trust.availability}</b></span></div>
        </div>
        <div className="review-card" aria-label={reviewSummary.rating && reviewSummary.count ? `${reviewSummary.rating} out of 5 based on ${reviewSummary.count} reviews` : 'Customer reviews'}>
          <span className="review-overline">{business.trust.reviewsEyebrow}</span>
          {reviewSummary.rating && reviewSummary.count ? (
            <div className="verified-rating"><strong>{reviewSummary.rating}</strong><span className="rating-stars" aria-label="Rating">{'★'.repeat(5)}</span><small>{reviewSummary.count} reviews</small></div>
          ) : (
            <div className="review-pending"><span className="review-mark">“</span><span>{business.trust.pendingReviewCopy}</span></div>
          )}
           <a href={business.trust.reviewsUrl} target="_blank" rel="noreferrer" data-testid="link-google-reviews">{business.trust.reviewsAction} <ArrowUpRight size={14} /></a>
          <small className="review-disclaimer">{reviewSummary.rating ? `Review data: ${reviewSummary.source ?? 'verified source'}` : business.trust.reviewDisclosure}</small>
        </div>
      </div>
    </section>
  );
}
