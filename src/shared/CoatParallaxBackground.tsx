import { useEffect, useRef } from 'react';

export default function CoatParallaxBackground() {
  const layerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const layer = layerRef.current;
    if (!layer) return;

    const parallaxFactor = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 0.22;
    let frameId = 0;
    const updateBackground = () => {
      if (frameId) return;

      frameId = window.requestAnimationFrame(() => {
        const heroEnd = window.innerHeight - 80;
        const fadeDistance = Math.max(180, window.innerHeight * 0.24);
        const progress = Math.min(1, Math.max(0, (window.scrollY - heroEnd) / fadeDistance));

        layer.style.opacity = String(progress);
        layer.style.backgroundPositionY = `${Math.round(window.scrollY * parallaxFactor)}px`;
        frameId = 0;
      });
    };

    updateBackground();
    window.addEventListener('scroll', updateBackground, { passive: true });
    window.addEventListener('resize', updateBackground);
    return () => {
      window.removeEventListener('scroll', updateBackground);
      window.removeEventListener('resize', updateBackground);
      window.cancelAnimationFrame(frameId);
    };
  }, []);

  return <div ref={layerRef} className="bg-luna-coat coat-parallax-background" aria-hidden="true" />;
}
