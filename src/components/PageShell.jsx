export default function PageShell({ children }) {
  return (
    <div className="relative z-10 w-full overflow-x-hidden">
      <div className="grid-overlay" />
      {children}
    </div>
  );
}
