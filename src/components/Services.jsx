import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

function detectMobile() {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(max-width: 768px)').matches;
}

const services = [
  {
    id: '01',
    label: 'Vision',
    title: 'Architectural <i class="italic font-light">Strategy</i>.',
    text: 'We define the spatial DNA of your project. From conceptual massing to functional flow, we ensure every square inch serves a purpose.',
    image: 'https://assets.zyrosite.com/A3QlOV94WLSaL6xE/modern-office-space-with-futuristic-decor-furniture-tWDr3G3kPWyBeBbj.jpg',
    alt: 'Strategy',
  },
  {
    id: '02',
    label: 'Honesty',
    title: 'Material <i class="italic font-light">Integrity</i>.',
    text: 'Curating the tactile world. We select materials that age with grace and possess structural honesty, ensuring longevity and timelessness.',
    video: 'https://assets.zyrosite.com/AGBzPMBJDQiwDGny/grey-home-interior-design-video-M13Xi8TTbaVTMRqP.mp4',
  },
];

function wrapWords(el) {
  if (!el) return;
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
}

export default function Services() {
  const rootRef = useRef(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    if (detectMobile()) {
      // Simple fade-in for mobile
      gsap.fromTo(root.querySelectorAll('.process-panel'), 
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 1, stagger: 0.2, ease: 'power2.out', scrollTrigger: {
          trigger: root,
          start: 'top 80%',
        }}
      );
      return;
    }

    const ctx = gsap.context(() => {
      const container = root.querySelector('.horizontal-container');
      const progressBar = root.querySelector('.progress-bar');
      const sectionPanels = gsap.utils.toArray('.process-panel');

      sectionPanels.forEach((panel) => {
        const title = panel.querySelector('.process-title');
        wrapWords(title);
      });

      const scrollTween = gsap.to(container, {
        x: () => -(container.scrollWidth - window.innerWidth),
        ease: 'none',
        scrollTrigger: {
          trigger: root,
          pin: true,
          scrub: 0.8,
          start: 'top top',
          end: () => `+=${container.scrollWidth}`,
          onUpdate: (self) => {
            if (progressBar) progressBar.style.width = `${self.progress * 100}%`;
          },
        },
      });

      sectionPanels.forEach((panel, index) => {
        const titleWords = panel.querySelectorAll('.reveal-word');
        const annotation = panel.querySelector('.glass-annotation');
        const imageWrap = panel.querySelector('.process-image-wrap');
        const startTrigger = index === 0 ? 'left 120%' : 'left 65%';

        gsap.timeline({
          scrollTrigger: {
            trigger: panel,
            containerAnimation: scrollTween,
            start: startTrigger,
            toggleActions: 'play none none reverse',
          },
        })
          .fromTo(
            titleWords,
            { opacity: 0, y: 30, filter: 'blur(15px)' },
            { opacity: 1, y: 0, filter: 'blur(0px)', duration: 1, stagger: 0.05, ease: 'power4.out' }
          )
          .fromTo(
            annotation,
            { opacity: 0, x: 60, y: 10 },
            { opacity: 1, x: 0, y: 0, duration: 1.2, ease: 'power3.out' },
            '-=0.6'
          )
          .fromTo(
            imageWrap,
            { scale: 1.1, opacity: 0, x: -50 },
            { scale: 1, opacity: 1, x: 0, duration: 1.5, ease: 'expo.out' },
            '-=1.2'
          );
      });
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section id="services-section-root" ref={rootRef} className="services-section">
      <div className="bg-grid"></div>

      <div className="services-header-fixed">
        <span class="services-kicker">Our Expertise</span>
        <h1 class="services-main-title">Disciplines</h1>
      </div>

      <div className="progress-track">
        <div className="progress-bar"></div>
      </div>

      <div className="horizontal-container">
        {services.map((service) => (
          <section
            key={service.id}
            className="process-panel"
          >
            <span className="panel-number">{service.id}</span>
            <div className="process-panel-inner">
              <div className="process-copy-column">
                <span className="process-label">{service.label}</span>
                <h2
                  className="process-title"
                  data-html={service.title}
                  dangerouslySetInnerHTML={{ __html: service.title }}
                ></h2>
                <div className="glass-annotation">
                  <p className="process-annotation-text">
                    {service.text}
                  </p>
                </div>
              </div>
              <div className="process-media-column">
                <div className="process-image-wrap interactive-card">
                  {service.video ? (
                    <video
                      className="main-process-media"
                      autoPlay
                      muted
                      loop
                      playsInline
                      preload="none"
                      src={service.video}
                    />
                  ) : (
                    <img
                      className="main-process-media"
                      src={service.image}
                      alt={service.alt}
                      loading="lazy"
                    />
                  )}
                </div>
              </div>
            </div>
          </section>
        ))}
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .services-section {
          position: relative;
          width: 100%;
          background: #f2f2f2;
          color: #1a1a1a;
          overflow: hidden;
        }

        .services-header-fixed {
          position: absolute;
          top: 80px;
          left: 60px;
          z-index: 10;
        }

        .services-kicker {
          font-family: 'Inter', sans-serif;
          font-size: 10px;
          font-weight: 600;
          letter-spacing: 0.5em;
          text-transform: uppercase;
          color: rgba(0,0,0,0.4);
          display: block;
          margin-bottom: 12px;
        }

        .services-main-title {
          font-family: 'Playfair Display', serif;
          font-size: 4rem;
          font-weight: 400;
          margin: 0;
          line-height: 1;
        }

        .horizontal-container {
          display: flex;
          height: 100vh;
          width: fit-content;
          will-change: transform;
        }

        .process-panel {
          width: 100vw;
          height: 100vh;
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0 100px;
          position: relative;
        }

        .panel-number {
          position: absolute;
          top: 80px;
          right: 100px;
          font-family: 'Playfair Display', serif;
          font-size: 8rem;
          font-weight: 400;
          opacity: 0.05;
          line-height: 1;
        }

        .process-panel-inner {
          display: grid;
          grid-template-columns: 1fr 1.2fr;
          gap: 100px;
          align-items: center;
          max-width: 1400px;
          width: 100%;
        }

        .process-label {
          font-family: 'Inter', sans-serif;
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.3em;
          text-transform: uppercase;
          color: #000;
          margin-bottom: 24px;
          display: block;
        }

        .process-title {
          font-family: 'Playfair Display', serif;
          font-size: clamp(2.5rem, 5vw, 5rem);
          line-height: 1.1;
          margin: 0 0 40px;
          font-weight: 400;
        }

        .glass-annotation {
          background: rgba(255, 255, 255, 0.4);
          backdrop-filter: blur(20px);
          padding: 32px;
          border-radius: 12px;
          border: 1px solid rgba(255,255,255,0.6);
          max-width: 450px;
        }

        .process-annotation-text {
          font-family: 'Inter', sans-serif;
          font-size: 1rem;
          line-height: 1.6;
          font-weight: 300;
          margin: 0;
          color: #333;
        }

        .process-image-wrap {
          width: 100%;
          aspect-ratio: 4/5;
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 50px 100px rgba(0,0,0,0.1);
        }

        .main-process-media {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .progress-track {
          position: absolute;
          bottom: 60px;
          left: 100px;
          right: 100px;
          height: 1px;
          background: rgba(0,0,0,0.1);
          z-index: 10;
        }

        .progress-bar {
          height: 100%;
          background: #000;
          width: 0%;
        }

        .reveal-word {
          display: inline-block;
          white-space: pre;
        }

        @media (max-width: 768px) {
          .services-header-fixed {
            position: relative;
            top: 0;
            left: 0;
            padding: 80px 24px 0;
          }
          .services-main-title {
            font-size: 3rem;
          }
          .horizontal-container {
            flex-direction: column;
            height: auto;
            width: 100%;
          }
          .process-panel {
            width: 100%;
            height: auto;
            padding: 60px 24px;
          }
          .process-panel-inner {
            grid-template-columns: 1fr;
            gap: 40px;
          }
          .panel-number {
            display: none;
          }
          .process-image-wrap {
            aspect-ratio: 1/1;
          }
          .progress-track {
            display: none;
          }
        }
      ` }} />
    </section>
  );
}
