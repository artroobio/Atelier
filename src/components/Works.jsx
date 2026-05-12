import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

function useMobile() {
  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== 'undefined' ? window.matchMedia('(max-width: 768px)').matches : false
  );
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 768px)');
    const update = () => setIsMobile(mq.matches);
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);
  return isMobile;
}

// Pre-wrap words once so we never mutate DOM on every cycle
function preWrap(html) {
  return html
    .split(/(\s+|<br\/?>|<\/?[^>]+>)/g)
    .map((token) =>
      token.trim().length > 0 && !token.startsWith('<')
        ? `<span class="reveal-word">${token}</span>`
        : token
    )
    .join('');
}

const segments = [
  {
    title: 'The Art of <i class="italic font-light">Void</i>.',
    tagline: '02 — Selected Portfolios',
    cardTitle: 'Materiality',
    cardDesc: 'Exploring how light interacts with translucent surfaces in modern commercial spaces.',
    cardTag: 'Featured Study',
  },
  {
    title: 'Monolithic <i class="italic font-light">Forms</i>.',
    tagline: '03 — Living Systems',
    cardTitle: 'Raw Textures',
    cardDesc: 'A deep contrast between heavy stone foundations and the lightness of architectural glass.',
    cardTag: 'Material Integrity',
  },
  {
    title: 'Infinite <i class="italic font-light">Flow</i>.',
    tagline: '04 — Spatial Dialogue',
    cardTitle: 'Soft Geometry',
    cardDesc: 'Dissolving the boundary between the internal lounge and the surrounding urban horizon.',
    cardTag: 'Atmospheric Design',
  },
  {
    title: 'Silent <i class="italic font-light">Sanctuary</i>.',
    tagline: '05 — Private Archive',
    cardTitle: 'Filtered Light',
    cardDesc: 'Designing the quiet intersection of restorative rest and structural transparency.',
    cardTag: 'Intimate Voids',
  },
];

// Pre-compute wrapped titles once at module load
const wrappedTitles = segments.map((s) => preWrap(s.title));

