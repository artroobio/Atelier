import React, { useRef, useEffect, useState, useLayoutEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { MeshTransmissionMaterial, Float, useTexture, Environment, useProgress } from '@react-three/drei';
import * as THREE from 'three';
import gsap from 'gsap';

const ORB_URL = "https://assets.zyrosite.com/A3QlOV94WLSaL6xE/shot-panoramic-composition-library-vfOqabRkgVEFwqi9.jpg";
const BG_VIDEO_URL = "https://assets.zyrosite.com/A3QlOV94WLSaL6xE/3-hero-video-AtqA69jgkl8uQQj5.mp4";

const SplitText = ({ children, className }) => (
  <span className={className}>
    {children.split('').map((char, i) => (
      <span key={i} className="char" style={{ opacity: 0, display: 'inline-block' }}>
        {char}
      </span>
    ))}
  </span>
);

export default function HeroDesktop({ menuOpen, onMenuToggle }) {
  const [loaded, setLoaded] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [videoProgress, setVideoProgress] = useState(0);
  const canvasContainerRef = useRef();
  const videoBgRef = useRef(null); // DOM video — bg + buffer tracker combined
  const revealedRef = useRef(false);
  const timeoutRef = useRef(null);
  const { progress: orbProgress } = useProgress();

  // Skip loader if already seen this session
  useEffect(() => {
    if (sessionStorage.getItem('atelierHeroLoaded')) {
      const overlay = document.getElementById('loader');
      if (overlay) overlay.style.display = 'none';
      revealedRef.current = true;
      if (videoBgRef.current) gsap.to(videoBgRef.current, { opacity: 1, duration: 0.5 });
      setLoaded(true);
    }
  }, []);

  // Pause Canvas when hero scrolls out of view
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.1 }
    );
    if (canvasContainerRef.current) observer.observe(canvasContainerRef.current);
    return () => observer.disconnect();
  }, []);

  // Cinematic reveal
  const triggerReveal = useRef(null);
  triggerReveal.current = () => {
    if (revealedRef.current) return;
    revealedRef.current = true;
    clearTimeout(timeoutRef.current);
    sessionStorage.setItem('atelierHeroLoaded', '1');
    const bar = document.getElementById('progress-bar');
    const pct = document.getElementById('loader-percentage');
    if (bar) gsap.to(bar, { width: '100%', duration: 0.3, ease: 'power1.out' });
    if (pct) pct.innerText = '100%';
    setTimeout(() => {
      // Fade in video FIRST so it's visible before loader exits
      if (videoBgRef.current) {
        gsap.to(videoBgRef.current, { opacity: 1, duration: 0.7, ease: 'power2.out' });
      }
      // Exit loader 200ms after video starts fading in
      setTimeout(() => {
        const overlay = document.getElementById('loader');
        if (overlay) {
          gsap.to(overlay, {
            opacity: 0, scale: 1.06, filter: 'blur(18px)',
            duration: 1.1, ease: 'power2.inOut',
            onComplete: () => { overlay.style.display = 'none'; setLoaded(true); }
          });
        } else {
          setLoaded(true);
        }
      }, 200);
    }, 350);
  };

  // Composite progress = ORB 70% + video buffer capped at 30%
  useEffect(() => {
    const composite = Math.round((orbProgress / 100) * 70 + Math.min(videoProgress / 0.3, 1) * 30);
    const clamped = Math.min(composite, 100);
    const bar = document.getElementById('progress-bar');
    const pct = document.getElementById('loader-percentage');
    if (bar) gsap.to(bar, { width: `${clamped}%`, duration: 0.4, ease: 'power1.out', overwrite: true });
    if (pct) pct.innerText = `${clamped}%`;
    if (clamped >= 100) triggerReveal.current();
  }, [orbProgress, videoProgress]);

  // Buffer tracking on the DOM video + 8s fallback
  useEffect(() => {
    const video = videoBgRef.current;
    if (!video) return;
    const updateBuffer = () => {
      try {
        if (video.buffered.length > 0 && video.duration > 0) {
          const frac = video.buffered.end(video.buffered.length - 1) / video.duration;
          setVideoProgress(prev => Math.max(prev, Math.min(frac, 1)));
        }
      } catch (e) {}
    };
    video.addEventListener('progress', updateBuffer);
    video.addEventListener('timeupdate', updateBuffer);
    video.addEventListener('canplaythrough', () => setVideoProgress(1));
    timeoutRef.current = setTimeout(() => triggerReveal.current(), 8000);
    return () => {
      video.removeEventListener('progress', updateBuffer);
      video.removeEventListener('timeupdate', updateBuffer);
      clearTimeout(timeoutRef.current);
    };
  }, []);

  // Entry animation — 1s delay so ORB appears before text
  useLayoutEffect(() => {
    if (!loaded) return;
    const tl = gsap.timeline({ delay: 1 });
    tl.to('.tagline', { opacity: 1, duration: 1, ease: 'power2.out' });
    tl.fromTo('.hero-header .char',
      { x: -30, opacity: 0 },
      { x: 0, opacity: 1, duration: 1.2, stagger: 0.025, ease: 'power2.out' },
      '-=0.8'
    );
    tl.to('.glass-card', { y: 0, opacity: 1, duration: 1, ease: 'power3.out' }, '-=0.8');
    tl.fromTo('.glass-card p',
      { opacity: 0, y: 15, filter: 'blur(10px)' },
      { opacity: 1, y: 0, filter: 'blur(0px)', duration: 1.2, ease: 'power2.out' },
      '-=0.7'
    );
  }, [loaded]);

  // Menu animation
  useEffect(() => {
    const overlay = document.querySelector('.menu-overlay');
    const items = document.querySelectorAll('.menu-item-link');
    const footer = document.querySelector('.menu-footer-right');
    if (menuOpen) {
      const tl = gsap.timeline();
      tl.to(overlay, { right: 0, duration: 1.2, ease: 'expo.inOut' });
      tl.to(items, { opacity: 1, x: 0, duration: 1, stagger: 0.08, ease: 'expo.out' }, '-=0.6');
      tl.to(footer, { opacity: 1, y: 0, duration: 1, ease: 'power3.out' }, '-=0.8');
      gsap.to('.hero-header', { opacity: 0, filter: 'blur(20px)', duration: 1, ease: 'power2.inOut' });
      gsap.to('.glass-card', { opacity: 0, y: 20, duration: 0.8 });
      if (videoBgRef.current) gsap.to(videoBgRef.current, { opacity: 0.3, scale: 1.08, duration: 1.5, ease: 'power2.inOut' });
    } else {
      const tl = gsap.timeline();
      tl.to(items, { opacity: 0, x: 50, duration: 0.6, stagger: 0.05, ease: 'power2.in' });
      tl.to(footer, { opacity: 0, y: 20, duration: 0.6 }, '-=0.6');
      tl.to(overlay, { right: '-100%', duration: 1, ease: 'expo.inOut' }, '-=0.4');
      gsap.to('.hero-header', { opacity: 1, filter: 'blur(0px)', duration: 1, ease: 'power2.out' });
      gsap.to('.glass-card', { opacity: 1, y: 0, duration: 1 });
      if (videoBgRef.current) gsap.to(videoBgRef.current, { opacity: 1, scale: 1, duration: 1.5, ease: 'power2.inOut' });
    }
  }, [menuOpen]);

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      {/* Loader */}
      <div id="loader" className="loader-overlay">
        <div className="loader-brand">ATELIER EVO</div>
        <div className="loader-tagline">Crafting your experience</div>
        <div className="loader-bar"><div className="loader-progress" id="progress-bar"></div></div>
        <div id="loader-percentage" className="loader-percentage">0%</div>
      </div>

      {/* DOM video background — no Three.js Suspense, no black flash */}
      <video
        ref={videoBgRef}
        src={BG_VIDEO_URL}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        style={{
          position: 'absolute', top: 0, left: 0,
          width: '100%', height: '100%',
          objectFit: 'cover',
          opacity: 0,
          zIndex: 0,
        }}
      />

      {/* UI overlay */}
      <div className="ui-layer" style={{ zIndex: 10 }}>
        <div className="hero-brand-top">
          <a href="/" className="hero-brand-link">
            <span className="hero-brand-text">Atelier Evo</span>
          </a>
        </div>
        <div className="menu-btn" onClick={() => onMenuToggle(!menuOpen)}>
          {menuOpen ? 'Close' : 'Menu'}
        </div>
        <div className="menu-overlay">
          <div className="menu-left-side">
            <a href="/" className="menu-item-link" onClick={() => onMenuToggle(false)}>Home</a>
            <a href="/projects" className="menu-item-link" onClick={() => onMenuToggle(false)}>Projects</a>
            <a href="/services" className="menu-item-link" onClick={() => onMenuToggle(false)}>Services</a>

            <a href="/blog" className="menu-item-link" onClick={() => onMenuToggle(false)}>Blog</a>
            <a href="/contact" className="menu-item-link" onClick={() => onMenuToggle(false)}>Contact</a>
          </div>
          <div className="menu-footer-right">
            <span className="brand-title">Atelier Evo</span>
          </div>
        </div>
        <div className="hero-header">
          <h1>
            <div style={{ overflow: 'hidden', whiteSpace: 'nowrap' }}><SplitText>Bespoke</SplitText></div>
            <div style={{ overflow: 'hidden', whiteSpace: 'nowrap' }}><SplitText>Architectural</SplitText></div>
            <div style={{ overflow: 'hidden', whiteSpace: 'nowrap' }}><i><SplitText>Web Designs.</SplitText></i></div>
          </h1>
        </div>
        <div className="glass-card">
          <p>We craft immersive websites for interior architects and design studios. Through refined motion, spatial layouts, and visual storytelling, we transform portfolios into digital experiences.</p>
        </div>
      </div>

      {/* Canvas — transparent, renders ORB only */}
      <div ref={canvasContainerRef} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 1 }}>
        <Canvas
          gl={{ alpha: true }}
          dpr={[1, 1.5]}
          camera={{ position: [0, 0, 10.5], fov: 35 }}
          frameloop={isVisible ? 'always' : 'never'}
        >
          <ambientLight intensity={1} />
          <spotLight position={[10, 10, 10]} intensity={2} angle={0.2} penumbra={1} color="white" />
          <spotLight position={[-10, 10, -5]} intensity={2} angle={0.2} penumbra={1} color="white" />
          <React.Suspense fallback={null}>
            <group position={[3.5, 0, 0]}>
              <Paperweight loaded={loaded} />
            </group>
          </React.Suspense>
        </Canvas>
      </div>
    </div>
  );
}

