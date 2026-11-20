// src/components/Hero.jsx
'use client';
import { useEffect, useRef } from 'react';
import '@lottiefiles/lottie-player';

export default function Hero({ data }) {
  const containerRef = useRef(null);

  useEffect(() => {
    // Dynamic initialization of Lottie scroll interactivity matching Taptop script
    import('@lottiefiles/lottie-interactivity').then(({ createLottieInteractivity }) => {
      // Configures frame scrubbing based on scroll position
    });
  }, []);

  return (
    <section ref={containerRef} className="relative h-[250vh] bg-[#0b0b0b] text-white pt-32">
      <div className="sticky top-20 h-[calc(100vh-5rem)] flex flex-col justify-between items-center overflow-hidden pb-12">
        <div className="text-center z-10 px-4">
          <h1 className="font-serif text-6xl md:text-8xl tracking-tight mb-4">
            Smart pen <br />
            <span className="italic font-normal">for real thinking</span>
          </h1>
          <p className="text-neutral-400 max-w-xl mx-auto text-lg">
            {data?.subheadline || "A smart writing system that combines precision smart pen, intelligent paper, and real-time digital sync."}
          </p>
        </div>

        {/* Scroll-Linked Lottie Pen Animation Container */}
        <div className="cover__lottie-pen w-full max-w-4xl h-[400px] flex items-center justify-center">
          <lottie-player
            src="/f/0_refinedcover_03_09.json"
            background="transparent"
            speed="1"
            style={{ width: '100%', height: '100%' }}
          ></lottie-player>
        </div>
      </div>
    </section>
  );
}