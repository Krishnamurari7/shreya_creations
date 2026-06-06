export default function PageShell({ children }) {
  return (
    <div className="relative z-10 w-full min-h-[50dvh] overflow-x-hidden bg-cream">
      <div className="grid-overlay" aria-hidden />
      <div className="pointer-events-none absolute -top-20 right-0 h-72 w-72 rounded-full bg-orange/8 blur-3xl" aria-hidden />
      <div className="pointer-events-none absolute top-1/3 -left-16 h-56 w-56 rounded-full bg-purple/6 blur-3xl" aria-hidden />
      {children}
    </div>
  );
}
