import { useCallback, useEffect, useRef, useState } from 'react';
import type { PointerEvent } from 'react';
import { Bone, Play, RotateCcw, Trophy } from 'lucide-react';
import confetti from 'canvas-confetti';
import getPublicAssetUrl from '../shared/getPublicAssetUrl';

type GameState = 'idle' | 'playing' | 'gameover';

interface FallingTreat {
  id: number;
  emoji: string;
  points: number;
  x: number;
  y: number;
  vy: number;
  rotation: number;
  vRot: number;
}

interface ScorePopup {
  x: number;
  y: number;
  text: string;
  alpha: number;
  vy: number;
}

const FOOD_ITEMS = [
  { emoji: '🦴', name: 'Bone', points: 10, color: '#FFFFFF' },
  { emoji: '🥓', name: 'Bacon', points: 15, color: '#F43F5E' },
  { emoji: '🧀', name: 'Cheese', points: 20, color: '#FBBF24' },
  { emoji: '🥩', name: 'Steak', points: 25, color: '#EF4444' },
  { emoji: '🍪', name: 'Biscuit', points: 15, color: '#F59E0B' },
];

export default function TreatPhysics() {
  const [gameState, setGameState] = useState<GameState>('idle');
  const [displayScore, setDisplayScore] = useState(0);
  const [highScore, setHighScore] = useState(() => {
    return parseInt(localStorage.getItem('luna_high_score_v2') || '0', 10);
  });
  const [combo, setCombo] = useState(0);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const animFrameRef = useRef<number | null>(null);
  const pixelRatioRef = useRef(1);
  
  // Game state stored in mutable refs to avoid React re-render lag during 60 FPS loop
  const gameStateRef = useRef<GameState>('idle');
  const scoreRef = useRef(0);
  const comboRef = useRef(0);
  const lunaXRef = useRef(200);
  const targetXRef = useRef(200);
  const treatsRef = useRef<FallingTreat[]>([]);
  const lastSpawnTimeRef = useRef(0);
  const mouthOpenRef = useRef(false);
  const mouthTimerRef = useRef(0);
  const popupsRef = useRef<ScorePopup[]>([]);

  // Preload Luna Transparent Images
  const imgSmileRef = useRef<HTMLImageElement | null>(null);
  const imgOpenMouthRef = useRef<HTMLImageElement | null>(null);

  useEffect(() => {
    const img1 = new Image();
    img1.src = getPublicAssetUrl('/images/luna_portrait_transparent.png?v=3');
    imgSmileRef.current = img1;

    const img2 = new Image();
    img2.src = getPublicAssetUrl('/images/luna_game_open_mouth_transparent.png?v=3');
    imgOpenMouthRef.current = img2;
  }, []);

  const triggerGameOver = useCallback(() => {
    setGameState('gameover');
    gameStateRef.current = 'gameover';
    
    if (scoreRef.current > highScore) {
      setHighScore(scoreRef.current);
      localStorage.setItem('luna_high_score_v2', String(scoreRef.current));
      confetti({
        particleCount: 45,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#09090B', '#71717A', '#D4D4D8', '#FFFFFF']
      });
    }
  }, [highScore]);

  const startGame = () => {
    const canvas = canvasRef.current;
    const width = canvas ? canvas.width / pixelRatioRef.current : 400;
    
    treatsRef.current = [];
    popupsRef.current = [];
    scoreRef.current = 0;
    comboRef.current = 0;
    setDisplayScore(0);
    setCombo(0);
    lunaXRef.current = width / 2;
    targetXRef.current = width / 2;
    mouthOpenRef.current = false;
    mouthTimerRef.current = 0;
    lastSpawnTimeRef.current = performance.now();
    
    setGameState('playing');
    gameStateRef.current = 'playing';
  };

  // High Performance 60 FPS HTML5 Canvas Loop
  useEffect(() => {
    if (gameState !== 'playing') return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    let lastTime = performance.now();

    const renderLoop = (time: number) => {
      if (gameStateRef.current !== 'playing') return;

      const dt = Math.min((time - lastTime) / 1000, 0.1);
      lastTime = time;

      const width = canvas.width / pixelRatioRef.current;
      const height = canvas.height / pixelRatioRef.current;

      // Smooth camera/luna follow cursor
      lunaXRef.current += (targetXRef.current - lunaXRef.current) * 0.28;
      const lunaX = lunaXRef.current;
      const lunaY = height - 95;

      // Spawn falling treats
      const spawnRate = Math.max(650, 1400 - scoreRef.current * 12);
      if (time - lastSpawnTimeRef.current > spawnRate) {
        lastSpawnTimeRef.current = time;
        const food = FOOD_ITEMS[Math.floor(Math.random() * FOOD_ITEMS.length)];
        treatsRef.current.push({
          id: Math.random(),
          emoji: food.emoji,
          points: food.points,
          x: Math.random() * (width - 80) + 40,
          y: -20,
          vy: 160 + Math.min(scoreRef.current * 4.5, 280), // speed increases
          rotation: Math.random() * Math.PI * 2,
          vRot: (Math.random() - 0.5) * 4
        });
      }

      // Check mouth anticipation: open mouth if any treat is approaching right above her
      let isAnticipating = false;
      let missedTreat = false;
      let activeTreatCount = 0;
      const treats = treatsRef.current;

      for (let index = 0; index < treats.length; index += 1) {
        const t = treats[index];
        t.y += t.vy * dt;
        t.rotation += t.vRot * dt;

        const dx = Math.abs(t.x - lunaX);
        const dy = lunaY - t.y;

        // Anticipate when treat is directly above her head within 140px
        if (dx < 50 && dy > 0 && dy < 140) {
          isAnticipating = true;
        }

        // Catch check: treat reaches Luna's mouth zone
        if (dy >= -10 && dy <= 50 && dx < 48) {
          // CAUGHT!
          scoreRef.current += t.points;
          comboRef.current += 1;
          setDisplayScore(scoreRef.current);
          setCombo(comboRef.current);

          mouthOpenRef.current = true;
          mouthTimerRef.current = 0.35; // stay open briefly

          // Add popups
          popupsRef.current.push({
            x: t.x,
            y: t.y,
            text: `+${t.points} NOM!`,
            alpha: 1.0,
            vy: -50
          });
          continue; // caught!
        }

        // Hit floor check
        if (t.y > height - 15) {
          missedTreat = true;
          break;
        }

        treats[activeTreatCount] = t;
        activeTreatCount += 1;
      }

      if (missedTreat) {
        triggerGameOver();
        return;
      }

      treats.length = activeTreatCount;

      // Mouth timer handling
      if (mouthTimerRef.current > 0) {
        mouthTimerRef.current -= dt;
      } else {
        mouthOpenRef.current = isAnticipating;
      }

      // Clear Canvas
      ctx.clearRect(0, 0, width, height);

      // Floor line
      ctx.beginPath();
      ctx.strokeStyle = '#E4E4E7';
      ctx.lineWidth = 2;
      ctx.moveTo(0, height - 10);
      ctx.lineTo(width, height - 10);
      ctx.stroke();

      // Render Falling Treats
      ctx.font = '34px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      for (const t of treats) {
        ctx.save();
        ctx.translate(t.x, t.y);
        ctx.rotate(t.rotation);
        ctx.fillText(t.emoji, 0, 0);
        ctx.restore();
      }

      // Render Popups (+points NOM!)
      ctx.font = 'bold 13px "JetBrains Mono", monospace';
      const popups = popupsRef.current;
      let activePopupCount = 0;
      for (let index = 0; index < popups.length; index += 1) {
        const p = popups[index];
        p.y += p.vy * dt;
        p.alpha -= dt * 1.5;
        if (p.alpha > 0) {
          ctx.save();
          ctx.fillStyle = `rgba(9, 9, 11, ${p.alpha})`;
          ctx.fillText(p.text, p.x, p.y);
          ctx.restore();
          popups[activePopupCount] = p;
          activePopupCount += 1;
        }
      }
      popups.length = activePopupCount;

      // Render Luna Avatar (Seamless Circle Frame with no rectangular cutout artifact)
      ctx.save();
      const currentImg = (mouthOpenRef.current && imgOpenMouthRef.current?.complete) 
        ? imgOpenMouthRef.current 
        : imgSmileRef.current;

      // Soft shadow under Luna
      ctx.beginPath();
      ctx.ellipse(lunaX, height - 12, 36, 8, 0, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(9, 9, 11, 0.08)';
      ctx.fill();

      // Draw Luna smoothly
      if (currentImg && currentImg.complete) {
        const drawW = 95;
        const drawH = 95;
        ctx.drawImage(currentImg, lunaX - drawW / 2, lunaY - drawH / 2 + 10, drawW, drawH);
      }

      // Draw active NOM indicator if catching
      if (mouthOpenRef.current) {
        ctx.font = 'bold 11px "JetBrains Mono", monospace';
        ctx.fillStyle = '#09090B';
        ctx.fillText('😋 NOM!', lunaX, lunaY - 45);
      }

      ctx.restore();

      animFrameRef.current = requestAnimationFrame(renderLoop);
    };

    animFrameRef.current = requestAnimationFrame(renderLoop);

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [gameState, triggerGameOver]);

  // Pointer / Touch tracking
  const updateTargetX = useCallback((clientX: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const relX = clientX - rect.left;
    const clampedX = Math.max(45, Math.min(relX, rect.width - 45));
    targetXRef.current = clampedX;
  }, []);

  const handlePointerMove = (e: PointerEvent<HTMLCanvasElement>) => {
    if (gameStateRef.current !== 'playing') return;
    updateTargetX(e.clientX);
  };

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: globalThis.KeyboardEvent) => {
      if (gameStateRef.current !== 'playing') return;
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        if (e.key.startsWith('Arrow')) e.preventDefault();
        targetXRef.current = Math.max(45, targetXRef.current - 35);
      } else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        if (e.key.startsWith('Arrow')) e.preventDefault();
        const canvas = canvasRef.current;
        const maxW = canvas ? canvas.getBoundingClientRect().width - 45 : 350;
        targetXRef.current = Math.min(maxW, targetXRef.current + 35);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Resize only when the arena changes size, keeping the canvas sharp on high-DPI screens.
  useEffect(() => {
    const handleResize = () => {
      const container = containerRef.current;
      const canvas = canvasRef.current;
      if (!container || !canvas) return;

      const dpr = window.devicePixelRatio || 1;
      const rect = container.getBoundingClientRect();
      pixelRatioRef.current = dpr;
      canvas.width = Math.round(rect.width * dpr);
      canvas.height = Math.round(rect.height * dpr);
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;

      const ctx = canvas.getContext('2d');
      ctx?.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    handleResize();
    const resizeObserver = new ResizeObserver(handleResize);
    if (containerRef.current) resizeObserver.observe(containerRef.current);
    return () => resizeObserver.disconnect();
  }, []);

  return (
    <section id="snacklab" className="py-20 sm:py-28 md:py-32 relative border-t border-zinc-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-12 space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-zinc-100 border border-zinc-200 text-zinc-800 text-xs font-mono uppercase tracking-widest">
            <Bone className="w-3.5 h-3.5 text-zinc-600" />
            Arcade Treat Catcher 60 FPS
          </div>

          <h2 className="font-display font-black text-3xl sm:text-5xl md:text-6xl text-zinc-950 tracking-tight">
            Catch Every Single Snack!
          </h2>

          <p className="text-zinc-600 text-sm sm:text-base md:text-lg font-normal leading-relaxed">
            Move Luna left and right to catch all falling food directly in her mouth. <strong>If any food hits the floor, it's Game Over!</strong>
          </p>
        </div>

        {/* Game Arena Container */}
        <div className="max-w-4xl mx-auto">
          <div className="relative rounded-[32px] sm:rounded-[36px] bg-white border border-zinc-200 shadow-xl overflow-hidden p-4 sm:p-8">
            
            {/* Top Score HUD */}
            <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-zinc-100 mb-4">
              <div className="flex items-center gap-5 sm:gap-6">
                <div>
                  <div className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest">Score</div>
                  <div className="font-display font-black text-3xl sm:text-4xl text-zinc-950">
                    {displayScore}
                  </div>
                </div>

                {combo > 1 && (
                  <div className="px-3 py-1 rounded-xl bg-zinc-100 border border-zinc-200 text-xs font-mono font-bold text-zinc-900 animate-pulse">
                    🔥 {combo}x COMBO!
                  </div>
                )}
              </div>

              <div className="flex items-center gap-4">
                <div className="text-right">
                  <div className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest flex items-center gap-1 justify-end">
                    <Trophy className="w-3 h-3 text-zinc-600" /> High Score
                  </div>
                  <div className="font-display font-bold text-xl sm:text-2xl text-zinc-800">
                    {highScore}
                  </div>
                </div>

                {gameState === 'playing' && (
                  <button
                    onClick={startGame}
                    className="p-2.5 rounded-xl bg-white hover:bg-zinc-50 border border-zinc-200 text-zinc-700 hover:text-zinc-950 transition-all cursor-pointer shadow-sm"
                    title="Restart Game"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Interactive HTML5 Canvas Arena */}
            <div 
              ref={containerRef}
              className="relative w-full h-[min(460px,64svh)] min-h-[320px] sm:h-[460px] rounded-2xl sm:rounded-3xl bg-zinc-50 border-2 border-zinc-200 overflow-hidden select-none touch-none"
            >
              <canvas
                ref={canvasRef}
                onPointerMove={handlePointerMove}
                onPointerDown={(event) => event.currentTarget.setPointerCapture(event.pointerId)}
                className="w-full h-full cursor-ew-resize block"
              />

              {/* START SCREEN OVERLAY */}
              {gameState === 'idle' && (
                <div className="absolute inset-0 bg-white/90 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center z-30 space-y-4">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-white border-2 border-zinc-300 shadow-md flex items-center justify-center text-3xl sm:text-4xl">
                    🐶
                  </div>

                  <div className="space-y-1">
                    <h3 className="font-display font-black text-2xl sm:text-4xl text-zinc-950">
                      Luna's Snack Catcher
                    </h3>
                    <p className="text-xs sm:text-sm text-zinc-600 max-w-sm font-normal">
                      Slide Luna left &amp; right using touch or mouse. Catch bones, bacon, and cheese in her mouth before they hit the floor!
                    </p>
                  </div>

                  <button
                    onClick={startGame}
                    className="px-7 sm:px-8 py-3.5 sm:py-4 rounded-2xl bg-white hover:bg-zinc-50 border-2 border-zinc-900 text-zinc-950 font-mono font-bold text-xs sm:text-sm tracking-wider uppercase flex items-center gap-2.5 shadow-lg hover:scale-105 active:scale-95 transition-all cursor-pointer"
                  >
                    <Play className="w-4 h-4 fill-zinc-950" />
                    <span>START GAME</span>
                  </button>
                </div>
              )}

              {/* GAME OVER SCREEN OVERLAY */}
              {gameState === 'gameover' && (
                <div className="absolute inset-0 bg-white/95 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center z-30 space-y-4">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-zinc-100 border border-zinc-300 shadow-sm flex items-center justify-center text-3xl sm:text-4xl">
                    🥺
                  </div>

                  <div className="space-y-1">
                    <div className="text-xs font-mono uppercase tracking-widest text-zinc-400 font-bold">
                      A SNACK HIT THE FLOOR!
                    </div>
                    <h3 className="font-display font-black text-3xl sm:text-4xl text-zinc-950">
                      GAME OVER
                    </h3>
                    <p className="text-sm text-zinc-600 font-normal">
                      Final Score: <strong className="text-zinc-950 font-black">{displayScore} pts</strong>
                      {displayScore >= highScore && displayScore > 0 && (
                        <span className="block text-xs font-mono font-bold text-zinc-900 mt-1">
                          🎉 NEW PERSONAL HIGH SCORE!
                        </span>
                      )}
                    </p>
                  </div>

                  <button
                    onClick={startGame}
                    className="px-7 sm:px-8 py-3.5 rounded-2xl bg-white hover:bg-zinc-50 border-2 border-zinc-900 text-zinc-950 font-mono font-bold text-xs tracking-wider uppercase flex items-center gap-2 shadow-md hover:scale-105 active:scale-95 transition-all cursor-pointer"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>PLAY AGAIN</span>
                  </button>
                </div>
              )}
            </div>

            {/* Bottom Controls Info */}
            <div className="mt-4 pt-3 border-t border-zinc-100 flex flex-wrap items-center justify-between text-xs font-mono text-zinc-500 gap-2">
              <div>
                🎮 Controls: Drag with finger, slide mouse, or use <strong>← / →</strong> keys
              </div>
              <div className="flex items-center gap-1.5 font-semibold text-zinc-700">
                <span>Mouth opens dynamically when snacks approach!</span>
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
