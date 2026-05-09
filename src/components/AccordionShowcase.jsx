import { useState } from 'react';

const items = [
  {
    id: 'cf',
    title: 'Customer Facing',
    description: 'Client conversations, showroom rituals, and tailored presentation systems for outward-facing moments.',
    image:
      'https://fusion-universal-assets-production.s3.amazonaws.com/file-host/5af42070-0533-49eb-9822-934eebf32cb7--1399798036194765884-/8/Customer-facing-1.png',
  },
  {
    id: 'corp',
    title: 'Corporate',
    description: 'Internal spaces for planning, coordination, and concentrated work shaped with quiet material discipline.',
    image:
      'https://fusion-universal-assets-production.s3.amazonaws.com/file-host/5af42070-0533-49eb-9822-934eebf32cb7--1399798036194765884-/8/corporate-3.png',
  },
  {
    id: 'lead',
    title: 'Leadership',
    description: 'Command spaces with panoramic views, restrained detailing, and an atmosphere of deliberate clarity.',
    image:
      'https://fusion-universal-assets-production.s3.amazonaws.com/file-host/5af42070-0533-49eb-9822-934eebf32cb7--1399798036194765884-/8/Leadership-3.png',
  },
  {
    id: 'warehouse',
    title: 'Operations',
    description: 'Functional zones refined through order, visibility, and movement-aware spatial choreography.',
    image:
      'https://fusion-universal-assets-production.s3.amazonaws.com/file-host/5af42070-0533-49eb-9822-934eebf32cb7--1399798036194765884-/8/Hilti_Warehouse_2024-10.png',
  },
];

export default function AccordionShowcase() {
  const [activeId, setActiveId] = useState(items[0].id);

  return (
    <section className="accordion-section">
      <div className="accordion-section__intro">
        <span className="accordion-section__kicker">Spatial Programs</span>
        <h2 className="accordion-section__title">
          Glass <i>Systems</i>.
        </h2>
      </div>

      <ul className="c-accordion">
        {items.map((item) => {
          const isActive = item.id === activeId;
          return (
            <li
              key={item.id}
              id={item.id}
              className={`c-accordion__item${isActive ? ' is-active' : ''}`}
              style={{ '--cover': `url(${item.image})` }}
              onMouseEnter={() => setActiveId(item.id)}
            >
              <button
                type="button"
                className="c-accordion__action"
                onClick={() => setActiveId(item.id)}
                aria-expanded={isActive}
              >
                <div className="c-accordion__content">
                  <h3 className="c-accordion__title c-accordion__title--hero c-accordion__title--hover-show">
                    {item.title}
                  </h3>
                  <p className="c-accordion__description">{item.description}</p>
                </div>

                <div className="c-accordion__aside">
                  <h3 className="c-accordion__title c-accordion__title--hover-hide">
                    {item.title}
                  </h3>
                </div>
              </button>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
