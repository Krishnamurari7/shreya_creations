export default function PageShell({ children }) {
  return (
    <div className="relative z-10 w-full min-h-[50dvh] min-w-0 overflow-x-hidden">
      <div className="grid-overlay" aria-hidden />
      <div className="pointer-events-none absolute -top-20 right-0 h-72 w-72 rounded-full bg-orange/8 blur-3xl animate-glow-pulse" aria-hidden />
      <div className="pointer-events-none absolute top-1/3 -left-16 h-56 w-56 rounded-full bg-orange/6 blur-3xl animate-glow-pulse [animation-delay:-2s]" aria-hidden />
      <div className="pointer-events-none absolute bottom-1/4 right-1/3 h-40 w-40 rounded-full bg-lavender/10 blur-3xl float-soft" aria-hidden />
      {children}
    </div>
  );
}
