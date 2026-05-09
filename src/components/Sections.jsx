import Hero from './Hero.jsx';
import Gallery from './Gallery.jsx';
import Philosophy from './Philosophy.jsx';
import Accordion from './Accordion.jsx';
import Works from './Works.jsx';
import Process from './Process.jsx';
import Archive from './Archive.jsx';

export default function Sections() {
  return (
    <>
      <section className="hero-slot">
        <Hero />
      </section>
      <Gallery />
      <div className="philosophy-slot">
        <Philosophy />
      </div>
      <Works />
      <Process />
      <Archive />
      <Accordion />
    </>
  );
}
