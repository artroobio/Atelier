import React, { useRef, useEffect, useState, useLayoutEffect, lazy, Suspense } from 'react';
import gsap from 'gsap';

// Mobile component — no Three.js dependency at all
const HeroMobile = lazy(() => import('./HeroMobile.jsx'));

// Desktop bundle — Three.js / r3f only loaded when needed
const HeroDesktop = lazy(() => import('./HeroDesktop.jsx'));

function detectMobile() {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(max-width: 768px)').matches;
}

export default function Hero() {
  const [isMobile, setIsMobile] = useState(() => detectMobile());
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 768px)');
    const update = () => setIsMobile(mq.matches);
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  return (
    <Suspense fallback={null}>
      {isMobile
        ? <HeroMobile menuOpen={menuOpen} onMenuToggle={setMenuOpen} />
        : <HeroDesktop menuOpen={menuOpen} onMenuToggle={setMenuOpen} />
      }
    </Suspense>
  );
}
