import React, { useEffect, useRef } from 'react';

interface WebGLEditorialCanvasProps {
  darkMode: boolean;
  warpActive?: boolean;
}

interface StarParticle {
  x: number;
  y: number;
  z: number;
  prevZ: number;
  size: number;
  tint: number;
}

/**
 * Motore grafico spaziale 3D ("Costellazioni & Fascio di Luce"):
 * disegna uno spazio pulitissimo di stelle 3D con parallasse fluida sul cursore
 * e attiva un effetto tunnel di luce ("fascio veloce") quando ci si addentra in un pianeta/era.
 */
export const WebGLEditorialCanvas: React.FC<WebGLEditorialCanvasProps> = ({
  darkMode,
  warpActive = false,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const darkRef = useRef<boolean>(darkMode);
  const warpRef = useRef<boolean>(warpActive);

  useEffect(() => {
    darkRef.current = darkMode;
  }, [darkMode]);

  useEffect(() => {
    warpRef.current = warpActive;
  }, [warpActive]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const STAR_COUNT = 220;
    const MAX_DEPTH = 1200;
    const stars: StarParticle[] = Array.from({ length: STAR_COUNT }, () => {
      const z = Math.random() * MAX_DEPTH + 1;
      return {
        x: (Math.random() - 0.5) * 2200,
        y: (Math.random() - 0.5) * 1600,
        z,
        prevZ: z,
        size: Math.random() * 1.6 + 0.5,
        tint: Math.random(),
      };
    });

    let width = window.innerWidth;
    let height = window.innerHeight;
    let mouseX = 0;
    let mouseY = 0;
    let targetMouseX = 0;
    let targetMouseY = 0;
    let currentSpeed = 0.85;

    const handleResize = () => {
      if (!canvas) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const handleMouseMove = (e: MouseEvent) => {
      targetMouseX = (e.clientX / Math.max(width, 1) - 0.5) * 90;
      targetMouseY = (e.clientY / Math.max(height, 1) - 0.5) * 90;
    };

    handleResize();
    window.addEventListener('resize', handleResize, { passive: true });
    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    let rafId = 0;

    const render = () => {
      const isDark = darkRef.current;
      const isWarping = warpRef.current;

      const targetSpeed = isWarping ? 38 : 0.75;
      currentSpeed += (targetSpeed - currentSpeed) * (isWarping ? 0.14 : 0.08);

      mouseX += (targetMouseX - mouseX) * 0.05;
      mouseY += (targetMouseY - mouseY) * 0.05;

      // Sfondo nitido e pulito (con scia morbida durante il salto veloce)
      if (isDark) {
        ctx.fillStyle = isWarping
          ? 'rgba(10, 11, 15, 0.28)'
          : 'rgba(11, 12, 16, 1)';
      } else {
        ctx.fillStyle = isWarping
          ? 'rgba(246, 242, 233, 0.32)'
          : 'rgba(246, 242, 233, 1)';
      }
      ctx.fillRect(0, 0, width, height);

      const cx = width * 0.5 - mouseX * 0.4;
      const cy = height * 0.5 - mouseY * 0.4;
      const focal = 420;

      const projected: { sx: number; sy: number; alpha: number }[] = [];

      for (let i = 0; i < STAR_COUNT; i++) {
        const s = stars[i];
        s.prevZ = s.z;
        s.z -= currentSpeed;

        if (s.z <= 2) {
          s.z = MAX_DEPTH;
          s.prevZ = MAX_DEPTH;
          s.x = (Math.random() - 0.5) * 2200;
          s.y = (Math.random() - 0.5) * 1600;
        }

        const scale = focal / s.z;
        const sx = cx + s.x * scale;
        const sy = cy + s.y * scale;

        if (sx < -50 || sx > width + 50 || sy < -50 || sy > height + 50) {
          continue;
        }

        const depthAlpha = Math.min(1, (1 - s.z / MAX_DEPTH) * 1.15);
        const radius = Math.max(0.5, s.size * scale * 0.8);

        if (currentSpeed > 3.5) {
          // Fascio veloce: disegna le scie luminose radiali che ti portano dentro l'argomento
          const prevScale = focal / Math.max(s.prevZ + currentSpeed * 1.8, 4);
          const px = cx + s.x * prevScale;
          const py = cy + s.y * prevScale;

          ctx.beginPath();
          ctx.moveTo(px, py);
          ctx.lineTo(sx, sy);
          ctx.strokeStyle = isDark
            ? s.tint > 0.6
              ? `rgba(212, 169, 89, ${depthAlpha * 0.85})`
              : `rgba(241, 237, 228, ${depthAlpha * 0.75})`
            : s.tint > 0.6
            ? `rgba(168, 71, 38, ${depthAlpha * 0.65})`
            : `rgba(140, 103, 40, ${depthAlpha * 0.55})`;
          ctx.lineWidth = Math.min(2.6, radius * 1.1);
          ctx.stroke();
        } else {
          ctx.beginPath();
          ctx.arc(sx, sy, Math.min(2.4, radius), 0, Math.PI * 2);
          ctx.fillStyle = isDark
            ? s.tint > 0.7
              ? `rgba(212, 169, 89, ${depthAlpha * 0.85})`
              : `rgba(241, 237, 228, ${depthAlpha * 0.65})`
            : s.tint > 0.7
            ? `rgba(168, 71, 38, ${depthAlpha * 0.45})`
            : `rgba(22, 21, 19, ${depthAlpha * 0.3})`;
          ctx.fill();

          if (s.z < 520 && projected.length < 42) {
            projected.push({ sx, sy, alpha: depthAlpha });
          }
        }
      }

      // Costellazioni sottili tra le stelle più vicine quando non siamo in warp
      if (currentSpeed <= 3.5) {
        ctx.lineWidth = 0.6;
        for (let i = 0; i < projected.length; i++) {
          for (let j = i + 1; j < projected.length; j++) {
            const dx = projected[i].sx - projected[j].sx;
            const dy = projected[i].sy - projected[j].sy;
            const distSq = dx * dx + dy * dy;
            if (distSq < 13500) {
              const lineAlpha =
                (1 - distSq / 13500) *
                Math.min(projected[i].alpha, projected[j].alpha) *
                (isDark ? 0.16 : 0.1);
              ctx.strokeStyle = isDark
                ? `rgba(212, 169, 89, ${lineAlpha})`
                : `rgba(140, 103, 40, ${lineAlpha})`;
              ctx.beginPath();
              ctx.moveTo(projected[i].sx, projected[i].sy);
              ctx.lineTo(projected[j].sx, projected[j].sy);
              ctx.stroke();
            }
          }
        }
      }

      rafId = requestAnimationFrame(render);
    };

    rafId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="fixed inset-0 w-full h-full pointer-events-none -z-10"
    />
  );
};
