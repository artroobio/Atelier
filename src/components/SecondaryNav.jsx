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
          <a href="/" className="menu-item-link" onClick={() => setMenuOpen(false)}>Home</a>
          <a href="/projects" className="menu-item-link" onClick={() => setMenuOpen(false)}>Projects</a>
          <a href="/services" className="menu-item-link" onClick={() => setMenuOpen(false)}>Services</a>
          <a href="/blog" className="menu-item-link" onClick={() => setMenuOpen(false)}>Blog</a>
          <a href="/contact" className="menu-item-link" onClick={() => setMenuOpen(false)}>Contact</a>
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
          z-index: 1000;
          pointer-events: none;
        }
        .menu-btn {
          position: absolute;
          top: 40px;
          right: 40px;
          padding: 12px 30px;
          background: rgba(255, 255, 255, 0.15);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 100px;
          pointer-events: auto;
          cursor: pointer;
          color: #fff;
          font-family: 'Michroma', sans-serif;
          font-size: 0.8rem;
          font-weight: 600;
          letter-spacing: 2px;
          text-transform: uppercase;
          transition: all 0.3s ease;
          z-index: 1100;
        }
        .menu-btn:hover {
          background: rgba(255, 255, 255, 0.25);
          transform: translateY(-2px);
        }
        .menu-overlay {
          position: fixed;
          top: 0;
          right: -100%;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.8);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          z-index: 1050;
          display: flex;
          flex-direction: row;
          align-items: center;
          padding: 0 100px;
          box-sizing: border-box;
          pointer-events: auto;
        }
        .menu-left-side {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 15px;
        }
        .menu-item-link {
          color: #fff;
          font-family: 'Michroma', sans-serif;
          font-size: clamp(2rem, 5vw, 4.5rem);
          font-weight: 400;
          text-decoration: none;
          line-height: 1.1;
          opacity: 0;
          transform: translateX(50px);
          transition: color 0.3s ease;
          display: block;
          width: fit-content;
          text-transform: uppercase;
        }
        .menu-item-link:hover {
          color: #00ffcc;
        }
        .menu-footer-right {
          position: absolute;
          bottom: 60px;
          right: 60px;
          text-align: right;
          font-family: 'Michroma', sans-serif;
          color: #fff;
          opacity: 0;
          transform: translateY(20px);
        }
        .brand-title {
          font-size: 0.9rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 4px;
          display: block;
          margin-bottom: 8px;
        }
        .address-line {
          font-size: 0.8rem;
          font-weight: 300;
          line-height: 1.6;
          display: block;
          letter-spacing: 1px;
          color: rgba(255,255,255,0.6);
        }
        @media (max-width: 768px) {
          .menu-btn { top: 20px; right: 20px; padding: 10px 22px; font-size: 0.7rem; }
          .menu-overlay { padding: 0 32px; }
          .menu-item-link { font-size: 2.2rem; }
          .menu-footer-right { bottom: 32px; right: 32px; }
        }
      `}} />
    </div>
  );
}
