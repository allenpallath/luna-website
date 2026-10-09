import { useEffect, useRef, useState } from 'react';
import type { PointerEvent } from 'react';
import { Cpu, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';
import getPublicAssetUrl from '../shared/getPublicAssetUrl';

const BISCUITS = [
  { id: 'biscuit', name: 'Golden Honey Biscuit', icon: '🍪', x: 72, y: 32, note: 'Freshly baked crunch with sweet honey aroma.' },
  { id: 'cheese', name: 'Cheddar Crunch Bone', icon: '🧀', x: 28, y: 68, note: 'Sharp aged cheddar scent detectable up to 500m.' },
  { id: 'bacon', name: 'Smoked Bacon Cracker', icon: '🥓', x: 75, y: 75, note: 'Hickory smoked phenols driving instant nose twitch.' },
];

interface Position {
  x: number;
  y: number;
}

export default function SniffRadar() {
  const [activeBiscuitId, setActiveBiscuitId] = useState('biscuit');
  // Luna's sniffing position on radar (0-100%)
  const [lunaPos, setLunaPos] = useState<Position>({ x: 30, y: 30 });
  const hasCelebratedRef = useRef(false);
  const radarRef = useRef<HTMLDivElement>(null);
  const pendingPositionRef = useRef<Position | null>(null);
  const moveFrameRef = useRef<number>(0);

  useEffect(() => () => cancelAnimationFrame(moveFrameRef.current), []);

  const activeBiscuit = BISCUITS.find(b => b.id === activeBiscuitId) || BISCUITS[0];

  // Calculate distance between Luna's snout and the biscuit
  // Luna's snout is roughly at the front-left of the sprite
  const snoutX = lunaPos.x - 6;
  const snoutY = lunaPos.y + 2;

  const dx = snoutX - activeBiscuit.x;
  const dy = snoutY - activeBiscuit.y;
  const distance = Math.sqrt(dx * dx + dy * dy);

  // Meter calculation: closer distance = higher meter percentage
  // Max distance in 100x100 space is ~141. We set full range ~70
  const maxDist = 65;
  const rawPercent = Math.max(8, Math.min(100, Math.round(100 - (distance / maxDist) * 100)));
  const meterPercent = distance < 9 ? 100 : rawPercent;

  useEffect(() => {
    if (meterPercent === 100 && !hasCelebratedRef.current) {
      hasCelebratedRef.current = true;
      confetti({
        particleCount: 35,
        spread: 60,
        origin: { y: 0.5 },
        colors: ['#09090B', '#71717A', '#D4D4D8', '#FFFFFF']
      });
    } else if (meterPercent < 90) {
      hasCelebratedRef.current = false;
    }
  }, [activeBiscuitId, meterPercent]);

  // Scent status readout
  let statusText = "COLD • Searching for Crumb Trails";
  let statusBadge = "bg-zinc-100 text-zinc-600";
  if (meterPercent >= 35 && meterPercent < 70) {
    statusText = "WARM • Scent Molecules Detected";
    statusBadge = "bg-zinc-100 text-zinc-900 font-semibold";
  } else if (meterPercent >= 70 && meterPercent < 95) {
    statusText = "HOT • Nose Locked On Biscuit!";
    statusBadge = "bg-zinc-200 text-zinc-950 font-bold";
  } else if (meterPercent >= 95) {
    statusText = "🎉 100% TARGET ACQUIRED! BISCUIT FOUND!";
    statusBadge = "bg-zinc-950 text-white font-black";
  }

  // Mouse / Touch handler for moving Luna
  const handlePointerMove = (e: PointerEvent<HTMLDivElement>) => {
    if (!radarRef.current) return;
    const rect = radarRef.current.getBoundingClientRect();
    pendingPositionRef.current = {
      x: Math.max(12, Math.min(88, ((e.clientX - rect.left) / rect.width) * 100)),
      y: Math.max(12, Math.min(88, ((e.clientY - rect.top) / rect.height) * 100))
    };

    if (!moveFrameRef.current) {
      moveFrameRef.current = requestAnimationFrame(() => {
        if (pendingPositionRef.current) setLunaPos(pendingPositionRef.current);
        moveFrameRef.current = 0;
      });
    }
  };

  return (
    <section id="supersniff" className="py-20 sm:py-28 md:py-32 relative border-t border-zinc-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16 space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-zinc-100 border border-zinc-200 text-zinc-800 text-xs font-mono uppercase tracking-widest">
            <Cpu className="w-3.5 h-3.5 text-zinc-600" />
            SuperSniff™ 300M Sensor Array
          </div>

          <h2 className="font-display font-black text-3xl sm:text-5xl md:text-6xl text-zinc-950 tracking-tight">
            Canine Smell-O-Meter.
          </h2>

          <p className="text-zinc-600 text-sm sm:text-base md:text-lg font-normal leading-relaxed">
            Move sniffing Luna around the radar scope to track down her favorite snack. Watch the <strong>Smell-O-Meter</strong> hit 100% as her nose approaches the biscuit!
          </p>

          {/* Biscuit Switcher (All White Buttons) */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-3">
            {BISCUITS.map((b) => (
              <button
                key={b.id}
                onClick={() => {
                  setActiveBiscuitId(b.id);
                  hasCelebratedRef.current = false;
                }}
                aria-pressed={activeBiscuitId === b.id}
                className={`py-2 px-3.5 rounded-xl font-mono text-xs transition-all cursor-pointer flex items-center gap-2 ${
                  activeBiscuitId === b.id
                    ? 'bg-white text-zinc-950 font-bold border-2 border-zinc-950 shadow-sm'
                    : 'bg-white hover:bg-zinc-50 text-zinc-600 border border-zinc-200'
                }`}
              >
                <span>{b.icon}</span>
                <span>{b.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Interactive Radar Stage */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center max-w-6xl mx-auto">
          
          {/* Left: Interactive Radar Scope Arena */}
          <div className="lg:col-span-7 flex justify-center">
            <div 
              ref={radarRef}
              onPointerMove={handlePointerMove}
              className="relative w-full max-w-[480px] aspect-square rounded-[36px] bg-white border-2 border-zinc-200 shadow-xl overflow-hidden p-6 cursor-crosshair select-none touch-none"
            >
              {/* Radar Coat Background & Concentric Rings */}
              <div className="absolute inset-0 bg-luna-coat opacity-30 pointer-events-none" />

              <div className="absolute inset-8 rounded-full border border-zinc-200 pointer-events-none" />
              <div className="absolute inset-20 rounded-full border border-zinc-200/80 pointer-events-none" />
              <div className="absolute inset-32 rounded-full border border-dashed border-zinc-300 pointer-events-none" />

              {/* Scent Waves radiating from the Biscuit */}
              <div 
                className="absolute w-28 h-28 rounded-full border border-zinc-300 pointer-events-none animate-ping opacity-25"
                style={{
                  left: `${activeBiscuit.x}%`,
                  top: `${activeBiscuit.y}%`,
                  transform: 'translate(-50%, -50%)'
                }}
              />

              {/* Target Biscuit Stationed on Radar */}
              <div 
                className="absolute -translate-x-1/2 -translate-y-1/2 w-14 h-14 rounded-2xl bg-white border-2 border-zinc-900 flex flex-col items-center justify-center shadow-lg z-20 pointer-events-none"
                style={{ left: `${activeBiscuit.x}%`, top: `${activeBiscuit.y}%` }}
              >
                <span className="text-3xl filter drop-shadow-sm">{activeBiscuit.icon}</span>
                <span className="text-[8px] font-mono font-bold text-zinc-800 uppercase tracking-tighter -mt-1">
                  SNACK
                </span>
              </div>

              {/* Moveable Sniffing Luna Avatar (Transparent PNG, No Box) */}
              <div 
                className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-none z-30 transition-transform duration-75 ease-out"
                style={{
                  left: `${lunaPos.x}%`,
                  top: `${lunaPos.y}%`,
                }}
              >
                {/* Sniffing Luna Image */}
                <div className="relative w-28 sm:w-32 aspect-square flex items-center justify-center">
                  <img 
                    src={getPublicAssetUrl('/images/luna_sniffing_transparent.png?v=5')}
                    alt="Luna Sniffing" 
                    className={`w-full h-full object-contain filter drop-shadow-md transition-transform duration-100 ${
                      meterPercent === 100 ? 'scale-110' : 'scale-100'
                    }`}
                  />

                  {/* Active Sniff Wave Effect at Snout */}
                  <div className="absolute top-6 left-2 font-mono text-xs text-zinc-700 font-bold animate-pulse">
                    {meterPercent >= 90 ? '😋 NOM!' : '〰〰'}
                  </div>
                </div>

                {/* Sub-label under Luna */}
                <div className="text-center -mt-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-white/95 border border-zinc-200 shadow-sm text-[9px] font-mono font-bold text-zinc-800 uppercase tracking-wider whitespace-nowrap">
                    🐾 SNIFFING LUNA
                  </span>
                </div>
              </div>

              {/* Bottom Instructions HUD */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-3.5 py-1 rounded-full bg-white/95 border border-zinc-200 text-[10px] font-mono text-zinc-600 shadow-sm whitespace-nowrap pointer-events-none">
                MOVE LUNA TOWARDS THE BISCUIT
              </div>
            </div>
          </div>

          {/* Right: Dynamic Smell-O-Meter Dashboard */}
          <div className="lg:col-span-5">
            <div className="p-6 sm:p-8 rounded-3xl bg-white border border-zinc-200 shadow-lg space-y-6">
              
              <div className="flex items-center justify-between border-b border-zinc-100 pb-4">
                <div>
                  <div className="text-[10px] font-mono uppercase tracking-widest text-zinc-400">
                    Nasal Signal Telemetry
                  </div>
                  <h3 className="font-display font-bold text-2xl text-zinc-950 mt-0.5">
                    Smell-O-Meter
                  </h3>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-zinc-100 border border-zinc-200 flex items-center justify-center text-2xl">
                  👃
                </div>
              </div>

              {/* Big Prominent Smell-O-Meter Gauge */}
              <div className="space-y-3">
                <div className="flex items-baseline justify-between">
                  <span className="text-xs font-mono text-zinc-500 uppercase tracking-wider">
                    Scent Signal Level
                  </span>
                  <div className="flex items-baseline gap-1">
                    <span className="font-display font-black text-4xl sm:text-5xl text-zinc-950">
                      {meterPercent}
                    </span>
                    <span className="font-display font-bold text-2xl text-zinc-500">%</span>
                  </div>
                </div>

                {/* Meter Bar */}
                <div className="w-full h-4 rounded-full bg-zinc-100 p-0.5 border border-zinc-200 overflow-hidden">
                  <div 
                    className={`h-full rounded-full transition-all duration-100 ${
                      meterPercent === 100 
                        ? 'bg-zinc-950 animate-pulse' 
                        : 'bg-gradient-to-r from-zinc-600 to-zinc-900'
                    }`}
                    style={{ width: `${meterPercent}%` }}
                  />
                </div>

                {/* Dynamic Status Pill */}
                <div className={`px-3 py-1.5 rounded-xl border border-zinc-200 text-xs font-mono text-center tracking-wider transition-all ${statusBadge}`}>
                  {statusText}
                </div>
              </div>

              {/* Target Details */}
              <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200 space-y-2 text-xs">
                <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1 font-mono">
                  <span className="text-zinc-500">Selected Snack:</span>
                  <span className="text-zinc-900 font-bold">{activeBiscuit.name}</span>
                </div>
                <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1 font-mono">
                  <span className="text-zinc-500">Distance to Snack:</span>
                  <span className="text-zinc-900 font-semibold">
                    {meterPercent === 100 ? '0.0 cm (SNACKED!)' : `${(distance * 0.08).toFixed(1)} meters`}
                  </span>
                </div>
                <p className="text-zinc-600 font-normal leading-relaxed pt-2 border-t border-zinc-200">
                  {activeBiscuit.note}
                </p>
              </div>

              {/* Quick Sniff Button */}
              <div className="pt-1">
                <button
                  onClick={() => setLunaPos({ x: activeBiscuit.x + 4, y: activeBiscuit.y - 2 })}
                  className="w-full py-3 px-4 rounded-xl bg-white hover:bg-zinc-50 border border-zinc-300 hover:border-zinc-900 text-xs font-mono font-bold text-zinc-950 transition-all shadow-sm cursor-pointer flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-4 h-4 text-zinc-700" />
                  <span>Auto-Sniff Biscuit Direct Hit (100%)</span>
                </button>
              </div>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
