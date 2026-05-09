import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

function detectMobile() {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(max-width: 768px)').matches;
}

const segments = [
    {
        title: 'The Art of <i class="italic font-light">Void</i>.',
        tagline: '02 — Selected Portfolios',
        cardTitle: 'Materiality',
        cardDesc: 'Exploring how light interacts with translucent surfaces in modern commercial spaces.',
        cardTag: 'Featured Study'
    },
    {
        title: 'Monolithic <i class="italic font-light">Forms</i>.',
        tagline: '03 — Living Systems',
        cardTitle: 'Raw Textures',
        cardDesc: 'A deep contrast between heavy stone foundations and the lightness of architectural glass.',
        cardTag: 'Material Integrity'
    },
    {
        title: 'Infinite <i class="italic font-light">Flow</i>.',
        tagline: '04 — Spatial Dialogue',
        cardTitle: 'Soft Geometry',
        cardDesc: 'Dissolving the boundary between the internal lounge and the surrounding urban horizon.',
        cardTag: 'Atmospheric Design'
    },
    {
        title: 'Silent <i class="italic font-light">Sanctuary</i>.',
        tagline: '05 — Private Archive',
        cardTitle: 'Filtered Light',
        cardDesc: 'Designing the quiet intersection of restorative rest and structural transparency.',
        cardTag: 'Intimate Voids'
    }
];

function wrapWords(el) {
    if (!el) return;
    const text = el.innerHTML;
    // We only want to wrap actual text, not the tags themselves.
    const words = text.split(/(\s+|<br\/?>|<\/?[^>]+>)/g);
    
    el.innerHTML = words.map(word => {
        if (word.trim().length > 0 && !word.startsWith('<')) {
            return `<span class="reveal-word">${word}</span>`;
        }
        return word;
    }).join('');
}

export default function Works() {
    const rootRef = useRef(null);
    const titleRef = useRef(null);
    const textOverlayRef = useRef(null);
    const cardOverlayRef = useRef(null);
    const [index, setIndex] = useState(0);

    useEffect(() => {
        const root = rootRef.current;
        const titleEl = titleRef.current;
        if (!root || !titleEl) return;

        if (detectMobile()) {
            return;
        }

        const ctx = gsap.context(() => {
            wrapWords(titleEl);

            ScrollTrigger.create({
                trigger: root,
                start: "top top",
                end: "+=185%",
                pin: true,
                pinSpacing: true
            });

            gsap.to(titleEl.querySelectorAll('.reveal-word'), {
                filter: "blur(0px)",
                opacity: 1,
                y: 0,
                duration: 1.5,
                stagger: 0.08,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: root,
                    start: "top 60%"
                }
            });
        }, root);

        return () => ctx.revert();
    }, []);

    // Main cycling timeline
    useEffect(() => {
        const textOverlay = textOverlayRef.current;
        const cardOverlay = cardOverlayRef.current;
        if (!textOverlay || !cardOverlay) return;

        if (detectMobile()) {
            return;
        }

        const masterTimeline = gsap.timeline({ repeat: -1 });

        segments.forEach((_, i) => {
            // Wait 3.5s
            masterTimeline.to({}, { duration: 3.5 }); 

            // Transition out
            masterTimeline.to([textOverlay, cardOverlay], {
                opacity: 0,
                scale: 0.95,
                filter: "blur(20px)",
                duration: 0.8,
                ease: "power2.inOut",
                onComplete: () => {
                    const nextIndex = (i + 1) % segments.length;
                    setIndex(nextIndex);
                    
                    // Swap positions logic
                    if (window.innerWidth > 900 && nextIndex % 2 !== 0) {
                        textOverlay.className = "cinematic-text-overlay pos-br text-white";
                        cardOverlay.className = "glass-morphism-card pos-tl text-white";
                    } else {
                        textOverlay.className = "cinematic-text-overlay pos-tl text-white";
                        cardOverlay.className = "glass-morphism-card pos-br text-white";
                    }
                }
            });

            // Transition in
            masterTimeline.to([textOverlay, cardOverlay], {
                opacity: 1,
                scale: 1,
                filter: "blur(0px)",
                duration: 0.8,
                ease: "power2.out"
            });
        });

        return () => masterTimeline.kill();
    }, []);

    // Effect to re-animate text whenever index changes
    useEffect(() => {
        const titleEl = titleRef.current;
        if (!titleEl) return;

        if (detectMobile()) {
            return;
        }
        
        // Brief timeout to ensure DOM has updated with new title before wrapping
        setTimeout(() => {
            wrapWords(titleEl);
            gsap.fromTo(titleEl.querySelectorAll('.reveal-word'), 
                { opacity: 0, y: 15, filter: "blur(10px)" },
                { opacity: 1, y: 0, filter: "blur(0px)", duration: 1.0, stagger: 0.04, ease: "power2.out" }
            );
        }, 50);
    }, [index]);

    const data = segments[index];

    return (
        <section id="works-section-root" ref={rootRef} className={detectMobile() ? 'works-static' : ''}>
            <div className="video-hero-container">
                <video className="video-bg-works" autoPlay muted loop playsInline preload="auto">
                    <source src="https://assets.zyrosite.com/AGBzPMBJDQiwDGny/grey-home-interior-design-video-M13Xi8TTbaVTMRqP.mp4" type="video/mp4" />
                </video>

                <div ref={textOverlayRef} className="cinematic-text-overlay pos-tl text-white">
                    <span className="block" style={{ fontFamily: 'Inter', fontWeight: 600, fontSize: '12px', letterSpacing: '0.6em', textTransform: 'uppercase', marginBottom: '24px', opacity: 0.6 }}>
                        {data.tagline}
                    </span>
                    <h1 ref={titleRef} className="works-hero-title" dangerouslySetInnerHTML={{ __html: data.title }}></h1>
                </div>

                <div ref={cardOverlayRef} className="glass-morphism-card pos-br text-white">
                    <span style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.3em', marginBottom: '12px', display: 'block', fontWeight: 600, opacity: 0.6 }}>
                        {data.cardTag}
                    </span>
                    <h3 style={{ fontFamily: 'Playfair Display', fontSize: '1.875rem', marginBottom: '16px', fontStyle: 'italic', color: '#fff' }}>
                        {data.cardTitle}
                    </h3>
                    <p style={{ fontSize: '0.875rem', fontWeight: 300, lineHeight: 1.625, opacity: 0.8, color: '#fff' }}>
                        {data.cardDesc}
                    </p>
                    <div style={{ marginTop: '32px', paddingTop: '16px', borderTop: '1px solid rgba(255, 255, 255, 0.2)' }}>
                        <a href="#" style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.4em', opacity: 0.6, transition: 'opacity 0.3s', textDecoration: 'none', color: '#fff' }}>
                            Explore Detail —
                        </a>
                    </div>
                </div>
            </div>
        </section>
    );
}
