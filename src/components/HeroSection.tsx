export default function HeroSection() {
  return (
    <section 
      id="overview" 
      className="relative min-h-[calc(100svh-5rem)] flex flex-col justify-between items-center pt-28 pb-12 px-4 sm:px-6 lg:px-8 text-center select-none overflow-hidden"
    >
      {/* Main Content Centered Vertically */}
      <div className="my-auto max-w-4xl mx-auto space-y-5 sm:space-y-6 z-10">
        
        {/* Top Announcement Tag */}
        <div className="inline-flex max-w-full flex-wrap items-center justify-center gap-2 px-4 py-1.5 rounded-full bg-white text-zinc-900 border border-zinc-300 text-[10px] sm:text-xs font-mono tracking-wider uppercase leading-relaxed shadow-sm">
          <span className="w-2 h-2 rounded-full bg-zinc-900 animate-pulse" />
          <span>Introducing The Next-Gen Cocker Spaniel • Born Nov 5, 2021</span>
        </div>

        {/* Big Flagship Name */}
        <h1 className="font-display font-black text-[clamp(3.5rem,12vw,11rem)] tracking-tight text-zinc-950 leading-[0.9]">
          LUNA PRO<span className="text-zinc-400">.</span>
        </h1>

        {/* Tagline */}
        <p className="font-display text-[clamp(1.4rem,4.2vw,3rem)] text-zinc-800 font-bold max-w-3xl mx-auto leading-tight">
          Canine intelligence. <span className="text-zinc-950 underline decoration-zinc-300 decoration-4 underline-offset-8">Reimagined.</span>
        </p>

        {/* Description */}
        <p className="text-sm sm:text-lg md:text-xl max-w-2xl mx-auto font-normal leading-relaxed pt-1 sm:pt-2">
          Engineered with a silky black and white roan coat, dual high-gain AeroEars™, and a 300-million-sensor SuperSniff™ neural engine. Luna delivers unmatched cuddle fidelity and patio perimeter defense.
        </p>

      </div>
    </section>
  );
}
