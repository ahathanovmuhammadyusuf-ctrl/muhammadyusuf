import React, { useEffect, useRef } from 'react';
import { Theme } from '../types';

interface ParticleBackgroundProps {
  theme: Theme;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  baseVx: number;
  baseVy: number;
  radius: number;
  color: string;
}

export const ParticleBackground: React.FC<ParticleBackgroundProps> = ({ theme }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const isDark = theme === 'dark';
    const numParticles = Math.min(100, Math.floor((width * height) / 12000) + 35);
    const maxLineDist = 120;
    const mouseRadius = 150;

    const mouse = {
      x: -1000,
      y: -1000,
      isDown: false,
    };

    // Color palettes
    const darkColors = ['#60a5fa', '#93c5fd', '#c084fc', '#e879f9', '#38bdf8'];
    const lightColors = ['#2563eb', '#4f46e5', '#7c3aed', '#0284c7', '#9333ea'];
    const activePalette = isDark ? darkColors : lightColors;

    const particles: Particle[] = [];

    for (let i = 0; i < numParticles; i++) {
      const vx = (Math.random() - 0.5) * 0.9;
      const vy = (Math.random() - 0.5) * 0.9;
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx,
        vy,
        baseVx: vx,
        baseVy: vy,
        radius: Math.random() * 2 + 1.2,
        color: activePalette[Math.floor(Math.random() * activePalette.length)],
      });
    }

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        mouse.x = e.touches[0].clientX;
        mouse.y = e.touches[0].clientY;
      }
    };

    const handleMouseLeave = () => {
      mouse.x = -1000;
      mouse.y = -1000;
    };

    // Scatter repulsion burst when clicked / tapped
    const handleScatter = (clientX: number, clientY: number) => {
      particles.forEach((p) => {
        const dx = p.x - clientX;
        const dy = p.y - clientY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 260) {
          const force = (1 - dist / 260) * 12;
          const angle = Math.atan2(dy, dx);
          p.vx += Math.cos(angle) * force;
          p.vy += Math.sin(angle) * force;
        }
      });
    };

    const handleMouseDown = (e: MouseEvent) => {
      handleScatter(e.clientX, e.clientY);
    };

    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        handleScatter(e.touches[0].clientX, e.touches[0].clientY);
      }
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseleave', handleMouseLeave);

    // Animation loop (60 FPS)
    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Draw particle mesh
      for (let i = 0; i < particles.length; i++) {
        const p1 = particles[i];

        // Smooth damping back to base speed
        p1.vx += (p1.baseVx - p1.vx) * 0.04;
        p1.vy += (p1.baseVy - p1.vy) * 0.04;

        // Mouse attraction when nearby
        const dxM = mouse.x - p1.x;
        const dyM = mouse.y - p1.y;
        const distM = Math.sqrt(dxM * dxM + dyM * dyM);

        if (distM < mouseRadius && distM > 5) {
          const attractForce = (1 - distM / mouseRadius) * 0.35;
          p1.vx += (dxM / distM) * attractForce;
          p1.vy += (dyM / distM) * attractForce;

          // Connect particle to mouse cursor with subtle glowing beam
          const lineAlpha = (1 - distM / mouseRadius) * 0.45;
          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.strokeStyle = isDark
            ? `rgba(147, 197, 253, ${lineAlpha})`
            : `rgba(99, 102, 241, ${lineAlpha * 0.9})`;
          ctx.lineWidth = 1.2;
          ctx.stroke();
        }

        // Move
        p1.x += p1.vx;
        p1.y += p1.vy;

        // Bounce on boundary
        if (p1.x < 0) {
          p1.x = 0;
          p1.vx *= -1;
          p1.baseVx *= -1;
        } else if (p1.x > width) {
          p1.x = width;
          p1.vx *= -1;
          p1.baseVx *= -1;
        }

        if (p1.y < 0) {
          p1.y = 0;
          p1.vy *= -1;
          p1.baseVy *= -1;
        } else if (p1.y > height) {
          p1.y = height;
          p1.vy *= -1;
          p1.baseVy *= -1;
        }

        // Draw particle
        ctx.beginPath();
        ctx.arc(p1.x, p1.y, p1.radius, 0, Math.PI * 2);
        ctx.fillStyle = p1.color;
        ctx.shadowColor = p1.color;
        ctx.shadowBlur = isDark ? 6 : 2;
        ctx.fill();

        // Connect to other nearby particles
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < maxLineDist) {
            const alpha = (1 - dist / maxLineDist) * (isDark ? 0.28 : 0.2);
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = isDark
              ? `rgba(167, 139, 250, ${alpha})`
              : `rgba(99, 102, 241, ${alpha})`;
            ctx.lineWidth = 0.8;
            ctx.shadowBlur = 0;
            ctx.stroke();
          }
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [theme]);

  return (
    <div
      className={`fixed inset-0 pointer-events-none z-0 transition-colors duration-700 ${
        theme === 'dark' ? 'bg-[#0b1020]' : 'bg-[#f4f7ff]'
      }`}
    >
      <canvas
        ref={canvasRef}
        className="w-full h-full block pointer-events-none"
      />
    </div>
  );
};
