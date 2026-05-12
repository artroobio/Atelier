import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

function detectMobile() {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(max-width: 768px)').matches;
}

function wrapWords(el) {
    if (!el) return;
    const text = el.innerHTML;
    const words = text.split(/(\s+|<br\/?>|<\/?[^>]+>)/g);
    
    el.innerHTML = words.map(word => {
        if (word.trim().length > 0 && !word.startsWith('<')) {
            return `<span class="reveal-word">${word}</span>`;
        }
        return word;
    }).join('');
}

export default function Philosophy() {
    const rootRef = useRef(null);

    useEffect(() => {
        const root = rootRef.current;
        if (!root) return;

        const heading = root.querySelector('#heading');
        wrapWords(heading);

        if (detectMobile()) {
            root.querySelectorAll('.reveal-word').forEach((word) => {
                word.style.filter = 'none';
                word.style.opacity = '1';
                word.style.transform = 'none';
            });
            root.querySelectorAll('.blur-reveal, .reveal-item').forEach((el) => {
                el.style.filter = 'none';
                el.style.opacity = '1';
                el.style.transform = 'none';
            });
            const line = root.querySelector('#vertical-line');
            if (line) line.style.height = '100%';
            return;
        }

        const ctx = gsap.context(() => {
            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: root,
                    start: 'top 80%',
                    toggleActions: 'play none none none'
                }
            });

            tl.to('#vertical-line', { height: '100%', duration: 2, ease: 'power4.inOut' });
            tl.to('#tagline', { filter: 'blur(0px)', opacity: 1, y: 0, duration: 1.2, ease: 'power3.out' }, '-=1.5');
            tl.to('#heading .reveal-word', { 
                filter: 'blur(0px)', 
                opacity: 1, 
                y: 0, 
                duration: 1.5, 
                stagger: 0.04, 
                ease: 'power4.out' 
            }, '-=1.2');
            tl.to('#body-card', { filter: 'blur(0px)', opacity: 1, y: 0, duration: 1.2, ease: 'power3.out' }, '-=1.2');
            tl.to('.reveal-item', { opacity: 1, y: 0, duration: 0.8, stagger: 0.2, ease: 'power2.out' }, '-=0.8');
        }, root);

        return () => ctx.revert();
    }, []);

    return (
        <section 
            ref={rootRef}
            id="philosophy" 
            className="philosophy-section-new"
        >
            <div className="bg-architectural"></div>
            <div className="absolute-line" id="vertical-line"></div>

            <div className="philosophy-content-wrapper">
                <span className="philosophy-tagline-new blur-reveal" id="tagline">
                    01 — The Philosophy of Clarity
                </span>

                <h2 className="philosophy-heading-new" id="heading">
                    Structure is <i className="italic-font">silent</i>. <br/>
                    Transparency is <i className="italic-font">infinite</i>.
                </h2>

                <div className="glass-card-premium-new blur-reveal" id="body-card">
                    <p className="philosophy-para-new" id="card-paragraph">
                        We don't build walls; we define atmospheres. By stripping away the opaque, we invite the horizon inside. Architecture is no longer a barrier, but a <span className="font-bold-italic">dialogue</span> between the human soul and the surrounding void.
                    </p>
                    
                    <div className="philosophy-grid-new" id="card-grid">
                        <div className="reveal-item reveal-item-init">
                            <div className="flex-row-center-gap">
                                <div className="accent-bar"></div>
                                <h4 className="sub-heading-new">The Lens</h4>
                            </div>
                            <p className="sub-text-new">A medium that amplifies natural light and frames existence without interference.</p>
                        </div>
                        <div className="reveal-item reveal-item-init">
                            <div className="flex-row-center-gap">
                                <div className="accent-bar"></div>
                                <h4 className="sub-heading-new">Raw Honesty</h4>
                            </div>
                            <p className="sub-text-new">Honoring the structural integrity of glass, steel, and air in their purest states.</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
