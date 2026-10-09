import { useRef, useState } from 'react';
import type { MouseEvent } from 'react';
import { Sparkles, CheckCircle2 } from 'lucide-react';
import Button from '../shared/Button';
import useTimeoutQueue from '../shared/useTimeoutQueue';
import getPublicAssetUrl from '../shared/getPublicAssetUrl';

const CRUMB_EMOJIS = ['🍞', '🍪', '🧀', '🥨', '🥐'];

const COMPARISON = [
  { feature: "Power Source", luna: "100% Love & Snacks", dyson: "Lithium Battery", roomba: "Docking Station" },
  { feature: "Reaction Time", luna: "0.04 Seconds", dyson: "Manual Retrieval", roomba: "Scheduled Timer" },
  { feature: "Tail Wagging", luna: "Standard Supersonic", dyson: "None", roomba: "None" },
  { feature: "Cuddle Rating", luna: "Infinite 10/10", dyson: "0/10 (Painful)", roomba: "0/10 (Cold plastic)" },
  { feature: "Obstacle Avoidance", luna: "Slips Under Chairs", dyson: "Operator Dependent", roomba: "Gets Stuck On Rugs" }
];

interface Crumb {
  id: number | string;
  x: number;
  y: number;
  emoji: string;
}

interface Position {
  x: number;
  y: number;
}

