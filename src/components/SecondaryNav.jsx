import React, { useState, useEffect } from 'react';
import gsap from 'gsap';

export default function SecondaryNav() {
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const overlay = document.querySelector('.menu-overlay');
    const items = document.querySelectorAll('.menu-item-link');
    const footer = document.querySelector('.menu-footer-right');

    if (menuOpen) {
      const tl = gsap.timeline();
      tl.to(overlay, { right: 0, duration: 1.2, ease: 'expo.inOut' });
      tl.to(items, { opacity: 1, x: 0, duration: 1, stagger: 0.08, ease: 'expo.out' }, '-=0.6');
      tl.to(footer, { opacity: 1, y: 0, duration: 1, ease: 'power3.out' }, '-=0.8');
    } else {
      const tl = gsap.timeline();
      tl.to(items, { opacity: 0, x: 50, duration: 0.6, stagger: 0.05, ease: 'power2.in' });
      tl.to(footer, { opacity: 0, y: 20, duration: 0.6 }, '-=0.6');
      tl.to(overlay, { right: '-100%', duration: 1, ease: 'expo.inOut' }, '-=0.4');
    }
  }, [menuOpen]);

  return (
    <div className="secondary-nav-layer">
      <div className="menu-btn" onClick={() => setMenuOpen(!menuOpen)} style={{ opacity: 1, transform: 'none' }}>
        {menuOpen ? 'Close' : 'Menu'}
      </div>

      <div className="menu-overlay">
        <div className="menu-left-side">
          <a href="/" className="menu-item-link" onClick={() => setMenuOpen(false)}>Projects</a>
          <a href="/services" className="menu-item-link" onClick={() => setMenuOpen(false)}>Services</a>
          <a href="/" className="menu-item-link" onClick={() => setMenuOpen(false)}>Studio</a>
          <a href="/" className="menu-item-link" onClick={() => setMenuOpen(false)}>Archive</a>
          <a href="mailto:inquiries@atelierevo.com" className="menu-item-link" onClick={() => setMenuOpen(false)}>Contact</a>
        </div>
        <div className="menu-footer-right">
          <span className="brand-title">Atelier Evo</span>
          <span className="address-line">42nd Penthouse Floor, Void Tower<br />Zurich, Switzerland 8001</span>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .secondary-nav-layer {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          z-index: 100;
          pointer-events: none;
        }
        .secondary-nav-layer .menu-btn {
          pointer-events: auto;
        }
        .secondary-nav-layer .menu-overlay {
          pointer-events: auto;
        }
      `}} />
    </div>
  );
}
