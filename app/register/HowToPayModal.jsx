import React from 'react';

// Ornate Corner SVG Frame Component
const CornerFlourish = ({ className = "" }) => (
  <svg 
    viewBox="0 0 60 60" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg" 
    className={`w-10 h-10 text-amber-500/80 pointer-events-none absolute ${className}`}
  >
    <path 
      d="M2 2H22C22 2 12 4 8 12C4 20 2 32 2 32V2Z" 
      fill="currentColor" 
      opacity="0.4"
    />
    <path 
      d="M2 2V25M2 2H25M2 2L18 18M5 5V18M5 5H18" 
      stroke="url(#gold-grad)" 
      strokeWidth="2" 
      strokeLinecap="round" 
    />
    <circle cx="5" cy="5" r="2" fill="#FEF08A" />
    <path d="M25 2C15 2 8 8 5 15" stroke="url(#gold-grad)" strokeWidth="1.5" />
    <defs>
      <linearGradient id="gold-grad" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#FEF08A" />
        <stop offset="50%" stopColor="#D97706" />
        <stop offset="100%" stopColor="#78350F" />
      </linearGradient>
    </defs>
  </svg>
);

// Custom Fantasy Icons
const PointerIcon = () => (
  <svg className="w-5 h-5 text-amber-300 drop-shadow-[0_0_6px_rgba(251,191,36,0.8)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777" />
  </svg>
);

const ScrollIcon = () => (
  <svg className="w-5 h-5 text-amber-300 drop-shadow-[0_0_6px_rgba(251,191,36,0.8)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
  </svg>
);

const CompassSearchIcon = () => (
  <svg className="w-5 h-5 text-amber-300 drop-shadow-[0_0_6px_rgba(251,191,36,0.8)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <circle cx="11" cy="11" r="7" strokeWidth="1.8" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M21 21l-4.35-4.35M11 8l1.5 3 3 1.5-3 1.5L11 17l-1.5-3-3-1.5 3-1.5L11 8z" />
  </svg>
);

const DownChevronIcon = () => (
  <svg className="w-5 h-5 text-amber-300 drop-shadow-[0_0_6px_rgba(251,191,36,0.8)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
  </svg>
);

