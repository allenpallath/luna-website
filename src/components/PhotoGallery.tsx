import { useState } from 'react';
import type { KeyboardEvent, MouseEvent } from 'react';
import { X, ZoomIn, Image as ImageIcon } from 'lucide-react';
import Button from '../shared/Button';
import Card from '../shared/Card';
import SectionHeader from '../shared/SectionHeader';
import getPublicAssetUrl from '../shared/getPublicAssetUrl';

type GalleryCategory = 'portrait' | 'stealth' | 'action';
type GalleryFilter = 'all' | GalleryCategory;

interface Artwork {
  id: number;
  title: string;
  category: GalleryCategory;
  src: string;
  tag: string;
  desc: string;
}

const ARTWORKS: Artwork[] = [
  {
    id: 1,
    title: "Luna Pro — Flagship Studio Portrait",
    category: 'portrait',
    src: getPublicAssetUrl('/images/luna_portrait.jpg'),
    tag: "Official Vector Art",
    desc: "Sitting proudly in full posture, showcasing her silky feathered ears, piebald roan muzzle spots, and tailored collar."
  },
  {
    id: 2,
    title: "The Stealth Door Peek",
    category: 'stealth',
    src: getPublicAssetUrl('/images/luna_peek.jpg'),
    tag: "Signature Move",
    desc: "Sub-millimeter door frame surveillance. One curious glossy eye and a floppy black ear monitoring the household."
  },
  {
    id: 3,
    title: "RoboVac™ Living Vacuum Cleaner",
    category: 'action',
    src: getPublicAssetUrl('/images/luna_vacuum.jpg'),
    tag: "Crumb Clearance",
    desc: "Autonomous dining room floor sentry sniffing out fallen biscuit crumbs with tail wagging excitement."
  },
  {
    id: 4,
    title: "Snack Catcher 'NOM' Mode",
    category: 'action',
    src: getPublicAssetUrl('/images/luna_game_open_mouth.jpg'),
    tag: "Catch Motion",
    desc: "Looking up with mouth open wide in anticipation, ready to intercept falling bones and bacon in mid-air."
  },
  {
    id: 5,
    title: "Supersonic Zoomies Mode",
    category: 'action',
    src: getPublicAssetUrl('/images/luna_zoomies.jpg'),
    tag: "High Velocity",
    desc: "Full propulsion activated! Ears flying upwards in the wind, big happy grin, and paws floating in mid-air."
  },
  {
    id: 6,
    title: "Luna — Chief Scent Detective",
    category: 'stealth',
    src: getPublicAssetUrl('/images/luna_sticker_detective.jpg'),
    tag: "Canine Badge",
    desc: "Equipped with her magnifying glass and olfactory sensor badge, investigating scent anomalies."
  },
  {
    id: 7,
    title: "Patio Gate Perimeter Guard",
    category: 'action',
    src: getPublicAssetUrl('/images/luna_sticker_guard.jpg'),
    tag: "Patrol Duty",
    desc: "Stationed beside her favorite garden plant pots, ensuring no delivery van reaches the door unannounced."
  },
  {
    id: 8,
    title: "Snack Sentry (Off-Duty)",
    category: 'portrait',
    src: getPublicAssetUrl('/images/luna_sleep.jpg'),
    tag: "Sleep Mode",
    desc: "Curled up peacefully on her cloud cushion. One ear remains slightly raised to catch any kitchen snack sounds."
  }
];

