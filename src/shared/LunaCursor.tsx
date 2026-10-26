import { useEffect, useRef, useState } from 'react';
import getPublicAssetUrl from './getPublicAssetUrl';

export default function LunaCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const [isFinePointer, setIsFinePointer] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(pointer: fine)').matches
  );

  useEffect(() => {
    if (!isFinePointer) {
      if (window.matchMedia('(pointer: fine)').matches) setIsFinePointer(true);
      return;
    }

    const cursor = cursorRef.current;
    if (!cursor) return;

    const moveCursor = (event: PointerEvent) => {
      if (event.pointerType === 'touch') return;
      cursor.style.transform = `translate3d(${event.clientX}px, ${event.clientY}px, 0)`;
      cursor.classList.add('is-visible');
    };
    const hideCursor = () => cursor.classList.remove('is-visible');

    window.addEventListener('pointermove', moveCursor);
    window.addEventListener('pointerleave', hideCursor);
    return () => {
      window.removeEventListener('pointermove', moveCursor);
      window.removeEventListener('pointerleave', hideCursor);
    };
  }, [isFinePointer]);

  if (!isFinePointer) return null;

  return (
    <div ref={cursorRef} className="luna-cursor" aria-hidden="true">
      <img className="luna-cursor__head" src={getPublicAssetUrl('/images/luna_portrait_transparent.png')} alt="" draggable={false} />
      <img className="luna-cursor__expression" src={getPublicAssetUrl('/images/luna_game_open_mouth_transparent.png')} alt="" draggable={false} />
    </div>
  );
}
