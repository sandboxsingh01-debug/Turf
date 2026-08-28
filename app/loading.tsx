function Football() {
  return (
    <svg viewBox="0 0 72 72" aria-hidden="true" className="loader-football h-16 w-16">
      <circle cx="36" cy="36" r="28" fill="var(--background)" stroke="var(--primary)" strokeWidth="2" />
      <path d="m36 23 8 6-3 10H31l-3-10 8-6Z" fill="var(--primary)" />
      <path d="m28 29-10 2m26-2 10 2M31 39l-5 10m15-10 5 10M36 23V13" stroke="var(--primary)" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  )
}

function CricketBat() {
  return (
    <svg viewBox="0 0 64 150" aria-hidden="true" className="loader-bat h-36 w-16">
      <path d="M27 6h10v23H27z" fill="var(--primary)" />
      <path d="M23 28h18l8 87c.7 8-5 14-16.5 14S15.8 123 16.5 115l6.5-87Z" fill="var(--secondary)" stroke="var(--primary)" strokeWidth="2" />
      <path d="M22 42h20M21 53h22M20 64h24" stroke="var(--primary)" strokeWidth="2" opacity=".35" />
      <path d="M18 116h28v10H18z" fill="var(--primary)" opacity=".75" />
      <path d="M25 127h14v16H25z" fill="var(--primary)" />
    </svg>
  )
}

function UrbanTurfMark() {
  return (
    <div className="loader-mark" aria-hidden="true">
      <svg viewBox="0 0 80 80" className="h-16 w-16" fill="none">
        <path d="M40 6 66 16v21c0 17-10 29-26 37C24 66 14 54 14 37V16L40 6Z" stroke="var(--primary)" strokeWidth="4" />
        <circle cx="34" cy="28" r="7" fill="var(--primary)" />
        <path d="M40 36c-9-7-19 1-16 12l4 11h8l-2-13 10 4 9 9 6-5-11-13c-2-3-5-4-8-5Z" fill="var(--primary)" />
        <circle cx="57" cy="51" r="6" fill="var(--primary)" />
      </svg>
      <span className="font-heading text-3xl font-black uppercase tracking-[0.12em] text-primary">Urban Turf</span>
    </div>
  )
}

export function UrbanTurfLoader() {
  return (
    <main aria-label="Loading Urban Turf" aria-live="polite" className="loader-screen flex min-h-screen items-center justify-center overflow-hidden bg-background px-6">
      <div className="flex w-full max-w-sm flex-col items-center text-center">
        <div className="loader-scene relative h-44 w-72" aria-hidden="true">
          <span className="loader-motion-line loader-motion-line-one" />
          <span className="loader-motion-line loader-motion-line-two" />
          <Football />
          <CricketBat />
        </div>
        <UrbanTurfMark />
        <p className="mt-2 text-sm font-bold uppercase tracking-[0.28em] text-foreground">Play. Book. Repeat.</p>
        <div className="mt-7 flex items-center gap-2" role="status">
          <span className="sr-only">Loading</span>
          <span className="loader-dot" />
          <span className="loader-dot" />
          <span className="loader-dot" />
        </div>
      </div>
      <style>{`
        .loader-scene { perspective: 600px; }
        .loader-football { position: absolute; left: 5.5rem; bottom: 1rem; animation: loader-roll 2.4s cubic-bezier(.22,1,.36,1) both; }
        .loader-bat { position: absolute; right: 4.5rem; top: .25rem; transform-origin: 32px 124px; animation: loader-swing 2.4s .55s cubic-bezier(.22,1,.36,1) both; }
        .loader-motion-line { position: absolute; right: 5.5rem; top: 7.5rem; width: 2.5rem; height: 2px; border-radius: 999px; background: var(--secondary); opacity: 0; animation: loader-impact 2.4s 1.45s ease-out both; }
        .loader-motion-line-two { top: 8.25rem; right: 4.75rem; width: 1.5rem; animation-delay: 1.52s; }
        .loader-mark { display: flex; flex-direction: column; align-items: center; gap: .25rem; opacity: 0; animation: loader-reveal .7s 1.65s ease-out forwards; }
        .loader-dot { width: .375rem; height: .375rem; border-radius: 999px; background: var(--primary); animation: loader-pulse 1s ease-in-out infinite; }
        .loader-dot:nth-child(2) { animation-delay: .15s; }
        .loader-dot:nth-child(3) { animation-delay: .3s; }
        @keyframes loader-roll { 0% { opacity: 0; transform: translateX(-13rem) rotate(-260deg); } 45% { opacity: 1; } 72% { transform: translateX(0) rotate(0); } 100% { transform: translateX(-2.5rem) rotate(-80deg); } }
        @keyframes loader-swing { 0%, 23% { opacity: 0; transform: translateX(5rem) rotate(25deg); } 42% { opacity: 1; transform: translateX(0) rotate(0); } 65% { transform: translateX(-1rem) rotate(-38deg); } 100% { opacity: 1; transform: translateX(0) rotate(-18deg); } }
        @keyframes loader-impact { 0%, 60% { opacity: 0; transform: translateX(0); } 68% { opacity: .8; transform: translateX(-1.25rem); } 78%, 100% { opacity: 0; transform: translateX(-2.5rem); } }
        @keyframes loader-reveal { from { opacity: 0; transform: translateY(.75rem) scale(.94); } to { opacity: 1; transform: translateY(0) scale(1); } }
        @keyframes loader-pulse { 0%, 100% { opacity: .25; transform: scale(.8); } 50% { opacity: 1; transform: scale(1.25); } }
        @media (prefers-reduced-motion: reduce) { .loader-football, .loader-bat, .loader-motion-line, .loader-mark, .loader-dot { animation: none; } .loader-football, .loader-bat, .loader-mark { opacity: 1; } .loader-football { transform: translateX(-2.5rem) rotate(-80deg); } .loader-bat { transform: rotate(-18deg); } }
      `}</style>
    </main>
  )
}

export default UrbanTurfLoader
