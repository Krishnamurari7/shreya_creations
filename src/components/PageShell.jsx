export default function PageShell({ children }) {
  return (
    <div className="relative z-10 w-full min-h-[50dvh] overflow-x-hidden bg-cream">
      <div className="grid-overlay" />
      {children}
    </div>
  );
}
