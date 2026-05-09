import { useEffect, useMemo, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const projectData = [
  {
    id: 0,
    year: '2024',
    name: 'Obsidian House',
    loc: 'Zurich, CH',
    tag: 'obsidian',
    img: 'https://assets.zyrosite.com/A3QlOV94WLSaL6xE/modern-office-space-with-futuristic-decor-furniture-tWDr3G3kPWyBeBbj.jpg',
    desc: 'A residence carved from dark stone.',
    size: 'hero',
  },
  {
    id: 1,
    year: '2023',
    name: 'Glass Pavilion',
    loc: 'Kyoto, JP',
    tag: 'glass',
    img: 'https://assets.zyrosite.com/A3QlOV94WLSaL6xE/shot-panoramic-composition-library-vfOqabRkgVEFwqi9.jpg',
    desc: 'Merging traditional aesthetics with transparency.',
    size: 'tall',
  },
  {
    id: 2,
    year: '2023',
    name: 'Void Tower',
    loc: 'Berlin, DE',
    tag: 'void',
    img: 'https://assets.zyrosite.com/A3QlOV94WLSaL6xE/hold9998_cobden-st_in12_double-height-penthouse-void-tastTN8YGC6w7PC2.jpg',
    desc: 'A vertical exploration of negative space.',
    size: 'wide',
  },
  {
    id: 3,
    year: '2022',
    name: 'Crystal Gallery',
    loc: 'New York, US',
    tag: 'glass',
    img: 'https://assets.zyrosite.com/A3QlOV94WLSaL6xE/modern-office-space-with-futuristic-decor-furniture-tWDr3G3kPWyBeBbj.jpg',
    desc: 'Refracting the city motion through glass.',
    size: 'small',
  },
  {
    id: 4,
    year: '2022',
    name: 'The Prism',
    loc: 'London, UK',
    tag: 'light',
    img: 'https://assets.zyrosite.com/A3QlOV94WLSaL6xE/shot-panoramic-composition-library-vfOqabRkgVEFwqi9.jpg',
    desc: 'Multi-layered glass atmospheric facades.',
    size: 'small',
  },
  {
    id: 5,
    year: '2021',
    name: 'Basalt Studio',
    loc: 'Reykjavik, IS',
    tag: 'obsidian',
    img: 'https://assets.zyrosite.com/A3QlOV94WLSaL6xE/hold9998_cobden-st_in12_double-height-penthouse-void-tastTN8YGC6w7PC2.jpg',
    desc: 'Subterranean creative volcanic rock.',
    size: 'wide',
  },
];

const filters = ['all', 'glass', 'obsidian', 'light', 'void'];

export default function Archive() {
  const [filter, setFilter] = useState('all');

  const filteredProjects = useMemo(() => {
    if (filter === 'all') return projectData;
    return projectData.filter((project) => project.tag === filter);
  }, [filter]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.archive-reveal-item',
        { opacity: 0, y: 30, filter: 'blur(16px)' },
        {
          opacity: 1,
          y: 0,
          filter: 'blur(0px)',
          duration: 0.9,
          stagger: 0.08,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '#archive-project-grid',
            start: 'top 85%',
          },
        }
      );
    });

    return () => ctx.revert();
  }, [filter]);

  return (
    <section id="archive-grid-root">
      <div className="archive-shell">
        <div className="archive-header">
          <div className="archive-header-copy">
            <span className="archive-kicker">The Archive</span>
            <h2 className="archive-title">
              Ledger of <i>Void</i>.
            </h2>
          </div>

          <div className="archive-filters">
            {filters.map((item) => (
              <button
                key={item}
                className={`filter-btn${filter === item ? ' active' : ''}`}
                onClick={() => setFilter(item)}
                type="button"
              >
                {item === 'all' ? 'All Works' : item}
              </button>
            ))}
          </div>
        </div>

        <div id="archive-project-grid" className="archive-bento-grid">
          {filteredProjects.map((project) => (
            <article
              key={project.id}
              className={`archive-grid-item archive-size-${project.size} archive-reveal-item`}
            >
              <div className="archive-image-wrap">
                <img src={project.img} alt={project.name} className="archive-item-image" />
              </div>

              <div className="archive-item-tint"></div>

              <div className="archive-bottom-card">
                <div className="archive-meta-row">
                  <span>{project.year}</span>
                  <span>{project.loc}</span>
                </div>
                <h3 className="archive-item-title">{project.name}</h3>
                <div className="archive-meta-rule"></div>
                <div className="archive-meta-row archive-meta-lower">
                  <span className="archive-tag">{project.tag}</span>
                  <p className="archive-desc">{project.desc}</p>
                </div>
              </div>
            </article>
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
