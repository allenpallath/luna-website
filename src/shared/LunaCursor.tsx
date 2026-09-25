import { useEffect, useRef } from 'react';

export default function LunaCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
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
  }, []);

  return (
    <div ref={cursorRef} className="luna-cursor" aria-hidden="true">
      <img className="luna-cursor__head" src="/images/luna_portrait_transparent.png" alt="" draggable={false} />
      <img className="luna-cursor__expression" src="/images/luna_game_open_mouth_transparent.png" alt="" draggable={false} />
    </div>
  );
}
