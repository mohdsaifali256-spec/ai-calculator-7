import { useEffect, useRef } from 'react';

interface ExternalAdScriptProps {
  src: string;
  className?: string;
  id?: string;
}

export function ExternalAdScript({ src, className, id }: ExternalAdScriptProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Clear previous script if any
    containerRef.current.innerHTML = '';

    const script = document.createElement('script');
    script.src = src;
    script.async = true;
    
    // Some ad networks need the script to be appended to the container
    containerRef.current.appendChild(script);

    return () => {
      // Optional cleanup
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
      }
    };
  }, [src]);

  return (
    <div 
      id={id}
      ref={containerRef} 
      className={`ad-container overflow-hidden flex justify-center items-center bg-white/5 border border-white/5 min-h-[50px] relative ${className}`}
    >
      <div className="absolute top-0 right-0 px-2 py-0.5 bg-black/50 text-[8px] font-bold text-white/30 uppercase tracking-widest z-10">
        AD
      </div>
    </div>
  );
}
