import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

function detectMobile() {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(max-width: 768px)').matches;
}

const panels = [
  {
    id: '01',
    label: 'The Genesis',
    title: 'Raw <i class="italic font-light">Sketch</i>.',
    text: 'Every structure begins with a gesture. Initial drafts capture the raw energy and potential of the space.',
    image: 'https://assets.zyrosite.com/A3QlOV94WLSaL6xE/modern-office-space-with-futuristic-decor-furniture-tWDr3G3kPWyBeBbj.jpg',
    alt: 'Sketch',
  },
  {
    id: '02',
    label: 'Precision',
    title: 'Digital <i class="italic font-light">Void</i>.',
    text: 'Calculated transparency. We map the refractive index of every pane, ensuring the disappearance of the boundary is absolute.',
    image: 'https://assets.zyrosite.com/A3QlOV94WLSaL6xE/shot-panoramic-composition-library-vfOqabRkgVEFwqi9.jpg',
    alt: 'Wireframe',
  },
  {
    id: '03',
    label: 'Selection',
    title: 'Solid <i class="italic font-light">Glass</i>.',
    text: 'We curate high-iron glass and obsidian-grade steel. The tactile journey of material selection is rigorous and precise.',
    image: 'https://assets.zyrosite.com/A3QlOV94WLSaL6xE/hold9998_cobden-st_in12_double-height-penthouse-void-tastTN8YGC6w7PC2.jpg',
    alt: 'Material',
  },
  {
    id: '04',
    label: 'Manifestation',
    title: 'Living <i class="italic font-light">Space</i>.',
    text: 'The final atmosphere. Architecture manifested through structural honesty and cinematic presence.',
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

export default function Process() {
  const rootRef = useRef(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    if (detectMobile()) {
      root.querySelectorAll('.process-title').forEach((title) => {
        title.querySelectorAll('.reveal-word').forEach((word) => word.remove());
        title.innerHTML = title.dataset.html || title.innerHTML;
      });
      root.querySelectorAll('.glass-annotation, .process-image-wrap').forEach((el) => {
        el.style.opacity = '1';
        el.style.transform = 'none';
      });
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
            progressBar.style.width = `${self.progress * 100}%`;
          },
        },
      });

      sectionPanels.forEach((panel, index) => {
        const titleWords = panel.querySelectorAll('.reveal-word');
        const annotation = panel.querySelector('.glass-annotation');
        const imageWrap = panel.querySelector('.process-image-wrap');
        const media = panel.querySelector('.main-process-media');
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
    <section id="process-section-root" ref={rootRef}>
      <div className="bg-grid"></div>

      <div className="progress-track">
        <div className="progress-bar"></div>
      </div>

      <div className="horizontal-container">
        {panels.map((panel) => (
          <section
            key={panel.id}
            className="process-panel"
          >
            <span className="panel-number">{panel.id}</span>
            <div className="process-panel-inner">
              <div className="process-copy-column">
                <span className="process-label">{panel.label}</span>
                <h2
                  className="process-title"
                  data-html={panel.title}
                  dangerouslySetInnerHTML={{ __html: panel.title }}
                ></h2>
                <div className="glass-annotation">
                  <p className="process-annotation-text">
                    {panel.text}
                  </p>
                </div>
              </div>
              <div className="process-media-column">
                <div className="process-image-wrap interactive-card">
                  {panel.video ? (
                    <video
                      className="main-process-media"
                      autoPlay
                      muted
                      loop
                      playsInline
                    >
                      <source src={panel.video} type="video/mp4" />
                    </video>
                  ) : (
                    <img className="main-process-media" src={panel.image} alt={panel.alt} />
                  )}
                </div>
              </div>
            </div>
          </section>
        ))}
      </div>
    </section>
  );
}
