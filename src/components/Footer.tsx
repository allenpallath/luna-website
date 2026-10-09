import { useEffect, useState } from 'react';
import type { MouseEvent } from 'react';
import { Heart, ArrowUp } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function Footer() {
  const [boopCount, setBoopCount] = useState(0);
  const [daysUntilBirthday, setDaysUntilBirthday] = useState(0);

  useEffect(() => {
    const calcBirthday = () => {
      const now = new Date();
      let nextBirthday = new Date(now.getFullYear(), 10, 5); // Nov 5
      if (now > nextBirthday) {
        nextBirthday = new Date(now.getFullYear() + 1, 10, 5);
      }
      const diffMs = nextBirthday.getTime() - now.getTime();
      const days = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
      setDaysUntilBirthday(days);
    };
    calcBirthday();
  }, []);

  const handleBoop = (e: MouseEvent<HTMLButtonElement>) => {
    setBoopCount(c => c + 1);

    confetti({
      particleCount: 20,
      spread: 50,
      origin: {
        x: e.clientX / window.innerWidth,
        y: e.clientY / window.innerHeight
      },
      colors: ['#09090B', '#71717A', '#D4D4D8', '#FFFFFF']
    });
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative bg-zinc-50/90 backdrop-blur-sm text-zinc-600 py-16 border-t border-zinc-200 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-10 items-center border-b border-zinc-200 pb-12">
          
          {/* Brand */}
          <div className="space-y-2 text-center lg:text-left">
            <div className="flex items-center justify-center lg:justify-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-white border border-zinc-300 flex items-center justify-center text-lg text-zinc-900 shadow-sm">
                🐾
              </div>
              <span className="font-display font-black text-xl text-zinc-950 tracking-tight">
                LUNA PRO
              </span>
            </div>
            <p className="text-xs font-mono text-zinc-500">
              English Cocker Spaniel • Born Nov 5, 2021
            </p>
            <p className="text-xs text-zinc-500 font-normal">
              "Master of the sniff, sentinel of the patio gate, 100% good girl."
            </p>
          </div>

          {/* Interactive White Boop Button */}
          <div className="flex flex-col items-center justify-center space-y-2">
            <button
              onClick={handleBoop}
              className="px-6 py-3 rounded-2xl bg-white hover:bg-zinc-100 border-2 border-zinc-900 text-zinc-950 font-mono font-bold text-xs tracking-wider uppercase flex items-center gap-2 shadow-md hover:scale-105 active:scale-95 transition-all cursor-pointer group"
            >
              <Heart className="w-4 h-4 text-zinc-900 fill-zinc-900 group-hover:scale-125 transition-transform" />
              <span>Boop Luna's Nose</span>
              <span className="px-2 py-0.5 rounded-full bg-zinc-100 text-zinc-900 text-[11px] border border-zinc-200">
                {boopCount}
              </span>
            </button>
            <span className="text-[10px] font-mono text-zinc-500">
              Tap for digital love &amp; particle burst
            </span>
          </div>

          {/* Birthday Countdown & Back to top */}
          <div className="flex flex-col items-center lg:items-end space-y-3 text-center lg:text-right">
            <div className="p-3 rounded-2xl bg-white border border-zinc-200 inline-flex items-center gap-3 shadow-sm">
              <span className="text-xl">🎂</span>
              <div className="text-left">
                <div className="text-[10px] font-mono uppercase tracking-widest text-zinc-400">
                  Next Birthday: Nov 5th
                </div>
                <div className="font-display font-bold text-sm text-zinc-900">
                  {daysUntilBirthday} Days Away
                </div>
              </div>
            </div>

            <button
              onClick={scrollToTop}
              className="px-3.5 py-1.5 rounded-xl bg-white hover:bg-zinc-100 border border-zinc-200 text-xs font-mono text-zinc-700 transition-all cursor-pointer shadow-sm flex items-center gap-1.5"
            >
              <span>Back to Top</span>
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>

        {/* Bottom Credits */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs font-mono text-zinc-500 gap-4">
          <div>
            © {new Date().getFullYear()} Luna Pro. Crafted with love for Luna the Cocker Spaniel.
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-zinc-700" />
            <span>All hardware systems operational • Coat silky</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
