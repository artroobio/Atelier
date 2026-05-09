import React from 'react';

export default function Accordion() {
  const items = [
    {
      id: 'residential',
      title: 'RESIDENTIAL',
      cover: '/residential_luxury_villa_1778344215982.png',
      description: 'Bespoke living environments where transparency meets intimacy. Our residential designs redefine domestic luxury through light-filled sanctuaries.'
    },
    {
      id: 'commercial',
      title: 'COMMERCIAL',
      cover: '/commercial_premium_office_1778344233441.png',
      description: 'Iconic headquarters and flagship showrooms that project corporate identity. We create glass structures that embody clarity and prestige.'
    },
    {
      id: 'hospitality',
      title: 'HOSPITALITY',
      cover: '/hospitality_luxury_hotel_1778344259267.png',
      description: 'Immersive spaces for the modern traveler. From boutique lobbies to serene spas, our hospitality projects elevate the art of arrival.'
    },
    {
      id: 'cultural',
      title: 'CULTURAL',
      cover: '/cultural_glass_museum_1778344274605.png',
      description: 'Public landmarks and artistic galleries. We design cultural vessels that serve as a dialogue between art, architecture, and the city.'
    }
  ];

  return (
    <section id="accordion-section" className="accordion-section-wrapper">
      <ul className="c-accordion">
        {items.map((item) => (
          <li 
            key={item.id}
            id={item.id} 
            className="c-accordion__item" 
            style={{ '--cover': `url(${item.cover})` }}
          >
            <a href={`#${item.id}`} className="c-accordion__action" onClick={(e) => e.preventDefault()}>
              <div className="c-accordion__content">
                <h2 className="c-accordion__title c-accordion__title--hero c-accordion__title--hover-show">
                  {item.title}
                </h2>
                <p className="c-accordion__description">{item.description}</p>
              </div>
              <div className="c-accordion__aside">
                <h2 className="c-accordion__title c-accordion__title--hover-hide">
                  {item.title}
                </h2>
              </div>
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
