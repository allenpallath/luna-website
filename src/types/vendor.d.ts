declare module 'canvas-confetti' {
  interface ConfettiOptions {
    particleCount?: number;
    spread?: number;
    origin?: { x?: number; y?: number };
    colors?: string[];
  }

  interface Confetti {
    (options?: ConfettiOptions): Promise<null>;
  }

  const confetti: Confetti;
  export default confetti;
}
