
import React, { useRef, useEffect } from 'react';
import { AnalysisResult, Difficulty, MoodCategory, LayoutMode, VisualStyle } from '../types';
import { hashString, createPRNG, getCategoricalPalette } from '../utils/random';

interface SymphonyCanvasProps {
  analysis: AnalysisResult;
  difficulty: Difficulty;
  layoutMode?: LayoutMode;
  visualStyle?: VisualStyle;
  progress?: number; 
  width?: number;
  height?: number;
  id?: string;
  isPoster?: boolean;
}

const SymphonyCanvas: React.FC<SymphonyCanvasProps> = ({
  analysis,
  difficulty,
  layoutMode = LayoutMode.LINEAR,
  visualStyle = VisualStyle.PAINT,
  progress = 1,
  width = 800,
  height = 400,
  id = 'canvas',
  isPoster = false
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const drawStar = (ctx: CanvasRenderingContext2D, x: number, y: number, points: number, outer: number, inner: number, fill: string) => {
    ctx.beginPath();
    for (let i = 0; i < points * 2; i++) {
      const radius = i % 2 === 0 ? outer : inner;
      const angle = (i * Math.PI) / points;
      ctx.lineTo(x + Math.cos(angle) * radius, y + Math.sin(angle) * radius);
    }
    ctx.closePath();
    ctx.fillStyle = fill;
    ctx.fill();
  };

  const drawBlob = (ctx: CanvasRenderingContext2D, rng: () => number, bx: number, by: number, br: number, color: string, alpha: number) => {
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.fillStyle = color;
    ctx.beginPath();
    const segments = 8 + Math.floor(rng() * 8);
    for (let j = 0; j <= segments; j++) {
      const ang = (j / segments) * Math.PI * 2;
      const varR = br * (0.7 + rng() * 0.6);
      const px = bx + Math.cos(ang) * varR;
      const py = by + Math.sin(ang) * varR;
      if (j === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
    }
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  };

  const draw = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const w = width;
    const h = height;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    ctx.scale(dpr, dpr);

    const { sentences, tracks } = analysis;
    const count = sentences.length;

    const baseMood = count > 0 ? tracks.moodCategory[0] : MoodCategory.NEUTRAL;
    const bgPalette = getCategoricalPalette(baseMood, 0.1);
    ctx.fillStyle = isPoster ? '#ffffff' : bgPalette.secondary;
    ctx.fillRect(0, 0, w, h);

    if (count === 0) return;

    const limit = Math.floor(count * progress);
    const centerX = w / 2;
    const centerY = h / 2;
    const mainSeed = hashString(sentences[0]?.text || 'seed');
    const rng = createPRNG(mainSeed);
    const points: { x: number, y: number }[] = [];

    // Layer 1: Atmospheric Washes
    ctx.save();
    for (let i = 0; i < limit; i++) {
      const s = sentences[i];
      if (i === 0 || s.paragraphIndex !== sentences[i-1].paragraphIndex) {
        const p = getCategoricalPalette(s.moodCategory, 0.2);
        const grad = ctx.createRadialGradient(rng()*w, rng()*h, 0, rng()*w, rng()*h, w * 0.8);
        grad.addColorStop(0, p.glow);
        grad.addColorStop(1, 'transparent');
        ctx.globalCompositeOperation = 'multiply';
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, w, h);
      }
    }
    ctx.restore();

    // Layer 2: Core Symphony Elements
    for (let i = 0; i < limit; i++) {
      const s = sentences[i];
      const rhythm = tracks.rhythm[i];
      const complexity = tracks.complexity[i];
      const lp = tracks.linguistic[i];
      const tension = tracks.tension[i];
      const moodScore = tracks.mood[i];
      const category = tracks.moodCategory[i];
      const palette = getCategoricalPalette(category, moodScore);

      let x = centerX, y = centerY;
      if (layoutMode === LayoutMode.LINEAR) {
        x = (w / (count + 1)) * (i + 1);
        y = centerY + (category === MoodCategory.JOY ? -70 : category === MoodCategory.SADNESS ? 70 : 0) + (rng() - 0.5) * 120;
      } else if (layoutMode === LayoutMode.SCATTER) {
        x = (0.05 + rng() * 0.9) * w;
        y = (0.05 + rng() * 0.9) * h;
      } else if (layoutMode === LayoutMode.CIRCULAR) {
        const angle = (i / count) * Math.PI * 2;
        const r = Math.min(w, h) * (0.2 + rhythm * 0.2);
        x = centerX + Math.cos(angle) * r;
        y = centerY + Math.sin(angle) * r;
      } else if (layoutMode === LayoutMode.VORTEX) {
        const angle = i * 0.6;
        const r = (i / count) * (Math.min(w, h) * 0.45);
        x = centerX + Math.cos(angle) * r;
        y = centerY + Math.sin(angle) * r;
      }
      points.push({ x, y });

      const baseRadius = 15 + (rhythm * 110);
      ctx.save();

      // Style determination
      let currentStyle = visualStyle;
      if (visualStyle === VisualStyle.MIX) {
        if (lp.verbDensity > 0.25) currentStyle = VisualStyle.STARS;
        else if (lp.nounDensity > 0.4) currentStyle = VisualStyle.CIRCLES;
        else currentStyle = VisualStyle.PAINT;
      }

      // Draw Background Shadows/Mist
      if (lp.adjectiveDensity > 0.1 || currentStyle === VisualStyle.PAINT) {
        drawBlob(ctx, rng, x, y, baseRadius * 2, palette.glow, 0.2 + lp.adjectiveDensity);
      }

      if (currentStyle === VisualStyle.PAINT) {
        // Satellite Splatters
        const splatterCount = 5 + Math.floor(tension * 25);
        for (let sc = 0; sc < splatterCount; sc++) {
          const dist = baseRadius * (1.1 + rng() * tension * 4);
          const ang = rng() * Math.PI * 2;
          const sx = x + Math.cos(ang) * dist;
          const sy = y + Math.sin(ang) * dist;
          const sr = 1 + (rng() * baseRadius * 0.15);
          drawBlob(ctx, rng, sx, sy, sr, palette.splatter, 0.4);
        }
        drawBlob(ctx, rng, x, y, baseRadius, palette.primary, 0.7);
      } else if (currentStyle === VisualStyle.CIRCLES) {
        ctx.fillStyle = palette.primary;
        ctx.globalAlpha = 0.6;
        ctx.beginPath();
        ctx.arc(x, y, baseRadius, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = palette.luminous;
        ctx.lineWidth = 2;
        ctx.stroke();
        // Inner ring
        ctx.beginPath();
        ctx.arc(x, y, baseRadius * 0.5, 0, Math.PI * 2);
        ctx.stroke();
      } else if (currentStyle === VisualStyle.STARS) {
        const pointsCount = 4 + Math.floor(complexity * 10);
        drawStar(ctx, x, y, pointsCount, baseRadius, baseRadius * 0.4, palette.primary);
        ctx.globalAlpha = 0.4;
        drawStar(ctx, x, y, pointsCount, baseRadius * 1.2, baseRadius * 0.5, palette.luminous);
      }

      // Overlays
      if (moodScore > 0.7) {
        ctx.globalCompositeOperation = 'lighter';
        ctx.fillStyle = palette.luminous;
        ctx.globalAlpha = 0.4;
        ctx.beginPath();
        ctx.arc(x + (rng()-0.5)*10, y + (rng()-0.5)*10, baseRadius * 0.3, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalCompositeOperation = 'source-over';
      }

      // Dialogue Drips
      if (s.hasDialogue) {
        const dripWidth = 2 + rhythm * 8;
        const dripLength = 40 + rhythm * 250;
        const grad = ctx.createLinearGradient(x, y, x, y + dripLength);
        grad.addColorStop(0, palette.primary);
        grad.addColorStop(1, 'transparent');
        ctx.strokeStyle = grad;
        ctx.lineWidth = dripWidth;
        ctx.lineCap = 'round';
        ctx.globalAlpha = 0.5;
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x + (rng()-0.5)*10, y + dripLength);
        ctx.stroke();
      }

      // Tension shockwaves
      if (s.text.includes('!')) {
        ctx.strokeStyle = palette.accent;
        ctx.globalAlpha = 0.5;
        ctx.beginPath();
        ctx.arc(x, y, baseRadius * 1.5, 0, Math.PI * 2);
        ctx.stroke();
      }

      ctx.restore();
    }

    if (isPoster) {
      ctx.save();
      ctx.fillStyle = '#1e293b';
      ctx.font = 'italic bold 36px Playfair Display';
      ctx.fillText(sentences[0]?.text.substring(0, 45) + "...", 60, h - 110);
      ctx.font = '600 16px JetBrains Mono';
      ctx.fillStyle = '#64748b';
      ctx.fillText(`${analysis.summary.wordCount} WORDS // MODE: ${layoutMode.toUpperCase()} // STYLE: ${visualStyle.toUpperCase()}`, 60, h - 75);
      ctx.restore();
    }
  };

  useEffect(() => {
    draw();
  }, [analysis, difficulty, progress, width, height, layoutMode, visualStyle]);

  return (
    <div className="relative w-full h-full flex items-center justify-center overflow-hidden bg-[#fcfcfc] rounded-xl shadow-inner border border-slate-100">
      <canvas ref={canvasRef} id={id} className="max-w-full h-auto block" style={{ width: '100%' }} />
      {analysis.sentences.length === 0 && (
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none p-12 text-center">
          <p className="text-slate-300 font-serif italic text-3xl tracking-tight opacity-40">Your story awaits its symphony...</p>
        </div>
      )}
    </div>
  );
};

export default SymphonyCanvas;
