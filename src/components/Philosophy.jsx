import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

function wrapWords(el) {
  if (!el || el.dataset.wrapped === '1') return;
  const text = el.innerHTML;
  const words = text.split(/(\s+|<br\/?>|<\/?[^>]+>)/g);
  el.innerHTML = words
    .map((word) => {
      if (word.trim().length > 0 && !word.startsWith('<')) {
        return `<span class="reveal-word">${word}</span>`;
      }
      return word;
    })
    .join('');
  el.dataset.wrapped = '1';
}

export default function Philosophy() {
  const rootRef = useRef(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const isMobile = window.matchMedia('(max-width: 768px)').matches;
    const heading = root.querySelector('#heading');

    if (isMobile) {
      root.classList.add('no-anim');
      return;
    }

    wrapWords(heading);

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: root,
          start: 'top 60%',
        },
      });

      tl.to('#vertical-line', { height: '100%', duration: 2, ease: 'power4.inOut' });
      tl.to('#tagline', { filter: 'blur(0px)', opacity: 1, y: 0, duration: 1, ease: 'power2.out' }, '-=1.5');
      tl.to('#heading .reveal-word', { filter: 'blur(0px)', opacity: 1, y: 0, duration: 1.5, stagger: 0.04, ease: 'power4.out' }, '-=1.4');
      tl.to('#body-card', { filter: 'blur(0px)', opacity: 1, y: 0, duration: 1.2, ease: 'power3.out' }, '-=1.2');
      tl.to('#card-paragraph', {
        clipPath: 'inset(0 0% 0 0)',
        duration: 2.4,
        ease: 'power2.inOut',
      }, '-=0.9');
      tl.fromTo(
        '#card-grid .reveal-item',
        { opacity: 0, y: 20, filter: 'blur(10px)' },
        { opacity: 1, y: 0, filter: 'blur(0px)', duration: 1, stagger: 0.2, ease: 'power2.out' },
        '-=1.2'
      );
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={rootRef} id="philosophy" className="philosophy-section">
      <div className="bg-architectural" aria-hidden="true"></div>
      <div className="line-accent" id="vertical-line"></div>

      <div className="philosophy-inner">
        <span className="philosophy-tagline blur-reveal" id="tagline">
          01 — The Philosophy of Clarity
        </span>

        <h2 className="philosophy-heading" id="heading">
          Structure is <i>silent</i>. <br />
          Transparency is <i>infinite</i>.
        </h2>

        <div className="glass-card-premium blur-reveal" id="body-card">
          <p className="philosophy-paragraph" id="card-paragraph">
            We don't build walls; we define atmospheres. By stripping away the opaque, we invite the horizon inside. Architecture is no longer a barrier, but a <span className="emphasis">dialogue</span> between the human soul and the surrounding void.
          </p>

          <div className="philosophy-grid" id="card-grid">
            <div className="reveal-item">
              <div className="grid-heading-row">
                <div className="grid-rule"></div>
                <h4>The Lens</h4>
              </div>
              <p>A medium that amplifies natural light and frames existence without interference.</p>
            </div>
            <div className="reveal-item">
              <div className="grid-heading-row">
                <div className="grid-rule"></div>
                <h4>Raw Honesty</h4>
              </div>
              <p>Honoring the structural integrity of glass, steel, and air in their purest states.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
