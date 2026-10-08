import { useState } from 'react';
import { ArrowUpRight, Menu, Phone, X } from 'lucide-react';
import { business } from './business-content';

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <header className="topbar" id="top">
      <div className="topbar-inner">
        <a className="wordmark" href="#top" aria-label="Dutch Taxi Transfers home">
          <span className="wordmark-seal" aria-hidden="true"><span>DT</span></span>
          <span className="wordmark-copy">
            <strong>Dutch <em>Taxi</em> Transfers</strong>
            <small>{business.regionTagline}</small>
          </span>
        </a>
        <nav className={`main-nav${menuOpen ? ' is-open' : ''}`} aria-label="Main navigation">
          {business.nav.map((item) => (
            <a key={item.label} href={item.href} onClick={() => setMenuOpen(false)}>{item.label}</a>
          ))}
          <a className="mobile-call" href={business.phoneLink}><Phone size={15} /> Call our team</a>
        </nav>
        <div className="header-actions">
          <a className="header-phone" href={business.phoneLink} data-testid="link-call-header">
            <span className="phone-icon"><Phone size={15} /></span>
            <span><strong>{business.phoneDisplay}</strong><small>{business.supportCopy}</small></span>
          </a>
          <a className="button button-gold header-book" href="#quick-book" data-testid="link-book-header">
            Book Your Ride <ArrowUpRight size={15} />
          </a>
          <button className="menu-toggle" type="button" aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'} aria-expanded={menuOpen} onClick={() => setMenuOpen(!menuOpen)} data-testid="button-mobile-menu">
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>
    </header>
  );
}
