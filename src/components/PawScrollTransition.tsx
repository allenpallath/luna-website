import { useEffect, useRef } from 'react';
import type { ReactNode } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import getPublicAssetUrl from '../shared/getPublicAssetUrl';

gsap.registerPlugin(ScrollTrigger);

interface PawScrollTransitionProps {
  currentSection: ReactNode;
  nextSection: ReactNode;
}

export default function PawScrollTransition({ currentSection, nextSection }: PawScrollTransitionProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const topSheetRef = useRef<HTMLDivElement>(null);
  const underlayRef = useRef<HTMLDivElement>(null);
  const pawRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();
      const createTransition = (isMobile: boolean) => {
        const restingScaleY = isMobile ? 0.85 : 0.9;
        const restAtViewportBottom = () => {
          const pawHeight = pawRef.current?.offsetHeight ?? 0;
          return window.innerHeight - pawHeight * (1 + restingScaleY) / 2;
        };

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top top',
            end: isMobile ? '+=150%' : '+=170%',
            pin: true,
            scrub: 0.8,
            anticipatePin: 1,
            invalidateOnRefresh: true
          }
        });

        gsap.set(topSheetRef.current, {
          xPercent: 0,
          yPercent: 0,
          rotation: 0,
          transformOrigin: 'center top',
          zIndex: 20
        });

        gsap.set(underlayRef.current, {
          scale: isMobile ? 0.95 : 0.94,
          opacity: isMobile ? 0.9 : 0.88,
          zIndex: 10
        });

        gsap.set(pawRef.current, {
          y: () => window.innerHeight,
          xPercent: -50,
          rotation: 0,
          scale: isMobile ? 0.82 : 0.9,
          zIndex: 30
        });

        tl.to(pawRef.current, {
          y: restAtViewportBottom,
          rotation: 0,
          ease: 'none',
          duration: 0.3
        })
          .to(pawRef.current, {
            scaleY: isMobile ? 0.85 : 0.9,
            scaleX: isMobile ? 0.98 : 1.05,
            y: restAtViewportBottom,
            ease: 'none',
            duration: 0.12
          }, 0.3)
          .to(topSheetRef.current, {
            scale: 0.985,
            y: isMobile ? 15 : 20,
            boxShadow: isMobile
              ? '0 20px 40px -10px rgba(0,0,0,0.25)'
              : '0 30px 60px -15px rgba(0,0,0,0.3)',
            ease: 'none',
            duration: 0.12
          }, 0.3)
          .to(topSheetRef.current, {
            yPercent: 120,
            rotation: 0,
            scale: 0.94,
            ease: 'none',
            duration: 0.43
          }, 0.42)
          .to(pawRef.current, {
            y: () => window.innerHeight * 1.6,
            rotation: 0,
            ease: 'none',
            duration: 0.43
          }, 0.42)
          .to(underlayRef.current, {
            scale: 1.0,
            opacity: 1.0,
            ease: 'none',
            duration: 0.43
          }, 0.42)
          .to(pawRef.current, {
            y: () => window.innerHeight * 2,
            ease: 'none',
            duration: 0.15
          }, 0.85);

        return () => tl.kill();
      };

      mm.add('(min-width: 768px)', () => createTransition(false));
      mm.add('(max-width: 767px)', () => createTransition(true));
    }, containerRef);

    const hashNavigationFrame = window.location.hash
      ? requestAnimationFrame(() => {
          const targetId = decodeURIComponent(window.location.hash.slice(1));
          document.getElementById(targetId)?.scrollIntoView({
            block: 'start',
            behavior: 'instant'
          });
        })
      : 0;

    return () => {
      if (hashNavigationFrame) cancelAnimationFrame(hashNavigationFrame);
      ctx.revert();
    };
  }, []);

  return (
    <div ref={containerRef} className="paw-scroll-transition relative w-full min-h-screen overflow-hidden">
      <div ref={underlayRef} className="relative w-full will-change-transform">
        {nextSection}
      </div>

      <div
        ref={topSheetRef}
        className="paw-scroll-top-sheet absolute top-0 inset-x-0 w-full h-screen bg-luna-coat will-change-transform shadow-2xl border-b border-zinc-200"
      >
        {currentSection}
      </div>

      <div
        ref={pawRef}
        className="paw-scroll-actor absolute top-0 left-1/2 max-w-[80vw] pointer-events-none select-none will-change-transform"
        style={{ width: 'min(40vh, 520px)' }}
      >
        <img
          src={getPublicAssetUrl('/images/luna_paw_top_transparent.png?v=5')}
          alt="Luna's Paw Grabbing Page"
          className="block h-auto w-full object-contain filter drop-shadow-[0_-15px_30px_rgba(0,0,0,0.35)]"
        />
      </div>
    </div>
  );
}
