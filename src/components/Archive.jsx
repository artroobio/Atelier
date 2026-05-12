import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

const projectData = [
  { id: 0, year: '2024', name: 'Obsidian House',   loc: 'Zurich, CH',    tag: 'obsidian', img: 'https://assets.zyrosite.com/A3QlOV94WLSaL6xE/modern-office-space-with-futuristic-decor-furniture-tWDr3G3kPWyBeBbj.jpg', desc: 'A residence carved from dark stone, where light is treated as material.' },
  { id: 1, year: '2023', name: 'Glass Pavilion',   loc: 'Kyoto, JP',     tag: 'glass',    img: 'https://assets.zyrosite.com/A3QlOV94WLSaL6xE/shot-panoramic-composition-library-vfOqabRkgVEFwqi9.jpg', desc: 'Merging traditional aesthetics with total transparency.' },
  { id: 2, year: '2023', name: 'Void Tower',       loc: 'Berlin, DE',    tag: 'void',     img: 'https://assets.zyrosite.com/A3QlOV94WLSaL6xE/hold9998_cobden-st_in12_double-height-penthouse-void-tastTN8YGC6w7PC2.jpg', desc: 'A vertical exploration of negative space silhouettes.' },
  { id: 3, year: '2022', name: 'Crystal Gallery',  loc: 'New York, US',  tag: 'glass',    img: 'https://assets.zyrosite.com/A3QlOV94WLSaL6xE/modern-office-space-with-futuristic-decor-furniture-tWDr3G3kPWyBeBbj.jpg', desc: 'A museum where every surface refracts the city motion.' },
  { id: 4, year: '2022', name: 'The Prism',        loc: 'London, UK',    tag: 'light',    img: 'https://assets.zyrosite.com/A3QlOV94WLSaL6xE/shot-panoramic-composition-library-vfOqabRkgVEFwqi9.jpg', desc: 'Atmospheric volume through multi-layered glass facades.' },
  { id: 5, year: '2021', name: 'Basalt Studio',    loc: 'Reykjavik, IS', tag: 'obsidian', img: 'https://assets.zyrosite.com/A3QlOV94WLSaL6xE/hold9998_cobden-st_in12_double-height-penthouse-void-tastTN8YGC6w7PC2.jpg', desc: 'Subterranean creative studio in volcanic rock.' },
  { id: 6, year: '2021', name: 'Ethereal Wing',    loc: 'Paris, FR',     tag: 'void',     img: 'https://assets.zyrosite.com/A3QlOV94WLSaL6xE/modern-office-space-with-futuristic-decor-furniture-tWDr3G3kPWyBeBbj.jpg', desc: 'Floating minimalist workspace above the roofline.' },
  { id: 7, year: '2020', name: 'Lustre Centre',    loc: 'Milan, IT',     tag: 'glass',    img: 'https://assets.zyrosite.com/A3QlOV94WLSaL6xE/shot-panoramic-composition-library-vfOqabRkgVEFwqi9.jpg', desc: 'Italian design discipline enclosed in glass.' },
  { id: 8, year: '2020', name: 'Monolith Loft',    loc: 'Oslo, NO',      tag: 'obsidian', img: 'https://assets.zyrosite.com/A3QlOV94WLSaL6xE/hold9998_cobden-st_in12_double-height-penthouse-void-tastTN8YGC6w7PC2.jpg', desc: 'Sharp geometric volumes, Nordic silence.' },
  { id: 9, year: '2019', name: 'Horizon Loft',     loc: 'Sydney, AU',    tag: 'light',    img: 'https://assets.zyrosite.com/A3QlOV94WLSaL6xE/modern-office-space-with-futuristic-decor-furniture-tWDr3G3kPWyBeBbj.jpg', desc: 'Infinite glass coastal spans.' },
];

const filters = ['all', 'glass', 'obsidian', 'light', 'void'];

export default function Archive() {
  const [filter, setFilter] = useState('all');
  const [isTransitioning, setIsTransitioning] = useState(false);
  const gridRef = useRef(null);
  const sectionRef = useRef(null);
  const hasEnteredRef = useRef(false);

  const filtered = filter === 'all' ? projectData : projectData.filter(p => p.tag === filter);

  // Entry animation — fires once when grid scrolls into view
  useEffect(() => {
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top 80%',
        onEnter: () => {
          hasEnteredRef.current = true;
          gsap.fromTo('.archive-letterbox-item',
            { opacity: 0, y: 30 },
            { opacity: 1, y: 0, duration: 1.0, stagger: 0.07, ease: 'power3.out' }
          );
        },
      });
    });
    return () => ctx.revert();
  }, []);

  // Filter transition — blur out, swap, blur in
  const handleFilter = (tag) => {
    if (tag === filter || isTransitioning) return;
    setIsTransitioning(true);

    gsap.to('.archive-letterbox-item', {
      opacity: 0,
      y: -12,
      duration: 0.3,
      stagger: 0.02,
      ease: 'power2.in',
      onComplete: () => {
        setFilter(tag);
        setIsTransitioning(false);
      },
    });
  };

  // Animate items back in after filter state change
  useEffect(() => {
    if (!hasEnteredRef.current) return;
    gsap.fromTo('.archive-letterbox-item',
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.7, stagger: 0.05, ease: 'power3.out' }
    );
  }, [filter]);

  return (
    <section id="archive-grid-root" ref={sectionRef}>
      <div className="archive-shell">

        <div className="archive-header">
          <div className="archive-header-copy">
            <span className="archive-kicker">The Archive</span>
            <h2 className="archive-title">Ledger of <i>Void</i>.</h2>
          </div>
          <div className="archive-filters">
            {filters.map(tag => (
              <button
                key={tag}
                className={`filter-btn${filter === tag ? ' active' : ''}`}
                onClick={() => handleFilter(tag)}
                type="button"
              >
                {tag === 'all' ? 'All Works' : tag}
              </button>
            ))}
          </div>
        </div>

        <div id="project-grid" ref={gridRef} className="archive-letterbox-list">
          {filtered.map(project => (
            <div key={project.id} className="archive-letterbox-item">
              <div className="archive-lb-image-wrap">
                <img
                  src={project.img}
                  alt={project.name}
                  className="archive-lb-image"
                  loading="lazy"
                  decoding="async"
                />
              </div>
              <div className="archive-lb-info">
                <div className="archive-lb-top">
                  <span className="archive-lb-meta">{project.year} — {project.tag}</span>
                  <h3 className="archive-lb-name">{project.name}</h3>
                  <p className="archive-lb-desc">{project.desc}</p>
                </div>
                <div className="archive-lb-bottom">
                  <span className="archive-lb-meta">{project.loc}</span>
                  <span className="archive-lb-cta">View Case —</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="archive-footer">
          <span>©2026 Atelier Transparent / Systems</span>
          <a href="#">Request Full Ledger</a>
        </div>

      </div>
    </section>
  );
}
