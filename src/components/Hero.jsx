import React, { useRef, useEffect, useState, useLayoutEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { MeshTransmissionMaterial, Float, useTexture, useVideoTexture, Environment, useProgress } from '@react-three/drei';
import * as THREE from 'three';
import gsap from 'gsap';

const ORB_URL = "https://assets.zyrosite.com/A3QlOV94WLSaL6xE/shot-panoramic-composition-library-vfOqabRkgVEFwqi9.jpg";
const BG_VIDEO_URL = "https://ik.imagekit.io/artroobeo/Green%20Checklist%20Minimalist%20Business%20Furniture%20&%20Interior%20Design%20Video.webm";

const SplitText = ({ children, className }) => {
  return (
    <span className={className}>
      {children.split("").map((char, index) => (
        <span key={index} className="char" style={{ opacity: 0, display: 'inline-block' }}>
          {char}
        </span>
      ))}
    </span>
  );
};

function detectMobile() {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(max-width: 768px)').matches;
}

export default function Hero() {
  const [loaded, setLoaded] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(() => detectMobile());
  const orbGroupRef = useRef();
  const canvasContainerRef = useRef();
  const [isVisible, setIsVisible] = useState(true);
  const { progress } = useProgress();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.1 }
    );
    if (canvasContainerRef.current) {
      observer.observe(canvasContainerRef.current);
    }
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 768px)');
    const update = () => setIsMobile(mq.matches);
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  useEffect(() => {
    if (isMobile) {
      setLoaded(true);
    }
  }, [isMobile]);

  useEffect(() => {
    const bar = document.getElementById('progress-bar');
    const percentText = document.getElementById('loader-percentage');
    const overlay = document.getElementById('loader');
    if(bar) bar.style.width = `${progress}%`;
    if(percentText) percentText.innerText = `${Math.round(progress)}%`;
    if(progress === 100) {
       setTimeout(() => { if(overlay) overlay.style.opacity = '0'; setLoaded(true); }, 500);
       setTimeout(() => { if(overlay) overlay.style.display = 'none'; }, 1300);
    }
  }, [progress]);

  useLayoutEffect(() => {
    if (!loaded) return;
    if (isMobile) {
      gsap.set(".menu-btn", { y: 0, opacity: 1 });
      gsap.set(".tagline", { opacity: 1 });
      gsap.set(".hero-header .char", { x: 0, opacity: 1, filter: "blur(0px)" });
      gsap.set(".glass-card", { y: 0, opacity: 1 });
      return;
    }
    const tl = gsap.timeline();
    tl.to(".menu-btn", { y: 0, opacity: 1, duration: 1, ease: "power3.out" });
    tl.to(".tagline", { opacity: 1, duration: 1, ease: "power2.out" }, "-=0.5");
    tl.fromTo(".hero-header .char", { x: -40, opacity: 0, filter: "blur(12px)" }, { x: 0, opacity: 1, filter: "blur(0px)", duration: 1.2, stagger: 0.03, ease: "power2.out" }, "-=0.8");
    tl.to(".glass-card", { y: 0, opacity: 1, duration: 1, ease: "power3.out" }, "-=0.5");
  }, [loaded, isMobile]);

  useEffect(() => {
    const overlay = document.querySelector('.menu-overlay');
    const items = document.querySelectorAll('.menu-item-link');
    const footer = document.querySelector('.menu-footer-right');

    if (isMobile) {
      if (menuOpen) {
        gsap.set(overlay, { right: 0 });
        gsap.set(items, { opacity: 1, x: 0 });
        gsap.set(footer, { opacity: 1, y: 0 });
        gsap.set(".hero-header", { opacity: 0 });
        gsap.set(".glass-card", { opacity: 0 });
      } else {
        gsap.set(overlay, { right: "-100%" });
        gsap.set(items, { opacity: 0, x: 50 });
        gsap.set(footer, { opacity: 0, y: 20 });
        gsap.set(".hero-header", { opacity: 1 });
        gsap.set(".glass-card", { opacity: 1 });
      }
      return;
    }

    if (menuOpen) {
      const tl = gsap.timeline();
      tl.to(overlay, { right: 0, duration: 1.2, ease: "expo.inOut" });
      tl.to(items, { opacity: 1, x: 0, duration: 1, stagger: 0.08, ease: "expo.out" }, "-=0.6");
      tl.to(footer, { opacity: 1, y: 0, duration: 1, ease: "power3.out" }, "-=0.8");
      gsap.to(".hero-header", { opacity: 0, filter: "blur(20px)", duration: 1, ease: "power2.inOut" });
      gsap.to(".glass-card", { opacity: 0, y: 20, duration: 0.8 });
    } else {
      const tl = gsap.timeline();
      tl.to(items, { opacity: 0, x: 50, duration: 0.6, stagger: 0.05, ease: "power2.in" });
      tl.to(footer, { opacity: 0, y: 20, duration: 0.6 }, "-=0.6");
      tl.to(overlay, { right: "-100%", duration: 1, ease: "expo.inOut" }, "-=0.4");
      gsap.to(".hero-header", { opacity: 1, filter: "blur(0px)", duration: 1, ease: "power2.out" });
      gsap.to(".glass-card", { opacity: 1, y: 0, duration: 1 });
    }
  }, [menuOpen, isMobile]);

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      {!isMobile && (
        <div id="loader" className="loader-overlay">
          <div className="loader-text">Loading Experience</div>
          <div className="loader-bar"><div className="loader-progress" id="progress-bar"></div></div>
          <div id="loader-percentage" className="loader-percentage">0%</div>
        </div>
      )}

      {isMobile && (
        <>
          <video
            className="hero-mobile-video"
            autoPlay
            muted
            loop
            playsInline
            src="https://assets.zyrosite.com/AGBzPMBJDQiwDGny/grey-home-interior-design-video-M13Xi8TTbaVTMRqP.mp4"
          />
          <div className="hero-mobile-overlay" />
        </>
      )}

      <div className="ui-layer">
        <div className="menu-btn" onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? "Close" : "Menu"}</div>
        
        <div className="menu-overlay">
          <div className="menu-left-side">
            <a href="#" className="menu-item-link" onClick={() => setMenuOpen(false)}>Projects</a>
            <a href="#" className="menu-item-link" onClick={() => setMenuOpen(false)}>Studio</a>
            <a href="#" className="menu-item-link" onClick={() => setMenuOpen(false)}>Archive</a>
            <a href="#" className="menu-item-link" onClick={() => setMenuOpen(false)}>Vision</a>
            <a href="#" className="menu-item-link" onClick={() => setMenuOpen(false)}>Contact</a>
          </div>
          <div className="menu-footer-right">
            <span className="brand-title">L'Atelier Transparent</span>
            <span className="address-line">42nd Penthouse Floor, Void Tower<br/>Zurich, Switzerland 8001</span>
          </div>
        </div>

        <div className="hero-header">
          <span className="tagline">Collection 2026</span>
          <h1>
            <div style={{ overflow: 'hidden' }}><SplitText>Structure &</SplitText></div>
            <div style={{ overflow: 'hidden' }}><i><SplitText>Transparency.</SplitText></i></div>
          </h1>
        </div>

        <div className="glass-card">
          <p>We design spaces that breathe. By dissolving the boundary between structure and environment, we create clarity. Explore the "Paperweight" archive below.</p>
          <a href="#" className="btn">Explore Collection</a>
        </div>
      </div>

      {!isMobile && (
        <div ref={canvasContainerRef} style={{ width: '100%', height: '100%' }}>
          <Canvas 
            dpr={[1, 2]} 
            camera={{ position: [0, 0, 10.5], fov: 35 }}
            frameloop={isVisible ? "always" : "never"}
          >
            <ambientLight intensity={1} />
            <spotLight position={[10, 10, 10]} intensity={2} angle={0.2} penumbra={1} color="white" />
            <spotLight position={[-10, 10, -5]} intensity={2} angle={0.2} penumbra={1} color="white" />
            <React.Suspense fallback={null}>
              <Background menuOpen={menuOpen} />
              <group ref={orbGroupRef} position={[3.5, 0, 0]}>
                <Paperweight loaded={loaded} menuOpen={menuOpen} />
              </group>
            </React.Suspense>
          </Canvas>
        </div>
      )}
    </div>
  );
}