export default function Works() {
  const rootRef = useRef(null);
  const videoRef = useRef(null);
  const titleRef = useRef(null);
  const textOverlayRef = useRef(null);
  const cardOverlayRef = useRef(null);
  const timelineRef = useRef(null);
  const [index, setIndex] = useState(0);
  const isMobile = useMobile();

  // IntersectionObserver: play/pause video and cycling timeline
  useEffect(() => {
    const root = rootRef.current;
    const video = videoRef.current;
    if (!root) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          video?.play().catch(() => {});
          timelineRef.current?.resume();
        } else {
          video?.pause();
          timelineRef.current?.pause();
        }
      },
      { threshold: 0.1 }
    );
    observer.observe(root);
    return () => observer.disconnect();
  }, []);

  // Scroll pin + initial title reveal (desktop only)
  useEffect(() => {
    const root = rootRef.current;
    const titleEl = titleRef.current;
    if (!root || !titleEl || isMobile) return;

    // Set first pre-wrapped title
    titleEl.innerHTML = wrappedTitles[0];

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: root,
        start: 'top top',
        end: '+=185%',
        pin: true,
        pinSpacing: true,
      });

      gsap.to(titleEl.querySelectorAll('.reveal-word'), {
        filter: 'blur(0px)',
        opacity: 1,
        y: 0,
        duration: 1.5,
        stagger: 0.08,
        ease: 'power3.out',
        scrollTrigger: { trigger: root, start: 'top 60%' },
      });
    }, root);

    return () => ctx.revert();
  }, [isMobile]);

  // Cycling timeline (desktop only) — stored in ref so IntersectionObserver can pause it
  useEffect(() => {
    const textOverlay = textOverlayRef.current;
    const cardOverlay = cardOverlayRef.current;
    if (!textOverlay || !cardOverlay || isMobile) return;

    const master = gsap.timeline({ repeat: -1, paused: false });

    segments.forEach((_, i) => {
      master.to({}, { duration: 3.5 });

      master.to([textOverlay, cardOverlay], {
        opacity: 0,
        scale: 0.95,
        filter: 'blur(20px)',
        duration: 0.8,
        ease: 'power2.inOut',
        onComplete: () => {
          const next = (i + 1) % segments.length;
          setIndex(next);
          if (window.innerWidth > 900 && next % 2 !== 0) {
            textOverlay.className = 'cinematic-text-overlay pos-br text-white';
            cardOverlay.className = 'glass-morphism-card pos-tl text-white';
          } else {
            textOverlay.className = 'cinematic-text-overlay pos-tl text-white';
            cardOverlay.className = 'glass-morphism-card pos-br text-white';
          }
        },
      });

      master.to([textOverlay, cardOverlay], {
        opacity: 1,
        scale: 1,
        filter: 'blur(0px)',
        duration: 0.8,
        ease: 'power2.out',
      });
    });

    timelineRef.current = master;
    return () => master.kill();
  }, [isMobile]);

  // Animate title words when index changes (desktop only) — uses pre-wrapped HTML
  useEffect(() => {
    const titleEl = titleRef.current;
    if (!titleEl || isMobile) return;
    titleEl.innerHTML = wrappedTitles[index];
    gsap.fromTo(
      titleEl.querySelectorAll('.reveal-word'),
      { opacity: 0, y: 15, filter: 'blur(10px)' },
      { opacity: 1, y: 0, filter: 'blur(0px)', duration: 1.0, stagger: 0.04, ease: 'power2.out' }
    );
  }, [index, isMobile]);

  const data = segments[index];

  return (
    <section
      id="works-section-root"
      ref={rootRef}
      className={isMobile ? 'works-static' : ''}
    >
      <div className="video-hero-container">
        <video
          ref={videoRef}
          className="video-bg-works"
          autoPlay
          muted
          loop
          playsInline
          preload="none"
          src="https://assets.zyrosite.com/AGBzPMBJDQiwDGny/grey-home-interior-design-video-M13Xi8TTbaVTMRqP.mp4"
        />

        <div ref={textOverlayRef} className="cinematic-text-overlay pos-tl text-white">
          <span
            className="block"
            style={{
              fontFamily: 'Inter',
              fontWeight: 600,
              fontSize: '12px',
              letterSpacing: '0.6em',
              textTransform: 'uppercase',
              marginBottom: '24px',
              opacity: 0.6,
            }}
          >
            {data.tagline}
          </span>
          <h1
            ref={titleRef}
            className="works-hero-title"
            dangerouslySetInnerHTML={{ __html: data.title }}
          />
        </div>

        <div ref={cardOverlayRef} className="glass-morphism-card pos-br text-white">
          <span
            style={{
              fontSize: '10px',
              textTransform: 'uppercase',
              letterSpacing: '0.3em',
              marginBottom: '12px',
              display: 'block',
              fontWeight: 600,
              opacity: 0.6,
            }}
          >
            {data.cardTag}
          </span>
          <h3
            style={{
              fontFamily: 'Playfair Display',
              fontSize: 'clamp(1.25rem, 3vw, 1.875rem)',
              marginBottom: '16px',
              fontStyle: 'italic',
              color: '#fff',
            }}
          >
            {data.cardTitle}
          </h3>
          <p style={{ fontSize: '0.875rem', fontWeight: 300, lineHeight: 1.625, opacity: 0.8, color: '#fff' }}>
            {data.cardDesc}
          </p>
          <div style={{ marginTop: '32px', paddingTop: '16px', borderTop: '1px solid rgba(255,255,255,0.2)' }}>
            <a
              href="#"
              style={{
                fontSize: '10px',
                textTransform: 'uppercase',
                letterSpacing: '0.4em',
                opacity: 0.6,
                transition: 'opacity 0.3s',
                textDecoration: 'none',
                color: '#fff',
              }}
            >
              Explore Detail —
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