function Paperweight({ loaded }) {
  const outerRef = useRef();
  const innerRef = useRef();
  const { gl } = useThree();
  const texture = useTexture(ORB_URL);

  useEffect(() => {
    if (texture) {
      texture.anisotropy = Math.min(4, gl.capabilities.getMaxAnisotropy());
      texture.generateMipmaps = true;
      texture.minFilter = THREE.LinearMipMapLinearFilter;
      texture.magFilter = THREE.LinearFilter;
    }
  }, [texture, gl]);

  useFrame((state, delta) => {
    if (outerRef.current) {
      outerRef.current.rotation.y += delta * 0.2;
      innerRef.current.rotation.y += delta * 0.2;
      const targetScale = loaded ? 2.7 : 0;
      const speed = delta * 3;
      innerRef.current.scale.setScalar(THREE.MathUtils.lerp(innerRef.current.scale.x, targetScale, speed));
      outerRef.current.scale.setScalar(THREE.MathUtils.lerp(outerRef.current.scale.x, targetScale * 1.005, speed));
    }
  });

  return (
    <group>
      <Environment preset="city" background={false} />
      <Float speed={2} rotationIntensity={0.2} floatIntensity={1}>
        <group>
          <mesh ref={innerRef} scale={0}>
            <sphereGeometry args={[1, 48, 48]} />
            <meshBasicMaterial map={texture} toneMapped={false} />
          </mesh>
          <mesh ref={outerRef} scale={0}>
            <sphereGeometry args={[1, 48, 48]} />
            <MeshTransmissionMaterial
              ior={1.0} thickness={0.0} chromaticAberration={0.0}
              distortion={0.0} roughness={0.0} transmission={1.0}
              anisotropy={20} clearcoat={1.0} reflectivity={0.5} color="#ffffff"
            />
          </mesh>
        </group>
      </Float>
    </group>
  );
}
