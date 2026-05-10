import React, { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

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

      gsap.fromTo(gridRef.current,
        { scale: 0.85, opacity: 0.5, borderRadius: '40px' },
        {
          scale: 1, opacity: 1, borderRadius: '0px', ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top bottom',
            end: 'top top',
            scrub: true,
          }
        }
      );

      gsap.fromTo('.gallery-sub-info',
        { y: 50, opacity: 0, filter: 'blur(15px)' },
        {
          y: 0, opacity: 1, filter: 'blur(0px)', duration: 1.8, ease: 'expo.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 98%',
            toggleActions: 'play none none none'
          }
        }
      );

      gsap.fromTo('.item-info-box',
        { y: 40, opacity: 0, scale: 0.9, filter: 'blur(10px)' },
        {
          y: 0, opacity: 1, scale: 1, filter: 'blur(0px)',
          duration: 1.4, stagger: 0.1, ease: 'power4.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 95%',
            toggleActions: 'play none none none'
          }
        }
      );

      gsap.utils.toArray('.gallery-item img').forEach(img => {
        gsap.fromTo(img,
          { y: -40 },
          {
            y: 40, ease: 'none',
            scrollTrigger: { trigger: img, start: 'top bottom', end: 'bottom top', scrub: true }
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
            <img src="/luxury_interior_vertical_1_1778345968849.png" alt="Luxury Interior 1" />
            <div className="item-info-box">
              <span className="info-label">RESIDENTIAL</span>
              <h3 className="info-title">Living Sanctuary</h3>
            </div>
          </div>
          <div className="gallery-item vertical">
            <img src="/luxury_interior_vertical_2_1778345994720.png" alt="Luxury Interior 2" />
            <div className="item-info-box">
              <span className="info-label">PRIVATE</span>
              <h3 className="info-title">Luminous Retreat</h3>
            </div>
          </div>
          <div className="gallery-item vertical">
            <img src="/luxury_interior_vertical_3_1778346010645.png" alt="Luxury Interior 3" />
            <div className="item-info-box">
              <span className="info-label">WELLNESS</span>
              <h3 className="info-title">Elemental Bath</h3>
            </div>
          </div>
        </div>

        {/* Bottom Row: 2 Horizontal Panels with Text Overlay */}
        <div className="gallery-row bottom-row">
          <div className="gallery-item horizontal">
            <img src="/luxury_interior_horizontal_1_1778346028371.png" alt="Luxury Interior 4" />
            <div className="item-info-box">
              <span className="info-label">PANORAMIC</span>
              <h3 className="info-title">The Vista Lounge</h3>
            </div>
          </div>
          <div className="gallery-item horizontal">
            <img src="/luxury_interior_horizontal_2_1778346049970.png" alt="Luxury Interior 5" />
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

