import { useState } from 'react';
import { Eye, CheckCircle2 } from 'lucide-react';
import getPublicAssetUrl from '../shared/getPublicAssetUrl';

export default function DoorPeekShowcase() {
  const [peekLevel, setPeekLevel] = useState(2);

  const peekModes = [
    {
      level: 1,
      title: "Ultra-Stealth Mode",
      doorGap: "2.5 cm",
      eyeExposure: "8%",
      acousticGain: "+12 dB",
      stealthScore: "99.9%",
      status: "Covert Surveillance Active",
      desc: "Only the tip of the floppy silky ear and a sliver of snout is exposed. Virtually undetectable to humans."
    },
    {
      level: 2,
      title: "Signature Peekaboo (Standard)",
      doorGap: "5.0 cm",
      eyeExposure: "24%",
      acousticGain: "+22 dB",
      stealthScore: "94.0%",
      status: "Optimal Curiosity Acquired",
      desc: "One high-gloss puppy eye and one feathered ear frame the door. The definitive Luna pose."
    },
    {
      level: 3,
      title: "Full Snack Investigation",
      doorGap: "12.0 cm",
      eyeExposure: "68%",
      acousticGain: "+34 dB",
      stealthScore: "42.0%",
      status: "Treat Alert Initiated",
      desc: "Snout fully breaches the threshold upon hearing cheese wrapper crinkles from the kitchen."
    }
  ];

  const currentMode = peekModes.find(m => m.level === peekLevel) || peekModes[1];

  return (
    <section id="aeroears" className="py-20 sm:py-28 md:py-32 relative border-t border-zinc-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16 space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-zinc-100 border border-zinc-200 text-zinc-800 text-xs font-mono uppercase tracking-widest">
            <Eye className="w-3.5 h-3.5 text-zinc-600" />
            AeroEars™ &amp; Optical Stealth Matrix
          </div>

          <h2 className="font-display font-black text-3xl sm:text-5xl md:text-6xl text-zinc-950 tracking-tight">
            Sub-Millimeter Door Surveillance.
          </h2>

          <p className="text-zinc-600 text-sm sm:text-base md:text-lg font-normal leading-relaxed">
            Designed to observe every family conversation, kitchen activity, and room transition without leaving the comfort of the bedroom floor.
          </p>
        </div>

        {/* Feature Interactive Showcase */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center max-w-6xl mx-auto">
          
          {/* Left: Interactive Peek Display Card (Clean White Aesthetic) */}
          <div className="lg:col-span-7">
            <div className="p-4 sm:p-8 rounded-[36px] bg-white text-zinc-950 shadow-xl border border-zinc-200 relative overflow-hidden">
              
              {/* HUD Header */}
              <div className="flex items-center justify-between border-b border-zinc-100 pb-4 mb-6">
                <div className="flex items-center gap-2 font-mono text-xs text-zinc-600">
                  <span className="w-2 h-2 rounded-full bg-zinc-900 animate-pulse" />
                  <span>DOORWAY_OPTICAL_CAM_01</span>
                </div>
                <div className="px-2.5 py-0.5 rounded-md bg-zinc-100 border border-zinc-200 text-[10px] font-mono text-zinc-800 font-semibold">
                  GAP: {currentMode.doorGap}
                </div>
              </div>

              {/* Illustration Frame */}
              <div className="relative aspect-square max-h-[380px] sm:max-h-[420px] mx-auto rounded-2xl overflow-hidden bg-zinc-50 border border-zinc-200 flex items-center justify-center p-3">
                <img 
                  src={getPublicAssetUrl('/images/luna_peek.jpg')}
                  alt="Luna peeking around wooden door illustration"
                  className="w-full h-full object-contain p-2 transition-all duration-500 hover:scale-105"
                />

                {/* HUD Targeting Box over eye */}
                <div className="absolute top-1/4 left-1/3 w-20 h-20 border border-zinc-400 rounded-lg pointer-events-none flex flex-col justify-between p-1">
                  <div className="flex justify-between text-[8px] font-mono text-zinc-600">
                    <span>+</span>
                    <span>+</span>
                  </div>
                  <div className="text-[8px] font-mono text-zinc-900 font-bold bg-white/90 px-1 rounded text-center border border-zinc-200">
                    EYE_LOCK: 100%
                  </div>
                  <div className="flex justify-between text-[8px] font-mono text-zinc-600">
                    <span>+</span>
                    <span>+</span>
                  </div>
                </div>

                {/* Live Caption Stamp */}
                <div className="absolute bottom-3 left-3 right-3 p-2.5 rounded-xl bg-white/95 backdrop-blur-md border border-zinc-200 text-[11px] font-mono flex items-center justify-between shadow-sm">
                  <span className="text-zinc-700 truncate">{currentMode.status}</span>
                  <span className="text-zinc-950 font-bold ml-2 shrink-0">STEALTH: {currentMode.stealthScore}</span>
                </div>
              </div>

              {/* White Button Slider Control for Door Gap */}
              <div className="mt-6 pt-4 border-t border-zinc-100 space-y-3">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-zinc-500">Simulate Door Threshold Gap:</span>
                  <span className="text-zinc-900 font-bold">{currentMode.doorGap}</span>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  {peekModes.map((m) => (
                    <button
                      key={m.level}
                      onClick={() => setPeekLevel(m.level)}
                      aria-pressed={peekLevel === m.level}
                      className={`py-2.5 rounded-xl text-xs font-mono transition-all cursor-pointer ${
                        peekLevel === m.level
                          ? 'bg-white text-zinc-950 font-bold border-2 border-zinc-950 shadow-sm'
                          : 'bg-white hover:bg-zinc-50 text-zinc-600 border border-zinc-200'
                      }`}
                    >
                      {['Stealth', 'Standard', 'Full Peek'][m.level - 1]}
                    </button>
                  ))}
                </div>
              </div>

            </div>
          </div>

          {/* Right: Technical Feature Breakdown */}
          <div className="lg:col-span-5 space-y-6">
            <div className="p-6 sm:p-8 rounded-3xl bg-white border border-zinc-200 shadow-lg space-y-6">
              <div>
                <span className="px-2.5 py-1 rounded-md bg-zinc-100 text-zinc-800 font-mono text-[10px] font-bold uppercase">
                  Optical Architecture
                </span>
                <h3 className="font-display font-bold text-2xl text-zinc-950 mt-2">
                  {currentMode.title}
                </h3>
                <p className="text-sm text-zinc-600 font-normal leading-relaxed mt-2">
                  {currentMode.desc}
                </p>
              </div>

              {/* Specs Breakdown Grid */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200">
                  <div className="text-[10px] font-mono text-zinc-400 uppercase">Eye Surface Exposed</div>
                  <div className="font-display font-bold text-xl text-zinc-950 mt-1">{currentMode.eyeExposure}</div>
                  <div className="text-[10px] font-mono text-zinc-500">Wide-angle lens</div>
                </div>

                <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200">
                  <div className="text-[10px] font-mono text-zinc-400 uppercase">Acoustic Reception</div>
                  <div className="font-display font-bold text-xl text-zinc-950 mt-1">{currentMode.acousticGain}</div>
                  <div className="text-[10px] font-mono text-zinc-500">Silky ear funneling</div>
                </div>
              </div>

              {/* Key Highlights */}
              <div className="space-y-3 pt-2 border-t border-zinc-100 text-xs text-zinc-600">
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-zinc-900 shrink-0 mt-0.5" />
                  <span><b>Zero Paw Noise:</b> Silent approach on marble and hardwood floors.</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-zinc-900 shrink-0 mt-0.5" />
                  <span><b>Instant Eye Contact:</b> Melts human hearts upon discovery within 0.05 seconds.</span>
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
