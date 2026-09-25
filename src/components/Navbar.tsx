import { useEffect, useState } from 'react';
import { Menu, X } from 'lucide-react';

const statuses = [
  { text: "PatrolOS 4.0: Gate perimeter secured", dot: "bg-zinc-800" },
  { text: "SuperSniff™: Scent tracking active", dot: "bg-zinc-600" },
  { text: "RoboVac 4.0: Floor crumb clearance ready", dot: "bg-zinc-700" },
  { text: "Mood Engine: 100% Cuddle Ready", dot: "bg-zinc-900" }
];
const STATUS_COUNT = statuses.length;

const navLinks = [
  { label: "Overview", href: "#overview" },
  { label: "SuperSniff™", href: "#supersniff" },
  { label: "AeroEars™", href: "#aeroears" },
  { label: "RoboVac", href: "#vacuum" },
  { label: "PatrolOS", href: "#patrolos" },
  { label: "Tech Specs", href: "#specs" },
  { label: "Gallery", href: "#gallery" }
];

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [statusIndex, setStatusIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setStatusIndex((prev) => (prev + 1) % STATUS_COUNT);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 py-2.5 sm:py-3 bg-white/70 backdrop-blur-lg border-b border-zinc-200/70 shadow-sm transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 flex items-center gap-2 sm:gap-4">
        {/* Brand */}
        <a href="#overview" className="flex shrink-0 items-center gap-2.5 sm:gap-3 group">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-white border border-zinc-300 flex items-center justify-center text-lg sm:text-xl text-zinc-900 shadow-sm group-hover:scale-105 group-hover:border-zinc-900 transition-all duration-300">
            🐾
          </div>
          <div>
            <div className="flex items-center gap-1.5 sm:gap-2">
              <span className="font-display font-bold text-base sm:text-xl tracking-tight text-zinc-950">
                LUNA
              </span>
              <span className="text-[9px] sm:text-[10px] font-mono font-semibold uppercase tracking-widest px-1.5 sm:px-2 py-0.5 rounded-full bg-zinc-100 text-zinc-800 border border-zinc-200">
                PRO 4.0
              </span>
            </div>
            <p className="text-[9px] sm:text-[10px] text-zinc-500 font-mono tracking-wide hidden sm:block">
              Black &amp; White Roan Edition
            </p>
          </div>
        </a>

        {/* Live Activity Status Pill */}
        <div className="hidden 2xl:flex max-w-[180px] shrink-0 items-center gap-2 px-3.5 py-1.5 rounded-full bg-zinc-50 border border-zinc-200 text-xs font-mono text-zinc-700 shadow-inner">
          <span className={`w-2 h-2 rounded-full ${statuses[statusIndex].dot} animate-pulse`} />
          <span className="truncate transition-all duration-500">
            {statuses[statusIndex].text}
          </span>
        </div>

        {/* Nav Links (Desktop) */}
        <nav aria-label="Main navigation" className="hidden xl:flex flex-1 items-center justify-center gap-2 2xl:gap-3 text-[10px] 2xl:text-[11px] font-mono tracking-wide uppercase text-zinc-600">
          {navLinks.map((link) => (
            <a 
              key={link.label}
              href={link.href}
              className="whitespace-nowrap hover:text-zinc-950 transition-colors py-1 relative group font-medium"
            >
              {link.label}
              <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-zinc-900 transition-all duration-300 group-hover:w-full" />
            </a>
          ))}
        </nav>

        {/* Mobile Navigation Controls */}
        <div className="ml-auto flex shrink-0 items-center gap-2 sm:gap-3">
          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen((open) => !open)}
            className="xl:hidden min-w-11 min-h-11 p-2.5 rounded-xl bg-white hover:bg-zinc-50 border border-zinc-200 text-zinc-800"
            aria-label="Toggle menu"
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-navigation"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <nav id="mobile-navigation" aria-label="Mobile navigation" className="xl:hidden mt-2 px-4 py-3 mx-3 sm:mx-4 rounded-2xl bg-white border border-zinc-200 shadow-xl flex flex-col gap-1.5 font-mono text-xs">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className="min-h-11 flex items-center px-3 py-2 rounded-xl text-zinc-700 hover:text-zinc-950 hover:bg-zinc-50 transition-colors"
            >
              {link.label}
            </a>
          ))}
        </nav>
      )}
    </header>
  );
}
