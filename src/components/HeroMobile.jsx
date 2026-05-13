import { useEffect, useState } from 'react';
import gsap from 'gsap';

const SplitText = ({ children, className }) => (
  <span className={className}>
    {children.split('').map((char, i) => (
      <span key={i} className="char" style={{ opacity: 0, display: 'inline-block' }}>
        {char}
      </span>
    ))}
  </span>
);

export default function HeroMobile({ onMenuToggle, menuOpen }) {
  useEffect(() => {
    gsap.set('.menu-btn', { y: 0, opacity: 1 });
    gsap.set('.tagline', { opacity: 1 });
    gsap.set('.hero-header .char', { x: 0, opacity: 1, filter: 'blur(0px)' });
    gsap.set('.glass-card', { y: 0, opacity: 1 });
  }, []);

  useEffect(() => {
    const overlay = document.querySelector('.menu-overlay');
    const items = document.querySelectorAll('.menu-item-link');
    const footer = document.querySelector('.menu-footer-right');
    if (menuOpen) {
      gsap.set(overlay, { right: 0 });
      gsap.set(items, { opacity: 1, x: 0 });
      gsap.set(footer, { opacity: 1, y: 0 });
      gsap.set('.hero-header', { opacity: 0 });
      gsap.set('.glass-card', { opacity: 0 });
    } else {
      gsap.set(overlay, { right: '-100%' });
      gsap.set(items, { opacity: 0, x: 50 });
      gsap.set(footer, { opacity: 0, y: 20 });
      gsap.set('.hero-header', { opacity: 1 });
      gsap.set('.glass-card', { opacity: 1 });
    }
  }, [menuOpen]);

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      <video
        className="hero-mobile-video"
        autoPlay
        muted
        loop
        playsInline
        src="https://assets.zyrosite.com/AGBzPMBJDQiwDGny/grey-home-interior-design-video-M13Xi8TTbaVTMRqP.mp4"
      />
      <div className="hero-mobile-overlay" />

      <div className="ui-layer">
        <div className="menu-btn" onClick={() => onMenuToggle(!menuOpen)}>
          {menuOpen ? 'Close' : 'Menu'}
        </div>

        <div className="menu-overlay">
          <div className="menu-left-side">
            <a href="/" className="menu-item-link" onClick={() => onMenuToggle(false)}>Projects</a>
            <a href="/services" className="menu-item-link" onClick={() => onMenuToggle(false)}>Services</a>
            <a href="/" className="menu-item-link" onClick={() => onMenuToggle(false)}>Studio</a>
            <a href="/" className="menu-item-link" onClick={() => onMenuToggle(false)}>Archive</a>
            <a href="mailto:inquiries@atelierevo.com" className="menu-item-link" onClick={() => onMenuToggle(false)}>Contact</a>
          </div>
          <div className="menu-footer-right">
            <span className="brand-title">Atelier Evo</span>
            <span className="address-line">42nd Penthouse Floor, Void Tower<br />Zurich, Switzerland 8001</span>
          </div>
        </div>

        <div className="hero-header">
          <span className="tagline">Collection 2026</span>
          <h1>
            <div style={{ overflow: 'hidden', whiteSpace: 'nowrap' }}><SplitText>Bespoke</SplitText></div>
            <div style={{ overflow: 'hidden', whiteSpace: 'nowrap' }}><SplitText>Architectural</SplitText></div>
            <div style={{ overflow: 'hidden', whiteSpace: 'nowrap' }}><i><SplitText>Web Designs.</SplitText></i></div>
          </h1>
        </div>

        <div className="glass-card">
          <p>We craft immersive websites for interior architects and design studios. Through refined motion, spatial layouts, and visual storytelling, we transform portfolios into digital experiences.</p>
        </div>
      </div>
    </div>
  );
}