export default function VacuumCleaner() {
  const [crumbs, setCrumbs] = useState<Crumb[]>([
    { id: 1, x: 25, y: 35, emoji: '🍞' },
    { id: 2, x: 65, y: 55, emoji: '🍪' },
    { id: 3, x: 45, y: 75, emoji: '🧀' },
    { id: 4, x: 80, y: 30, emoji: '🥨' }
  ]);
  const [cleanedCount, setCleanedCount] = useState(48);
  const [lunaTarget, setLunaTarget] = useState<Position>({ x: 50, y: 50 });
  const [isHoovering, setIsHoovering] = useState(false);
  const floorRef = useRef<HTMLDivElement>(null);
  const schedule = useTimeoutQueue();

  // Drop crumb on click
  const handleFloorClick = (e: MouseEvent<HTMLDivElement>) => {
    if (!floorRef.current || isHoovering) return;
    const rect = floorRef.current.getBoundingClientRect();
    const x = Math.max(8, Math.min(92, ((e.clientX - rect.left) / rect.width) * 100));
    const y = Math.max(8, Math.min(92, ((e.clientY - rect.top) / rect.height) * 100));

    const randomEmoji = CRUMB_EMOJIS[Math.floor(Math.random() * CRUMB_EMOJIS.length)];
    const newCrumb = {
      id: `${Date.now()}-${Math.random()}`,
      x,
      y,
      emoji: randomEmoji
    };

    setCrumbs(prev => [...prev, newCrumb]);
    setIsHoovering(true);

    schedule(() => {
      setLunaTarget({ x, y });

      schedule(() => {
        setCrumbs(current => current.filter(c => c.id !== newCrumb.id));
        setCleanedCount(c => c + 1);
        setIsHoovering(false);
      }, 700);
    }, 400);
  };

  // Vacuum All button
  const vacuumAllCrumbs = () => {
    if (crumbs.length === 0 || isHoovering) return;
    setIsHoovering(true);
    let delay = 0;

    crumbs.forEach((crumb) => {
      schedule(() => {
        setLunaTarget({ x: crumb.x, y: crumb.y });
      }, delay);

      schedule(() => {
        setCrumbs(current => current.filter(c => c.id !== crumb.id));
        setCleanedCount(c => c + 1);
      }, delay + 400);

      delay += 500;
    });

    schedule(() => {
      setIsHoovering(false);
    }, delay + 200);
  };

  return (
    <section id="vacuum" className="py-20 sm:py-28 md:py-32 relative border-t border-zinc-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16 space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-zinc-100 border border-zinc-200 text-zinc-800 text-xs font-mono uppercase tracking-widest">
            <Sparkles className="w-3.5 h-3.5 text-zinc-600" />
            RoboVac™ 4.0 Sub-Surface Floor Clearance
          </div>

          <h2 className="font-display font-black text-3xl sm:text-5xl md:text-6xl text-zinc-950 tracking-tight">
            The Living Vacuum Cleaner.
          </h2>

          <p className="text-zinc-600 text-sm sm:text-base md:text-lg font-normal leading-relaxed">
            Never sweep the kitchen floor again. Luna's precision crumb detection activates the moment a biscuit shatters on tile.
          </p>
        </div>

        {/* Interactive Floor Simulation Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center max-w-6xl mx-auto mb-16">
          
          {/* Left: Interactive Floor Tile Canvas */}
          <div className="lg:col-span-7">
            <div className="p-4 sm:p-6 rounded-[32px] sm:rounded-[36px] bg-white border border-zinc-200 shadow-xl space-y-4">
              
              <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
                <div className="flex items-center gap-2 text-xs font-mono text-zinc-600">
                  <span className="w-2 h-2 rounded-full bg-zinc-900 animate-pulse" />
                  <span className="font-bold">KITCHEN_TILE_ZONE • SENSOR_ACTIVE</span>
                </div>

                <div className="px-3 py-1 rounded-full bg-zinc-100 font-mono text-xs text-zinc-800 font-semibold border border-zinc-200">
                  CRUMBS DEVOURED: {cleanedCount}
                </div>
              </div>

              {/* Tiled Floor Surface for Tapping */}
              <div
                ref={floorRef}
                onClick={handleFloorClick}
                aria-disabled={isHoovering}
                className={`relative w-full h-[320px] sm:h-[380px] rounded-2xl bg-zinc-50 border-2 border-dashed border-zinc-300 overflow-hidden select-none ${isHoovering ? 'cursor-not-allowed' : 'cursor-pointer'}`}
              >
                {/* Floor Tile Grid Lines */}
                <div className="absolute inset-0 bg-luna-coat opacity-50 pointer-events-none" />

                {/* Crumb Elements */}
                {crumbs.map((c) => (
                  <div
                    key={c.id}
                    className="absolute -translate-x-1/2 -translate-y-1/2 text-2xl transition-all duration-200 pointer-events-none"
                    style={{ left: `${c.x}%`, top: `${c.y}%` }}
                  >
                    <span>{c.emoji}</span>
                    <div className="text-[8px] font-mono font-bold bg-white/90 border border-zinc-200 rounded px-1 -mt-1 text-center shadow-xs">
                      CRUMB
                    </div>
                  </div>
                ))}

                {/* Animated Luna Vacuum Avatar */}
                <div
                  className="absolute w-24 sm:w-28 h-auto pointer-events-none transition-all duration-500 ease-out z-20 flex flex-col items-center"
                  style={{
                    left: `${lunaTarget.x}%`,
                    top: `${lunaTarget.y}%`,
                    transform: `translate(-50%, -50%) ${isHoovering ? 'scale(1.1)' : 'scale(1.0)'}`
                  }}
                >
                  <img
                    src={getPublicAssetUrl('/images/luna_vacuum_transparent.png?v=3')}
                    alt="Luna Vacuuming Crumbs"
                    className="w-full h-auto object-contain filter drop-shadow-md select-none"
                  />
                  <div className="mt-1 px-2 py-0.5 rounded-full bg-white border border-zinc-300 text-[8px] font-mono font-bold text-zinc-900 shadow-sm whitespace-nowrap">
                    {isHoovering ? "⚡ HOOVERING!" : "🐾 PATROLLING FLOOR"}
                  </div>
                </div>

                {/* Prompt Overlay */}
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-white/95 border border-zinc-200 text-[10px] font-mono text-zinc-600 shadow-sm whitespace-nowrap pointer-events-none">
                  TAP ANYWHERE ON FLOOR TO DROP CRUMBS
                </div>
              </div>

              {/* Bottom Buttons */}
              <div className="flex items-center justify-between pt-1">
                <span className="text-xs font-mono text-zinc-500">
                  Crumbs on floor: <strong className="text-zinc-950">{crumbs.length}</strong>
                </span>

                <Button
                  onClick={vacuumAllCrumbs}
                  disabled={crumbs.length === 0 || isHoovering}
                  variant="secondary"
                  size="sm"
                  className="px-4 py-2 rounded-xl bg-white hover:bg-zinc-50 border border-zinc-300 hover:border-zinc-900 text-zinc-950 font-mono font-semibold text-xs tracking-wider transition-all shadow-sm cursor-pointer disabled:opacity-40"
                >
                  Vacuum All Crumbs 🧹
                </Button>
              </div>

            </div>
          </div>

          {/* Right: Feature Highlights */}
          <div className="lg:col-span-5 space-y-6">
            <div className="p-6 sm:p-8 rounded-3xl bg-white border border-zinc-200 shadow-lg space-y-5">
              
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-400 font-bold">
                  Canine Engineering
                </span>
                <h3 className="font-display font-bold text-2xl text-zinc-950 mt-1">
                  Autonomous Crumb Interceptor
                </h3>
                <p className="text-xs sm:text-sm text-zinc-600 font-normal leading-relaxed mt-2">
                  No cords, zero battery recharge downtime, and self-cleaning snout technology. Luna actively calculates ballistic trajectories of dropped dining table food.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-1">
                <div className="p-3.5 rounded-2xl bg-zinc-50 border border-zinc-200">
                  <div className="text-[10px] font-mono text-zinc-400 uppercase">Electricity Draw</div>
                  <div className="font-display font-bold text-lg text-zinc-950 mt-0.5">0.0 Watts</div>
                  <div className="text-[10px] font-mono text-zinc-500">100% Eco Friendly</div>
                </div>

                <div className="p-3.5 rounded-2xl bg-zinc-50 border border-zinc-200">
                  <div className="text-[10px] font-mono text-zinc-400 uppercase">Suction Latency</div>
                  <div className="font-display font-bold text-lg text-zinc-950 mt-0.5">&lt; 0.05s</div>
                  <div className="text-[10px] font-mono text-zinc-500">Sub-second response</div>
                </div>
              </div>

              <div className="space-y-2.5 pt-2 border-t border-zinc-100 text-xs text-zinc-600">
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-zinc-900 shrink-0 mt-0.5" />
                  <span><b>Auto-Docking Feature:</b> Returns to living room rug when all crumbs are cleared.</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-zinc-900 shrink-0 mt-0.5" />
                  <span><b>Zero Bag Replacement:</b> Directly converts toast crumbs into tail wag propulsion.</span>
                </div>
              </div>

            </div>
          </div>

        </div>

        {/* Hardware Comparison Table: Luna Pro vs Dyson vs Roomba */}
        <div className="max-w-5xl mx-auto">
          <div className="p-5 sm:p-8 rounded-3xl bg-white border border-zinc-200 shadow-lg overflow-x-auto">
            <h3 className="font-display font-bold text-xl text-zinc-950 mb-1">
              Flagship Vacuum Benchmark Analysis
            </h3>
            <p className="text-xs font-mono text-zinc-500 mb-6">
              Independent floor clearance testing protocol
            </p>

            <table className="w-full text-left text-xs font-mono min-w-[500px]">
              <thead>
                <tr className="border-b border-zinc-200 text-zinc-400 uppercase tracking-wider">
                  <th className="pb-3 font-medium">Metric</th>
                  <th className="pb-3 font-bold text-zinc-950">🐾 Luna Pro</th>
                  <th className="pb-3 font-medium text-zinc-600">Dyson V15</th>
                  <th className="pb-3 font-medium text-zinc-600">Roomba j7</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {COMPARISON.map((row) => (
                  <tr key={row.feature} className="hover:bg-zinc-50/60 transition-colors">
                    <td className="py-3.5 font-semibold text-zinc-800">{row.feature}</td>
                    <td className="py-3.5 font-bold text-zinc-950 bg-zinc-50/50 px-2 rounded-lg">{row.luna}</td>
                    <td className="py-3.5 text-zinc-500">{row.dyson}</td>
                    <td className="py-3.5 text-zinc-500">{row.roomba}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </section>
  );
}
