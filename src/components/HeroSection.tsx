import getPublicAssetUrl from '../shared/getPublicAssetUrl';

export default function HeroSection() {
  return (
    <section
      id="overview"
      className="relative min-h-full flex flex-col justify-center items-center pt-24 sm:pt-28 pb-8 sm:pb-12 px-4 sm:px-6 lg:px-8 text-center select-none overflow-hidden"
    >
      {/* Subtle Background Pattern */}
      <div className="absolute inset-0 bg-luna-coat opacity-60 pointer-events-none" />

      {/* Main Content Centered Vertically */}
      <div className="max-w-4xl mx-auto space-y-4 sm:space-y-6 z-10">

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

        {/* Luna Portrait */}
        <div className="pt-2 sm:pt-4">
          <img
            src={getPublicAssetUrl('/images/luna_portrait_transparent.png')}
            alt="Luna — English Cocker Spaniel"
            className="w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 mx-auto rounded-full border-4 border-white shadow-xl object-cover"
          />
        </div>

        {/* Description */}
        <p className="text-sm sm:text-lg md:text-xl max-w-2xl mx-auto font-normal leading-relaxed">
          Engineered with a silky black and white roan coat, dual high-gain AeroEars™, and a 300-million-sensor SuperSniff™ neural engine. Luna delivers unmatched cuddle fidelity and patio perimeter defense.
        </p>

      </div>
    </section>
  );
}