export default function HowToPayModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn"
      onClick={onClose}
    >
      {/* Import Cinzel Font dynamically for authentic dark fantasy typography */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@500;700;900&display=swap');
        .font-cinzel { font-family: 'Cinzel', serif; }
      `}</style>

      {/* Main Container Frame */}
      <div 
        className="relative w-full max-w-2xl font-cinzel rounded-md border-2 border-amber-500/60 p-1 shadow-[0_0_50px_rgba(0,0,0,0.9),0_0_20px_rgba(217,119,6,0.25)] overflow-hidden transition-all max-h-[95vh] flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        {/* Double Metallic Rim */}
        <div className="relative rounded border border-amber-700/40 p-4 sm:p-10 overflow-y-auto bg-stone-950 flex-grow">
          
          {/* Background: Ashes to Ascension Split Texture */}
          <div 
            className="absolute inset-0 pointer-events-none opacity-90"
            style={{
              background: `
                radial-gradient(circle at 10% 20%, rgba(220, 38, 38, 0.15), transparent 40%),
                radial-gradient(circle at 90% 80%, rgba(245, 158, 11, 0.2), transparent 50%),
                linear-gradient(115deg, #0c0a09 0%, #1c1917 40%, #291d0e 75%, #453214 100%)
              `
            }}
          />

          {/* Ember / Particle Noise Overlay */}
          <div 
            className="absolute inset-0 opacity-15 mix-blend-color-dodge pointer-events-none" 
            style={{ 
              backgroundImage: "url('data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.8%22 numOctaves%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E')" 
            }} 
          />

          {/* Ornate Frame Corners */}
          <CornerFlourish className="top-2 left-2" />
          <CornerFlourish className="top-2 right-2 rotate-90" />
          <CornerFlourish className="bottom-2 left-2 -rotate-90" />
          <CornerFlourish className="bottom-2 right-2 rotate-180" />

          {/* Close Button */}
          <button 
            className="absolute top-3 right-3 sm:top-4 sm:right-4 z-20 w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center rounded border border-amber-600/40 bg-stone-900/80 text-amber-500 hover:text-amber-200 hover:border-amber-400 hover:bg-stone-800 transition-all shadow-md group"
            onClick={onClose}
            aria-label="Close Modal"
          >
            <span className="text-lg sm:text-xl font-bold leading-none transition-transform group-hover:scale-110">&times;</span>
          </button>
          
          {/* Header Title */}
          <div className="relative z-10 text-center mb-5 sm:mb-10 mt-2 sm:mt-0">
            <h2 className="text-2xl sm:text-4xl font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-b from-amber-100 via-amber-400 to-amber-700 drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)] uppercase">
              How To Pay
            </h2>
            {/* Title Underline Accent */}
            <div className="mx-auto mt-2 h-[2px] w-24 sm:w-32 bg-gradient-to-r from-transparent via-amber-500/80 to-transparent" />
          </div>
          
          {/* Instruction Steps */}
          <div className="relative z-10 space-y-3 sm:space-y-5 text-stone-200 text-xs sm:text-base tracking-wide">
            
            {/* Step 1 */}
            <div className="flex items-center gap-3 sm:gap-4 p-2 sm:p-2.5 rounded bg-stone-900/40 border border-amber-900/30 backdrop-blur-xs hover:border-amber-600/30 transition-colors">
              <div className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 rounded border border-amber-600/60 bg-gradient-to-b from-stone-800 to-stone-950 flex items-center justify-center shadow-[inset_0_1px_2px_rgba(255,255,255,0.1)]">
                <PointerIcon />
              </div>
              <p className="leading-snug">
                Click on <strong className="text-amber-300 font-bold drop-shadow-[0_0_8px_rgba(217,119,6,0.5)]">Pay Now</strong> button
              </p>
            </div>
            
            {/* Step 2 */}
            <div className="flex items-center gap-3 sm:gap-4 p-2 sm:p-2.5 rounded bg-stone-900/40 border border-amber-900/30 backdrop-blur-xs hover:border-amber-600/30 transition-colors">
              <div className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 rounded border border-amber-600/60 bg-gradient-to-b from-stone-800 to-stone-950 flex items-center justify-center shadow-[inset_0_1px_2px_rgba(255,255,255,0.1)]">
                <ScrollIcon />
              </div>
              <p className="leading-snug">
                Select <strong className="text-amber-300 font-bold drop-shadow-[0_0_8px_rgba(217,119,6,0.5)]">Education Institutes</strong>
              </p>
            </div>
            
            {/* Step 3 */}
            <div className="flex items-center gap-3 sm:gap-4 p-2 sm:p-2.5 rounded bg-stone-900/40 border border-amber-900/30 backdrop-blur-xs hover:border-amber-600/30 transition-colors">
              <div className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 rounded border border-amber-600/60 bg-gradient-to-b from-stone-800 to-stone-950 flex items-center justify-center shadow-[inset_0_1px_2px_rgba(255,255,255,0.1)]">
                <CompassSearchIcon />
              </div>
              <p className="leading-snug">
                Search for <strong className="text-amber-300 font-bold drop-shadow-[0_0_8px_rgba(217,119,6,0.5)]">Birla Institute of Science and Technology Goa</strong>
              </p>
            </div>
            
            {/* Step 4 */}
            <div className="flex items-center gap-3 sm:gap-4 p-2 sm:p-2.5 rounded bg-stone-900/40 border border-amber-900/30 backdrop-blur-xs hover:border-amber-600/30 transition-colors">
              <div className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 rounded border border-amber-600/60 bg-gradient-to-b from-stone-800 to-stone-950 flex items-center justify-center shadow-[inset_0_1px_2px_rgba(255,255,255,0.1)]">
                <DownChevronIcon />
              </div>
              <p className="leading-snug">
                In the dropdown list, select <strong className="text-amber-300 font-bold drop-shadow-[0_0_8px_rgba(217,119,6,0.5)]">Waves 2026</strong>
              </p>
            </div>

          </div>

          {/* Action Button Section */}
          <div className="relative z-10 mt-6 sm:mt-8 pt-4 flex justify-end border-t border-amber-900/30">
            <a 
              href="https://www.onlinesbi.sbi/sbicollect/icollecthome.htm" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="relative group inline-flex items-center justify-center px-6 py-2 sm:px-8 sm:py-3 rounded border border-red-900/80 bg-gradient-to-b from-neutral-900 via-stone-950 to-black text-amber-200 font-bold tracking-widest uppercase transition-all duration-300 shadow-[0_0_15px_rgba(185,28,28,0.4),inset_0_1px_2px_rgba(255,255,255,0.15)] hover:shadow-[0_0_25px_rgba(239,68,68,0.7),inset_0_1px_4px_rgba(255,255,255,0.3)] hover:border-red-600 hover:text-amber-100 active:scale-95"
            >
              {/* Button Outer Glow Effect */}
              <span className="absolute inset-0 rounded opacity-0 group-hover:opacity-100 transition-opacity bg-red-600/10 blur-sm" />
              <span className="relative z-10 text-sm sm:text-base drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                Pay Now
              </span>
            </a>
          </div>

        </div>
      </div>
    </div>
  );
}