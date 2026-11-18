export default function Loading() {
  return (
    <div className="mx-auto max-w-7xl animate-pulse px-4 pt-12 sm:px-6" aria-busy="true" aria-label="Loading">
      <div className="mx-auto h-[460px] w-[min(78vw,440px)] bg-ink-soft sm:h-[520px]" />
      <div className="mx-auto mt-12 h-12 max-w-xl bg-ink-soft" />
      <div className="mt-16 grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-6">
        {Array.from({ length: 6 }, (_, i) => (
          <div key={i} className="aspect-video bg-ink-soft" />
        ))}
      </div>
    </div>
  );
}