function Paperweight({ loaded, menuOpen }) {
  const outerRef = useRef();
  const innerRef = useRef();
  const { gl } = useThree();
  const texture = useTexture(ORB_URL);

  useEffect(() => {
    if(texture) {
      texture.anisotropy = gl.capabilities.getMaxAnisotropy();
      texture.generateMipmaps = true;
      texture.minFilter = THREE.LinearMipMapLinearFilter;
      texture.magFilter = THREE.LinearFilter;
    }
  }, [texture, gl]);

  const groupRef = useRef();
  useLayoutEffect(() => {
    if (groupRef.current) { } 
  }, [menuOpen]);

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
          <mesh ref={innerRef} scale={0}><sphereGeometry args={[1, 64, 64]} /><meshBasicMaterial map={texture} toneMapped={false} /></mesh>
          <mesh ref={outerRef} scale={0}>
            <sphereGeometry args={[1, 64, 64]} />
            <MeshTransmissionMaterial ior={1.0} thickness={0.0} chromaticAberration={0.0} distortion={0.0} roughness={0.0} transmission={1.0} anisotropy={20} clearcoat={1.0} reflectivity={0.5} color="#ffffff" />
          </mesh>
        </group>
      </Float>
    </group>
  );
}

function Background({ menuOpen }) {
  const { viewport } = useThree();
  // VIDEO TEXTURE INTEGRATION
  const texture = useVideoTexture(BG_VIDEO_URL, {
    unsuspend: 'canplay',
    muted: true,
    loop: true,
    start: true,
    crossOrigin: 'Anonymous',
    playsInline: true,
  });
  const meshRef = useRef();

  const distance = 20.5; 
  const fov = 35;
  const vHeight = 2 * Math.tan((fov * Math.PI) / 180 / 2) * distance;
  const vWidth = vHeight * viewport.aspect;

  // "COVER" Scaling Logic for Video (Preserves Aspect Ratio)
  // Standard video is 16:9. If viewport is taller/narrower, we scale up to fit height.
  const videoAspect = 16 / 9;
  let scaleX = vWidth;
  let scaleY = vHeight;

  if (vWidth / vHeight > videoAspect) {
    scaleY = vWidth / videoAspect; 
  } else {
    scaleX = vHeight * videoAspect;
  }

  useEffect(() => {
    if (meshRef.current) {
      gsap.to(meshRef.current.material, {
        opacity: menuOpen ? 0.3 : 1,
        duration: 1.5,
        ease: "power2.inOut"
      });
      // Scale effect on Menu Open (keeps cover ratio)
      gsap.to(meshRef.current.scale, {
        x: menuOpen ? (scaleX * 1.1) : scaleX,
        y: menuOpen ? (scaleY * 1.1) : scaleY,
        duration: 1.5,
        ease: "power2.inOut"
      });
    }
  }, [menuOpen, scaleX, scaleY]);

  return (
    <mesh ref={meshRef} position={[0, 0, -10]} scale={[scaleX, scaleY, 1]}>
      <planeGeometry />
      <meshBasicMaterial map={texture} toneMapped={false} transparent={true} />
    </mesh>
  )
}
