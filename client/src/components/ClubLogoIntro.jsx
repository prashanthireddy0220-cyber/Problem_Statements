import React, { useEffect, useRef, useState } from 'react';
import './ClubLogoIntro.css';

/**
 * KARE IEEE Education Society - Cinematic Intro Animation Component
 * 
 * Timeline:
 * 0.0 - 0.4s: Pure black screen -> Tiny cyan glowing electric spark appears in center
 * 0.4 - 1.2s: Energy shockwave pulse expands -> Logo emerges (blur 20px -> sharp, opacity 0 -> 1, scale 85% -> 100%)
 * 1.2 - 1.8s: Logo becomes fully sharp, cyan outer halo & bloom reach peak
 * 1.5 - 2.2s: "KARE IEEE EDUCATION SOCIETY" text glides up & fades in smoothly
 * 2.2 - 3.0s: Hold composition (~0.7s) -> Cinematic forward zoom & smooth fade-out reveal to website
 */
export default function ClubLogoIntro({ 
  logoUrl = '/kare_ieee_logo.jpg', 
  onComplete,
  autoStart = true
}) {
  // Phase state tracking
  const [phase, setPhase] = useState('initial'); // 'initial', 'spark', 'pulse', 'logoVisible', 'textVisible', 'exiting', 'done'
  const canvasRef = useRef(null);
  const animFrameRef = useRef(null);
  const particlesRef = useRef([]);

  // Sequence Timer Handler
  useEffect(() => {
    if (!autoStart) return;

    // 0.0s - Initial Black Screen
    // 0.1s - Spark appears
    const sparkTimer = setTimeout(() => {
      setPhase('spark');
    }, 100);

    // 0.4s - Energy shockwave expands, logo starts emerging
    const pulseTimer = setTimeout(() => {
      setPhase('pulse');
    }, 400);

    // 1.2s - Logo sharp & fully visible
    const logoTimer = setTimeout(() => {
      setPhase('logoVisible');
    }, 1200);

    // 1.5s - Text fades in & glides upward
    const textTimer = setTimeout(() => {
      setPhase('textVisible');
    }, 1500);

    // 2.3s - Cinematic exit transition (zoom + glow expand + fade out)
    const exitTimer = setTimeout(() => {
      setPhase('exiting');
    }, 2300);

    // 2.9s - Finish and unmount/callback to reveal main website
    const completeTimer = setTimeout(() => {
      setPhase('done');
      if (onComplete) onComplete();
    }, 2900);

    return () => {
      clearTimeout(sparkTimer);
      clearTimeout(pulseTimer);
      clearTimeout(logoTimer);
      clearTimeout(textTimer);
      clearTimeout(exitTimer);
      clearTimeout(completeTimer);
    };
  }, [autoStart, onComplete]);

  // Particle Canvas Animation Effect (Subtle cyan light motes & radial rays)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Initialize subtle cyan/blue energy particles
    const particleCount = window.innerWidth < 768 ? 30 : 50;
    const particles = [];
    const centerX = width / 2;
    const centerY = height / 2;

    for (let i = 0; i < particleCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 0.5 + Math.random() * 2.2;
      particles.push({
        x: centerX,
        y: centerY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: 1 + Math.random() * 2.5,
        alpha: 0,
        targetAlpha: 0.3 + Math.random() * 0.5,
        color: Math.random() > 0.4 ? '#00f2fe' : '#4facfe',
        life: 0,
        maxLife: 60 + Math.random() * 80
      });
    }
    particlesRef.current = particles;

    let startTime = null;

    const render = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;

      ctx.clearRect(0, 0, width, height);

      // Radial background light burst during pulse/logo phase
      if (elapsed > 300) {
        const pulseProgress = Math.min(1, (elapsed - 300) / 1200);
        const glowRadius = Math.min(width, height) * (0.2 + pulseProgress * 0.35);
        const gradient = ctx.createRadialGradient(
          width / 2,
          height / 2,
          0,
          width / 2,
          height / 2,
          glowRadius
        );
        
        const alpha = Math.sin(Math.min(Math.PI, (elapsed - 300) / 2000)) * 0.25;
        gradient.addColorStop(0, `rgba(0, 242, 254, ${alpha * 0.8})`);
        gradient.addColorStop(0.4, `rgba(0, 102, 255, ${alpha * 0.4})`);
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, width, height);
      }

      // Render subtle cyan light particles outward when pulse starts
      if (elapsed > 400) {
        particlesRef.current.forEach((p) => {
          p.x += p.vx;
          p.y += p.vy;
          p.life++;

          // Fade particle in then out
          const lifeProgress = p.life / p.maxLife;
          if (lifeProgress < 0.3) {
            p.alpha = (lifeProgress / 0.3) * p.targetAlpha;
          } else {
            p.alpha = (1 - (lifeProgress - 0.3) / 0.7) * p.targetAlpha;
          }

          if (p.alpha > 0) {
            ctx.save();
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fillStyle = p.color;
            ctx.globalAlpha = Math.max(0, p.alpha);
            ctx.shadowColor = p.color;
            ctx.shadowBlur = 10;
            ctx.fill();
            ctx.restore();
          }

          // Reset particle if dead
          if (p.life >= p.maxLife) {
            p.x = width / 2;
            p.y = height / 2;
            const angle = Math.random() * Math.PI * 2;
            const speed = 0.5 + Math.random() * 2.5;
            p.vx = Math.cos(angle) * speed;
            p.vy = Math.sin(angle) * speed;
            p.life = 0;
            p.alpha = 0;
          }
        });
      }

      animFrameRef.current = requestAnimationFrame(render);
    };

    animFrameRef.current = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, []);

  if (phase === 'done') return null;

  const isSparkVisible = phase === 'spark' || phase === 'pulse';
  const isPulseActive = phase === 'pulse';
  const isLogoEmerging = phase === 'pulse';
  const isLogoVisible = phase === 'logoVisible' || phase === 'textVisible' || phase === 'exiting';
  const isTextVisible = phase === 'textVisible' || phase === 'exiting';
  const isExiting = phase === 'exiting';

  return (
    <div className={`club-intro-overlay ${isExiting ? 'exiting' : ''}`}>
      {/* Background Canvas for Particles & Light Pulse */}
      <canvas ref={canvasRef} className="club-intro-canvas" />

      {/* Main Content Animation Container */}
      <div className="club-intro-content">

        {/* Central Electric Spark / Point (0.0s - 0.4s) */}
        <div 
          className={`club-intro-spark ${isSparkVisible ? 'visible' : ''} ${isPulseActive ? 'pulse fade-out' : ''}`} 
        />

        {/* Energy Pulse Ring Shockwave (0.4s - 1.2s) */}
        <div 
          className={`club-intro-shockwave ${isPulseActive ? 'expanding' : ''} ${isLogoVisible ? 'fade' : ''}`} 
        />

        {/* Soft Volumetric Light Halo behind Logo */}
        <div 
          className={`club-intro-halo ${(isLogoEmerging || isLogoVisible) ? 'visible' : ''}`} 
        />

        {/* Logo Container */}
        <div className="club-intro-logo-wrapper">
          <img 
            src={logoUrl} 
            alt="KARE IEEE Education Society Logo" 
            className={`club-intro-logo ${isLogoEmerging ? 'emerging' : ''} ${isLogoVisible ? 'visible' : ''}`} 
          />
        </div>

        {/* Text Reveal: KARE IEEE EDUCATION SOCIETY */}
        <div className="club-intro-text-container">
          <h1 className={`club-intro-title ${isTextVisible ? 'visible' : ''}`}>
            KARE IEEE EDUCATION SOCIETY
          </h1>
        </div>

      </div>
    </div>
  );
}
