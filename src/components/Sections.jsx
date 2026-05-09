import React, { useEffect, useRef, useState } from 'react';
import Hero from './Hero.jsx';
import Philosophy from './Philosophy.jsx';

export default function Sections() {
  const heroSlotRef = useRef(null);
  const philSlotRef = useRef(null);
  const [heroMounted, setHeroMounted] = useState(true);
  const [philMounted, setPhilMounted] = useState(false);

  useEffect(() => {
    const heroSlot = heroSlotRef.current;
    const philSlot = philSlotRef.current;
    if (!heroSlot || !philSlot) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.target === heroSlot) {
            setHeroMounted(entry.isIntersecting);
          } else if (entry.target === philSlot) {
            setPhilMounted(entry.isIntersecting);
          }
        }
      },
      { threshold: 0.05, rootMargin: '200px 0px' }
    );

    observer.observe(heroSlot);
    observer.observe(philSlot);
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <section ref={heroSlotRef} className="hero-slot">
        {heroMounted && <Hero />}
      </section>
      <div ref={philSlotRef} className="philosophy-slot">
        {philMounted && <Philosophy />}
      </div>
    </>
  );
}
