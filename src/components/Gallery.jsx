import React, { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

function detectMobile() {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(max-width: 768px)').matches;
}

export default function Gallery() {
  const sectionRef = useRef(null);
  const gridRef = useRef(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      if (detectMobile()) {
        // Reset all elements that start with GSAP initial states so they're visible immediately
        gsap.set(gridRef.current, { scale: 1, opacity: 1, borderRadius: '0px' });
        gsap.set('.gallery-sub-info', { opacity: 1, y: 0, filter: 'none' });
        gsap.set('.item-info-box', { opacity: 1, y: 0, scale: 1, filter: 'none' });
        return;
      }

      // Grid scale-in: scrub only scale+opacity, not borderRadius (paint op)
      gsap.set(gridRef.current, { borderRadius: '40px' });
      gsap.fromTo(gridRef.current,
        { scale: 0.85, opacity: 0.5 },
        {
          scale: 1, opacity: 1, ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top bottom',
            end: 'top top',
            scrub: 1,
            onEnter: () => gsap.set(gridRef.current, { borderRadius: '0px' }),
            onLeaveBack: () => gsap.set(gridRef.current, { borderRadius: '40px' }),
          }
        }
      );

      // Fade-in without blur — avoids creating extra compositing layers
      gsap.fromTo('.gallery-sub-info',
        { y: 30, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 1.4, ease: 'expo.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 98%',
            toggleActions: 'play none none none'
          }
        }
      );

      gsap.fromTo('.item-info-box',
        { y: 20, opacity: 0 },
        {
          y: 0, opacity: 1,
          duration: 1.0, stagger: 0.08, ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 95%',
            toggleActions: 'play none none none'
          }
        }
      );

      // Promote images to compositor layers only while they're parallaxing
      const imgs = gsap.utils.toArray('.gallery-item img');
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top bottom',
        end: 'bottom top',
        onEnter: () => imgs.forEach(img => { img.style.willChange = 'transform'; }),
        onLeave: () => imgs.forEach(img => { img.style.willChange = 'auto'; }),
        onEnterBack: () => imgs.forEach(img => { img.style.willChange = 'transform'; }),
        onLeaveBack: () => imgs.forEach(img => { img.style.willChange = 'auto'; }),
      });

      // Reduced parallax travel (20px instead of 80px) and scrub:1 to smooth bursts
      imgs.forEach(img => {
        gsap.fromTo(img,
          { y: -20 },
          {
            y: 20, ease: 'none',
            scrollTrigger: { trigger: img, start: 'top bottom', end: 'bottom top', scrub: 1 }
          }
        );
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="gallery-section">
      <div ref={gridRef} className="gallery-grid">
        {/* Top Row: 3 Vertical Panels */}
        <div className="gallery-row top-row">
          <div className="gallery-item vertical">
            <img src="/luxury_interior_vertical_1_1778345968849.png" alt="Luxury Interior 1" decoding="async" />
            <div className="item-info-box">
              <span className="info-label">RESIDENTIAL</span>
              <h3 className="info-title">Living Sanctuary</h3>
            </div>
          </div>
          <div className="gallery-item vertical">
            <img src="/luxury_interior_vertical_2_1778345994720.png" alt="Luxury Interior 2" loading="lazy" decoding="async" />
            <div className="item-info-box">
              <span className="info-label">PRIVATE</span>
              <h3 className="info-title">Luminous Retreat</h3>
            </div>
          </div>
          <div className="gallery-item vertical">
            <img src="/luxury_interior_vertical_3_1778346010645.png" alt="Luxury Interior 3" loading="lazy" decoding="async" />
            <div className="item-info-box">
              <span className="info-label">WELLNESS</span>
              <h3 className="info-title">Elemental Bath</h3>
            </div>
          </div>
        </div>

        {/* Bottom Row: 2 Horizontal Panels with Text Overlay */}
        <div className="gallery-row bottom-row">
          <div className="gallery-item horizontal">
            <img src="/luxury_interior_horizontal_1_1778346028371.png" alt="Luxury Interior 4" loading="lazy" decoding="async" />
            <div className="item-info-box">
              <span className="info-label">PANORAMIC</span>
              <h3 className="info-title">The Vista Lounge</h3>
            </div>
          </div>
          <div className="gallery-item horizontal">
            <img src="/luxury_interior_horizontal_2_1778346049970.png" alt="Luxury Interior 5" loading="lazy" decoding="async" />
            <div className="item-info-box">
              <span className="info-label">CULINARY</span>
              <h3 className="info-title">Gourmet Atelier</h3>
            </div>
          </div>

          <div className="gallery-text-overlay">
            <div className="gallery-sub-info">
              <p>CURATED FOR THE MODERN COLLECTOR.<br />UNCOMPROMISING PRECISION IN EVERY DETAIL.</p>
              <div className="gallery-links">
                <a href="#">DISCOVER MORE</a>
                <a href="#">THE COLLECTION</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

