import React, { useEffect, useRef } from 'react';
import { Theme } from '../types';

interface MouseTrailProps {
  theme: Theme;
}

interface TrailDot {
  x: number;
  y: number;
  alpha: number;
  size: number;
  color: string;
}

export const MouseTrail: React.FC<MouseTrailProps> = ({ theme }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    // Only run on non-touch devices with fine pointers
    if (typeof window === 'undefined' || !window.matchMedia('(pointer: fine)').matches) {
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const dots: TrailDot[] = [];
    const colors = theme === 'dark' 
      ? ['#60a5fa', '#a78bfa', '#f472b6', '#38bdf8'] 
      : ['#3b82f6', '#8b5cf6', '#ec4899', '#06b6d4'];

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    let lastX = 0;
    let lastY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      const dx = e.clientX - lastX;
      const dy = e.clientY - lastY;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist > 4) {
        lastX = e.clientX;
        lastY = e.clientY;
        dots.push({
          x: e.clientX,
          y: e.clientY,
          alpha: 1,
          size: Math.random() * 3 + 2,
          color: colors[Math.floor(Math.random() * colors.length)],
        });
      }
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      for (let i = dots.length - 1; i >= 0; i--) {
        const dot = dots[i];
        dot.alpha -= 0.035;
        dot.size *= 0.96;

        if (dot.alpha <= 0 || dot.size <= 0.2) {
          dots.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.beginPath();
        ctx.arc(dot.x, dot.y, dot.size, 0, Math.PI * 2);
        ctx.fillStyle = dot.color;
        ctx.globalAlpha = Math.max(0, dot.alpha);
        ctx.shadowColor = dot.color;
        ctx.shadowBlur = 8;
        ctx.fill();
        ctx.restore();
      }

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [theme]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-50 w-full h-full"
    />
  );
};