export default function PhotoGallery() {
  const [selectedImage, setSelectedImage] = useState<Artwork | null>(null);
  const [filter, setFilter] = useState<GalleryFilter>('all');

  const filteredArtworks = filter === 'all' 
    ? ARTWORKS
    : ARTWORKS.filter(a => a.category === filter);

  return (
    <section id="gallery" className="py-20 sm:py-28 md:py-32 relative border-t border-zinc-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <SectionHeader
          eyebrow={<><ImageIcon className="w-3.5 h-3.5 text-zinc-600" />Vector Artwork &amp; Sticker Collection</>}
          title="Luna in Illustration."
          description="A stylized vector art and die-cut sticker gallery capturing Luna's personality, signature door peeks, and zoomies."
        >
          {/* Filter White Buttons */}
          <div className="flex flex-wrap justify-center gap-2 pt-3">
            {([
              { label: 'All Illustrations', val: 'all' },
              { label: 'Portraits & Rest', val: 'portrait' },
              { label: 'Action & Patrol', val: 'action' },
              { label: 'Stealth & Scent', val: 'stealth' }
            ] satisfies { label: string; val: GalleryFilter }[]).map((t) => (
              <Button
                key={t.val}
                onClick={() => setFilter(t.val)}
                aria-pressed={filter === t.val}
                variant={filter === t.val ? 'selected' : 'secondary'}
                size="sm"
                className={`py-2 px-3.5 rounded-xl font-mono text-xs transition-all cursor-pointer ${
                  filter === t.val 
                    ? 'bg-white text-zinc-950 font-bold border-2 border-zinc-950 shadow-sm' 
                    : 'bg-white hover:bg-zinc-50 text-zinc-600 border border-zinc-200'
                }`}
              >
                {t.label}
              </Button>
            ))}
          </div>
        </SectionHeader>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 max-w-6xl mx-auto">
          {filteredArtworks.map((art) => (
            <Card
              key={art.id}
              role="button"
              tabIndex={0}
              aria-label={`View ${art.title}`}
              onClick={() => setSelectedImage(art)}
              onKeyDown={(event: KeyboardEvent<HTMLDivElement>) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault();
                  setSelectedImage(art);
                }
              }}
              variant="raised"
              className="p-4 rounded-3xl bg-white border border-zinc-200 shadow-sm hover:shadow-xl focus-visible:outline-2 focus-visible:outline-zinc-900 focus-visible:outline-offset-2 active:scale-[0.99] transition-all duration-300 cursor-pointer group flex flex-col justify-between"
            >
              {/* Illustration Frame */}
              <div className="relative aspect-square rounded-2xl overflow-hidden bg-zinc-50 border border-zinc-200 flex items-center justify-center p-3">
                <img 
                  src={art.src} 
                  alt={art.title}
                  className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
                />
                
                {/* Zoom Overlay Pill */}
                <div className="absolute inset-0 bg-white/40 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span className="px-3.5 py-1.5 rounded-full bg-white text-zinc-950 font-mono text-xs font-bold flex items-center gap-1.5 shadow-lg border border-zinc-200">
                    <ZoomIn className="w-3.5 h-3.5" /> Inspect Artwork
                  </span>
                </div>
              </div>

              {/* Caption */}
              <div className="mt-3 px-1 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded-md bg-zinc-100 text-zinc-700 font-mono text-[10px] uppercase font-semibold border border-zinc-200">
                    {art.tag}
                  </span>
                </div>
                <h4 className="font-display font-bold text-sm sm:text-base text-zinc-950 group-hover:text-zinc-700 transition-colors">
                  {art.title}
                </h4>
              </div>
            </Card>
          ))}
        </div>

      </div>

      {/* Lightbox Modal */}
      {selectedImage && (
        <div 
          onClick={() => setSelectedImage(null)}
          className="fixed inset-0 z-50 bg-zinc-950/60 backdrop-blur-md flex items-center justify-center p-4 sm:p-8"
        >
          <div 
            onClick={(e: MouseEvent<HTMLDivElement>) => e.stopPropagation()}
            className="relative max-h-[calc(100dvh-2rem)] max-w-2xl w-full overflow-y-auto rounded-[32px] bg-white border border-zinc-200 shadow-2xl"
          >
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white hover:bg-zinc-100 text-zinc-900 border border-zinc-200 flex items-center justify-center transition-all z-20 cursor-pointer shadow-sm"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="p-6 bg-zinc-50 flex items-center justify-center max-h-[60vh]">
              <img 
                src={selectedImage.src} 
                alt={selectedImage.title} 
                className="max-h-[50vh] w-auto object-contain"
              />
            </div>

            <div className="p-5 sm:p-8 space-y-2">
              <span className="px-2.5 py-0.5 rounded-full bg-zinc-100 text-zinc-800 font-mono text-[11px] font-bold uppercase border border-zinc-200">
                {selectedImage.tag}
              </span>
              <h3 className="font-display font-black text-xl sm:text-2xl text-zinc-950">
                {selectedImage.title}
              </h3>
              <p className="text-zinc-600 text-xs sm:text-sm font-normal leading-relaxed">
                {selectedImage.desc}
              </p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
