import { useEffect, useState, useRef } from 'react';
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
  const containerRef = useRef(null);
  const videoRef = useRef(null);
  const [mobileProgress, setMobileProgress] = useState(0);
  const mobileRevealedRef = useRef(false);
  const mobileTimeoutRef = useRef(null);

  // Skip loader if already seen this session
  useEffect(() => {
    if (sessionStorage.getItem('atelierHeroLoaded')) {
      const overlay = document.getElementById('mobile-loader');
      if (overlay) overlay.style.display = 'none';
      mobileRevealedRef.current = true;
    }
  }, []);

  // Cinematic reveal for mobile loader
  const triggerMobileReveal = () => {
    if (mobileRevealedRef.current) return;
    mobileRevealedRef.current = true;
    clearTimeout(mobileTimeoutRef.current);
    sessionStorage.setItem('atelierHeroLoaded', '1');
    const overlay = document.getElementById('mobile-loader');
    const bar = document.getElementById('mobile-progress-bar');
    const pct = document.getElementById('mobile-loader-percentage');
    if (bar) gsap.to(bar, { width: '100%', duration: 0.3 });
    if (pct) pct.innerText = '100%';
    setTimeout(() => {
      if (overlay) {
        gsap.to(overlay, {
          opacity: 0, scale: 1.06, filter: 'blur(18px)',
          duration: 1.1, ease: 'power2.inOut',
          onComplete: () => { overlay.style.display = 'none'; }
        });
      }
    }, 350);
  };

  // Video buffer tracking + 8-second fallback
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const updateBuffer = () => {
      try {
        if (video.buffered.length > 0 && video.duration > 0) {
          const frac = video.buffered.end(video.buffered.length - 1) / video.duration;
          const pct = Math.min(Math.round((frac / 0.3) * 100), 100);
          setMobileProgress(prev => {
            const next = Math.max(prev, pct);
            const bar = document.getElementById('mobile-progress-bar');
            const label = document.getElementById('mobile-loader-percentage');
            if (bar) gsap.to(bar, { width: `${next}%`, duration: 0.4, ease: 'power1.out', overwrite: true });
            if (label) label.innerText = `${next}%`;
            if (next >= 100) triggerMobileReveal();
            return next;
          });
        }
      } catch (e) {}
    };
    video.addEventListener('progress', updateBuffer);
    video.addEventListener('timeupdate', updateBuffer);
    video.addEventListener('canplaythrough', triggerMobileReveal);
    mobileTimeoutRef.current = setTimeout(triggerMobileReveal, 8000);
    return () => {
      video.removeEventListener('progress', updateBuffer);
      video.removeEventListener('timeupdate', updateBuffer);
      clearTimeout(mobileTimeoutRef.current);
    };
  }, []);

  // Play/pause video based on viewport visibility
  useEffect(() => {
    const video = videoRef.current;
    const container = containerRef.current;
    if (!video || !container) return;
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) video.play().catch(() => {});
      else video.pause();
    }, { threshold: 0.05 });
    obs.observe(container);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
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
    <div ref={containerRef} style={{ width: '100%', height: '100%', position: 'relative' }}>

      {/* Mobile Loader */}
      <div id="mobile-loader" className="loader-overlay">
        <div className="loader-brand">ATELIER EVO</div>
        <div className="loader-tagline">Crafting your experience</div>
        <div className="loader-bar"><div className="loader-progress" id="mobile-progress-bar"></div></div>
        <div id="mobile-loader-percentage" className="loader-percentage">0%</div>
      </div>

      <video
        ref={videoRef}
        className="hero-mobile-video"
        muted
        loop
        playsInline
        preload="auto"
        src="https://assets.zyrosite.com/A3QlOV94WLSaL6xE/3-hero-video-AtqA69jgkl8uQQj5.mp4"
      />
      <div className="hero-mobile-overlay" />

      <div className="ui-layer">
        <div className="menu-btn" onClick={() => onMenuToggle(!menuOpen)}>
          {menuOpen ? 'Close' : 'Menu'}
        </div>

        <div className="menu-overlay">
          <div className="menu-left-side">
            <a href="/" className="menu-item-link" onClick={() => onMenuToggle(false)}>Home</a>
            <a href="/" className="menu-item-link" onClick={() => onMenuToggle(false)}>Projects</a>
            <a href="/services" className="menu-item-link" onClick={() => onMenuToggle(false)}>Services</a>
            <a href="/" className="menu-item-link" onClick={() => onMenuToggle(false)}>Studio</a>
            <a href="/" className="menu-item-link" onClick={() => onMenuToggle(false)}>Archive</a>
            <a href="/blog" className="menu-item-link" onClick={() => onMenuToggle(false)}>Blog</a>
            <a href="/contact" className="menu-item-link" onClick={() => onMenuToggle(false)}>Contact</a>
          </div>
          <div className="menu-footer-right">
            <span className="brand-title">Atelier Evo</span>
            <span className="address-line">42nd Penthouse Floor, Void Tower<br />Zurich, Switzerland 8001</span>
          </div>
        </div>

        <div className="hero-header">
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
