import { ArrowUpRight, Phone } from 'lucide-react';
import { Link } from 'wouter';
import { business } from './business-content';

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <Link className="footer-brand" href="/" data-testid="link-footer-home">{business.name}</Link>
        <p>{business.footerCopy}</p>
        <a href={business.phoneLink} data-testid="link-footer-phone"><Phone size={13} /> {business.phoneDisplay}</a>
        <span>{business.footerRegion}</span>
        <nav className="footer-nav" aria-label="Footer navigation">
          {business.nav.map((item) => <Link key={item.href} href={item.href} data-testid={`link-footer-${item.label.toLowerCase().replaceAll(' ', '-')}`}>{item.label}<ArrowUpRight size={11} /></Link>)}
        </nav>
      </div>
    </footer>
  );
}
