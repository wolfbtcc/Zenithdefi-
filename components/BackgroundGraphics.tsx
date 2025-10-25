
import React, { useEffect, useRef } from 'react';

const BackgroundGraphics: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const frameId = useRef<number>();

  useEffect(() => {
    const handleMove = (e: MouseEvent | TouchEvent) => {
      let x, y;
      if ('touches' in e) {
        if (e.touches.length === 0) return;
        x = e.touches[0].clientX;
        y = e.touches[0].clientY;
      } else {
        x = e.clientX;
        y = e.clientY;
      }

      if (frameId.current) {
        cancelAnimationFrame(frameId.current);
      }

      frameId.current = requestAnimationFrame(() => {
        if (containerRef.current) {
          const children = containerRef.current.children;
          for (let i = 0; i < children.length; i++) {
            const layer = children[i] as HTMLElement;
            const depth = parseFloat(layer.dataset.depth || '0');
            const moveX = (x - window.innerWidth / 2) * depth;
            const moveY = (y - window.innerHeight / 2) * depth;
            layer.style.transform = `translate3d(${moveX}px, ${moveY}px, 0)`;
          }
        }
      });
    };

    window.addEventListener('mousemove', handleMove);
    window.addEventListener('touchmove', handleMove);

    return () => {
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('touchmove', handleMove);
      if (frameId.current) {
        cancelAnimationFrame(frameId.current);
      }
    };
  }, []);

  return (
    <div ref={containerRef} className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
      {/* depth values determine speed and direction of movement */}
      <div
        data-depth="0.02"
        className="absolute top-[10%] left-[10%] w-16 h-16 rounded-full bg-orange-500/10 filter blur-xl"
      ></div>
      <div
        data-depth="-0.03"
        className="absolute top-[20%] right-[15%] w-24 h-0.5 bg-orange-500/30"
      ></div>
      <div
        data-depth="0.01"
        className="absolute top-[50%] left-[25%] w-1 h-1 rounded-full bg-white/50"
      ></div>
      <div
        data-depth="-0.015"
        className="absolute bottom-[20%] left-[5%] w-20 h-20 border border-gray-500/20 rounded-full"
      ></div>
      <div
        data-depth="0.03"
        className="absolute bottom-[10%] right-[10%] w-2 h-2 rounded-full bg-orange-400/50 filter blur-sm"
      ></div>
       <div
        data-depth="-0.025"
        className="absolute top-[70%] right-[30%] w-40 h-0.5 bg-gray-700/50"
      ></div>
      <div
        data-depth="0.04"
        className="absolute top-[80%] left-[40%] w-3 h-3 rounded-full bg-white/30"
      ></div>
       <div
        data-depth="-0.01"
        className="absolute top-[35%] left-[45%] w-24 h-24 rounded-full bg-white/5 filter blur-2xl"
      ></div>
    </div>
  );
};

export default BackgroundGraphics;
