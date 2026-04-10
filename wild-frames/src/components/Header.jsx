import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const navItems = [
  { path: '/', label: 'Home' },
  { path: '/gallery', label: 'Gallery' },
  { path: '/blog', label: 'Field Notes' },
  { path: '/about', label: 'About' }
];

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  return (
    <header className="site-header">
      <nav className="site-nav">
        <Link to="/" className="brand-mark" onClick={() => setIsMenuOpen(false)}>
          <span className="brand-mark__eyebrow">Wildlife Photography</span>
          <span className="brand-mark__name">WildFrames</span>
        </Link>

        <button
          type="button"
          className="menu-toggle"
          aria-expanded={isMenuOpen}
          aria-label="Toggle navigation menu"
          onClick={() => setIsMenuOpen((open) => !open)}
        >
          <span />
          <span />
          <span />
        </button>

        <div className={`nav-links ${isMenuOpen ? 'nav-links--open' : ''}`}>
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setIsMenuOpen(false)}
              className={location.pathname === item.path ? 'is-active' : ''}
            >
              {item.label}
            </Link>
          ))}
        </div>
      </nav>
    </header>
  );
};

export default Header;
