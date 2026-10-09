import { useEffect, useState } from 'react';
import { Cpu, Activity, Zap } from 'lucide-react';
import Card from '../shared/Card';
import SectionHeader from '../shared/SectionHeader';

const STATS = [
  { name: "SuperSniff™ Olfactory Precision", value: 100, badge: "100% Max Rating" },
  { name: "Patio Gate Perimeter Vigilance", value: 99.9, badge: "99.9% Impassable" },
  { name: "AeroEars™ Silky Cloud Softness", value: 100, badge: "Grade A Luxury" },
  { name: "Zoomies Velocity & Agility", value: 98, badge: "Supersonic" },
  { name: "Cuddle Affinity & Human Loyalty", value: 100, badge: "Infinite" }
];

const SPECS_GRID = [
  {
    category: "Vision & Optics",
    title: "Dual High-Gloss Eyes",
    spec: "Ultra-wide dynamic range, instant emotional appeal, optimized for doorway peekaboo."
  },
  {
    category: "Acoustic Hardware",
    title: "Twin AeroEars™",
    spec: "180° directional wave capture, silky feathered texture, tuned to cheese wrapper crinkles."
  },
  {
    category: "Olfactory Processor",
    title: "SuperSniff™ Neural Core",
    spec: "300 million scent receptors with real-time food crumb triangulation."
  },
  {
    category: "Chassis & Finish",
    title: "Piebald Roan Coating",
    spec: "Pristine white base with natural black spots, freckled muzzle, and wavy feathering."
  },
  {
    category: "Power Architecture",
    title: "All-Day Zoomies Battery",
    spec: "Powered by 100% unconditional love, belly rubs, and healthy protein biscuits."
  },
  {
    category: "Durability Rating",
    title: "IP68 Slobber Resistant",
    spec: "Certified against water splashes, muddy paws, and enthusiastic wet kisses."
  }
];

export default function LunaDossier() {
  const [liveAge, setLiveAge] = useState({ years: 4, months: 0, days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const birthdate = new Date('2021-11-05T00:00:00');
    const updateAge = () => {
      const now = new Date();
      let years = now.getFullYear() - birthdate.getFullYear();
      let months = now.getMonth() - birthdate.getMonth();
      let days = now.getDate() - birthdate.getDate();

      if (days < 0) {
        months--;
        const prevMonth = new Date(now.getFullYear(), now.getMonth(), 0);
        days += prevMonth.getDate();
      }
      if (months < 0) {
        years--;
        months += 12;
      }

      const hours = now.getHours();
      const minutes = now.getMinutes();
      const seconds = now.getSeconds();

      setLiveAge({ years, months, days, hours, minutes, seconds });
    };

    updateAge();
    const interval = setInterval(updateAge, 1000);
    return () => clearInterval(interval);
  }, []);

  const ageItems = [
    { label: 'Years', val: liveAge.years },
    { label: 'Months', val: liveAge.months },
    { label: 'Days', val: liveAge.days },
    { label: 'Hours', val: liveAge.hours },
    { label: 'Minutes', val: liveAge.minutes },
    { label: 'Seconds', val: liveAge.seconds }
  ];

  return (
    <section id="specs" className="py-20 sm:py-28 md:py-32 relative border-t border-zinc-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <SectionHeader
          eyebrow={<><Cpu className="w-3.5 h-3.5 text-zinc-600" />Technical Architecture &amp; Hardware Specs</>}
          title="Canine Specifications."
          description={<>Born on <strong className="text-zinc-950 font-semibold">November 5th, 2021</strong>. Luna combines four-eared acoustic precision with a silky piebald roan finish.</>}
        />

        {/* Live Age Micro-Ticker */}
        <div className="max-w-4xl mx-auto mb-16">
          <div className="text-center text-xs font-mono text-zinc-400 uppercase tracking-widest mb-3">
            Live Lifecycle Runtime Counter:
          </div>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
            {ageItems.map((item) => (
              <Card
                key={item.label}
                variant="subtle"
                className="p-4 rounded-2xl bg-white border border-zinc-200 shadow-sm text-center hover:border-zinc-400 transition-all"
              >
                <div className="font-display font-black text-3xl sm:text-4xl text-zinc-950 tracking-tight">
                  {String(item.val).padStart(2, '0')}
                </div>
                <div className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider mt-1">
                  {item.label}
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Specs Grid + Trait Meters */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start max-w-6xl mx-auto">
          
          {/* Left: Hardware Specs Matrix (Phone Spec Sheet Style) */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {SPECS_GRID.map((spec) => (
              <Card
                key={spec.title}
                variant="raised"
                className="p-6 rounded-3xl bg-white border border-zinc-200 shadow-sm hover:shadow-md transition-all space-y-2 flex flex-col justify-between"
              >
                <div>
                  <div className="text-[10px] font-mono text-zinc-500 uppercase font-bold tracking-wider">
                    {spec.category}
                  </div>
                  <h4 className="font-display font-bold text-lg text-zinc-950 mt-1">
                    {spec.title}
                  </h4>
                  <p className="text-xs text-zinc-600 font-normal leading-relaxed mt-2">
                    {spec.spec}
                  </p>
                </div>
              </Card>
            ))}
          </div>

          {/* Right: Trait Performance Sliders (Clean White Card) */}
          <div className="lg:col-span-5 p-6 sm:p-8 rounded-3xl bg-white text-zinc-950 shadow-xl border border-zinc-200 space-y-6">
            <div className="flex items-center justify-between border-b border-zinc-100 pb-4">
              <div>
                <h3 className="font-display font-bold text-xl text-zinc-950">
                  Performance Metrics
                </h3>
                <p className="text-[11px] font-mono text-zinc-500">
                  Canine Benchmark Index
                </p>
              </div>
              <div className="w-9 h-9 rounded-xl bg-zinc-100 border border-zinc-200 flex items-center justify-center text-zinc-700">
                <Activity className="w-5 h-5" />
              </div>
            </div>

            <div className="space-y-5">
              {STATS.map((stat) => (
                <div key={stat.name} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-zinc-700">{stat.name}</span>
                    <span className="text-zinc-950 font-bold">{stat.badge}</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-zinc-100 overflow-hidden border border-zinc-200">
                    <div 
                      className="h-full rounded-full bg-gradient-to-r from-zinc-900 to-zinc-600"
                      style={{ width: `${Math.min(100, stat.value)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200 text-xs font-mono text-zinc-600 flex items-center gap-2.5">
              <Zap className="w-4 h-4 text-zinc-900 shrink-0" />
              <span>All hardware modules running in peak performance. Zero bugs detected.</span>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
