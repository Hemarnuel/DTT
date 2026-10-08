import { useState } from 'react';
import { ArrowUpRight, Menu, Phone, X } from 'lucide-react';
import { Link, useLocation } from 'wouter';
import { business } from './business-content';

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [location] = useLocation();
  return (
    <header className="topbar" id="top">
      <div className="topbar-inner">
        <Link className="wordmark" href="/" aria-label="Dutch Taxi Transfers home" onClick={() => setMenuOpen(false)} data-testid="link-brand-home">
          <span className="wordmark-seal" aria-hidden="true"><span>DT</span></span>
          <span className="wordmark-copy">
            <strong>Dutch <em>Taxi</em> Transfers</strong>
            <small>{business.regionTagline}</small>
          </span>
        </Link>
        <nav className={`main-nav${menuOpen ? ' is-open' : ''}`} aria-label="Main navigation">
          {business.nav.map((item) => (
            <Link key={item.label} href={item.href} aria-current={location === item.href ? 'page' : undefined} onClick={() => setMenuOpen(false)} data-testid={`link-nav-${item.label.toLowerCase().replaceAll(' ', '-')}`}>{item.label}</Link>
          ))}
          <a className="mobile-call" href={business.phoneLink} data-testid="link-mobile-call"><Phone size={15} /> Call our team</a>
        </nav>
        <div className="header-actions">
          <a className="header-phone" href={business.phoneLink} data-testid="link-call-header">
            <span className="phone-icon"><Phone size={15} /></span>
            <span><strong>{business.phoneDisplay}</strong><small>{business.supportCopy}</small></span>
          </a>
          <Link className="button button-gold header-book" href="/pricing" data-testid="link-book-header">
            Book Your Ride <ArrowUpRight size={15} />
          </Link>
          <button className="menu-toggle" type="button" aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'} aria-expanded={menuOpen} onClick={() => setMenuOpen(!menuOpen)} data-testid="button-mobile-menu">
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>
    </header>
  );
}
