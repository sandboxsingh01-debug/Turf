export default function Loading() {
  return (
    <main
      aria-label="Loading Urban Turf"
      aria-live="polite"
      className="flex min-h-screen items-center justify-center bg-background px-6"
    >
      <div className="flex w-full max-w-xs flex-col items-center text-center">
        <div className="relative h-36 w-64" aria-hidden="true">
          <div className="absolute inset-x-8 bottom-4 h-px bg-border" />
          <svg
            className="football absolute left-10 top-12 size-12 text-primary"
            viewBox="0 0 64 64"
            fill="none"
            role="presentation"
          >
            <circle cx="32" cy="32" r="27" fill="currentColor" opacity="0.12" />
            <path d="M32 20l8 6-3 10h-10l-3-10 8-6Z" fill="currentColor" />
            <path d="m24 26-10 2m26-2 10 2M27 36l-5 10m15-10 5 10M32 20v-7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
            <circle cx="32" cy="32" r="27" stroke="currentColor" strokeWidth="2.5" />
          </svg>
          <svg
            className="bat absolute right-10 top-2 h-32 w-12 text-primary"
            viewBox="0 0 48 128"
            fill="none"
            role="presentation"
          >
            <path d="M22 4h6v18h-6z" fill="currentColor" />
            <path d="M19 21h12l5 78c.4 6-4.3 11-10.8 11h-.4c-6.5 0-11.2-5-10.8-11l5-78Z" fill="currentColor" opacity="0.9" />
            <path d="M18 29h14M16 39h18" stroke="currentColor" strokeWidth="2" opacity="0.35" />
            <path d="M15 104h18v8H15z" fill="currentColor" opacity="0.65" />
            <path d="M18 113h12v11H18z" fill="currentColor" />
          </svg>
        </div>
        <p className="font-heading text-2xl font-black uppercase tracking-[0.18em] text-foreground">Urban Turf</p>
        <p className="mt-2 text-xs font-bold uppercase tracking-[0.28em] text-muted-foreground">Play. Book. Repeat.</p>
        <div className="mt-8 flex items-center gap-2" role="status">
          <span className="sr-only">Loading</span>
          <span className="loading-dot size-1.5 rounded-full bg-primary" />
          <span className="loading-dot size-1.5 rounded-full bg-primary" />
          <span className="loading-dot size-1.5 rounded-full bg-primary" />
        </div>
      </div>
      <style>{`
        .football { animation: roll-in 1.3s cubic-bezier(.22,1,.36,1) both; }
        .bat { transform-origin: 24px 112px; animation: bat-swing 1.3s .45s cubic-bezier(.22,1,.36,1) both; }
        .loading-dot { animation: pulse 1s ease-in-out infinite; }
        .loading-dot:nth-child(2) { animation-delay: .15s; }
        .loading-dot:nth-child(3) { animation-delay: .3s; }
        @keyframes roll-in { from { opacity: 0; transform: translateX(-88px) rotate(-120deg); } to { opacity: 1; transform: translateX(0) rotate(0); } }
        @keyframes bat-swing { from { opacity: 0; transform: rotate(24deg) translateX(48px); } 55% { opacity: 1; transform: rotate(-18deg) translateX(0); } to { opacity: 1; transform: rotate(-10deg) translateX(0); } }
        @keyframes pulse { 0%, 100% { opacity: .25; transform: scale(.8); } 50% { opacity: 1; transform: scale(1.2); } }
        @media (prefers-reduced-motion: reduce) { .football, .bat, .loading-dot { animation: none; } .football { opacity: 1; } .bat { opacity: 1; transform: rotate(-10deg); } }
      `}</style>
    </main>
  )
}
